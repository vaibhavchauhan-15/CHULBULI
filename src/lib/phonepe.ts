/**
 * PhonePe Payment Gateway Integration Service
 * 
 * This module handles PhonePe payment gateway integration for Chulbuli Jewels.
 * Uses OAuth-based Standard Checkout (v2) API.
 * 
 * Authentication: OAuth 2.0 with Client ID and Client Secret
 */

import crypto from 'crypto';

// PhonePe Configuration from environment variables
const PHONEPE_CLIENT_ID = process.env.PHONEPE_CLIENT_ID!;
const PHONEPE_CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET!;
const PHONEPE_CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || '1';
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Environment validation
 */
function validatePhonePeConfig() {
  if (!PHONEPE_CLIENT_ID || !PHONEPE_CLIENT_SECRET) {
    throw new Error(
      'PhonePe configuration missing. Please check environment variables: PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET must be set with your PhonePe OAuth credentials.'
    );
  }
}

/**
 * Get OAuth Access Token from PhonePe
 * Required for OAuth v2 Standard Checkout - MUST be called before payment creation
 * 
 * @returns {Promise<{access_token: string, expires_in: number}>}
 */
export async function getPhonePeToken() {
  validatePhonePeConfig();

  try {
    console.log('PhonePe: Requesting OAuth token...');

    // Prepare URL-encoded request body (OAuth 2.0 standard format)
    const params = new URLSearchParams({
      client_id: PHONEPE_CLIENT_ID,
      client_secret: PHONEPE_CLIENT_SECRET,
      grant_type: 'client_credentials',
      client_version: PHONEPE_CLIENT_VERSION,
    });

    const response = await fetch(`${PHONEPE_BASE_URL}/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const responseText = await response.text();
    console.log('PhonePe Token Response Status:', response.status);
    console.log('PhonePe Token Response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      console.error('PhonePe Token Error:', errorData);
      throw new Error(`Failed to get PhonePe token: ${errorData.message || response.statusText}`);
    }

    const tokenData = JSON.parse(responseText);
    console.log('✅ PhonePe OAuth token obtained successfully');
    return tokenData;
  } catch (error: any) {
    console.error('PhonePe Token Error:', error);
    throw new Error(`Failed to authenticate with PhonePe: ${error.message}`);
  }
}

/**
 * Create PhonePe Payment Order
 * Uses OAuth-based Standard Checkout (v2) API
 * 
 * @param {Object} orderDetails - Order details for payment
 * @param {string} orderDetails.merchantOrderId - Unique merchant order ID
 * @param {number} orderDetails.amount - Order amount in rupees (will be converted to paise)
 * @param {string} orderDetails.orderId - Internal order ID from database
 * @param {string} orderDetails.customerName - Customer name
 * @param {string} orderDetails.customerEmail - Customer email
 * @param {string} orderDetails.customerPhone - Customer phone number (10 digits)
 * 
 * @returns {Promise<{success: boolean, paymentUrl: string, transactionId: string}>}
 */
export async function createPhonePeOrder(orderDetails: {
  merchantOrderId: string;
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) {
  validatePhonePeConfig();

  try {
    // Step 1: Get OAuth access token (REQUIRED for v2)
    const tokenData = await getPhonePeToken();

    // Convert amount to paise (PhonePe requires amount in paise)
    const amountInPaise = Math.round(orderDetails.amount * 100);

    // Clean phone number (remove +91 if present and ensure 10 digits)
    const cleanPhone = orderDetails.customerPhone.replace(/^\+91/, '').replace(/\D/g, '').slice(-10);

    // Extract merchant ID from CLIENT_ID (format: M23BHBY0J6I85_2602091507)
    const merchantId = PHONEPE_CLIENT_ID.split('_')[0];
    
    // Generate merchant user ID from phone
    const merchantUserId = `MU${cleanPhone}`;

    // Prepare payment request payload for PhonePe OAuth v2 Standard Checkout
    const payload = {
      merchantId: merchantId,
      merchantOrderId: orderDetails.merchantOrderId,  // OAuth v2 uses merchantOrderId
      merchantUserId: merchantUserId,
      amount: amountInPaise,
      redirectUrl: `${APP_URL}/order-success?orderId=${orderDetails.orderId}`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${APP_URL}/api/payment/phonepe/webhook`,
      mobileNumber: cleanPhone,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('PhonePe OAuth v2: Creating payment order...', {
      merchantId,
      merchantOrderId: orderDetails.merchantOrderId,
      amount: amountInPaise,
      endpoint: `${PHONEPE_BASE_URL}/pg/v1/pay`,
      hasToken: !!tokenData.access_token,
      payloadPreview: payload,
    });

    // Create payment order using OAuth v2
    // OAuth v2 uses plain JSON with O-Bearer token (NO Base64, NO checksum)
    const response = await fetch(`${PHONEPE_BASE_URL}/pg/v1/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('PhonePe Payment Response Status:', response.status);
    console.log('PhonePe Payment Response:', responseText);

    let paymentData;
    try {
      paymentData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse PhonePe response:', parseError);
      throw new Error(`Invalid response from PhonePe: ${responseText}`);
    }

    // OAuth v2 response validation - check for error responses
    if (!response.ok) {
      console.error('PhonePe Order Creation Error:', paymentData);
      console.error('Sent Payload:', payload);
      console.error('Request Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${tokenData.access_token.substring(0, 20)}...`,
      });
      
      // Provide helpful error messages for common issues
      if (paymentData.code === 'KEY_NOT_CONFIGURED' || paymentData.errorCode === 'KEY_NOT_CONFIGURED') {
        throw new Error(
          `⚠️ PhonePe Merchant Configuration Error: Your merchant account is not properly configured for Standard Checkout.

Possible causes:
1. Merchant account not activated - Contact PhonePe support to activate your merchant account for Standard Checkout
2. Using test/demo credentials - Verify you're using actual credentials from PhonePe Business Dashboard
3. API not enabled - Enable "Standard Checkout API" in PhonePe Dashboard under Settings > API Configuration
4. Sandbox not configured - For testing, ensure your merchant is enabled for sandbox environment

Current credentials:
- Merchant ID: ${merchantId}
- Client ID: ${PHONEPE_CLIENT_ID}

Action required: Contact PhonePe support or check your merchant dashboard settings.`
        );
      }

      if (paymentData.errorCode === 'PR000' || paymentData.message === 'Bad Request') {
        throw new Error(
          `PhonePe Bad Request - Invalid payload structure. Error: ${paymentData.message}. Please check PhonePe API documentation for correct payload format.`
        );
      }
      
      throw new Error(
        `Failed to create PhonePe order: ${paymentData.message || paymentData.errorCode || paymentData.code || response.statusText}`
      );
    }

    // OAuth v2 successful response - validate and extract data
    // Response can have different structures:
    // 1. Standard: { success: true, data: { instrumentResponse: { redirectInfo: { url: "..." } } } }
    // 2. Alternative: { orderId, state, expireAt, redirectUrl }
    
    let paymentUrl;
    let transactionId;

    // Check for standard OAuth v2 response with instrumentResponse
    if (paymentData.success && paymentData.data?.instrumentResponse?.redirectInfo?.url) {
      paymentUrl = paymentData.data.instrumentResponse.redirectInfo.url;
      transactionId = paymentData.data.merchantTransactionId || paymentData.data.transactionId || orderDetails.merchantOrderId;
      console.log('✅ PhonePe payment order created successfully (standard response)');
    }
    // Check for alternative response with orderId
    else if (paymentData.orderId && paymentData.state) {
      // For this response type, construct payment URL from orderId
      const isProduction = PHONEPE_BASE_URL.includes('api.phonepe.com');
      const mercuryBaseUrl = isProduction 
        ? 'https://mercury.phonepe.com' 
        : 'https://mercury-uat.phonepe.com';
      paymentUrl = `${mercuryBaseUrl}/transact/simulator?token=${paymentData.orderId}`;
      transactionId = paymentData.orderId;
      console.log('✅ PhonePe payment order created successfully (alternative response)');
      console.log('Constructed payment URL from orderId:', paymentData.orderId);
    }
    // Check for direct paymentUrl in response
    else if (paymentData.paymentUrl) {
      paymentUrl = paymentData.paymentUrl;
      transactionId = paymentData.transactionId || paymentData.orderId || orderDetails.merchantOrderId;
      console.log('✅ PhonePe payment order created successfully (direct URL)');
    }
    else {
      console.error('Cannot extract payment URL from response:', JSON.stringify(paymentData, null, 2));
      throw new Error('PhonePe response missing payment URL. Received: ' + JSON.stringify(paymentData));
    }

    if (!paymentUrl) {
      console.error('No payment URL found after extraction:', paymentData);
      throw new Error('PhonePe did not return a payment URL');
    }

    console.log('Payment URL:', paymentUrl);
    console.log('Transaction ID:', transactionId);

    return {
      success: true,
      paymentUrl: paymentUrl,
      transactionId: transactionId,
      merchantOrderId: orderDetails.merchantOrderId,
    };
  } catch (error: any) {
    console.error('PhonePe Order Creation Error:', error);
    throw new Error(`Failed to create payment with PhonePe: ${error.message}`);
  }
}

