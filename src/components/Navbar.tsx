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
  ].filter(cat => cat.name === 'Earrings') // Hide Necklaces, Rings, Bangles, Sets - to unhide, remove this filter

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-champagne/95 backdrop-blur-md shadow-lg border-b border-softgold/20' : 'bg-champagne/40 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-8 lg:px-16">
        <div className="flex justify-between items-center h-16 md:h-16">
          {/* Mobile Menu Button - Left Side */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden touch-target-large p-1 hover:bg-softgold/20 rounded-xl transition-all z-10"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="w-5 h-5 text-warmbrown" />
            ) : (
              <FiMenu className="w-5 h-5 text-warmbrown" />
            )}
          </button>

          {/* Logo - Center on Mobile, Left on Desktop */}
          <Link href="/" className="flex items-center group md:static md:translate-x-0">
            {/* Logo - Using desktop logo for all devices */}
            <Image
              src="/logo_desktop.png"
              alt="Chulbuli Jewels"
              width={400}
              height={80}
              priority
              className="h-8 md:h-10 lg:h-12 w-auto object-contain transition-all duration-300 group-hover:opacity-90 group-hover:scale-105"
            />
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

          {/* Right Section - Optimized for Mobile */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Search Icon - Larger touch target */}
            <Link
              href="/products#search"
              className="touch-target-large p-2 md:p-2 hover:bg-softgold/20 rounded-xl transition-all duration-300"
              aria-label="Search"
              onClick={(e) => {
                if (window.location.pathname === '/products') {
                  e.preventDefault()
                  const searchSection = document.getElementById('search')
                  if (searchSection) {
                    searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    setTimeout(() => {
                      const searchInput = searchSection.querySelector('input')
                      searchInput?.focus()
                    }, 500)
                  }
                }
              }}
            >
              <FiSearch className="w-5 h-5 md:w-5 md:h-5 text-warmbrown" />
            </Link>

            <Link
              href="/cart"
              className="relative touch-target-large p-2 md:p-2 hover:bg-softgold/20 rounded-xl transition-all duration-300"
              aria-label="Shopping cart"
            >
              <FiShoppingCart className="w-5 h-5 md:w-5 md:h-5 text-warmbrown" />
              {isClient && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rosegold text-pearl text-xs w-5 h-5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-semibold shadow-lg ring-2 ring-pearl/50">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="touch-target-large p-1.5 md:p-2 hover:bg-softgold/20 rounded-xl transition-all duration-300">
                  {user.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-8 h-8 md:w-8 md:h-8 min-w-[2rem] min-h-[2rem] rounded-full object-cover border-2 border-rosegold/30 hover:border-rosegold aspect-square"
                    />
                  ) : (
                    <FiUser className="w-5 h-5 md:w-5 md:h-5 text-warmbrown" />
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-pearl/95 backdrop-blur-xl border border-softgold/50 shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="flex flex-col space-y-1 px-2">
                    <Link
                      href="/account"
                      className="block px-4 py-3 hover:bg-softgold/30 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm font-medium text-warmbrown hover:text-rosegold rounded-xl touch-target text-left"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/help"
                      className="block px-4 py-3 hover:bg-softgold/30 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm font-medium text-warmbrown hover:text-rosegold rounded-xl touch-target text-left"
                    >
                      Help & Support
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-3 hover:bg-softgold/30 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm font-medium text-warmbrown hover:text-rosegold rounded-xl touch-target text-left"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-3 hover:bg-rosegold/20 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm font-medium text-warmbrown hover:text-rosegold rounded-xl touch-target text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-sm md:text-sm px-4 md:px-6 py-2 whitespace-nowrap"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 bg-champagne/98 backdrop-blur-md border-t border-softgold/20">
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-warmbrown hover:bg-softgold/20 hover:text-rosegold rounded-xl transition-all duration-200 touch-target"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
