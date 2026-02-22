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
const PHONEPE_CLIENT_ID = (process.env.PHONEPE_CLIENT_ID || '').trim();
const PHONEPE_CLIENT_SECRET = (process.env.PHONEPE_CLIENT_SECRET || '').trim();
const PHONEPE_CLIENT_VERSION = (process.env.PHONEPE_CLIENT_VERSION || '1').trim();

// Standard Checkout v2 uses different base URLs for different environments
// Sandbox: https://api-preprod.phonepe.com/apis/pg-sandbox
// Production: https://api.phonepe.com/apis/pg
const PHONEPE_BASE_URL = (process.env.PHONEPE_BASE_URL || 'https://api.phonepe.com/apis/pg').trim().replace(/\/+$/, '');

// Authorization URL (separate endpoint in production)
// Sandbox: https://api-preprod.phonepe.com/apis/pg-sandbox
// Production: https://api.phonepe.com/apis/identity-manager
const PHONEPE_AUTH_URL = (process.env.PHONEPE_AUTH_URL || 'https://api.phonepe.com/apis/identity-manager').trim().replace(/\/+$/, '');

// Application base URL (no trailing slash)
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000').trim();

// Token caching to avoid unnecessary token requests
let cachedToken: { access_token: string; expires_at: number } | null = null;

// Log PhonePe environment configuration on initialization
if (process.env.NODE_ENV === 'development') {
  const environment = PHONEPE_BASE_URL.includes('preprod') || PHONEPE_BASE_URL.includes('sandbox') ? 'SANDBOX' : 'PRODUCTION';
  console.log('🔧 PhonePe Configuration Loaded:', {
    environment,
    baseUrl: PHONEPE_BASE_URL,
    authUrl: PHONEPE_AUTH_URL,
    hasClientId: !!PHONEPE_CLIENT_ID,
    hasClientSecret: !!PHONEPE_CLIENT_SECRET,
    appUrl: APP_URL,
  });
}

function trimTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function isValidHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function toSafeMetaValue(value: string, maxLength: number): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

