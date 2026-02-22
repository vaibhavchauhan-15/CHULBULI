# PhonePe Production Deployment Guide

## 🔐 Environment-Specific Credentials Setup

### Local Development (.env)
✅ Uses **SANDBOX** credentials for testing

```env
# PhonePe Sandbox Configuration
PHONEPE_CLIENT_ID=M23BHBY0J6I85_2602091507
PHONEPE_CLIENT_SECRET=NWY3YjUzY2QtMWFhNy00MWFiLWIyMDItODAxNzA4OThjMThi
PHONEPE_CLIENT_VERSION=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
```

---

### Vercel Development Environment
✅ Uses **SANDBOX** credentials

**Command to set:**
```bash
vercel env add PHONEPE_CLIENT_ID development
vercel env add PHONEPE_CLIENT_SECRET development
vercel env add PHONEPE_BASE_URL development
vercel env add PHONEPE_AUTH_URL development
```

**Values:**
- `PHONEPE_BASE_URL`: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- `PHONEPE_AUTH_URL`: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- Use your sandbox credentials

---

### Vercel Preview Environment
✅ Uses **SANDBOX** credentials

**Command to set:**
```bash
vercel env add PHONEPE_CLIENT_ID preview
vercel env add PHONEPE_CLIENT_SECRET preview
vercel env add PHONEPE_BASE_URL preview
vercel env add PHONEPE_AUTH_URL preview
```

**Values:** Same as development (sandbox)

---

### Vercel Production Environment
🔴 Uses **LIVE/PRODUCTION** credentials

**Command to set:**
```bash
vercel env add PHONEPE_CLIENT_ID production
vercel env add PHONEPE_CLIENT_SECRET production
vercel env add PHONEPE_BASE_URL production
vercel env add PHONEPE_AUTH_URL production
vercel env add PHONEPE_WEBHOOK_URL production
vercel env add PHONEPE_WEBHOOK_USERNAME production
vercel env add PHONEPE_WEBHOOK_PASSWORD production
vercel env add NEXT_PUBLIC_APP_URL production
```

**CRITICAL VALUES FOR PRODUCTION:**
```env
# Production PhonePe Configuration
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager
PHONEPE_CLIENT_ID=<YOUR_LIVE_CLIENT_ID>
PHONEPE_CLIENT_SECRET=<YOUR_LIVE_CLIENT_SECRET>
PHONEPE_CLIENT_VERSION=1

# Production Webhook Configuration
PHONEPE_WEBHOOK_URL=https://www.chulbulijewels.in/api/payment/phonepe/webhook
PHONEPE_WEBHOOK_USERNAME=<YOUR_WEBHOOK_USERNAME>
PHONEPE_WEBHOOK_PASSWORD=<YOUR_WEBHOOK_PASSWORD>

# Production App URL (MUST be HTTPS)
NEXT_PUBLIC_APP_URL=https://www.chulbulijewels.in
```

---

## 🔍 Verify Production Environment Variables

### 1. Check Current Vercel Environment Variables

```bash
# List all environment variables
vercel env ls

# Pull specific environment variables
vercel env pull .env.production --environment=production
```

### 2. Verify Production Credentials

```bash
# Run the production verification script
node scripts/verify-phonepe-production.js
```

This will test:
- ✅ Configuration validity
- ✅ OAuth authentication
- ✅ Payment creation
- ✅ Status check
- ✅ Security checklist

---

## 🚀 Production Verification Steps

### STEP 1: Verify Configuration

Run locally with production credentials:

```bash
# Create temporary .env.production file with LIVE credentials
cp .env.production.example .env.production

# Edit and add LIVE credentials
nano .env.production

# Load and test
export $(cat .env.production | xargs) && node scripts/verify-phonepe-production.js
```

**Expected Output:**
```
✔ Using correct PRODUCTION base URL
✔ Using correct PRODUCTION auth URL
✔ App URL is HTTPS (required for production)
✔ Successfully obtained OAuth token
```

