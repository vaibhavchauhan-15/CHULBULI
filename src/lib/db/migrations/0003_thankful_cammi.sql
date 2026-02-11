ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProvider" varchar(50) DEFAULT 'cod' NOT NULL;--> statement-breakpoint
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "merchantOrderId" text;--> statement-breakpoint
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "transactionId" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Order_status_createdAt_idx" ON "Order" USING btree ("status","createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Order_paymentProvider_idx" ON "Order" USING btree ("paymentProvider");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Order_merchantOrderId_idx" ON "Order" USING btree ("merchantOrderId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Order_transactionId_idx" ON "Order" USING btree ("transactionId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Product_category_featured_idx" ON "Product" USING btree ("category","featured");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Product_stock_idx" ON "Product" USING btree ("stock");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Review_createdAt_idx" ON "Review" USING btree ("createdAt");