function resolveAppUrl(overrideAppUrl?: string): string {
  const candidates = [
    overrideAppUrl,
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    APP_URL,
  ].filter(Boolean) as string[];

  const resolved = candidates.find((candidate) => isValidHttpUrl(candidate));

  if (!resolved) {
    throw new Error('PhonePe redirect URL configuration is invalid. Set NEXT_PUBLIC_APP_URL or APP_URL to your HTTPS domain.');
  }

  const normalized = trimTrailingSlash(resolved);

  if (process.env.NODE_ENV === 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)) {
    throw new Error('PhonePe redirect URL cannot use localhost in production. Configure NEXT_PUBLIC_APP_URL/APP_URL with your live domain.');
  }

  return normalized;
}

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
    return cachedToken;
  }

  try {
    // Prepare URL-encoded request body (OAuth 2.0 standard format)
    const params = new URLSearchParams({
      client_id: PHONEPE_CLIENT_ID,
      client_secret: PHONEPE_CLIENT_SECRET,
      grant_type: 'client_credentials',
      client_version: PHONEPE_CLIENT_VERSION,
    });

    // Construct token endpoint - append path if not already present
    // Sandbox: PHONEPE_AUTH_URL may include full path /v1/oauth/token
    // Production: PHONEPE_AUTH_URL is base URL, need to append path
    const tokenEndpoint = PHONEPE_AUTH_URL.endsWith('/v1/oauth/token') 
      ? PHONEPE_AUTH_URL 
      : `${PHONEPE_AUTH_URL}/v1/oauth/token`;

    // Standard Checkout: Use dedicated auth endpoint for token
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      console.error('❌ PhonePe Token Request Failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
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
    
    console.log('✅ PhonePe OAuth token obtained successfully', {
      expiresAt: tokenData.expires_at ? new Date(tokenData.expires_at * 1000).toISOString() : 'unknown',
      hasAccessToken: !!tokenData.access_token,
    });
    
    // Cache the token with expiry time
    cachedToken = {
      access_token: tokenData.access_token,
      expires_at: tokenData.expires_at || (now + 86400), // Default 24h if not provided
    };
    
    return cachedToken;
  } catch (error: any) {
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
  appUrl?: string;
}) {
  validatePhonePeConfig();

  // Validate all required parameters
  if (!orderDetails) {
    throw new Error('Order details are required');
  }

  if (!orderDetails.merchantOrderId || typeof orderDetails.merchantOrderId !== 'string') {
    throw new Error('Valid merchantOrderId is required');
  }
  if (orderDetails.merchantOrderId.length > 63 || !/^[A-Za-z0-9_-]+$/.test(orderDetails.merchantOrderId)) {
    throw new Error('merchantOrderId must be <= 63 chars and contain only letters, digits, underscore, and hyphen');
  }

  if (!orderDetails.orderId || typeof orderDetails.orderId !== 'string') {
    throw new Error('Valid orderId is required');
  }

  if (typeof orderDetails.amount !== 'number' || orderDetails.amount <= 0) {
    throw new Error(`Valid amount is required (received: ${orderDetails.amount})`);
  }

  if (!orderDetails.customerName || typeof orderDetails.customerName !== 'string') {
    throw new Error('Valid customerName is required');
  }

  if (!orderDetails.customerEmail || typeof orderDetails.customerEmail !== 'string') {
    throw new Error('Valid customerEmail is required');
  }

  if (!orderDetails.customerPhone || typeof orderDetails.customerPhone !== 'string') {
    throw new Error('Valid customerPhone is required');
  }

  try {
    // Validate amount before making API call (PhonePe minimum: 100 paisa = ₹1)
    const appUrl = resolveAppUrl(orderDetails.appUrl);
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
      // Try once more with force refresh
      try {
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
          redirectUrl: `${appUrl}/order-success?orderId=${encodeURIComponent(orderDetails.orderId)}`
        }
      },
      metaInfo: {
        udf1: toSafeMetaValue(orderDetails.orderId, 256),
        udf2: toSafeMetaValue(orderDetails.customerEmail, 256),
        udf3: toSafeMetaValue(orderDetails.customerName, 256),
        udf4: toSafeMetaValue(orderDetails.customerPhone, 256)
      }
    };

    const paymentEndpoint = `${PHONEPE_BASE_URL}/checkout/v2/pay`;

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

    let paymentData;
    try {
      paymentData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid response from PhonePe: ${responseText}`);
    }

    // OAuth v2 response validation - check for error responses
    if (!response.ok) {
      // Handle token expiry - retry with fresh token
      if (response.status === 401 || paymentData?.code === 'UNAUTHORIZED') {
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
            return {
              success: true,
              paymentUrl: retryPaymentData.redirectUrl,
              transactionId: retryPaymentData.orderId,
              merchantOrderId: orderDetails.merchantOrderId,
            };
          }
        } catch (retryError) {
          // Retry failed, continue to error handling below
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
          `PhonePe Bad Request - Invalid payload structure or configuration. Error: ${paymentData.message || 'Check request format'}. Code: ${paymentData.code || paymentData.errorCode}`
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
    }
    else {
      throw new Error('PhonePe response missing redirectUrl. Received: ' + JSON.stringify(paymentData));
    }

    if (!paymentUrl) {
      throw new Error('PhonePe did not return a payment URL');
    }

    return {
      success: true,
      paymentUrl: paymentUrl,
      transactionId: transactionId,
      merchantOrderId: orderDetails.merchantOrderId,
    };
  } catch (error: any) {
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
export async function verifyPhonePePayment(
  merchantOrderId: string,
  options?: { details?: boolean; errorContext?: boolean }
) {
  validatePhonePeConfig();

  try {
    // Step 1: Get OAuth access token (REQUIRED for Standard Checkout v2)
    const tokenData = await getPhonePeToken();

    // Standard Checkout v2 status endpoint: /checkout/v2/order/{merchantOrderId}/status
    // Documentation: https://developer.phonepe.com/v1/docs/order-status-api
    const statusEndpoint = `/checkout/v2/order/${merchantOrderId}/status`;

    // Check payment status with optional query parameters
    // details=false: Returns only latest payment attempt (recommended for most cases)
    // errorContext=true: Includes detailed error information if payment failed
    const details = options?.details === true;
    const errorContext = options?.errorContext === true;
    const statusUrl = `${PHONEPE_BASE_URL}${statusEndpoint}?details=${details}&errorContext=${errorContext}`;
    
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

    let statusData;
    try {
      statusData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid response from PhonePe: ${responseText}`);
    }

    if (!response.ok) {
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
      return false;
    }

    // Get webhook credentials from environment
    const webhookUsername = (process.env.PHONEPE_WEBHOOK_USERNAME || '').trim();
    const webhookPassword = (process.env.PHONEPE_WEBHOOK_PASSWORD || '').trim();

    if (!webhookUsername || !webhookPassword) {
      return false;
    }

    // Compute expected hash: SHA256(username:password)
    const credentials = `${webhookUsername}:${webhookPassword}`;
    const expectedHash = crypto.createHash('sha256').update(credentials).digest('hex');

    // PhonePe sends only hash value as Authorization header.
    // Accept optional "sha256=" prefix defensively and compare case-insensitively.
    const normalizedHeader = authHeader.trim().replace(/^sha256=/i, '').toLowerCase();
    const isValid = normalizedHeader === expectedHash.toLowerCase();
    
    return isValid;
  } catch (error) {
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
