import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { orders, orderItems, products } from '@/lib/db/schema'
import { lte, asc, sql } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

async function handleGET(request: NextRequest) {
  try {
    // Get total sales
    const allOrders = await db.query.orders.findMany()

    const totalSales = allOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice as string), 0)
    const totalOrders = allOrders.length

    // Get today's sales
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayOrders = allOrders.filter(order => order.createdAt >= today)
    const todaySales = todayOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice as string), 0)

    // Get this month's sales
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthOrders = allOrders.filter(order => order.createdAt >= firstDayOfMonth)
    const monthSales = monthOrders.reduce((sum, order) => sum + parseFloat(order.totalPrice as string), 0)

    // Get best selling products - simplified approach
    const allOrderItems = await db.query.orderItems.findMany({
      with: {
        product: true,
      },
    })

    // Group by product and sum quantities
    const productSales = allOrderItems.reduce((acc: any, item) => {
      const productId = item.productId
      if (!acc[productId]) {
        acc[productId] = {
          product: item.product,
          totalSold: 0,
        }
      }
      acc[productId].totalSold += item.quantity
      return acc
    }, {})

    const bestSellingProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 5)
      .map((item: any) => ({
        name: item.product.name,
        images: item.product.images,
        price: item.product.price,
        totalSold: item.totalSold,
      }))

    // Low stock products
    const lowStockProducts = await db.query.products.findMany({
      where: lte(products.stock, 10),
      orderBy: asc(products.stock),
    }).then(results => results.slice(0, 5))

    return NextResponse.json({
      totalSales,
      totalOrders,
      todaySales,
      monthSales,
      bestSellingProducts,
      lowStockProducts,
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
