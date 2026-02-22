import { pgTable, text, varchar, numeric, integer, boolean, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable(
  'User',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password'), // Nullable for OAuth users (Google Sign-In)
    role: varchar('role', { length: 50 }).notNull().default('customer'), // 'customer' or 'admin'
    
    // OAuth fields
    provider: varchar('provider', { length: 50 }).notNull().default('email'), // 'email' or 'google'
    googleId: text('googleId').unique(), // Google user ID for OAuth
    photoUrl: text('photoUrl'), // Profile picture URL from Google
    
    // Additional profile fields
    mobile: varchar('mobile', { length: 20 }), // Phone number
    dateOfBirth: timestamp('dateOfBirth', { mode: 'date' }), // Date of birth
    
    // Account status
    accountStatus: varchar('accountStatus', { length: 20 }).notNull().default('active'), // active, deactivated, deleted
    deactivatedAt: timestamp('deactivatedAt', { mode: 'date' }), // When account was deactivated
    
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('User_email_idx').on(table.email),
    googleIdIdx: index('User_googleId_idx').on(table.googleId),
    providerIdx: index('User_provider_idx').on(table.provider),
    accountStatusIdx: index('User_accountStatus_idx').on(table.accountStatus),
  })
)

// User Addresses table
export const addresses = pgTable(
  'Address',
  {
    id: text('id').primaryKey(),
    userId: text('userId').notNull(),
    label: varchar('label', { length: 50 }).notNull(), // Home, Work, Other
    fullName: text('fullName').notNull(),
    mobile: varchar('mobile', { length: 20 }).notNull(),
    addressLine1: text('addressLine1').notNull(),
    addressLine2: text('addressLine2'),
    city: text('city').notNull(),
    state: text('state').notNull(),
    pincode: text('pincode').notNull(),
    isDefault: boolean('isDefault').notNull().default(false),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('Address_userId_idx').on(table.userId),
    isDefaultIdx: index('Address_isDefault_idx').on(table.isDefault),
  })
)

