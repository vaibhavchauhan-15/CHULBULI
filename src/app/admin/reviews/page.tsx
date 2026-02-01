'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import AdminSidebar from '@/components/AdminSidebar'
import AdminMobileNav from '@/components/AdminMobileNav'
import { 
  FiBell, FiSettings, FiCheck, FiX, FiTrash2, FiUser, FiStar, FiPackage
} from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminReviewsPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }
    fetchReviews()
  }, [user, router])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      // Error fetching reviews
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ approved: true }),
      })

      if (response.ok) {
        toast.success('Review approved')
        fetchReviews()
      } else {
        toast.error('Failed to approve review')
      }
    } catch (error) {
      toast.error('Failed to approve review')
    }
  }

  const handleReject = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ approved: false }),
      })

      if (response.ok) {
        toast.success('Review rejected')
        fetchReviews()
      } else {
        toast.error('Failed to reject review')
      }
    } catch (error) {
      toast.error('Failed to reject review')
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Review deleted')
        fetchReviews()
      } else {
        toast.error('Failed to delete review')
      }
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const filteredReviews = reviews.filter((review: any) => {
    if (filter === 'pending') return !review.approved
    if (filter === 'approved') return review.approved
    return true
  })

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-champagne">
      <AdminSidebar />
      <AdminMobileNav />

      {/* Main Content */}
      <main className="ml-0 lg:ml-72 xl:mr-[28%] px-3 md:px-6 py-4 md:py-6 pb-24 lg:pb-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-playfair font-semibold text-warmbrown mb-1">Review Moderation</h1>
            <p className="text-sm text-taupe">Approve or moderate customer reviews</p>
          </div>

          <div className="flex items-center gap-3 md:gap-5 text-taupe">
            <button className="hover:text-rosegold transition-colors relative">
              <FiBell size={20} />
              {reviews.filter((r: any) => !r.approved).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rosegold rounded-full"></span>
              )}
            </button>
            <button className="hover:text-rosegold transition-colors">
              <FiSettings size={20} />
            </button>
            <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 border-l border-softgold/30">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-warmbrown font-playfair">{user.name}</p>
                <p className="text-xs text-taupe">Administrator</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-rosegold to-softgold rounded-xl flex items-center justify-center text-pearl font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 md:px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-rosegold text-pearl shadow-sm'
                : 'bg-pearl text-taupe hover:bg-sand shadow-sm border border-softgold/20'
            }`}
          >
            Pending ({reviews.filter((r: any) => !r.approved).length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 md:px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              filter === 'approved'
                ? 'bg-rosegold text-pearl shadow-sm'
                : 'bg-pearl text-taupe hover:bg-sand shadow-sm border border-softgold/20'
            }`}
          >
            Approved ({reviews.filter((r: any) => r.approved).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 md:px-4 py-2 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              filter === 'all'
                ? 'bg-rosegold text-pearl shadow-sm'
                : 'bg-pearl text-taupe hover:bg-sand shadow-sm border border-softgold/20'
            }`}
          >
            All ({reviews.length})
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-pearl rounded-2xl shadow-sm p-6 animate-pulse border border-softgold/20">
                <div className="h-6 bg-sand rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-sand rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review: any) => (
              <div key={review.id} className="bg-pearl rounded-2xl shadow-sm p-4 md:p-6 hover:shadow-md transition-shadow border border-softgold/20">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Reviewer Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-softgold/30 to-rosegold/20 rounded-xl flex items-center justify-center font-semibold text-rosegold">
                        {review.user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-warmbrown">{review.user.name}</p>
                        <p className="text-xs text-taupe">{review.user.email}</p>
                      </div>
                    </div>

                    {/* Rating */}
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

                    {/* Review Content */}
                    <p className="text-warmbrown mb-3 leading-relaxed">{review.comment}</p>

                    {/* Product & Date */}
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
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</span>
                    </div>

                    {/* Status Badge */}
                    {review.approved && (
                      <div className="mt-4 pt-4 border-t border-softgold/30">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rosegold bg-softgold/20 px-3 py-1 rounded-lg">
                          <FiCheck size={12} /> Approved & Visible
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
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
          </div>
        ) : (
          <div className="bg-pearl rounded-2xl shadow-sm p-12 text-center border border-softgold/20">
            <FiStar size={48} className="mx-auto text-sand mb-4" />
            <p className="text-warmbrown text-lg font-playfair">No reviews to display</p>
            <p className="text-taupe text-sm mt-2">
              {filter === 'pending' && 'No pending reviews at the moment'}
              {filter === 'approved' && 'No approved reviews yet'}
              {filter === 'all' && 'No reviews have been submitted yet'}
            </p>
          </div>
        )}
      </main>

      {/* Right Panel - Review Stats */}
      <aside className="hidden xl:block fixed right-0 top-0 w-[28%] h-screen px-4 py-6 bg-champagne overflow-y-auto">
        <div className="space-y-6">
          {/* Review Summary */}
          <div className="bg-pearl rounded-2xl p-5 shadow-sm border border-softgold/20">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-4">Review Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-taupe">Total Reviews</span>
                <span className="font-semibold text-warmbrown">{reviews.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-taupe">Pending</span>
                <span className="font-medium text-amber-600">
                  {reviews.filter((r: any) => !r.approved).length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-taupe">Approved</span>
                <span className="font-medium text-rosegold">
                  {reviews.filter((r: any) => r.approved).length}
                </span>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-gradient-to-br from-softgold/20 to-rosegold/10 rounded-2xl p-5 border border-softgold/30">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-3">Average Rating</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-playfair font-bold text-rosegold">
                {reviews.length > 0
                  ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
                  : '0.0'}
              </span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-sand'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-taupe">Based on {reviews.length} reviews</p>
          </div>

          {/* Quick Tips */}
          <div className="bg-sand/30 rounded-2xl p-5 border border-softgold/20">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-3">💡 Moderation Tips</h3>
            <ul className="space-y-2 text-xs text-taupe">
              <li>• Review pending items daily</li>
              <li>• Look for spam or inappropriate content</li>
              <li>• Approve genuine customer feedback</li>
              <li>• Delete offensive reviews promptly</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <AdminMobileNav />
    </div>
  )
}
