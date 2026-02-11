import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import { updateAdminOrderStatusService } from '@/lib/services/admin/admin-orders.service'
import { getServiceErrorStatus } from '@/lib/services/service-error'

async function handlePUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const order = await updateAdminOrderStatusService(params.id, status)

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

export const PUT = authMiddleware(handlePUT)
