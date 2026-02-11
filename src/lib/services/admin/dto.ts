export interface PaginationDto {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

export interface AdminProductListDto {
  id: string
  name: string
  description: string
  category: string
  productStatus: string
  price: string
  discount: string
  stock: number
  featured: boolean
  images: string[] | null
  thumbnailImage: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    reviews: number
  }
}

export interface AdminProductDetailDto {
  id: string
  name: string
  sku: string | null
  description: string
  shortDescription: string | null
  category: string
  subCategory: string | null
  brand: string | null
  productStatus: string
  basePrice: string
  price: string
  discount: string
  discountType: string | null
  finalPrice: string | null
  gstPercentage: string | null
  costPrice: string | null
  stock: number
  lowStockAlert: number | null
  stockStatus: string | null
  images: string[] | null
  thumbnailImage: string | null
  videoUrl: string | null
  material: string | null
  stoneType: string | null
  color: string | null
  earringType: string | null
  closureType: string | null
  weight: string | null
  dimensionLength: string | null
  dimensionWidth: string | null
  finish: string | null
  productWeight: string | null
  shippingClass: string | null
  packageIncludes: string | null
  codAvailable: boolean | null
  seoTitle: string | null
  metaDescription: string | null
  urlSlug: string | null
  searchTags: string[] | null
  featured: boolean
  isNewArrival: boolean | null
  careInstructions: string | null
  returnPolicy: string | null
  warranty: string | null
  certification: string | null
  reviewsEnabled: boolean | null
  createdAt: Date
  updatedAt: Date
}

export interface AdminOrderItemDto {
  id: string
  orderId: string
  quantity: number
  price: string
  product: {
    id: string
    name: string
  } | null
}

export interface AdminOrderListDto {
  id: string
  orderNumber: number
  totalPrice: string
  status: string
  paymentStatus: string
  paymentMethod: string
  customerName: string
  customerEmail: string
  customerPhone: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  pincode: string
  createdAt: Date
  updatedAt: Date
  orderItems: AdminOrderItemDto[]
}

export interface AdminReviewDto {
  id: string
  rating: number
  comment: string
  approved: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: string
    name: string
    email: string
  }
  product: {
    id: string
    name: string
  }
}

