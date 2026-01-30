import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { products } from '@/lib/db/schema'
import { inArray } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

/**
 * Validate cart items against current database state
 * Returns which products are available, unavailable, or have stock issues
 */
export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      )
    }

    // Fetch all products matching the IDs
    const foundProducts = await db.query.products.findMany({
      where: inArray(products.id, productIds),
      columns: {
        id: true,
        name: true,
        price: true,
        discount: true,
        stock: true,
        productStatus: true,
        stockStatus: true,
      },
    })

    const foundProductIds = new Set(foundProducts.map(p => p.id))
    const unavailableProductIds = productIds.filter(id => !foundProductIds.has(id))

    // Check for products that exist but are not available for purchase
    const unavailableProducts = foundProducts.filter(
      p => p.productStatus !== 'active' || p.stock <= 0
    )

    return NextResponse.json({
      valid: unavailableProductIds.length === 0 && unavailableProducts.length === 0,
      availableProducts: foundProducts.filter(
        p => p.productStatus === 'active' && p.stock > 0
      ),
      unavailableProductIds,
      unavailableProducts: unavailableProducts.map(p => ({
        id: p.id,
        name: p.name,
        reason: p.stock <= 0 ? 'Out of stock' : 'No longer available',
      })),
    })
  } catch (error) {
    console.error('Cart validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate cart items' },
      { status: 500 }
    )
  }
}
