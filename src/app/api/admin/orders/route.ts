import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { orders } from '@/lib/db/schema'
import { and, desc, eq, ne } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

export const dynamic = 'force-dynamic'

async function handleGET(request: NextRequest) {
  try {
    // Safety normalization: failed payments must never remain in a placed/fulfillment state.
    await db.update(orders)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(and(
        eq(orders.paymentStatus, 'failed'),
        ne(orders.status, 'cancelled')
      ))

    // Fetch all orders with relations
    // Note: user relation is optional (null for guest orders)
    const allOrders = await db.query.orders.findMany({
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: desc(orders.createdAt),
    })

    const normalizedOrders = allOrders.map((order) => {
      if (order.paymentStatus === 'failed' && order.status !== 'cancelled') {
        return {
          ...order,
          status: 'cancelled',
        }
      }
      return order
    })

    return NextResponse.json(normalizedOrders)
  } catch (error) {
    console.error('Admin orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
