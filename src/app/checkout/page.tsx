'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiMapPin, FiCreditCard, FiShoppingBag, FiCheck, FiTruck, FiEdit2 } from 'react-icons/fi'
import type { RazorpayOptions, RazorpayResponse } from '@/types/razorpay'

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
  const { items, getTotalPrice, clearCart, removeItem, getSelectedItems, getSelectedTotalPrice, deselectAllItems } = useCartStore()
  const user = useAuthStore((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('online')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [scriptLoadAttempts, setScriptLoadAttempts] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  // Use selected items for checkout
  const selectedItems = getSelectedItems()
  const subtotal = getSelectedTotalPrice()
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
    return shippingCosts[selectedShipping]
  }

  const gstRate = 0.03 // 3% GST
  const gstAmount = subtotal * gstRate
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
    const fetchUserData = async () => {
      if (!user) return

      try {
        // Fetch profile
        const profileRes = await fetch('/api/user/profile', { credentials: 'include' })
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setUserProfile(profileData)
          
          // Update form data with profile info
          setFormData(prev => ({
            ...prev,
            customerName: profileData.name || prev.customerName,
            customerEmail: profileData.email || prev.customerEmail,
            customerPhone: profileData.mobile || prev.customerPhone,
          }))
        }

        // Fetch addresses
        const addressesRes = await fetch('/api/user/addresses', { credentials: 'include' })
        if (addressesRes.ok) {
          const addressesData = await addressesRes.json()
          setSavedAddresses(addressesData)
          
          // Auto-select default address or first address
          const defaultAddress = addressesData.find((addr: Address) => addr.isDefault)
          const addressToUse = defaultAddress || addressesData[0]
          
          if (addressToUse) {
            setSelectedAddressId(addressToUse.id)
            setFormData(prev => ({
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
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    if (mounted && user) {
      fetchUserData()
    }
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

  // Load Razorpay script with retry logic
  useEffect(() => {
    const loadRazorpayScript = () => {
      // Check if Razorpay is already loaded
      if ((window as any).Razorpay) {
        setRazorpayLoaded(true)
        console.log('Razorpay already loaded')
        return
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        // Wait a bit and check again
        const checkInterval = setInterval(() => {
          if ((window as any).Razorpay) {
            setRazorpayLoaded(true)
            clearInterval(checkInterval)
          }
        }, 100)
        
        setTimeout(() => clearInterval(checkInterval), 5000) // Stop checking after 5 seconds
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      
      script.onload = () => {
        console.log('Razorpay script loaded successfully')
        setRazorpayLoaded(true)
        setScriptLoadAttempts(0)
      }
      
      script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error)
        setRazorpayLoaded(false)
        
        // Retry up to 3 times
        if (scriptLoadAttempts < 3) {
          console.log(`Retrying... Attempt ${scriptLoadAttempts + 1}`)
          setTimeout(() => {
            setScriptLoadAttempts(prev => prev + 1)
            document.body.removeChild(script)
            loadRazorpayScript()
          }, 1000)
        } else {
          console.error('Failed to load Razorpay after 3 attempts')
          toast.error('Unable to load payment gateway. Please try COD or refresh the page.', { duration: 5000 })
        }
      }
      
      document.body.appendChild(script)
    }

    loadRazorpayScript()
  }, [scriptLoadAttempts])

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

    // Check if this address already exists
    const isExistingAddress = savedAddresses.some(addr => 
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
        console.log('Address saved to account successfully')
      }
    } catch (error) {
      console.error('Error saving address to account:', error)
      // Don't show error to user as this is a background operation
    }
  }

  const validateCartItems = async () => {
    const productIds = selectedItems.map(item => item.id)
    
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
      // Handle Online Payment via Razorpay
      else if (paymentMethod === 'online') {
        // Wait for Razorpay to load if not already loaded
        if (!razorpayLoaded && !(window as any).Razorpay) {
          toast.error('Loading payment gateway. Please wait a moment and try again.')
          setLoading(false)
          return
        }

        // Create Razorpay order
        const razorpayOrderResponse = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'INR',
            receipt: `order_${Date.now()}`,
          }),
        })

        if (!razorpayOrderResponse.ok) {
          throw new Error('Failed to create payment order')
        }

        const razorpayOrder = await razorpayOrderResponse.json()

        // Initialize Razorpay checkout
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Chulbuli Jewels',
          description: 'Order Payment',
          image: '/logo.png',
          order_id: razorpayOrder.orderId,
          handler: async (response: RazorpayResponse) => {
            try {
              // Verify payment
              const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })

              const verifyData = await verifyResponse.json()

              if (verifyData.success) {
                // Create order after successful payment
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
                  paymentMethod: 'online',
                  paymentStatus: 'completed',
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }

                const orderResponse = await fetch('/api/orders', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(orderData),
                })

                if (orderResponse.ok) {
                  const order = await orderResponse.json()
                  
                  // Save address to user account after successful order
                  await saveAddressToAccount()
                  
                  selectedItems.forEach(item => removeItem(item.id))
                  deselectAllItems()
                  toast.success('Payment successful! Order placed.')
                  router.push(`/order-success?orderId=${order.id}&paymentId=${response.razorpay_payment_id}`)
                } else {
                  toast.error('Payment successful but order creation failed. Please contact support.')
                }
              } else {
                toast.error('Payment verification failed')
              }
            } catch (error) {
              console.error('Payment handler error:', error)
              toast.error('Payment processing error')
            } finally {
              setLoading(false)
            }
          },
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail,
            contact: formData.customerPhone,
          },
          theme: {
            color: '#C89A7A',
          },
          modal: {
            ondismiss: () => {
              setLoading(false)
              toast.error('Payment cancelled')
            },
          },
        }

        const razorpayInstance = new (window as any).Razorpay(options)
        
        // Log test card information for development
        if (process.env.NODE_ENV === 'development') {
          console.log('=== RAZORPAY TEST MODE ===')
          console.log('Use these INDIAN test cards:')
          console.log('Card: 5267 3181 8797 5449 (Mastercard)')
          console.log('Card: 4012 8888 8888 1881 (Visa - Domestic)')
          console.log('CVV: Any 3 digits')
          console.log('Expiry: Any future date')
          console.log('OR use UPI: success@razorpay')
          console.log('========================')
          
          toast.success('Test Mode: Use Indian cards only. Check console for test card details.', {
            duration: 6000,
          })
        }
        
        razorpayInstance.open()
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
                              Coming Soon
                            </span>
                          </div>
                          <p className="text-sm text-[#5A3E2B]/60 mt-1">UPI, Card, Netbanking & More via Razorpay</p>
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
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800 flex items-center gap-2">
                      <FiCheck className="w-4 h-4 flex-shrink-0" />
                      <span>Secure payment powered by Razorpay</span>
                    </p>
                  </div>
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
                disabled={loading || (paymentMethod === 'online' && !razorpayLoaded)}
                className="hidden md:flex btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : paymentMethod === 'online' && !razorpayLoaded ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Loading Payment Gateway...
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
                  <div className="flex justify-between text-[#5A3E2B]/70">
                    <span className="font-medium">GST (3%)</span>
                    <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
                  </div>
                  
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
              disabled={loading || (paymentMethod === 'online' && !razorpayLoaded)}
              className="btn-primary btn-mobile-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Placing Order...
                </>
              ) : paymentMethod === 'online' && !razorpayLoaded ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
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
