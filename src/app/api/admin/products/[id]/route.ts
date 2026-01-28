import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { products, orderItems } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'
import { sanitizeProductData } from '@/lib/validation'

async function handlePUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Sanitize input data
    const sanitizedData = sanitizeProductData(body)
    const { name, description, price, discount, category, stock, images, material, featured } = sanitizedData

    // Validate stock cannot be negative
    if (stock < 0 || stock > 100000) {
      return NextResponse.json(
        { error: 'Stock must be between 0 and 100,000' },
        { status: 400 }
      )
    }

    // Validate price
    if (price <= 0 || price > 1000000) {
      return NextResponse.json(
        { error: 'Price must be between 0 and 1,000,000' },
        { status: 400 }
      )
    }

    // Validate discount
    if (discount < 0 || discount > 100) {
      return NextResponse.json(
        { error: 'Discount must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.id, context.params.id),
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const [product] = await db.update(products)
      .set({
        name,
        description,
        price: price.toFixed(2),
        discount: discount.toFixed(2),
        category,
        stock,
        images,
        material: material || null,
        featured: featured || false,
        updatedAt: new Date(),
      })
      .where(eq(products.id, context.params.id))
      .returning()

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

async function handleDELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Check for force delete flag
    const { searchParams } = new URL(request.url)
    const forceDelete = searchParams.get('force') === 'true'

    // Check if product has existing orders
    const existingOrderItems = await db.query.orderItems.findMany({
      where: eq(orderItems.productId, context.params.id),
    })

    if (existingOrderItems.length > 0 && !forceDelete) {
      return NextResponse.json(
        { 
          error: `Cannot delete product. It exists in ${existingOrderItems.length} order(s). Consider marking it as out of stock instead.`,
          orderCount: existingOrderItems.length,
          suggestion: 'Set stock to 0 instead of deleting'
        },
        { status: 400 }
      )
    }

    // If force delete, first delete all order items referencing this product
    if (forceDelete && existingOrderItems.length > 0) {
      await db.delete(orderItems)
        .where(eq(orderItems.productId, context.params.id))
    }

    // Delete product (cascade will handle reviews automatically)
    await db.delete(products)
      .where(eq(products.id, context.params.id))

    return NextResponse.json({ 
      success: true,
      message: forceDelete ? 'Product force deleted (order items removed)' : 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Product deletion error:', error)
    
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

export const PUT = authMiddleware(handlePUT)
export const DELETE = authMiddleware(handleDELETE)
