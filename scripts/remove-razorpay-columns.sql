-- Migration: Remove Razorpay columns from Order table
-- Created: 2026-02-18
-- Description: Removes all Razorpay-specific columns as part of complete Razorpay removal

-- Remove Razorpay-specific columns from Order table
ALTER TABLE "Order" DROP COLUMN IF EXISTS "razorpayOrderId";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "razorpayPaymentId";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "razorpaySignature";

-- Update comment for paymentProvider column
COMMENT ON COLUMN "Order"."paymentProvider" IS 'Payment provider: cod or phonepe';
COMMENT ON COLUMN "Order"."merchantOrderId" IS 'Unique order ID for PhonePe payment gateway';
