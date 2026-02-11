import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import {
  deleteAdminUserService,
  getAdminUserDetailsService,
  updateAdminUserService,
} from '@/lib/services/admin/admin-users.service'
import { getServiceErrorStatus } from '@/lib/services/service-error'

async function handleGET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication - user is already verified by middleware
    const authUser = (request as any).user
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const userId = params.id
    const userDetails = await getAdminUserDetailsService(userId)
    return NextResponse.json(userDetails)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user details' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

async function handlePUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authUser = (request as any).user
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const userId = params.id
    const body = await request.json()
    const { role, name } = body

    const updatedUser = await updateAdminUserService({
      actorUserId: authUser.userId,
      targetUserId: userId,
      role,
      name,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

async function handleDELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authUser = (request as any).user
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const userId = params.id
    const result = await deleteAdminUserService({
      actorUserId: authUser.userId,
      targetUserId: userId,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete user' },
      { status: getServiceErrorStatus(error, 500) }
    )
  }
}

export const GET = authMiddleware(handleGET)
export const PUT = authMiddleware(handlePUT)
export const DELETE = authMiddleware(handleDELETE)
