'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { GiNecklace } from 'react-icons/gi'
import { FiArrowLeft } from 'react-icons/fi'

export default function NecklacesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-rose-100 to-pink-50">
        <div className="container mx-auto px-4 py-16 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-rose-400 to-rose-600 p-8 rounded-full shadow-2xl animate-pulse">
              <GiNecklace className="w-24 h-24 md:w-32 md:h-32 text-white" />
            </div>
          </div>

          {/* Coming Soon Text */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-rose-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Coming Soon
          </h1>

          {/* Category Name */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 text-rose-700" style={{ fontFamily: "'Playfair Display', serif" }}>
            Necklaces Collection
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-rose-900 mb-12 max-w-2xl mx-auto leading-relaxed">
            We're crafting an exquisite collection of necklaces that will adorn your elegance. 
            Our artisans are working tirelessly to bring you timeless pieces that speak to your soul.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-8 py-4 rounded-full text-lg font-medium hover:from-rose-700 hover:to-rose-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiArrowLeft className="w-5 h-5" />
              Explore Other Collections
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl border-2 border-rose-300"
            >
              Back to Home
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 flex justify-center gap-2">
            <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
