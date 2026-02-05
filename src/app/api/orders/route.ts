import { NextRequest, NextResponse } from 'next/server'
import { db, pool } from '@/lib/db/client'
import { products, orders, orderItems } from '@/lib/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import { verifyToken } from '@/lib/auth'
import { sanitizeOrderData, validateEmail, validatePhoneNumber, validatePincode } from '@/lib/validation'
import { generateId } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      userId,
      paymentMethod = 'cod',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentStatus = 'pending',
    } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    if (!customerName || !customerEmail || !customerPhone || !addressLine1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All address fields are required' },
        { status: 400 }
      )
    }

    // Sanitize input data
    const sanitizedData = sanitizeOrderData({
      customerName,
      customerEmail,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      items,
      userId,
    })

    // Validate email and phone format
    const emailValidation = validateEmail(sanitizedData.customerEmail)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const phoneValidation = validatePhoneNumber(sanitizedData.customerPhone)
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      )
    }

    const pincodeValidation = validatePincode(sanitizedData.pincode)
    if (!pincodeValidation.valid) {
      return NextResponse.json(
        { error: pincodeValidation.error },
        { status: 400 }
      )
    }

    // Use database transaction to prevent race conditions
    const order = await db.transaction(async (tx) => {
      let totalPrice = 0
      const orderItemsData = []

      // Validate stock and calculate prices atomically
      for (const item of items) {
        // Lock the product row for update using raw SQL
        const productResult = await pool.query(
          'SELECT id, name, price, discount, stock FROM "Product" WHERE id = $1 FOR UPDATE',
          [item.productId]
        )

        if (productResult.rows.length === 0) {
          throw new Error(`Product ${item.productId} not found`)
        }

        const productData = productResult.rows[0]
        const productPrice = parseFloat(productData.price)
        const productDiscount = parseFloat(productData.discount)

        if (productData.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${productData.name}. Available: ${productData.stock}, Requested: ${item.quantity}`)
        }

        // Calculate price from current database values (prevent manipulation)
        const itemPrice = productPrice - (productPrice * productDiscount) / 100
        totalPrice += itemPrice * item.quantity

        orderItemsData.push({
          id: generateId('item'),
          productId: productData.id,
          quantity: item.quantity,
          price: itemPrice.toFixed(2),
        })

        // Decrement stock atomically
        const updateResult = await pool.query(
          'UPDATE "Product" SET stock = stock - $1, "updatedAt" = NOW() WHERE id = $2 AND stock >= $1 RETURNING id',
          [item.quantity, item.productId]
        )

        if (updateResult.rows.length === 0) {
          throw new Error(`Failed to update stock for ${productData.name}. Stock may have changed.`)
        }
      }

      // Round to 2 decimal places
      totalPrice = Math.round(totalPrice * 100) / 100

      // Get the next order number (atomically)
      const lastOrderResult = await pool.query(
        'SELECT COALESCE(MAX("orderNumber"), 0) + 1 as next_order_number FROM "Order"'
      )
      const orderNumber = lastOrderResult.rows[0].next_order_number

      // Create order
      const orderId = generateId('order')
      const now = new Date()
      const [newOrder] = await tx.insert(orders).values({
        id: orderId,
        orderNumber: orderNumber,
        userId: sanitizedData.userId || null,
        totalPrice: totalPrice.toFixed(2),
        customerName: sanitizedData.customerName,
        customerEmail: emailValidation.email,
        customerPhone: sanitizedData.customerPhone,
        addressLine1: sanitizedData.addressLine1,
        addressLine2: sanitizedData.addressLine2,
        city: sanitizedData.city,
        state: sanitizedData.state,
        pincode: sanitizedData.pincode,
        status: 'placed',
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        razorpayOrderId: razorpayOrderId || null,
        razorpayPaymentId: razorpayPaymentId || null,
        razorpaySignature: razorpaySignature || null,
        createdAt: now,
        updatedAt: now,
      }).returning()

      // Create order items with orderId
      const createdItems = await tx.insert(orderItems).values(
        orderItemsData.map(item => ({ ...item, orderId }))
      ).returning()

      return { ...newOrder, orderItems: createdItems }
    })

    console.log('Order created successfully:', order.id)
    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Order creation error:', error)

    // Handle specific errors
    if (error.message?.includes('Insufficient stock')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { 
          error: error.message,
          suggestion: 'One or more items in your cart are no longer available. Please refresh your cart and try again.'
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from HTTP-only cookie
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, payload.userId),
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
      orderBy: desc(orders.createdAt),
    })

    return NextResponse.json(userOrders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
