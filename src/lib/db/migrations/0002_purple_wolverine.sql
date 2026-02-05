CREATE TABLE "Address" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"label" varchar(50) NOT NULL,
	"fullName" text NOT NULL,
	"mobile" varchar(20) NOT NULL,
	"addressLine1" text NOT NULL,
	"addressLine2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" text NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Order" ADD COLUMN "orderNumber" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "Order" ADD COLUMN "paymentStatus" varchar(50) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "Order" ADD COLUMN "razorpayOrderId" text;--> statement-breakpoint
ALTER TABLE "Order" ADD COLUMN "razorpayPaymentId" text;--> statement-breakpoint
ALTER TABLE "Order" ADD COLUMN "razorpaySignature" text;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "mobile" varchar(20);--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "dateOfBirth" timestamp;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "accountStatus" varchar(20) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "deactivatedAt" timestamp;--> statement-breakpoint
CREATE INDEX "Address_userId_idx" ON "Address" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Address_isDefault_idx" ON "Address" USING btree ("isDefault");--> statement-breakpoint
CREATE INDEX "Order_paymentStatus_idx" ON "Order" USING btree ("paymentStatus");--> statement-breakpoint
CREATE INDEX "Order_orderNumber_idx" ON "Order" USING btree ("orderNumber");--> statement-breakpoint
CREATE INDEX "User_accountStatus_idx" ON "User" USING btree ("accountStatus");