import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  sql,
} from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { orderItems, orders, products, reviews } from '@/lib/db/schema'
import {
  toAdminOrderListDto,
  toAdminProductListDto,
  toAdminReviewDto,
  toPaginationDto,
} from '@/lib/services/admin/dto'

export interface AdminListParams {
  page?: number
  limit?: number
  search?: string
}

export interface AdminProductListParams extends AdminListParams {
  category?: string
  status?: string
}

export interface AdminOrderListParams extends AdminListParams {
  status?: string
}

export interface AdminReviewListParams extends AdminListParams {
  approved?: 'all' | 'true' | 'false'
}

const clampNumber = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  return 0
}

function buildPagination(page = 1, limit = 10) {
  const safePage = clampNumber(Number.isFinite(page) ? page : 1, 1, 10_000)
  const safeLimit = clampNumber(Number.isFinite(limit) ? limit : 10, 1, 100)
  const offset = (safePage - 1) * safeLimit
  return { page: safePage, limit: safeLimit, offset }
}

function getPaginationMeta(page: number, limit: number, totalCount: number) {
  return toPaginationDto({
    page,
    limit,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
  })
}

export async function getAdminProductsQuery(params: AdminProductListParams = {}) {
  const { page, limit, offset } = buildPagination(params.page ?? 1, params.limit ?? 12)
  const search = (params.search || '').trim()
  const category = params.category || 'all'
  const status = params.status || 'all'

  const conditions = []

  if (search) {
    conditions.push(
      or(
        ilike(products.name, `%${search}%`),
        ilike(products.sku, `%${search}%`),
        ilike(products.description, `%${search}%`)
      )
    )
  }

  if (category !== 'all') {
    conditions.push(eq(products.category, category))
  }

  if (status !== 'all') {
    conditions.push(eq(products.productStatus, status))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(where)

  const items = await db.query.products.findMany({
    where,
    orderBy: desc(products.createdAt),
    limit,
    offset,
    columns: {
      id: true,
      name: true,
      description: true,
      category: true,
      productStatus: true,
      price: true,
      discount: true,
      stock: true,
      featured: true,
      images: true,
      thumbnailImage: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const productIds = items.map((item) => item.id)
  const reviewCounts = productIds.length > 0
    ? await db
        .select({
          productId: reviews.productId,
          count: sql<number>`count(*)`,
        })
        .from(reviews)
        .where(inArray(reviews.productId, productIds))
        .groupBy(reviews.productId)
    : []

  const reviewCountMap = new Map(reviewCounts.map((row) => [row.productId, toNumber(row.count)]))

  const productsWithCount = items.map((item) =>
    toAdminProductListDto({
      ...item,
      _count: {
        reviews: reviewCountMap.get(item.id) || 0,
      },
    })
  )

  const totalCount = toNumber(countResult?.count)
  return {
    items: productsWithCount,
    pagination: getPaginationMeta(page, limit, totalCount),
  }
}

export async function getAdminOrdersQuery(params: AdminOrderListParams = {}) {
  const { page, limit, offset } = buildPagination(params.page ?? 1, params.limit ?? 10)
  const search = (params.search || '').trim()
  const status = params.status || 'all'

  const conditions = []

  if (search) {
    conditions.push(
      or(
        ilike(orders.customerName, `%${search}%`),
        ilike(orders.customerEmail, `%${search}%`),
        ilike(orders.customerPhone, `%${search}%`),
        sql`CAST(${orders.orderNumber} AS TEXT) ILIKE ${`%${search}%`}`
      )
    )
  }

  if (status !== 'all') {
    if (status === 'cancelled') {
      conditions.push(
        or(
          eq(orders.status, 'cancelled'),
          eq(orders.paymentStatus, 'failed')
        )
      )
    } else {
      conditions.push(
        and(
          eq(orders.status, status),
          ne(orders.paymentStatus, 'failed')
        )
      )
    }
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(where)

  const orderRows = await db.query.orders.findMany({
    where,
    limit,
    offset,
    columns: {
      id: true,
      orderNumber: true,
      totalPrice: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      state: true,
      pincode: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: desc(orders.createdAt),
  })

  const orderIds = orderRows.map((order) => order.id)

  const itemRows = orderIds.length > 0
    ? await db.query.orderItems.findMany({
        where: inArray(orderItems.orderId, orderIds),
        columns: {
          id: true,
          orderId: true,
          quantity: true,
          price: true,
        },
        with: {
          product: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      })
    : []

  const itemsByOrderId = new Map<string, typeof itemRows>()
  for (const item of itemRows) {
    const bucket = itemsByOrderId.get(item.orderId)
    if (bucket) {
      bucket.push(item)
    } else {
      itemsByOrderId.set(item.orderId, [item])
    }
  }

  const items = orderRows.map((order) =>
    toAdminOrderListDto({
      ...order,
      status: order.paymentStatus === 'failed' ? 'cancelled' : order.status,
      orderItems: itemsByOrderId.get(order.id) || [],
    })
  )

  const totalCount = toNumber(countResult?.count)
  return {
    items,
    pagination: getPaginationMeta(page, limit, totalCount),
  }
}

export async function getAdminReviewsQuery(params: AdminReviewListParams = {}) {
  const { page, limit, offset } = buildPagination(params.page ?? 1, params.limit ?? 10)
  const search = (params.search || '').trim()
  const approved = params.approved || 'all'

  const conditions = []

  if (search) {
    conditions.push(
      or(
        ilike(reviews.comment, `%${search}%`),
        sql`CAST(${reviews.rating} AS TEXT) ILIKE ${`%${search}%`}`
      )
    )
  }

  if (approved === 'true') {
    conditions.push(eq(reviews.approved, true))
  } else if (approved === 'false') {
    conditions.push(eq(reviews.approved, false))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reviews)
    .where(where)

  const items = await db.query.reviews.findMany({
    where,
    columns: {
      id: true,
      rating: true,
      comment: true,
      approved: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      product: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: desc(reviews.createdAt),
    limit,
    offset,
  })

  const totalCount = toNumber(countResult?.count)
  return {
    items: items.map(toAdminReviewDto),
    pagination: getPaginationMeta(page, limit, totalCount),
  }
}
