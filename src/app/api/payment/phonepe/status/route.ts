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
import { eq } from 'drizzle-orm';
import { verifyPhonePePayment } from '@/lib/phonepe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const merchantOrderId = searchParams.get('merchantOrderId');
    const orderId = searchParams.get('orderId');

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
        message: 'Payment already completed',
      });
    }

    // If payment is still pending, check with PhonePe
    if (order.paymentStatus === 'pending' && order.merchantOrderId) {
      try {
        const phonePeStatus = await verifyPhonePePayment(order.merchantOrderId);

        console.log('PhonePe Status Check Result:', {
          orderId: order.id,
          merchantOrderId: order.merchantOrderId,
          code: phonePeStatus.status,
          state: phonePeStatus.state,
        });

        // If payment is successful (state: COMPLETED or code: PAYMENT_SUCCESS)
        if (phonePeStatus.success && (phonePeStatus.state === 'COMPLETED' || phonePeStatus.status === 'PAYMENT_SUCCESS')) {
          // Use transaction to ensure atomicity
          await db.transaction(async (tx) => {
            // Update order status
            await tx.update(orders)
              .set({
                paymentStatus: 'completed',
                transactionId: phonePeStatus.transactionId,
                status: 'placed',
                updatedAt: new Date(),
              })
              .where(eq(orders.id, order.id));

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

          console.log('✅ Payment verified and order updated:', order.id);

          return NextResponse.json({
            success: true,
            status: 'completed',
            paymentStatus: 'completed',
            transactionId: phonePeStatus.transactionId,
            orderId: order.id,
            message: 'Payment verified successfully',
          });
        }

        // If payment failed (state: FAILED or code: PAYMENT_ERROR)
        if (phonePeStatus.state === 'FAILED' || phonePeStatus.status === 'PAYMENT_ERROR') {
          await db.update(orders)
            .set({
              paymentStatus: 'failed',
              transactionId: phonePeStatus.transactionId,
              updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

          return NextResponse.json({
            success: false,
            status: 'failed',
            paymentStatus: 'failed',
            orderId: order.id,
            message: 'Payment failed',
          });
        }

        // Payment still pending
        return NextResponse.json({
          success: false,
          status: 'pending',
          paymentStatus: 'pending',
          orderId: order.id,
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
    });
  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
