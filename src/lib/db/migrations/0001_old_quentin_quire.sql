ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "provider" varchar(50) DEFAULT 'email' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "googleId" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "photoUrl" text;--> statement-breakpoint
CREATE INDEX "User_googleId_idx" ON "User" USING btree ("googleId");--> statement-breakpoint
CREATE INDEX "User_provider_idx" ON "User" USING btree ("provider");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_googleId_unique" UNIQUE("googleId");