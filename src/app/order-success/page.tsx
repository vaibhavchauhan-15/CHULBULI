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
      <main className="min-h-screen pt-24 px-4 pb-12 flex items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="card p-12">
            <div className="flex justify-center mb-6">
              <FiCheckCircle className="w-20 h-20 text-green-500" />
            </div>

            <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
              Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mb-2">
            Thank you for your order. We&apos;ve received your order and will process it soon.
          </p>

          {orderId && (
            <p className="text-sm text-gray-500 mb-8">
              Order ID: <span className="font-mono">{orderId.slice(0, 12)}</span>
            </p>
          )}

          <div className="space-y-4">
            <Link href="/dashboard" className="btn-primary w-full inline-block">
              View Order Details
            </Link>
            <Link
              href="/products"
                className="btn-secondary w-full inline-block"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold mb-4">What happens next?</h3>
              <div className="space-y-3 text-left max-w-md mx-auto text-sm text-gray-600">
                <div className="flex gap-3">
                  <span className="font-semibold text-rose-gold">1.</span>
                  <p>Order confirmation email will be sent to your email address</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-rose-gold">2.</span>
                  <p>We&apos;ll pack your order with care</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-rose-gold">3.</span>
                  <p>Your order will be shipped to your address</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-semibold text-rose-gold">4.</span>
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
