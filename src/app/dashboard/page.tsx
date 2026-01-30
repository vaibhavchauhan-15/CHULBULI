'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { FiPackage, FiTruck, FiCheckCircle, FiShoppingBag, FiMapPin, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth({ requireAuth: true })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else if (response.status === 401) {
        // If unauthorized, redirect to login
        router.push('/login')
      }
    } catch (error) {
      // Error fetching orders
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (user && !isLoading) {
      fetchOrders()
    }
  }, [user, isLoading, fetchOrders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'packed':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <FiShoppingBag className="w-4 h-4" />
      case 'packed':
        return <FiPackage className="w-4 h-4" />
      case 'shipped':
        return <FiTruck className="w-4 h-4" />
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />
      default:
        return <FiShoppingBag className="w-4 h-4" />
    }
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12 bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-3 text-editorial">
              My Dashboard
            </h1>
            <p className="text-lg text-[#5A3E2B]/70 font-light">Welcome back, {user.name}!</p>
          </div>

          {/* Account Information Card */}
          <div className="card-luxury p-8 mb-10 shadow-luxury">
            <h2 className="text-2xl font-playfair font-semibold mb-6 flex items-center text-[#5A3E2B]">
              <span className="w-1 h-6 bg-gradient-to-b from-[#C89A7A] to-[#E6C9A8] rounded-full mr-3"></span>
              Account Information
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/50 rounded-xl p-5 border border-[#C89A7A]/10 transition-luxury hover:shadow-md">
                <p className="text-sm text-[#5A3E2B]/60 mb-2 font-medium uppercase tracking-wide">Name</p>
                <p className="text-lg font-medium text-[#5A3E2B]">{user.name}</p>
              </div>
              <div className="bg-white/50 rounded-xl p-5 border border-[#C89A7A]/10 transition-luxury hover:shadow-md">
                <p className="text-sm text-[#5A3E2B]/60 mb-2 font-medium uppercase tracking-wide">Email</p>
                <p className="text-lg font-medium text-[#5A3E2B] break-all">{user.email}</p>
              </div>
              <div className="bg-white/50 rounded-xl p-5 border border-[#C89A7A]/10 transition-luxury hover:shadow-md">
                <p className="text-sm text-[#5A3E2B]/60 mb-2 font-medium uppercase tracking-wide">Account Type</p>
                <p className="text-lg font-medium text-[#5A3E2B] capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-playfair font-bold text-[#5A3E2B] flex items-center">
                <span className="w-1 h-8 bg-gradient-to-b from-[#C89A7A] to-[#E6C9A8] rounded-full mr-4"></span>
                Order History
              </h2>
              {orders.length > 0 && (
                <div className="bg-white/60 px-4 py-2 rounded-full border border-[#C89A7A]/20">
                  <span className="text-sm font-medium text-[#5A3E2B]">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-luxury p-8 animate-pulse">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="h-6 bg-[#C89A7A]/20 rounded-lg w-1/3 mb-3"></div>
                        <div className="h-4 bg-[#C89A7A]/10 rounded w-1/4"></div>
                      </div>
                      <div className="h-8 bg-[#C89A7A]/20 rounded-full w-24"></div>
                    </div>
                    <div className="h-24 bg-[#C89A7A]/10 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order: any) => {
                  const isExpanded = expandedOrders.has(order.id)
                  return (
                    <div key={order.id} className="card-luxury overflow-hidden shadow-luxury hover:shadow-luxury-lg transition-all duration-500">
                      {/* Order Header */}
                      <div className="p-6 md:p-8 bg-gradient-to-r from-white/40 to-white/20">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-[#C89A7A]/10 p-2 rounded-lg">
                                <FiShoppingBag className="w-5 h-5 text-[#C89A7A]" />
                              </div>
                              <div>
                                <p className="font-playfair font-semibold text-xl text-[#5A3E2B]">
                                  Order #{order.id.slice(0, 8).toUpperCase()}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-[#5A3E2B]/60 mt-1">
                                  <FiCalendar className="w-3.5 h-3.5" />
                                  <span>
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium capitalize border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items - Collapsible */}
                      <div className="px-6 md:px-8 py-4 border-t border-[#C89A7A]/10">
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="w-full flex items-center justify-between text-left py-2 group"
                        >
                          <span className="font-medium text-[#5A3E2B] group-hover:text-[#C89A7A] transition-colors">
                            Order Details ({order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'})
                          </span>
                          {isExpanded ? (
                            <FiChevronUp className="w-5 h-5 text-[#C89A7A] transition-transform" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-[#C89A7A] transition-transform" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-4 space-y-3 animate-fadeIn">
                            {order.orderItems.map((item: any) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center p-4 bg-white/50 rounded-lg border border-[#C89A7A]/10 hover:border-[#C89A7A]/20 transition-colors"
                              >
                                <div className="flex-1">
                                  <Link 
                                    href={`/products/${item.product.id}`}
                                    className="font-medium text-[#5A3E2B] hover:text-[#C89A7A] transition-colors cursor-pointer"
                                  >
                                    {item.product.name}
                                  </Link>
                                  <p className="text-sm text-[#5A3E2B]/60 mt-1">Quantity: {item.quantity}</p>
                                </div>
                                <span className="font-semibold text-[#C89A7A] text-lg">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Order Summary */}
                      <div className="px-6 md:px-8 py-6 border-t border-[#C89A7A]/10 bg-white/30">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-lg font-playfair font-semibold text-[#5A3E2B]">Total Amount</span>
                          <span className="text-2xl md:text-3xl font-playfair font-bold text-[#C89A7A]">
                            ₹{Number(order.totalPrice).toFixed(2)}
                          </span>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white/60 rounded-xl p-5 border border-[#C89A7A]/10">
                          <div className="flex items-start gap-3">
                            <div className="bg-[#C89A7A]/10 p-2 rounded-lg mt-0.5">
                              <FiMapPin className="w-4 h-4 text-[#C89A7A]" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-[#5A3E2B] mb-2">Shipping Address</p>
                              <p className="text-sm text-[#5A3E2B]/70 leading-relaxed">
                                {order.addressLine1}{order.addressLine2 && `, ${order.addressLine2}`}
                                <br />
                                {order.city}, {order.state} - {order.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="card-luxury p-16 text-center shadow-luxury">
                <div className="max-w-md mx-auto">
                  <div className="bg-[#C89A7A]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiShoppingBag className="w-10 h-10 text-[#C89A7A]" />
                  </div>
                  <h3 className="text-2xl font-playfair font-semibold text-[#5A3E2B] mb-3">
                    No orders yet
                  </h3>
                  <p className="text-[#5A3E2B]/60 mb-8 leading-relaxed">
                    Start exploring our exquisite collection of handcrafted jewelry
                  </p>
                  <button
                    onClick={() => router.push('/products')}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <FiShoppingBag className="w-4 h-4" />
                    Explore Collection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
