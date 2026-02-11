import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import { listAdminOrdersService } from '@/lib/services/admin/admin-orders.service'

export const dynamic = 'force-dynamic'

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    const result = await listAdminOrdersService({
      page,
      limit,
      search,
      status,
    })

    return NextResponse.json({
      orders: result.items,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Admin orders fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
