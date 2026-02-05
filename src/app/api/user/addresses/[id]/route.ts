import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { addresses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch (error) {
    return null
  }
}

// PUT - Update address
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { label, fullName, mobile, addressLine1, addressLine2, city, state, pincode, isDefault } = body

    // Validate mobile number if provided
    if (mobile && !/^[0-9]{10}$/.test(mobile.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 })
    }

    // Validate pincode if provided
    if (pincode && !/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
    }

    // Verify address belongs to user
    const [existingAddress] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, params.id), eq(addresses.userId, decoded.userId)))
      .limit(1)

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If this is set as default, unset other defaults
    if (isDefault && !existingAddress.isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, decoded.userId))
    }

    // Update address
    const updateData: any = {
      updatedAt: new Date(),
    }

    if (label !== undefined) updateData.label = label
    if (fullName !== undefined) updateData.fullName = fullName
    if (mobile !== undefined) updateData.mobile = mobile
    if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (pincode !== undefined) updateData.pincode = pincode
    if (isDefault !== undefined) updateData.isDefault = isDefault

    const [updatedAddress] = await db
      .update(addresses)
      .set(updateData)
      .where(and(eq(addresses.id, params.id), eq(addresses.userId, decoded.userId)))
      .returning()

    if (!updatedAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Address updated successfully',
      address: updatedAddress,
    })
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Verify address belongs to user and delete
    const [deletedAddress] = await db
      .delete(addresses)
      .where(and(eq(addresses.id, params.id), eq(addresses.userId, decoded.userId)))
      .returning()

    if (!deletedAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Address deleted successfully',
    })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
