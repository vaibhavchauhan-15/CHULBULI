/**
 * PhonePe Payment Gateway Service
 * 
 * Production-grade PhonePe integration using OAuth 2.0 Standard Checkout v2.
 * 
 * Features:
 * - Token caching with automatic refresh
 * - Environment-aware configuration
 * - Comprehensive error handling
 * - Type-safe responses
 * - No direct process.env access
 * 
 * @module payments/phonepe
 */

import crypto from 'crypto';
import { phonepe, app, runtime } from '../config/environment';

// =============================================================================
// TYPES
// =============================================================================

interface PhonePeToken {
  access_token: string;
  expires_at: number;
}

interface PaymentRequest {
  amount: number;
  merchantOrderId: string;
  merchantUserId: string;
  redirectUrl: string;
  redirectMode?: 'GET' | 'POST' | 'REDIRECT';
  callbackUrl?: string;
  mobileNumber?: string;
  userEmail?: string;
  userName?: string;
  billingAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
}

interface PhonePePaymentResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: 'PENDING' | 'COMPLETED' | 'FAILED';
    responseCode: string;
    paymentInstrument?: {
      type: string;
      upiTransactionId?: string;
      cardType?: string;
    };
  };
}

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

/** Cached OAuth token to avoid unnecessary API calls */
let cachedToken: PhonePeToken | null = null;

/**
 * Retrieves a valid PhonePe OAuth access token.
 * Implements token caching with 5-minute expiry buffer.
 * 
 * @param forceRefresh - Force token refresh even if cached token is valid
 * @returns Promise resolving to token object with access_token and expiry
 * @throws Error if authentication fails
 */
export async function getPhonePeToken(forceRefresh: boolean = false): Promise<PhonePeToken> {
  const now = Math.floor(Date.now() / 1000);
  const bufferSeconds = 300; // 5 minutes
  
  // Return cached token if valid
  if (!forceRefresh && cachedToken && cachedToken.expires_at > (now + bufferSeconds)) {
    if (runtime.isDevelopment) {
      console.log(`✅ Using cached PhonePe token (expires in ${cachedToken.expires_at - now}s)`);
    }
    return cachedToken;
  }
  
  // Request new token
  try {
    const params = new URLSearchParams({
      client_id: phonepe.clientId,
      client_secret: phonepe.clientSecret,
      grant_type: 'client_credentials',
      client_version: phonepe.clientVersion,
    });
    
    const tokenEndpoint = `${phonepe.authUrl}/v1/oauth/token`;
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData: any;
      
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      // Provide specific error messages
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `PhonePe authentication failed: Invalid credentials. ` +
          `Verify PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET in your environment.`
        );
      }
      
      if (response.status === 404) {
        throw new Error(
          `PhonePe token endpoint not found: ${tokenEndpoint}. ` +
          `Verify PHONEPE_AUTH_URL is correct for ${phonepe.environment} environment.`
        );
      }
      
      throw new Error(
        `PhonePe token request failed: ${errorData.message || errorData.code || response.statusText} ` +
        `(Status: ${response.status})`
      );
    }
    
    const data = await response.json();
    
    if (!data.access_token || !data.expires_in) {
      throw new Error('PhonePe token response missing required fields');
    }
    
    // Cache the token
    cachedToken = {
      access_token: data.access_token,
      expires_at: now + data.expires_in,
    };
    
    if (runtime.isDevelopment) {
      console.log(`✅ Retrieved new PhonePe token (expires in ${data.expires_in}s)`);
    }
    
    return cachedToken;
  } catch (error) {
    // Clear cached token on error
    cachedToken = null;
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error(`Failed to get PhonePe token: ${String(error)}`);
  }
}

/**
 * Clears the cached token, forcing a refresh on next request
 */
export function clearTokenCache(): void {
  cachedToken = null;
}

// =============================================================================
// PAYMENT OPERATIONS
// =============================================================================

/**
 * Initiates a PhonePe payment transaction.
 * 
 * @param request - Payment request parameters
 * @returns Promise resolving to payment creation response
 * @throws Error if payment creation fails
 */
