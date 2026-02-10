'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FiCheckCircle, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'

function OrderSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const paymentId = searchParams.get('paymentId')
  const { getSelectedItems, removeItem, deselectAllItems } = useCartStore()
  
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending')
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)
  const [cartSynced, setCartSynced] = useState(false)
  const MAX_POLLS = 10 // Maximum number of status checks (10 * 3s = 30s)

  // Verify payment status
  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    let attempts = 0

    toast.dismiss()

    const verifyPaymentStatus = async () => {
      if (cancelled) return

      try {
        const response = await fetch(`/api/payment/phonepe/status?orderId=${orderId}`)
        const data = await response.json()

        console.log('Payment status check:', data)

        if (!response.ok) {
          setVerifying(false)
          toast.dismiss()
          toast.error(data?.error || 'Unable to verify payment status. Please check your order in account section.')
          return
        }

        if (data.status === 'completed') {
          setPaymentStatus('completed')
          setTransactionId(data.transactionId)
          setVerified(true)
          setVerifying(false)
          toast.dismiss()
        } else if (data.status === 'failed') {
          setPaymentStatus('failed')
          setVerifying(false)
          toast.dismiss()
          // Redirect to payment failed page
          timer = setTimeout(() => {
            const reason = encodeURIComponent(data?.message || 'Payment failed')
            router.push(`/payment-failed?orderId=${orderId}&reason=${reason}`)
          }, 1500)
        } else if (data.status === 'pending') {
          setPaymentStatus('pending')
          // Continue polling if we haven't reached max polls
          if (attempts < MAX_POLLS) {
            attempts += 1
            setPollCount(attempts)
            timer = setTimeout(verifyPaymentStatus, 3000)
          } else {
            // Max polls reached, show timeout message
            setVerifying(false)
            toast.dismiss()
            toast.error('Payment verification is taking longer than expected. Please check order status in your account.')
          }
        } else {
          setVerifying(false)
          toast.dismiss()
          toast.error('Unexpected payment status. Please check order status in your account.')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setVerifying(false)
        toast.dismiss()
        toast.error('Unable to verify payment status. Please check your order in account section.')
      }
    }

    // Start verification after a brief delay
    timer = setTimeout(verifyPaymentStatus, 800)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [orderId, router])

  // Clear purchased (selected) cart items once payment is confirmed.
  useEffect(() => {
    if (cartSynced || !verified || paymentStatus !== 'completed') {
      return
    }

    const selectedItems = getSelectedItems()
    if (selectedItems.length > 0) {
      selectedItems.forEach((item) => removeItem(item.id))
    }
    deselectAllItems()
    setCartSynced(true)
  }, [cartSynced, verified, paymentStatus, getSelectedItems, removeItem, deselectAllItems])

  return (
    <>
      <main className="min-h-screen pt-20 md:pt-24 px-4 pb-12 flex items-center justify-center bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-2xl w-full text-center">
          <div className="card-luxury p-6 md:p-10 lg:p-12 shadow-luxury-lg">
            
            {/* Loading/Verifying State */}
            {verifying && (
              <>
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="bg-blue-50 p-4 md:p-5 rounded-full">
                    <FiLoader className="w-16 h-16 md:w-20 md:h-20 text-blue-500 animate-spin" />
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold mb-3 md:mb-4 text-[#5A3E2B]">
                  Verifying Payment...
                </h1>

                <p className="text-[#5A3E2B]/60 mb-2 text-sm md:text-base">
                  Please wait while we confirm your payment.
                </p>

                {paymentStatus === 'pending' && (
                  <p className="text-xs md:text-sm text-blue-600 mt-4">
                    Payment is being processed... ({pollCount}/{MAX_POLLS})
                  </p>
                )}
              </>
            )}

            {/* Success State */}
            {!verifying && verified && paymentStatus === 'completed' && (
              <>
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="bg-emerald-50 p-4 md:p-5 rounded-full">
                    <FiCheckCircle className="w-16 h-16 md:w-20 md:h-20 text-emerald-500" />
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold mb-3 md:mb-4 text-[#5A3E2B]">
                  Order Placed Successfully!
                </h1>

                <p className="text-[#5A3E2B]/60 mb-2 text-sm md:text-base">
                  Thank you for your order. We&apos;ve received your order and will process it soon.
                </p>

                {orderId && (
                  <div className="mb-6 md:mb-8 space-y-2">
                    <p className="text-xs md:text-sm text-[#5A3E2B]/50">
                      Order ID: <span className="font-mono font-semibold">{orderId.slice(0, 12)}</span>
                    </p>
                    {(transactionId || paymentId) && (
                      <p className="text-xs md:text-sm text-emerald-600/80">
                        Payment ID: <span className="font-mono font-semibold">{transactionId || paymentId}</span>
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3 md:space-y-4">
                  <Link href="/account?tab=orders" className="btn-primary btn-mobile-full md:w-full inline-block touch-target">
                    View Order Details
                  </Link>
                  <Link
                    href="/products"
                    className="btn-secondary btn-mobile-full md:w-full inline-block touch-target"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-[#C89A7A]/20">
                  <h3 className="font-semibold mb-3 md:mb-4 text-[#5A3E2B] text-sm md:text-base">What happens next?</h3>
                  <div className="space-y-2.5 md:space-y-3 text-left max-w-md mx-auto text-xs md:text-sm text-[#5A3E2B]/70">
                    <div className="flex gap-2 md:gap-3">
                      <span className="font-semibold text-[#C89A7A] flex-shrink-0">1.</span>
                      <p>Order confirmation email will be sent to your email address</p>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                      <span className="font-semibold text-[#C89A7A] flex-shrink-0">2.</span>
                      <p>Your payment is confirmed and secure</p>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                      <span className="font-semibold text-[#C89A7A] flex-shrink-0">3.</span>
                      <p>We&apos;ll pack your order with care</p>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                      <span className="font-semibold text-[#C89A7A] flex-shrink-0">4.</span>
                      <p>Your order will be shipped to your address</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Pending/Timeout State */}
            {!verifying && !verified && paymentStatus === 'pending' && (
              <>
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="bg-amber-50 p-4 md:p-5 rounded-full">
                    <FiLoader className="w-16 h-16 md:w-20 md:h-20 text-amber-500" />
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold mb-3 md:mb-4 text-[#5A3E2B]">
                  Payment Verification Pending
                </h1>

                <p className="text-[#5A3E2B]/60 mb-6 text-sm md:text-base">
                  Your payment is being processed. This may take a few moments.
                </p>

                {orderId && (
                  <div className="mb-6 md:mb-8">
                    <p className="text-xs md:text-sm text-[#5A3E2B]/50">
                      Order ID: <span className="font-mono font-semibold">{orderId.slice(0, 12)}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-3 md:space-y-4">
                  <Link href="/account?tab=orders" className="btn-primary btn-mobile-full md:w-full inline-block touch-target">
                    Check Order Status
                  </Link>
                  <Link
                    href="/products"
                    className="btn-secondary btn-mobile-full md:w-full inline-block touch-target"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-6 md:mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs md:text-sm text-amber-900">
                    <strong>Note:</strong> Payment confirmation is still pending. Your order will be confirmed once payment is verified. Please check your order status in your account after a few minutes.
                  </p>
                </div>
              </>
            )}
            
          </div>
        </div>
      </main>
    </>
  )
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main className="min-h-screen pt-24 px-4 pb-12 flex items-center justify-center">
          <div className="max-w-2xl w-full text-center">
            <div className="card p-12 animate-pulse">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </main>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  )
}
