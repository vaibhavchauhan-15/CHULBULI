CREATE TABLE "OrderItem" (
	"id" text PRIMARY KEY NOT NULL,
	"orderId" text NOT NULL,
	"productId" text NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text,
	"totalPrice" numeric(12, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'placed' NOT NULL,
	"customerName" text NOT NULL,
	"customerEmail" text NOT NULL,
	"customerPhone" text NOT NULL,
	"addressLine1" text NOT NULL,
	"addressLine2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" text NOT NULL,
	"paymentMethod" varchar(50) DEFAULT 'cod' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ProductImage" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"url" text NOT NULL,
	"altText" text,
	"imageType" text DEFAULT 'gallery',
	"sortOrder" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ProductVariant" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"variantName" text NOT NULL,
	"sku" text,
	"color" text,
	"size" text,
	"price" numeric(10, 2),
	"stock" integer DEFAULT 0 NOT NULL,
	"images" text[],
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ProductVariant_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sku" text,
	"description" text NOT NULL,
	"shortDescription" text,
	"category" text NOT NULL,
	"subCategory" text,
	"brand" text,
	"productStatus" text DEFAULT 'draft' NOT NULL,
	"basePrice" numeric(10, 2) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"discount" numeric(5, 2) DEFAULT '0' NOT NULL,
	"discountType" text DEFAULT 'percentage',
	"finalPrice" numeric(10, 2),
	"gstPercentage" numeric(5, 2) DEFAULT '3',
	"costPrice" numeric(10, 2),
	"stock" integer NOT NULL,
	"lowStockAlert" integer DEFAULT 5,
	"stockStatus" text DEFAULT 'in_stock',
	"images" text[],
	"thumbnailImage" text,
	"videoUrl" text,
	"material" text,
	"stoneType" text,
	"color" text,
	"earringType" text,
	"closureType" text,
	"weight" numeric(8, 2),
	"dimensionLength" numeric(8, 2),
	"dimensionWidth" numeric(8, 2),
	"finish" text,
	"productWeight" numeric(8, 2),
	"shippingClass" text DEFAULT 'standard',
	"packageIncludes" text,
	"codAvailable" boolean DEFAULT true,
	"seoTitle" text,
	"metaDescription" text,
	"urlSlug" text,
	"searchTags" text[],
	"featured" boolean DEFAULT false NOT NULL,
	"isNewArrival" boolean DEFAULT false,
	"careInstructions" text,
	"returnPolicy" text,
	"warranty" text,
	"certification" text,
	"reviewsEnabled" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Product_sku_unique" UNIQUE("sku"),
	CONSTRAINT "Product_urlSlug_unique" UNIQUE("urlSlug")
);
--> statement-breakpoint
CREATE TABLE "Review" (
	"id" text PRIMARY KEY NOT NULL,
	"productId" text NOT NULL,
	"userId" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"verifiedPurchase" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" varchar(50) DEFAULT 'customer' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "Order_userId_idx" ON "Order" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Order_status_idx" ON "Order" USING btree ("status");--> statement-breakpoint
CREATE INDEX "Order_createdAt_idx" ON "Order" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "ProductImage_productId_idx" ON "ProductImage" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "ProductImage_imageType_idx" ON "ProductImage" USING btree ("imageType");--> statement-breakpoint
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "Product_category_idx" ON "Product" USING btree ("category");--> statement-breakpoint
CREATE INDEX "Product_featured_idx" ON "Product" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "Product_price_idx" ON "Product" USING btree ("price");--> statement-breakpoint
CREATE INDEX "Product_sku_idx" ON "Product" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "Product_productStatus_idx" ON "Product" USING btree ("productStatus");--> statement-breakpoint
CREATE INDEX "Product_stockStatus_idx" ON "Product" USING btree ("stockStatus");--> statement-breakpoint
CREATE INDEX "Review_productId_idx" ON "Review" USING btree ("productId");--> statement-breakpoint
CREATE INDEX "Review_userId_idx" ON "Review" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "Review_approved_idx" ON "Review" USING btree ("approved");--> statement-breakpoint
CREATE UNIQUE INDEX "Review_productId_userId_unique" ON "Review" USING btree ("productId","userId");--> statement-breakpoint
CREATE INDEX "User_email_idx" ON "User" USING btree ("email");