---

### STEP 2: Test on Vercel Production

After deploying to Vercel production:

```bash
# Deploy to production
vercel --prod

# Test the deployed API endpoint
curl https://www.chulbulijewels.in/api/payment/phonepe/test
```

**Create a test API endpoint** to verify production setup:

```typescript
// src/app/api/payment/phonepe/test/route.ts
export async function GET() {
  const config = {
    clientId: process.env.PHONEPE_CLIENT_ID?.substring(0, 10),
    baseUrl: process.env.PHONEPE_BASE_URL,
    authUrl: process.env.PHONEPE_AUTH_URL,
    environment: process.env.NODE_ENV,
    isProduction: !process.env.PHONEPE_BASE_URL?.includes('sandbox'),
  };
  
  return Response.json(config);
}
```

---

### STEP 3: Verify Webhook Configuration

1. **PhonePe Dashboard Settings:**
   - Go to PhonePe Merchant Dashboard
   - Turn OFF "Test Mode"
   - Navigate to Webhook Configuration
   - Set Webhook URL: `https://www.chulbulijewels.in/api/payment/phonepe/webhook`
   - Set Username & Password (from your env vars)
   - Save configuration

2. **Test Webhook Authorization:**

```bash
# Generate expected signature
echo -n "your_username:your_password" | sha256sum

# Compare with what PhonePe sends in Authorization header
```

3. **Test webhook endpoint:**

```bash
curl -X POST https://www.chulbulijewels.in/api/payment/phonepe/webhook \
  -H "Authorization: <YOUR_SIGNATURE>" \
  -H "Content-Type: application/json" \
  -d '{"event":"test","payload":{}}'
```

---

## 🔒 Production Safety Checklist

### Before Accepting Real Payments:

- [ ] ✅ **Environment Variables Set Correctly**
  - [ ] `PHONEPE_BASE_URL` = `https://api.phonepe.com/apis/pg` (NO sandbox)
  - [ ] `PHONEPE_AUTH_URL` = `https://api.phonepe.com/apis/identity-manager`
  - [ ] Live `PHONEPE_CLIENT_ID` configured
  - [ ] Live `PHONEPE_CLIENT_SECRET` configured

- [ ] 🔐 **Security Configuration**
  - [ ] No secrets exposed in client-side code
  - [ ] No `NEXT_PUBLIC_` prefix on sensitive credentials
  - [ ] `.env` files in `.gitignore`
  - [ ] Webhook signature verification enabled

- [ ] 🌐 **URL Configuration**
  - [ ] `NEXT_PUBLIC_APP_URL` is your live HTTPS domain
  - [ ] No `localhost` URLs in production
  - [ ] Redirect URLs point to live domain
  - [ ] Webhook URL is publicly accessible

- [ ] 💰 **Order & Payment Logic**
  - [ ] Unique merchant order IDs (no duplicates)
  - [ ] Token expiry auto-refresh implemented
  - [ ] Orders marked success ONLY after webhook confirmation
  - [ ] Fallback to status API if webhook fails
  - [ ] Webhook handles duplicate events (idempotency)

- [ ] 📊 **Logging & Monitoring**
  - [ ] Error logging enabled
  - [ ] Payment failures tracked
  - [ ] Webhook events logged
  - [ ] Retry mechanism for failed webhooks

- [ ] 🛡️ **API Protection**
  - [ ] Rate limiting on payment endpoints
  - [ ] Input validation & sanitization
  - [ ] CSRF protection enabled
  - [ ] SQL injection prevention

---

## 🧪 Testing Production Setup

### Test 1: Minimal Payment (₹1)

```javascript
// Test with smallest possible amount
const testOrder = {
  amount: 1, // ₹1
  customerName: "Test User",
  customerEmail: "test@example.com",
  customerPhone: "9999999999",
  // ... other fields
};
```

### Test 2: Check Payment URL Domain

