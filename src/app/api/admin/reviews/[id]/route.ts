import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import {
  deleteAdminReviewService,
  updateAdminReviewApprovalService,
} from '@/lib/services/admin/admin-reviews.service'
import { getServiceErrorStatus } from '@/lib/services/service-error'

async function handlePUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { approved } = await request.json()
    const review = await updateAdminReviewApprovalService(params.id, approved)

    return NextResponse.json(review)
  } catch (error) {
    console.error('Review update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

async function handleDELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteAdminReviewService(params.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Review deletion error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

export const PUT = authMiddleware(handlePUT)
export const DELETE = authMiddleware(handleDELETE)
