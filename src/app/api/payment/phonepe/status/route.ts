/**
 * PhonePe Payment Status Check API
 * 
 * This is a fallback endpoint to check payment status if webhook fails.
 * Use cases:
 * - User returns from payment page but webhook hasn't arrived yet
 * - Webhook delivery failed
 * - Manual status verification needed
 * 
 * Usage: GET /api/payment/phonepe/status?merchantOrderId=CHULBULI-123456789
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, pool } from '@/lib/db/client';
import { orders } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { verifyPhonePePayment } from '@/lib/phonepe';
import { rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// Rate limiter: 30 status checks per minute per IP (allows polling)
const statusRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: 'Too many status check requests. Please try again later.',
  keyPrefix: 'phonepe-status',
});

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = statusRateLimiter(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const merchantOrderId = searchParams.get('merchantOrderId');
    const orderId = searchParams.get('orderId');
    
    // Optional query parameters as per PhonePe documentation
    // https://developer.phonepe.com/v1/docs/order-status-api
    const details = searchParams.get('details') === 'true'; // true = all payment attempts, false = latest only
    const errorContext = searchParams.get('errorContext') === 'true'; // true = include errorContext if FAILED

    // Need at least one identifier
    if (!merchantOrderId && !orderId) {
      return NextResponse.json(
        { error: 'merchantOrderId or orderId is required' },
        { status: 400 }
      );
    }

    // Find order in database
    let order;
    if (merchantOrderId) {
      order = await db.query.orders.findFirst({
        where: eq(orders.merchantOrderId, merchantOrderId),
      });
    } else if (orderId) {
      order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
      });
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // If order is already completed, return status from DB
    if (order.paymentStatus === 'completed') {
      return NextResponse.json({
        success: true,
        status: 'completed',
        paymentStatus: order.paymentStatus,
        transactionId: order.transactionId,
        orderId: order.id,
        paymentProvider: order.paymentProvider,
        message: 'Payment already completed',
      });
    }

    if (order.paymentStatus === 'failed' || order.status === 'cancelled') {
      return NextResponse.json({
        success: false,
        status: 'failed',
        paymentStatus: 'failed',
        transactionId: order.transactionId,
        orderId: order.id,
        paymentProvider: order.paymentProvider,
        message: 'Payment failed',
      });
    }

    // If payment is still pending, check with PhonePe
    if (order.paymentStatus === 'pending' && order.merchantOrderId) {
      try {
        const phonePeStatus = await verifyPhonePePayment(order.merchantOrderId, {
          details,
          errorContext,
        });

        console.log('PhonePe Status Check Result:', {
          orderId: order.id,
          merchantOrderId: order.merchantOrderId,
          state: phonePeStatus.state,
        });

        // If payment is successful (state: COMPLETED)
        if (phonePeStatus.success && phonePeStatus.state === 'COMPLETED') {
          // Use transaction to ensure atomicity
          let markedCompleted = false;
          await db.transaction(async (tx) => {
            // Update order status only if still pending (idempotency guard)
            const updatedOrder = await tx.update(orders)
              .set({
                paymentStatus: 'completed',
                transactionId: phonePeStatus.transactionId,
                status: 'placed',
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

            // Deduct stock for all items
            const orderItemsResult = await pool.query(
              'SELECT "productId", quantity FROM "OrderItem" WHERE "orderId" = $1',
              [order.id]
            );

            for (const item of orderItemsResult.rows) {
              await pool.query(
                'UPDATE "Product" SET stock = stock - $1, "updatedAt" = NOW() WHERE id = $2 AND stock >= $1',
                [item.quantity, item.productId]
              );
            }
          });

          console.log('Payment verified and order update attempted:', {
            orderId: order.id,
            markedCompleted,
          });

          return NextResponse.json({
            success: true,
            status: 'completed',
            paymentStatus: 'completed',
            transactionId: phonePeStatus.transactionId,
            orderId: order.id,
            paymentProvider: order.paymentProvider,
            message: 'Payment verified successfully',
          });
        }

        // If payment failed (state: FAILED)
        if (phonePeStatus.state === 'FAILED') {
          await db.update(orders)
            .set({
              paymentStatus: 'failed',
              status: 'cancelled',
              transactionId: phonePeStatus.transactionId,
              updatedAt: new Date(),
            })
            .where(and(
              eq(orders.id, order.id),
              eq(orders.paymentStatus, 'pending')
            ));

          return NextResponse.json({
            success: false,
            status: 'failed',
            paymentStatus: 'failed',
            orderId: order.id,
            paymentProvider: order.paymentProvider,
            message: 'Payment failed',
          });
        }

        // Payment still pending
        return NextResponse.json({
          success: false,
          status: 'pending',
          paymentStatus: 'pending',
          orderId: order.id,
          paymentProvider: order.paymentProvider,
          message: 'Payment is still being processed',
        });
      } catch (error: any) {
        console.error('PhonePe status check error:', error);
        
        // Return current DB status if PhonePe API fails
        return NextResponse.json({
          success: false,
          status: order.paymentStatus,
          paymentStatus: order.paymentStatus,
          orderId: order.id,
          paymentProvider: order.paymentProvider,
          message: 'Unable to verify payment status at the moment',
          error: error.message,
        });
      }
    }

    // For other statuses (failed, etc.), return from DB
    return NextResponse.json({
      success: order.paymentStatus === 'completed',
      status: order.paymentStatus,
      paymentStatus: order.paymentStatus,
      transactionId: order.transactionId,
      orderId: order.id,
      paymentProvider: order.paymentProvider,
    });
  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}

