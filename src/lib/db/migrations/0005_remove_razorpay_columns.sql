-- Migration: Remove Razorpay payment gateway columns
-- Date: 2026-02-22
-- Description: Removes Razorpay-specific columns from Order table as Razorpay payment gateway has been removed

ALTER TABLE "Order" DROP COLUMN IF EXISTS "razorpayOrderId";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "razorpayPaymentId";
ALTER TABLE "Order" DROP COLUMN IF EXISTS "razorpaySignature";
