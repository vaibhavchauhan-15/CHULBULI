import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { orderItems, products } from '@/lib/db/schema'
import { generateId } from '@/lib/db/queries'
import { sanitizeProductData } from '@/lib/validation'
import { ServiceError } from '@/lib/services/service-error'
import {
  AdminProductListParams,
  getAdminProductsQuery,
} from '@/lib/services/admin/admin-query.service'
import { toAdminProductDetailDto } from '@/lib/services/admin/dto'

export async function listAdminProductsService(params: AdminProductListParams = {}) {
  return getAdminProductsQuery(params)
}

export async function createAdminProductService(payload: unknown) {
  const sanitizedData = sanitizeProductData(payload)
  const {
    name, sku, description, shortDescription, category, subCategory, brand, productStatus,
    basePrice, price, discount, discountType, gstPercentage, costPrice,
    stock, lowStockAlert, stockStatus,
    images, thumbnailImage, videoUrl,
    material, stoneType, color, earringType, closureType, weight, dimensionLength, dimensionWidth, finish,
    productWeight, shippingClass, packageIncludes, codAvailable,
    seoTitle, metaDescription, urlSlug, searchTags, featured, isNewArrival,
    careInstructions, returnPolicy, warranty, certification,
    reviewsEnabled,
  } = sanitizedData

  if (!name || !description || price === undefined || !category || stock === undefined) {
    throw new ServiceError('Missing required fields: name, description, price, category, stock', 400)
  }
  if (price <= 0 || price > 1000000) {
    throw new ServiceError('Price must be between 0 and 1,000,000', 400)
  }
  if (discount < 0 || discount > 100) {
    throw new ServiceError('Discount must be between 0 and 100', 400)
  }
  if (stock < 0 || stock > 100000) {
    throw new ServiceError('Stock must be between 0 and 100,000', 400)
  }

  let finalPrice = price
  if (discount > 0) {
    finalPrice = discountType === 'percentage'
      ? price - (price * (discount / 100))
      : price - discount
  }

  const processedSearchTags = typeof searchTags === 'string'
    ? searchTags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    : searchTags

  const generatedSku = sku || `CHB-${category.toUpperCase().substring(0, 3)}-${Date.now()}`
  const generatedSlug = urlSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const now = new Date()

  const [product] = await db.insert(products).values({
    id: generateId('prod'),
    name,
    sku: generatedSku,
    description,
    shortDescription: shortDescription || null,
    category,
    subCategory: subCategory || null,
    brand: brand || null,
    productStatus: productStatus || 'draft',
    basePrice: basePrice ? Number(basePrice).toFixed(2) : Number(price).toFixed(2),
    price: Number(price).toFixed(2),
    discount: Number(discount).toFixed(2),
    discountType: discountType || 'percentage',
    finalPrice: Number(finalPrice).toFixed(2),
    gstPercentage: gstPercentage ? Number(gstPercentage).toFixed(2) : '3.00',
    costPrice: costPrice ? Number(costPrice).toFixed(2) : null,
    stock,
    lowStockAlert: lowStockAlert || 5,
    stockStatus: stockStatus || 'in_stock',
    images: images || [],
    thumbnailImage: thumbnailImage || (images && images[0]) || null,
    videoUrl: videoUrl || null,
    material: material || null,
    stoneType: stoneType || null,
    color: color || null,
    earringType: earringType || null,
    closureType: closureType || null,
    weight: weight ? Number(weight).toFixed(2) : null,
    dimensionLength: dimensionLength ? Number(dimensionLength).toFixed(2) : null,
    dimensionWidth: dimensionWidth ? Number(dimensionWidth).toFixed(2) : null,
    finish: finish || null,
    productWeight: productWeight ? Number(productWeight).toFixed(2) : null,
    shippingClass: shippingClass || 'standard',
    packageIncludes: packageIncludes || null,
    codAvailable: codAvailable !== undefined ? codAvailable : true,
    seoTitle: seoTitle || name,
    metaDescription: metaDescription || description.substring(0, 160),
    urlSlug: generatedSlug,
    searchTags: processedSearchTags || [],
    featured: featured || false,
    isNewArrival: isNewArrival || false,
    careInstructions: careInstructions || null,
    returnPolicy: returnPolicy || null,
    warranty: warranty || null,
    certification: certification || null,
    reviewsEnabled: reviewsEnabled !== undefined ? reviewsEnabled : true,
    createdAt: now,
    updatedAt: now,
  }).returning()

  return toAdminProductDetailDto(product)
}

export async function getAdminProductByIdService(productId: string) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })

  if (!product) {
    throw new ServiceError('Product not found', 404)
  }

  return toAdminProductDetailDto(product)
}

