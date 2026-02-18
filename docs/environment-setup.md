# Environment Setup Guide

## Table of Contents

- [Overview](#overview)
- [Environment Types](#environment-types)
- [Configuration Architecture](#configuration-architecture)
- [Local Development Setup](#local-development-setup)
- [Vercel Deployment](#vercel-deployment)
- [Payment Gateway Configuration](#payment-gateway-configuration)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

Chulbuli Jewels uses a **production-grade, environment-driven configuration system** that:

✅ **Automatically switches** between test and live payment modes based on `NODE_ENV`  
✅ **Validates** all required environment variables at startup  
✅ **Prevents** common misconfigurations (e.g., live keys in development)  
✅ **Centralizes** all configuration in one place (`src/lib/config/environment.ts`)  
✅ **Fails fast** with clear error messages when misconfigured  
✅ **Separates** public and private environment variables  

**No code changes are needed between environments** — only environment variables control behavior.

---

## Environment Types

### Development
- **When**: Running locally with `npm run dev`
- **NODE_ENV**: `development`
- **Payment Mode**: Sandbox/Test (default)
- **Purpose**: Local development and testing

### Preview (Vercel)
- **When**: Deploy to Vercel branch preview
- **VERCEL_ENV**: `preview`
- **Payment Mode**: Sandbox/Test (default)
- **Purpose**: Testing features before production

### Production (Vercel)
- **When**: Deploy to Vercel production branch
- **VERCEL_ENV**: `production`
- **Payment Mode**: Live (default)
- **Purpose**: Serving real customers with live payments

---

## Configuration Architecture

### Single Source of Truth

All environment configuration is centralized in:

```
src/lib/config/environment.ts
```

This file:
- Validates all required variables
- Detects the current environment
- Exports structured configuration objects
- Runs safety checks to prevent misconfigurations

### Payment Integration Layer

Payment services are abstracted in:

```
src/lib/payments/
  └── phonepe.ts     # PhonePe payment service
```

This service:
- Imports configuration from `environment.ts`
- Provides clean, type-safe APIs
- Handles OAuth authentication and token management
- Never accesses `process.env` directly

### Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│         Environment Variables (.env.local)              │
│                  or Vercel Dashboard                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│     src/lib/config/environment.ts                       │
│     • Validates all variables                           │
│     • Detects environment (dev/preview/prod)            │
│     • Exports typed config objects                      │
│     • Runs safety checks                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│     src/lib/payments/                                   │
│     • phonepe.ts  - PhonePe OAuth service               │
│     (No process.env access, only config imports)        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│     API Routes (src/app/api/)                           │
│     • /api/payment/phonepe/*                            │
│     (Use payment services, no direct config access)     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│     Frontend Components                                 │
│     • Checkout forms                                    │
│     • Payment buttons                                   │
│     (Only access NEXT_PUBLIC_* variables via config)    │
└─────────────────────────────────────────────────────────┘
```

---

## Local Development Setup

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd CHULBULI
npm install
```

### Step 2: Create Environment File

```bash
cp .env.example .env.local
```

### Step 3: Configure Test Credentials

Edit `.env.local` with your **TEST/SANDBOX** credentials:

```env
# Application
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PhonePe (Sandbox)
PHONEPE_CLIENT_ID=your_sandbox_client_id
PHONEPE_CLIENT_SECRET=your_sandbox_client_secret
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Step 4: Start Development Server

```bash
npm run dev
```

You should see environment configuration output in the console:

```
✅ Environment Configuration Loaded:
   Environment: development
   Payment Mode: sandbox
   PhonePe: sandbox (https://api-preprod.phonepe.com/apis/pg-sandbox)
   App URL: http://localhost:3000
```

---

## Vercel Deployment

### Environment Variable Strategy

Vercel provides **three separate environments**:

1. **Development** - Local development (not on Vercel)
2. **Preview** - Branch deployments (test environment)
3. **Production** - Main branch deployment (live environment)

### Setting Up Vercel Environment Variables

#### Option 1: Via Vercel Dashboard (Recommended)

1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

2. Add variables for each environment:

| Variable | Development | Preview | Production | Notes |
|----------|-------------|---------|------------|-------|
| `APP_URL` | ❌ | ✅ `https://preview.com` | ✅ `https://chulbulijewels.com` | Auto-set by Vercel |
| `PHONEPE_CLIENT_ID` | ❌ | ✅ Sandbox ID | ✅ Production ID | Different per env |
| `PHONEPE_CLIENT_SECRET` | ❌ | ✅ Sandbox Secret | ✅ Production Secret | Keep secret! |
| `PHONEPE_BASE_URL` | ❌ | ✅ Sandbox URL | ✅ Production URL | Auto-detected |
| `PHONEPE_AUTH_URL` | ❌ | ✅ Sandbox Auth URL | ✅ Production Auth URL | Auto-detected |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | ✅ | Same for all |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ | Same for all |
| `DATABASE_URL` | ❌ | ✅ | ✅ | Server-side only |
| `FIREBASE_*` | ✅ | ✅ | ✅ | Same for all |

**Legend:**
- ✅ = Set this variable
- ❌ = Not needed (use local .env.local)

#### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add PHONEPE_CLIENT_ID production
vercel env add PHONEPE_CLIENT_SECRET production

# For preview environment
vercel env add PHONEPE_CLIENT_ID preview
vercel env add PHONEPE_CLIENT_SECRET preview
# ... etc
```

### Important Deployment Notes

#### 1. Why NODE_ENV Alone Is NOT Sufficient

`NODE_ENV` in Next.js is **always `production`** for both preview and production builds on Vercel.

We use **`VERCEL_ENV`** to distinguish:
- `VERCEL_ENV=preview` → Use test/sandbox credentials
- `VERCEL_ENV=production` → Use live credentials

Our configuration handles this automatically in `src/lib/config/environment.ts`:

```typescript
function detectEnvironment(): Environment {
  const vercelEnv = process.env.VERCEL_ENV;
  
  if (vercelEnv === 'production') return 'production';
  if (vercelEnv === 'preview') return 'preview';
  
  return 'development';
}
```

#### 2. Payment Mode Determination

```typescript
function detectPaymentEnvironment(): PaymentEnvironment {
  const env = detectEnvironment();
  
  // Explicit override (rare, for testing)
  const override = process.env.PAYMENT_MODE;
  if (override === 'production') return 'production';
  if (override === 'sandbox') return 'sandbox';
  
  // Default: production only in production, sandbox everywhere else
  return env === 'production' ? 'production' : 'sandbox';
}
```

**Result:**
- **Development**: Sandbox mode, test keys
- **Preview**: Sandbox mode, test keys
- **Production**: Live mode, production keys

No code changes needed — environment determines behavior!

#### 3. Automatic URL Resolution

The system automatically resolves `APP_URL` in this priority:

1. `APP_URL` (explicit)
2. `NEXT_PUBLIC_APP_URL` (explicit)
3. `VERCEL_PROJECT_PRODUCTION_URL` (Vercel auto-set)
4. `VERCEL_URL` (Vercel auto-set)
5. `http://localhost:3000` (development fallback)

---

## Payment Gateway Configuration

### PhonePe Configuration

#### Sandbox/Test Environment

```env
PHONEPE_CLIENT_ID=<your_sandbox_client_id>
PHONEPE_CLIENT_SECRET=<your_sandbox_client_secret>
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
```

**Get credentials:**
1. Go to [PhonePe Merchant Dashboard](https://business.phonepe.com/)
2. Navigate to **Developers** → **API Credentials**
3. Use **Sandbox/Test** credentials for development/preview

#### Production Environment

```env
PHONEPE_CLIENT_ID=<your_production_client_id>
PHONEPE_CLIENT_SECRET=<your_production_client_secret>
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager
```

**Get credentials:**
1. Complete PhonePe merchant onboarding
2. Get **Production** credentials from dashboard
3. Set these **only** in Vercel Production environment

**Note**: Cash on Delivery (COD) is also supported as an alternative payment method.

---

## Security Best Practices

### 1. Never Commit Secrets

```bash
# Ensure .env.local is in .gitignore
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore
```

### 2. Use Different Credentials Per Environment

| Environment | PhonePe | Database |
|-------------|---------|----------|
| Development | Sandbox | Dev/Test DB |
| Preview | Sandbox | Dev/Test DB |
| Production | Production | Production DB |

### 3. Rotate Secrets Regularly

- Rotate payment gateway credentials every 90 days
- Rotate database credentials every 180 days
- Use Vercel's secret rotation feature

### 4. Limit Secret Access

- Only grant production secret access to senior engineers
- Use Vercel Teams with role-based access control
- Enable 2FA on all admin accounts

### 5. Never Log Secrets

Our configuration system automatically masks secrets in logs:

```typescript
// ❌ BAD
console.log('Secret:', process.env.PHONEPE_CLIENT_SECRET)

// ✅ GOOD (handled automatically)
console.log('PhonePe:', phonepe.clientId.substring(0, 15) + '...')
```

### 6. Validate Environment on Startup

Our system **fails fast** if:
- Required variables are missing
- Production uses test keys
- Development uses live keys
- URLs are malformed

This prevents silent failures and security issues.

---

## Troubleshooting

### Issue: "Missing required environment variable"

**Error:**
```
❌ Missing required environment variable: PHONEPE_CLIENT_ID
   Description: PhonePe OAuth Client ID from your merchant dashboard
   Please set this in your .env.local file or deployment environment.
```

**Solution:**
1. Copy `.env.example` to `.env.local`
2. Fill in the missing variable
3. Restart your development server

---

### Issue: "Using sandbox URL in production"

**Error:**
```
🚨 PRODUCTION SAFETY: Using PhonePe sandbox URL in production environment. 
   Switch to production URL.
```

**Solution:**
1. Go to Vercel Dashboard → Environment Variables
2. Update `PHONEPE_BASE_URL` for **Production** to use `https://api.phonepe.com/apis/pg`
3. Update `PHONEPE_AUTH_URL` for **Production** to use `https://api.phonepe.com/apis/identity-manager`
4. Redeploy

---

### Issue: "PhonePe authentication failed"

**Error:**
```
PhonePe authentication failed: Invalid credentials.
```

**Solution:**
1. Verify `PHONEPE_CLIENT_ID` and `PHONEPE_CLIENT_SECRET` are correct
2. Check you're using **sandbox** credentials in development
3. Ensure no extra spaces or line breaks in credentials
4. Try generating new credentials in PhonePe dashboard

---

### Issue: "APP_URL is set to localhost in production"

**Error:**
```
🚨 PRODUCTION SAFETY: APP_URL is set to localhost in production.
   Set it to your production domain.
```

**Solution:**
1. Go to Vercel Dashboard → Environment Variables
2. Set `APP_URL` or `NEXT_PUBLIC_APP_URL` to your production domain:
   ```
   APP_URL=https://chulbulijewels.com
   ```
3. Redeploy

---

### Issue: Environment not detected correctly

**Debug Steps:**

1. **Check console output** during startup:
   ```
   ✅ Environment Configuration Loaded:
      Environment: production
      Payment Mode: production
      PhonePe: production (https://api.phonepe.com/apis/pg)
   ```

2. **Verify Vercel environment:**
   - Check `VERCEL_ENV` in Vercel deployment logs
   - Should be `preview` or `production`

3. **Check payment URLs:**
   - PhonePe sandbox: `api-preprod.phonepe.com`
   - PhonePe production: `api.phonepe.com`

---

### Testing Environment Configuration

Create a test API route to verify configuration:

```typescript
// src/app/api/debug/environment/route.ts
import { NextResponse } from 'next/server';
import { runtime, phonepe } from '@/lib/config/environment';

export async function GET() {
  return NextResponse.json({
    runtime: {
      environment: runtime.environment,
      paymentEnvironment: runtime.paymentEnvironment,
      nodeEnv: runtime.nodeEnv,
      vercelEnv: runtime.vercelEnv,
    },
    phonepe: {
      environment: phonepe.environment,
      baseUrlHost: new URL(phonepe.baseUrl).host,
      hasCredentials: !!(phonepe.clientId && phonepe.clientSecret),
    },
  });
}
```

Access at: `http://localhost:3000/api/debug/environment`

**⚠️ IMPORTANT:** Delete this route or protect it before deploying to production!

---

## Architecture Benefits

### ✅ Benefits of This Approach

1. **Single Source of Truth**: All configuration in one file
2. **Type Safety**: TypeScript types for all config values
3. **Fail Fast**: Immediate errors on misconfiguration
4. **Security**: Prevents test keys in production, production keys in development
5. **Scalability**: Easy to add new services (Stripe, PayPal, etc.)
6. **Maintainability**: No scattered `process.env` calls
7. **Testability**: Easy to mock configuration in tests
8. **Documentation**: Self-documenting code with clear exports

### 🚀 Adding New Payment Gateways

To add a new payment gateway (e.g., Stripe):

1. **Add environment variables** to `.env.example`:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

2. **Add configuration** to `src/lib/config/environment.ts`:
   ```typescript
   export const stripe = {
     secretKey: requireEnv('STRIPE_SECRET_KEY', 'Stripe secret key'),
     publishableKey: requireEnv('STRIPE_PUBLISHABLE_KEY', 'Stripe publishable key'),
     environment: requireEnv('STRIPE_SECRET_KEY', '').startsWith('sk_live_') 
       ? 'production' 
       : 'sandbox',
   } as const;
   ```

3. **Create payment service** at `src/lib/payments/stripe.ts`:
   ```typescript
   import { stripe } from '../config/environment';
   
   export async function createPaymentIntent(amount: number) {
     // Use stripe.secretKey instead of process.env
   }
   ```

4. **Add safety validation** in `validateEnvironmentSafety()`:
   ```typescript
   const isStripeProduction = stripe.secretKey.startsWith('sk_live_');
   if (runtime.isProduction && !isStripeProduction) {
     errors.push({
       variable: 'STRIPE_SECRET_KEY',
       message: '🚨 Using Stripe test keys in production!',
     });
   }
   ```

That's it! No changes to API routes or frontend code needed.

---

## Support

For issues or questions:
- **Email**: dev@chulbulijewels.com
- **Documentation**: `/docs`
- **Configuration File**: `src/lib/config/environment.ts`

---

---

## Payment Methods Summary

Chulbuli Jewels currently supports the following payment methods:

1. **PhonePe** - Online payment gateway (OAuth 2.0 based)
   - Sandbox mode for development/testing
   - Production mode for live payments
   - Supports UPI, cards, wallets, and net banking

2. **Cash on Delivery (COD)** - Payment on delivery
   - No gateway integration required
   - Handled directly in the order flow

---

**Last Updated**: 2026-02-18  
**Version**: 2.0.0  
**Note**: Razorpay payment gateway was removed as of February 2026
