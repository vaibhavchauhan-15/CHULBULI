'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiShoppingBag, FiCheck, FiTruck, FiEdit2 } from 'react-icons/fi'

interface Address {
  id: string
  label: string
  fullName: string
  mobile: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface UserProfile {
  id: string
  name: string
  email: string
  mobile?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const selectedItemIds = useCartStore((state) => state.selectedItems)
  const removeItem = useCartStore((state) => state.removeItem)
  const deselectAllItems = useCartStore((state) => state.deselectAllItems)
  const user = useAuthStore((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online')
  const [mounted, setMounted] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  // Use selected items for checkout
  const selectedItems = useMemo(
    () => items.filter((item) => selectedItemIds.includes(item.id)),
    [items, selectedItemIds]
  )
  const subtotal = useMemo(
    () =>
      selectedItems.reduce((total, item) => {
        const finalPrice = item.price - (item.price * item.discount) / 100
        return total + finalPrice * item.quantity
      }, 0),
    [selectedItems]
  )
  const [selectedShipping, setSelectedShipping] = useState<'free' | 'standard' | 'express'>(
    subtotal >= 500 ? 'free' : 'standard'
  )

  const shippingCosts = {
    free: 0,
    standard: 59,
    express: 149,
  }

  const getShippingCost = () => {
    if (subtotal >= 500 && selectedShipping === 'free') return 0
    const baseShippingCost = shippingCosts[selectedShipping]
    // Add 5% extra on shipping charges
    return baseShippingCost * 1.05
  }

  const gstRate = 0.03 // 3% GST
  const productGst = subtotal * gstRate // GST on products
  const shippingGstRate = 0.05 // 5% GST on shipping
  const shippingGst = getShippingCost() * shippingGstRate // GST on shipping
  const gstAmount = productGst + shippingGst // Total GST
  const totalAmount = subtotal + getShippingCost() + gstAmount

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

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch user profile and addresses
  useEffect(() => {
    const controller = new AbortController()

    const fetchUserData = async () => {
      if (!user) return

      try {
        const [profileRes, addressesRes] = await Promise.all([
          fetch('/api/user/profile', {
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
          }),
          fetch('/api/user/addresses', {
            credentials: 'include',
            cache: 'no-store',
            signal: controller.signal,
          }),
        ])

        if (profileRes.ok) {
          const profileData = await profileRes.json()
          if (!controller.signal.aborted) {
            setUserProfile(profileData)
            setFormData((prev) => ({
              ...prev,
              customerName: profileData.name || prev.customerName,
              customerEmail: profileData.email || prev.customerEmail,
              customerPhone: profileData.mobile || prev.customerPhone,
            }))
          }
        }

        if (addressesRes.ok) {
          const addressesData = await addressesRes.json()
          if (!controller.signal.aborted) {
            setSavedAddresses(addressesData)

            // Auto-select default address or first address
            const defaultAddress = addressesData.find((addr: Address) => addr.isDefault)
            const addressToUse = defaultAddress || addressesData[0]

            if (addressToUse) {
              setSelectedAddressId(addressToUse.id)
              setFormData((prev) => ({
                ...prev,
                customerName: addressToUse.fullName,
                customerPhone: addressToUse.mobile,
                addressLine1: addressToUse.addressLine1,
                addressLine2: addressToUse.addressLine2 || '',
                city: addressToUse.city,
                state: addressToUse.state,
                pincode: addressToUse.pincode,
              }))
            }
          }
        }
      } catch (error) {
        if ((error as Error)?.name !== 'AbortError') {
          console.error('Error fetching user data:', error)
        }
      }
    }

    if (mounted && user) {
      fetchUserData()
    }
    return () => controller.abort()
  }, [mounted, user])

  // Redirect to cart if no items selected
  useEffect(() => {
    if (mounted && selectedItems.length === 0) {
      router.push('/cart')
    }
  }, [selectedItems.length, router, mounted])

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (mounted && !user) {
      toast.error('Please log in to proceed to checkout')
      router.push('/login?redirect=/checkout')
    }
  }, [user, router, mounted])

  // Update shipping selection when cart total changes
  useEffect(() => {
    if (subtotal >= 500) {
      setSelectedShipping('free')
    } else if (selectedShipping === 'free') {
      setSelectedShipping('standard')
    }
  }, [subtotal, selectedShipping])

  // Validate PhonePe minimum amount
  useEffect(() => {
    if (paymentMethod === 'online' && totalAmount < 1) {
      toast.error('PhonePe requires minimum ₹1. Please add more items or use Cash on Delivery.', { duration: 4000 })
    }
  }, [totalAmount, paymentMethod])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id)
    setFormData(prev => ({
      ...prev,
      customerName: address.fullName,
      customerPhone: address.mobile,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    }))
    setShowAddressForm(false)
  }

  // Helper function to save address to user account
  const saveAddressToAccount = async () => {
    if (!user) return // Only save if user is logged in
    if (selectedAddressId) return // Existing address already linked to account

    // Check if this address already exists
    const isExistingAddress = savedAddresses.some(addr => 
      addr.fullName === formData.customerName &&
      addr.mobile === formData.customerPhone &&
      addr.addressLine1 === formData.addressLine1 &&
      addr.city === formData.city &&
      addr.state === formData.state &&
      addr.pincode === formData.pincode
    )

    if (isExistingAddress) return // Don't save duplicate address

    try {
      // Update mobile number in profile if it's new
      if (formData.customerPhone && formData.customerPhone !== userProfile?.mobile) {
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            mobile: formData.customerPhone,
          }),
        })
      }

      // Save the new address
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          label: 'Checkout Address',
          fullName: formData.customerName,
          mobile: formData.customerPhone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          isDefault: savedAddresses.length === 0, // Set as default if it's the first address
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data?.address) {
          setSavedAddresses((prev) => [data.address, ...prev])
          setSelectedAddressId(data.address.id)
        }
      }
    } catch (error) {
      console.error('Error saving address to account:', error)
      // Don't show error to user as this is a background operation
    }
  }

  const validateCartItems = async () => {
    const productIds = Array.from(new Set(selectedItems.map((item) => item.id)))
    
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
    
    if (selectedItems.length === 0) {
      toast.error('No items selected for checkout')
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

      // Handle COD payment
      if (paymentMethod === 'cod') {
        const orderData = {
          ...formData,
          userId: user?.id || null,
          items: selectedItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingMethod: selectedShipping,
          shippingCost: getShippingCost(),
          gstAmount: gstAmount,
          totalAmount: totalAmount,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
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
          
          // Save address to user account after successful order
          await saveAddressToAccount()
          
          selectedItems.forEach(item => removeItem(item.id))
          deselectAllItems()
          toast.success('Order placed successfully!')
          router.push(`/order-success?orderId=${order.id}`)
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to place order')
        }
      } 
      // Handle Online Payment (PhonePe)
      else if (paymentMethod === 'online') {
        // Handle PhonePe Payment
        try {
          // PhonePe minimum amount validation (₹1 = 100 paisa)
          if (totalAmount < 1) {
              toast.error(
                `PhonePe requires a minimum payment of ₹1. Your order total is ₹${totalAmount.toFixed(2)}. Please add more items or use Cash on Delivery.`,
                { duration: 6000 }
              )
              setLoading(false)
              return
            }

            const orderData = {
              ...formData,
              userId: user?.id || null,
              items: selectedItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
              shippingMethod: selectedShipping,
              shippingCost: getShippingCost(),
              gstAmount: gstAmount,
              totalAmount: totalAmount,
            }

            // Call PhonePe create payment API
            const phonePeResponse = await fetch('/api/payment/phonepe/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderData),
            })

            if (!phonePeResponse.ok) {
              const error = await phonePeResponse.json()
              
              console.error('PhonePe API Error:', {
                status: phonePeResponse.status,
                error: error,
              });
              
              // Check for minimum amount error
              if (error.code === 'MINIMUM_AMOUNT_ERROR') {
                toast.error(
                  `PhonePe requires minimum ₹${error.minimumAmount}. Your order is ₹${error.currentAmount?.toFixed(2) || totalAmount.toFixed(2)}. Please add more items or use an alternative payment method.`,
                  { duration: 6000 }
                )
                setLoading(false)
                return
              }
              
              // Check if it's a merchant configuration error or service unavailable
              if (error.code === 'MERCHANT_NOT_CONFIGURED' || 
                  error.code === 'SERVICE_UNAVAILABLE' ||
                  error.error?.includes('not properly configured') ||
                  error.error?.includes('unavailable')) {
                console.log('PhonePe not available')
                toast.error(
                  error.error || 'PhonePe is currently unavailable. Please use Cash on Delivery.',
                  { duration: 5000 }
                )
                setLoading(false)
                return
              }
              
              // Show error with suggestion
              const errorMessage = error.error || 'Failed to create payment'
              const suggestion = error.suggestion || 'Please try Cash on Delivery'
              toast.error(`${errorMessage}. ${suggestion}`, { duration: 6000 })
              setLoading(false)
              return
            }

            const phonePeData = await phonePeResponse.json()

            // Save address to user account before payment
            await saveAddressToAccount()

            // Use redirect mode to avoid third-party iframe script warnings and noisy console errors
            toast.dismiss()
            toast.success('Redirecting to PhonePe payment...')
            window.location.href = phonePeData.paymentUrl
            return
          } catch (phonePeError: any) {
            console.error('PhonePe error:', phonePeError)
            toast.error(
              'PhonePe payment gateway is currently unavailable. Please use Cash on Delivery.',
              { duration: 5000 }
            )
            setLoading(false)
            return
          }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to process checkout. Please try again.')
      setLoading(false)
    }
  }

  // Show loading or empty state while redirecting
  if (!mounted || selectedItems.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 md:pt-24 px-4 pb-24 md:pb-12 bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#C89A7A]/20 border-t-[#C89A7A] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#5A3E2B]/70">Loading...</p>
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
          <div className="mb-6 md:mb-10">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold mb-2 md:mb-3 text-[#5A3E2B]">
              Checkout
            </h1>
            <p className="text-sm md:text-lg text-[#5A3E2B]/70 font-light">Complete your order securely</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Checkout Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4 md:space-y-6">
              
              {/* Contact Information */}
              <div className="card-luxury p-4 md:p-6 lg:p-8 shadow-luxury">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="bg-[#C89A7A]/10 p-2 md:p-3 rounded-xl">
                      <FiUser className="w-4 h-4 md:w-5 md:h-5 text-[#C89A7A]" />
                    </div>
                    <h2 className="text-lg md:text-2xl font-playfair font-semibold text-[#5A3E2B]">Contact Information</h2>
                  </div>
                  {userProfile && !showContactForm && (
                    <button
                      type="button"
                      onClick={() => setShowContactForm(true)}
                      className="text-[#C89A7A] hover:text-[#5A3E2B] transition-colors flex items-center gap-2 text-sm"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
                
                {userProfile && !showContactForm ? (
                  <div className="space-y-3 bg-white/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FiUser className="w-4 h-4 text-[#C89A7A] mt-1" />
                      <div>
                        <p className="text-xs text-[#5A3E2B]/60">Full Name</p>
                        <p className="text-sm font-medium text-[#5A3E2B]">{formData.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiMail className="w-4 h-4 text-[#C89A7A] mt-1" />
                      <div>
                        <p className="text-xs text-[#5A3E2B]/60">Email Address</p>
                        <p className="text-sm font-medium text-[#5A3E2B]">{formData.customerEmail}</p>
                      </div>
                    </div>
                    {formData.customerPhone && (
                      <div className="flex items-start gap-3">
                        <FiPhone className="w-4 h-4 text-[#C89A7A] mt-1" />
                        <div>
                          <p className="text-xs text-[#5A3E2B]/60">Phone Number</p>
                          <p className="text-sm font-medium text-[#5A3E2B]">{formData.customerPhone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProfile && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                        <p className="text-xs text-blue-800 flex items-center gap-2">
                          <FiEdit2 className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Modify your contact information below</span>
                        </p>
                      </div>
                    )}

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
                    
                    {userProfile && (
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowContactForm(false)}
                          className="px-4 py-2 bg-[#C89A7A] text-white rounded-lg hover:bg-[#5A3E2B] transition-colors text-sm font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              customerName: userProfile.name,
                              customerEmail: userProfile.email,
                              customerPhone: userProfile.mobile || prev.customerPhone,
                            }))
                            setShowContactForm(false)
                          }}
                          className="px-4 py-2 text-[#5A3E2B] border border-[#C89A7A]/30 rounded-lg hover:bg-[#C89A7A]/10 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="card-luxury p-4 md:p-6 lg:p-8 shadow-luxury">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="bg-[#C89A7A]/10 p-2 md:p-3 rounded-xl">
                      <FiMapPin className="w-4 h-4 md:w-5 md:h-5 text-[#C89A7A]" />
                    </div>
                    <h2 className="text-lg md:text-2xl font-playfair font-semibold text-[#5A3E2B]">Shipping Address</h2>
                  </div>
                  {savedAddresses.length > 0 && !showAddressForm && (
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="text-[#C89A7A] hover:text-[#5A3E2B] transition-colors flex items-center gap-2 text-sm"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Change
                    </button>
                  )}
                </div>

                {savedAddresses.length > 0 && !showAddressForm ? (
                  <div className="space-y-3">
                    {/* Show selected address */}
                    {selectedAddressId && (
                      <div className="bg-white/50 rounded-lg p-4 border-2 border-[#C89A7A]/30">
                        {(() => {
                          const selectedAddr = savedAddresses.find(a => a.id === selectedAddressId)
                          if (!selectedAddr) return null
                          return (
                            <>
                              <div className="flex items-start justify-between mb-2">
                                <p className="font-semibold text-[#5A3E2B]">{selectedAddr.fullName}</p>
                                {selectedAddr.isDefault && (
                                  <span className="text-xs bg-[#C89A7A]/10 text-[#C89A7A] px-2 py-1 rounded">Default</span>
                                )}
                              </div>
                              <p className="text-sm text-[#5A3E2B]/70">{selectedAddr.addressLine1}</p>
                              {selectedAddr.addressLine2 && (
                                <p className="text-sm text-[#5A3E2B]/70">{selectedAddr.addressLine2}</p>
                              )}
                              <p className="text-sm text-[#5A3E2B]/70">
                                {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}
                              </p>
                              <p className="text-sm text-[#5A3E2B]/70 mt-2">
                                <FiPhone className="inline w-3 h-3 mr-1" />
                                {selectedAddr.mobile}
                              </p>
                            </>
                          )
                        })()}
                      </div>
                    )}

                    {/* Show other addresses if available */}
                    {savedAddresses.length > 1 && (
                      <div className="mt-4">
                        <p className="text-sm text-[#5A3E2B]/60 mb-2">Or choose another address:</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {savedAddresses
                            .filter(addr => addr.id !== selectedAddressId)
                            .map(address => (
                              <button
                                key={address.id}
                                type="button"
                                onClick={() => handleAddressSelect(address)}
                                className="w-full text-left bg-white/30 hover:bg-white/60 rounded-lg p-3 border border-[#C89A7A]/20 hover:border-[#C89A7A]/50 transition-all"
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <p className="font-medium text-[#5A3E2B] text-sm">{address.fullName}</p>
                                  {address.isDefault && (
                                    <span className="text-xs bg-[#C89A7A]/10 text-[#C89A7A] px-2 py-0.5 rounded">Default</span>
                                  )}
                                </div>
                                <p className="text-xs text-[#5A3E2B]/60">
                                  {address.addressLine1}, {address.city}, {address.state} - {address.pincode}
                                </p>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedAddresses.length > 0 && showAddressForm && (
                      <div className="mb-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-xs text-blue-800 flex items-center gap-2">
                            <FiEdit2 className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>You can modify the fields below or select a different saved address</span>
                          </p>
                        </div>
                        <p className="text-sm text-[#5A3E2B]/60 mb-2">Select a saved address:</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                          {savedAddresses.map(address => (
                            <button
                              key={address.id}
                              type="button"
                              onClick={() => handleAddressSelect(address)}
                              className="w-full text-left bg-white/30 hover:bg-white/60 rounded-lg p-3 border border-[#C89A7A]/20 hover:border-[#C89A7A]/50 transition-all"
                            >
                              <div className="flex items-start justify-between mb-1">
                                <p className="font-medium text-[#5A3E2B] text-sm">{address.fullName}</p>
                                {address.isDefault && (
                                  <span className="text-xs bg-[#C89A7A]/10 text-[#C89A7A] px-2 py-0.5 rounded">Default</span>
                                )}
                              </div>
                              <p className="text-xs text-[#5A3E2B]/60">
                                {address.addressLine1}, {address.city}, {address.state} - {address.pincode}
                              </p>
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-[#C89A7A]/20 pt-3 mb-3">
                          <p className="text-sm font-medium text-[#5A3E2B]/80">Or modify the address below:</p>
                        </div>
                      </div>
                    )}

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

                    {savedAddresses.length > 0 && (
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-2 bg-[#C89A7A] text-white rounded-lg hover:bg-[#5A3E2B] transition-colors text-sm font-medium"
                        >
                          Use This Address
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0]
                            if (defaultAddr) {
                              handleAddressSelect(defaultAddr)
                            }
                            setShowAddressForm(false)
                          }}
                          className="px-4 py-2 text-[#5A3E2B] border border-[#C89A7A]/30 rounded-lg hover:bg-[#C89A7A]/10 transition-colors text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="card-luxury p-4 md:p-6 lg:p-8 shadow-luxury">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="bg-[#C89A7A]/10 p-2 md:p-3 rounded-xl">
                    <FiCreditCard className="w-4 h-4 md:w-5 md:h-5 text-[#C89A7A]" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-playfair font-semibold text-[#5A3E2B]">Payment Method</h2>
                </div>
                
                <div className="space-y-3">
                  {/* Online Payment Option */}
                  <label className="relative block cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod('online')}
                      className="sr-only"
                    />
                    <div className={`bg-white/60 border-2 rounded-xl p-4 md:p-5 transition-all ${
                      paymentMethod === 'online'
                        ? 'border-[#C89A7A] bg-[#C89A7A]/5 shadow-md'
                        : 'border-[#C89A7A]/20 hover:border-[#C89A7A]/40'
                    }`}>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                          paymentMethod === 'online'
                            ? 'border-[#C89A7A] bg-[#C89A7A]'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {paymentMethod === 'online' && (
                            <FiCheck className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-[#5A3E2B] text-lg">Pay Online</p>
                            <span className="px-2 py-0.5 text-xs font-medium text-[#C89A7A] bg-[#C89A7A]/10 border border-[#C89A7A]/30 rounded-full">
                              Testing
                            </span>
                          </div>
                          <p className="text-sm text-[#5A3E2B]/60 mt-1">UPI, Card, Netbanking via PhonePe</p>
                        </div>
                        <FiCreditCard className="w-6 h-6 text-[#C89A7A]" />
                      </div>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label className="relative block cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod('cod')}
                      className="sr-only"
                    />
                    <div className={`bg-white/60 border-2 rounded-xl p-4 md:p-5 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#C89A7A] bg-[#C89A7A]/5 shadow-md'
                        : 'border-[#C89A7A]/20 hover:border-[#C89A7A]/40'
                    }`}>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                          paymentMethod === 'cod'
                            ? 'border-[#C89A7A] bg-[#C89A7A]'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {paymentMethod === 'cod' && (
                            <FiCheck className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#5A3E2B] text-lg">Cash on Delivery (COD)</p>
                          <p className="text-sm text-[#5A3E2B]/60 mt-1">Pay when you receive your order</p>
                        </div>
                        <FiTruck className="w-6 h-6 text-[#C89A7A]" />
                      </div>
                    </div>
                  </label>
                </div>
                
                {/* Payment security notice */}
                {paymentMethod === 'online' && (
                  <>
                    {/* Minimum amount warning for PhonePe */}
                    {totalAmount < 1 && (
                      <div className="mt-4 bg-amber-50 border border-amber-300 rounded-lg p-4">
                        <p className="text-sm text-amber-800 font-medium mb-1">Minimum Payment Amount</p>
                        <p className="text-xs text-amber-700">
                          PhonePe requires a minimum payment of ₹1. Your order total is ₹{totalAmount.toFixed(2)}.
                          {' '}Please add ₹{(1 - totalAmount).toFixed(2)} more or select Cash on Delivery.
                        </p>
                      </div>
                    )}

                    {/* Security notice */}
                    {totalAmount >= 1 && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800 flex items-center gap-2">
                          <FiCheck className="w-4 h-4 flex-shrink-0" />
                          <span>Secure payment powered by PhonePe</span>
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Shipping Options */}
              <div className="card-luxury p-4 md:p-6 lg:p-8 shadow-luxury">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className="bg-[#C89A7A]/10 p-2 md:p-3 rounded-xl">
                    <FiTruck className="w-4 h-4 md:w-5 md:h-5 text-[#C89A7A]" />
                  </div>
                  <h2 className="text-lg md:text-2xl font-playfair font-semibold text-[#5A3E2B]">Shipping Method</h2>
                </div>
                
                <div className="space-y-4">
                  {/* FREE Shipping Notice */}
                  {subtotal >= 500 && (
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-xl p-3 md:p-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="bg-emerald-500 p-1.5 md:p-2 rounded-full flex-shrink-0">
                          <FiCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-800 text-sm md:text-base">🎉 FREE Shipping Unlocked!</p>
                          <p className="text-xs md:text-sm text-emerald-700">Your order qualifies for free shipping</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipping Options */}
                  <div className="space-y-3">
                    {/* FREE Shipping Option */}
                    <label 
                      className={`relative block cursor-pointer touch-target ${
                        subtotal < 500 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value="free"
                        checked={selectedShipping === 'free'}
                        onChange={(e) => setSelectedShipping('free')}
                        disabled={subtotal < 500}
                        className="sr-only"
                      />
                      <div className={`bg-white/60 border-2 rounded-xl p-3.5 md:p-4 transition-all duration-200 active:scale-[0.99] ${
                        selectedShipping === 'free' && subtotal >= 500
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                          : subtotal >= 500
                          ? 'border-[#C89A7A]/20 hover:border-[#C89A7A]/40'
                          : 'border-gray-300'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                            selectedShipping === 'free' && subtotal >= 500
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {selectedShipping === 'free' && subtotal >= 500 && (
                              <FiCheck className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-[#5A3E2B]">FREE Shipping</p>
                            <p className="text-sm text-[#5A3E2B]/60">On all orders above ₹500 • 3-7 business days</p>
                          </div>
                          <span className={`font-bold text-lg ${
                            selectedShipping === 'free' && subtotal >= 500
                              ? 'text-emerald-600'
                              : 'text-[#5A3E2B]/40'
                          }`}>FREE</span>
                        </div>
                        {subtotal < 500 && (
                          <p className="text-xs text-red-600 mt-2 ml-9">
                            Add ₹{(500 - subtotal).toFixed(2)} more to unlock free shipping
                          </p>
                        )}
                      </div>
                    </label>

                    {/* Standard Shipping Option */}
                    <label className="relative block cursor-pointer touch-target">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={selectedShipping === 'standard'}
                        onChange={(e) => setSelectedShipping('standard')}
                        className="sr-only"
                      />
                      <div className={`bg-white/60 border-2 rounded-xl p-3.5 md:p-4 transition-all duration-200 active:scale-[0.99] ${
                        selectedShipping === 'standard'
                          ? 'border-[#C89A7A] bg-[#C89A7A]/5 shadow-md'
                          : 'border-[#C89A7A]/20 hover:border-[#C89A7A]/40'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                            selectedShipping === 'standard'
                              ? 'border-[#C89A7A] bg-[#C89A7A]'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {selectedShipping === 'standard' && (
                              <FiCheck className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-[#5A3E2B]">Standard Shipping</p>
                            <p className="text-sm text-[#5A3E2B]/60">5-7 business days</p>
                          </div>
                          <span className="font-bold text-lg text-[#C89A7A]">₹59</span>
                        </div>
                      </div>
                    </label>

                    {/* Express Shipping Option */}
                    <label className="relative block cursor-pointer touch-target">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={selectedShipping === 'express'}
                        onChange={(e) => setSelectedShipping('express')}
                        className="sr-only"
                      />
                      <div className={`bg-white/60 border-2 rounded-xl p-3.5 md:p-4 transition-all duration-200 active:scale-[0.99] ${
                        selectedShipping === 'express'
                          ? 'border-[#C89A7A] bg-[#C89A7A]/5 shadow-md'
                          : 'border-[#C89A7A]/20 hover:border-[#C89A7A]/40'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${
                            selectedShipping === 'express'
                              ? 'border-[#C89A7A] bg-[#C89A7A]'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {selectedShipping === 'express' && (
                              <FiCheck className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-[#5A3E2B]">Express Shipping</p>
                            <p className="text-sm text-[#5A3E2B]/60">2-3 business days in metro cities</p>
                          </div>
                          <span className="font-bold text-lg text-[#C89A7A]">₹149</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Note */}
                  <div className="bg-[#C89A7A]/5 border border-[#C89A7A]/20 rounded-lg p-4 mt-4">
                    <p className="text-xs text-[#5A3E2B]/70 italic leading-relaxed">
                      💡 Shipping charges are calculated based on your location and order value. Delivery times may vary.
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Order Button - Desktop only */}
              <button
                type="submit"
                disabled={loading}
                className="hidden md:flex btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all items-center justify-center gap-3 group"
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
              <div className="card-luxury p-4 md:p-6 lg:p-8 lg:sticky lg:top-24 shadow-luxury-lg">
                <h2 className="text-lg md:text-2xl font-playfair font-semibold mb-4 md:mb-6 text-[#5A3E2B] flex items-center">
                  <span className="w-1 h-5 md:h-6 bg-gradient-to-b from-[#C89A7A] to-[#E6C9A8] rounded-full mr-2 md:mr-3"></span>
                  Order Summary
                </h2>

                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  {selectedItems.map((item) => {
                    const finalPrice = item.price - (item.price * item.discount) / 100
                    return (
                      <div key={item.id} className="bg-white/50 rounded-lg p-3 md:p-4 border border-[#C89A7A]/10">
                        <div className="flex justify-between items-start gap-2 md:gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#5A3E2B] mb-1 text-sm md:text-base truncate">{item.name}</p>
                            <p className="text-xs md:text-sm text-[#5A3E2B]/60">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-[#C89A7A] whitespace-nowrap text-sm md:text-base">
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
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#5A3E2B]/60 text-sm pl-4">
                    <span className="font-medium">Product GST (3%)</span>
                    <span className="font-semibold">₹{productGst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#5A3E2B]/70">Shipping</span>
                    {getShippingCost() === 0 ? (
                      <span className="font-semibold text-emerald-600 flex items-center gap-1">
                        <FiCheck className="w-4 h-4" />
                        FREE
                      </span>
                    ) : (
                      <span className="font-semibold text-[#C89A7A]">₹{getShippingCost().toFixed(2)}</span>
                    )}
                  </div>
                  {getShippingCost() > 0 && (
                    <div className="flex justify-between text-[#5A3E2B]/60 text-sm pl-4">
                      <span className="font-medium">Shipping GST (5%)</span>
                      <span className="font-semibold">₹{shippingGst.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-r from-[#C89A7A]/10 to-[#E6C9A8]/10 rounded-xl p-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-playfair font-semibold text-[#5A3E2B]">Total</span>
                      <span className="text-2xl md:text-3xl font-playfair font-bold text-[#C89A7A]">
                        ₹{totalAmount.toFixed(2)}
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

        {/* Mobile Sticky Place Order Button */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t-2 border-softgold/30 shadow-2xl z-40 safe-area-bottom">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#5A3E2B]/60 font-medium">Total Amount</span>
              <span className="text-lg font-playfair font-bold text-[#C89A7A]">₹{totalAmount.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary btn-mobile-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Placing Order...
                </>
              ) : (
                <>
                  <FiShoppingBag className="w-5 h-5" />
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}