// Products table
export const products = pgTable(
  'Product',
  {
    id: text('id').primaryKey(),
    // Basic Information
    name: text('name').notNull(),
    sku: text('sku').unique(), // Auto-generated or manual
    description: text('description').notNull(),
    shortDescription: text('shortDescription'), // Bullet points for quick overview
    category: text('category').notNull(), // earrings, necklaces, rings, bangles, sets
    subCategory: text('subCategory'), // stud, hoop, drop, jhumka
    brand: text('brand'), // Chulbuli Signature, Festive Collection, Bridal Collection
    productStatus: text('productStatus').notNull().default('draft'), // draft, active, out_of_stock
    
    // Pricing & Tax
    basePrice: numeric('basePrice', { precision: 10, scale: 2 }).notNull(), // MRP
    price: numeric('price', { precision: 10, scale: 2 }).notNull(), // Selling price
    discount: numeric('discount', { precision: 5, scale: 2 }).notNull().default('0'),
    discountType: text('discountType').default('percentage'), // percentage or flat
    finalPrice: numeric('finalPrice', { precision: 10, scale: 2 }), // Auto-calculated
    gstPercentage: numeric('gstPercentage', { precision: 5, scale: 2 }).default('3'), // 3% for jewelry in India
    costPrice: numeric('costPrice', { precision: 10, scale: 2 }), // Internal use only
    
    // Inventory & Stock
    stock: integer('stock').notNull(),
    lowStockAlert: integer('lowStockAlert').default(5), // Alert threshold
    stockStatus: text('stockStatus').default('in_stock'), // in_stock, out_of_stock, pre_order
    
    // Product Images & Media
    images: text('images').array(), // Array of image URLs
    thumbnailImage: text('thumbnailImage'), // Main hero image
    videoUrl: text('videoUrl'), // Optional 360° or product video
    
    // Product Attributes (Earring-specific)
    material: text('material'), // Gold Plated, Silver, Brass, Alloy
    stoneType: text('stoneType'), // CZ, Pearl, Kundan, None
    color: text('color'), // Gold, Rose Gold, Silver
    earringType: text('earringType'), // Stud, Hoop, Drop, Jhumka
    closureType: text('closureType'), // Push Back, Screw Back, Hook
    weight: numeric('weight', { precision: 8, scale: 2 }), // In grams
    dimensionLength: numeric('dimensionLength', { precision: 8, scale: 2 }), // In mm
    dimensionWidth: numeric('dimensionWidth', { precision: 8, scale: 2 }), // In mm
    finish: text('finish'), // Matte, Glossy, Antique
    
    // Shipping & Packaging
    productWeight: numeric('productWeight', { precision: 8, scale: 2 }), // For shipping calculations
    shippingClass: text('shippingClass').default('standard'), // standard, fragile
    packageIncludes: text('packageIncludes'), // e.g., "1 Pair of Earrings, Jewelry Box, Care Card"
    codAvailable: boolean('codAvailable').default(true),
    
    // SEO & Visibility
    seoTitle: text('seoTitle'),
    metaDescription: text('metaDescription'),
    urlSlug: text('urlSlug').unique(),
    searchTags: text('searchTags').array(), // For internal search
    featured: boolean('featured').notNull().default(false),
    isNewArrival: boolean('isNewArrival').default(false),
    
    // Compliance & Trust
    careInstructions: text('careInstructions'),
    returnPolicy: text('returnPolicy'),
    warranty: text('warranty'),
    certification: text('certification'),
    
    // Reviews Control
    reviewsEnabled: boolean('reviewsEnabled').default(true),
    
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index('Product_category_idx').on(table.category),
    featuredIdx: index('Product_featured_idx').on(table.featured),
    categoryFeaturedIdx: index('Product_category_featured_idx').on(table.category, table.featured),
    priceIdx: index('Product_price_idx').on(table.price),
    skuIdx: index('Product_sku_idx').on(table.sku),
    statusIdx: index('Product_productStatus_idx').on(table.productStatus),
    statusCreatedAtIdx: index('Product_productStatus_createdAt_idx').on(table.productStatus, table.createdAt),
    stockIdx: index('Product_stock_idx').on(table.stock),
    stockStatusIdx: index('Product_stockStatus_idx').on(table.stockStatus),
    createdAtIdx: index('Product_createdAt_idx').on(table.createdAt),
  })
)

// Orders table
export const orders = pgTable(
  'Order',
  {
    id: text('id').primaryKey(),
    orderNumber: integer('orderNumber').notNull(), // Sequential order number for display
    userId: text('userId'),
    totalPrice: numeric('totalPrice', { precision: 12, scale: 2 }).notNull(),
    status: varchar('status', { length: 50 }).notNull().default('placed'), // placed, packed, shipped, delivered
    customerName: text('customerName').notNull(),
    customerEmail: text('customerEmail').notNull(),
    customerPhone: text('customerPhone').notNull(),
    addressLine1: text('addressLine1').notNull(),
    addressLine2: text('addressLine2'),
    city: text('city').notNull(),
    state: text('state').notNull(),
    pincode: text('pincode').notNull(),
    paymentMethod: varchar('paymentMethod', { length: 50 }).notNull().default('cod'), // cod, online
    
    // Payment tracking fields
    paymentProvider: varchar('paymentProvider', { length: 50 }).notNull().default('cod'), // cod, razorpay, phonepe
    paymentStatus: varchar('paymentStatus', { length: 50 }).notNull().default('pending'), // pending, completed, failed
    merchantOrderId: text('merchantOrderId'), // Unique order ID for payment gateways (PhonePe/Razorpay)
    transactionId: text('transactionId'), // Payment gateway transaction ID
    
    // Razorpay specific fields
    razorpayOrderId: text('razorpayOrderId'), // Razorpay order ID
    razorpayPaymentId: text('razorpayPaymentId'), // Razorpay payment ID
    razorpaySignature: text('razorpaySignature'), // Payment verification signature
    
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('Order_userId_idx').on(table.userId),
    statusIdx: index('Order_status_idx').on(table.status),
    createdAtIdx: index('Order_createdAt_idx').on(table.createdAt),
    statusCreatedAtIdx: index('Order_status_createdAt_idx').on(table.status, table.createdAt),
    paymentStatusIdx: index('Order_paymentStatus_idx').on(table.paymentStatus),
    orderNumberIdx: index('Order_orderNumber_idx').on(table.orderNumber),
    paymentProviderIdx: index('Order_paymentProvider_idx').on(table.paymentProvider),
    merchantOrderIdIdx: index('Order_merchantOrderId_idx').on(table.merchantOrderId),
    transactionIdIdx: index('Order_transactionId_idx').on(table.transactionId),
  })
)

