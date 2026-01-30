import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import { products } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { authMiddleware } from '@/lib/middleware'
import { sanitizeProductData, safeParseFloat, safeParseInt } from '@/lib/validation'
import { generateId } from '@/lib/db/queries'

export const dynamic = 'force-dynamic'

async function handleGET(request: NextRequest) {
  try {
    const allProducts = await db.query.products.findMany({
      orderBy: desc(products.createdAt),
      with: {
        reviews: true,
      },
    })

    // Add review count to each product
    const productsWithCount = allProducts.map(p => ({
      ...p,
      _count: { reviews: p.reviews?.length || 0 },
    }))

    return NextResponse.json(productsWithCount)
  } catch (error) {
    console.error('Admin products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

async function handlePOST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Sanitize input data
    const sanitizedData = sanitizeProductData(body)
    const { 
      // Basic Information
      name, sku, description, shortDescription, category, subCategory, brand, productStatus,
      // Pricing & Tax
      basePrice, price, discount, discountType, gstPercentage, costPrice,
      // Inventory & Stock
      stock, lowStockAlert, stockStatus,
      // Images & Media
      images, thumbnailImage, videoUrl,
      // Attributes
      material, stoneType, color, earringType, closureType, weight, dimensionLength, dimensionWidth, finish,
      // Shipping & Packaging
      productWeight, shippingClass, packageIncludes, codAvailable,
      // SEO & Visibility
      seoTitle, metaDescription, urlSlug, searchTags, featured, isNewArrival,
      // Compliance & Trust
      careInstructions, returnPolicy, warranty, certification,
      // Reviews
      reviewsEnabled
    } = sanitizedData

    // Validate required fields
    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, price, category, stock' },
        { status: 400 }
      )
    }

    // Validate price
    if (price <= 0 || price > 1000000) {
      return NextResponse.json(
        { error: 'Price must be between 0 and 1,000,000' },
        { status: 400 }
      )
    }

    // Validate discount
    if (discount < 0 || discount > 100) {
      return NextResponse.json(
        { error: 'Discount must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Validate stock
    if (stock < 0 || stock > 100000) {
      return NextResponse.json(
        { error: 'Stock must be between 0 and 100,000' },
        { status: 400 }
      )
    }

    // Calculate final price
    let finalPrice = price
    if (discount > 0) {
      if (discountType === 'percentage') {
        finalPrice = price - (price * (discount / 100))
      } else {
        finalPrice = price - discount
      }
    }

    // Process search tags
    const processedSearchTags = typeof searchTags === 'string' 
      ? searchTags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : searchTags

    // Auto-generate SKU if not provided
    const generatedSku = sku || `CHB-${category.toUpperCase().substring(0, 3)}-${Date.now()}`
    
    // Auto-generate URL slug if not provided
    const generatedSlug = urlSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Create product
    const now = new Date()
    const [product] = await db.insert(products).values({
      id: generateId('prod'),
      // Basic Information
      name,
      sku: generatedSku,
      description,
      shortDescription: shortDescription || null,
      category,
      subCategory: subCategory || null,
      brand: brand || null,
      productStatus: productStatus || 'draft',
      
      // Pricing & Tax
      basePrice: basePrice ? Number(basePrice).toFixed(2) : Number(price).toFixed(2),
      price: Number(price).toFixed(2),
      discount: Number(discount).toFixed(2),
      discountType: discountType || 'percentage',
      finalPrice: Number(finalPrice).toFixed(2),
      gstPercentage: gstPercentage ? Number(gstPercentage).toFixed(2) : '3.00',
      costPrice: costPrice ? Number(costPrice).toFixed(2) : null,
      
      // Inventory & Stock
      stock,
      lowStockAlert: lowStockAlert || 5,
      stockStatus: stockStatus || 'in_stock',
      
      // Images & Media
      images: images || [],
      thumbnailImage: thumbnailImage || (images && images[0]) || null,
      videoUrl: videoUrl || null,
      
      // Attributes
      material: material || null,
      stoneType: stoneType || null,
      color: color || null,
      earringType: earringType || null,
      closureType: closureType || null,
      weight: weight ? Number(weight).toFixed(2) : null,
      dimensionLength: dimensionLength ? Number(dimensionLength).toFixed(2) : null,
      dimensionWidth: dimensionWidth ? Number(dimensionWidth).toFixed(2) : null,
      finish: finish || null,
      
      // Shipping & Packaging
      productWeight: productWeight ? Number(productWeight).toFixed(2) : null,
      shippingClass: shippingClass || 'standard',
      packageIncludes: packageIncludes || null,
      codAvailable: codAvailable !== undefined ? codAvailable : true,
      
      // SEO & Visibility
      seoTitle: seoTitle || name,
      metaDescription: metaDescription || description.substring(0, 160),
      urlSlug: generatedSlug,
      searchTags: processedSearchTags || [],
      featured: featured || false,
      isNewArrival: isNewArrival || false,
      
      // Compliance & Trust
      careInstructions: careInstructions || null,
      returnPolicy: returnPolicy || null,
      warranty: warranty || null,
      certification: certification || null,
      
      // Reviews
      reviewsEnabled: reviewsEnabled !== undefined ? reviewsEnabled : true,
      
      createdAt: now,
      updatedAt: now,
    }).returning()

    return NextResponse.json({
      success: true,
      product,
    }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
export const POST = authMiddleware(handlePOST)
