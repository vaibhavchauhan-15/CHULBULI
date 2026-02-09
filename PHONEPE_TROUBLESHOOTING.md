# PhonePe Payment Integration - Troubleshooting Guide

## 🔍 Common Issues and Solutions

### Issue 1: Orders are created even when payment fails

**Status:** ✅ **FIXED**

**What was the problem:**
- Orders were being created with status `'placed'` immediately
- Stock was being reserved before payment confirmation
- Failed payments still showed orders as placed

**Solution implemented:**
1. Orders now start with status `'pending_payment'`
2. Status changes to `'placed'` only after payment verification
3. Failed payments automatically mark orders as `'cancelled'`
4. Stock is only deducted after successful payment confirmation
5. Abandoned orders (no payment after 30 minutes) are auto-cancelled

**Payment Flow:**
```
1. User clicks "Place Order"
   ↓
2. Order created with status='pending_payment', paymentStatus='pending'
   ↓
3. PhonePe payment page opened
   ↓
4. User completes payment
   ↓
5. Webhook/Status API verifies payment
   ↓
6a. SUCCESS: status='placed', paymentStatus='completed', stock deducted ✅
6b. FAILED: status='cancelled', paymentStatus='failed' ❌
6c. ABANDONED: Auto-cancelled after 30 minutes ⏰
```

---

### Issue 2: "Real PhonePe not working properly"

**Possible Causes:**

#### A. Merchant Account Not Configured
**Symptoms:**
- Error: `KEY_NOT_CONFIGURED`
- Error: `Merchant Configuration Error`
- OAuth token works but payment creation fails

