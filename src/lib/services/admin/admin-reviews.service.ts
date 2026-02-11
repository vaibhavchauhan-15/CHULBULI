import { eq } from 'drizzle-orm'
import { db } from '@/lib/db/client'
import { reviews } from '@/lib/db/schema'
import {
  AdminReviewListParams,
  getAdminReviewsQuery,
} from '@/lib/services/admin/admin-query.service'
import { ServiceError } from '@/lib/services/service-error'

export async function listAdminReviewsService(params: AdminReviewListParams = {}) {
  return getAdminReviewsQuery(params)
}

export async function updateAdminReviewApprovalService(reviewId: string, approved: boolean) {
  if (typeof approved !== 'boolean') {
    throw new ServiceError('Approved field must be a boolean', 400)
  }

  const existingReview = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
  })
  if (!existingReview) {
    throw new ServiceError('Review not found', 404)
  }

  const [review] = await db.update(reviews)
    .set({ approved, updatedAt: new Date() })
    .where(eq(reviews.id, reviewId))
    .returning()

  return {
    id: review.id,
    approved: review.approved,
    updatedAt: review.updatedAt,
  }
}

export async function deleteAdminReviewService(reviewId: string) {
  const existingReview = await db.query.reviews.findFirst({
    where: eq(reviews.id, reviewId),
    columns: { id: true },
  })
  if (!existingReview) {
    throw new ServiceError('Review not found', 404)
  }

  await db.delete(reviews).where(eq(reviews.id, reviewId))

  return {
    success: true,
    message: 'Review deleted successfully',
  }
}