export async function updateAdminProductService(productId: string, payload: unknown) {
  const sanitizedData = sanitizeProductData(payload)
  const {
    name, sku, description, shortDescription, category, subCategory, brand, productStatus,
    basePrice, price, discount, discountType, gstPercentage, costPrice,
    stock, lowStockAlert, stockStatus,
    images, thumbnailImage, videoUrl,
    material, stoneType, color, earringType, closureType, weight, dimensionLength, dimensionWidth, finish,
    productWeight, shippingClass, packageIncludes, codAvailable,
    seoTitle, metaDescription, urlSlug, searchTags, featured, isNewArrival,
    careInstructions, returnPolicy, warranty, certification,
    reviewsEnabled,
  } = sanitizedData

  if (stock < 0 || stock > 100000) {
    throw new ServiceError('Stock must be between 0 and 100,000', 400)
  }
  if (price <= 0 || price > 1000000) {
    throw new ServiceError('Price must be between 0 and 1,000,000', 400)
  }
  if (discount < 0 || discount > 100) {
    throw new ServiceError('Discount must be between 0 and 100', 400)
  }

  const existingProduct = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })
  if (!existingProduct) {
    throw new ServiceError('Product not found', 404)
  }

  let finalPrice = price
  if (discount > 0) {
    finalPrice = discountType === 'percentage'
      ? price - (price * (discount / 100))
      : price - discount
  }

  const processedSearchTags = typeof searchTags === 'string'
    ? searchTags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
    : searchTags

  const [product] = await db.update(products)
    .set({
      name,
      sku: sku || existingProduct.sku,
      description,
      shortDescription: shortDescription || null,
      category,
      subCategory: subCategory || null,
      brand: brand || null,
      productStatus: productStatus || 'draft',
      basePrice: basePrice ? Number(basePrice).toFixed(2) : Number(price).toFixed(2),
      price: Number(price).toFixed(2),
      discount: Number(discount).toFixed(2),
      discountType: discountType || 'percentage',
      finalPrice: Number(finalPrice).toFixed(2),
      gstPercentage: gstPercentage ? Number(gstPercentage).toFixed(2) : '3.00',
      costPrice: costPrice ? Number(costPrice).toFixed(2) : null,
      stock,
      lowStockAlert: lowStockAlert || 5,
      stockStatus: stockStatus || 'in_stock',
      images: images || [],
      thumbnailImage: thumbnailImage || (images && images[0]) || null,
      videoUrl: videoUrl || null,
      material: material || null,
      stoneType: stoneType || null,
      color: color || null,
      earringType: earringType || null,
      closureType: closureType || null,
      weight: weight ? Number(weight).toFixed(2) : null,
      dimensionLength: dimensionLength ? Number(dimensionLength).toFixed(2) : null,
      dimensionWidth: dimensionWidth ? Number(dimensionWidth).toFixed(2) : null,
      finish: finish || null,
      productWeight: productWeight ? Number(productWeight).toFixed(2) : null,
      shippingClass: shippingClass || 'standard',
      packageIncludes: packageIncludes || null,
      codAvailable: codAvailable !== undefined ? codAvailable : true,
      seoTitle: seoTitle || name,
      metaDescription: metaDescription || description.substring(0, 160),
      urlSlug: urlSlug || existingProduct.urlSlug,
      searchTags: processedSearchTags || [],
      featured: featured || false,
      isNewArrival: isNewArrival || false,
      careInstructions: careInstructions || null,
      returnPolicy: returnPolicy || null,
      warranty: warranty || null,
      certification: certification || null,
      reviewsEnabled: reviewsEnabled !== undefined ? reviewsEnabled : true,
      updatedAt: new Date(),
    })
    .where(eq(products.id, productId))
    .returning()

  return toAdminProductDetailDto(product)
}

export async function deleteAdminProductService(productId: string, forceDelete: boolean) {
  const existingOrderItems = await db.query.orderItems.findMany({
    where: eq(orderItems.productId, productId),
    columns: { id: true },
  })

  if (existingOrderItems.length > 0 && !forceDelete) {
    throw new ServiceError(
      `Cannot delete product. It exists in ${existingOrderItems.length} order(s). Consider marking it as out of stock instead.`,
      400
    )
  }

  if (forceDelete && existingOrderItems.length > 0) {
    await db.delete(orderItems).where(eq(orderItems.productId, productId))
  }

  await db.delete(products).where(eq(products.id, productId))

  return {
    success: true,
    message: forceDelete ? 'Product force deleted (order items removed)' : 'Product deleted successfully',
    orderCount: existingOrderItems.length,
  }
}
