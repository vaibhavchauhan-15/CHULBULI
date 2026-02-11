import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import { listAdminReviewsService } from '@/lib/services/admin/admin-reviews.service'

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const approved = (searchParams.get('approved') || 'all') as 'all' | 'true' | 'false'

    const result = await listAdminReviewsService({
      page,
      limit,
      search,
      approved,
    })

    return NextResponse.json({
      reviews: result.items,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Admin reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
