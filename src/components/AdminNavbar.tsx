'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { FiSearch, FiBell, FiSettings, FiLogOut, FiHome, FiPackage, FiShoppingBag, FiStar, FiUsers, FiArrowLeft } from 'react-icons/fi'

export default function AdminNavbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true
    if (path !== '/admin' && pathname.startsWith(path)) return true
    return false
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: FiHome },
    { href: '/admin/products', label: 'Products', icon: FiPackage },
    { href: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
    { href: '/admin/reviews', label: 'Reviews', icon: FiStar },
    { href: '/admin/users', label: 'Users', icon: FiUsers },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-softgold/30 shadow-lg">
      <div className="max-w-full px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-32 md:w-40 h-10 md:h-12">
              <Image
                src="/logo_desktop.png"
                alt="Chulbuli Jewels"
                fill
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-rosegold to-softgold text-white shadow-md'
                      : 'text-taupe hover:text-warmbrown hover:bg-sand/50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Back to Store Button */}
            <Link
              href="/"
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all duration-300 bg-gradient-to-r from-rosegold to-softgold text-white shadow-md hover:shadow-lg hover:scale-105"
              title="Back to Store"
            >
              <FiArrowLeft size={18} />
              <span className="hidden md:inline text-sm">Store</span>
            </Link>

            {/* Search - Hidden on small screens */}
            <div className="hidden md:flex relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe/60" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-11 pr-4 py-2 rounded-xl bg-sand/30 text-sm outline-none border-2 border-transparent focus:border-rosegold/40 focus:bg-white transition-all text-warmbrown w-48 lg:w-64 placeholder:text-taupe/50"
              />
            </div>

            {/* Icons */}
            <button className="relative p-2 hover:bg-sand/40 rounded-xl transition-all hover:text-rosegold group">
              <FiBell size={20} className="transition-transform group-hover:scale-110" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rosegold rounded-full animate-pulse"></span>
            </button>

            <button className="p-2 hover:bg-sand/40 rounded-xl transition-all hover:text-rosegold group hidden md:flex">
              <FiSettings size={20} className="transition-transform group-hover:rotate-90 duration-300" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-3 border-l-2 border-softgold/40">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-warmbrown">{user?.name || 'Admin'}</p>
                <p className="text-xs text-taupe">{user?.role || 'Administrator'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-rosegold via-softgold to-[#B8916B] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white/50 hover:scale-105 transition-transform cursor-pointer">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-xl transition-all hover:text-red-600 group"
              title="Logout"
            >
              <FiLogOut size={20} className="transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex gap-1 overflow-x-auto pb-3 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-rosegold to-softgold text-white shadow-md'
                    : 'text-taupe hover:text-warmbrown hover:bg-sand/50'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
