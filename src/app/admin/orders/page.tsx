'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/authStore'
import AdminSidebar from '@/components/AdminSidebar'
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
    <div className="flex min-h-screen bg-champagne">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-playfair font-semibold text-warmbrown mb-1">Orders Management</h1>
            <p className="text-sm text-taupe">Manage and track all customer orders</p>
          </div>

          <div className="flex items-center gap-5 text-taupe">
            <button className="hover:text-rosegold transition-colors relative">
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rosegold rounded-full"></span>
            </button>
            <button className="hover:text-rosegold transition-colors">
              <FiSettings size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-softgold/30">
              <div className="text-right">
                <p className="text-sm font-medium text-warmbrown font-playfair">{user.name}</p>
                <p className="text-xs text-taupe">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-rosegold to-softgold rounded-xl flex items-center justify-center text-pearl font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-pearl rounded-2xl p-6 shadow-sm animate-pulse border border-softgold/20">
                <div className="h-6 bg-sand rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-sand rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-pearl rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-softgold/20">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-softgold/30">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-playfair font-semibold text-warmbrown">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="placed">Placed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                    <p className="text-xs text-taupe">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-taupe mb-1">Total Amount</p>
                    <p className="text-xl font-playfair font-semibold text-rosegold">
                      ₹{typeof order.totalPrice === 'string' ? parseFloat(order.totalPrice).toFixed(2) : order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-taupe mb-3">ORDER ITEMS</h4>
                  <div className="space-y-3">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-sand rounded-lg flex items-center justify-center">
                            <FiPackage size={18} className="text-rosegold" />
                          </div>
                          <div>
                            {item.product ? (
                              <Link 
                                href={`/products/${item.product.id}`}
                                className="text-sm font-medium text-warmbrown hover:text-rosegold transition-colors cursor-pointer"
                              >
                                {item.product.name}
                              </Link>
                            ) : (
                              <p className="text-sm font-medium text-warmbrown">Product Deleted</p>
                            )}
                            <p className="text-xs text-taupe">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-warmbrown">
                          ₹{(typeof item.price === 'string' ? parseFloat(item.price) * item.quantity : item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-sand/30 rounded-xl p-4 border border-softgold/20">
                  <h4 className="text-xs font-semibold text-taupe mb-3">SHIPPING DETAILS</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <FiUser size={14} className="text-rosegold mt-0.5" />
                      <div>
                        <p className="text-xs text-taupe">Customer</p>
                        <p className="text-sm font-medium text-warmbrown">{order.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiPhone size={14} className="text-rosegold mt-0.5" />
                      <div>
                        <p className="text-xs text-taupe">Phone</p>
                        <p className="text-sm font-medium text-warmbrown">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiMail size={14} className="text-rosegold mt-0.5" />
                      <div>
                        <p className="text-xs text-taupe">Email</p>
                        <p className="text-sm font-medium text-warmbrown">{order.customerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <FiMapPin size={14} className="text-rosegold mt-0.5" />
                      <div>
                        <p className="text-xs text-taupe">Address</p>
                        <p className="text-sm font-medium text-warmbrown">
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
          <div className="bg-pearl rounded-2xl p-12 text-center shadow-sm border border-softgold/20">
            <FiShoppingBag size={48} className="mx-auto text-sand mb-4" />
            <p className="text-warmbrown text-lg font-playfair">No orders yet</p>
            <p className="text-taupe text-sm mt-2">Orders will appear here when customers make purchases</p>
          </div>
        )}
      </main>

      {/* Right Panel - Order Stats */}
      <aside className="w-[28%] px-4 py-6 hidden xl:block">
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-pearl rounded-2xl p-5 shadow-sm border border-softgold/20">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-taupe">Total Orders</span>
                <span className="font-semibold text-warmbrown">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-taupe">Placed</span>
                <span className="font-medium text-rosegold">
                  {orders.filter((o: any) => o.status === 'placed').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-taupe">Packed</span>
                <span className="font-medium text-amber-600">
                  {orders.filter((o: any) => o.status === 'packed').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-taupe">Shipped</span>
                <span className="font-medium text-purple-600">
                  {orders.filter((o: any) => o.status === 'shipped').length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-taupe">Delivered</span>
                <span className="font-medium text-emerald-600">
                  {orders.filter((o: any) => o.status === 'delivered').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-softgold/20 to-rosegold/10 rounded-2xl p-5 border border-softgold/30">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-xs text-taupe">
              <li>• Update order status regularly</li>
              <li>• Notify customers of shipping</li>
              <li>• Check pending orders daily</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  )
}
