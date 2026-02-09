# PhonePe Payment Gateway Integration - Deployment Guide

## 🎯 Overview

This guide covers the complete deployment process for PhonePe payment gateway integration in Chulbuli Jewels.

---

## 📋 Pre-Deployment Checklist

### 1. Database Migration

Before deploying, you **MUST** run the database migration to add PhonePe support columns:

```bash
# Connect to your PostgreSQL database and run:
psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME -f scripts/add-phonepe-columns.sql
```

Or use your database management tool to execute the SQL file: [`scripts/add-phonepe-columns.sql`](scripts/add-phonepe-columns.sql)

**What this migration does:**
- Adds `paymentProvider` column (cod | razorpay | phonepe)
- Adds `merchantOrderId` column for PhonePe order tracking
- Adds `transactionId` column for PhonePe transaction IDs
- Creates indexes for performance optimization
- Updates existing orders to set correct payment provider

### 2. Environment Variables

Add the following environment variables to your production environment:

#### For Netlify/Vercel:
Navigate to: **Settings → Environment Variables** and add:

```env
# PhonePe Payment Gateway Configuration
PHONEPE_CLIENT_ID=your_phonepe_client_id_here
PHONEPE_CLIENT_SECRET=your_phonepe_client_secret_here
PHONEPE_CLIENT_VERSION=1

# Production URL (change from sandbox to production)
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes

# Your application URL (for redirect and webhook)
NEXT_PUBLIC_APP_URL=https://www.chulbulijewels.in
```

#### Getting PhonePe Credentials:

