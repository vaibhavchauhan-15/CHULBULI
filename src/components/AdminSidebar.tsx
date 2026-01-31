'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { FiHome, FiPackage, FiShoppingBag, FiStar, FiLogOut, FiSettings, FiTrendingUp } from 'react-icons/fi'

export default function AdminSidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true
    if (path !== '/admin' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className="fixed left-0 top-0 w-72 bg-gradient-to-b from-rosegold via-[#C89A7A] to-[#B8916B] rounded-r-[2rem] flex flex-col py-8 px-5 gap-8 shadow-2xl border-r-2 border-white/20 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="mb-2 flex items-center gap-4 px-3">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 hover:scale-110 transition-transform cursor-pointer">
          <span className="text-white font-bold text-2xl font-playfair">CJ</span>
        </div>
        <div>
          <h2 className="text-white font-playfair font-bold text-xl tracking-wide">Chulbuli</h2>
          <p className="text-white/80 text-sm font-medium">Admin Panel</p>
        </div>
      </div>

      {/* Navigation with Icons and Labels */}
      <nav className="flex flex-col gap-3 flex-1">
        <Link
          href="/admin"
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            isActive('/admin') && pathname === '/admin'
              ? 'bg-white/25 backdrop-blur-sm text-white shadow-xl font-bold border-2 border-white/40 scale-105'
              : 'text-white/90 hover:bg-white/15 hover:text-white hover:scale-105 border-2 border-transparent hover:border-white/20'
          }`}
        >
          <FiHome size={22} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-base">Dashboard</span>
        </Link>

        <Link
          href="/admin/products"
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            isActive('/admin/products')
              ? 'bg-white/25 backdrop-blur-sm text-white shadow-xl font-bold border-2 border-white/40 scale-105'
              : 'text-white/90 hover:bg-white/15 hover:text-white hover:scale-105 border-2 border-transparent hover:border-white/20'
          }`}
        >
          <FiPackage size={22} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-base">Products</span>
        </Link>

        <Link
          href="/admin/orders"
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            isActive('/admin/orders')
              ? 'bg-white/25 backdrop-blur-sm text-white shadow-xl font-bold border-2 border-white/40 scale-105'
              : 'text-white/90 hover:bg-white/15 hover:text-white hover:scale-105 border-2 border-transparent hover:border-white/20'
          }`}
        >
          <FiShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-base">Orders</span>
        </Link>

        <Link
          href="/admin/reviews"
          className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
            isActive('/admin/reviews')
              ? 'bg-white/25 backdrop-blur-sm text-white shadow-xl font-bold border-2 border-white/40 scale-105'
              : 'text-white/90 hover:bg-white/15 hover:text-white hover:scale-105 border-2 border-transparent hover:border-white/20'
          }`}
        >
          <FiStar size={22} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-base">Reviews</span>
        </Link>
      </nav>

      {/* Divider */}
      <div className="border-t-2 border-white/20 my-2"></div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white/90 hover:bg-white/15 hover:text-white transition-all duration-300 border-2 border-transparent hover:border-white/20 hover:scale-105 group"
        >
          <FiLogOut size={22} className="group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-base">Back to Store</span>
        </Link>
      </div>
    </aside>
  )
}
