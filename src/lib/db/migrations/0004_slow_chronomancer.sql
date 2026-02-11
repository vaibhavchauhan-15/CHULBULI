CREATE INDEX IF NOT EXISTS "Product_productStatus_createdAt_idx" ON "Product" USING btree ("productStatus","createdAt");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Review_approved_createdAt_idx" ON "Review" USING btree ("approved","createdAt");
