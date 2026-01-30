'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('latest')

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (category !== 'all') params.append('category', category)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      params.append('sort', sort)

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      // Error fetching products
    } finally {
      setLoading(false)
    }
  }, [category, minPrice, maxPrice, sort])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'rings', label: 'Rings' },
    { value: 'bangles', label: 'Bangles' },
    { value: 'sets', label: 'Sets' },
  ]

  return (
    <>
      <main className="min-h-screen bg-pearl">
        {/* Page Title Section - Left Aligned */}
        <div className="pt-32 pb-12 px-6 lg:px-12">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-5xl lg:text-6xl font-playfair font-medium text-rosegold tracking-luxury">
              {categories.find(c => c.value === category)?.label || 'All Products'}
            </h1>
          </div>
        </div>

        {/* Two-Column Layout: Sidebar + Grid */}
        <div className="px-6 lg:px-12 pb-20">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex gap-12 lg:gap-16">
              
              {/* LEFT SIDEBAR - Fixed Width, Clean Filters */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-32 space-y-10">
                  
                  {/* Category Filter - Text Links Only */}
                  <div>
                    <div className="space-y-4">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`block w-full text-left py-2 transition-all duration-300 tracking-wide ${
                            category === cat.value
                              ? 'text-rosegold font-medium text-lg border-l-2 border-rosegold pl-4'
                              : 'text-warmbrown/70 hover:text-rosegold hover:pl-4 text-base'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-rosegold/30 via-rosegold/10 to-transparent"></div>

                  {/* Price Range Filter - Minimal Form */}
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-warmbrown/60 mb-6 font-medium">
                      Price Range
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-softgold/30 rounded-lg text-warmbrown placeholder:text-taupe/40 focus:outline-none focus:border-rosegold/50 transition-colors"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-3 bg-white/50 border border-softgold/30 rounded-lg text-warmbrown placeholder:text-taupe/40 focus:outline-none focus:border-rosegold/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-rosegold/30 via-rosegold/10 to-transparent"></div>

                  {/* Sort By - Clean Dropdown */}
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-warmbrown/60 mb-6 font-medium">
                      Sort By
                    </h3>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-softgold/30 rounded-lg text-warmbrown focus:outline-none focus:border-rosegold/50 transition-colors cursor-pointer"
                    >
                      <option value="latest">Latest</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                  
                </div>
              </aside>

              {/* MAIN PRODUCT GRID */}
              <div className="flex-1">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-[4/5] bg-champagne rounded-[20px]"></div>
                        <div className="mt-6 space-y-3">
                          <div className="h-3 bg-champagne rounded w-1/3"></div>
                          <div className="h-5 bg-champagne rounded w-3/4"></div>
                          <div className="h-6 bg-champagne rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                    {products.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24">
                    <p className="text-taupe text-lg tracking-wide">No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main className="min-h-screen pt-24 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-64 mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      }>
        <ProductsContent />
      </Suspense>
      <Footer />
    </>
  )
}
