import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { orders, orderItems, products } from '@/lib/db/schema'
import { lte, asc, sql, gte, and, eq, desc } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

export const dynamic = 'force-dynamic'

async function handleGET(request: NextRequest) {
  try {
    // Get time period filter from query params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7D'

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    let previousStartDate = new Date()
    let previousEndDate = new Date()

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
        startDate = new Date(0) // Beginning of time
        previousStartDate = new Date(0)
        previousEndDate = new Date(0)
        break
    }

    // Get all orders
    const allOrders = await db.query.orders.findMany()
    
    // Filter orders for current period
    const currentPeriodOrders = allOrders.filter(order => order.createdAt >= startDate)
    const previousPeriodOrders = period !== 'ALL' 
      ? allOrders.filter(order => order.createdAt >= previousStartDate && order.createdAt < previousEndDate)
      : []

    // Calculate current period stats
    const totalSales = currentPeriodOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice as string), 0)
    const totalOrders = currentPeriodOrders.length
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

    // Calculate previous period stats for growth
    const previousSales = previousPeriodOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice as string), 0)
    const previousOrders = previousPeriodOrders.length
    const previousAvgOrderValue = previousOrders > 0 ? previousSales / previousOrders : 0

    // Calculate growth percentages
    const salesGrowth = previousSales > 0 ? ((totalSales - previousSales) / previousSales * 100).toFixed(1) : 0
    const ordersGrowth = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders * 100).toFixed(1) : 0
    const aovGrowth = previousAvgOrderValue > 0 ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue * 100).toFixed(1) : 0

    // Get all products
    const allProducts = await db.query.products.findMany()
    const totalProducts = allProducts.length
    const activeProducts = allProducts.filter(p => p.productStatus === 'active').length

    // Get order items with products for the current period
    const currentOrderIds = currentPeriodOrders.map(o => o.id)
    const allOrderItems = await db.query.orderItems.findMany({
      with: {
        product: true,
      },
    })

    // Filter order items for current period
    const currentPeriodOrderItems = allOrderItems.filter(item => 
      currentOrderIds.includes(item.orderId)
    )

    // Group by product and calculate revenue
    const productSales = currentPeriodOrderItems.reduce((acc: any, item) => {
      if (!item.product) return acc
      
      const productId = item.productId
      if (!acc[productId]) {
        acc[productId] = {
          product: item.product,
          totalSold: 0,
          revenue: 0,
        }
      }
      acc[productId].totalSold += item.quantity
      acc[productId].revenue += item.quantity * parseFloat(item.price as string)
      return acc
    }, {})

    // Best selling products by quantity
    const bestSellingProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 10)
      .map((item: any) => ({
        name: item.product.name,
        images: item.product.images,
        price: item.product.price,
        totalSold: item.totalSold,
      }))

    // Top revenue products
    const topRevenueProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((item: any) => ({
        name: item.product.name,
        revenue: item.revenue,
        soldCount: item.totalSold,
      }))

    // Category performance
    const categoryPerformance = allProducts.reduce((acc: any, product) => {
      const category = product.category || 'uncategorized'
      if (!acc[category]) {
        acc[category] = {
          category,
          count: 0,
          revenue: 0,
        }
      }
      
      // Find sales for this product in current period
      const productSale = productSales[product.id]
      if (productSale) {
        acc[category].count += productSale.totalSold
        acc[category].revenue += productSale.revenue
      }
      
      return acc
    }, {})

    const categoryPerformanceArray = Object.values(categoryPerformance)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5)

    // Stock status
    const stockStatus = {
      inStock: allProducts.filter(p => p.stock > (p.lowStockAlert || 5)).length,
      lowStock: allProducts.filter(p => p.stock <= (p.lowStockAlert || 5) && p.stock > 0).length,
      outOfStock: allProducts.filter(p => p.stock === 0).length,
    }

    // Low stock products
    const lowStockProducts = await db.query.products.findMany({
      where: and(
        lte(products.stock, 10),
        gte(products.stock, 1)
      ),
      orderBy: asc(products.stock),
      limit: 5,
    })

    // Inventory value
    const inventoryValue = {
      total: allProducts.reduce((sum, p) => sum + (parseFloat(p.price as string) * p.stock), 0),
      active: allProducts
        .filter(p => p.productStatus === 'active')
        .reduce((sum, p) => sum + (parseFloat(p.price as string) * p.stock), 0),
      lowStock: allProducts
        .filter(p => p.stock <= (p.lowStockAlert || 5) && p.stock > 0)
        .reduce((sum, p) => sum + (parseFloat(p.price as string) * p.stock), 0),
    }

    // Get recent orders (last 10 from current period)
    const recentOrders = currentPeriodOrders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map(order => ({
        id: order.id,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
      }))

    // Product activity placeholders (can be enhanced with actual tracking)
    const mostViewedProduct = bestSellingProducts[0] || { name: 'N/A' }
    const bestRatedProduct = bestSellingProducts[0] || { name: 'N/A' }
    const trendingProduct = bestSellingProducts[0] || { name: 'N/A' }

    return NextResponse.json({
      totalSales,
      totalOrders,
      avgOrderValue,
      totalProducts,
      activeProducts,
      salesGrowth: parseFloat(salesGrowth as string),
      ordersGrowth: parseFloat(ordersGrowth as string),
      aovGrowth: parseFloat(aovGrowth as string),
      bestSellingProducts,
      topRevenueProducts,
      categoryPerformance: categoryPerformanceArray,
      stockStatus,
      lowStockProducts,
      inventoryValue,
      recentOrders,
      mostViewedProduct,
      bestRatedProduct,
      trendingProduct,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)

