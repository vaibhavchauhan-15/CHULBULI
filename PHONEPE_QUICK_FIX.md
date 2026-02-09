# ⚡ QUICK FIX - PhonePe Credentials Needed

## 🚨 Current Error

```
KEY_NOT_CONFIGURED - Key not found for the merchant
```

**Reason:** You're using example/placeholder credentials, not real ones.

---

## ✅ What You Need To Do RIGHT NOW

### 1️⃣ **Login to PhonePe Business Dashboard**
   - URL: https://business.phonepe.com/
   - Use your merchant account login

### 2️⃣ **Find API Credentials Section**
   Look for: **Developers** → **API Details** (or similar)

### 3️⃣ **Copy These 3 Values:**

   📋 **Merchant ID** → Goes in `PHONEPE_CLIENT_ID`
   - Looks like: `PGTESTPAYUAT`, `M221XXXXX`, etc.
   
   📋 **Salt Key** → Goes in `PHONEPE_CLIENT_SECRET`  
   - Looks like: `099eb0cd-02cf-4e2a-8aca-3e6c6aff0399`
   
   📋 **Salt Index** → Goes in `PHONEPE_CLIENT_VERSION`
   - Usually: `1` or `2`

### 4️⃣ **Update `.env.local` File**

   Open: `.env.local`
   
   Replace these lines:
   ```env
   PHONEPE_CLIENT_ID="YOUR_MERCHANT_ID_HERE"
   PHONEPE_CLIENT_SECRET="YOUR_SALT_KEY_HERE"
   PHONEPE_CLIENT_VERSION="1"
   ```
   
   With YOUR actual values from PhonePe dashboard.

### 5️⃣ **Restart Server**

   ```bash
   # In terminal, press Ctrl+C to stop server
   
   # Then run:
   npm run dev
   ```

### 6️⃣ **Test Payment**

   - Go to http://localhost:3000/checkout
   - Select PhonePe payment
   - Click "Place Order"
   - ✅ Should redirect to PhonePe payment page!

---

## 🎯 Don't Have PhonePe Merchant Account Yet?

### Option A: Create PhonePe Merchant Account
1. Visit: https://business.phonepe.com/
2. Sign up as a merchant
3. Complete verification
4. Get API credentials from dashboard

### Option B: Use Testing/UAT Credentials (Temporary)
1. In PhonePe dashboard, switch to **Test/UAT Mode**
2. PhonePe provides test credentials for development
3. Use those temporarily to test integration

### Option C: Disable PhonePe Temporarily
If you want to test other features first:

In `src/app/checkout/page.tsx`, find:
```typescript
const [paymentGateway, setPaymentGateway] = useState<'razorpay' | 'phonepe'>('phonepe')
```

Change to:
```typescript
const [paymentGateway, setPaymentGateway] = useState<'razorpay' | 'phonepe'>('razorpay')
```

This will default to Razorpay instead.

---

## 📞 Can't Find Credentials?

**Email PhonePe Support:**
- merchants@phonepe.com
- Ask: "I need my API credentials (Merchant ID, Salt Key, Salt Index) for payment gateway integration"

---

## ✅ Checklist

- [ ] Logged into PhonePe Business Dashboard
- [ ] Found Merchant ID, Salt Key, Salt Index
- [ ] Updated `.env.local` with real credentials
- [ ] Restarted dev server
- [ ] Tested payment - redirects to PhonePe page
- [ ] No more "KEY_NOT_CONFIGURED" error

---

**Need more help?** See detailed guide: [`PHONEPE_CREDENTIALS_SETUP.md`](PHONEPE_CREDENTIALS_SETUP.md)
