import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { orders } from '@/lib/db/schema'
import {
  AdminOrderListParams,
  getAdminOrdersQuery,
} from '@/lib/services/admin/admin-query.service'
import { ServiceError } from '@/lib/services/service-error'

const VALID_ORDER_STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'] as const

export async function listAdminOrdersService(params: AdminOrderListParams = {}) {
  return getAdminOrdersQuery(params)
}

export async function updateAdminOrderStatusService(orderId: string, status: string) {
  if (!VALID_ORDER_STATUSES.includes(status as (typeof VALID_ORDER_STATUSES)[number])) {
    throw new ServiceError('Invalid status', 400)
  }

  const existingOrder = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  })
  if (!existingOrder) {
    throw new ServiceError('Order not found', 404)
  }

  if (existingOrder.paymentStatus === 'failed' && status !== 'cancelled') {
    throw new ServiceError('Failed payment orders can only be set to cancelled', 400)
  }

  const [order] = await db.update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning()

  return order
}