/**
 * Verify PhonePe Payment Status
 * This is used as a fallback if webhook fails
 * Uses OAuth-based Standard Checkout (v2) API
 * 
 * @param {string} merchantOrderId - Merchant order ID used during payment creation
 * @returns {Promise<{success: boolean, status: string, transactionId?: string}>}
 */
export async function verifyPhonePePayment(merchantOrderId: string) {
  validatePhonePeConfig();

  try {
    // Step 1: Get OAuth access token (REQUIRED for v2)
    const tokenData = await getPhonePeToken();

    // Extract merchant ID from CLIENT_ID (format: M23BHBY0J6I85_2602091507)
    const merchantId = PHONEPE_CLIENT_ID.split('_')[0];

    // OAuth v2 status endpoint
    const statusEndpoint = `/pg/v1/status/${merchantId}/${merchantOrderId}`;

    console.log('PhonePe OAuth v2: Checking payment status...', {
      merchantId,
      merchantOrderId: merchantOrderId,
      endpoint: `${PHONEPE_BASE_URL}${statusEndpoint}`,
      hasToken: !!tokenData.access_token,
    });

    // Check payment status (OAuth v2 - NO checksum, NO X-VERIFY)
    const response = await fetch(
      `${PHONEPE_BASE_URL}${statusEndpoint}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${tokenData.access_token}`,  // OAuth v2 uses O-Bearer prefix
        },
      }
    );

    const responseText = await response.text();
    console.log('PhonePe Status Response:', responseText);

    let statusData;
    try {
      statusData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse PhonePe status response:', parseError);
      throw new Error(`Invalid response from PhonePe: ${responseText}`);
    }

    if (!response.ok) {
      console.error('PhonePe Status Check Error:', statusData);
      throw new Error(`Failed to verify payment: ${statusData.message || statusData.code || response.statusText}`);
    }

    // OAuth v2 response structure:
    // success: true/false
    // code: PAYMENT_SUCCESS, PAYMENT_ERROR, PAYMENT_PENDING, etc.
    // data: { merchantOrderId, transactionId, amount, state, etc. }

    return {
      success: statusData.success,
      status: statusData.code, // PAYMENT_SUCCESS, PAYMENT_PENDING, PAYMENT_ERROR, etc.
      state: statusData.data?.state, // COMPLETED, FAILED, PENDING
      transactionId: statusData.data?.transactionId,
      amount: statusData.data?.amount,
      paymentInstrument: statusData.data?.paymentInstrument,
    };
  } catch (error: any) {
    console.error('PhonePe Status Verification Error:', error);
    throw new Error(`Failed to verify payment status: ${error.message}`);
  }
}

