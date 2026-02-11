'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import AdminNavbar from '@/components/AdminNavbar'
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiPackage,
  FiShoppingBag,
  FiSearch,
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

interface OrdersPayload {
  orders: any[]
  pagination: PaginationMeta
}

interface AdminOrdersClientProps {
  initialOrders: any[]
  initialPagination: PaginationMeta
  initialFilters: {
    search: string
    status: string
  }
}

const fetcher = async (url: string): Promise<OrdersPayload> => {
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.error || 'Failed to load orders')
  }
  return response.json()
}

export default function AdminOrdersClient({
  initialOrders,
  initialPagination,
  initialFilters,
}: AdminOrdersClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchInput, setSearchInput] = useState(initialFilters.search)

  const activePage = Number(searchParams.get('page') || initialPagination.page || 1)
  const activeLimit = Number(searchParams.get('limit') || initialPagination.limit || 10)
  const activeSearch = searchParams.get('search') || initialFilters.search || ''
  const activeStatus = searchParams.get('status') || initialFilters.status || 'all'

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(activePage))
    params.set('limit', String(activeLimit))
    if (activeSearch) params.set('search', activeSearch)
    if (activeStatus && activeStatus !== 'all') params.set('status', activeStatus)
    return params.toString()
  }, [activePage, activeLimit, activeSearch, activeStatus])

  const { data, mutate, isLoading } = useSWR<OrdersPayload>(
    `/api/admin/orders?${queryString}`,
    fetcher,
    {
      fallbackData: {
        orders: initialOrders,
        pagination: initialPagination,
      },
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )

  const orders = data?.orders || []
  const pagination = data?.pagination || initialPagination

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
      params.set('page', String(activePage))
    }

    if (!params.get('limit')) {
      params.set('limit', String(activeLimit))
    }

    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== activeSearch) {
        updateRoute({ search: searchInput || undefined }, true)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchInput, activeSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const previous = data

    await mutate(
      (current) => {
        if (!current) return current
        return {
          ...current,
          orders: current.orders.map((order: any) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          ),
        }
      },
      false
    )

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Order status updated')
        await mutate()
      } else {
        const payload = await response.json().catch(() => null)
        toast.error(payload?.error || 'Failed to update status')
        await mutate(previous, false)
      }
    } catch (error) {
      toast.error('Failed to update status')
      await mutate(previous, false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-softgold/20 text-rosegold border-softgold/30'
      case 'packed':
        return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-100'
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-100'
      default:
        return 'bg-sand text-taupe border-softgold/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne via-pearl to-sand">
      <AdminNavbar />

      <main className="px-4 md:px-8 py-6 md:py-8 pb-24 lg:pb-8 overflow-y-auto min-h-screen max-w-[1800px]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4 md:gap-6">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-playfair font-bold text-warmbrown mb-1 md:mb-2">Orders Management</h1>
            <p className="text-xs md:text-sm text-taupe font-medium">Manage and track customer orders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe/70" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by customer name, email, phone, or order number..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-softgold/30 bg-white/90 focus:outline-none focus:border-rosegold/50 text-warmbrown"
            />
          </div>
          <select
            value={activeStatus}
            onChange={(e) => updateRoute({ status: e.target.value }, true)}
            className="px-3 py-3 rounded-xl border-2 border-softgold/30 bg-white/90 text-warmbrown focus:outline-none focus:border-rosegold/50"
          >
            <option value="all">All Status</option>
            <option value="placed">Placed</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading && !data ? (
          <div className="space-y-4 md:space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-lg animate-pulse border-2 border-softgold/20">
                <div className="h-6 md:h-8 bg-sand/40 rounded-xl w-1/3 mb-3 md:mb-4"></div>
                <div className="h-4 md:h-5 bg-sand/40 rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4 md:space-y-5">
            {orders.map((order: any) => {
              const displayStatus = order.paymentStatus === 'failed' ? 'cancelled' : order.status
              const isFailedPayment = order.paymentStatus === 'failed'

              return (
                <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-7 shadow-xl hover:shadow-2xl transition-all border-2 border-softgold/20 hover:border-rosegold/30">
                  <div className="flex flex-col lg:flex-row items-start justify-between mb-4 md:mb-6 pb-4 md:pb-5 border-b-2 border-softgold/30 gap-3 md:gap-4">
                    <div className="w-full lg:w-auto">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 md:gap-3 mb-2">
                        <h3 className="font-playfair font-bold text-warmbrown text-base md:text-lg lg:text-xl">
                          Order #{order.orderNumber || order.id.slice(0, 8)}
                        </h3>
                        <select
                          value={displayStatus}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={isFailedPayment}
                          className={`input-luxury px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold capitalize border-2 w-full sm:w-auto shadow-sm hover:shadow-md transition-all cursor-pointer touch-target active:scale-95 ${getStatusColor(
                            displayStatus
                          )}`}
                        >
                          <option value="placed">Placed</option>
                          <option value="packed">Packed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <p className="text-sm text-taupe font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-left lg:text-right w-full lg:w-auto">
                      <p className="text-xs text-taupe font-semibold mb-1">TOTAL AMOUNT</p>
                      <p className="text-2xl font-playfair font-bold text-rosegold">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          minimumFractionDigits: 2,
                        }).format(Number(order.totalPrice || 0))}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-warmbrown mb-4 flex items-center gap-2">
                      <FiPackage className="text-rosegold" size={18} />
                      ORDER ITEMS
                    </h4>
                    <div className="space-y-3">
                      {order.orderItems.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center py-3 px-4 rounded-2xl hover:bg-sand/30 transition-all border-b border-softgold/20 last:border-0">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-rosegold/20 to-softgold/20 rounded-2xl flex items-center justify-center">
                              <FiPackage size={20} className="text-rosegold" />
                            </div>
                            <div>
                              {item.product ? (
                                <Link
                                  href={`/products/${item.product.id}`}
                                  className="text-sm font-semibold text-warmbrown hover:text-rosegold transition-colors cursor-pointer"
                                >
                                  {item.product.name}
                                </Link>
                              ) : (
                                <p className="text-sm font-semibold text-gray-400">Product Deleted</p>
                              )}
                              <p className="text-xs text-taupe font-medium mt-0.5">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-base font-bold text-warmbrown">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              minimumFractionDigits: 2,
                            }).format(Number(item.price || 0) * Number(item.quantity || 0))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-sand/40 to-softgold/20 rounded-2xl p-6 border-2 border-softgold/30">
                    <h4 className="text-sm font-bold text-warmbrown mb-5 flex items-center gap-2">
                      <FiMapPin className="text-rosegold" size={18} />
                      SHIPPING & PAYMENT DETAILS
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                        <div className="p-2 bg-rosegold/10 rounded-lg">
                          <FiPackage size={16} className="text-rosegold" />
                        </div>
                        <div>
                          <p className="text-xs text-taupe font-semibold mb-1">Payment Method</p>
                          <p className="text-sm font-bold text-warmbrown capitalize">{order.paymentMethod || 'COD'}</p>
                          {order.paymentStatus && (
                            <p className={`text-xs font-semibold mt-1 ${
                              order.paymentStatus === 'completed' ? 'text-emerald-600' :
                              order.paymentStatus === 'failed' ? 'text-red-600' :
                              'text-amber-600'
                            }`}>
                              Status: {order.paymentStatus.toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                        <div className="p-2 bg-rosegold/10 rounded-lg">
                          <FiUser size={16} className="text-rosegold" />
                        </div>
                        <div>
                          <p className="text-xs text-taupe font-semibold mb-1">Customer</p>
                          <p className="text-sm font-bold text-warmbrown">{order.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                        <div className="p-2 bg-rosegold/10 rounded-lg">
                          <FiPhone size={16} className="text-rosegold" />
                        </div>
                        <div>
                          <p className="text-xs text-taupe font-semibold mb-1">Phone</p>
                          <p className="text-sm font-bold text-warmbrown">{order.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                        <div className="p-2 bg-rosegold/10 rounded-lg">
                          <FiMail size={16} className="text-rosegold" />
                        </div>
                        <div>
                          <p className="text-xs text-taupe font-semibold mb-1">Email</p>
                          <p className="text-sm font-bold text-warmbrown">{order.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white/60 rounded-xl">
                        <div className="p-2 bg-rosegold/10 rounded-lg">
                          <FiMapPin size={16} className="text-rosegold" />
                        </div>
                        <div>
                          <p className="text-xs text-taupe font-semibold mb-1">Delivery Address</p>
                          <p className="text-sm font-bold text-warmbrown leading-relaxed">
                            {order.addressLine1}, {order.addressLine2 && `${order.addressLine2}, `}
                            {order.city}, {order.state} - {order.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

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
                  Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} orders)
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-16 text-center shadow-xl border-2 border-softgold/30">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sand/50 to-softgold/30 rounded-3xl flex items-center justify-center">
              <FiShoppingBag size={48} className="text-rosegold" />
            </div>
            <p className="text-warmbrown text-2xl font-playfair font-bold mb-2">No orders found</p>
            <p className="text-taupe text-base">Try adjusting the filters.</p>
          </div>
        )}
      </main>
    </div>
  )
}
