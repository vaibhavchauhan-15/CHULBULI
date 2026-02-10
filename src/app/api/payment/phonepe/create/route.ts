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
  let orderId: string | null = null; // Track order ID for cleanup
  
  try {
    // Add request logging for debugging
    console.log('🔵 PhonePe payment creation request received:', {
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
    });

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
    let order;
    try {
      order = await db.transaction(async (tx) => {
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

    orderId = order.id; // Store order ID for error handling
    console.log('✅ Order created in database:', {
      orderId: order.id,
      merchantOrderId: order.merchantOrderId,
      totalPrice: order.totalPrice,
    });
  } catch (dbError: any) {
    // Database transaction error - provide detailed error information
    console.error('❌ Database transaction failed:', {
      error: dbError.message,
      errorName: dbError.name,
      errorCode: dbError.code,
      stack: dbError.stack?.split('\n').slice(0, 5).join('\n'),
      timestamp: new Date().toISOString(),
    });

    // Determine specific error type
    const isStockError = dbError.message?.includes('Insufficient stock');
    const isProductNotFound = dbError.message?.includes('Product') && dbError.message?.includes('not found');
    const isConnectionError = dbError.message?.includes('ECONNREFUSED') || 
                              dbError.message?.includes('connection') ||
                              dbError.code === 'ECONNREFUSED';

    if (isStockError) {
      return NextResponse.json(
        { 
          error: dbError.message,
          code: 'INSUFFICIENT_STOCK',
          suggestion: 'Please review your cart and adjust quantities.',
        },
        { status: 400 }
      );
    }

    if (isProductNotFound) {
      return NextResponse.json(
        { 
          error: dbError.message,
          code: 'PRODUCT_NOT_FOUND',
          suggestion: 'Please refresh and try again.',
        },
        { status: 404 }
      );
    }

    if (isConnectionError) {
      return NextResponse.json(
        { 
          error: 'Database connection error. Please try again.',
          code: 'DATABASE_CONNECTION_ERROR',
          suggestion: 'Please try again in a moment.',
        },
        { status: 503 }
      );
    }

    // Generic database error
    return NextResponse.json(
      { 
        error: 'Failed to create order. Please try again.',
        code: 'DATABASE_ERROR',
        details: process.env.NODE_ENV === 'development' ? {
          message: dbError.message,
          code: dbError.code,
        } : undefined,
        suggestion: 'Please try again or contact support if the issue persists.',
      },
      { status: 500 }
    );
  }

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

    // Safety check - verify order has all required fields
    if (!order.merchantOrderId) {
      console.error('❌ Order missing merchantOrderId:', order);
      return NextResponse.json(
        { 
          error: 'Order creation incomplete - missing merchant order ID',
          code: 'INVALID_ORDER_STATE',
          suggestion: 'Please try creating the order again.',
        },
        { status: 500 }
      );
    }

    if (!order.totalPrice || parseFloat(order.totalPrice) <= 0) {
      console.error('❌ Order has invalid total price:', order.totalPrice);
      return NextResponse.json(
        { 
          error: 'Order creation incomplete - invalid total price',
          code: 'INVALID_ORDER_STATE',
          suggestion: 'Please try creating the order again.',
        },
        { status: 500 }
      );
    }

    // Now create payment with PhonePe
    console.log('Creating PhonePe payment order:', {
      orderId: order.id,
      merchantOrderId: order.merchantOrderId,
      amount: parseFloat(order.totalPrice),
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
    });

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

      console.log('✅ PhonePe payment created successfully:', {
        orderId: order.id,
        merchantOrderId: order.merchantOrderId,
        transactionId: phonePePayment.transactionId,
        paymentUrlLength: phonePePayment.paymentUrl?.length || 0,
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
      console.error('❌ PhonePe payment creation failed:', {
        error: phonePeError.message,
        stack: phonePeError.stack,
        orderId: order.id,
        merchantOrderId: order.merchantOrderId,
        amount: parseFloat(order.totalPrice),
      });

      // Mark order as cancelled since payment gateway failed
      await db.update(orders)
        .set({
          paymentStatus: 'failed',
          status: 'cancelled',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      // Determine error type and provide appropriate response
      const errorMessage = phonePeError.message || 'Unknown error';
      const isMerchantConfigError = 
        errorMessage.includes('not properly configured') ||
        errorMessage.includes('KEY_NOT_CONFIGURED') ||
        errorMessage.includes('MERCHANT_NOT_CONFIGURED') ||
        errorMessage.includes('Merchant Configuration Error') ||
        errorMessage.includes('not authorized');
      
      const isAuthError = 
        errorMessage.includes('Authentication Failed') ||
        errorMessage.includes('Invalid Client ID') ||
        errorMessage.includes('Invalid credentials');
      
      const isMinimumAmountError =
        errorMessage.includes('minimum') ||
        errorMessage.includes('100 paisa');
      
      const isServerError = 
        errorMessage.includes('Server Error') ||
        errorMessage.includes('temporarily unavailable');

      // User-friendly error message
      let userMessage: string;
      let errorCode: string;
      let statusCode: number;

      if (isMinimumAmountError) {
        userMessage = 'PhonePe requires a minimum payment of ₹1. Please add more items or use an alternative payment method.';
        errorCode = 'MINIMUM_AMOUNT_ERROR';
        statusCode = 400;
      } else if (isMerchantConfigError || isAuthError) {
        userMessage = 'PhonePe payment is currently unavailable. Please use Razorpay or Cash on Delivery.';
        errorCode = 'MERCHANT_NOT_CONFIGURED';
        statusCode = 503;
      } else if (isServerError) {
        userMessage = 'PhonePe service is temporarily unavailable. Please try again in a few moments or use an alternative payment method.';
        errorCode = 'SERVICE_UNAVAILABLE';
        statusCode = 503;
      } else {
        userMessage = 'Failed to initiate payment with PhonePe. Please try again or use an alternative payment method.';
        errorCode = 'PHONEPE_ERROR';
        statusCode = 500;
      }

      return NextResponse.json(
        { 
          error: userMessage,
          code: errorCode,
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
          suggestion: 'Please try Razorpay payment or Cash on Delivery option.',
        },
        { status: statusCode }
      );
    }
  } catch (error: any) {
    console.error('❌ PhonePe order creation error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    });

    // Handle specific errors
    if (error.message?.includes('Insufficient stock')) {
      return NextResponse.json(
        { 
          error: error.message,
          code: 'INSUFFICIENT_STOCK',
        },
        { status: 400 }
      );
    }

    if (error.message?.includes('not found')) {
      return NextResponse.json(
        { 
          error: error.message,
          code: 'PRODUCT_NOT_FOUND',
          suggestion: 'One or more items in your cart are no longer available. Please refresh your cart and try again.'
        },
        { status: 404 }
      );
    }

    // Database connection errors
    if (error.message?.includes('ECONNREFUSED') || 
        error.message?.includes('database') ||
        error.message?.includes('connection')) {
      console.error('❌ Database connection error detected');
      return NextResponse.json(
        { 
          error: 'Database connection error. Please try again.',
          code: 'DATABASE_ERROR',
          suggestion: 'Please try Razorpay payment or Cash on Delivery option.',
        },
        { status: 503 }
      );
    }

    // Return detailed error for debugging in development, generic in production
    return NextResponse.json(
      { 
        error: 'Failed to create payment. Please try again.',
        code: 'PAYMENT_CREATION_ERROR',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          type: error.name,
          stack: error.stack?.split('\n').slice(0, 3).join('\n'),
        } : undefined,
        suggestion: 'Please try Razorpay payment or Cash on Delivery option.',
      },
      { status: 500 }
    );
  }
}
