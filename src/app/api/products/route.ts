import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { products } from '@/lib/db/schema'
import { and, eq, gte, lte, asc, desc } from 'drizzle-orm'
import { apiRateLimiter } from '@/lib/rateLimit'
import { safeParseFloat, safeParseInt } from '@/lib/validation'
import { logger } from '@/lib/logger'

// Cache products list for 60 seconds
export const revalidate = 60

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
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? safeParseInt(limitParam, 0) : null

    if (limitParam && (!limit || limit < 1 || limit > 100)) {
      return NextResponse.json(
        { error: 'Invalid limit parameter. Use a value between 1 and 100.' },
        { status: 400 }
      )
    }

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

    if (minPrice && maxPrice) {
      const min = safeParseFloat(minPrice, 0)
      const max = safeParseFloat(maxPrice, 0)
      if (min > max) {
        return NextResponse.json(
          { error: 'minPrice cannot be greater than maxPrice' },
          { status: 400 }
        )
      }
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

    // Execute query with all conditions - select only needed columns for listing
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined
    const baseQuery = db.select({
      id: products.id,
      name: products.name,
      price: products.price,
      basePrice: products.basePrice,
      discount: products.discount,
      category: products.category,
      images: products.images, // Include images array
      thumbnailImage: products.thumbnailImage,
      stock: products.stock,
      featured: products.featured,
      isNewArrival: products.isNewArrival,
    }).from(products)
      .where(whereClause)
      .orderBy(orderByClause)
    const allProducts = limit ? await baseQuery.limit(limit) : await baseQuery

    return NextResponse.json(allProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    logger.error('Products fetch error', { error })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
