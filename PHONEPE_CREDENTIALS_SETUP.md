# 🔑 PhonePe Credentials Setup Guide

## ❌ Current Issue

You're getting **"KEY_NOT_CONFIGURED - Key not found for the merchant"** because the credentials in your `.env.local` are example/placeholder credentials, not real ones from your PhonePe account.

---

## ✅ How to Get Your Real PhonePe Credentials

### **Step 1: Login to PhonePe Business Dashboard**

1. Visit: https://business.phonepe.com/
2. Login with your merchant account credentials

### **Step 2: Navigate to API/Developer Section**

Depending on your dashboard version, look for one of these:
- **"Developers"** tab
- **"API Details"** section
- **"Integration"** section
- **"Settings"** → **"API Keys"**

### **Step 3: Get Your Credentials**

You should see three important values:

#### 🔹 **Merchant ID** (PHONEPE_CLIENT_ID)
- Example format: `PGTESTPAYUAT`, `M221XXXXX`, or similar
- This is your unique merchant identifier
- Copy this value

#### 🔹 **Salt Key** (PHONEPE_CLIENT_SECRET)
- This is a long alphanumeric string
- Example: `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399`
- Keep this secret and never commit to version control
- Copy this value

#### 🔹 **Salt Index** (PHONEPE_CLIENT_VERSION)
- Usually `"1"` or `"2"` 
- This is a single digit number
- Copy this value

### **Step 4: Check Environment Mode**

Make sure you're using the correct environment:

#### For Testing/UAT:
```
PHONEPE_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox"
```

#### For Production:
```
PHONEPE_BASE_URL="https://api.phonepe.com/apis/hermes"
```

---

## 📝 Update Your `.env.local` File

Once you have your credentials, update your `.env.local`:

```env
# PhonePe Configuration (Payment Gateway)
PHONEPE_CLIENT_ID="YOUR_ACTUAL_MERCHANT_ID"
PHONEPE_CLIENT_SECRET="YOUR_ACTUAL_SALT_KEY"
PHONEPE_CLIENT_VERSION="1"
PHONEPE_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Webhook Authentication
PHONEPE_WEBHOOK_USERNAME="chulbuli_webhook"
PHONEPE_WEBHOOK_PASSWORD="Khushi12353"
```

### Example (with dummy test credentials PhonePe might provide):

```env
# Example UAT/Test credentials (PhonePe provides these for testing)
PHONEPE_CLIENT_ID="PGTESTPAYUAT"
PHONEPE_CLIENT_SECRET="099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"
PHONEPE_CLIENT_VERSION="1"
PHONEPE_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🔄 After Updating Credentials

1. **Save the `.env.local` file**

2. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   
   # Clear Next.js cache
   Remove-Item .next -Recurse -Force
   
   # Restart
   npm run dev
   ```

3. **Test the payment:**
   - Go to checkout page
   - Select PhonePe payment
   - Click "Place Order"
   - You should now be redirected to PhonePe payment page

---

## 🎯 Where to Find These in PhonePe Dashboard

### Different dashboard layouts:

#### Option A: Modern Dashboard
```
Home → Developers → API Details
```

#### Option B: Classic Dashboard
```
Settings → Integration → API Keys
```

#### Option C: Business Dashboard
```
Dashboard → Payment Gateway → Credentials
```

---

## 🧪 Testing with PhonePe Test Credentials

If you don't have production credentials yet, PhonePe provides **test credentials** for UAT environment:

1. In PhonePe Dashboard, switch to **UAT/Test Mode**
2. PhonePe will provide test credentials like:
   - Merchant ID: `PGTESTPAYUAT` or similar
   - Salt Key: A test salt key string
   - Salt Index: `1`

3. Use these for testing before going to production

---

## 📞 If You Can't Find Credentials

### Contact PhonePe Support:
- **Email:** merchants@phonepe.com
- **Phone:** Check your PhonePe dashboard for support number
- **Dashboard:** Look for "Support" or "Help" section

### What to Ask:
> "I need my API credentials (Merchant ID, Salt Key, and Salt Index) for PhonePe Payment Gateway integration. I'm trying to integrate PhonePe into my e-commerce website."

---

## ✅ Verification Checklist

After updating credentials, verify:

- [ ] Merchant ID is from your actual PhonePe account
- [ ] Salt Key is the correct value from dashboard
- [ ] Salt Index matches (usually "1")
- [ ] BASE_URL matches your environment (sandbox for testing)
- [ ] Saved `.env.local` file
- [ ] Restarted development server
- [ ] No more "KEY_NOT_CONFIGURED" error

---

## 🚨 Security Reminder

- ❌ **NEVER** commit `.env.local` to git
- ❌ **NEVER** share your Salt Key publicly
- ✅ Keep production credentials separate from test credentials
- ✅ Use different credentials for development and production

---

## 🎉 Once Working

After you get the real credentials and it works:

1. ✅ You'll see PhonePe payment page when clicking "Place Order"
2. ✅ You can test with PhonePe test cards/UPI
3. ✅ Webhook will receive payment confirmations
4. ✅ Orders will be marked as completed automatically

---

## Need Help?

If you still can't find your credentials:
1. Take screenshots of what you see in PhonePe dashboard
2. Look for any email from PhonePe with "API credentials" or "Integration"
3. Contact PhonePe support directly

**The key point:** You need credentials from YOUR actual PhonePe merchant account, not example credentials from documentation.
