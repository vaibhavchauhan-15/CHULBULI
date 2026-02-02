'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FiCheckCircle } from 'react-icons/fi'

function OrderSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (!orderId) {
      router.push('/')
    }
  }, [orderId, router])

  return (
    <>
      <main className="min-h-screen pt-20 md:pt-24 px-4 pb-12 flex items-center justify-center bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-2xl w-full text-center">
          <div className="card-luxury p-6 md:p-10 lg:p-12 shadow-luxury-lg">
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
              <p className="text-xs md:text-sm text-[#5A3E2B]/50 mb-6 md:mb-8">
                Order ID: <span className="font-mono font-semibold">{orderId.slice(0, 12)}</span>
              </p>
            )}

            <div className="space-y-3 md:space-y-4">
              <Link href="/dashboard" className="btn-primary btn-mobile-full md:w-full inline-block touch-target">
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
                  <p>We&apos;ll pack your order with care</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <span className="font-semibold text-[#C89A7A] flex-shrink-0">3.</span>
                  <p>Your order will be shipped to your address</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <span className="font-semibold text-[#C89A7A] flex-shrink-0">4.</span>
                  <p>Pay cash on delivery when you receive your order</p>
                </div>
              </div>
            </div>
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
