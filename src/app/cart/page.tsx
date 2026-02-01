'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiCheck, FiTag, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotalPrice, 
    clearCart,
    selectedItems,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    getSelectedTotalPrice,
    getSelectedItems,
    isItemSelected
  } = useCartStore()
  const [unavailableItems, setUnavailableItems] = useState<string[]>([])
  const [validating, setValidating] = useState(false)

  // Auto-select all items on mount if none are selected
  useEffect(() => {
    if (items.length > 0 && selectedItems.length === 0) {
      selectAllItems()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Validate cart items on mount
  useEffect(() => {
    const validateCart = async () => {
      if (items.length === 0) return
      
      setValidating(true)
      try {
        const productIds = items.map(item => item.id)
        
        const response = await fetch('/api/cart/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productIds }),
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
        // Cart validation error
      } finally {
        setValidating(false)
      }
    }

    validateCart()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])

  const handleCheckout = () => {
    if (items.length === 0) return
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to checkout')
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
        <main className="min-h-screen pt-24 px-4 pb-12 bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
          <div className="max-w-7xl mx-auto">
            <div className="card-luxury p-16 text-center shadow-luxury max-w-2xl mx-auto">
              <div className="bg-[#C89A7A]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="w-12 h-12 text-[#C89A7A]" />
              </div>
              <h2 className="text-3xl font-playfair font-bold text-[#5A3E2B] mb-3">
                Your cart is empty
              </h2>
              <p className="text-[#5A3E2B]/60 mb-8 text-lg leading-relaxed">
                Discover our exquisite collection of handcrafted jewelry
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
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12 bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-3 text-[#5A3E2B]">
                  Shopping Cart
                </h1>
                <p className="text-lg text-[#5A3E2B]/70 font-light">
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
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Remove Unavailable Items
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-5">
              {/* Select All Checkbox */}
              {items.length > 1 && (
                <div className="card-luxury p-4 shadow-luxury flex items-center gap-3">
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
                    className="w-5 h-5 text-[#C89A7A] bg-white border-2 border-[#C89A7A]/30 rounded focus:ring-2 focus:ring-[#C89A7A]/20 cursor-pointer"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-[#5A3E2B] cursor-pointer flex-1">
                    Select All Items
                  </label>
                  <span className="text-sm text-[#5A3E2B]/60">
                    {selectedItems.length} of {items.length} selected
                  </span>
                </div>
              )}

              {items.map((item) => {
                const finalPrice = item.price - (item.price * item.discount) / 100
                const isUnavailable = unavailableItems.includes(item.id)
                
                return (
                  <div 
                    key={item.id} 
                    className={`card-luxury p-6 shadow-luxury transition-all duration-300 ${
                      isUnavailable 
                        ? 'opacity-60 border-2 border-red-300' 
                        : 'hover:shadow-luxury-lg'
                    }`}
                  >
                    {isUnavailable && (
                      <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                        <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-sm text-red-700 font-medium">
                          This item is no longer available. Please remove it from your cart.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-5">
                      {/* Selection Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          id={`select-${item.id}`}
                          checked={isItemSelected(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          disabled={isUnavailable}
                          className="w-5 h-5 text-[#C89A7A] bg-white border-2 border-[#C89A7A]/30 rounded focus:ring-2 focus:ring-[#C89A7A]/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* Product Image */}
                      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white/50 border border-[#C89A7A]/20">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <Link 
                            href={`/products/${item.id}`}
                            className="font-playfair font-semibold text-xl text-[#5A3E2B] leading-tight hover:text-[#C89A7A] transition-colors cursor-pointer"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-playfair font-bold text-[#C89A7A]">
                            ₹{finalPrice.toFixed(2)}
                          </span>
                          {item.discount > 0 && (
                            <>
                              <span className="text-sm text-[#5A3E2B]/40 line-through">
                                ₹{item.price.toFixed(2)}
                              </span>
                              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                <FiTag className="w-3 h-3" />
                                {item.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* Quantity Controls & Stock */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-[#5A3E2B]/70">Quantity:</span>
                            <div className="flex items-center bg-white/60 border-2 border-[#C89A7A]/30 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2.5 hover:bg-[#C89A7A]/10 transition-colors text-[#C89A7A] disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <span className="px-5 font-semibold text-[#5A3E2B] min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2.5 hover:bg-[#C89A7A]/10 transition-colors text-[#C89A7A] disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={item.quantity >= item.stock}
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Stock Info */}
                          <div className="text-sm text-[#5A3E2B]/60">
                            {item.stock <= 5 ? (
                              <span className="text-amber-600 font-medium">
                                Only {item.stock} left
                              </span>
                            ) : (
                              <span className="text-emerald-600 flex items-center gap-1">
                                <FiCheck className="w-3.5 h-3.5" />
                                In Stock
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Subtotal for this item */}
                        <div className="mt-4 pt-4 border-t border-[#C89A7A]/10 flex justify-between items-center">
                          <span className="text-sm font-medium text-[#5A3E2B]/70">Subtotal:</span>
                          <span className="text-lg font-playfair font-bold text-[#5A3E2B]">
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
              <div className="card-luxury p-6 md:p-8 sticky top-24 shadow-luxury-lg">
                <h2 className="text-2xl font-playfair font-semibold mb-6 text-[#5A3E2B] flex items-center">
                  <span className="w-1 h-6 bg-gradient-to-b from-[#C89A7A] to-[#E6C9A8] rounded-full mr-3"></span>
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#5A3E2B]/70">
                    <span className="font-medium">
                      Subtotal ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected)
                    </span>
                    <span className="font-semibold">₹{getSelectedTotalPrice().toFixed(2)}</span>
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
                        ₹{getSelectedTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout} 
                    disabled={selectedItems.length === 0}
                    className="btn-primary w-full py-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => router.push('/products')}
                    className="btn-secondary w-full py-4"
                  >
                    Continue Shopping
                  </button>
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