**Sandbox Payment URL:**
```
https://mercury-stg.phonepe.com/...
```

**Production Payment URL:**
```
https://mercury.phonepe.com/...
```

If you get a `mercury-stg` or `mercury-t2` URL, you're still using sandbox!

### Test 3: Complete Payment Flow

1. Create payment
2. Complete payment on PhonePe page
3. Verify webhook received
4. Check order status updated
5. Verify redirect to success page

---

## 🔧 Troubleshooting Production Issues

### Issue: "Authentication failed"
**Cause:** Using sandbox credentials with production URLs (or vice versa)

**Solution:**
```bash
# Verify your credentials match your environment
node scripts/verify-phonepe-production.js
```

---

### Issue: "Payment URL shows mercury-stg"
**Cause:** `PHONEPE_BASE_URL` still points to sandbox

**Solution:**
```bash
# Update to production URL
vercel env rm PHONEPE_BASE_URL production
vercel env add PHONEPE_BASE_URL production
# Enter: https://api.phonepe.com/apis/pg
```

---

### Issue: "Webhook not receiving events"
**Causes:**
1. Webhook URL not configured in PhonePe Dashboard
2. Signature verification failing
3. Webhook still in Test Mode

**Solution:**
1. Verify webhook URL in PhonePe Dashboard
2. Ensure Test Mode is OFF
3. Check webhook signature matches:
   ```bash
   echo -n "username:password" | sha256sum
   ```
4. Test webhook endpoint directly:
   ```bash
   curl -X POST https://your-domain.com/api/payment/phonepe/webhook \
     -H "Authorization: <signature>" \
     -H "Content-Type: application/json" \
     -d '{"event":"test"}'
   ```

---

### Issue: "KEY_NOT_CONFIGURED error"
**Cause:** Merchant account not configured for production

**Solution:**
1. Contact PhonePe support (partner-support@phonepe.com)
2. Verify KYC documents submitted
3. Ensure production access enabled
4. Check business approval status

---

## 📊 Environment Detection Logic

The code automatically detects environment from URLs:

```typescript
// Sandbox detection
if (baseUrl.includes('preprod') || baseUrl.includes('sandbox')) {
  return 'SANDBOX';
}

// Production detection
if (baseUrl === 'https://api.phonepe.com/apis/pg') {
  return 'PRODUCTION';
}
```

**Checkout Script URLs:**
- Sandbox: `https://mercury-stg.phonepe.com/web/bundle/checkout.js`
- Production: `https://mercury.phonepe.com/web/bundle/checkout.js`

---

## 🎯 Final Verification Command

Run this before going live:

```bash
# Verify production environment
NODE_ENV=production \
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg \
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager \
PHONEPE_CLIENT_ID=<YOUR_LIVE_ID> \
PHONEPE_CLIENT_SECRET=<YOUR_LIVE_SECRET> \
node scripts/verify-phonepe-production.js
```

**Expected Result:**
```
✔ Passed: 15+
✖ Failed: 0
⚠ Warnings: 0-2

🎉 PRODUCTION CONFIGURATION LOOKS GOOD!
```

---

## 📞 Support

If production verification fails:
1. Check all environment variables
2. Verify credentials in PhonePe Dashboard
3. Contact PhonePe Support: partner-support@phonepe.com
4. Check PhonePe Status Page: status.phonepe.com

---

## 🔄 Quick Reference

| Environment | Base URL | Auth URL | Redirect Domain |
|------------|----------|----------|-----------------|
| **Sandbox** | `api-preprod.phonepe.com/apis/pg-sandbox` | `api-preprod.phonepe.com/apis/pg-sandbox` | `mercury-stg.phonepe.com` |
| **Production** | `api.phonepe.com/apis/pg` | `api.phonepe.com/apis/identity-manager` | `mercury.phonepe.com` |

---

**Last Updated:** 2026-02-22
**Version:** 1.0
