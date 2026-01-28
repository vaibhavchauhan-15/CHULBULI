import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { products } from '@/lib/db/schema'
import { and, eq, gte, lte, asc, desc } from 'drizzle-orm'
import { apiRateLimiter } from '@/lib/rateLimit'
import { safeParseFloat } from '@/lib/validation'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting to prevent abuse
    const rateLimitResponse = apiRateLimiter(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'latest'
    const featured = searchParams.get('featured')

    // Build WHERE conditions
    const whereConditions = []

    if (category && category !== 'all') {
      whereConditions.push(eq(products.category, category))
    }

    if (minPrice) {
      const min = safeParseFloat(minPrice, 0)
      if (isNaN(min) || min < 0) {
        return NextResponse.json(
          { error: 'Invalid minPrice parameter' },
          { status: 400 }
        )
      }
      whereConditions.push(gte(products.price, min.toString()))
    }

    if (maxPrice) {
      const max = safeParseFloat(maxPrice, 0)
      if (isNaN(max) || max < 0) {
        return NextResponse.json(
          { error: 'Invalid maxPrice parameter' },
          { status: 400 }
        )
      }
      whereConditions.push(lte(products.price, max.toString()))
    }

    if (featured === 'true') {
      whereConditions.push(eq(products.featured, true))
    }

    // Build ORDER BY
    let orderByClause = desc(products.createdAt)

    if (sort === 'price-asc') {
      orderByClause = asc(products.price)
    } else if (sort === 'price-desc') {
      orderByClause = desc(products.price)
    } else if (sort === 'rating') {
      // For rating, sort by featured first, then createdAt
      orderByClause = desc(products.featured)
    }

    // Execute query with all conditions
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined
    const allProducts = await db.query.products.findMany({
      where: whereClause,
      orderBy: orderByClause,
    })

    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
