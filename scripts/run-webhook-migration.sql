-- Run this migration to add the WebhookLog table to your production database
-- This enables webhook retry mechanism for PhonePe payments

\c postgres;

-- Apply the migration
\i scripts/create-webhook-log-table.sql

-- Verify the table was created
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'WebhookLog'
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'WebhookLog';

-- Success message
SELECT 'WebhookLog table created successfully!' as status;
