import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { addresses } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch (error) {
    return null
  }
}

// GET - Get all addresses for user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userAddresses = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, decoded.userId))
      .orderBy(desc(addresses.isDefault), desc(addresses.createdAt))

    return NextResponse.json(userAddresses)
  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new address
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!label || !fullName || !mobile || !addressLine1 || !city || !state || !pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(mobile.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 })
    }

    // Validate pincode
    if (!/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, decoded.userId))
    }

    // Create new address
    const [newAddress] = await db
      .insert(addresses)
      .values({
        id: uuidv4(),
        userId: decoded.userId,
        label,
        fullName,
        mobile,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        pincode,
        isDefault: isDefault || false,
      })
      .returning()

    return NextResponse.json({
      message: 'Address created successfully',
      address: newAddress,
    })
  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
