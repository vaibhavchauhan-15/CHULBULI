'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import { FiArrowRight } from 'react-icons/fi'
import { GiDiamondRing, GiNecklace, GiEarrings } from 'react-icons/gi'
import { TbCirclesRelation } from 'react-icons/tb'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Filter products based on search query
  const filteredProducts = featuredProducts.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      href: '/products/necklaces',
      icon: GiNecklace,
      color: 'from-rose-50 to-rose-100',
      iconColor: 'text-rose-700',
    },
    {
      name: 'Rings',
      image: '/categories/rings.jpg',
      href: '/products/rings',
      icon: GiDiamondRing,
      color: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-700',
    },
    {
      name: 'Bangles',
      image: '/categories/bangles.jpg',
      href: '/products/bangles',
      icon: TbCirclesRelation,
      color: 'from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-700',
    },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section - Mobile-optimized */}
         <section className="relative h-[90vh] md:min-h-screen flex items-end md:items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            {/* Mobile Hero Image */}
            <Image
              src="/hero_mobile.png"
              alt="Luxury Pearl Heart Earrings"
              fill
              className="object-contain object-top md:hidden"
              priority
              quality={100}
            />
            {/* Desktop Hero Image */}
            <Image
              src="/hero_image.webp"
              alt="Luxury Pearl Heart Earrings"
              fill
              className="object-cover object-center hidden md:block"
              priority
              quality={100}
            />
            {/* Gradient overlay - mobile: bottom fade, desktop: left fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent
                          md:bg-gradient-to-r md:from-white/85 md:via-white/40 md:to-transparent" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-16 lg:px-20 w-full">
            <div className="max-w-2xl w-full text-center md:text-left pb-16 md:pb-0">
              {/* Tagline - Mobile optimized */}
              <h1 className="font-playfair font-semibold text-warmbrown leading-tight tracking-wide mb-4 md:mb-6 lg:mb-7
                            text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Elegance<br />You Can Feel.
              </h1>

              {/* CTA Button - Full-width on mobile */}
              <Link
                href="/products"
                className="btn-primary btn-mobile-full text-base px-8 py-3.5"
              >
                Explore Products
              </Link>

              {/* Micro-copy */}
              <p className="mt-4 md:mt-6 text-xs md:text-sm text-taupe tracking-wide font-light">
                Handcrafted • Timeless • Premium Finish
              </p>
            </div>
          </div>
        </section>

        {/* Categories - Mobile-optimized 2-column grid */}
        <section className="py-12 md:py-20 lg:py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-pearl to-champagne">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-light text-center mb-2 md:mb-4 text-warmbrown">
              Shop by Category
            </h2>
            <p className="text-center text-taupe text-xs md:text-sm mb-6 md:mb-12 lg:mb-16 font-light tracking-wide">
              Discover our curated collection of timeless jewelry
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
              {categories.map((category) => {
                const IconComponent = category.icon
                const isComingSoon = ['Necklaces', 'Rings', 'Bangles'].includes(category.name)
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group relative"
                  >
                    {/* Card with mobile-optimized design */}
                    <div className="relative bg-pearl/80 rounded-2xl md:rounded-3xl border border-softgold/40 shadow-md md:shadow-luxury hover:shadow-xl md:hover:shadow-luxury-lg transition-all duration-300 md:duration-500 overflow-hidden hover:border-rosegold/60 active:scale-95 md:hover:-translate-y-3">
                      {/* Coming Soon Badge */}
                      {isComingSoon && (
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-20">
                          <span className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] md:text-xs font-semibold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                            Coming Soon
                          </span>
                        </div>
                      )}
                      
                      {/* Gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-40 transition-opacity duration-300 md:duration-500`} />
                      
                      {/* Content - Tighter spacing on mobile */}
                      <div className="relative p-3 md:p-6 lg:p-8">
                        {/* Icon container - Smaller on mobile */}
                        <div className="aspect-square flex items-center justify-center mb-2 md:mb-4 lg:mb-6 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-pearl to-champagne rounded-full opacity-60 group-hover:scale-110 transition-transform duration-300 md:duration-500" />
                          <IconComponent className={`text-3xl md:text-5xl lg:text-6xl xl:text-7xl ${category.iconColor} relative z-10 transform group-hover:scale-110 transition-transform duration-300 md:duration-500`} />
                        </div>
                        
                        {/* Category name - Smaller on mobile */}
                        <div className="text-center">
                          <h3 className="font-playfair font-medium text-xs md:text-base lg:text-lg xl:text-xl tracking-wide text-warmbrown mb-1 group-hover:text-rosegold transition-colors duration-300 md:duration-500">
                            {category.name}
                          </h3>
                          <div className="hidden md:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 md:duration-500">
                            <span className="text-xs text-taupe font-light tracking-wider">Explore</span>
                            <FiArrowRight className="text-sm text-taupe" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Premium accent line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:duration-500" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Products - Mobile-optimized */}
        <section className="py-12 md:py-20 lg:py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-champagne via-pearl to-sand relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-64 h-64 bg-rosegold rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-softgold rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Mobile-optimized header */}
            <div className="text-center mb-6 md:mb-12 lg:mb-16">
              <div className="inline-block">
                <div className="h-px w-12 md:w-16 bg-gradient-to-r from-transparent to-rosegold mb-3 md:mb-6 mx-auto" />
                <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair font-light text-warmbrown mb-2 md:mb-4 tracking-wide">
                  Featured Collection
                </h2>
                <div className="h-px w-16 md:w-24 bg-gradient-to-r from-rosegold to-transparent mx-auto mb-3 md:mb-6" />
              </div>
              <p className="text-taupe text-xs md:text-sm lg:text-base font-light tracking-wider max-w-2xl mx-auto px-4">
                Discover our handpicked selection of exquisite jewelry pieces, 
                crafted with precision and elegance
              </p>
              
              {/* Search Bar - Mobile optimized */}
              <div className="max-w-xl mx-auto mt-4 md:mt-8">
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search featured products..."
                  autoFocus={false}
                />
              </div>
              
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-4 md:mt-8 text-rosegold hover:text-softgold font-medium text-xs md:text-sm tracking-widest transition-all duration-300 md:duration-500 group touch-target"
              >
                <span>VIEW ALL COLLECTION</span>
                <svg className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-2 transition-transform duration-300 md:duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-pearl/80 rounded-2xl md:rounded-3xl shadow-md md:shadow-luxury border border-softgold/40">
                    <div className="aspect-[3/4] md:aspect-square bg-gradient-to-br from-pearl to-champagne"></div>
                    <div className="p-3 md:p-6 space-y-2 md:space-y-3">
                      <div className="h-3 md:h-4 bg-champagne rounded w-3/4"></div>
                      <div className="h-3 md:h-4 bg-champagne rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8 md:py-16 bg-pearl/50 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-softgold/40">
                <p className="text-taupe font-light text-sm md:text-base lg:text-lg tracking-wide mb-2">No products found matching &quot;{searchQuery}&quot;</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-rosegold hover:text-softgold font-medium text-xs md:text-sm tracking-wider transition-colors duration-300 touch-target"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="text-center py-8 md:py-16 bg-pearl/50 rounded-2xl md:rounded-3xl backdrop-blur-sm border border-softgold/40">
                <p className="text-taupe font-light text-sm md:text-base lg:text-lg tracking-wide">No featured products available</p>
              </div>
            )}
          </div>
          
          {/* Bottom decorative accent */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rosegold/50 to-transparent" />
        </section>

        {/* Features - Mobile-optimized */}
        <section className="py-12 md:py-20 lg:py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-pearl via-champagne to-sand relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-1/4 w-64 h-64 bg-rosegold rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-softgold rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {/* Free Shipping - Mobile optimized */}
              <div className="group">
                <div className="bg-pearl/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-md md:shadow-luxury hover:shadow-xl md:hover:shadow-luxury-lg transition-all duration-300 md:duration-500 border border-softgold/40 hover:border-rosegold/60 text-center space-y-3 md:space-y-5 lg:space-y-6 relative overflow-hidden active:scale-95 md:active:scale-100">
                  {/* Decorative corner accents - Smaller on mobile */}
                  <div className="absolute top-0 right-0 w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 border-t-2 border-r-2 border-rosegold/20 rounded-tr-2xl md:rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 border-b-2 border-l-2 border-rosegold/20 rounded-bl-2xl md:rounded-bl-3xl" />
                  
                  {/* Icon Container - Smaller on mobile */}
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-rosegold/10 to-softgold/10 border border-rosegold/30 group-hover:scale-110 transition-transform duration-300 md:duration-500">
                    <span className="text-xl md:text-3xl lg:text-4xl">🚚</span>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />
                  
                  <div className="space-y-1.5 md:space-y-3">
                    <h3 className="font-playfair text-sm md:text-lg lg:text-xl tracking-wide text-warmbrown font-medium">Free Shipping</h3>
                    <p className="text-taupe text-xs md:text-sm font-light leading-relaxed">On orders above ₹999</p>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:duration-500" />
                </div>
              </div>
              
              {/* Quality Assured - Mobile optimized */}
              <div className="group">
                <div className="bg-pearl/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-md md:shadow-luxury hover:shadow-xl md:hover:shadow-luxury-lg transition-all duration-300 md:duration-500 border border-softgold/40 hover:border-rosegold/60 text-center space-y-3 md:space-y-5 lg:space-y-6 relative overflow-hidden active:scale-95 md:active:scale-100">
                  <div className="absolute top-0 right-0 w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 border-t-2 border-r-2 border-rosegold/20 rounded-tr-2xl md:rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 border-b-2 border-l-2 border-rosegold/20 rounded-bl-2xl md:rounded-bl-3xl" />
                  
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-rosegold/10 to-softgold/10 border border-rosegold/30 group-hover:scale-110 transition-transform duration-300 md:duration-500">
                    <span className="text-xl md:text-3xl lg:text-4xl">✨</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />
                  
                  <div className="space-y-1.5 md:space-y-3">
                    <h3 className="font-playfair text-sm md:text-lg lg:text-xl tracking-wide text-warmbrown font-medium">Quality Assured</h3>
                    <p className="text-taupe text-xs md:text-sm font-light leading-relaxed">Premium materials & craftsmanship</p>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:duration-500" />
                </div>
              </div>
              
              {/* Easy Returns - Mobile optimized */}
              <div className="group">
                <div className="bg-pearl/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-md md:shadow-luxury hover:shadow-xl md:hover:shadow-luxury-lg transition-all duration-300 md:duration-500 border border-softgold/40 hover:border-rosegold/60 text-center space-y-3 md:space-y-5 lg:space-y-6 relative overflow-hidden active:scale-95 md:active:scale-100">
                  <div className="absolute top-0 right-0 w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 border-t-2 border-r-2 border-rosegold/20 rounded-tr-2xl md:rounded-tr-3xl" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 border-b-2 border-l-2 border-rosegold/20 rounded-bl-2xl md:rounded-bl-3xl" />
                  
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-rosegold/10 to-softgold/10 border border-rosegold/30 group-hover:scale-110 transition-transform duration-300 md:duration-500">
                    <span className="text-xl md:text-3xl lg:text-4xl">🔄</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />
                  
                  <div className="space-y-1.5 md:space-y-3">
                    <h3 className="font-playfair text-sm md:text-lg lg:text-xl tracking-wide text-warmbrown font-medium">Easy Returns</h3>
                    <p className="text-taupe text-xs md:text-sm font-light leading-relaxed">7-day return policy</p>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:duration-500" />
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
