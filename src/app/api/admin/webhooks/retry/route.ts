/**
 * Admin Webhook Retry Endpoint
 * 
 * This endpoint allows admins to manually retry failed webhooks.
 * Useful for recovering from transient errors or database issues.
 * 
 * Usage: POST /api/admin/webhooks/retry
 * Body: { webhookLogId: "wh_xyz" } or { retryAll: true }
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, pool } from '@/lib/db/client';
import { webhookLogs, orders } from '@/lib/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { verifyWebhookSignature } from '@/lib/phonepe';

export const dynamic = 'force-dynamic';

/**
 * Retry failed webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check here
    // const session = await getAuthSession(request);
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { webhookLogId, retryAll } = body;

    if (!webhookLogId && !retryAll) {
      return NextResponse.json(
        { error: 'Either webhookLogId or retryAll must be provided' },
        { status: 400 }
      );
    }

    let webhooksToRetry: any[] = [];

    if (retryAll) {
      // Retry all failed webhooks from the last 24 hours with less than 5 attempts
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      webhooksToRetry = await db.query.webhookLogs.findMany({
        where: and(
          eq(webhookLogs.status, 'failed'),
          lte(webhookLogs.attempts, 5),
          // @ts-ignore
          lte(webhookLogs.createdAt, oneDayAgo)
        ),
        limit: 50, // Process max 50 at a time
      });
    } else {
      // Retry specific webhook
      const webhook = await db.query.webhookLogs.findFirst({
        where: eq(webhookLogs.id, webhookLogId),
      });

      if (!webhook) {
        return NextResponse.json(
          { error: 'Webhook log not found' },
          { status: 404 }
        );
      }

      webhooksToRetry = [webhook];
    }

    const results = {
      total: webhooksToRetry.length,
      succeeded: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Process each webhook
    for (const webhook of webhooksToRetry) {
      try {
        const webhookData = JSON.parse(webhook.payload);
        const eventType = webhookData.event;
        const payload = webhookData.payload;
        const merchantOrderId = payload?.merchantOrderId;

        if (!merchantOrderId) {
          results.failed++;
          results.errors.push({
            webhookId: webhook.id,
            error: 'Missing merchantOrderId',
          });
          continue;
        }

        // Find order
        const order = await db.query.orders.findFirst({
          where: eq(orders.merchantOrderId, merchantOrderId),
        });

        if (!order) {
          results.failed++;
          results.errors.push({
            webhookId: webhook.id,
            error: 'Order not found',
          });
          
          await db.update(webhookLogs)
            .set({
              status: 'failed',
              attempts: webhook.attempts + 1,
              lastError: 'Order not found',
              updatedAt: new Date(),
            })
            .where(eq(webhookLogs.id, webhook.id));
          
          continue;
        }

        // Check if already processed
        if (order.paymentStatus === 'completed') {
          await db.update(webhookLogs)
            .set({
              status: 'processed',
              processedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(webhookLogs.id, webhook.id));
          
          results.succeeded++;
          continue;
        }

        // Process webhook based on event type
        const paymentState = payload?.state;
        const isSuccess = eventType === 'checkout.order.completed' && paymentState === 'COMPLETED';
        const isFailed = eventType === 'checkout.order.failed' && paymentState === 'FAILED';

        if (isSuccess) {
          await handlePaymentSuccess(order, {
            transactionId: payload?.paymentDetails?.[0]?.transactionId || payload?.orderId,
            amount: payload?.amount,
          });

          await db.update(webhookLogs)
            .set({
              status: 'processed',
              processedAt: new Date(),
              attempts: webhook.attempts + 1,
              updatedAt: new Date(),
            })
            .where(eq(webhookLogs.id, webhook.id));

          results.succeeded++;
        } else if (isFailed) {
          await handlePaymentFailed(order, {
            transactionId: payload?.paymentDetails?.[0]?.transactionId || payload?.orderId,
            errorCode: payload?.errorCode,
          });

          await db.update(webhookLogs)
            .set({
              status: 'processed',
              processedAt: new Date(),
              attempts: webhook.attempts + 1,
              updatedAt: new Date(),
            })
            .where(eq(webhookLogs.id, webhook.id));

          results.succeeded++;
        } else {
          results.failed++;
          results.errors.push({
            webhookId: webhook.id,
            error: 'Unknown payment state',
          });

          await db.update(webhookLogs)
            .set({
              attempts: webhook.attempts + 1,
              lastError: 'Unknown payment state',
              updatedAt: new Date(),
            })
            .where(eq(webhookLogs.id, webhook.id));
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push({
          webhookId: webhook.id,
          error: error.message,
        });

        await db.update(webhookLogs)
          .set({
            attempts: webhook.attempts + 1,
            lastError: error.message,
            updatedAt: new Date(),
          })
          .where(eq(webhookLogs.id, webhook.id));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook retry completed',
      results,
    });
  } catch (error: any) {
    console.error('Webhook retry error:', error);
    return NextResponse.json(
      { error: 'Webhook retry failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(order: any, event: any) {
  console.log('Retrying payment success for order:', order.id);

  try {
    await db.transaction(async (tx) => {
      const updatedOrder = await tx.update(orders)
        .set({
          paymentStatus: 'completed',
          transactionId: event.transactionId,
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

      // Deduct stock
      const orderItemsResult = await pool.query(
        'SELECT "productId", quantity FROM "OrderItem" WHERE "orderId" = $1',
        [order.id]
      );

      if (orderItemsResult.rows.length > 0) {
        const productIds = orderItemsResult.rows.map((item: any) => item.productId);
        const quantities = orderItemsResult.rows.map((item: any) => item.quantity);
        
        await pool.query(`
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
      }
    });
  } catch (error) {
    console.error('Error retrying payment success:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(order: any, event: any) {
  console.log('Retrying payment failure for order:', order.id);

  try {
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
  } catch (error) {
    console.error('Error retrying payment failure:', error);
    throw error;
  }
}

/**
 * Get all failed webhooks (for admin dashboard)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status') || 'failed';

    const webhooks = await db.query.webhookLogs.findMany({
      where: eq(webhookLogs.status, status as any),
      limit,
      orderBy: (webhookLogs, { desc }) => [desc(webhookLogs.createdAt)],
    });

    return NextResponse.json({
      success: true,
      webhooks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch webhooks', details: error.message },
      { status: 500 }
    );
  }
}
