import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { orders, reviews, users } from '@/lib/db/schema'
import {
  toAdminUserDetailsDto,
  toAdminUserListDto,
  toPaginationDto,
} from '@/lib/services/admin/dto'
import { ServiceError } from '@/lib/services/service-error'

export interface AdminUsersListParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  provider?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function listAdminUsersService(params: AdminUsersListParams = {}) {
  const page = Math.max(1, Number(params.page || 1))
  const limit = Math.min(100, Math.max(1, Number(params.limit || 10)))
  const search = params.search || ''
  const role = params.role || 'all'
  const provider = params.provider || 'all'
  const sortBy = params.sortBy || 'createdAt'
  const sortOrder = params.sortOrder || 'desc'

  const offset = (page - 1) * limit
  const whereConditions: any[] = []

  if (search) {
    whereConditions.push(
      or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`)
      )
    )
  }
  if (role !== 'all') {
    whereConditions.push(eq(users.role, role))
  }
  if (provider !== 'all') {
    whereConditions.push(eq(users.provider, provider))
  }

  const orderByColumn = sortBy === 'name' ? users.name
    : sortBy === 'email' ? users.email
    : sortBy === 'role' ? users.role
    : users.createdAt

  const orderByFn = sortOrder === 'asc' ? asc : desc
  const where = whereConditions.length > 0 ? sql`${sql.join(whereConditions, sql` AND `)}` : undefined

  const usersList = await db.query.users.findMany({
    where,
    orderBy: orderByFn(orderByColumn),
    limit,
    offset,
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      provider: true,
      photoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(where)

  const totalCount = Number(totalCountResult[0]?.count || 0)
  const totalPages = Math.max(1, Math.ceil(totalCount / limit))

  return {
    users: usersList.map(toAdminUserListDto),
    pagination: toPaginationDto({
      page,
      limit,
      totalCount,
      totalPages,
    }),
  }
}

export async function getAdminUserDetailsService(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
      provider: true,
      photoUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw new ServiceError('User not found', 404)
  }

  const orderCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.userId, userId))

  const reviewCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(reviews)
    .where(eq(reviews.userId, userId))

  const totalSpentResult = await db
    .select({ total: sql<number>`COALESCE(SUM(CAST(${orders.totalPrice} AS NUMERIC)), 0)` })
    .from(orders)
    .where(eq(orders.userId, userId))

  return toAdminUserDetailsDto(user, {
    totalOrders: Number(orderCount[0]?.count || 0),
    totalReviews: Number(reviewCount[0]?.count || 0),
    totalSpent: Number(totalSpentResult[0]?.total || 0),
  })
}

export async function updateAdminUserService(params: {
  actorUserId: string
  targetUserId: string
  role?: string
  name?: string
}) {
  const { actorUserId, targetUserId, role, name } = params

  if (role && !['admin', 'customer'].includes(role)) {
    throw new ServiceError('Invalid role. Must be "admin" or "customer"', 400)
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, targetUserId),
    columns: { id: true },
  })

  if (!existingUser) {
    throw new ServiceError('User not found', 404)
  }

  if (actorUserId === targetUserId && role === 'customer') {
    throw new ServiceError('You cannot demote yourself from admin', 400)
  }

  const updateData: any = { updatedAt: new Date() }
  if (role) updateData.role = role
  if (name) updateData.name = name

  const [updatedUser] = await db.update(users)
    .set(updateData)
    .where(eq(users.id, targetUserId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      provider: users.provider,
      photoUrl: users.photoUrl,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })

  return toAdminUserListDto(updatedUser)
}

export async function deleteAdminUserService(params: {
  actorUserId: string
  targetUserId: string
}) {
  const { actorUserId, targetUserId } = params

  if (actorUserId === targetUserId) {
    throw new ServiceError('You cannot delete your own account', 400)
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, targetUserId),
    columns: { id: true },
  })
  if (!existingUser) {
    throw new ServiceError('User not found', 404)
  }

  await db.delete(users).where(eq(users.id, targetUserId))

  return {
    message: 'User deleted successfully',
    deletedUserId: targetUserId,
  }
}
