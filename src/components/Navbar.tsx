'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiSearch } from 'react-icons/fi'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    setIsClient(true)
    setTotalItems(getTotalItems())
  }, [getTotalItems])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const categories = [
    { name: 'Earrings', href: '/products?category=earrings' },
    { name: 'Necklaces', href: '/products?category=necklaces' },
    { name: 'Rings', href: '/products?category=rings' },
    { name: 'Bangles', href: '/products?category=bangles' },
    { name: 'Sets', href: '/products?category=sets' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-600 ${
        isScrolled ? 'bg-champagne/50 backdrop-blur-md shadow-sm border-b border-softgold/10' : 'bg-champagne/30 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Luxury Style */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/logo.png"
              alt="Chulbuli Jewels"
              width={32}
              height={32}
              sizes="32px"
              className="w-8 h-8 object-contain transition-all duration-600 group-hover:opacity-80 group-hover:scale-110"
            />
            <h1 className="text-lg md:text-xl font-playfair font-light text-warmbrown tracking-wide">
              CHULBULI JEWELS
            </h1>
          </Link>

          {/* Desktop Navigation - Minimal */}
          <div className="hidden lg:flex items-center space-x-12">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="text-sm text-warmbrown hover:text-rosegold transition-all duration-500 font-light tracking-wide hover:tracking-widest"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right Section - Minimal Icons */}
          <div className="flex items-center space-x-6">
            {/* Search Icon - Redirects to Products Page */}
            <Link
              href="/products#search"
              className="p-2 hover:text-rosegold transition-all duration-500"
              aria-label="Search"
              onClick={(e) => {
                // If already on products page, scroll smoothly
                if (window.location.pathname === '/products') {
                  e.preventDefault()
                  const searchSection = document.getElementById('search')
                  if (searchSection) {
                    searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    // Focus the search input after scrolling
                    setTimeout(() => {
                      const searchInput = searchSection.querySelector('input')
                      searchInput?.focus()
                    }, 500)
                  }
                }
              }}
            >
              <FiSearch className="w-5 h-5 text-warmbrown hover:text-rosegold" />
            </Link>

            <Link
              href="/cart"
              className="relative p-2 hover:text-rosegold transition-all duration-500"
            >
              <FiShoppingCart className="w-5 h-5 text-warmbrown hover:text-rosegold" />
              {isClient && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rosegold text-pearl text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium shadow-luxury">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="p-2 hover:text-rosegold transition-all duration-500">
                  {user.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-8 h-8 min-w-[2rem] min-h-[2rem] rounded-full object-cover border-2 border-[#C89A7A]/30 hover:border-[#C89A7A] aspect-square"
                    />
                  ) : (
                    <FiUser className="w-5 h-5 text-warmbrown hover:text-rosegold" />
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-pearl/95 backdrop-blur-lg border border-softgold/40 shadow-luxury rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-600">
                  <Link
                    href="/dashboard"
                    className="block px-6 py-3 hover:bg-softgold/20 transition-all duration-300 text-sm font-light text-warmbrown rounded-xl mx-2"
                  >
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="block px-6 py-3 hover:bg-softgold/20 transition-all duration-300 text-sm font-light text-warmbrown rounded-xl mx-2"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-6 py-3 hover:bg-softgold/20 transition-all duration-300 text-sm font-light text-warmbrown rounded-xl mx-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-xs md:text-sm px-4 py-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
