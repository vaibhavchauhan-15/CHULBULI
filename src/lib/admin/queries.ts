// Backward-compatible re-exports.
export {
  getAdminProductsQuery as getAdminProducts,
  getAdminOrdersQuery as getAdminOrders,
  getAdminReviewsQuery as getAdminReviews,
} from '@/lib/services/admin/admin-query.service'

export type {
  AdminListParams,
  AdminProductListParams,
  AdminOrderListParams,
  AdminReviewListParams,
} from '@/lib/services/admin/admin-query.service'
