'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiPackage, FiShoppingBag, FiStar, FiUsers } from 'react-icons/fi'

export default function AdminMobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true
    if (path !== '/admin' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-pearl border-t-2 border-softgold/30 shadow-2xl z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-1.5 py-2">
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-300 min-w-[68px] touch-target active:scale-95 ${
            isActive('/admin') && pathname === '/admin'
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiHome size={22} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>

        <Link
          href="/admin/products"
          className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-300 min-w-[68px] touch-target active:scale-95 ${
            isActive('/admin/products')
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiPackage size={22} />
          <span className="text-[10px] font-medium">Products</span>
        </Link>

        <Link
          href="/admin/orders"
          className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-300 min-w-[68px] touch-target active:scale-95 ${
            isActive('/admin/orders')
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiShoppingBag size={22} />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>

        <Link
          href="/admin/reviews"
          className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-300 min-w-[68px] touch-target active:scale-95 ${
            isActive('/admin/reviews')
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiStar size={22} />
          <span className="text-[10px] font-medium">Reviews</span>
        </Link>

        <Link
          href="/admin/users"
          className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-300 min-w-[68px] touch-target active:scale-95 ${
            isActive('/admin/users')
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiUsers size={22} />
          <span className="text-[10px] font-medium">Users</span>
        </Link>
      </div>
    </nav>
  )
}
