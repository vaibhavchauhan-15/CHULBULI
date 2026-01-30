'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { FiHome, FiPackage, FiShoppingBag, FiStar, FiLogOut } from 'react-icons/fi'

export default function AdminSidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true
    if (path !== '/admin' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-rosegold via-[#B8916B] to-softgold rounded-r-3xl flex flex-col py-6 px-4 gap-6 shadow-2xl border-r-2 border-softgold/40">
      {/* Logo */}
      <div className="mb-4 flex items-center gap-3 px-2">
        <div className="w-12 h-12 bg-pearl/30 rounded-xl flex items-center justify-center shadow-lg border border-pearl/40">
          <span className="text-pearl font-bold text-xl">CJ</span>
        </div>
        <div>
          <h2 className="text-pearl font-playfair font-semibold text-lg">Chulbuli</h2>
          <p className="text-pearl/80 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Navigation with Icons and Labels */}
      <nav className="flex flex-col gap-2 flex-1">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin') && pathname === '/admin'
              ? 'bg-pearl/30 text-pearl shadow-lg font-semibold border border-pearl/40'
              : 'text-pearl/90 hover:bg-pearl/20 hover:text-pearl'
          }`}
        >
          <FiHome size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          href="/admin/products"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin/products')
              ? 'bg-pearl/30 text-pearl shadow-lg font-semibold border border-pearl/40'
              : 'text-pearl/90 hover:bg-pearl/20 hover:text-pearl'
          }`}
        >
          <FiPackage size={20} />
          <span className="font-medium">Products</span>
        </Link>

        <Link
          href="/admin/orders"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin/orders')
              ? 'bg-pearl/30 text-pearl shadow-lg font-semibold border border-pearl/40'
              : 'text-pearl/90 hover:bg-pearl/20 hover:text-pearl'
          }`}
        >
          <FiShoppingBag size={20} />
          <span className="font-medium">Orders</span>
        </Link>

        <Link
          href="/admin/reviews"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive('/admin/reviews')
              ? 'bg-pearl/30 text-pearl shadow-lg font-semibold border border-pearl/40'
              : 'text-pearl/90 hover:bg-pearl/20 hover:text-pearl'
          }`}
        >
          <FiStar size={20} />
          <span className="font-medium">Reviews</span>
        </Link>
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-pearl/90 hover:bg-pearl/20 hover:text-pearl transition-all"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Back to Store</span>
        </Link>
      </div>
    </aside>
  )
}
