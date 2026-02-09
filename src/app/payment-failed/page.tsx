'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FiXCircle, FiRefreshCw } from 'react-icons/fi'

function PaymentFailedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const reason = searchParams.get('reason')

  useEffect(() => {
    if (!orderId) {
      router.push('/')
    }
  }, [orderId, router])

  const handleRetryPayment = () => {
    // Redirect to checkout to retry
    router.push('/checkout')
  }

  return (
    <>
      <main className="min-h-screen pt-20 md:pt-24 px-4 pb-12 flex items-center justify-center bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-2xl w-full text-center">
          <div className="card-luxury p-6 md:p-10 lg:p-12 shadow-luxury-lg">
            <div className="flex justify-center mb-4 md:mb-6">
              <div className="bg-red-50 p-4 md:p-5 rounded-full">
                <FiXCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold mb-3 md:mb-4 text-[#5A3E2B]">
              Payment Failed
            </h1>

            <p className="text-[#5A3E2B]/60 mb-2 text-sm md:text-base">
              We couldn&apos;t process your payment. Don&apos;t worry, no amount has been deducted.
            </p>

            {orderId && (
              <div className="mb-6 md:mb-8 space-y-2">
                <p className="text-xs md:text-sm text-[#5A3E2B]/50">
                  Order ID: <span className="font-mono font-semibold">{orderId.slice(0, 12)}</span>
                </p>
                {reason && (
                  <p className="text-xs md:text-sm text-red-600/80">
                    Reason: <span className="font-semibold">{reason}</span>
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3 md:space-y-4">
              <button
                onClick={handleRetryPayment}
                className="btn-primary btn-mobile-full md:w-full inline-flex items-center justify-center gap-2 touch-target"
              >
                <FiRefreshCw className="w-4 h-4" />
                Retry Payment
              </button>
              <Link
                href="/cart"
                className="btn-secondary btn-mobile-full md:w-full inline-block touch-target"
              >
                Go to Cart
              </Link>
            </div>

            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-[#C89A7A]/20">
              <h3 className="font-semibold mb-3 md:mb-4 text-[#5A3E2B] text-sm md:text-base">Common reasons for payment failure:</h3>
              <div className="space-y-2.5 md:space-y-3 text-left max-w-md mx-auto text-xs md:text-sm text-[#5A3E2B]/70">
                <div className="flex gap-2 md:gap-3">
                  <span className="text-[#C89A7A] flex-shrink-0">•</span>
                  <p>Insufficient balance in your account</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <span className="text-[#C89A7A] flex-shrink-0">•</span>
                  <p>Incorrect payment details entered</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <span className="text-[#C89A7A] flex-shrink-0">•</span>
                  <p>Payment session expired or timeout</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <span className="text-[#C89A7A] flex-shrink-0">•</span>
                  <p>Bank server issues or network problems</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <span className="text-[#C89A7A] flex-shrink-0">•</span>
                  <p>Payment cancelled by you</p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs md:text-sm text-amber-900">
                <strong>Note:</strong> If amount was deducted from your account, it will be automatically refunded within 5-7 business days. For assistance, please contact our support.
              </p>
            </div>

            <div className="mt-6">
              <Link href="/contact" className="text-sm text-[#C89A7A] hover:text-[#A67B5B] underline">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function PaymentFailedPage() {
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
        <PaymentFailedContent />
      </Suspense>
      <Footer />
    </>
  )
}
