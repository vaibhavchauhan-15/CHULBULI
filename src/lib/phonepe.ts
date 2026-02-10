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

// Standard Checkout v2 uses different base URLs for different environments
// Sandbox: https://api-preprod.phonepe.com/apis/pg-sandbox
// Production: https://api.phonepe.com/apis/pg
const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg';

// Authorization URL (separate endpoint in production)
// Sandbox: https://api-preprod.phonepe.com/apis/pg-sandbox
// Production: https://api.phonepe.com/apis/identity-manager
const PHONEPE_AUTH_URL = process.env.PHONEPE_AUTH_URL || 'https://api.phonepe.com/apis/identity-manager';

// Application base URL (no trailing slash)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Token caching to avoid unnecessary token requests
let cachedToken: { access_token: string; expires_at: number } | null = null;

// Detect environment from payment URL
// Test/Sandbox environments use: mercury-t2, mercury-uat, or mercury-stg
// Production uses: mercury.phonepe.com
export function getPhonePeEnvironment(paymentUrl?: string): 'sandbox' | 'production' {
  // If we have a payment URL, detect from it
  if (paymentUrl) {
    if (paymentUrl.includes('mercury-t2') || 
        paymentUrl.includes('mercury-uat') || 
        paymentUrl.includes('mercury-stg')) {
      return 'sandbox';
    }
    return 'production';
  }
  
  // Otherwise detect from base URL configuration
  if (PHONEPE_BASE_URL.includes('preprod') || PHONEPE_BASE_URL.includes('sandbox')) {
    return 'sandbox';
  }
  return 'production';
}

// Get the correct checkout script URL based on environment
export function getPhonePeCheckoutScriptUrl(paymentUrl?: string): string {
  const env = getPhonePeEnvironment(paymentUrl);
  
  // Sandbox/Test environments use mercury-stg.phonepe.com
  // Production uses mercury.phonepe.com
  return env === 'sandbox'
    ? 'https://mercury-stg.phonepe.com/web/bundle/checkout.js'
    : 'https://mercury.phonepe.com/web/bundle/checkout.js';
}

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
 * Implements token caching to avoid unnecessary API calls
 * 
 * @param {boolean} forceRefresh - Force token refresh even if cached token is valid
 * @returns {Promise<{access_token: string, expires_at: number}>}
 */