// Order items table
export const orderItems = pgTable(
  'OrderItem',
  {
    id: text('id').primaryKey(),
    orderId: text('orderId').notNull(),
    productId: text('productId').notNull(),
    quantity: integer('quantity').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  },
  (table) => ({
    orderIdIdx: index('OrderItem_orderId_idx').on(table.orderId),
    productIdIdx: index('OrderItem_productId_idx').on(table.productId),
  })
)

// Reviews table
export const reviews = pgTable(
  'Review',
  {
    id: text('id').primaryKey(),
    productId: text('productId').notNull(),
    userId: text('userId').notNull(),
    rating: integer('rating').notNull(), // 1-5
    comment: text('comment').notNull(),
    approved: boolean('approved').notNull().default(false),
    verifiedPurchase: boolean('verifiedPurchase').default(false),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    productIdIdx: index('Review_productId_idx').on(table.productId),
    userIdIdx: index('Review_userId_idx').on(table.userId),
    approvedIdx: index('Review_approved_idx').on(table.approved),
    approvedCreatedAtIdx: index('Review_approved_createdAt_idx').on(table.approved, table.createdAt),
    createdAtIdx: index('Review_createdAt_idx').on(table.createdAt),
    productUserUnique: uniqueIndex('Review_productId_userId_unique').on(table.productId, table.userId),
  })
)

// Product Variants table (for products with multiple options)
export const productVariants = pgTable(
  'ProductVariant',
  {
    id: text('id').primaryKey(),
    productId: text('productId').notNull(),
    variantName: text('variantName').notNull(), // e.g., "Gold - Medium"
    sku: text('sku').unique(),
    color: text('color'), // Gold, Silver
    size: text('size'), // Small, Medium, Large
    price: numeric('price', { precision: 10, scale: 2 }),
    stock: integer('stock').notNull().default(0),
    images: text('images').array(),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    productIdIdx: index('ProductVariant_productId_idx').on(table.productId),
    skuIdx: index('ProductVariant_sku_idx').on(table.sku),
  })
)

// Product Images table (for better image management)
export const productImages = pgTable(
  'ProductImage',
  {
    id: text('id').primaryKey(),
    productId: text('productId').notNull(),
    url: text('url').notNull(),
    altText: text('altText'),
    imageType: text('imageType').default('gallery'), // thumbnail, side_view, model, zoom, back_view, gallery
    sortOrder: integer('sortOrder').default(0),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    productIdIdx: index('ProductImage_productId_idx').on(table.productId),
    imageTypeIdx: index('ProductImage_imageType_idx').on(table.imageType),
  })
)

// Webhook Log table for payment webhook retry mechanism
export const webhookLogs = pgTable(
  'WebhookLog',
  {
    id: text('id').primaryKey(),
    event: text('event').notNull(), // checkout.order.completed, checkout.order.failed, etc.
    payload: text('payload').notNull(), // JSON stringified webhook payload
    merchantOrderId: text('merchantOrderId'), // For quick lookup
    status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processed, failed
    attempts: integer('attempts').notNull().default(0),
    lastError: text('lastError'), // Error message from last failed attempt
    processedAt: timestamp('processedAt', { mode: 'date' }), // When successfully processed
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    merchantOrderIdIdx: index('WebhookLog_merchantOrderId_idx').on(table.merchantOrderId),
    statusIdx: index('WebhookLog_status_idx').on(table.status),
    eventIdx: index('WebhookLog_event_idx').on(table.event),
    createdAtIdx: index('WebhookLog_createdAt_idx').on(table.createdAt),
  })
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
  addresses: many(addresses),
}))

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}))

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(reviews),
  variants: many(productVariants),
  productImages: many(productImages),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}))

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))
