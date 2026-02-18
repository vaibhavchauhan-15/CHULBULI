/**
 * Cleanup Pending Orders Cron Job
 * 
 * This endpoint should be called periodically (e.g., every hour) to clean up
 * orders that:
 * - Have paymentStatus = 'pending'
 * - Have status = 'pending_payment'
 * - Were created more than 30 minutes ago (payment expiry is 20 minutes)
 * 
 * These orders are likely abandoned (user closed payment page without completing)
 * 
 * Setup: Configure this as a cron job in your hosting platform
 * - Vercel: Add to vercel.json
 * - Netlify: Add to netlify.toml
 * - Manual: Call this endpoint every hour via cron service
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, pool } from '@/lib/db/client';
import { orders } from '@/lib/db/schema';
import { eq, and, lt } from 'drizzle-orm';
import { cron } from '@/lib/config/environment';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for execution

export async function POST(request: NextRequest) {
  try {
    // Verify authorization (use a secret token to prevent unauthorized access)
    const authHeader = request.headers.get('authorization');
    const cronSecret = cron.secret || 'fallback-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find orders that are:
    // 1. Still pending payment (paymentStatus = 'pending')
    // 2. Status is 'pending_payment'
    // 3. Created more than 30 minutes ago
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const pendingOrders = await pool.query(
      `SELECT id, "orderNumber", "merchantOrderId", "createdAt", "totalPrice"
       FROM "Order"
       WHERE "paymentStatus" = 'pending'
       AND status = 'pending_payment'
       AND "createdAt" < $1
       ORDER BY "createdAt" ASC`,
      [thirtyMinutesAgo]
    );

    console.log(`Found ${pendingOrders.rows.length} abandoned orders to clean up`);

    const cleanedOrderIds = [];

    // Update each abandoned order
    for (const order of pendingOrders.rows) {
      try {
        // Mark order as cancelled
        await pool.query(
          `UPDATE "Order" 
           SET status = 'cancelled',
               "paymentStatus" = 'failed',
               "updatedAt" = NOW()
           WHERE id = $1`,
          [order.id]
        );

        cleanedOrderIds.push(order.id);

        console.log(`Cleaned up abandoned order: ${order.id} (merchantOrderId: ${order.merchantOrderId})`);
      } catch (error) {
        console.error(`Failed to cleanup order ${order.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${cleanedOrderIds.length} abandoned orders`,
      cleanedOrders: cleanedOrderIds.length,
      details: pendingOrders.rows.map(o => ({
        orderId: o.id,
        orderNumber: o.orderNumber,
        createdAt: o.createdAt,
        amount: o.totalPrice,
      })),
    });
  } catch (error: any) {
    console.error('Cleanup cron job error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed', details: error.message },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing (with auth)
export async function GET(request: NextRequest) {
  try {
    // Check for auth token in query params for manual testing
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (token !== cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized - valid token required' },
        { status: 401 }
      );
    }

    // Preview pending orders that will be cleaned
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const pendingOrders = await pool.query(
      `SELECT id, "orderNumber", "merchantOrderId", "createdAt", "totalPrice", "paymentStatus", status
       FROM "Order"
       WHERE "paymentStatus" = 'pending'
       AND status = 'pending_payment'
       AND "createdAt" < $1
       ORDER BY "createdAt" ASC`,
      [thirtyMinutesAgo]
    );

    return NextResponse.json({
      success: true,
      message: 'Preview of orders that would be cleaned up (not executed)',
      count: pendingOrders.rows.length,
      orders: pendingOrders.rows.map(o => ({
        orderId: o.id,
        orderNumber: o.orderNumber,
        merchantOrderId: o.merchantOrderId,
        createdAt: o.createdAt,
        amount: o.totalPrice,
        status: o.status,
        paymentStatus: o.paymentStatus,
      })),
    });
  } catch (error: any) {
    console.error('Cleanup preview error:', error);
    return NextResponse.json(
      { error: 'Preview failed', details: error.message },
      { status: 500 }
    );
  }
}
