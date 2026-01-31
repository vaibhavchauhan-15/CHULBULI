'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import AdminSidebar from '@/components/AdminSidebar'
import AdminMobileNav from '@/components/AdminMobileNav'
import { 
  FiBell, FiSettings, FiSearch, FiMapPin, FiPhone, 
  FiMail, FiUser, FiPackage, FiShoppingBag
} from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminOrdersPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }
    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        const errorData = await response.json()
        toast.error(`Failed to load orders: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      toast.error('Error loading orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
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
        fetchOrders()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update status')
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
      default:
        return 'bg-sand text-taupe border-softgold/30'
    }
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne via-pearl to-sand">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-72 px-4 md:px-8 py-6 md:py-8 pb-24 lg:pb-8 overflow-y-auto min-h-screen">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-playfair font-bold text-warmbrown mb-2">Orders Management</h1>
            <p className="text-sm text-taupe font-medium">Manage and track all customer orders and deliveries</p>
          </div>

          <div className="flex items-center gap-4 text-taupe">
            <button className="relative p-2.5 hover:bg-white/80 rounded-xl transition-all hover:text-rosegold group">
              <FiBell size={22} className="transition-transform group-hover:scale-110" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rosegold rounded-full animate-pulse shadow-lg"></span>
            </button>
            <button className="p-2.5 hover:bg-white/80 rounded-xl transition-all hover:text-rosegold group hidden md:block">
              <FiSettings size={22} className="transition-transform group-hover:rotate-90 duration-500" />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l-2 border-softgold/40">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-warmbrown font-playfair">{user.name}</p>
                <p className="text-xs text-taupe font-medium">Administrator</p>
              </div>
              <div className="w-11 h-11 bg-gradient-to-br from-rosegold via-softgold to-[#B8916B] rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg ring-2 ring-white/50 hover:scale-105 transition-transform cursor-pointer">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-3xl p-7 shadow-lg animate-pulse border-2 border-softgold/20">
                <div className="h-8 bg-sand/40 rounded-xl w-1/3 mb-4"></div>
                <div className="h-5 bg-sand/40 rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-5">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-7 shadow-xl hover:shadow-2xl transition-all border-2 border-softgold/20 hover:border-rosegold/30">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row items-start justify-between mb-6 pb-5 border-b-2 border-softgold/30 gap-4">
                  <div className="w-full lg:w-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                      <h3 className="font-playfair font-bold text-warmbrown text-lg lg:text-xl">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold capitalize border-2 w-full sm:w-auto shadow-sm hover:shadow-md transition-all cursor-pointer ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="placed">Placed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
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
                      ₹{typeof order.totalPrice === 'string' ? parseFloat(order.totalPrice).toFixed(2) : order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
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
                          ₹{(typeof item.price === 'string' ? parseFloat(item.price) * item.quantity : item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-gradient-to-br from-sand/40 to-softgold/20 rounded-2xl p-6 border-2 border-softgold/30">
                  <h4 className="text-sm font-bold text-warmbrown mb-5 flex items-center gap-2">
                    <FiMapPin className="text-rosegold" size={18} />
                    SHIPPING DETAILS
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-16 text-center shadow-xl border-2 border-softgold/30">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sand/50 to-softgold/30 rounded-3xl flex items-center justify-center">
              <FiShoppingBag size={48} className="text-rosegold" />
            </div>
            <p className="text-warmbrown text-2xl font-playfair font-bold mb-2">No orders yet</p>
            <p className="text-taupe text-base">Orders will appear here when customers make purchases</p>
          </div>
        )}
      </main>

      {/* Right Panel - Order Stats */}
      <aside className="w-[320px] px-5 py-8 hidden xl:block bg-white/40 backdrop-blur-sm border-l-2 border-softgold/30">
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-softgold/20">
            <h3 className="text-base font-playfair font-bold text-warmbrown mb-5 flex items-center gap-2">
              <FiShoppingBag className="text-rosegold" size={20} />
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-sand/30 to-softgold/20 border border-softgold/30">
                <span className="text-sm text-taupe font-semibold">Total Orders</span>
                <span className="font-bold text-lg text-warmbrown">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-amber-50 transition-all border border-amber-200">
                <span className="text-sm text-taupe font-medium">Placed</span>
                <span className="font-bold text-base text-amber-600 bg-amber-100 px-3 py-1 rounded-lg">
                  {orders.filter((o: any) => o.status === 'placed').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-orange-50 transition-all border border-orange-200">
                <span className="text-sm text-taupe font-medium">Packed</span>
                <span className="font-bold text-base text-orange-600 bg-orange-100 px-3 py-1 rounded-lg">
                  {orders.filter((o: any) => o.status === 'packed').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-purple-50 transition-all border border-purple-200">
                <span className="text-sm text-taupe font-medium">Shipped</span>
                <span className="font-bold text-base text-purple-600 bg-purple-100 px-3 py-1 rounded-lg">
                  {orders.filter((o: any) => o.status === 'shipped').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-emerald-50 transition-all border border-emerald-200">
                <span className="text-sm text-taupe font-medium">Delivered</span>
                <span className="font-bold text-base text-emerald-600 bg-emerald-100 px-3 py-1 rounded-lg">
                  {orders.filter((o: any) => o.status === 'delivered').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-softgold/30 to-rosegold/20 rounded-3xl p-6 border-2 border-softgold/40 shadow-lg">
            <h3 className="text-base font-playfair font-bold text-warmbrown mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span> Quick Tips
            </h3>
            <ul className="space-y-3 text-sm text-warmbrown/80 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-rosegold font-bold">•</span>
                <span>Update order status regularly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rosegold font-bold">•</span>
                <span>Notify customers of shipping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rosegold font-bold">•</span>
                <span>Check pending orders daily</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <AdminMobileNav />
    </div>
  )
}