/**
 * Verify PhonePe Webhook Signature
 * IMPORTANT: Always verify webhook signatures to prevent fraud
 * PhonePe sends X-VERIFY header with webhooks for verification
 * 
 * Format: SHA256(base64Response + saltKey) + ### + saltIndex
 * 
 * @param {string} base64Response - Base64 encoded response from PhonePe webhook
 * @param {string} signature - X-VERIFY header value from webhook
 * @returns {boolean} - True if signature is valid
 */
export function verifyWebhookSignature(base64Response: string, signature: string): boolean {
  try {
    if (!signature || !base64Response) {
      console.error('Missing signature or response for webhook verification');
      return false;
    }

    // Remove the salt index from signature (format: hash###saltIndex)
    const receivedHash = signature.split('###')[0];
    
    // Compute checksum: SHA256(base64Response + saltKey)
    const checksumString = base64Response + PHONEPE_CLIENT_SECRET;
    const computedHash = crypto.createHash('sha256').update(checksumString).digest('hex');

    const isValid = computedHash === receivedHash;

    if (!isValid) {
      console.error('Webhook signature verification failed:', {
        receivedSignature: signature,
        computedHash,
      });
    } else {
      console.log('✅ Webhook signature verified successfully');
    }
    
    return isValid;
  } catch (error) {
    console.error('Webhook Signature Verification Error:', error);
    return false;
  }
}

/**
 * Generate unique merchant order ID
 * Format: CHULBULI-{timestamp}-{random}
 * 
 * @returns {string} - Unique merchant order ID
 */
export function generateMerchantOrderId(): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `CHULBULI-${timestamp}-${random}`;
}

/**
 * Parse PhonePe webhook event
 * 
 * @param {Object} webhookData - Raw webhook data from PhonePe
 * @returns {Object} - Parsed webhook event
 */
export function parseWebhookEvent(webhookData: any) {
  return {
    eventType: webhookData.event || webhookData.type,
    merchantOrderId: webhookData.data?.merchantOrderId || webhookData.merchantOrderId,
    transactionId: webhookData.data?.transactionId || webhookData.transactionId,
    amount: webhookData.data?.amount,
    paymentStatus: webhookData.data?.status || webhookData.status,
    paymentInstrument: webhookData.data?.paymentInstrument,
    metaInfo: webhookData.data?.metaInfo,
    timestamp: webhookData.timestamp || new Date().toISOString(),
  };
}
