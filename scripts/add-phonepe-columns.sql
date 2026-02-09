-- Add PhonePe payment gateway support columns to Order table
-- Run this migration to add new columns to existing database

-- Add paymentProvider column (cod, razorpay, phonepe)
ALTER TABLE "Order" 
ADD COLUMN IF NOT EXISTS "paymentProvider" VARCHAR(50) NOT NULL DEFAULT 'cod';

-- Add merchantOrderId for payment gateways
ALTER TABLE "Order" 
ADD COLUMN IF NOT EXISTS "merchantOrderId" TEXT;

-- Add transactionId for payment gateway transaction tracking
ALTER TABLE "Order" 
ADD COLUMN IF NOT EXISTS "transactionId" TEXT;

-- Update existing orders to set correct paymentProvider
UPDATE "Order" 
SET "paymentProvider" = 
  CASE 
    WHEN "razorpayOrderId" IS NOT NULL THEN 'razorpay'
    WHEN "paymentMethod" = 'online' THEN 'razorpay'
    ELSE 'cod'
  END
WHERE "paymentProvider" = 'cod';

-- Add index on paymentProvider for performance
CREATE INDEX IF NOT EXISTS "Order_paymentProvider_idx" ON "Order"("paymentProvider");

-- Add index on merchantOrderId for webhook lookups
CREATE INDEX IF NOT EXISTS "Order_merchantOrderId_idx" ON "Order"("merchantOrderId");

-- Add index on transactionId for transaction tracking
CREATE INDEX IF NOT EXISTS "Order_transactionId_idx" ON "Order"("transactionId");
