import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq, ilike, or, sql, desc, asc } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'

async function handleGET(request: NextRequest) {
  try {
    // Verify admin authentication - user is already verified by middleware
    const authUser = (request as any).user
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'
    const provider = searchParams.get('provider') || 'all'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // Build where conditions
    let whereConditions: any[] = []

    // Search by name or email
    if (search) {
      whereConditions.push(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      )
    }

    // Filter by role
    if (role !== 'all') {
      whereConditions.push(eq(users.role, role))
    }

    // Filter by provider
    if (provider !== 'all') {
      whereConditions.push(eq(users.provider, provider))
    }

    // Build order by
    const orderByColumn = sortBy === 'name' ? users.name :
                         sortBy === 'email' ? users.email :
                         sortBy === 'role' ? users.role :
                         users.createdAt

    const orderByFn = sortOrder === 'asc' ? asc : desc

    // Fetch users with pagination
    const usersList = await db.query.users.findMany({
      where: whereConditions.length > 0 ? sql`${sql.join(whereConditions, sql` AND `)}` : undefined,
      orderBy: orderByFn(orderByColumn),
      limit: limit,
      offset: offset,
    })

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereConditions.length > 0 ? sql`${sql.join(whereConditions, sql` AND `)}` : undefined)

    const totalCount = Number(totalCountResult[0]?.count || 0)
    const totalPages = Math.ceil(totalCount / limit)

    // Remove sensitive data
    const sanitizedUsers = usersList.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider: user.provider,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))

    return NextResponse.json({
      users: sanitizedUsers,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
