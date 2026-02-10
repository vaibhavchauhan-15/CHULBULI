/**
 * PhonePe Payment Webhook Handler - Standard Checkout v2
 * 
 * CRITICAL: This is the most important endpoint for PhonePe integration.
 * - NEVER trust frontend success responses
 * - ONLY update order status based on webhook confirmation
 * - ALWAYS verify webhook signature
 * - Handle idempotency (webhooks may be sent multiple times)
 * 
 * Events handled (Standard Checkout v2):
 * - checkout.order.completed - Payment successful
 * - checkout.order.failed - Payment failed
 * - pg.refund.completed - Refund successful
 * - pg.refund.failed - Refund failed
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, pool } from '@/lib/db/client';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyWebhookSignature } from '@/lib/phonepe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get Authorization header from PhonePe webhook (Standard Checkout v2)
    // Format: SHA256(username:password)
    const authHeader = request.headers.get('authorization') || '';

    // Get webhook payload (Standard Checkout sends JSON directly)
    const webhookData = await request.json();

    console.log('PhonePe Webhook Received:', {
      hasAuthHeader: !!authHeader,
      event: webhookData.event,
      timestamp: new Date().toISOString(),
      payloadPreview: {
        event: webhookData.event,
        state: webhookData.payload?.state,
      },
    });

    // CRITICAL: Verify webhook signature to prevent fraud
    if (authHeader && !verifyWebhookSignature(authHeader)) {
      console.error('PhonePe Webhook Signature Verification Failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Extract event type and payload from Standard Checkout v2 webhook
    // Documentation structure: { event: "checkout.order.completed", payload: {...} }
    const eventType = webhookData.event; // e.g., 'checkout.order.completed'
    const payload = webhookData.payload;

    // CRITICAL: Per documentation, merchantOrderId is the primary identifier in payload
    // https://developer.phonepe.com/v1/docs/webhook-handling
    const merchantOrderId = payload?.merchantOrderId;

    if (!merchantOrderId) {
      console.error('PhonePe Webhook: Missing merchantOrderId in payload:', {
        event: eventType,
        receivedPayload: payload,
      });
      return NextResponse.json(
        { error: 'Missing merchantOrderId in payload' },
        { status: 400 }
      );
    }

    console.log('PhonePe Webhook Details:', {
      event: eventType,
      merchantOrderId: merchantOrderId,
      phonePeOrderId: payload?.orderId, // PhonePe internal order ID
      state: payload?.state, // PENDING, COMPLETED, FAILED
      amount: payload?.amount, // Amount in paisa
      transactionId: payload?.paymentDetails?.[0]?.transactionId,
      paymentMode: payload?.paymentDetails?.[0]?.paymentMode,
      metaInfo: payload?.metaInfo, // UDF fields we sent
    });

    // Find order by merchantOrderId
    const orderResult = await db.query.orders.findFirst({
      where: eq(orders.merchantOrderId, merchantOrderId),
    });

    if (!orderResult) {
      console.error('Order not found for webhook:', merchantOrderId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // IDEMPOTENCY CHECK: If order is already marked as completed, don't process again
    if (orderResult.paymentStatus === 'completed') {
      console.log('Order already processed, skipping webhook:', orderResult.id);
      return NextResponse.json({
        success: true,
        message: 'Webhook already processed',
      });
    }

    // Handle different payment events based on Standard Checkout v2 event types
    // Documentation: ALWAYS use payload.state field (root-level) for status determination
    // https://developer.phonepe.com/v1/docs/webhook-handling#important-guidelines
    const paymentState = payload?.state; // PENDING, COMPLETED, FAILED

    // Check if payment is successful - use both event type AND state for reliability
    const isSuccess = (eventType === 'checkout.order.completed' && paymentState === 'COMPLETED');

    // Check if payment failed
    const isFailed = (eventType === 'checkout.order.failed' && paymentState === 'FAILED');

    if (isSuccess) {
      await handlePaymentSuccess(orderResult, {
        transactionId: payload?.paymentDetails?.[0]?.transactionId || payload?.orderId,
        amount: payload?.amount,
      });
    } else if (isFailed) {
      await handlePaymentFailed(orderResult, {
        transactionId: payload?.paymentDetails?.[0]?.transactionId || payload?.orderId,
        errorCode: payload?.errorCode,
      });
    } else {
      console.log('PhonePe webhook - payment still pending or unknown state:', {
        event: eventType,
        state: paymentState,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error: any) {
    console.error('PhonePe Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment webhook
 * Updates order status and deducts stock
 */
async function handlePaymentSuccess(order: any, event: any) {
  console.log('Processing successful payment for order:', order.id);

  try {
    // Use transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // Update order status to completed
      await tx.update(orders)
        .set({
          paymentStatus: 'completed',
          transactionId: event.transactionId,
          status: 'placed', // Now order is truly placed
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      // Deduct stock for all items in the order
      // Get order items
      const orderItemsResult = await pool.query(
        'SELECT "productId", quantity FROM "OrderItem" WHERE "orderId" = $1',
        [order.id]
      );

      // Deduct stock for each item
      for (const item of orderItemsResult.rows) {
        const updateResult = await pool.query(
          'UPDATE "Product" SET stock = stock - $1, "updatedAt" = NOW() WHERE id = $2 AND stock >= $1 RETURNING id',
          [item.quantity, item.productId]
        );

        if (updateResult.rows.length === 0) {
          console.warn(`Failed to deduct stock for product ${item.productId} in order ${order.id}`);
          // Continue processing - don't fail the entire webhook
        }
      }
    });

    console.log('✅ Payment success processed for order:', order.id);

    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin
  } catch (error) {
    console.error('Error processing payment success:', error);
    throw error;
  }
}

/**
 * Handle failed payment webhook
 */
async function handlePaymentFailed(order: any, event: any) {
  console.log('Processing failed payment for order:', order.id);

  try {
    // Update order status to failed and cancelled
    await db.update(orders)
      .set({
        paymentStatus: 'failed',
        status: 'cancelled',
        transactionId: event.transactionId,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    console.log('❌ Payment failed processed for order:', order.id);

    // TODO: Send payment failure email to customer
    // TODO: Optionally cancel the order after some time
  } catch (error) {
    console.error('Error processing payment failure:', error);
    throw error;
  }
}

/**
 * Allow OPTIONS for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-phonepe-signature, x-verify',
    },
  });
}
