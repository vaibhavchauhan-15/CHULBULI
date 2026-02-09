/**
 * PhonePe Payment Creation API
 * 
 * This endpoint creates a payment order with PhonePe gateway.
 * Flow:
 * 1. Validate cart items and check stock
 * 2. Create order in DB with status = 'pending_payment'
 * 3. Generate unique merchant order ID
 * 4. Call PhonePe API to create payment
 * 5. Return payment URL for redirection
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, pool } from '@/lib/db/client';
import { orders, orderItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sanitizeOrderData, validateEmail, validatePhoneNumber, validatePincode } from '@/lib/validation';
import { generateId } from '@/lib/db/queries';
import { createPhonePeOrder, generateMerchantOrderId, getPhonePeCheckoutScriptUrl } from '@/lib/phonepe';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail || !customerPhone || !addressLine1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: 'All address fields are required' },
        { status: 400 }
      );
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
    });

    // Validate email and phone format
    const emailValidation = validateEmail(sanitizedData.customerEmail);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const phoneValidation = validatePhoneNumber(sanitizedData.customerPhone);
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error },
        { status: 400 }
      );
    }

    const pincodeValidation = validatePincode(sanitizedData.pincode);
    if (!pincodeValidation.valid) {
      return NextResponse.json(
        { error: pincodeValidation.error },
        { status: 400 }
      );
    }

    // Create order in database transaction
    const order = await db.transaction(async (tx) => {
      let totalPrice = 0;
      const orderItemsData = [];

      // Validate stock and calculate prices
      for (const item of items) {
        // Lock the product row for update
        const productResult = await pool.query(
          'SELECT id, name, price, discount, stock FROM "Product" WHERE id = $1 FOR UPDATE',
          [item.productId]
        );

        if (productResult.rows.length === 0) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const productData = productResult.rows[0];
        const productPrice = parseFloat(productData.price);
        const productDiscount = parseFloat(productData.discount);

        // Check stock availability (but don't deduct yet)
        if (productData.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${productData.name}. Available: ${productData.stock}, Requested: ${item.quantity}`
          );
        }

        // Calculate price
        const itemPrice = productPrice - (productPrice * productDiscount) / 100;
        totalPrice += itemPrice * item.quantity;

        orderItemsData.push({
          id: generateId('item'),
          productId: productData.id,
          quantity: item.quantity,
          price: itemPrice.toFixed(2),
        });
      }

      // Round to 2 decimal places
      totalPrice = Math.round(totalPrice * 100) / 100;

      // Get the next order number
      const lastOrderResult = await pool.query(
        'SELECT COALESCE(MAX("orderNumber"), 0) + 1 as next_order_number FROM "Order"'
      );
      const orderNumber = lastOrderResult.rows[0].next_order_number;

      // Generate unique merchant order ID for PhonePe
      const merchantOrderId = generateMerchantOrderId();

      // Create order with pending_payment status
      const orderId = generateId('order');
      const now = new Date();

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
        status: 'pending_payment', // Order awaiting payment - will be 'placed' only after payment success
        paymentMethod: 'online',
        paymentProvider: 'phonepe',
        paymentStatus: 'pending', // Will be updated by webhook or status check
        merchantOrderId: merchantOrderId,
        transactionId: null, // Will be set when PhonePe returns it
        createdAt: now,
        updatedAt: now,
      }).returning();

      // Create order items
      await tx.insert(orderItems).values(
        orderItemsData.map(item => ({ ...item, orderId }))
      );

      return newOrder;
    });

    // Validate minimum amount for PhonePe (₹1 = 100 paisa)
    const orderTotal = parseFloat(order.totalPrice);
    if (orderTotal < 1) {
      // Mark order as cancelled since we can't process payment
      await db.update(orders)
        .set({
          paymentStatus: 'failed',
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      return NextResponse.json(
        { 
          error: 'Order total must be at least ₹1 for online payment',
          code: 'MINIMUM_AMOUNT_ERROR',
          minimumAmount: 1,
          currentAmount: orderTotal,
          suggestion: 'Please add more items to cart or use Cash on Delivery option.'
        },
        { status: 400 }
      );
    }

    // Now create payment with PhonePe
    try {
      const phonePePayment = await createPhonePeOrder({
        merchantOrderId: order.merchantOrderId!,
        amount: parseFloat(order.totalPrice),
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
      });

      // Update order with transaction ID
      await db.update(orders)
        .set({
          transactionId: phonePePayment.transactionId,
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      console.log('PhonePe payment created:', {
        orderId: order.id,
        merchantOrderId: order.merchantOrderId,
        transactionId: phonePePayment.transactionId,
      });

      // Get the correct checkout script URL for the environment
      const checkoutScriptUrl = getPhonePeCheckoutScriptUrl(phonePePayment.paymentUrl);

      // Return payment URL and checkout script for frontend
      return NextResponse.json({
        success: true,
        paymentUrl: phonePePayment.paymentUrl,
        checkoutScriptUrl: checkoutScriptUrl,
        orderId: order.id,
        merchantOrderId: order.merchantOrderId,
        transactionId: phonePePayment.transactionId,
      });
    } catch (phonePeError: any) {
      console.error('PhonePe payment creation failed:', phonePeError);

      // Mark order as cancelled since payment gateway failed
      await db.update(orders)
        .set({
          paymentStatus: 'failed',
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      // Determine if it's a merchant configuration error
      const isMerchantConfigError = 
        phonePeError.message?.includes('not properly configured') ||
        phonePeError.message?.includes('KEY_NOT_CONFIGURED') ||
        phonePeError.message?.includes('Merchant Configuration Error');

      return NextResponse.json(
        { 
          error: isMerchantConfigError 
            ? 'PhonePe merchant account not properly configured. Please use an alternative payment method.'
            : 'Failed to initiate payment with PhonePe',
          code: isMerchantConfigError ? 'MERCHANT_NOT_CONFIGURED' : 'PHONEPE_ERROR',
          details: phonePeError.message,
        },
        { status: isMerchantConfigError ? 503 : 500 }
      );
    }
  } catch (error: any) {
    console.error('PhonePe order creation error:', error);

    // Handle specific errors
    if (error.message?.includes('Insufficient stock')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { 
          error: error.message,
          suggestion: 'One or more items in your cart are no longer available. Please refresh your cart and try again.'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment. Please try again.' },
      { status: 500 }
    );
  }
}
