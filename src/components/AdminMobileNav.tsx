'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiPackage, FiShoppingBag, FiStar } from 'react-icons/fi'

export default function AdminMobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true
    if (path !== '/admin' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-pearl border-t-2 border-softgold/30 shadow-2xl z-50">
      <div className="flex items-center justify-around px-2 py-3">
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[70px] ${
            isActive('/admin') && pathname === '/admin'
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiHome size={20} />
          <span className="text-xs font-medium">Dashboard</span>
        </Link>

        <Link
          href="/admin/products"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[70px] ${
            isActive('/admin/products')
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiPackage size={20} />
          <span className="text-xs font-medium">Products</span>
        </Link>

        <Link
          href="/admin/orders"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[70px] ${
            isActive('/admin/orders')
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiShoppingBag size={20} />
          <span className="text-xs font-medium">Orders</span>
        </Link>

        <Link
          href="/admin/reviews"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[70px] ${
            isActive('/admin/reviews')
              ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
              : 'text-taupe hover:text-rosegold'
          }`}
        >
          <FiStar size={20} />
          <span className="text-xs font-medium">Reviews</span>
        </Link>
      </div>
    </nav>
  )
}
