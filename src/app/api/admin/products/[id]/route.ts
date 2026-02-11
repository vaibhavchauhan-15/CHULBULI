import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import {
  deleteAdminProductService,
  getAdminProductByIdService,
  updateAdminProductService,
} from '@/lib/services/admin/admin-products.service'
import { getServiceErrorStatus } from '@/lib/services/service-error'

async function handlePUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const product = await updateAdminProductService(context.params.id, body)

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update product' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

async function handleGET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const product = await getAdminProductByIdService(context.params.id)

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

async function handleDELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const forceDelete = searchParams.get('force') === 'true'
    const result = await deleteAdminProductService(context.params.id, forceDelete)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Product deletion error:', error)
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

export const GET = authMiddleware(handleGET)
export const PUT = authMiddleware(handlePUT)
export const DELETE = authMiddleware(handleDELETE)
