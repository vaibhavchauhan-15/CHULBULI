import { pgTable, text, varchar, numeric, integer, boolean, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable(
  'User',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    role: varchar('role', { length: 50 }).notNull().default('customer'), // 'customer' or 'admin'
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index('User_email_idx').on(table.email),
  })
)

// Products table
export const products = pgTable(
  'Product',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    discount: numeric('discount', { precision: 5, scale: 2 }).notNull().default('0'),
    category: text('category').notNull(), // earrings, necklaces, rings, bangles, sets
    stock: integer('stock').notNull(),
    images: text('images').array(), // Array of image URLs
    material: text('material'),
    featured: boolean('featured').notNull().default(false),
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index('Product_category_idx').on(table.category),
    featuredIdx: index('Product_featured_idx').on(table.featured),
    priceIdx: index('Product_price_idx').on(table.price),
  })
)

// Orders table
export const orders = pgTable(
  'Order',
  {
    id: text('id').primaryKey(),
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
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('Order_userId_idx').on(table.userId),
    statusIdx: index('Order_status_idx').on(table.status),
    createdAtIdx: index('Order_createdAt_idx').on(table.createdAt),
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
    createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
  },
  (table) => ({
    productIdIdx: index('Review_productId_idx').on(table.productId),
    userIdIdx: index('Review_userId_idx').on(table.userId),
    approvedIdx: index('Review_approved_idx').on(table.approved),
    productUserUnique: uniqueIndex('Review_productId_userId_unique').on(table.productId, table.userId),
  })
)

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
}))

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(reviews),
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
