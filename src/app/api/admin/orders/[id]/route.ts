import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { orders } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

async function handlePUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()

    if (!['placed', 'packed', 'shipped', 'delivered'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Check if order exists first
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, params.id),
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    const [order] = await db.update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, params.id))
      .returning()

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const PUT = authMiddleware(handlePUT)
