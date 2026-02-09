# PhonePe Diagnostic Script

## Quick Diagnostic Commands

Run these commands to diagnose PhonePe issues:

### 1. Test Configuration
```bash
curl "http://localhost:3000/api/payment/phonepe/test?token=test-secret-123"
```

### 2. Check Recent Orders
```sql
-- In your PostgreSQL client
SELECT 
  "orderNumber",
  status,
  "paymentStatus",
  "merchantOrderId",
  "totalPrice",
  "createdAt"
FROM "Order"
WHERE "createdAt" > NOW() - INTERVAL '1 day'
ORDER BY "createdAt" DESC;
```

### 3. Check Pending Orders
```sql
SELECT COUNT(*) as pending_count, status, "paymentStatus"
FROM "Order"
WHERE "createdAt" > NOW() - INTERVAL '1 day'
GROUP BY status, "paymentStatus";
```

### 4. Verify Environment Variables (Production)
```bash
# Check if using production URLs
echo $PHONEPE_BASE_URL
# Should be: https://api.phonepe.com/apis/pg

echo $PHONEPE_AUTH_URL  
# Should be: https://api.phonepe.com/apis/identity-manager
```

### 5. Test Payment Status Check
```bash
# Replace with actual merchantOrderId
curl "http://localhost:3000/api/payment/phonepe/status?merchantOrderId=CHULBULI-1234567890-ABCD"
```

---

## Common Error Solutions

### Error: "KEY_NOT_CONFIGURED"

**Diagnosis:**
```bash
# Test if OAuth works
curl "http://localhost:3000/api/payment/phonepe/test?token=test-secret-123"
```

If OAuth succeeds but payment fails → Merchant not configured

**Fix:**
1. Login to PhonePe Business Dashboard
2. Navigate to: Settings → API Configuration
3. Enable "Standard Checkout API"
4. If not available, contact support: merchantsupport@phonepe.com

---

### Error: Payment completes but order stays pending

**Diagnosis:**
```sql
-- Check if webhook is updating orders
SELECT 
  id,
  status,
  "paymentStatus",
  "updatedAt",
  "transactionId"
FROM "Order"
WHERE "merchantOrderId" = 'YOUR_MERCHANT_ORDER_ID';
```

**Fix:**
1. Check webhook logs in hosting platform
2. Verify webhook URL in PhonePe dashboard
3. Test webhook signature:
   ```bash
   # Check webhook credentials
   echo $PHONEPE_WEBHOOK_USERNAME
   echo $PHONEPE_WEBHOOK_PASSWORD
   ```
4. Manually trigger status check:
   ```bash
   curl "https://www.chulbulijewels.in/api/payment/phonepe/status?merchantOrderId=CHULBULI-xxx"
   ```

---

### Error: Minimum amount error

**Diagnosis:**
```sql
SELECT 
  id,
  "totalPrice",
  "paymentStatus"
FROM "Order"
WHERE CAST("totalPrice" AS DECIMAL) < 1;
```

**Fix:**
PhonePe requires minimum ₹1 (100 paisa). Update cart validation.

---

## Production Verification Steps

### Step 1: Verify Environment
```bash
# Run on production server or check environment variables
printenv | grep PHONEPE
```

Expected output:
```
PHONEPE_CLIENT_ID=SU2602091456313521993499
PHONEPE_CLIENT_SECRET=***
PHONEPE_CLIENT_VERSION=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager
PHONEPE_WEBHOOK_USERNAME=chulbuli_webhook
PHONEPE_WEBHOOK_PASSWORD=***
```

### Step 2: Test OAuth
Visit: `https://www.chulbulijewels.in/api/payment/phonepe/test?token=YOUR_SECRET`

Should return:
```json
{
  "overallStatus": "PASS",
  "tests": [
    {"test": "Environment Variables", "status": "pass"},
    {"test": "OAuth Token Generation", "status": "pass"}
  ]
}
```

### Step 3: Test Payment Creation
1. Create a test order
2. Check browser network tab for API responses
3. Look for errors in POST `/api/payment/phonepe/create`

### Step 4: Monitor Webhooks
1. Complete a payment
2. Check application logs
3. Look for: "PhonePe Webhook Received"
4. Verify: "Payment success processed for order"

---

## Real-time Debugging

### Enable Detailed Logging

The application already has comprehensive logging. Check your hosting platform logs for:

**Successful Flow:**
```
PhonePe: Requesting OAuth token...
✅ PhonePe OAuth token obtained successfully
PhonePe Standard Checkout v2: Creating payment order...
✅ PhonePe Standard Checkout payment created successfully
PhonePe Webhook Received: { event: 'checkout.order.completed' }
✅ Payment success processed for order: order_xxxxx
```

**Failed Flow:**
```
PhonePe OAuth token obtained successfully
PhonePe Order Creation Error: { code: 'KEY_NOT_CONFIGURED' }
Failed to create PhonePe order: Merchant Configuration Error
```

---

## Emergency Fixes

### If PhonePe Completely Broken

1. **Disable PhonePe temporarily:**
   ```typescript
   // In checkout page, comment out PhonePe option
   // Show only COD or Razorpay
   ```

2. **Use Razorpay instead:**
   - Already configured in your system
   - Works as fallback payment option

3. **Manual order processing:**
   ```sql
   -- If customer paid but order not updated
   UPDATE "Order" 
   SET status = 'placed',
       "paymentStatus" = 'completed',
       "transactionId" = 'MANUAL_VERIFICATION',
       "updatedAt" = NOW()
   WHERE "merchantOrderId" = 'CHULBULI-xxx';
   
   -- Then manually deduct stock
   ```

---

## Contact Information

**PhonePe Support:**
- Email: merchantsupport@phonepe.com
- Dashboard: https://business.phonepe.com/
- Phone: Check PhonePe dashboard for support number

**Submit These Details:**
1. Merchant ID: `SU2602091456313521993499`
2. Error message
3. Timestamp of issue
4. Transaction ID (if available)
5. Screenshot of error

---

## Success Indicators

Your integration is working if:
- ✅ Test endpoint returns "PASS"
- ✅ OAuth token generates successfully
- ✅ Payment creation returns redirectUrl
- ✅ Webhook receives and processes events
- ✅ Order status updates to 'placed' after payment
- ✅ Stock deducts after successful payment
- ✅ Failed payments mark orders as 'cancelled'
