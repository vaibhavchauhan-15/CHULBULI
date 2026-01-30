import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { products, users } from '@/lib/db/schema'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  try {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const adminPassword = await hashPassword('Admin@123')
    await db
      .insert(users)
      .values({
        id: 'admin-1',
        name: 'Admin',
        email: 'admin@chulbulijewels.com',
        password: adminPassword,
        role: 'admin',
      })
      .onConflictDoNothing()

    console.log('✅ Admin user created/verified')

    // Create sample customer
    const customerPassword = await hashPassword('customer123')
    await db
      .insert(users)
      .values({
        id: 'customer-1',
        name: 'Jane Doe',
        email: 'customer@example.com',
        password: customerPassword,
        role: 'customer',
      })
      .onConflictDoNothing()

    console.log('✅ Customer created/verified')

    // Create sample products
    const sampleProducts = [
      {
        id: 'prod-1',
        name: 'Golden Hoop Earrings',
        description: 'Beautiful golden hoop earrings perfect for daily wear. Lightweight and comfortable.',
        price: '899.00',
        basePrice: '899.00',
        discount: '10',
        category: 'earrings',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'],
        material: 'Gold Plated Brass',
        featured: true,
      },
      {
        id: 'prod-2',
        name: 'Pearl Drop Earrings',
        description: 'Elegant pearl drop earrings that add sophistication to any outfit.',
        price: '1299.00',
        basePrice: '1299.00',
        discount: '15',
        category: 'earrings',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500'],
        material: 'Sterling Silver with Pearls',
        featured: true,
      },
      {
        id: 'prod-3',
        name: 'Delicate Chain Necklace',
        description: 'Minimalist chain necklace with a single gemstone pendant.',
        price: '1499.00',
        basePrice: '1499.00',
        discount: '5',
        category: 'necklaces',
        stock: 40,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'],
        material: 'Sterling Silver',
        featured: true,
      },
      {
        id: 'prod-4',
        name: 'Diamond Solitaire Ring',
        description: 'Classic diamond solitaire ring in white gold.',
        price: '24999.00',
        basePrice: '24999.00',
        discount: '0',
        category: 'rings',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
        material: 'White Gold with Diamond',
        featured: true,
      },
      {
        id: 'prod-5',
        name: 'Gold Bangle Set',
        description: 'Set of 4 traditional gold bangles perfect for festive occasions.',
        price: '5999.00',
        basePrice: '5999.00',
        discount: '20',
        category: 'bangles',
        stock: 25,
        images: ['https://images.unsplash.com/photo-1515560141207-1469a6c3a86d?w=500'],
        material: 'Gold Plated Brass',
        featured: true,
      },
      {
        id: 'prod-6',
        name: 'Bridal Jewelry Set',
        description: 'Complete bridal jewelry set including necklace, earrings, and ring.',
        price: '9999.00',
        basePrice: '9999.00',
        discount: '10',
        category: 'sets',
        stock: 10,
        images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
        material: 'Mixed Metals',
        featured: true,
      },
    ]

    for (const product of sampleProducts) {
      const now = new Date()
      await db
        .insert(products)
        .values({
          id: product.id,
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          price: product.price,
          discount: product.discount,
          category: product.category,
          stock: product.stock,
          images: product.images,
          material: product.material,
          featured: product.featured,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing()
    }

    console.log('✅ Sample products created/verified')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: 2,
        products: 6,
      },
    })
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
