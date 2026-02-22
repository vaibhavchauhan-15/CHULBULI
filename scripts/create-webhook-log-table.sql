-- Migration: Add WebhookLog table for payment webhook retry mechanism
-- This table logs all incoming webhooks from PhonePe for audit and retry purposes

-- Create WebhookLog table
CREATE TABLE IF NOT EXISTS "WebhookLog" (
  "id" TEXT PRIMARY KEY,
  "event" TEXT NOT NULL,
  "payload" TEXT NOT NULL,
  "merchantOrderId" TEXT,
  "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "processedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "WebhookLog_merchantOrderId_idx" ON "WebhookLog"("merchantOrderId");
CREATE INDEX IF NOT EXISTS "WebhookLog_status_idx" ON "WebhookLog"("status");
CREATE INDEX IF NOT EXISTS "WebhookLog_event_idx" ON "WebhookLog"("event");
CREATE INDEX IF NOT EXISTS "WebhookLog_createdAt_idx" ON "WebhookLog"("createdAt");

-- Add comment for documentation
COMMENT ON TABLE "WebhookLog" IS 'Logs all payment webhooks from PhonePe for audit trail and retry mechanism';
COMMENT ON COLUMN "WebhookLog"."status" IS 'pending: Not yet processed, processed: Successfully handled, failed: Processing failed';
COMMENT ON COLUMN "WebhookLog"."attempts" IS 'Number of times webhook processing was attempted';
COMMENT ON COLUMN "WebhookLog"."lastError" IS 'Error message from last failed attempt';
COMMENT ON COLUMN "WebhookLog"."processedAt" IS 'Timestamp when webhook was successfully processed';