export async function initiatePayment(request: PaymentRequest): Promise<any> {
  // Validate amount
  if (!request.amount || request.amount <= 0) {
    throw new Error('Payment amount must be greater than 0');
  }
  
  // Get OAuth token
  const token = await getPhonePeToken();
  
  // Prepare payment payload
  const payload: any = {
    merchantId: phonepe.clientId,
    merchantTransactionId: request.merchantOrderId,
    merchantUserId: request.merchantUserId,
    amount: Math.round(request.amount * 100), // Convert to paise
    redirectUrl: request.redirectUrl,
    redirectMode: request.redirectMode || 'POST',
    callbackUrl: request.callbackUrl,
    mobileNumber: request.mobileNumber,
    paymentInstrument: {
      type: 'PAY_PAGE', // PhonePe hosted payment page
    },
  };
  
  // Add optional fields if provided
  if (request.userEmail || request.userName || request.billingAddress) {
    payload.deviceContext = {
      email: request.userEmail,
      name: request.userName,
      billingAddress: request.billingAddress,
    };
  }
  
  try {
    const endpoint = `${phonepe.baseUrl}/v2/payment`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.access_token}`,
        'X-CLIENT-ID': phonepe.clientId,
        'X-CLIENT-VERSION': phonepe.clientVersion,
      },
      body: JSON.stringify(payload),
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(
        `PhonePe payment initiation failed: ${responseData.message || responseData.code || response.statusText} ` +
        `(Status: ${response.status})`
      );
    }
    
    return responseData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to initiate PhonePe payment: ${String(error)}`);
  }
}

/**
 * Checks the status of a PhonePe payment transaction.
 * 
 * @param merchantTransactionId - Your internal transaction ID
 * @returns Promise resolving to payment status response
 * @throws Error if status check fails
 */
