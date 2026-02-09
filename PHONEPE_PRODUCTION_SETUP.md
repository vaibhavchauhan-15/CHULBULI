# PhonePe Production Setup Guide

## ✅ Configuration Complete

Your PhonePe integration is now configured for **PRODUCTION** mode.

---

## 📋 Current Production Settings

### Environment Variables (`.env.local`)

```bash
# Production Credentials
PHONEPE_CLIENT_ID="SU2602091456313521993499"
PHONEPE_CLIENT_SECRET="f20ab239-f1d5-4b42-b57e-4388163cdb3c"
PHONEPE_CLIENT_VERSION="1"

# Production API URLs
PHONEPE_BASE_URL="https://api.phonepe.com/apis/pg"
PHONEPE_AUTH_URL="https://api.phonepe.com/apis/identity-manager"

# Your Website URL (for payment callbacks)
NEXT_PUBLIC_APP_URL="https://www.chulbulijewels.in"

# Webhook Security (Optional but recommended)
PHONEPE_WEBHOOK_USERNAME="chulbuli_webhook"
PHONEPE_WEBHOOK_PASSWORD="Khushi12353"
```

---

## 🔄 API Endpoints Being Used

### Production Endpoints:
- **Authorization**: `https://api.phonepe.com/apis/identity-manager/v1/oauth/token`
- **Create Payment**: `https://api.phonepe.com/apis/pg/checkout/v2/pay`
- **Check Status**: `https://api.phonepe.com/apis/pg/checkout/v2/order/{merchantOrderId}/status`
- **Refund**: `https://api.phonepe.com/apis/pg/payments/v2/refund`
- **Refund Status**: `https://api.phonepe.com/apis/pg/payments/v2/refund/{merchantRefundId}/status`

---

## 🔐 Webhook Configuration

You need to configure the webhook URL in your **PhonePe Business Dashboard**.

### Steps:
1. Login to [PhonePe Business Dashboard](https://business.phonepe.com/)
2. Go to **Developer Settings** → **Webhooks**
3. Set **Test Mode** to **OFF** (Production)
4. Enter webhook details:
   - **Webhook URL**: `https://www.chulbulijewels.in/api/payment/phonepe/webhook`
   - **Username**: `chulbuli_webhook`
   - **Password**: `Khushi12353`
   - **Description**: "Production webhook for Chulbuli Jewels"

5. Select Events:
   - ✅ `checkout.order.completed`
   - ✅ `checkout.order.failed`
   - ✅ `pg.refund.completed`
   - ✅ `pg.refund.failed`

6. Click **Create Webhook**

### IP Whitelisting (Important!)
Allow webhook requests from these PhonePe IPs in your server firewall:
```
103.116.33.8
103.116.33.9
103.116.33.10
103.116.33.11
103.116.33.136
103.116.33.137
103.116.33.138
103.116.33.139
103.116.32.16 - 103.116.32.29
103.116.34.1
103.116.34.16 - 103.116.34.23
103.243.35.242
```

---

## 🧪 Testing Before Going Live

### 1. Test OAuth Token Generation
```bash
curl --location 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=SU2602091456313521993499' \
--data-urlencode 'client_version=1' \
--data-urlencode 'client_secret=f20ab239-f1d5-4b42-b57e-4388163cdb3c' \
--data-urlencode 'grant_type=client_credentials'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "O-Bearer"
}
```

### 2. Test Payment Flow
1. Go to: `https://www.chulbulijewels.in/checkout`
2. Select PhonePe as payment gateway
3. Place a small test order (₹10 or ₹100)
4. Complete payment with real payment method
5. Verify order status updates correctly

### 3. Monitor Logs
Check your application logs for:
- ✅ "PhonePe OAuth token obtained successfully"
- ✅ "PhonePe Standard Checkout payment created successfully"
- ✅ "Payment success processed for order: xxx"

---

## 🔄 Switch Back to Sandbox (Testing)

If you need to test in sandbox mode, update `.env.local`:

```bash
# Sandbox Credentials
PHONEPE_CLIENT_ID="M23BHBY0J6I85_2602091507"
PHONEPE_CLIENT_SECRET="NWY3YjUzY2QtMWFhNy00MWFiLWIyMDItODAxNzA4OThjMThi"

# Sandbox URLs
PHONEPE_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox"
PHONEPE_AUTH_URL="https://api-preprod.phonepe.com/apis/pg-sandbox"

# Local development URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Then restart your development server:
```bash
npm run dev
```

---

## 📊 Payment Flow Summary

```
User clicks "Place Order"
    ↓
1. Create Order (DB status: 'pending')
    ↓
2. Call PhonePe Auth API → Get OAuth Token
    ↓
3. Call PhonePe Create Payment API
    ↓
4. Redirect user to PhonePe Payment Page
    ↓
5. User completes payment on PhonePe
    ↓
6a. PhonePe sends Webhook → Update order status
    ↓
6b. User redirected to /order-success
    ↓
7. Frontend polls Status API to verify payment
    ↓
8. Show success/failed/pending page
```

---

## ⚠️ Important Production Checklist

- [x] Production Client ID and Secret updated
- [x] Production URLs configured
- [x] APP_URL points to live website
- [ ] Webhook configured in PhonePe Dashboard
- [ ] Webhook username/password set
- [ ] IP whitelist configured (if using firewall)
- [ ] SSL certificate valid on your domain
- [ ] Test small payment with real money
- [ ] Monitor webhook deliveries
- [ ] Enable error alerting/logging

---

## 🆘 Troubleshooting

### Error: "Merchant not configured"
**Solution**: Contact PhonePe support to activate your production merchant account.

### Error: "Invalid signature"
**Solution**: Verify webhook username/password match in both `.env.local` and PhonePe Dashboard.

### Webhook not received
**Solutions**:
1. Check webhook URL is accessible publicly (not localhost)
2. Verify SSL certificate is valid
3. Check server firewall allows PhonePe IPs
4. Review webhook logs in PhonePe Dashboard

### Payment stuck in pending
**Solution**: Payment verification happens via:
1. Webhook (primary, instant)
2. Status API polling (fallback, checks every 3s for 30s)
3. Manual check in user account

---

## 📞 Support

**PhonePe Support:**
- Dashboard: https://business.phonepe.com/
- Email: merchant.support@phonepe.com
- Documentation: https://developer.phonepe.com/

**Implementation Issues:**
Check application logs in:
```bash
# View real-time logs
npm run dev

# Check server logs
tail -f /var/log/your-app.log
```

---

## 🎉 You're Ready!

Your PhonePe integration is now in **PRODUCTION MODE**. All payments will be processed with real money. Make sure to:

1. Test with small amounts first
2. Monitor transactions closely
3. Keep webhook credentials secure
4. Regularly check PhonePe Dashboard for transaction reports

Good luck with your live payments! 🚀
