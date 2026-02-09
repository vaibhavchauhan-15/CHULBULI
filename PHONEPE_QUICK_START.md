# 🚀 PhonePe Integration - Quick Start

## ⚡ What You Need to Do NOW

### ✅ STEP 1: Run Database Migration (CRITICAL!)

**YOU MUST DO THIS FIRST BEFORE DEPLOYING!**

Open your database tool (Supabase/Neon/pgAdmin) and run:

```sql
-- File: scripts/add-phonepe-columns.sql
-- Copy and paste this entire file into your SQL editor
```

Or use command line:
```bash
psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME -f scripts/add-phonepe-columns.sql
```

**Don't deploy without this step!** ❌

---

### ✅ STEP 2: Get PhonePe Credentials

1. Go to [PhonePe Business](https://www.phonepe.com/business/)
2. Sign up or login
3. Navigate to **Settings → API Details**
4. Copy these:
   - Client ID
   - Client Secret

---

### ✅ STEP 3: Add Environment Variables

#### For Local Testing (.env.local):

```env
# PhonePe - Sandbox (for testing)
PHONEPE_CLIENT_ID=your_client_id_from_phonepe_dashboard
PHONEPE_CLIENT_SECRET=your_client_secret_from_phonepe_dashboard
PHONEPE_CLIENT_VERSION=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### For Production (Netlify/Vercel):

Add these in your hosting platform's environment variables section:

```env
PHONEPE_CLIENT_ID=your_production_client_id
PHONEPE_CLIENT_SECRET=your_production_client_secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
NEXT_PUBLIC_APP_URL=https://www.chulbulijewels.in
```

---

### ✅ STEP 4: Configure PhonePe Webhook

1. Login to PhonePe Merchant Dashboard
2. Go to **Settings → Webhooks**
3. Add webhook URL:
   ```
   https://www.chulbulijewels.in/api/payment/phonepe/webhook
   ```
4. Enable events:
   - ✅ `pg.order.completed`
   - ✅ `pg.order.failed`
5. Save

---

### ✅ STEP 5: Deploy

```bash
# Commit changes
git add .
git commit -m "feat: Add PhonePe payment gateway"

# Push to deploy
git push origin main
```

---

### ✅ STEP 6: Test It!

1. Visit your checkout page
2. Add items to cart
3. Click "Pay Online"
4. Select "PhonePe"
5. Complete a small test payment (₹10)
6. Verify order status updates to "completed"

---

## 🎯 Files You Modified

### New Files:
- ✅ `src/lib/phonepe.ts`
- ✅ `src/app/api/payment/phonepe/create/route.ts`
- ✅ `src/app/api/payment/phonepe/webhook/route.ts`
- ✅ `src/app/api/payment/phonepe/status/route.ts`
- ✅ `scripts/add-phonepe-columns.sql`

### Modified Files:
- ✅ `src/lib/db/schema.ts` (added PhonePe columns)
- ✅ `src/app/checkout/page.tsx` (added PhonePe UI)
- ✅ `.env.example` (added PhonePe vars)

---

## 🔥 Quick Troubleshooting

### Problem: Can't see PhonePe option on checkout
**Fix:** Check if environment variables are added correctly

### Problem: Payment creation fails
**Fix:** Verify PhonePe credentials are correct

### Problem: Webhook not working
**Fix:** Make sure webhook URL has HTTPS and is correct in PhonePe dashboard

### Problem: Order stuck in pending
**Fix:** Check webhook logs or use status API:
```
GET /api/payment/phonepe/status?orderId=YOUR_ORDER_ID
```

---

## 📚 Full Documentation

- **Complete Guide:** [`PHONEPE_DEPLOYMENT_GUIDE.md`](PHONEPE_DEPLOYMENT_GUIDE.md)
- **Integration Summary:** [`PHONEPE_INTEGRATION_SUMMARY.md`](PHONEPE_INTEGRATION_SUMMARY.md)

---

## ✨ That's It!

Your PhonePe integration is ready! Users can now pay with:
- UPI
- Credit/Debit Cards
- Net Banking
- Wallets

🎉 **Happy Selling!**
