'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { FiArrowRight } from 'react-icons/fi'
import { GiDiamondRing, GiNecklace, GiEarrings } from 'react-icons/gi'
import { TbCirclesRelation } from 'react-icons/tb'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true')
      const data = await response.json()
      setFeaturedProducts(data.slice(0, 8))
    } catch (error) {
      // Error fetching featured products
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    {
      name: 'Earrings',
      image: '/categories/earrings.jpg',
      href: '/products?category=earrings',
      icon: GiEarrings,
      color: 'from-amber-50 to-amber-100',
      iconColor: 'text-amber-700',
    },
    {
      name: 'Necklaces',
      image: '/categories/necklaces.jpg',
      href: '/products?category=necklaces',
      icon: GiNecklace,
      color: 'from-rose-50 to-rose-100',
      iconColor: 'text-rose-700',
    },
    {
      name: 'Rings',
      image: '/categories/rings.jpg',
      href: '/products?category=rings',
      icon: GiDiamondRing,
      color: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-700',
    },
    {
      name: 'Bangles',
      image: '/categories/bangles.jpg',
      href: '/products?category=bangles',
      icon: TbCirclesRelation,
      color: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-700',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section - Luxury Pearl Earrings */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/hero_image.webp"
              alt="Luxury Pearl Heart Earrings"
              fill
              className="object-cover object-[77%_center] md:object-center"
              priority
              quality={100}
            />
            {/* Gradient overlay - desktop: left fade, mobile: bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent 
                          md:bg-gradient-to-r md:from-white/85 md:via-white/40 md:to-transparent
                          max-md:bg-gradient-to-t max-md:from-white/95 max-md:via-white/60 max-md:to-transparent" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 md:px-16 lg:px-20 w-full
                        flex items-end md:items-center min-h-screen pb-16 md:pb-0">
            <div className="max-w-2xl w-full text-center md:text-left">
              {/* Tagline */}
              <h1 className="font-playfair font-semibold text-warmbrown leading-[1.15] tracking-wide mb-6 md:mb-7
                            text-[32px] sm:text-[40px] md:text-[52px] lg:text-[60px]">
                Elegance<br />You Can Feel.
              </h1>

              {/* CTA Button */}
              <Link
                href="/products"
                className="btn-primary inline-block text-center"
              >
                Explore Products
              </Link>

              {/* Optional Micro-copy */}
              <p className="mt-6 text-[13px] text-taupe tracking-wide font-light">
                Handcrafted • Timeless • Premium Finish
              </p>
            </div>
          </div>
        </section>

        {/* Categories - Premium & Rich Look */}
        <section className="section-spacing px-8 md:px-16 bg-gradient-to-br from-pearl to-champagne">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-playfair font-light text-center mb-4 text-warmbrown">
              Shop by Category
            </h2>
            <p className="text-center text-taupe text-sm mb-16 font-light tracking-wide">
              Discover our curated collection of timeless jewelry
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group relative"
                  >
                    {/* Card with premium border and shadow */}
                    <div className="relative bg-pearl/80 rounded-3xl border border-softgold/40 shadow-luxury hover:shadow-luxury-lg transition-all duration-500 overflow-hidden hover:border-rosegold/60 hover:-translate-y-3">
                      {/* Gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                      
                      {/* Content */}
                      <div className="relative p-8 md:p-10">
                        {/* Icon container with refined styling */}
                        <div className="aspect-square flex items-center justify-center mb-6 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-pearl to-champagne rounded-full opacity-60 group-hover:scale-110 transition-transform duration-500" />
                          <IconComponent className={`text-6xl md:text-7xl ${category.iconColor} relative z-10 transform group-hover:scale-110 transition-transform duration-500`} />
                        </div>
                        
                        {/* Category name with refined typography */}
                        <div className="text-center">
                          <h3 className="font-playfair font-medium text-lg md:text-xl tracking-wide text-warmbrown mb-2 group-hover:text-rosegold transition-colors duration-500">
                            {category.name}
                          </h3>
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <span className="text-xs text-taupe font-light tracking-wider">Explore</span>
                            <FiArrowRight className="text-sm text-taupe" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Premium accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Products - Premium & Rich Design */}
        <section className="section-spacing px-8 md:px-16 bg-gradient-to-br from-champagne via-pearl to-sand relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-64 h-64 bg-rosegold rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-softgold rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Premium header section */}
            <div className="text-center mb-16">
              <div className="inline-block">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-rosegold mb-6 mx-auto" />
                <h2 className="text-5xl md:text-6xl font-playfair font-light text-warmbrown mb-4 tracking-wide">
                  Featured Collection
                </h2>
                <div className="h-px w-24 bg-gradient-to-r from-rosegold to-transparent mx-auto mb-6" />
              </div>
              <p className="text-taupe text-base font-light tracking-wider max-w-2xl mx-auto">
                Discover our handpicked selection of exquisite jewelry pieces, 
                crafted with precision and elegance
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-8 text-rosegold hover:text-softgold font-medium text-sm tracking-widest transition-all duration-500 group"
              >
                <span>VIEW ALL COLLECTION</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-pearl/80 rounded-3xl shadow-luxury border border-softgold/40">
                    <div className="aspect-square bg-gradient-to-br from-pearl to-champagne"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-champagne rounded w-3/4"></div>
                      <div className="h-4 bg-champagne rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-pearl/50 rounded-3xl backdrop-blur-sm border border-softgold/40">
                <p className="text-taupe font-light text-lg tracking-wide">No featured products available</p>
              </div>
            )}
          </div>
          
          {/* Bottom decorative accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rosegold/50 to-transparent" />
        </section>

        {/* Features - Premium & Rich Design */}
        <section className="section-spacing px-8 md:px-16 bg-gradient-to-br from-pearl via-champagne to-sand relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-1/4 w-64 h-64 bg-rosegold rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-softgold rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Shipping */}
              <div className="group">
                <div className="bg-pearl/80 backdrop-blur-sm rounded-3xl p-8 shadow-luxury hover:shadow-luxury-lg transition-all duration-500 border border-softgold/40 hover:border-rosegold/60 text-center space-y-6 relative overflow-hidden">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-rosegold/20 rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-rosegold/20 rounded-bl-3xl" />
                  
                  {/* Icon Container */}
                  <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-rosegold/10 to-softgold/10 border border-rosegold/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-4xl">🚚</span>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />
                  
                  <div className="space-y-3">
                    <h3 className="font-playfair text-xl tracking-wide text-warmbrown font-medium">Free Shipping</h3>
                    <p className="text-taupe text-sm font-light leading-relaxed">On orders above ₹999</p>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              
              {/* Quality Assured */}
              <div className="group">
                <div className="bg-pearl/80 backdrop-blur-sm rounded-3xl p-8 shadow-luxury hover:shadow-luxury-lg transition-all duration-500 border border-softgold/40 hover:border-rosegold/60 text-center space-y-6 relative overflow-hidden">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-rosegold/20 rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-rosegold/20 rounded-bl-3xl" />
                  
                  {/* Icon Container */}
                  <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-rosegold/10 to-softgold/10 border border-rosegold/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-4xl">✨</span>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />
                  
                  <div className="space-y-3">
                    <h3 className="font-playfair text-xl tracking-wide text-warmbrown font-medium">Quality Assured</h3>
                    <p className="text-taupe text-sm font-light leading-relaxed">Premium materials & craftsmanship</p>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              
              {/* Easy Returns */}
              <div className="group">
                <div className="bg-pearl/80 backdrop-blur-sm rounded-3xl p-8 shadow-luxury hover:shadow-luxury-lg transition-all duration-500 border border-softgold/40 hover:border-rosegold/60 text-center space-y-6 relative overflow-hidden">
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-rosegold/20 rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-rosegold/20 rounded-bl-3xl" />
                  
                  {/* Icon Container */}
                  <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-rosegold/10 to-softgold/10 border border-rosegold/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-4xl">🔄</span>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />
                  
                  <div className="space-y-3">
                    <h3 className="font-playfair text-xl tracking-wide text-warmbrown font-medium">Easy Returns</h3>
                    <p className="text-taupe text-sm font-light leading-relaxed">7-day return policy</p>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
