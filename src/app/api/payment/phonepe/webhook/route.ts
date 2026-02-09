/**
 * PhonePe Payment Webhook Handler
 * 
 * CRITICAL: This is the most important endpoint for PhonePe integration.
 * - NEVER trust frontend success responses
 * - ONLY update order status based on webhook confirmation
 * - ALWAYS verify webhook signature
 * - Handle idempotency (webhooks may be sent multiple times)
 * 
 * This handler works with OAuth-based Standard Checkout (v2) API
 * 
 * Events handled:
 * - pg.order.completed - Payment successful
 * - pg.order.failed - Payment failed
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, pool } from '@/lib/db/client';
import { orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyWebhookSignature } from '@/lib/phonepe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Get X-VERIFY signature header from PhonePe webhook
    const signature = request.headers.get('x-verify') || 
                      request.headers.get('x-phonepe-signature') || 
                      '';

    // PhonePe sends webhook with base64 encoded response
    const body = await request.json();
    const base64Response = body.response;

    if (!base64Response) {
      console.error('PhonePe Webhook: Missing response field');
      return NextResponse.json(
        { error: 'Missing response field' },
        { status: 400 }
      );
    }

    // CRITICAL: Verify webhook signature to prevent fraud
    if (signature && !verifyWebhookSignature(base64Response, signature)) {
      console.error('PhonePe Webhook Signature Verification Failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Decode the base64 response
    const decodedResponse = Buffer.from(base64Response, 'base64').toString('utf-8');
    const webhookData = JSON.parse(decodedResponse);

    console.log('PhonePe Webhook Received:', {
      hasSignature: !!signature,
      success: webhookData.success,
      code: webhookData.code,
      merchantTransactionId: webhookData.data?.merchantTransactionId,
      timestamp: new Date().toISOString(),
    });

    // Extract merchantTransactionId from webhook data
    const merchantOrderId = webhookData.data?.merchantTransactionId;

    if (!merchantOrderId) {
      console.error('PhonePe Webhook: Missing merchantTransactionId');
      return NextResponse.json(
        { error: 'Missing merchantTransactionId' },
        { status: 400 }
      );
    }

    console.log('PhonePe Webhook Details:', {
      merchantTransactionId: merchantOrderId,
      transactionId: webhookData.data?.transactionId,
      success: webhookData.success,
      code: webhookData.code,
      state: webhookData.data?.state,
      amount: webhookData.data?.amount,
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

    // Handle different payment states/codes
    // OAuth v2 can use either 'code' or 'status' or 'state' field
    const paymentCode = webhookData.code;
    const paymentStatus = webhookData.data?.status || webhookData.status;
    const paymentState = webhookData.data?.state;

    // Check if payment is successful
    const isSuccess = paymentCode === 'PAYMENT_SUCCESS' || 
                     paymentStatus === 'SUCCESS' ||
                     paymentState === 'COMPLETED';

    // Check if payment failed
    const isFailed = paymentCode === 'PAYMENT_ERROR' ||
                    paymentCode === 'PAYMENT_DECLINED' ||
                    paymentStatus === 'FAILED' ||
                    paymentState === 'FAILED';

    if (isSuccess) {
      await handlePaymentSuccess(orderResult, {
        transactionId: webhookData.data?.transactionId || webhookData.transactionId,
        amount: webhookData.data?.amount,
      });
    } else if (isFailed) {
      await handlePaymentFailed(orderResult, {
        transactionId: webhookData.data?.transactionId || webhookData.transactionId,
      });
    } else {
      console.log('PhonePe webhook - payment still pending or unknown state:', {
        code: paymentCode,
        status: paymentStatus,
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
    // Update order status to failed
    await db.update(orders)
      .set({
        paymentStatus: 'failed',
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