export async function checkPaymentStatus(
  merchantTransactionId: string
): Promise<PhonePePaymentResponse> {
  if (!merchantTransactionId) {
    throw new Error('merchantTransactionId is required');
  }
  
  const token = await getPhonePeToken();
  
  try {
    const endpoint = `${phonepe.baseUrl}/v2/status/${phonepe.clientId}/${merchantTransactionId}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.access_token}`,
        'X-CLIENT-ID': phonepe.clientId,
        'X-CLIENT-VERSION': phonepe.clientVersion,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(
        `PhonePe status check failed: ${data.message || data.code || response.statusText} ` +
        `(Status: ${response.status})`
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to check PhonePe payment status: ${String(error)}`);
  }
}

/**
 * Verifies PhonePe callback signature for security.
 * 
 * @param payload - Raw callback payload from PhonePe
 * @param signature - X-VERIFY header from PhonePe callback
 * @returns true if signature is valid, false otherwise
 */
export function verifyCallbackSignature(payload: string, signature: string): boolean {
  try {
    // PhonePe uses SHA256 HMAC for signature verification
    const expectedSignature = crypto
      .createHmac('sha256', phonepe.clientSecret)
      .update(payload)
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('PhonePe signature verification error:', error);
    return false;
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generates redirect URL for payment success/failure callbacks.
 * 
 * @param path - Path to redirect to (e.g., '/order-success')
 * @returns Full redirect URL
 */
export function generateRedirectUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${app.url}${cleanPath}`;
}

/**
 * Generates webhook callback URL for payment notifications.
 * 
 * @param path - API route path (e.g., '/api/payment/phonepe/callback')
 * @returns Full callback URL
 */
export function generateCallbackUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${app.url}${cleanPath}`;
}

/**
 * Returns the PhonePe checkout SDK script URL for the current environment.
 */
export function getCheckoutScriptUrl(): string {
  return phonepe.checkoutScriptUrl;
}

/**
 * Gets the current PhonePe environment (sandbox or production).
 */
export function getEnvironment(): 'sandbox' | 'production' {
  return phonepe.environment;
}

/**
 * Sanitizes metadata values for PhonePe API.
 * 
 * @param value - Value to sanitize
 * @param maxLength - Maximum allowed length
 * @returns Sanitized string value
 */
export function sanitizeMetadata(value: string, maxLength: number): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

/**
 * Generates a unique merchant order ID.
 * Format: CHULBULI-{timestamp}-{random}
 * 
 * @returns Unique merchant order ID (max 63 chars, alphanumeric + underscore/hyphen)
 */
export function generateMerchantOrderId(): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `CHULBULI-${timestamp}-${random}`;
}

/**
 * Parses PhonePe webhook event data.
 * 
 * @param webhookData - Raw webhook data from PhonePe
 * @returns Parsed webhook event with normalized structure
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

/**
 * Verifies PhonePe webhook signature (Standard Checkout v2).
 * Uses SHA256(username:password) authentication.
 * 
 * @param authHeader - Authorization header value from PhonePe webhook
 * @returns true if signature is valid, false otherwise
 */
export function verifyWebhookSignature(authHeader: string): boolean {
  try {
    if (!authHeader) {
      console.error('Missing Authorization header for webhook verification');
      return false;
    }

    // Get webhook credentials from centralized config
    // Note: These need to be added to environment.ts
    const webhookUsername = process.env.PHONEPE_WEBHOOK_USERNAME?.trim() || '';
    const webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD?.trim() || '';

    if (!webhookUsername || !webhookPassword) {
      console.error('⚠️ Webhook credentials not configured. Set PHONEPE_WEBHOOK_USERNAME and PHONEPE_WEBHOOK_PASSWORD');
      return false;
    }

    // Compute expected hash: SHA256(username:password)
    const credentials = `${webhookUsername}:${webhookPassword}`;
    const expectedHash = crypto.createHash('sha256').update(credentials).digest('hex');

    // Normalize header (remove optional "sha256=" prefix)
    const normalizedHeader = authHeader.trim().replace(/^sha256=/i, '').toLowerCase();
    const isValid = normalizedHeader === expectedHash.toLowerCase();

    if (!isValid && runtime.isDevelopment) {
      console.error('Webhook signature verification failed');
    } else if (isValid && runtime.isDevelopment) {
      console.log('✅ Webhook signature verified');
    }
    
    return isValid;
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

// =============================================================================
// BACKWARD COMPATIBILITY WRAPPERS
// =============================================================================

/**
 * Creates PhonePe payment order (Standard Checkout v2).
 * Backward compatible wrapper around initiatePayment().
 * 
 * @param orderDetails - Order details for payment creation
 * @returns Payment creation response with URL and transaction ID
 */
export async function createPhonePeOrder(orderDetails: {
  merchantOrderId: string;
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  appUrl?: string;
}): Promise<{
  success: boolean;
  paymentUrl: string;
  transactionId: string;
  merchantOrderId: string;
}> {
  // Validate required parameters
  if (!orderDetails.merchantOrderId || orderDetails.merchantOrderId.length > 63 || 
      !/^[A-Za-z0-9_-]+$/.test(orderDetails.merchantOrderId)) {
    throw new Error('merchantOrderId must be <= 63 chars and contain only letters, digits, underscore, and hyphen');
  }

  if (!orderDetails.amount || orderDetails.amount <= 0) {
    throw new Error('Valid amount is required');
  }

  if (!orderDetails.customerName || !orderDetails.customerEmail || !orderDetails.customerPhone) {
    throw new Error('Customer details (name, email, phone) are required');
  }

  // Convert to paise and validate minimum
  const amountInPaise = Math.round(orderDetails.amount * 100);
  if (amountInPaise < 100) {
    throw new Error(
      `PhonePe requires minimum payment of ₹1 (100 paisa). Amount: ₹${orderDetails.amount.toFixed(2)}`
    );
  }

  try {
    // Get OAuth token
    const tokenData = await getPhonePeToken();
    
    // Determine app URL
    const baseUrl = orderDetails.appUrl || app.url;
    
    // Prepare Standard Checkout v2 payload
    const payload = {
      merchantOrderId: orderDetails.merchantOrderId,
      amount: amountInPaise,
      expireAfter: 1200, // 20 minutes
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: `Payment for Order #${orderDetails.merchantOrderId}`,
        merchantUrls: {
          redirectUrl: `${baseUrl}/order-success?orderId=${encodeURIComponent(orderDetails.orderId)}`,
        },
      },
      metaInfo: {
        udf1: sanitizeMetadata(orderDetails.orderId, 256),
        udf2: sanitizeMetadata(orderDetails.customerEmail, 256),
        udf3: sanitizeMetadata(orderDetails.customerName, 256),
        udf4: sanitizeMetadata(orderDetails.customerPhone, 256),
      },
    };

    const endpoint = `${phonepe.baseUrl}/checkout/v2/pay`;

    if (runtime.isDevelopment) {
      console.log('PhonePe Standard Checkout v2: Creating payment order...');
      console.log('Endpoint:', endpoint);
      console.log('Amount:', amountInPaise, 'paisa (₹' + orderDetails.amount + ')');
    }

    // Make API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let paymentData: any;

    try {
      paymentData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid response from PhonePe: ${responseText}`);
    }

    // Handle token expiry - retry with fresh token
    if (!response.ok && response.status === 401 && paymentData.code === 'UNAUTHORIZED') {
      if (runtime.isDevelopment) {
        console.log('Token expired, retrying with fresh token...');
      }
      
      const freshTokenData = await getPhonePeToken(true);
      const retryResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${freshTokenData.access_token}`,
        },
        body: JSON.stringify(payload),
      });

      const retryResponseText = await retryResponse.text();
      
      if (retryResponse.ok) {
        paymentData = JSON.parse(retryResponseText);
      } else {
        throw new Error(`Payment creation failed after token refresh: ${retryResponseText}`);
      }
    } else if (!response.ok) {
      // Handle other errors
      const errorMessage = paymentData.message || paymentData.code || response.statusText;
      
      if (paymentData.code === 'KEY_NOT_CONFIGURED' || 
          paymentData.code === 'MERCHANT_NOT_CONFIGURED' ||
          paymentData.message?.includes('not configured')) {
        throw new Error(
          `⚠️ PhonePe merchant not configured. Verify credentials in PhonePe Dashboard. ` +
          `Environment: ${phonepe.environment}`
        );
      }
      
      if (response.status === 404) {
        throw new Error(`PhonePe API endpoint not found: ${endpoint}`);
      }
      
      throw new Error(`Failed to create PhonePe order: ${errorMessage} (Status: ${response.status})`);
    }

    // Extract payment URL and transaction ID
    if (!paymentData.redirectUrl || !paymentData.orderId) {
      throw new Error('PhonePe response missing redirectUrl or orderId');
    }

    if (runtime.isDevelopment) {
      console.log('✅ PhonePe payment created successfully');
      console.log('State:', paymentData.state);
    }

    return {
      success: true,
      paymentUrl: paymentData.redirectUrl,
      transactionId: paymentData.orderId,
      merchantOrderId: orderDetails.merchantOrderId,
    };
  } catch (error: any) {
    console.error('Failed to create PhonePe order:', error.message);
    throw new Error(`Failed to create payment with PhonePe: ${error.message}`);
  }
}

