/**
 * Centralized Environment Configuration & Validation
 * 
 * Enterprise-grade environment variable management for Chulbuli Jewels.
 * This is the SINGLE SOURCE OF TRUTH for all environment configuration.
 * 
 * Architecture:
 * - Validates all required variables at startup
 * - Prevents mismatched environment configurations
 * - Separates public (client) and private (server) variables
 * - Fail-fast strategy: errors on missing/invalid config
 * - No process.env access outside this file
 * 
 * @module config/environment
 */

// =============================================================================
// TYPES
// =============================================================================

export type Environment = 'development' | 'preview' | 'production';
export type PaymentEnvironment = 'sandbox' | 'production';

interface ValidationError {
  variable: string;
  message: string;
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Validates that a required environment variable exists and is non-empty
 */
function requireEnv(key: string, description?: string): string {
  const value = process.env[key]?.trim();
  
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}${description ? `\n   Description: ${description}` : ''}\n   Please set this in your .env.local file or deployment environment.`
    );
  }
  
  return value;
}

/**
 * Gets an optional environment variable with a default fallback
 */
function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key]?.trim() || defaultValue;
}

/**
 * Validates URL format
 */
function validateUrl(url: string, variableName: string): string {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error(`${variableName} must be an HTTP or HTTPS URL`);
    }
    // Remove trailing slash for consistency
    return url.replace(/\/+$/, '');
  } catch (error) {
    throw new Error(`${variableName} is not a valid URL: ${url}`);
  }
}

/**
 * Detects the current runtime environment
 */
function detectEnvironment(): Environment {
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  
  // Vercel-specific environment detection
  if (vercelEnv === 'production') return 'production';
  if (vercelEnv === 'preview') return 'preview';
  
  // Standard Node.js environment detection
  if (nodeEnv === 'production') return 'production';
  if (nodeEnv === 'development') return 'development';
  
  // Default to development if unclear
  return 'development';
}

/**
 * Determines payment environment based on runtime environment and explicit override
 */
function detectPaymentEnvironment(): PaymentEnvironment {
  const env = detectEnvironment();
  
  // Explicit override (for testing production payments in preview)
  const override = process.env.PAYMENT_MODE?.trim().toLowerCase();
  if (override === 'production' || override === 'live') {
    return 'production';
  }
  if (override === 'sandbox' || override === 'test') {
    return 'sandbox';
  }
  
  // Default: production only in production, sandbox everywhere else
  return env === 'production' ? 'production' : 'sandbox';
}

// =============================================================================
// RUNTIME CONFIGURATION
// =============================================================================

/**
 * Runtime environment information
 */
export const runtime = {
  /** Current environment: development, preview, or production */
  environment: detectEnvironment(),
  
  /** Payment environment: sandbox or production */
  paymentEnvironment: detectPaymentEnvironment(),
  
  /** Whether running in development mode */
  isDevelopment: detectEnvironment() === 'development',
  
  /** Whether running in production mode */
  isProduction: detectEnvironment() === 'production',
  
  /** Whether running in Vercel preview */
  isPreview: detectEnvironment() === 'preview',
  
  /** Node.js environment */
  nodeEnv: process.env.NODE_ENV || 'development',
  
  /** Vercel environment (if deployed on Vercel) */
  vercelEnv: process.env.VERCEL_ENV,
} as const;

// =============================================================================
// APPLICATION CONFIGURATION
// =============================================================================

/**
 * Resolves the application's public URL
 * Priority: APP_URL > NEXT_PUBLIC_APP_URL > Vercel URLs > localhost
 */
function resolveAppUrl(): string {
  const candidates = [
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXTAUTH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL 
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
      : undefined,
    process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : undefined,
  ].filter(Boolean) as string[];
  
  // Find first valid URL
  for (const url of candidates) {
    try {
      return validateUrl(url, 'APP_URL');
    } catch {
      continue;
    }
  }
  
  // Fallback to localhost in development only
  if (runtime.isDevelopment) {
    return 'http://localhost:3000';
  }
  
  throw new Error(
    '❌ APP_URL is required but not set.\n' +
    '   Set APP_URL or NEXT_PUBLIC_APP_URL to your application\'s public URL.\n' +
    '   Example: https://chulbulijewels.com'
  );
}

export const app = {
  /** Public application URL (no trailing slash) */
  url: resolveAppUrl(),
  
  /** Application name */
  name: optionalEnv('NEXT_PUBLIC_APP_NAME', 'Chulbuli Jewels'),
  
  /** Support email */
  supportEmail: optionalEnv('SUPPORT_EMAIL', 'support@chulbulijewels.com'),
} as const;

// =============================================================================
// PHONEPE CONFIGURATION
// =============================================================================

/**
 * PhonePe payment gateway configuration
 * Supports OAuth 2.0 Standard Checkout v2
 */
export const phonepe = {
  /** OAuth Client ID */
  clientId: requireEnv(
    'PHONEPE_CLIENT_ID',
    'PhonePe OAuth Client ID from your merchant dashboard'
  ),
  
  /** OAuth Client Secret */
  clientSecret: requireEnv(
    'PHONEPE_CLIENT_SECRET',
    'PhonePe OAuth Client Secret from your merchant dashboard'
  ),
  
  /** Client Version (default: 1) */
  clientVersion: optionalEnv('PHONEPE_CLIENT_VERSION', '1'),
  
  /** Payment API base URL */
  baseUrl: validateUrl(
    optionalEnv(
      'PHONEPE_BASE_URL',
      runtime.paymentEnvironment === 'production'
        ? 'https://api.phonepe.com/apis/pg'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox'
    ),
    'PHONEPE_BASE_URL'
  ),
  
  /** OAuth authorization URL */
  authUrl: validateUrl(
    optionalEnv(
      'PHONEPE_AUTH_URL',
      runtime.paymentEnvironment === 'production'
        ? 'https://api.phonepe.com/apis/identity-manager'
        : 'https://api-preprod.phonepe.com/apis/pg-sandbox'
    ),
    'PHONEPE_AUTH_URL'
  ),
  
  /** Checkout SDK script URL */
  checkoutScriptUrl: runtime.paymentEnvironment === 'production'
    ? 'https://mercury.phonepe.com/web/bundle/checkout.js'
    : 'https://mercury-stg.phonepe.com/web/bundle/checkout.js',
  
  /** Current payment environment */
  environment: runtime.paymentEnvironment,
} as const;

// =============================================================================
// DATABASE CONFIGURATION
// =============================================================================

/**
 * Database configuration (Supabase)
 */
export const database = {
  /** Supabase project URL */
  url: requireEnv(
    'NEXT_PUBLIC_SUPABASE_URL',
    'Supabase project URL from your dashboard'
  ),
  
  /** Supabase anonymous public key */
  anonKey: requireEnv(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'Supabase anonymous/public key'
  ),
  
  /** Direct database connection URL (for migrations/scripts) */
  directUrl: optionalEnv('DATABASE_URL', ''),
} as const;

// =============================================================================
// FIREBASE CONFIGURATION
// =============================================================================

/**
 * Firebase Authentication configuration
 */
export const firebase = {
  /** Firebase API Key */
  apiKey: requireEnv('NEXT_PUBLIC_FIREBASE_API_KEY', 'Firebase API Key'),
  
  /** Firebase Auth Domain */
  authDomain: requireEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'Firebase Auth Domain'),
  
  /** Firebase Project ID */
  projectId: requireEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'Firebase Project ID'),
  
  /** Firebase Storage Bucket */
  storageBucket: requireEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'Firebase Storage Bucket'),
  
  /** Firebase Messaging Sender ID */
  messagingSenderId: requireEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'Firebase Messaging Sender ID'),
  
  /** Firebase App ID */
  appId: requireEnv('NEXT_PUBLIC_FIREBASE_APP_ID', 'Firebase App ID'),
  
  /** Service Account Key (Base64 encoded JSON) */
  serviceAccountKey: optionalEnv('FIREBASE_SERVICE_ACCOUNT_KEY', ''),
} as const;

// =============================================================================
// CLOUDINARY CONFIGURATION
// =============================================================================

/**
 * Cloudinary image storage configuration
 */
export const cloudinary = {
  /** Cloudinary cloud name */
  cloudName: requireEnv('CLOUDINARY_CLOUD_NAME', 'Cloudinary cloud name from dashboard'),
  
  /** Cloudinary API key */
  apiKey: requireEnv('CLOUDINARY_API_KEY', 'Cloudinary API key'),
  
  /** Cloudinary API secret */
  apiSecret: requireEnv('CLOUDINARY_API_SECRET', 'Cloudinary API secret'),
} as const;

// =============================================================================
// JWT AUTHENTICATION CONFIGURATION
// =============================================================================

/**
 * JWT authentication configuration
 */
function validateJWTSecret(secret: string): string {
  if (secret.length < 32) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters (256 bits) for security.\n' +
      'Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }
  return secret;
}

export const jwt = {
  /** JWT secret key (min 32 chars) */
  secret: validateJWTSecret(requireEnv('JWT_SECRET', 'JWT secret key for signing tokens')),
  
  /** JWT expiry duration */
  expiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
} as const;

// =============================================================================
// CRON & WEBHOOK CONFIGURATION
// =============================================================================

/**
 * Cron job authentication
 */
export const cron = {
  /** Secret for authenticating cron job requests */
  secret: optionalEnv('CRON_SECRET', ''),
} as const;

/**
 * PhonePe webhook authentication (Standard Checkout v2)
 */
export const phonepeWebhook = {
  /** Webhook username configured in PhonePe Dashboard */
  username: optionalEnv('PHONEPE_WEBHOOK_USERNAME', ''),
  
  /** Webhook password configured in PhonePe Dashboard */
  password: optionalEnv('PHONEPE_WEBHOOK_PASSWORD', ''),
} as const;

// =============================================================================
// CSRF PROTECTION
// =============================================================================

/**
 * CSRF protection configuration
 */
export const csrf = {
  /** CSRF token secret */
  secret: optionalEnv('CSRF_SECRET', ''),
} as const;

// =============================================================================
// SECURITY CONFIGURATION CONSTANTS
// =============================================================================

/**
 * Security-related configuration constants
 */
export const security = {
  // Password requirements
  passwordMinLength: 8,
  passwordMaxLength: 128,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumber: true,
  passwordRequireSpecial: false, // User-friendly for MVP
  
  // JWT settings
  jwtExpiryDefault: '7d',
  jwtRefreshThreshold: '1d',
  
  // Rate limiting
  authRateLimitWindow: 15 * 60 * 1000, // 15 minutes
  authRateLimitMax: 5, // 5 attempts per window
  apiRateLimitWindow: 60 * 1000, // 1 minute
  apiRateLimitMax: 100, // 100 requests per minute
  
  // File upload
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const,
  
  // Validation patterns
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneRegex: /^[0-9]{10}$/,
} as const;

// =============================================================================
// PUBLIC CLIENT CONFIGURATION
// =============================================================================

/**
 * Configuration safe to expose to the client
 * Only includes NEXT_PUBLIC_ variables
 */
export const publicConfig = {
  app: {
    url: app.url,
    name: app.name,
  },
  firebase: {
    apiKey: firebase.apiKey,
    authDomain: firebase.authDomain,
    projectId: firebase.projectId,
    storageBucket: firebase.storageBucket,
    messagingSenderId: firebase.messagingSenderId,
    appId: firebase.appId,
  },
  database: {
    url: database.url,
    anonKey: database.anonKey,
  },
  environment: runtime.environment,
  paymentEnvironment: runtime.paymentEnvironment,
} as const;

// =============================================================================
// ENVIRONMENT SAFETY VALIDATION
// =============================================================================

/**
 * Validates environment configuration for safety and correctness.
 * Prevents common misconfigurations that could lead to:
 * - Using production payment keys in development
 * - Using test payment keys in production
 * - Missing critical configuration
 */
export function validateEnvironmentSafety(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // 1. Validate PhonePe configuration alignment
  const isPhonePeProduction = phonepe.baseUrl.includes('api.phonepe.com') && 
                               !phonepe.baseUrl.includes('preprod');
  
  if (runtime.isProduction && !isPhonePeProduction) {
    errors.push({
      variable: 'PHONEPE_BASE_URL',
      message: '🚨 PRODUCTION SAFETY: Using PhonePe sandbox URL in production environment. Switch to production URL.',
    });
  }
  
  if (runtime.isDevelopment && isPhonePeProduction) {
    errors.push({
      variable: 'PHONEPE_BASE_URL',
      message: '⚠️  DEVELOPMENT WARNING: Using PhonePe production URL in development. Consider using sandbox for testing.',
    });
  }
  
  // 2. Validate APP_URL configuration
  if (runtime.isProduction && app.url.includes('localhost')) {
    errors.push({
      variable: 'APP_URL',
      message: '🚨 PRODUCTION SAFETY: APP_URL is set to localhost in production. Set it to your production domain.',
    });
  }
  
  if (runtime.isProduction && !app.url.startsWith('https://')) {
    errors.push({
      variable: 'APP_URL',
      message: '🚨 PRODUCTION SAFETY: APP_URL must use HTTPS in production.',
    });
  }
  

  return errors;
}

/**
 * Runs environment validation and throws if critical errors are found.
 * Call this during application initialization.
 */
export function assertEnvironmentSafety(): void {
  // Skip strict validation during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }
  
  const errors = validateEnvironmentSafety();
  
  if (errors.length === 0) {
    return;
  }
  
  // Separate critical errors (production) from warnings (development)
  const criticalErrors = errors.filter(e => e.message.includes('🚨'));
  const warnings = errors.filter(e => e.message.includes('⚠️'));
  
  // Always log warnings
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment Configuration Warnings:\n');
    warnings.forEach(({ variable, message }) => {
      console.warn(`   ${variable}: ${message}`);
    });
    console.warn('');
  }
  
  // Throw on critical errors
  if (criticalErrors.length > 0) {
    const errorMessage = [
      '\n❌ CRITICAL ENVIRONMENT CONFIGURATION ERRORS:\n',
      ...criticalErrors.map(({ variable, message }) => `   ${variable}: ${message}`),
      '\n   Fix these errors before deploying to production.',
      '   See docs/environment-setup.md for configuration guide.\n',
    ].join('\n');
    
    throw new Error(errorMessage);
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Run validation on module import (server-side only)
 * This ensures the application fails fast if misconfigured
 */
if (typeof window === 'undefined') {
  // Only validate on server
  try {
    assertEnvironmentSafety();
    
    // Log environment info in development
    if (runtime.isDevelopment) {
      console.log('\n✅ Environment Configuration Loaded:');
      console.log(`   Environment: ${runtime.environment}`);
      console.log(`   Payment Mode: ${runtime.paymentEnvironment}`);
      console.log(`   PhonePe: ${phonepe.environment} (${phonepe.baseUrl})`);
      console.log(`   App URL: ${app.url}\n`);
    }
  } catch (error) {
    // Re-throw to prevent application startup with invalid config
    throw error;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

const config = {
  runtime,
  app,
  phonepe,
  database,
  cloudinary,
  jwt,
  cron,
  phonepeWebhook,
  csrf,
  security,
  firebase,
  publicConfig,
};

export default config;
