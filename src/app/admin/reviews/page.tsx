'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import AdminNavbar from '@/components/AdminNavbar'
import {
  FiCheck,
  FiX,
  FiTrash2,
  FiStar,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

interface PaginationMeta {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

interface ReviewsPayload {
  reviews: any[]
  pagination: PaginationMeta
}

const fetcher = async (url: string): Promise<ReviewsPayload> => {
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    throw new Error('Failed to fetch reviews')
  }
  return response.json()
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '10')
  const approved = searchParams.get('approved') || 'false'

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', String(limit))
    params.set('approved', approved)
    return params.toString()
  }, [page, limit, approved])

  const { data, mutate, isLoading } = useSWR<ReviewsPayload>(
    `/api/admin/reviews?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )

  const reviews = data?.reviews || []
  const pagination = data?.pagination || { page: 1, limit: 10, totalCount: 0, totalPages: 1 }

  const updateRoute = (updates: Record<string, string | undefined>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    if (resetPage) {
      params.set('page', '1')
    } else if (!params.get('page')) {
      params.set('page', String(page))
    }

    if (!params.get('limit')) {
      params.set('limit', String(limit))
    }

    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }

  const handleApprove = async (reviewId: string) => {
    const previous = data
    await mutate(
      (current) => {
        if (!current) return current
        return {
          ...current,
          reviews: current.reviews.map((review: any) =>
            review.id === reviewId ? { ...review, approved: true } : review
          ),
        }
      },
      false
    )

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ approved: true }),
      })

      if (response.ok) {
        toast.success('Review approved')
        await mutate()
      } else {
        toast.error('Failed to approve review')
        await mutate(previous, false)
      }
    } catch (error) {
      toast.error('Failed to approve review')
      await mutate(previous, false)
    }
  }

  const handleReject = async (reviewId: string) => {
    const previous = data
    await mutate(
      (current) => {
        if (!current) return current
        return {
          ...current,
          reviews: current.reviews.map((review: any) =>
            review.id === reviewId ? { ...review, approved: false } : review
          ),
        }
      },
      false
    )

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ approved: false }),
      })

      if (response.ok) {
        toast.success('Review rejected')
        await mutate()
      } else {
        toast.error('Failed to reject review')
        await mutate(previous, false)
      }
    } catch (error) {
      toast.error('Failed to reject review')
      await mutate(previous, false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    const previous = data
    await mutate(
      (current) => {
        if (!current) return current
        return {
          ...current,
          reviews: current.reviews.filter((review: any) => review.id !== reviewId),
          pagination: {
            ...current.pagination,
            totalCount: Math.max(0, current.pagination.totalCount - 1),
          },
        }
      },
      false
    )

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Review deleted')
        await mutate()
      } else {
        toast.error('Failed to delete review')
        await mutate(previous, false)
      }
    } catch (error) {
      toast.error('Failed to delete review')
      await mutate(previous, false)
    }
  }

  const pendingCount = reviews.filter((review: any) => !review.approved).length
  const approvedCount = reviews.filter((review: any) => review.approved).length

  return (
    <div className="min-h-screen bg-champagne">
      <AdminNavbar />

      <main className="px-4 md:px-6 py-6 md:py-8 pb-24 lg:pb-8 overflow-y-auto min-h-screen max-w-[1800px] xl:mr-[30%]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-playfair font-semibold text-warmbrown mb-1">Review Moderation</h1>
            <p className="text-xs md:text-sm text-taupe">Approve or moderate customer reviews</p>
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => updateRoute({ approved: 'false' }, true)}
            className={`px-3 md:px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              approved === 'false'
                ? 'bg-rosegold text-pearl shadow-sm'
                : 'bg-pearl text-taupe hover:bg-sand shadow-sm border border-softgold/20'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => updateRoute({ approved: 'true' }, true)}
            className={`px-3 md:px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              approved === 'true'
                ? 'bg-rosegold text-pearl shadow-sm'
                : 'bg-pearl text-taupe hover:bg-sand shadow-sm border border-softgold/20'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => updateRoute({ approved: 'all' }, true)}
            className={`px-3 md:px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              approved === 'all'
                ? 'bg-rosegold text-pearl shadow-sm'
                : 'bg-pearl text-taupe hover:bg-sand shadow-sm border border-softgold/20'
            }`}
          >
            All ({pagination.totalCount})
          </button>
        </div>

        {isLoading && !data ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-pearl rounded-2xl shadow-sm p-6 animate-pulse border border-softgold/20">
                <div className="h-6 bg-sand rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-sand rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-pearl rounded-2xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow border border-softgold/20">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-softgold/30 to-rosegold/20 rounded-xl flex items-center justify-center font-semibold text-rosegold">
                        {review.user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-warmbrown">{review.user.name}</p>
                        <p className="text-xs text-taupe">{review.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-sand'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-taupe">
                        {review.rating}/5
                      </span>
                    </div>

                    <p className="text-warmbrown mb-3 leading-relaxed">{review.comment}</p>

                    <div className="flex items-center gap-4 text-xs text-taupe">
                      <div className="flex items-center gap-1">
                        <FiPackage size={12} />
                        <Link
                          href={`/products/${review.product.id}`}
                          className="font-medium text-warmbrown hover:text-rosegold transition-colors cursor-pointer"
                        >
                          {review.product.name}
                        </Link>
                      </div>
                      <span>|</span>
                      <span>{new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>

                    {review.approved && (
                      <div className="mt-4 pt-4 border-t border-softgold/30">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rosegold bg-softgold/20 px-3 py-1 rounded-lg">
                          <FiCheck size={12} /> Approved & Visible
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2 md:ml-4 w-full md:w-auto">
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="flex-1 md:flex-none p-2.5 bg-softgold/20 text-rosegold hover:bg-softgold/30 rounded-xl transition-colors border border-softgold/30"
                        title="Approve Review"
                      >
                        <FiCheck size={18} className="mx-auto" />
                      </button>
                    )}
                    {review.approved && (
                      <button
                        onClick={() => handleReject(review.id)}
                        className="flex-1 md:flex-none p-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl transition-colors border border-amber-100"
                        title="Unapprove Review"
                      >
                        <FiX size={18} className="mx-auto" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex-1 md:flex-none p-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
                      title="Delete Review"
                    >
                      <FiTrash2 size={18} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-2">
                <button
                  onClick={() => updateRoute({ page: String(Math.max(1, pagination.page - 1)) })}
                  disabled={pagination.page <= 1}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-softgold/30 bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft /> Previous
                </button>
                <p className="text-sm font-semibold text-warmbrown">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} reviews)
                </p>
                <button
                  onClick={() => updateRoute({ page: String(Math.min(pagination.totalPages, pagination.page + 1)) })}
                  disabled={pagination.page >= pagination.totalPages}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-softgold/30 bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-pearl rounded-2xl shadow-sm p-12 text-center border border-softgold/20">
            <FiStar size={48} className="mx-auto text-sand mb-4" />
            <p className="text-warmbrown text-lg font-playfair">No reviews to display</p>
            <p className="text-taupe text-sm mt-2">No matching reviews for this filter.</p>
          </div>
        )}
      </main>
    </div>
  )
}