export interface AdminUserListDto {
  id: string
  name: string
  email: string
  role: string
  provider: string
  photoUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface AdminUserDetailsDto extends AdminUserListDto {
  stats: {
    totalOrders: number
    totalReviews: number
    totalSpent: number
  }
}

export const toPaginationDto = (pagination: PaginationDto): PaginationDto => ({
  page: pagination.page,
  limit: pagination.limit,
  totalCount: pagination.totalCount,
  totalPages: pagination.totalPages,
})

export const toAdminProductListDto = (product: any): AdminProductListDto => ({
  id: product.id,
  name: product.name,
  description: product.description,
  category: product.category,
  productStatus: product.productStatus,
  price: product.price,
  discount: product.discount,
  stock: product.stock,
  featured: product.featured,
  images: product.images ?? null,
  thumbnailImage: product.thumbnailImage ?? null,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  _count: {
    reviews: Number(product._count?.reviews || 0),
  },
})

export const toAdminProductDetailDto = (product: any): AdminProductDetailDto => ({
  id: product.id,
  name: product.name,
  sku: product.sku ?? null,
  description: product.description,
  shortDescription: product.shortDescription ?? null,
  category: product.category,
  subCategory: product.subCategory ?? null,
  brand: product.brand ?? null,
  productStatus: product.productStatus,
  basePrice: product.basePrice,
  price: product.price,
  discount: product.discount,
  discountType: product.discountType ?? null,
  finalPrice: product.finalPrice ?? null,
  gstPercentage: product.gstPercentage ?? null,
  costPrice: product.costPrice ?? null,
  stock: Number(product.stock),
  lowStockAlert: product.lowStockAlert ?? null,
  stockStatus: product.stockStatus ?? null,
  images: product.images ?? null,
  thumbnailImage: product.thumbnailImage ?? null,
  videoUrl: product.videoUrl ?? null,
  material: product.material ?? null,
  stoneType: product.stoneType ?? null,
  color: product.color ?? null,
  earringType: product.earringType ?? null,
  closureType: product.closureType ?? null,
  weight: product.weight ?? null,
  dimensionLength: product.dimensionLength ?? null,
  dimensionWidth: product.dimensionWidth ?? null,
  finish: product.finish ?? null,
  productWeight: product.productWeight ?? null,
  shippingClass: product.shippingClass ?? null,
  packageIncludes: product.packageIncludes ?? null,
  codAvailable: typeof product.codAvailable === 'boolean' ? product.codAvailable : null,
  seoTitle: product.seoTitle ?? null,
  metaDescription: product.metaDescription ?? null,
  urlSlug: product.urlSlug ?? null,
  searchTags: product.searchTags ?? null,
  featured: Boolean(product.featured),
  isNewArrival: typeof product.isNewArrival === 'boolean' ? product.isNewArrival : null,
  careInstructions: product.careInstructions ?? null,
  returnPolicy: product.returnPolicy ?? null,
  warranty: product.warranty ?? null,
  certification: product.certification ?? null,
  reviewsEnabled: typeof product.reviewsEnabled === 'boolean' ? product.reviewsEnabled : null,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
})

export const toAdminOrderListDto = (order: any): AdminOrderListDto => ({
  id: order.id,
  orderNumber: order.orderNumber,
  totalPrice: order.totalPrice,
  status: order.status,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  customerName: order.customerName,
  customerEmail: order.customerEmail,
  customerPhone: order.customerPhone,
  addressLine1: order.addressLine1,
  addressLine2: order.addressLine2 ?? null,
  city: order.city,
  state: order.state,
  pincode: order.pincode,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  orderItems: Array.isArray(order.orderItems)
    ? order.orderItems.map((item: any) => ({
        id: item.id,
        orderId: item.orderId,
        quantity: Number(item.quantity),
        price: item.price,
        product: item.product
          ? {
              id: item.product.id,
              name: item.product.name,
            }
          : null,
      }))
    : [],
})

export const toAdminReviewDto = (review: any): AdminReviewDto => ({
  id: review.id,
  rating: Number(review.rating),
  comment: review.comment,
  approved: Boolean(review.approved),
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
  user: {
    id: review.user.id,
    name: review.user.name,
    email: review.user.email,
  },
  product: {
    id: review.product.id,
    name: review.product.name,
  },
})

export const toAdminUserListDto = (user: any): AdminUserListDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  provider: user.provider,
  photoUrl: user.photoUrl ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

export const toAdminUserDetailsDto = (user: any, stats: AdminUserDetailsDto['stats']): AdminUserDetailsDto => ({
  ...toAdminUserListDto(user),
  stats: {
    totalOrders: Number(stats.totalOrders),
    totalReviews: Number(stats.totalReviews),
    totalSpent: Number(stats.totalSpent),
  },
})

export const toAdminDashboardDto = (stats: any) => ({
  totalSales: Number(stats.totalSales || 0),
  currentMonthSales: Number(stats.currentMonthSales || 0),
  totalOrders: Number(stats.totalOrders || 0),
  avgOrderValue: Number(stats.avgOrderValue || 0),
  totalProducts: Number(stats.totalProducts || 0),
  activeProducts: Number(stats.activeProducts || 0),
  salesGrowth: Number(stats.salesGrowth || 0),
  ordersGrowth: Number(stats.ordersGrowth || 0),
  aovGrowth: Number(stats.aovGrowth || 0),
  bestSellingProducts: Array.isArray(stats.bestSellingProducts) ? stats.bestSellingProducts : [],
  topRevenueProducts: Array.isArray(stats.topRevenueProducts) ? stats.topRevenueProducts : [],
  categoryPerformance: Array.isArray(stats.categoryPerformance) ? stats.categoryPerformance : [],
  stockStatus: stats.stockStatus || { inStock: 0, lowStock: 0, outOfStock: 0 },
  lowStockProducts: Array.isArray(stats.lowStockProducts) ? stats.lowStockProducts : [],
  inventoryValue: stats.inventoryValue || { total: 0, active: 0, lowStock: 0 },
  recentOrders: Array.isArray(stats.recentOrders) ? stats.recentOrders : [],
  mostViewedProduct: stats.mostViewedProduct || null,
  bestRatedProduct: stats.bestRatedProduct || null,
  trendingProduct: stats.trendingProduct || null,
  totalUsers: Number(stats.totalUsers || 0),
  newUsers: Number(stats.newUsers || 0),
  usersGrowth: Number(stats.usersGrowth || 0),
  usersByRole: stats.usersByRole || { admin: 0, customer: 0 },
  usersByProvider: stats.usersByProvider || { email: 0, google: 0 },
})
