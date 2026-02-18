# 🚀 Production Deployment Guide - Chulbuli Jewels

**Last Updated:** February 18, 2026  
**Status:** ✅ Ready for Production Deployment

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Variables Configuration](#environment-variables-configuration)
3. [Testing Production Locally](#testing-production-locally)
4. [Deploying to Vercel](#deploying-to-vercel)
5. [PhonePe Production Setup](#phonepe-production-setup)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedure](#rollback-procedure)

---

## ✅ Pre-Deployment Checklist

### Critical Requirements

- [ ] **PhonePe Production Credentials** obtained from PhonePe Business Dashboard
- [ ] **Merchant Account Activated** for Standard Checkout API
- [ ] **Database Backups** enabled on Supabase
- [ ] **Custom Domain** configured (if not using Vercel subdomain)
- [ ] **SSL Certificate** verified (auto-provided by Vercel)
- [ ] **Firebase Production Project** setup with authentication enabled
- [ ] **Cloudinary Account** with production API keys

### Security Checklist

- [ ] All secrets are stored in Vercel Environment Variables (never in code)
- [ ] `JWT_SECRET` is at least 32 characters (generated with crypto)
- [ ] `CSRF_SECRET` is unique and secure
- [ ] Database connection uses SSL
- [ ] No `NEXT_PUBLIC_` prefix on sensitive variables
- [ ] Debug endpoints are protected (✅ Done - they return 404 in production)

### Code Checklist

- [ ] All tests passing
- [ ] Build completes without errors: `npm run build`
- [ ] Environment validation passes: `npm run env:validate`
- [ ] No console.log statements in production code (or use logger)
- [ ] Error tracking configured (Sentry, Datadog, etc.)

---

## 🔐 Environment Variables Configuration

### Required for Production

Create these in **Vercel Dashboard → Your Project → Settings → Environment Variables**

#### 1️⃣ Application Configuration

```env
# NODE_ENV is automatically set by Vercel to 'production'
# VERCEL_ENV is automatically set to 'production' for production deployments

# Application URLs (MUST use your production domain)
APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Chulbuli Jewels
SUPPORT_EMAIL=support@chulbulijewels.com
```

#### 2️⃣ PhonePe Production Credentials

```env
# PhonePe Production Credentials (from PhonePe Business Dashboard)
PHONEPE_CLIENT_ID=your_production_client_id_here
PHONEPE_CLIENT_SECRET=your_production_client_secret_here
PHONEPE_CLIENT_VERSION=1

# PhonePe Production URLs (DO NOT change these)
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager

# PhonePe Webhook Authentication
PHONEPE_WEBHOOK_USERNAME=your_webhook_username
PHONEPE_WEBHOOK_PASSWORD=your_webhook_password
```

⚠️ **IMPORTANT:** Make sure these are **PRODUCTION** credentials, NOT sandbox!
- Sandbox URLs contain `api-preprod.phonepe.com`
- Production URLs use `api.phonepe.com`

#### 3️⃣ Database (Supabase)

```env
# Supabase Production Project
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
DATABASE_URL=postgresql://postgres:password@db.your-prod-project.supabase.co:5432/postgres?sslmode=require
```

#### 4️⃣ Firebase Authentication

```env
# Firebase Production Project
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-production-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id

# Firebase Admin (base64 encoded service account JSON)
FIREBASE_SERVICE_ACCOUNT_KEY=base64_encoded_service_account_json
```

#### 5️⃣ Security Secrets

```env
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_32_character_or_longer_secret_here
JWT_EXPIRES_IN=7d

CSRF_SECRET=your_32_character_csrf_secret_here
CRON_SECRET=your_32_character_cron_secret_here
```

#### 6️⃣ Cloudinary (Image Hosting)

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 7️⃣ Optional - Enable Debug Mode in Production

```env
# Only set this temporarily for troubleshooting
# DEBUG_MODE=true  # Enables /api/payment/phonepe/test endpoint in production
```

---

## 🧪 Testing Production Locally

Before deploying to Vercel, test production mode locally by following these steps.

### Step 1: Update .env.local for Production Testing

**IMPORTANT:** Create a backup of your current `.env.local` first!

```bash
cp .env.local .env.local.backup
```

Then update `.env.local` with production-like settings:

```env
# Set to production mode
NODE_ENV=production

# Use production PhonePe URLs
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager

# Use production PhonePe credentials
PHONEPE_CLIENT_ID=your_production_client_id
PHONEPE_CLIENT_SECRET=your_production_client_secret

# Keep localhost for local testing (HTTPS requirement is bypassed for localhost)
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add debug mode to test endpoints locally
DEBUG_MODE=true
```

### Step 2: Validate Environment

```bash
npm run env:validate
```

**Expected Output:** Should pass with 0 errors

### Step 3: Build for Production

```bash
npm run build
```

**Expected Output:** Build should complete successfully with no errors

### Step 4: Start Production Server

```bash
npm start
```

**Expected Output:** `✓ Ready in XXXms` on port 3000

### Step 5: Test PhonePe Configuration

```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/payment/phonepe/test -UseBasicParsing | Select-Object -ExpandProperty Content

# Or open in browser
http://localhost:3000/api/payment/phonepe/test
```

**Expected Response:**

```json
{
  "success": true,
  "message": "✅ PhonePe OAuth authentication is working successfully!",
  "diagnostics": {
    "environment": "production",
    "phonePeEnvironment": "PRODUCTION",
    "config": {
      "clientId": "M...PROD...",
      "baseUrl": "https://api.phonepe.com/apis/pg"
    },
    "tests": [
      {
        "name": "OAuth Authentication",
        "status": "PASSED",
        "message": "✅ Successfully obtained OAuth access token"
      }
    ]
  }
}
```

**✅ Key Indicators:**
- `phonePeEnvironment`: **"PRODUCTION"** (not SANDBOX)
- `baseUrl`: **"https://api.phonepe.com/apis/pg"** (not api-preprod)
- OAuth Authentication: **"PASSED"**

**❌ Common Errors and Fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| `KEY_NOT_CONFIGURED` | Merchant account not activated | Contact PhonePe support to activate Standard Checkout API |
| `UNAUTHORIZED` | Wrong credentials | Verify Client ID and Secret from PhonePe Dashboard |
| `PRODUCTION SAFETY: Using PhonePe sandbox URL` | Wrong BASE_URL | Update `PHONEPE_BASE_URL` to production URL |

### Step 6: Test Health Endpoint

```bash
Invoke-WebRequest -Uri http://localhost:3000/api/health -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Response:**

```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "latency": 50
  },
  "environment": "production",
  "timestamp": "2026-02-18T..."
}
```

### Step 7: Restore Development Configuration

After testing, restore your development environment:

```bash
cp .env.local.backup .env.local
```

---

## 🌐 Deploying to Vercel

### Option 1: Deploy via Git (Recommended)

1. **Commit All Changes**

```bash
git add .
git commit -m "Production deployment - PhonePe integration ready"
git push origin main
```

2. **Auto-Deploy**
   - Vercel will automatically detect the push and start building
   - Go to Vercel Dashboard to monitor progress

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Configure Environment Variables in Vercel

**⚠️ CRITICAL:** You MUST configure environment variables in Vercel Dashboard before deploying.

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add all variables from [Environment Variables Configuration](#environment-variables-configuration)

3. Set **Environment** to:
   - ✅ **Production** (for production deployments)
   - Also add to **Preview** if you want to test in preview branches

4. Click **Save**

5. **Redeploy** if variables were added after initial deployment:
   - Go to **Deployments**
   - Click **•••** (three dots) on latest deployment
   - Click **Redeploy**

### Verify Deployment

After deployment completes:

```bash
# Replace with your actual Vercel URL
curl https://your-app.vercel.app/api/health
```

**Expected Output:**

```json
{
  "status": "healthy",
  "database": {"connected": true, "latency": 45},
  "environment": "production"
}
```

---

## 📱 PhonePe Production Setup

### Step 1: Configure Webhook in PhonePe Dashboard

1. Log in to [PhonePe Business Dashboard](https://business.phonepe.com/)

2. Navigate to: **Developers** → **Webhooks** → **Standard Checkout**

3. Set Webhook URL:
   ```
   https://your-domain.vercel.app/api/payment/phonepe/webhook
   ```

4. Configure Webhook Authentication:
   - Username: `your_webhook_username`
   - Password: `your_webhook_password`
   - **Save these credentials!**

5. Save and **Test Webhook** (PhonePe Dashboard has a test button)

### Step 2: Add Webhook Credentials to Vercel

1. Go to Vercel Dashboard → Environment Variables

2. Add:
   ```env
   PHONEPE_WEBHOOK_USERNAME=your_webhook_username
   PHONEPE_WEBHOOK_PASSWORD=your_webhook_password
   ```

3. Set for **Production** environment

4. **Redeploy** application

### Step 3: Verify Webhook Configuration

After deployment, the webhook will be tested by PhonePe automatically on first transaction.

To manually verify webhook security:

```bash
# This should fail without proper credentials (403 Forbidden)
curl -X POST https://your-domain.vercel.app/api/payment/phonepe/webhook \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:** 403 or authentication error (webhook signature verification)

---

## 🧪 Post-Deployment Testing

### Test Checklist

#### 1️⃣ Application Health

```bash
curl https://your-domain.vercel.app/api/health
```
- [ ] Returns `"status": "healthy"`
- [ ] Database connected
- [ ] Environment is `"production"`

#### 2️⃣ PhonePe Configuration (If DEBUG_MODE=true)

```bash
curl https://your-domain.vercel.app/api/payment/phonepe/test
```
- [ ] `phonePeEnvironment` is **"PRODUCTION"**
- [ ] OAuth token obtained successfully
- [ ] Base URL is `https://api.phonepe.com/apis/pg`

**Note:** If DEBUG_MODE is not set, this endpoint will return 404 (expected for security)

#### 3️⃣ Create Test Payment

1. Go to: `https://your-domain.vercel.app/products`
2. Add a product to cart
3. Go to checkout
4. Fill in details
5. Click "Place Order"
6. Complete payment on PhonePe (use **real payment with ₹1-10**)
7. Verify:
   - [ ] Redirected to success page
   - [ ] Order appears in account orders
   - [ ] Stock deducted
   - [ ] Order status is "placed"

#### 4️⃣ Test Webhook

After successful payment:

1. Check Vercel deployment logs for webhook event:
   ```
   ✅ PhonePe webhook received: checkout.order.completed
   ```

2. Verify order status updated in database

#### 5️⃣ Test Payment Status Endpoint

```bash
curl "https://your-domain.vercel.app/api/payment/phonepe/status?merchantOrderId=CHULBULI-xxx"
```

Replace `xxx` with actual order ID from database.

- [ ] Returns payment status
- [ ] Status matches actual payment

#### 6️⃣ End-to-End User Flow

- [ ] Home page loads
- [ ] Product listing works
- [ ] Product details display
- [ ] Add to cart works
- [ ] Cart page functional
- [ ] Checkout form validation
- [ ] Payment creation successful
- [ ] Payment completion works
- [ ] Order confirmation email sent (if configured)
- [ ] Order history displays

#### 7️⃣ Authentication

- [ ] Sign up works
- [ ] Login works
- [ ] Google Sign-In works (if configured)
- [ ] Password reset works
- [ ] JWT tokens valid

#### 8️⃣ Admin Panel

- [ ] Admin login works
- [ ] Product management functional
- [ ] Order management works
- [ ] User management functional

### Performance Testing

- [ ] Home page loads in < 2 seconds
- [ ] Product listing loads in < 1.5 seconds
- [ ] Payment creation in < 3 seconds
- [ ] Database queries < 100ms average

---

## 🔧 Troubleshooting

### Issue: "KEY_NOT_CONFIGURED" Error

**Symptoms:**
```json
{
  "error": "KEY_NOT_CONFIGURED",
  "message": "Merchant key not configured"
}
```

**Causes:**
1. PhonePe merchant account not activated
2. Standard Checkout API not enabled
3. Wrong credentials (sandbox vs production)

**Solutions:**
1. Contact PhonePe Business Support
2. Verify merchant account status in PhonePe Dashboard
3. Request activation of "Standard Checkout API"
4. Double-check credentials are production (not sandbox)

---

### Issue: Webhook Not Received

**Symptoms:**
- Order stays in "pending_payment" status
- No webhook logs in Vercel

**Solutions:**
1. Verify webhook URL in PhonePe Dashboard
2. Check webhook credentials are set in Vercel
3. Verify application is redeployed after adding credentials
4. Use status endpoint as fallback:
   ```
   /api/payment/phonepe/status?merchantOrderId=CHULBULI-xxx
   ```

---

### Issue: HTTPS Required Error

**Symptoms:**
```
APP_URL must use HTTPS in production
```

**Solution:**
Update environment variables:
```env
APP_URL=https://your-domain.vercel.app  # Must start with https://
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

### Issue: Build Fails on Vercel

**Common Causes:**
1. TypeScript errors
2. Missing environment variables
3. Import/export errors

**Solutions:**
1. Run `npm run build` locally to catch errors
2. Check Vercel deployment logs
3. Verify all environment variables are set
4. Ensure Node version matches (≥18.0.0)

---

### Issue: Database Connection Failed

**Symptoms:**
```json
{
  "status": "unhealthy",
  "database": {"connected": false}
}
```

**Solutions:**
1. Verify `DATABASE_URL` is correct
2. Check Supabase project is active
3. Verify SSL mode is enabled: `?sslmode=require`
4. Check database credentials
5. Verify network access (Supabase allows all IPs by default)

---

## 🔙 Rollback Procedure

If production deployment has critical issues:

### Option 1: Revert via Vercel Dashboard

1. Go to **Deployments**
2. Find last working deployment
3. Click **•••** (three dots)
4. Click **"Promote to Production"**

### Option 2: Revert via Git

```bash
# Find the last working commit
git log --oneline

# Revert to that commit
git revert <commit-hash>

# Or reset (use cautiously)
git reset --hard <commit-hash>

# Force push
git push origin main --force
```

### Option 3: Instant Rollback to Preview

If preview deployment is working:

1. Go to **Deployments**
2. Find preview deployment
3. Click **"Promote to Production"**

---

## 📊 Monitoring & Maintenance

### Daily Checklist

- [ ] Check error logs in Vercel Dashboard
- [ ] Monitor payment success rate
- [ ] Review webhook delivery failures
- [ ] Check database performance

### Weekly Checklist

- [ ] Review user feedback
- [ ] Check uptime reports
- [ ] Analyze slow queries
- [ ] Update dependencies (if security patches)

### Monthly Checklist

- [ ] Rotate secrets (JWT, CSRF)
- [ ] Review and delete old logs
- [ ] Database backup verification
- [ ] Performance optimization review

---

## 🎯 Success Criteria

Your production deployment is successful when:

✅ Health check returns healthy  
✅ PhonePe OAuth authentication works  
✅ Test payment completes end-to-end  
✅ Webhook received and processed  
✅ Order status updates correctly  
✅ Stock management works  
✅ No errors in deployment logs  
✅ All pages load correctly  
✅ Authentication works  
✅ Admin panel functional  

---

## 📞 Support & Resources

- **PhonePe Support:** https://business.phonepe.com/support
- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Project Documentation:** [/docs/environment-setup.md](environment-setup.md)

---

## 🎉 Congratulations!

Your Chulbuli Jewels e-commerce platform is now live in production! 🚀

**Next Steps:**
1. Monitor first few transactions closely
2. Refund test payments via PhonePe Dashboard
3. Set up error tracking (Sentry recommended)
4. Configure custom domain (optional)
5. Add Google Analytics (optional)
6. Set up uptime monitoring (UptimeRobot, Pingdom)

---

**Document Version:** 1.0  
**Last Updated:** February 18, 2026  
**Author:** Chulbuli Jewels Development Team
