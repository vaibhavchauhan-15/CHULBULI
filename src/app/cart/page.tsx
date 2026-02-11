'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiCheck, FiTag, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const selectedItems = useCartStore((state) => state.selectedItems)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const toggleItemSelection = useCartStore((state) => state.toggleItemSelection)
  const selectAllItems = useCartStore((state) => state.selectAllItems)
  const deselectAllItems = useCartStore((state) => state.deselectAllItems)
  const user = useAuthStore((state) => state.user)
  const [unavailableItems, setUnavailableItems] = useState<string[]>([])
  const selectedTotalPrice = useMemo(
    () =>
      items
        .filter((item) => selectedItems.includes(item.id))
        .reduce((total, item) => {
          const finalPrice = item.price - (item.price * item.discount) / 100
          return total + finalPrice * item.quantity
        }, 0),
    [items, selectedItems]
  )
  const uniqueProductIds = useMemo(
    () => Array.from(new Set(items.map((item) => item.id))).sort(),
    [items]
  )

  // Auto-select all items on mount if none are selected
  useEffect(() => {
    if (items.length > 0 && selectedItems.length === 0) {
      selectAllItems()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Validate cart items on mount
  useEffect(() => {
    const controller = new AbortController()

    const validateCart = async () => {
      if (uniqueProductIds.length === 0) return

      try {
        const response = await fetch('/api/cart/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({ productIds: uniqueProductIds }),
        })

        if (response.ok) {
          const validation = await response.json()
          
          const allUnavailable = [
            ...validation.unavailableProductIds,
            ...validation.unavailableProducts.map((p: any) => p.id)
          ]
          
          setUnavailableItems(allUnavailable)
          
          if (allUnavailable.length > 0) {
            toast.error(
              `${allUnavailable.length} item${allUnavailable.length > 1 ? 's' : ''} in your cart ${allUnavailable.length > 1 ? 'are' : 'is'} no longer available`,
              { duration: 4000 }
            )
          }
        }
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') {
          // Cart validation error
        }
      }
    }

    validateCart()
    return () => controller.abort()
  }, [uniqueProductIds])

  const handleCheckout = () => {
    if (items.length === 0) return
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to checkout')
      return
    }
    
    // Check if user is logged in
    if (!user) {
      toast.error('Please log in to proceed to checkout')
      // Redirect to login page with return URL
      router.push('/login?redirect=/checkout')
      return
    }
    
    // Remove unavailable items before proceeding
    if (unavailableItems.length > 0) {
      unavailableItems.forEach(id => removeItem(id))
      toast.error('Please remove unavailable items before checkout')
      return
    }
    
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 md:pt-24 px-4 pb-12 bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
          <div className="max-w-7xl mx-auto">
            <div className="card-luxury p-8 md:p-16 text-center shadow-luxury max-w-2xl mx-auto">
              <div className="bg-[#C89A7A]/10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FiShoppingBag className="w-10 h-10 md:w-12 md:h-12 text-[#C89A7A]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-[#5A3E2B] mb-2 md:mb-3">
                Your cart is empty
              </h2>
              <p className="text-[#5A3E2B]/60 mb-6 md:mb-8 text-sm md:text-lg leading-relaxed">
                Discover our exquisite collection of handcrafted jewelry
              </p>
              <button 
                onClick={() => router.push('/products')} 
                className="btn-primary btn-mobile-full inline-flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="w-4 h-4" />
                Explore Collection
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 md:pt-24 px-4 pb-24 md:pb-12 bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-7xl mx-auto">
          {/* Header - Mobile optimized */}
          <div className="mb-4 md:mb-6 lg:mb-10">
            <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold mb-1 md:mb-2 lg:mb-3 text-[#5A3E2B]">
                  Shopping Cart
                </h1>
                <p className="text-xs md:text-base lg:text-lg text-[#5A3E2B]/70 font-light">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                  {selectedItems.length > 0 && (
                    <span className="ml-2 text-[#C89A7A] font-medium">
                      ({selectedItems.length} selected)
                    </span>
                  )}
                </p>
              </div>
              
              {unavailableItems.length > 0 && (
                <button
                  onClick={() => {
                    unavailableItems.forEach(id => removeItem(id))
                    setUnavailableItems([])
                    toast.success('Unavailable items removed')
                  }}
                  className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-3 md:px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 text-xs md:text-sm font-medium touch-target shadow-md active:scale-95"
                >
                  <FiTrash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Remove Unavailable Items</span>
                  <span className="sm:hidden">Remove</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 md:space-y-5">
              {/* Select All Checkbox */}
              {items.length > 1 && (
                <div className="card-luxury p-3 md:p-4 shadow-luxury flex items-center gap-2 md:gap-3">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={selectedItems.length === items.length && items.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        selectAllItems()
                      } else {
                        deselectAllItems()
                      }
                    }}
                    className="w-4 h-4 md:w-5 md:h-5 text-[#C89A7A] bg-white border-2 border-[#C89A7A]/30 rounded focus:ring-2 focus:ring-[#C89A7A]/20 cursor-pointer flex-shrink-0"
                  />
                  <label htmlFor="select-all" className="text-xs md:text-sm font-medium text-[#5A3E2B] cursor-pointer flex-1">
                    Select All Items
                  </label>
                  <span className="text-xs md:text-sm text-[#5A3E2B]/60">
                    {selectedItems.length}/{items.length}
                  </span>
                </div>
              )}

              {items.map((item) => {
                const finalPrice = item.price - (item.price * item.discount) / 100
                const isUnavailable = unavailableItems.includes(item.id)
                
                return (
                  <div 
                    key={item.id} 
                    className={`card-luxury p-3 md:p-5 lg:p-6 shadow-luxury transition-all duration-300 ${
                      isUnavailable 
                        ? 'opacity-60 border-2 border-red-300' 
                        : 'hover:shadow-luxury-lg'
                    }`}
                  >
                    {isUnavailable && (
                      <div className="mb-2 md:mb-3 bg-red-50 border border-red-200 rounded-lg p-2 md:p-3 flex items-center gap-2">
                        <FiAlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                        <p className="text-xs md:text-sm text-red-700 font-medium">
                          This item is no longer available. Please remove it from your cart.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 md:gap-4 lg:gap-5">
                      {/* Selection Checkbox */}
                      <div className="flex items-start pt-1 md:pt-2">
                        <input
                          type="checkbox"
                          id={`select-${item.id}`}
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          disabled={isUnavailable}
                          className="w-4 h-4 md:w-5 md:h-5 text-[#C89A7A] bg-white border-2 border-[#C89A7A]/30 rounded focus:ring-2 focus:ring-[#C89A7A]/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                        />
                      </div>

                      {/* Product Image */}
                      <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-white/50 border border-[#C89A7A]/20">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 md:gap-4 mb-2 md:mb-3">
                          <Link 
                            href={`/products/${item.id}`}
                            className="font-playfair font-semibold text-sm md:text-base lg:text-xl text-[#5A3E2B] leading-tight hover:text-[#C89A7A] transition-colors cursor-pointer line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 md:p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                          <span className="text-lg md:text-xl lg:text-2xl font-playfair font-bold text-[#C89A7A]">
                            ₹{finalPrice.toFixed(2)}
                          </span>
                          {item.discount > 0 && (
                            <>
                              <span className="text-xs md:text-sm text-[#5A3E2B]/40 line-through">
                                ₹{item.price.toFixed(2)}
                              </span>
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex items-center gap-1">
                                <FiTag className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                {item.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* Quantity Controls & Stock */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
                          <div className="flex items-center gap-2 md:gap-4">
                            <span className="text-xs md:text-sm font-medium text-[#5A3E2B]/70">Quantity:</span>
                            <div className="flex items-center bg-white/60 border-2 border-[#C89A7A]/30 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 md:p-2.5 hover:bg-[#C89A7A]/10 transition-colors text-[#C89A7A] disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                              <span className="px-3 md:px-5 font-semibold text-[#5A3E2B] min-w-[2.5rem] md:min-w-[3rem] text-center text-sm md:text-base">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 md:p-2.5 hover:bg-[#C89A7A]/10 transition-colors text-[#C89A7A] disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={item.quantity >= item.stock}
                              >
                                <FiPlus className="w-3 h-3 md:w-4 md:h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Stock Info */}
                          <div className="text-xs md:text-sm text-[#5A3E2B]/60">
                            {item.stock <= 5 ? (
                              <span className="text-amber-600 font-medium">
                                Only {item.stock} left
                              </span>
                            ) : (
                              <span className="text-emerald-600 flex items-center gap-1">
                                <FiCheck className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                In Stock
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Subtotal for this item */}
                        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#C89A7A]/10 flex justify-between items-center">
                          <span className="text-xs md:text-sm font-medium text-[#5A3E2B]/70">Subtotal:</span>
                          <span className="text-base md:text-lg font-playfair font-bold text-[#5A3E2B]">
                            ₹{(finalPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-luxury p-4 md:p-6 lg:p-8 sticky top-24 shadow-luxury-lg">
                <h2 className="text-xl md:text-2xl font-playfair font-semibold mb-4 md:mb-6 text-[#5A3E2B] flex items-center">
                  <span className="w-1 h-5 md:h-6 bg-gradient-to-b from-[#C89A7A] to-[#E6C9A8] rounded-full mr-2 md:mr-3"></span>
                  Order Summary
                </h2>

                <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
                  <div className="flex justify-between text-[#5A3E2B]/70 gap-2">
                    <span className="font-medium text-xs md:text-sm">
                      Subtotal ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected)
                    </span>
                    <span className="font-semibold text-sm md:text-base">₹{selectedTotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-medium text-[#5A3E2B]/70 text-xs md:text-sm">Shipping</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1 text-xs md:text-sm">
                      <FiCheck className="w-3 h-3 md:w-4 md:h-4" />
                      FREE
                    </span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#C89A7A]/10 to-[#E6C9A8]/10 rounded-xl p-3 md:p-4 mt-3 md:mt-4">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-base md:text-lg font-playfair font-semibold text-[#5A3E2B]">Total</span>
                      <span className="text-xl md:text-2xl lg:text-3xl font-playfair font-bold text-[#C89A7A]">
                        ₹{selectedTotalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <button 
                    onClick={handleCheckout} 
                    disabled={selectedItems.length === 0}
                    className="btn-primary w-full py-3 md:py-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    <FiShoppingBag className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => router.push('/products')}
                    className="btn-secondary w-full py-3 md:py-4 text-sm md:text-base"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Benefits */}
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-[#C89A7A]/20 space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[#5A3E2B]/70">
                    <div className="bg-emerald-50 p-1 md:p-1.5 rounded-full flex-shrink-0">
                      <FiCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
                    </div>
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[#5A3E2B]/70">
                    <div className="bg-emerald-50 p-1 md:p-1.5 rounded-full flex-shrink-0">
                      <FiCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
                    </div>
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[#5A3E2B]/70">
                    <div className="bg-emerald-50 p-1 md:p-1.5 rounded-full flex-shrink-0">
                    <FiCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
                    </div>
                    <span>Handcrafted with care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile Sticky Checkout Button - Fixed at bottom */}
        {selectedItems.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t-2 border-softgold/30 shadow-2xl z-40 safe-area-bottom">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#5A3E2B]/60 font-medium">{selectedItems.length} items selected</span>
                <span className="text-lg font-playfair font-bold text-[#C89A7A]">₹{selectedTotalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="btn-primary btn-mobile-full flex items-center justify-center gap-2"
              >
                <FiShoppingBag className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