export async function getPhonePeToken(forceRefresh: boolean = false) {
  validatePhonePeConfig();

  // Check if we have a valid cached token (with 5 minute buffer before expiry)
  const now = Math.floor(Date.now() / 1000);
  if (!forceRefresh && cachedToken && cachedToken.expires_at > (now + 300)) {
    console.log('✅ Using cached PhonePe token (expires in', cachedToken.expires_at - now, 'seconds)');
    return cachedToken;
  }

  try {
    console.log('PhonePe: Requesting new OAuth token...');
    console.log('PhonePe Config:', {
      client_id: PHONEPE_CLIENT_ID,
      client_version: PHONEPE_CLIENT_VERSION,
      auth_url: PHONEPE_AUTH_URL,
      base_url: PHONEPE_BASE_URL,
    });

    // Prepare URL-encoded request body (OAuth 2.0 standard format)
    const params = new URLSearchParams({
      client_id: PHONEPE_CLIENT_ID,
      client_secret: PHONEPE_CLIENT_SECRET,
      grant_type: 'client_credentials',
      client_version: PHONEPE_CLIENT_VERSION,
    });

    const tokenEndpoint = `${PHONEPE_AUTH_URL}/v1/oauth/token`;
    console.log('Token endpoint:', tokenEndpoint);

    // Standard Checkout: Use dedicated auth endpoint for token
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const responseText = await response.text();
    console.log('PhonePe Token Response Status:', response.status);
    
    if (response.status !== 200) {
      console.error('PhonePe Token Error Response:', responseText);
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      console.error('PhonePe Token Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        endpoint: tokenEndpoint,
      });
      
      // Provide specific error messages
      if (response.status === 401 || response.status === 403) {
        throw new Error(`PhonePe Authentication Failed: Invalid Client ID or Client Secret. Please verify your credentials in the environment variables.`);
      } else if (response.status === 404) {
        throw new Error(`PhonePe API Endpoint Not Found: ${tokenEndpoint}. Please verify PHONEPE_AUTH_URL is correct for your environment.`);
      }
      
      throw new Error(`Failed to get PhonePe token: ${errorData.message || errorData.code || response.statusText} (Status: ${response.status})`);
    }

    const tokenData = JSON.parse(responseText);
    
    // Cache the token with expiry time
    cachedToken = {
      access_token: tokenData.access_token,
      expires_at: tokenData.expires_at || (now + 86400), // Default 24h if not provided
    };
    
    console.log('✅ PhonePe OAuth token obtained successfully');
    console.log('Token expires at:', new Date(cachedToken.expires_at * 1000).toISOString());
    return cachedToken;
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
    // Validate amount before making API call (PhonePe minimum: 100 paisa = ₹1)
    const amountInPaise = Math.round(orderDetails.amount * 100);
    if (amountInPaise < 100) {
      throw new Error(
        `PhonePe requires a minimum payment of ₹1 (100 paisa). Your order amount is ₹${orderDetails.amount.toFixed(2)} (${amountInPaise} paisa).`
      );
    }

    // Step 1: Get OAuth access token (REQUIRED for v2)
    let tokenData;
    try {
      tokenData = await getPhonePeToken();
    } catch (tokenError: any) {
      console.error('Failed to get PhonePe token:', tokenError);
      // Try once more with force refresh
      try {
        console.log('Retrying token request with force refresh...');
        tokenData = await getPhonePeToken(true);
      } catch (retryError: any) {
        throw new Error(`PhonePe authentication failed after retry: ${retryError.message}`);
      }
    }

    // Prepare payment request payload according to Standard Checkout v2 documentation
    const payload = {
      merchantOrderId: orderDetails.merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200, // 20 minutes expiry
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: `Payment for Order #${orderDetails.merchantOrderId}`,
        merchantUrls: {
          redirectUrl: `${APP_URL}/order-success?orderId=${orderDetails.orderId}`
        }
      },
      metaInfo: {
        udf1: orderDetails.orderId,
        udf2: orderDetails.customerEmail,
        udf3: orderDetails.customerName,
        udf4: orderDetails.customerPhone
      }
    };

    const paymentEndpoint = `${PHONEPE_BASE_URL}/checkout/v2/pay`;

    console.log('PhonePe Standard Checkout v2: Creating payment order...');
    console.log('Request Details:', {
      endpoint: paymentEndpoint,
      merchantOrderId: orderDetails.merchantOrderId,
      amount: amountInPaise,
      amountInRupees: orderDetails.amount,
      redirectUrl: payload.paymentFlow.merchantUrls.redirectUrl,
      hasToken: !!tokenData?.access_token,
      tokenLength: tokenData?.access_token?.length || 0,
    });

    // Create payment using Standard Checkout v2 API
    // Uses plain JSON with O-Bearer token (NO Base64, NO checksum)
    const response = await fetch(paymentEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('PhonePe Payment Response Status:', response.status);
    
    if (response.status !== 200 && response.status !== 201) {
      console.error('PhonePe Payment Error Response:', responseText);
      console.error('Sent Payload:', JSON.stringify(payload, null, 2));
    }

    let paymentData;
    try {
      paymentData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse PhonePe response:', parseError);
      throw new Error(`Invalid response from PhonePe: ${responseText}`);
    }

    // OAuth v2 response validation - check for error responses
    if (!response.ok) {
      console.error('PhonePe Order Creation Failed');
      console.error('Response Status:', response.status, response.statusText);
      console.error('Response Body:', paymentData);
      console.error('Sent Payload:', JSON.stringify(payload, null, 2));
      console.error('Request Headers:', {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${tokenData.access_token.substring(0, 20)}...${tokenData.access_token.substring(tokenData.access_token.length - 10)}`,
        'Endpoint': paymentEndpoint,
      });
      
      // Handle token expiry - retry with fresh token
      if (response.status === 401 && paymentData.code === 'UNAUTHORIZED') {
        console.log('Token expired or invalid, retrying with fresh token...');
        try {
          const freshTokenData = await getPhonePeToken(true);
          const retryResponse = await fetch(paymentEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `O-Bearer ${freshTokenData.access_token}`,
            },
            body: JSON.stringify(payload),
          });
          
          const retryResponseText = await retryResponse.text();
          if (retryResponse.ok) {
            const retryPaymentData = JSON.parse(retryResponseText);
            console.log('✅ Retry successful with fresh token');
            return {
              success: true,
              paymentUrl: retryPaymentData.redirectUrl,
              transactionId: retryPaymentData.orderId,
              merchantOrderId: orderDetails.merchantOrderId,
            };
          }
        } catch (retryError) {
          console.error('Retry with fresh token failed:', retryError);
        }
      }
      
      // Check for minimum amount error (PhonePe requires minimum ₹1)
      if (paymentData.message?.includes('amount must be greater than or equal to 100') ||
          paymentData.message?.includes('minimum amount')) {
        throw new Error(
          `PhonePe requires a minimum payment of ₹1 (100 paisa). Your order amount is ₹${(amountInPaise / 100).toFixed(2)}. Please ensure the order total is at least ₹1.`
        );
      }
      
      // Provide helpful error messages for common issues
      if (paymentData.code === 'KEY_NOT_CONFIGURED' || 
          paymentData.errorCode === 'KEY_NOT_CONFIGURED' ||
          paymentData.code === 'MERCHANT_NOT_CONFIGURED' ||
          paymentData.message?.includes('not configured') ||
          paymentData.message?.includes('not authorized')) {
        throw new Error(
          `⚠️ PhonePe Merchant Configuration Error: Your merchant account is not properly configured for Standard Checkout.\n\nPossible causes:\n1. Merchant account not activated for production\n2. Invalid credentials for production environment\n3. API not enabled in PhonePe Dashboard\n4. Client ID/Secret mismatch\n\nCurrent environment: ${PHONEPE_BASE_URL.includes('preprod') ? 'SANDBOX' : 'PRODUCTION'}\nClient ID: ${PHONEPE_CLIENT_ID}\n\nAction required: Verify credentials in PhonePe Business Dashboard and ensure production API access is enabled.`
        );
      }

      if (paymentData.code === 'BAD_REQUEST' || 
          paymentData.errorCode === 'PR000' || 
          paymentData.message?.includes('Bad Request')) {
        throw new Error(
          `PhonePe Bad Request - Invalid payload structure. Error: ${paymentData.message || 'Check request format'}. Code: ${paymentData.code || paymentData.errorCode}`
        );
      }

      if (response.status === 404) {
        throw new Error(
          `PhonePe API Endpoint Not Found: ${paymentEndpoint}. Please verify PHONEPE_BASE_URL is correct.`
        );
      }

      if (response.status >= 500) {
        throw new Error(
          `PhonePe Server Error (${response.status}): ${paymentData.message || 'PhonePe service is temporarily unavailable'}. Please try again in a few moments.`
        );
      }
      
      throw new Error(
        `Failed to create PhonePe order: ${paymentData.message || paymentData.errorCode || paymentData.code || response.statusText} (Status: ${response.status})`
      );
    }

    // Standard Checkout v2 response structure:
    // { orderId, state, expireAt, redirectUrl }
    
    let paymentUrl;
    let transactionId;

    // Extract data from Standard Checkout v2 response
    if (paymentData.redirectUrl && paymentData.orderId) {
      paymentUrl = paymentData.redirectUrl;
      transactionId = paymentData.orderId;
      console.log('✅ PhonePe Standard Checkout payment created successfully');
      console.log('Payment State:', paymentData.state);
      console.log('Expires At:', new Date(paymentData.expireAt));
    }
    else {
      console.error('Cannot extract payment URL from response:', JSON.stringify(paymentData, null, 2));
      throw new Error('PhonePe response missing redirectUrl. Received: ' + JSON.stringify(paymentData));
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
    // Step 1: Get OAuth access token (REQUIRED for Standard Checkout v2)
    const tokenData = await getPhonePeToken();

    // Standard Checkout v2 status endpoint: /checkout/v2/order/{merchantOrderId}/status
    // Documentation: https://developer.phonepe.com/v1/docs/order-status-api
    const statusEndpoint = `/checkout/v2/order/${merchantOrderId}/status`;

    console.log('PhonePe Standard Checkout v2: Checking payment status...', {
      merchantOrderId: merchantOrderId,
      endpoint: `${PHONEPE_BASE_URL}${statusEndpoint}`,
      hasToken: !!tokenData.access_token,
    });

    // Check payment status with optional query parameters
    // details=false: Returns only latest payment attempt (recommended for most cases)
    // errorContext=true: Includes detailed error information if payment failed
    const statusUrl = `${PHONEPE_BASE_URL}${statusEndpoint}?details=false&errorContext=true`;
    
    const response = await fetch(
      statusUrl,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${tokenData.access_token}`,
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

    // Standard Checkout v2 response structure (per documentation):
    // https://developer.phonepe.com/v1/docs/order-status-api#response-parameters
    // {
    //   orderId: "OMO...",  // PhonePe internal order ID
    //   state: "COMPLETED",  // PENDING, COMPLETED, FAILED
    //   amount: 1000,  // in paisa
    //   expireAt: 1711867462542,  // epoch timestamp
    //   metaInfo: { udf1: "...", ... },
    //   paymentDetails: [{ paymentMode, transactionId, timestamp, amount, state, ... }]
    // }

    return {
      success: statusData.state === 'COMPLETED',
      status: statusData.state === 'COMPLETED' ? 'PAYMENT_SUCCESS' : 
              statusData.state === 'FAILED' ? 'PAYMENT_ERROR' : 'PAYMENT_PENDING',
      state: statusData.state, // COMPLETED, FAILED, PENDING
      transactionId: statusData.paymentDetails?.[0]?.transactionId || statusData.orderId,
      amount: statusData.amount,
      paymentDetails: statusData.paymentDetails,
      metaInfo: statusData.metaInfo, // User-defined fields we sent
      errorCode: statusData.errorCode, // Present only if FAILED
      errorContext: statusData.errorContext, // Detailed error info if errorContext=true
    };
  } catch (error: any) {
    console.error('PhonePe Status Verification Error:', error);
    throw new Error(`Failed to verify payment status: ${error.message}`);
  }
}

/**
 * Verify PhonePe Webhook Signature for Standard Checkout
 * IMPORTANT: Always verify webhook signatures to prevent fraud
 * PhonePe sends Authorization header with SHA256(username:password)
 * 
 * @param {string} authHeader - Authorization header value from webhook
 * @returns {boolean} - True if signature is valid
 */
export function verifyWebhookSignature(authHeader: string): boolean {
  try {
    if (!authHeader) {
      console.error('Missing Authorization header for webhook verification');
      return false;
    }

    // Get webhook credentials from environment
    const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME;
    const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD;

    if (!webhookUsername || !webhookPassword) {
      console.error('Webhook credentials not configured in environment');
      return false;
    }

    // Compute expected hash: SHA256(username:password)
    const credentials = `${webhookUsername}:${webhookPassword}`;
    const expectedHash = crypto.createHash('sha256').update(credentials).digest('hex');

    // Compare with received hash
    const isValid = authHeader === expectedHash;

    if (!isValid) {
      console.error('Webhook signature verification failed:', {
        receivedHash: authHeader.substring(0, 20) + '...',
        expectedHash: expectedHash.substring(0, 20) + '...',
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