1. Sign up/Login to [PhonePe Merchant Dashboard](https://www.phonepe.com/business/)
2. Navigate to **Settings → API Details**
3. Copy your:
   - Client ID
   - Client Secret
   - (Client Version is usually "1")

⚠️ **IMPORTANT:** 
- For testing, use: `PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox`
- For production, use: `PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes`

---

## 🔧 PhonePe Dashboard Configuration

### 1. Configure Webhook URL

1. Login to [PhonePe Merchant Dashboard](https://www.phonepe.com/business/)
2. Navigate to **Settings → Webhooks**
3. Add webhook URL:
   ```
   https://www.chulbulijewels.in/api/payment/phonepe/webhook
   ```

4. Select the following events:
   - ✅ `pg.order.completed` - Payment successful
   - ✅ `pg.order.failed` - Payment failed

5. (Optional) Add Basic Authentication:
   - Username: `chulbuli_webhook`
   - Password: Generate a strong password and store securely

### 2. Configure Redirect URLs

Add your success and failure redirect URLs:

- **Success URL:** `https://www.chulbulijewels.in/order-success`
- **Failure URL:** `https://www.chulbulijewels.in/checkout`

### 3. Enable Payment Methods

In PhonePe Dashboard, ensure the following payment methods are enabled:
- ✅ UPI
- ✅ Debit Cards
- ✅ Credit Cards
- ✅ Net Banking
- ✅ Wallets

---

## 🚀 Deployment Steps

### Step 1: Push Code to Repository

```bash
git add .
git commit -m "feat: Add PhonePe payment gateway integration"
git push origin main
```

### Step 2: Run Database Migration

**Option A: Using Direct SQL Connection**
```bash
psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME -f scripts/add-phonepe-columns.sql
```

**Option B: Using Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `scripts/add-phonepe-columns.sql`
3. Execute the query

**Option C: Using Neon Console**
1. Go to Neon Console → SQL Editor
2. Copy contents of `scripts/add-phonepe-columns.sql`
3. Execute the query

### Step 3: Add Environment Variables

Add all required environment variables to your hosting platform:

**For Netlify:**
```bash
netlify env:set PHONEPE_CLIENT_ID "your_client_id"
netlify env:set PHONEPE_CLIENT_SECRET "your_client_secret"
netlify env:set PHONEPE_CLIENT_VERSION "1"
netlify env:set PHONEPE_BASE_URL "https://api.phonepe.com/apis/hermes"
netlify env:set NEXT_PUBLIC_APP_URL "https://www.chulbulijewels.in"
```

**For Vercel:**
```bash
vercel env add PHONEPE_CLIENT_ID production
vercel env add PHONEPE_CLIENT_SECRET production
vercel env add PHONEPE_CLIENT_VERSION production
vercel env add PHONEPE_BASE_URL production
vercel env add NEXT_PUBLIC_APP_URL production
```

### Step 4: Trigger Deployment

Your platform will automatically deploy the changes. Monitor the deployment:

**Netlify:**
- Check deployment status at: Deploys → Latest Deploy
- View build logs for any errors

**Vercel:**
- Check deployment status at: Deployments → Latest
- View build logs for any errors

### Step 5: Verify Deployment

After successful deployment:

1. **Test Checkout Page:**
   - Visit `https://www.chulbulijewels.in/checkout`
   - Verify "Pay Online" option shows both Razorpay and PhonePe
   - Select PhonePe as payment gateway

2. **Test Payment Flow (Sandbox - if available):**
   - Add items to cart
   - Proceed to checkout
   - Select PhonePe
   - Complete test payment
   - Verify order is created with status "pending"
   - Verify webhook updates order to "completed"

3. **Check Database:**
   ```sql
   -- Verify new columns exist
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'Order' 
   AND column_name IN ('paymentProvider', 'merchantOrderId', 'transactionId');
   
   -- Check if indexes are created
   SELECT indexname FROM pg_indexes WHERE tablename = 'Order';
   ```

---

## 🧪 Testing

### Test in Sandbox Environment (Development)

1. Use sandbox environment variables:
   ```env
   PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
   ```

2. PhonePe provides test credentials for sandbox testing
3. Use test UPI IDs and cards provided by PhonePe

### Test in Production

⚠️ **Always test with small amounts first!**

1. Create a test order with minimal amount (₹10 or less)
2. Complete payment using a real payment method
3. Verify:
   - Payment redirect works
   - Webhook is received and processed
   - Order status is updated to "completed"
   - Stock is deducted correctly
   - Email confirmation is sent (if configured)

---

## 📊 Monitoring & Debugging

### 1. Check Webhook Logs

PhonePe provides webhook delivery logs in their dashboard:
- Go to **Settings → Webhooks → Delivery Logs**
- Check for failed deliveries
- Verify response codes (200 OK is success)

### 2. Application Logs

Monitor your application logs for:
```
PhonePe Webhook Received
✅ Payment success processed for order
❌ Payment failed processed for order
```

**Netlify:**
```bash
netlify logs:function payment/phonepe/webhook
```

**Vercel:**
- Check Function Logs in Vercel Dashboard

### 3. Database Monitoring

Query to check PhonePe orders:
```sql
-- Check recent PhonePe orders
SELECT 
  id, 
  "orderNumber",
  "paymentProvider",
  "paymentStatus",
  "merchantOrderId",
  "transactionId",
  "totalPrice",
  "createdAt"
FROM "Order"
WHERE "paymentProvider" = 'phonepe'
ORDER BY "createdAt" DESC
LIMIT 10;

-- Check pending payments
SELECT COUNT(*) 
FROM "Order" 
WHERE "paymentProvider" = 'phonepe' 
AND "paymentStatus" = 'pending';
```

---

## 🔒 Security Best Practices

1. **Never expose secrets in client-side code**
   - PhonePe credentials should only be in server-side env variables
   - Never commit `.env` files to version control

2. **Always verify webhook signatures**
   - The webhook handler already includes signature verification
   - Never skip this step in production

3. **Implement webhook idempotency**
   - Already implemented: Won't process the same webhook twice
   - Checks if order is already marked as "completed"

4. **Use HTTPS for webhooks**
   - PhonePe requires HTTPS for webhook URLs
   - Your domain should have valid SSL certificate

5. **Monitor for suspicious activities**
   - Set up alerts for failed payments
   - Monitor for unusual order patterns
   - Track webhook failures

---

## ❌ Troubleshooting

### Problem: Webhook not received

**Solution:**
1. Check PhonePe dashboard webhook delivery logs
2. Verify webhook URL is correct: `https://www.chulbulijewels.in/api/payment/phonepe/webhook`
3. Check if your server returned 200 OK
4. Verify SSL certificate is valid

### Problem: Payment successful but order not updated

**Solution:**
1. Check webhook logs in application
2. Verify webhook signature validation is working
3. Manually check payment status:
   ```
   GET /api/payment/phonepe/status?merchantOrderId=CHULBULI-123456789
   ```

### Problem: Invalid signature error

**Solution:**
1. Verify `PHONEPE_CLIENT_SECRET` is correct
2. Check if webhook payload is being modified before verification
3. Ensure no proxy/middleware is altering the request

### Problem: Stock not deducted

**Solution:**
1. Check if webhook was received and processed
2. Verify order status is "completed"
3. Check database transaction logs
4. Run status check API to manually update

---

## 🔄 Rollback Plan

If something goes wrong after deployment:

### 1. Immediate Rollback (Disable PhonePe)

Update environment variable to hide PhonePe option:
```env
PHONEPE_ENABLED=false
```

Then modify checkout page to check this env var before showing PhonePe option.

### 2. Database Rollback

If you need to remove PhonePe columns:
```sql
-- ONLY IF NEEDED - This will remove PhonePe data
ALTER TABLE "Order" DROP COLUMN IF EXISTS "paymentProvider";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "merchantOrderId";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "transactionId";

-- Drop indexes
DROP INDEX IF EXISTS "Order_paymentProvider_idx";
DROP INDEX IF EXISTS "Order_merchantOrderId_idx";
DROP INDEX IF EXISTS "Order_transactionId_idx";
```

⚠️ **Warning:** This will delete all PhonePe payment data. Only do this if absolutely necessary.

---

## 📞 Support

### PhonePe Support:
- Email: merchants@phonepe.com
- Phone: Check PhonePe merchant dashboard
- Dashboard: https://www.phonepe.com/business/

### Developer Contact:
- Check webhook logs for detailed error messages
- Monitor database for pending payments
- Use status check API for manual verification

---

## ✅ Post-Deployment Checklist

- [ ] Database migration executed successfully
- [ ] All environment variables added
- [ ] Webhook URL configured in PhonePe dashboard
- [ ] PhonePe events enabled (pg.order.completed, pg.order.failed)
- [ ] Test payment completed successfully
- [ ] Webhook received and processed correctly
- [ ] Order status updated to "completed"
- [ ] Stock deducted properly
- [ ] Monitoring and logging configured
- [ ] Error alerts set up
- [ ] Support team notified of new payment gateway

---

## 📈 Next Steps (Optional Enhancements)

1. **Email Notifications:**
   - Send confirmation email on successful PhonePe payment
   - Send failure notification email

2. **Admin Dashboard:**
   - Add filter for PhonePe orders
   - Show payment gateway in order details
   - Display transaction IDs

3. **Analytics:**
   - Track PhonePe vs Razorpay usage
   - Monitor payment success rates
   - Analyze payment method preferences

4. **Retry Logic:**
   - Implement payment retry mechanism
   - Auto-retry webhook delivery
   - Fallback to status check API

---

## 🎉 Success!

Your PhonePe payment gateway integration is now live! 

Users can now:
- ✅ Choose between Razorpay and PhonePe for online payments
- ✅ Pay using UPI, Cards, Net Banking, and Wallets via PhonePe
- ✅ Experience seamless payment flow
- ✅ Receive instant order confirmation

**Happy Selling! 💎✨**
