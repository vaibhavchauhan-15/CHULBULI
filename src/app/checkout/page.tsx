'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiShoppingBag, FiCheck, FiTruck } from 'react-icons/fi'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart, removeItem } = useCartStore()
  const user = useAuthStore((state) => state.user)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  })

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateCartItems = async () => {
    const productIds = items.map(item => item.id)
    
    const response = await fetch('/api/cart/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productIds }),
    })

    if (!response.ok) {
      throw new Error('Failed to validate cart items')
    }

    return await response.json()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      // Validate cart items before proceeding
      const validation = await validateCartItems()
      
      if (!validation.valid) {
        // Remove unavailable products from cart
        validation.unavailableProductIds.forEach((id: string) => {
          removeItem(id)
        })
        validation.unavailableProducts.forEach((product: any) => {
          removeItem(product.id)
        })

        const unavailableCount = validation.unavailableProductIds.length + validation.unavailableProducts.length
        
        toast.error(
          `${unavailableCount} item${unavailableCount > 1 ? 's' : ''} in your cart ${unavailableCount > 1 ? 'are' : 'is'} no longer available and ${unavailableCount > 1 ? 'have' : 'has'} been removed. Please review your cart.`,
          { duration: 5000 }
        )
        
        setLoading(false)
        router.push('/cart')
        return
      }

      const orderData = {
        ...formData,
        userId: user?.id || null,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/order-success?orderId=${order.id}`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to place order')
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading or empty state while redirecting
  if (items.length === 0) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12 bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-3 text-[#5A3E2B]">
              Checkout
            </h1>
            <p className="text-lg text-[#5A3E2B]/70 font-light">Complete your order securely</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              
              {/* Contact Information */}
              <div className="card-luxury p-6 md:p-8 shadow-luxury">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#C89A7A]/10 p-3 rounded-xl">
                    <FiUser className="w-5 h-5 text-[#C89A7A]" />
                  </div>
                  <h2 className="text-2xl font-playfair font-semibold text-[#5A3E2B]">Contact Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#5A3E2B]/70 mb-2">
                      Full Name <span className="text-[#C89A7A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="customerName"
                        placeholder="Aloo"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="input-luxury w-full pl-4 pr-4"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#5A3E2B]/70 mb-2">
                      Email Address <span className="text-[#C89A7A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="customerEmail"
                        placeholder="aloo@gmail.com"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                        className="input-luxury w-full pl-4 pr-4"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#5A3E2B]/70 mb-2">
                      Phone Number <span className="text-[#C89A7A]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="customerPhone"
                        placeholder="+91 98765 43210"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        required
                        className="input-luxury w-full pl-4 pr-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="card-luxury p-6 md:p-8 shadow-luxury">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#C89A7A]/10 p-3 rounded-xl">
                    <FiMapPin className="w-5 h-5 text-[#C89A7A]" />
                  </div>
                  <h2 className="text-2xl font-playfair font-semibold text-[#5A3E2B]">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#5A3E2B]/70 mb-2">
                      Address Line 1 <span className="text-[#C89A7A]">*</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      placeholder="House No., Street Name"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      required
                      className="input-luxury w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#5A3E2B]/70 mb-2">
                      Address Line 2 <span className="text-[#5A3E2B]/40">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      placeholder="Apartment, Suite, etc."
                        value={formData.addressLine2}
                      onChange={handleChange}
                      className="input-luxury w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5A3E2B]/70 mb-2">
                        City <span className="text-[#C89A7A]">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="input-luxury w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5A3E2B]/70 mb-2">
                        State <span className="text-[#C89A7A]">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="input-luxury w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#5A3E2B]/70 mb-2">
                      Pincode <span className="text-[#C89A7A]">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="123456"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      className="input-luxury w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card-luxury p-6 md:p-8 shadow-luxury">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#C89A7A]/10 p-3 rounded-xl">
                    <FiCreditCard className="w-5 h-5 text-[#C89A7A]" />
                  </div>
                  <h2 className="text-2xl font-playfair font-semibold text-[#5A3E2B]">Payment Method</h2>
                </div>
                <div className="bg-white/60 border-2 border-[#C89A7A] rounded-xl p-5 transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#C89A7A] bg-[#C89A7A]">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#5A3E2B] text-lg">Cash on Delivery (COD)</p>
                      <p className="text-sm text-[#5A3E2B]/60 mt-1">Pay when you receive your order</p>
                    </div>
                    <FiTruck className="w-6 h-6 text-[#C89A7A]" />
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FiShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Place Order
                  </>
                )}
              </button>
              
              {/* Security Notice */}
              <div className="bg-white/50 border border-[#C89A7A]/20 rounded-xl p-4 flex items-start gap-3">
                <FiCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#5A3E2B]/70 leading-relaxed">
                  Your personal information is secure and will only be used to process your order.
                </p>
              </div>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-luxury p-6 md:p-8 sticky top-24 shadow-luxury-lg">
                <h2 className="text-2xl font-playfair font-semibold mb-6 text-[#5A3E2B] flex items-center">
                  <span className="w-1 h-6 bg-gradient-to-b from-[#C89A7A] to-[#E6C9A8] rounded-full mr-3"></span>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const finalPrice = item.price - (item.price * item.discount) / 100
                    return (
                      <div key={item.id} className="bg-white/50 rounded-lg p-4 border border-[#C89A7A]/10">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-[#5A3E2B] mb-1">{item.name}</p>
                            <p className="text-sm text-[#5A3E2B]/60">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-[#C89A7A] whitespace-nowrap">
                            ₹{(finalPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-[#C89A7A]/20 pt-5 space-y-3">
                  <div className="flex justify-between text-[#5A3E2B]/70">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#5A3E2B]/70">Shipping</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <FiCheck className="w-4 h-4" />
                      FREE
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#C89A7A]/10 to-[#E6C9A8]/10 rounded-xl p-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-playfair font-semibold text-[#5A3E2B]">Total</span>
                      <span className="text-2xl md:text-3xl font-playfair font-bold text-[#C89A7A]">
                        ₹{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-[#C89A7A]/20 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#5A3E2B]/70">
                    <div className="bg-emerald-50 p-1.5 rounded-full">
                      <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5A3E2B]/70">
                    <div className="bg-emerald-50 p-1.5 rounded-full">
                      <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5A3E2B]/70">
                    <div className="bg-emerald-50 p-1.5 rounded-full">
                      <FiCheck className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span>Handcrafted with care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
