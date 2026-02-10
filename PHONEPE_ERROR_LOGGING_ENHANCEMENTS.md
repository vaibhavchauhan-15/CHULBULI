# PhonePe Error Logging & Debugging Enhancements

## Summary
Added comprehensive error logging, safety checks, and detailed error responses to the PhonePe payment integration to diagnose and fix the production 500 error.

## Changes Made

### 1. Enhanced Error Logging in Payment Creation Endpoint
**File:** `src/app/api/payment/phonepe/create/route.ts`

#### a) Request Tracking
- Added `orderId` variable at function scope to track order ID throughout the request lifecycle
- Added request logging with timestamp, URL, and method at the beginning of the handler
- Added success log after order creation with orderId, merchantOrderId, and totalPrice

#### b) Database Transaction Error Handling
- Added comprehensive try-catch block around database transaction
- Categorizes database errors:
  - **Insufficient Stock** → 400 with INSUFFICIENT_STOCK code
  - **Product Not Found** → 404 with PRODUCT_NOT_FOUND code
  - **Connection Errors** → 503 with DATABASE_CONNECTION_ERROR code
  - **Generic DB Errors** → 500 with DATABASE_ERROR code
- Logs detailed error information: message, name, code, stack trace

#### c) Order Validation Safety Checks
Added validation after order creation to ensure required fields exist:
- Checks for `merchantOrderId` presence
- Validates `totalPrice` is defined and greater than 0
- Returns 500 with INVALID_ORDER_STATE code if validation fails

#### d) Enhanced PhonePe Error Handling
- Improved error categorization for merchant config, auth, and amount errors
- Added structured error logging with timestamp
- Masked sensitive credentials in logs
- Added detailed error responses with:
  - `error`: User-friendly error message
  - `code`: Machine-readable error code
  - `details`: Development-only debug info (message, name, stack)
  - `suggestion`: Actionable guidance for users

#### e) Database Connection Error Detection
- Added specific checks for ECONNREFUSED and connection-related errors
- Returns 503 status for database connectivity issues
- Provides clear suggestion to try again

### 2. Parameter Validation in PhonePe Library
**File:** `src/lib/phonepe.ts`

#### Added Comprehensive Parameter Validation
Added validation at the beginning of `createPhonePeOrder()`:
- Checks `orderDetails` object is defined
- Validates `merchantOrderId` is a non-empty string
- Validates `orderId` is a non-empty string
- Validates `amount` is a positive number
- Validates `customerName` is a non-empty string
- Validates `customerEmail` is a non-empty string
- Validates `customerPhone` is a non-empty string

Each validation throws a descriptive error if the check fails.

## Error Codes Reference

| Code | Status | Description | User Action |
|------|--------|-------------|-------------|
| `INSUFFICIENT_STOCK` | 400 | Product out of stock | Adjust cart quantities |
| `PRODUCT_NOT_FOUND` | 404 | Product doesn't exist | Refresh and try again |
| `DATABASE_CONNECTION_ERROR` | 503 | Can't connect to database | Try again shortly |
| `DATABASE_ERROR` | 500 | Generic database error | Try again or contact support |
| `INVALID_ORDER_STATE` | 500 | Order created but missing required fields | Try creating order again |
| `MINIMUM_AMOUNT_ERROR` | 400 | Order total below ₹1 | Add more items or use COD |
| `MERCHANT_CONFIG_ERROR` | 500 | PhonePe merchant not configured | Contact support |
| `PAYMENT_AUTH_ERROR` | 500 | PhonePe authentication failed | Try Razorpay or COD |
| `PAYMENT_SERVER_ERROR` | 503 | PhonePe temporarily unavailable | Try again shortly |
| `PAYMENT_CREATION_ERROR` | 500 | Generic payment error | Try alternative payment method |

## Testing Instructions

### 1. Deploy to Production
```bash
# Commit changes
git add .
git commit -m "feat: add comprehensive error logging for PhonePe integration"
git push

# Verify deployment on Vercel/Netlify
```

### 2. Monitor Production Logs
Once deployed, when the 500 error occurs, check server logs for detailed information:

**Look for these log entries:**
- `🔵 PhonePe payment creation request received` - Request initiated
- `✅ Order created in database` - Order creation succeeded
- `Creating PhonePe payment order` - About to call PhonePe API
- `✅ PhonePe payment created successfully` - Payment succeeded
- `❌ Database transaction failed` - Database error occurred
- `❌ PhonePe payment creation failed` - PhonePe API error
- `❌ Database connection error detected` - Connection issue

**Error details will include:**
- `message` - Error description
- `errorName` - Error type (e.g., TypeError, DatabaseError)
- `errorCode` - Database error code (e.g., ECONNREFUSED)
- `stack` - Stack trace (first 5 lines)
- `timestamp` - When error occurred

### 3. Test Locally (Optional)
```bash
# Ensure environment variables are set
npm run dev

# Test payment creation
curl -X POST http://localhost:3000/api/payment/phonepe/create \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "test-id", "quantity": 1}],
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "9876543210",
    "addressLine1": "123 Test St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }'
```

## Debugging Checklist

When investigating production errors, check:

1. ✅ **Request received** - Look for `🔵 PhonePe payment creation request received`
2. ✅ **Order creation** - Look for `✅ Order created in database` with orderId
3. ✅ **Order validation** - Check if INVALID_ORDER_STATE error appears
4. ✅ **PhonePe API call** - Look for `Creating PhonePe payment order`
5. ✅ **Token generation** - Check if token request succeeded
6. ✅ **Payment response** - Look for `✅ PhonePe payment created successfully`
7. ✅ **Error details** - If error occurred, check the structured error log

## Next Steps

1. **Deploy** the changes to production
2. **Monitor** server logs when 500 error occurs
3. **Identify** the specific error from detailed logs:
   - Database connection issue?
   - PhonePe authentication failure?
   - Merchant configuration error?
   - Token generation problem?
   - Payment API error?
4. **Fix** the identified root cause
5. **Verify** payment flow works end-to-end

## Expected Outcomes

### If Database Error:
- Will see `❌ Database transaction failed` log
- Error code will indicate specific issue (stock, connection, etc.)
- Status 400/404/500/503 depending on error type

### If PhonePe API Error:
- Will see order created successfully
- Will see `❌ PhonePe payment creation failed` log
- Error details will show PhonePe API response
- Can identify if it's merchant config, auth, or API issue

### If Order Validation Error:
- Will see order created but missing required fields
- Will return INVALID_ORDER_STATE error
- Indicates database schema or query issue

## Environment Variables Check

Ensure these are set in production:
```env
PHONEPE_CLIENT_ID=""
PHONEPE_CLIENT_SECRET=""
PHONEPE_BASE_URL="https://api.phonepe.com/apis/pg"
PHONEPE_AUTH_URL="https://api.phonepe.com/apis/identity-manager"
NEXT_PUBLIC_APP_URL="https://chulbulijewels.in"
```

## Files Modified
1. `src/app/api/payment/phonepe/create/route.ts` - Enhanced error logging and validation
2. `src/lib/phonepe.ts` - Added parameter validation