**Solution:**
1. Login to [PhonePe Business Dashboard](https://business.phonepe.com/)
2. Go to **Settings** → **API Configuration**
3. Enable **"Standard Checkout API"**
4. Contact PhonePe Support if option is not available
5. Verify your merchant account is fully activated (not demo/pending)

#### B. Using Test/Sandbox Credentials in Production
**Symptoms:**
- Payments work locally but fail in production
- Different behavior between environments

**Solution:**
1. Check `.env.local` or production environment variables
2. Ensure you're using **production credentials**:
   ```bash
   # Production (correct)
   PHONEPE_BASE_URL="https://api.phonepe.com/apis/pg"
   PHONEPE_AUTH_URL="https://api.phonepe.com/apis/identity-manager"
   
   # NOT sandbox URLs like:
   # https://api-preprod.phonepe.com/apis/pg-sandbox
   ```
3. Verify Client ID starts with production prefix (not test prefix)

#### C. Webhook Not Configured
**Symptoms:**
- Payment completes but order stays "pending"
- Manual status check shows success but webhook didn't update order

**Solution:**
1. Configure webhook in PhonePe Business Dashboard
2. Webhook URL: `https://www.chulbulijewels.in/api/payment/phonepe/webhook`
3. Add webhook credentials:
   ```bash
   PHONEPE_WEBHOOK_USERNAME="chulbuli_webhook"
   PHONEPE_WEBHOOK_PASSWORD="Khushi12353"
   ```
4. Test webhook delivery using PhonePe dashboard

#### D. Network/Firewall Issues
**Symptoms:**
- Timeout errors
- Connection refused
- API calls fail intermittently

**Solution:**
1. Check if PhonePe IPs are whitelisted (if using firewall)
2. Verify SSL/TLS certificates are valid
3. Test API connectivity: `/api/payment/phonepe/test?token=YOUR_SECRET`

---

## 🧪 Testing Your Integration

### 1. Test Environment Configuration
```bash
GET /api/payment/phonepe/test?token=test-secret-123
```

This will check:
- ✅ Environment variables are set
- ✅ OAuth token generation works
- ✅ Database connection
- ✅ API endpoints configuration

### 2. Test Payment Flow (Local)
1. Add items to cart
2. Go to checkout
3. Complete payment with PhonePe
4. Check order status updates

### 3. Monitor Order Status
```bash
GET /api/payment/phonepe/status?orderId=order_xxxxx
```

### 4. Check Abandoned Orders
```bash
GET /api/cron/cleanup-pending-orders?token=YOUR_CRON_SECRET
```

---

## 📊 Order Status Lifecycle

| Status | Payment Status | Description | Action Required |
|--------|---------------|-------------|-----------------|
| `pending_payment` | `pending` | Order created, awaiting payment | User should complete payment |
| `placed` | `completed` | Payment successful, order confirmed | Process order |
| `cancelled` | `failed` | Payment failed or abandoned | No action needed |

---

## 🔧 Manual Interventions

### Cancel a Stuck Order
```sql
UPDATE "Order" 
SET status = 'cancelled', 
    paymentStatus = 'failed',
    "updatedAt" = NOW()
WHERE id = 'order_xxxxx' 
  AND status = 'pending_payment';
```

### Verify Payment Manually
1. Get merchantOrderId from order
2. Check PhonePe Business Dashboard > Transactions
3. If payment successful but order not updated:
   ```bash
   # Call status API to trigger update
   GET /api/payment/phonepe/status?merchantOrderId=CHULBULI-xxxxx
   ```

---

## 🚨 Error Messages Reference

### `KEY_NOT_CONFIGURED`
**Meaning:** Your merchant account is not enabled for Standard Checkout API

**Fix:** Contact PhonePe support to activate Standard Checkout

### `MINIMUM_AMOUNT_ERROR`
**Meaning:** Order total is less than ₹1 (minimum PhonePe requirement)

**Fix:** Ensure cart total is at least ₹1

### `BAD_REQUEST` / `PR000`
**Meaning:** Invalid payload structure

**Fix:** Check PhonePe API logs, verify payload matches documentation

### `Webhook signature verification failed`
**Meaning:** Webhook authentication failed

**Fix:** Verify PHONEPE_WEBHOOK_USERNAME and PHONEPE_WEBHOOK_PASSWORD match PhonePe dashboard settings

---

## 📝 Maintenance Tasks

### Setup Cron Job for Abandoned Orders
Add to your hosting platform:

**Vercel** (`vercel.json`):
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-pending-orders",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Manual CURL (for testing)**:
```bash
curl -X POST https://www.chulbulijewels.in/api/cron/cleanup-pending-orders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## 🔐 Security Checklist

- [ ] Webhook signature verification enabled
- [ ] CRON_SECRET environment variable set
- [ ] TEST_API_SECRET environment variable set
- [ ] PhonePe credentials stored securely (not in code)
- [ ] Production URLs used in production environment
- [ ] SSL/HTTPS enabled for all callbacks
- [ ] IP whitelisting configured (if required)

---

## 📞 Support Contacts

### PhonePe Support
- Dashboard: https://business.phonepe.com/
- Support: merchantsupport@phonepe.com
- Documentation: https://developer.phonepe.com/

### Application Issues
- Check logs in hosting platform (Vercel/Netlify)
- Review database order records
- Test with `/api/payment/phonepe/test` endpoint

---

## ✅ Quick Verification Checklist

Before going live:
- [ ] Environment variables set correctly (production URLs)
- [ ] PhonePe merchant account activated for Standard Checkout
- [ ] Webhook configured in PhonePe dashboard
- [ ] Test payment completed successfully
- [ ] Order status updates correctly after payment
- [ ] Stock deduction works after successful payment
- [ ] Failed payments marked as cancelled
- [ ] Abandoned orders cleanup cron job configured
- [ ] Customer receives order confirmation (if email configured)
- [ ] SSL certificate valid on website

---

## 🔄 Recent Changes (2026-02-09)

1. ✅ Fixed order placement logic - orders now only marked as "placed" after payment success
2. ✅ Added automatic cancellation of failed/abandoned orders
3. ✅ Improved payment status verification
4. ✅ Added cron job for cleaning up abandoned orders (pending >30 minutes)
5. ✅ Enhanced error messages and logging
6. ✅ Better webhook handling with idempotency
7. ✅ Order-success page now polls payment status before confirmation

**Result:** Orders are no longer created when payment fails. System is production-ready.
