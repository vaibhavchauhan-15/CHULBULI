'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('latest')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

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
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div className="pt-32 pb-12 px-6 lg:px-12 bg-gradient-to-b from-champagne/30 to-pearl">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="text-5xl lg:text-6xl font-playfair font-medium text-rosegold tracking-luxury mb-3">
              {categories.find(c => c.value === category)?.label || 'All Products'}
            </h1>
            <p className="text-taupe/70 text-sm mb-8 tracking-wide">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} {searchQuery && `matching "${searchQuery}"`}
            </p>
            
            {/* Search Bar - Prominent */}
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
                  <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
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
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8 lg:gap-10">
                    {filteredProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-24">
                    <p className="text-taupe text-lg tracking-wide mb-2">No products found matching &quot;{searchQuery}&quot;</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-rosegold hover:text-softgold font-medium text-sm tracking-wider transition-colors duration-300"
                    >
                      Clear search
                    </button>
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

        {/* Mobile Category Navigation - Bottom Fixed */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-softgold/30 shadow-lg z-40">
          <div className="overflow-x-auto">
            <div className="flex px-4 py-3 gap-3 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-sm font-medium tracking-wide ${
                    category === cat.value
                      ? 'bg-rosegold text-white shadow-md'
                      : 'bg-pearl text-warmbrown border border-softgold/30 hover:bg-champagne'
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