/**
 * Verifies PhonePe payment status (Standard Checkout v2).
 * Backward compatible wrapper around checkPaymentStatus().
 * 
 * @param merchantOrderId - Merchant order ID used during payment creation
 * @param options - Optional parameters for detailed response
 * @returns Payment verification response
 */
export async function verifyPhonePePayment(
  merchantOrderId: string,
  options?: { details?: boolean; errorContext?: boolean }
): Promise<{
  success: boolean;
  status: string;
  state: string;
  transactionId?: string;
  amount?: number;
  paymentDetails?: any;
  metaInfo?: any;
  errorCode?: string;
  errorContext?: any;
}> {
  if (!merchantOrderId) {
    throw new Error('merchantOrderId is required');
  }

  try {
    // Get OAuth token
    const tokenData = await getPhonePeToken();

    // Build status URL with query parameters
    const details = options?.details === true;
    const errorContext = options?.errorContext === true;
    const statusEndpoint = `/checkout/v2/order/${merchantOrderId}/status`;
    const statusUrl = `${phonepe.baseUrl}${statusEndpoint}?details=${details}&errorContext=${errorContext}`;

    if (runtime.isDevelopment) {
      console.log('Checking PhonePe payment status:', merchantOrderId);
    }

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${tokenData.access_token}`,
      },
    });

    const responseText = await response.text();
    let statusData: any;

    try {
      statusData = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid response from PhonePe: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(
        `Failed to verify payment: ${statusData.message || statusData.code || response.statusText}`
      );
    }

    // Standard Checkout v2 response structure
    return {
      success: statusData.state === 'COMPLETED',
      status: statusData.state === 'COMPLETED' ? 'PAYMENT_SUCCESS' : 
              statusData.state === 'FAILED' ? 'PAYMENT_ERROR' : 'PAYMENT_PENDING',
      state: statusData.state,
      transactionId: statusData.paymentDetails?.[0]?.transactionId || statusData.orderId,
      amount: statusData.amount,
      paymentDetails: statusData.paymentDetails,
      metaInfo: statusData.metaInfo,
      errorCode: statusData.errorCode,
      errorContext: statusData.errorContext,
    };
  } catch (error: any) {
    console.error('PhonePe status verification error:', error.message);
    throw new Error(`Failed to verify payment status: ${error.message}`);
  }
}

/**
 * Gets PhonePe checkout script URL (backward compatible).
 * 
 * @param paymentUrl - Optional payment URL to detect environment from (unused in new implementation)
 * @returns Checkout script URL for current environment
 */
export function getPhonePeCheckoutScriptUrl(paymentUrl?: string): string {
  return getCheckoutScriptUrl();
}

/**
 * Gets PhonePe environment (backward compatible).
 * 
 * @param paymentUrl - Optional payment URL to detect environment from (unused in new implementation)
 * @returns Current environment: 'sandbox' or 'production'
 */
export function getPhonePeEnvironment(paymentUrl?: string): 'sandbox' | 'production' {
  return getEnvironment();
}

// =============================================================================
// EXPORTS
// =============================================================================

const phonepeService = {
  // Core functions
  getToken: getPhonePeToken,
  clearTokenCache,
  initiatePayment,
  checkPaymentStatus,
  verifyCallbackSignature,
  generateRedirectUrl,
  generateCallbackUrl,
  getCheckoutScriptUrl,
  getEnvironment,
  sanitizeMetadata,
  
  // Utility functions
  generateMerchantOrderId,
  parseWebhookEvent,
  verifyWebhookSignature,
  
  // Backward compatibility wrappers
  createPhonePeOrder,
  verifyPhonePePayment,
  getPhonePeCheckoutScriptUrl,
  getPhonePeEnvironment,
};

export default phonepeService;
