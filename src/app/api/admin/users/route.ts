import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import { listAdminUsersService } from '@/lib/services/admin/admin-users.service'

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

    const result = await listAdminUsersService({
      page,
      limit,
      search,
      role,
      provider,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
