import { unstable_cache } from 'next/cache'
import { and, asc, desc, eq, gte, lt, lte, sql } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { orderItems, orders, products, users } from '@/lib/db/schema'

export type DashboardPeriod = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL'

interface PeriodRange {
  startDate: Date
  previousStartDate: Date
  previousEndDate: Date
}

interface DashboardCacheEntry {
  expiresAt: number
  data: Awaited<ReturnType<typeof getDashboardStatsUncached>>
}

const DASHBOARD_MEMORY_TTL_MS = 3 * 60 * 1000
const dashboardMemoryCache = new Map<DashboardPeriod, DashboardCacheEntry>()

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  return 0
}

const calculateGrowth = (current: number, previous: number): number => {
  if (previous <= 0) return current > 0 ? 100 : 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function getPeriodRange(period: DashboardPeriod): PeriodRange {
  const now = new Date()
  const startDate = new Date(now)
  const previousStartDate = new Date(now)
  const previousEndDate = new Date(now)

  switch (period) {
    case '1D':
      startDate.setDate(now.getDate() - 1)
      previousStartDate.setDate(now.getDate() - 2)
      previousEndDate.setDate(now.getDate() - 1)
      break
    case '7D':
      startDate.setDate(now.getDate() - 7)
      previousStartDate.setDate(now.getDate() - 14)
      previousEndDate.setDate(now.getDate() - 7)
      break
    case '1M':
      startDate.setMonth(now.getMonth() - 1)
      previousStartDate.setMonth(now.getMonth() - 2)
      previousEndDate.setMonth(now.getMonth() - 1)
      break
    case '3M':
      startDate.setMonth(now.getMonth() - 3)
      previousStartDate.setMonth(now.getMonth() - 6)
      previousEndDate.setMonth(now.getMonth() - 3)
      break
    case '1Y':
      startDate.setFullYear(now.getFullYear() - 1)
      previousStartDate.setFullYear(now.getFullYear() - 2)
      previousEndDate.setFullYear(now.getFullYear() - 1)
      break
    case 'ALL':
      startDate.setTime(0)
      previousStartDate.setTime(0)
      previousEndDate.setTime(0)
      break
  }

  return { startDate, previousStartDate, previousEndDate }
}

async function getDashboardStatsUncached(period: DashboardPeriod) {
  const { startDate, previousStartDate, previousEndDate } = getPeriodRange(period)
  const currentOrdersWhere = gte(orders.createdAt, startDate)

  // Single aggregated query for current + previous period order KPIs.
  const [orderSummary] = await db
    .select({
      totalSales: sql<string>`COALESCE(SUM(CAST(${orders.totalPrice} AS NUMERIC)) FILTER (WHERE ${orders.createdAt} >= ${startDate}), 0)`,
      totalOrders: sql<number>`COUNT(*) FILTER (WHERE ${orders.createdAt} >= ${startDate})`,
      previousSales: sql<string>`COALESCE(SUM(CAST(${orders.totalPrice} AS NUMERIC)) FILTER (WHERE ${orders.createdAt} >= ${previousStartDate} AND ${orders.createdAt} < ${previousEndDate}), 0)`,
      previousOrders: sql<number>`COUNT(*) FILTER (WHERE ${orders.createdAt} >= ${previousStartDate} AND ${orders.createdAt} < ${previousEndDate})`,
      currentMonthSales: sql<string>`COALESCE(SUM(CAST(${orders.totalPrice} AS NUMERIC)) FILTER (WHERE DATE_TRUNC('month', ${orders.createdAt}) = DATE_TRUNC('month', NOW())), 0)`,
    })
    .from(orders)

  const totalSales = toNumber(orderSummary?.totalSales)
  const totalOrders = toNumber(orderSummary?.totalOrders)
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  const previousSales = period === 'ALL' ? 0 : toNumber(orderSummary?.previousSales)
  const previousOrders = period === 'ALL' ? 0 : toNumber(orderSummary?.previousOrders)
  const previousAvgOrderValue = previousOrders > 0 ? previousSales / previousOrders : 0

  const [productSummary] = await db
    .select({
      totalProducts: sql<number>`COUNT(*)`,
      activeProducts: sql<number>`COUNT(*) FILTER (WHERE ${products.productStatus} = 'active')`,
      inStock: sql<number>`COUNT(*) FILTER (WHERE ${products.stock} > COALESCE(${products.lowStockAlert}, 5))`,
      lowStock: sql<number>`COUNT(*) FILTER (WHERE ${products.stock} > 0 AND ${products.stock} <= COALESCE(${products.lowStockAlert}, 5))`,
      outOfStock: sql<number>`COUNT(*) FILTER (WHERE ${products.stock} = 0)`,
      inventoryTotal: sql<string>`COALESCE(SUM(CAST(${products.price} AS NUMERIC) * ${products.stock}), 0)`,
      inventoryActive: sql<string>`COALESCE(SUM(CASE WHEN ${products.productStatus} = 'active' THEN CAST(${products.price} AS NUMERIC) * ${products.stock} ELSE 0 END), 0)`,
      inventoryLowStock: sql<string>`COALESCE(SUM(CASE WHEN ${products.stock} > 0 AND ${products.stock} <= COALESCE(${products.lowStockAlert}, 5) THEN CAST(${products.price} AS NUMERIC) * ${products.stock} ELSE 0 END), 0)`,
    })
    .from(products)

  const salesByProductRows = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      category: products.category,
      totalSold: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)`,
      revenue: sql<string>`COALESCE(SUM(CAST(${orderItems.price} AS NUMERIC) * ${orderItems.quantity}), 0)`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(currentOrdersWhere)
    .groupBy(products.id, products.name, products.price, products.category)

  const salesByProduct = salesByProductRows.map((row) => ({
    ...row,
    totalSold: toNumber(row.totalSold),
    revenue: toNumber(row.revenue),
  }))

  const bestSellingProducts = [...salesByProduct]
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 10)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      totalSold: item.totalSold,
    }))

  const topRevenueProducts = [...salesByProduct]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      name: item.name,
      revenue: item.revenue,
      soldCount: item.totalSold,
    }))

  const categoryPerformanceMap = new Map<string, { category: string; count: number; revenue: number }>()
  for (const row of salesByProduct) {
    const key = row.category || 'uncategorized'
    const prev = categoryPerformanceMap.get(key) || { category: key, count: 0, revenue: 0 }
    categoryPerformanceMap.set(key, {
      category: key,
      count: prev.count + row.totalSold,
      revenue: prev.revenue + row.revenue,
    })
  }
  const categoryPerformance = Array.from(categoryPerformanceMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  const lowStockProducts = await db.query.products.findMany({
    where: and(
      gte(products.stock, 1),
      lte(products.stock, 10)
    ),
    columns: {
      id: true,
      name: true,
      stock: true,
      category: true,
    },
    orderBy: asc(products.stock),
    limit: 5,
  })

  const recentOrders = await db.query.orders.findMany({
    where: currentOrdersWhere,
    columns: {
      id: true,
      totalPrice: true,
      status: true,
      createdAt: true,
    },
    orderBy: desc(orders.createdAt),
    limit: 10,
  })

  const [usersSummary] = await db
    .select({
      totalUsers: sql<number>`COUNT(*)`,
      admin: sql<number>`COUNT(*) FILTER (WHERE ${users.role} = 'admin')`,
      customer: sql<number>`COUNT(*) FILTER (WHERE ${users.role} = 'customer')`,
      email: sql<number>`COUNT(*) FILTER (WHERE ${users.provider} = 'email')`,
      google: sql<number>`COUNT(*) FILTER (WHERE ${users.provider} = 'google')`,
    })
    .from(users)

  const [currentUsersSummary] = await db
    .select({
      count: sql<number>`COUNT(*)`,
    })
    .from(users)
    .where(gte(users.createdAt, startDate))

  const [previousUsersSummary] = period === 'ALL'
    ? [{ count: 0 }]
    : await db
        .select({
          count: sql<number>`COUNT(*)`,
        })
        .from(users)
        .where(
          and(
            gte(users.createdAt, previousStartDate),
            lt(users.createdAt, previousEndDate)
          )
        )

  const mostViewedProduct = topRevenueProducts[0] || null
  const bestRatedProduct = topRevenueProducts[0] || null
  const trendingProduct = topRevenueProducts[0] || null

  return {
    totalSales,
    currentMonthSales: toNumber(orderSummary?.currentMonthSales),
    totalOrders,
    avgOrderValue,
    totalProducts: toNumber(productSummary?.totalProducts),
    activeProducts: toNumber(productSummary?.activeProducts),
    salesGrowth: calculateGrowth(totalSales, previousSales),
    ordersGrowth: calculateGrowth(totalOrders, previousOrders),
    aovGrowth: calculateGrowth(avgOrderValue, previousAvgOrderValue),
    bestSellingProducts,
    topRevenueProducts,
    categoryPerformance,
    stockStatus: {
      inStock: toNumber(productSummary?.inStock),
      lowStock: toNumber(productSummary?.lowStock),
      outOfStock: toNumber(productSummary?.outOfStock),
    },
    lowStockProducts,
    inventoryValue: {
      total: toNumber(productSummary?.inventoryTotal),
      active: toNumber(productSummary?.inventoryActive),
      lowStock: toNumber(productSummary?.inventoryLowStock),
    },
    recentOrders,
    mostViewedProduct,
    bestRatedProduct,
    trendingProduct,
    totalUsers: toNumber(usersSummary?.totalUsers),
    newUsers: toNumber(currentUsersSummary?.count),
    usersGrowth: calculateGrowth(
      toNumber(currentUsersSummary?.count),
      toNumber(previousUsersSummary?.count)
    ),
    usersByRole: {
      admin: toNumber(usersSummary?.admin),
      customer: toNumber(usersSummary?.customer),
    },
    usersByProvider: {
      email: toNumber(usersSummary?.email),
      google: toNumber(usersSummary?.google),
    },
  }
}

const getCachedDashboardStatsISR = unstable_cache(
  async (period: DashboardPeriod) => getDashboardStatsUncached(period),
  ['admin-dashboard-stats'],
  { revalidate: 180 }
)

export async function getCachedDashboardStats(period: DashboardPeriod) {
  const now = Date.now()
  const cached = dashboardMemoryCache.get(period)
  if (cached && cached.expiresAt > now) {
    return cached.data
  }

  const data = await getCachedDashboardStatsISR(period)
  dashboardMemoryCache.set(period, {
    data,
    expiresAt: now + DASHBOARD_MEMORY_TTL_MS,
  })
  return data
}
