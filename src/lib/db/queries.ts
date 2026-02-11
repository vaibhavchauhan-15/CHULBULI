/**
 * Database Query Helpers for Drizzle ORM
 * Common patterns for API routes with automatic error handling
 */

import { db, withDatabase } from './client'
import { users, products, orders, orderItems, reviews } from './schema'
import { eq, and, desc } from 'drizzle-orm'

// User Queries
export const userQueries = {
  findByEmail: async (email: string) => {
    return await withDatabase(
      () => db.query.users.findFirst({
        where: eq(users.email, email),
      }),
      'userQueries.findByEmail'
    )
  },

  findById: async (id: string) => {
    return await withDatabase(
      () => db.query.users.findFirst({
        where: eq(users.id, id),
      }),
      'userQueries.findById'
    )
  },

  create: async (userData: {
    id: string
    name: string
    email: string
    password: string
    role?: string
  }) => {
    return await withDatabase(
      async () => {
        const [user] = await db
          .insert(users)
          .values(userData)
          .returning()
        return user
      },
      'userQueries.create'
    )
  },
}

// Product Queries
export const productQueries = {
  findById: async (id: string) => {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        reviews: {
          where: eq(reviews.approved, true),
          columns: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
          with: {
            user: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: desc(reviews.createdAt),
        },
      },
    })
  },

  findAll: async () => {
    return await db.query.products.findMany({
      orderBy: desc(products.createdAt),
    })
  },

  create: async (productData: any) => {
    const [product] = await db
      .insert(products)
      .values(productData)
      .returning()
    return product
  },

  update: async (id: string, productData: any) => {
    const [updated] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning()

    if (!updated) {
      throw new Error(`Product with id ${id} not found`)
    }

    return updated
  },

  delete: async (id: string) => {
    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id })

    if (!deleted) {
      throw new Error(`Product with id ${id} not found`)
    }
  },
}

// Order Queries
export const orderQueries = {
  findById: async (id: string) => {
    return await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
        user: true,
      },
    })
  },

  findByUserId: async (userId: string) => {
    return await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
      },
      orderBy: desc(orders.createdAt),
    })
  },

  findAll: async () => {
    return await db.query.orders.findMany({
      with: {
        orderItems: {
          with: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: desc(orders.createdAt),
    })
  },

  create: async (orderData: any, items: any[]) => {
    // Use transaction for atomicity
    return await db.transaction(async (tx) => {
      // Create order
      const [order] = await tx
        .insert(orders)
        .values(orderData)
        .returning()

      // Create order items
      const createdItems = await tx
        .insert(orderItems)
        .values(items)
        .returning()

      return { order, orderItems: createdItems }
    })
  },

  updateStatus: async (id: string, status: string) => {
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning()

    if (!updated) {
      throw new Error(`Order with id ${id} not found`)
    }

    return updated
  },
}

// Review Queries
export const reviewQueries = {
  findByProductId: async (productId: string, approvedOnly: boolean = true) => {
    const conditions = approvedOnly
      ? and(eq(reviews.productId, productId), eq(reviews.approved, true))
      : eq(reviews.productId, productId)

    return await db.query.reviews.findMany({
      where: conditions,
      with: {
        user: true,
        product: true,
      },
      orderBy: desc(reviews.createdAt),
    })
  },

  findByUserId: async (userId: string) => {
    return await db.query.reviews.findMany({
      where: eq(reviews.userId, userId),
      with: {
        product: true,
      },
      orderBy: desc(reviews.createdAt),
    })
  },

  findAll: async (approvedOnly: boolean = false) => {
    const where = approvedOnly ? eq(reviews.approved, true) : undefined

    return await db.query.reviews.findMany({
      where,
      with: {
        user: true,
        product: true,
      },
      orderBy: desc(reviews.createdAt),
    })
  },

  create: async (reviewData: {
    id: string
    productId: string
    userId: string
    rating: number
    comment: string
    approved?: boolean
  }) => {
    const [review] = await db
      .insert(reviews)
      .values(reviewData)
      .returning()
    return review
  },

  approve: async (id: string) => {
    const [updated] = await db
      .update(reviews)
      .set({ approved: true, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning()

    if (!updated) {
      throw new Error(`Review with id ${id} not found`)
    }

    return updated
  },

  delete: async (id: string) => {
    const [deleted] = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .returning({ id: reviews.id })

    if (!deleted) {
      throw new Error(`Review with id ${id} not found`)
    }
  },
}

// Helper to generate unique IDs using nanoid
import { nanoid } from 'nanoid'

export const generateId = (prefix: string) => {
  return `${prefix}_${nanoid(12)}`
}
