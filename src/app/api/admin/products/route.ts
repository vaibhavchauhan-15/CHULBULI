import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import {
  createAdminProductService,
  listAdminProductsService,
} from '@/lib/services/admin/admin-products.service'
import { getServiceErrorStatus } from '@/lib/services/service-error'

export const dynamic = 'force-dynamic'

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || 'all'
    const status = searchParams.get('status') || 'all'

    const result = await listAdminProductsService({
      page,
      limit,
      search,
      category,
      status,
    })

    return NextResponse.json({
      products: result.items,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await createAdminProductService(body)

    return NextResponse.json({
      success: true,
      product,
    }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

export const GET = authMiddleware(handleGET)
export const POST = authMiddleware(handlePOST)
