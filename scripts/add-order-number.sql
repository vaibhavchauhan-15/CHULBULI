-- Add orderNumber column (allowing NULL initially for existing rows)
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "orderNumber" integer;

-- Backfill existing orders with sequential numbers based on creation date
WITH numbered_orders AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) as row_num
  FROM "Order"
  WHERE "orderNumber" IS NULL
)
UPDATE "Order"
SET "orderNumber" = numbered_orders.row_num
FROM numbered_orders
WHERE "Order".id = numbered_orders.id;

-- Now make the column NOT NULL
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;

-- Create index if not exists
CREATE INDEX IF NOT EXISTS "Order_orderNumber_idx" ON "Order" USING btree ("orderNumber");

-- Verify the update
SELECT id, "orderNumber", "customerName", "createdAt" 
FROM "Order" 
ORDER BY "orderNumber" ASC 
LIMIT 10;
