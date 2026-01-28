import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { orders } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

async function handleGET(request: NextRequest) {
  try {
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

    return NextResponse.json(allOrders)
  } catch (error) {
    console.error('Admin orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
