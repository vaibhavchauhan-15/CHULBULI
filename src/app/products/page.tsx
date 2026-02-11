'use client'

import { useEffect, useState, Suspense, useCallback, useDeferredValue, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'

type ProductListItem = {
  id: string
  name: string
  price: number | string
  discount: number | string
  images: string[]
  category?: string
  thumbnailImage?: string | null
  stock?: number
  featured?: boolean
  isNewArrival?: boolean
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('latest')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const fetchProducts = useCallback(async (signal?: AbortSignal) => {
    try {
      const params = new URLSearchParams()
      if (category !== 'all') params.append('category', category)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      params.append('sort', sort)

      const response = await fetch(`/api/products?${params.toString()}`, {
        signal,
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      if ((error as Error)?.name !== 'AbortError') {
        setProducts([])
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [category, minPrice, maxPrice, sort])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    const timer = setTimeout(() => {
      fetchProducts(controller.signal)
    }, 150)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [fetchProducts])

  // Handle smooth scroll to search bar if hash is present
  useEffect(() => {
    if (window.location.hash === '#search') {
      const searchSection = document.getElementById('search')
      if (searchSection) {
        setTimeout(() => {
          searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Focus the search input after scrolling
          setTimeout(() => {
            const searchInput = searchSection.querySelector('input')
            searchInput?.focus()
          }, 500)
        }, 100)
      }
    }
  }, [])

  // Filter products based on search query (client-side filtering)
  const filteredProducts = useMemo(
    () =>
      products.filter((product: any) =>
        product.name.toLowerCase().includes(deferredSearchQuery.toLowerCase())
      ),
    [products, deferredSearchQuery]
  )

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'rings', label: 'Rings' },
    { value: 'bangles', label: 'Bangles' },
    { value: 'sets', label: 'Sets' },
  ].filter(cat => cat.value === 'all' || cat.value === 'earrings') // Hide Necklaces, Rings, Bangles, Sets - to unhide, remove this filter

  return (
    <>
      <main className="min-h-screen bg-pearl">
        {/* Page Title Section - Mobile optimized */}
        <div className="pt-20 md:pt-32 pb-6 md:pb-12 px-4 md:px-6 lg:px-12 bg-gradient-to-b from-champagne/30 to-pearl">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-playfair font-medium text-rosegold tracking-wide mb-2 md:mb-3">
              {categories.find(c => c.value === category)?.label || 'All Products'}
            </h1>
            <p className="text-taupe/70 text-xs md:text-sm mb-4 md:mb-8 tracking-wide">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} {searchQuery && `matching "${searchQuery}"`}
            </p>
            
            {/* Search Bar - Mobile optimized */}
            <div id="search" className="max-w-3xl scroll-mt-24">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by product name (e.g., earrings, necklace, pearl...)"
                autoFocus={false}
              />
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Sidebar + Grid */}
        <div className="px-4 md:px-6 lg:px-12 pb-24 md:pb-20">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex gap-8 lg:gap-16">
              
              {/* LEFT SIDEBAR - Hidden on mobile */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="sticky top-32 space-y-10">
                  
                  {/* Category Filter - Text Links Only */}
                  <div>
                    <div className="space-y-4">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`block w-full text-left py-2 transition-all duration-200 md:duration-300 tracking-wide touch-target ${
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
                        className="input-luxury"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="input-luxury"
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
                      className="input-luxury cursor-pointer"
                    >
                      <option value="latest">Latest</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                  
                </div>
              </aside>

              {/* MAIN PRODUCT GRID - Mobile optimized */}
              <div className="flex-1">
                {loading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-10">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-[3/4] md:aspect-[4/5] bg-champagne rounded-2xl md:rounded-[20px]"></div>
                        <div className="mt-3 md:mt-6 space-y-2 md:space-y-3">
                          <div className="h-2 md:h-3 bg-champagne rounded w-1/3"></div>
                          <div className="h-3 md:h-5 bg-champagne rounded w-3/4"></div>
                          <div className="h-4 md:h-6 bg-champagne rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-10">
                    {filteredProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-12 md:py-24">
                    <p className="text-taupe text-sm md:text-lg tracking-wide mb-2">No products found matching &quot;{searchQuery}&quot;</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-rosegold hover:text-softgold font-medium text-xs md:text-sm tracking-wider transition-colors duration-300 touch-target"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 md:py-24">
                    <p className="text-taupe text-sm md:text-lg tracking-wide">No products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Category Navigation - Sticky bottom with safe area */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md border-t-2 border-softgold/30 shadow-2xl z-40 safe-area-bottom">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex px-4 py-3 gap-2 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 text-sm font-medium tracking-wide touch-target active:scale-95 ${
                    category === cat.value
                      ? 'bg-rosegold text-white shadow-lg ring-2 ring-rosegold/30'
                      : 'bg-pearl text-warmbrown border-2 border-softgold/30 hover:bg-champagne active:bg-softgold/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
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
