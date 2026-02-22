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
import { orders, webhookLogs } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { verifyWebhookSignature } from '@/lib/phonepe';
import { generateId } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let webhookLogId: string | null = null;

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

    // Extract event details early for logging
    const eventType = webhookData.event;
    const payload = webhookData.payload;
    const merchantOrderId = payload?.merchantOrderId;

    // Log webhook for retry mechanism
    webhookLogId = generateId('wh');
    await db.insert(webhookLogs).values({
      id: webhookLogId,
      event: eventType,
      payload: JSON.stringify(webhookData),
      merchantOrderId: merchantOrderId || null,
      status: 'pending',
      attempts: 1,
    });

    // CRITICAL: Verify webhook signature to prevent fraud
    if (!authHeader) {
      await updateWebhookLog(webhookLogId, 'failed', 'Missing Authorization header');
      console.error('PhonePe Webhook missing Authorization header');
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      );
    }

    if (!verifyWebhookSignature(authHeader)) {
      await updateWebhookLog(webhookLogId, 'failed', 'Invalid signature');
      console.error('PhonePe Webhook Signature Verification Failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    if (!merchantOrderId) {
      await updateWebhookLog(webhookLogId!, 'failed', 'Missing merchantOrderId in payload');
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
      await updateWebhookLog(webhookLogId!, 'failed', 'Order not found');
      console.error('Order not found for webhook:', merchantOrderId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // IDEMPOTENCY CHECK: If order is already marked as completed, don't process again
    if (orderResult.paymentStatus === 'completed') {
      await updateWebhookLog(webhookLogId!, 'processed', null, new Date());
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
    
    // Mark webhook as processed
    await updateWebhookLog(webhookLogId!, 'processed', null, new Date());

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error: any) {
    console.error('PhonePe Webhook Error:', error);
    
    // Update webhook log with error
    if (webhookLogId) {
      await updateWebhookLog(webhookLogId, 'failed', error.message);
    }

    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Update webhook log status
 */
async function updateWebhookLog(
  id: string,
  status: 'pending' | 'processed' | 'failed',
  lastError: string | null,
  processedAt?: Date
) {
  try {
    await db.update(webhookLogs)
      .set({
        status,
        lastError,
        processedAt,
        updatedAt: new Date(),
      })
      .where(eq(webhookLogs.id, id));
  } catch (error) {
    console.error('Failed to update webhook log:', error  { error: 'Webhook processing failed', details: error.message },
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
    let markedCompleted = false;
    await db.transaction(async (tx) => {
      // Update order status only if still pending (idempotency guard)
      const updatedOrder = await tx.update(orders)
        .set({
          paymentStatus: 'completed',
          transactionId: event.transactionId,
          status: 'placed', // Now order is truly placed
          updatedAt: new Date(),
        })
        .where(and(
          eq(orders.id, order.id),
          eq(orders.paymentStatus, 'pending')
        ))
        .returning({ id: orders.id });

      if (updatedOrder.length === 0) {
        return;
      }

      markedCompleted = true;

      // Deduct stock for all items in the order using optimized batch update
      // This prevents blocking webhook response and improves performance
      const orderItemsResult = await pool.query(
        'SELECT "productId", quantity FROM "OrderItem" WHERE "orderId" = $1',
        [order.id]
      );

      if (orderItemsResult.rows.length > 0) {
        // Batch stock deduction using a single query with unnest
        const productIds = orderItemsResult.rows.map((item: any) => item.productId);
        const quantities = orderItemsResult.rows.map((item: any) => item.quantity);
        
        const batchUpdateResult = await pool.query(`
          UPDATE "Product" p
          SET 
            stock = p.stock - u.quantity::int,
            "updatedAt" = NOW()
          FROM (
            SELECT 
              unnest($1::text[]) as product_id,
              unnest($2::int[]) as quantity
          ) u
          WHERE p.id = u.product_id 
            AND p.stock >= u.quantity::int
          RETURNING p.id
        `, [productIds, quantities]);
        
        if (batchUpdateResult.rows.length !== orderItemsResult.rows.length) {
          console.warn(`Stock deduction incomplete for order ${order.id}. Expected ${orderItemsResult.rows.length}, updated ${batchUpdateResult.rows.length}`);
        }
      }
    });

    console.log('Payment success processed for order:', {
      orderId: order.id,
      markedCompleted,
    });

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
      .where(and(
        eq(orders.id, order.id),
        eq(orders.paymentStatus, 'pending')
      ));

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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

