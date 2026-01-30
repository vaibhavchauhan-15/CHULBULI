'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import AdminSidebar from '@/components/AdminSidebar'
import { 
  FiTrendingUp, FiAlertCircle, FiBell, FiSettings, FiSearch,
  FiArrowUp, FiDollarSign, FiShoppingBag, FiPackage, FiArrowDown, 
  FiBarChart2, FiActivity, FiEye, FiStar
} from 'react-icons/fi'

type TimeFilter = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL'

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth({ requireAdmin: true })
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7D')

  useEffect(() => {
    if (user && !isLoading) {
      fetchDashboardStats()
    }
  }, [user, isLoading, timeFilter])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/dashboard?period=${timeFilter}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      // Error fetching dashboard stats
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 100
    return ((current - previous) / previous * 100).toFixed(1)
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="flex min-h-screen bg-champagne">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-96 pl-11 pr-4 py-2.5 rounded-xl bg-pearl text-sm outline-none border border-softgold/30 focus:border-rosegold/50 transition-colors text-warmbrown"
            />
          </div>

          <div className="flex items-center gap-5 text-taupe">
            <button className="hover:text-rosegold transition-colors relative">
              <FiBell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rosegold rounded-full"></span>
            </button>
            <button className="hover:text-rosegold transition-colors">
              <FiSettings size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-softgold/30">
              <div className="text-right">
                <p className="text-sm font-medium text-warmbrown font-playfair">{user.name}</p>
                <p className="text-xs text-taupe">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-rosegold to-softgold rounded-xl flex items-center justify-center text-pearl font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-playfair font-semibold text-warmbrown">Dashboard Overview</h2>
          <div className="flex gap-2 bg-pearl p-1.5 rounded-xl shadow-sm border border-softgold/30">
            {(['1D', '7D', '1M', '3M', '1Y', 'ALL'] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeFilter === filter
                    ? 'bg-gradient-to-br from-rosegold to-softgold text-pearl shadow-md'
                    : 'text-taupe hover:text-warmbrown hover:bg-sand/50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-5 shadow-sm animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {/* Total Revenue */}
            <div className="rounded-2xl bg-gradient-to-br from-rosegold to-softgold p-5 shadow-lg text-pearl border border-softgold/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-pearl/90">Total Revenue</p>
                <FiDollarSign size={20} className="text-pearl/80" />
              </div>
              <h2 className="text-2xl font-playfair font-semibold mb-1">
                {formatCurrency(stats?.totalSales || 0)}
              </h2>
              <div className="flex items-center gap-1">
                {stats?.salesGrowth >= 0 ? (
                  <FiArrowUp size={12} className="text-pearl/90" />
                ) : (
                  <FiArrowDown size={12} className="text-pearl/90" />
                )}
                <span className="text-xs text-pearl/80">
                  {Math.abs(stats?.salesGrowth || 0)}% vs previous period
                </span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="rounded-2xl bg-pearl p-5 shadow-lg border-2 border-rosegold/40">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-taupe">Total Orders</p>
                <FiShoppingBag size={20} className="text-rosegold" />
              </div>
              <h2 className="text-2xl font-playfair font-semibold mb-1 text-warmbrown">
                {stats?.totalOrders || 0}
              </h2>
              <div className="flex items-center gap-1">
                {stats?.ordersGrowth >= 0 ? (
                  <FiArrowUp size={12} className="text-rosegold" />
                ) : (
                  <FiArrowDown size={12} className="text-rosegold" />
                )}
                <span className="text-xs text-taupe">
                  {Math.abs(stats?.ordersGrowth || 0)}% vs previous period
                </span>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="rounded-2xl bg-sand/60 p-5 shadow-lg border border-softgold/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-taupe">Avg Order Value</p>
                <FiBarChart2 size={20} className="text-rosegold" />
              </div>
              <h2 className="text-2xl font-playfair font-semibold mb-1 text-warmbrown">
                {formatCurrency(stats?.avgOrderValue || 0)}
              </h2>
              <div className="flex items-center gap-1">
                {stats?.aovGrowth >= 0 ? (
                  <FiArrowUp size={12} className="text-rosegold" />
                ) : (
                  <FiArrowDown size={12} className="text-rosegold" />
                )}
                <span className="text-xs text-taupe">
                  {Math.abs(stats?.aovGrowth || 0)}% vs previous period
                </span>
              </div>
            </div>

            {/* Total Products */}
            <div className="rounded-2xl bg-gradient-to-br from-[#B8916B] to-[#9A7B5A] p-5 shadow-lg text-pearl border border-softgold/30">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-pearl/90">Total Products</p>
                <FiPackage size={20} className="text-pearl/80" />
              </div>
              <h2 className="text-2xl font-playfair font-semibold mb-1">
                {stats?.totalProducts || 0}
              </h2>
              <div className="flex items-center gap-1">
                <FiActivity size={12} className="text-pearl/90" />
                <span className="text-xs text-pearl/80">
                  {stats?.activeProducts || 0} active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Product Analytics Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Product Performance by Category */}
          <div className="bg-pearl rounded-2xl p-6 shadow-sm border border-softgold/20">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-6">Performance by Category</h3>
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.categoryPerformance?.map((cat: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-warmbrown font-medium capitalize">{cat.category}</span>
                      <span className="text-xs text-taupe">{formatCurrency(cat.revenue)} ({cat.count} sold)</span>
                    </div>
                    <div className="w-full bg-sand/30 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-rosegold to-softgold h-2 rounded-full transition-all"
                        style={{ width: `${(cat.revenue / (stats?.totalSales || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products by Revenue */}
          <div className="bg-pearl rounded-2xl p-6 shadow-sm border border-softgold/20">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-6">Top Revenue Products</h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.topRevenueProducts?.map((product: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-softgold/20 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gradient-to-br from-rosegold to-softgold rounded-full flex items-center justify-center text-pearl text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <Link 
                          href={`/products/${product.id}`}
                          className="text-sm font-medium text-warmbrown hover:text-rosegold transition-colors cursor-pointer truncate max-w-[200px] block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-taupe">{product.soldCount} units sold</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-rosegold">{formatCurrency(product.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stock & Inventory Insights */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Stock Status Overview */}
          <div className="bg-pearl rounded-2xl p-6 shadow-sm border border-softgold/20">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-4">Stock Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-sand/40 rounded-lg border border-softgold/30">
                <span className="text-sm text-warmbrown font-medium">In Stock</span>
                <span className="text-lg font-bold text-rosegold">{stats?.stockStatus?.inStock || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-softgold/20 rounded-lg border border-softgold/40">
                <span className="text-sm text-warmbrown font-medium">Low Stock</span>
                <span className="text-lg font-bold text-[#B8916B]">{stats?.stockStatus?.lowStock || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-taupe/10 rounded-lg border border-taupe/30">
                <span className="text-sm text-warmbrown font-medium">Out of Stock</span>
                <span className="text-lg font-bold text-taupe">{stats?.stockStatus?.outOfStock || 0}</span>
              </div>
            </div>
          </div>

          {/* Product Activity */}
          <div className="bg-pearl rounded-2xl p-6 shadow-sm border border-softgold/20">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-4">Product Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiEye size={16} className="text-rosegold" />
                  <span className="text-sm text-taupe">Most Viewed</span>
                </div>
                {stats?.mostViewedProduct ? (
                  <Link 
                    href={`/products/${stats.mostViewedProduct.id}`}
                    className="text-sm font-semibold text-warmbrown hover:text-rosegold transition-colors cursor-pointer"
                  >
                    {stats.mostViewedProduct.name}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-warmbrown">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiStar size={16} className="text-softgold" />
                  <span className="text-sm text-taupe">Best Rated</span>
                </div>
                {stats?.bestRatedProduct ? (
                  <Link 
                    href={`/products/${stats.bestRatedProduct.id}`}
                    className="text-sm font-semibold text-warmbrown hover:text-rosegold transition-colors cursor-pointer"
                  >
                    {stats.bestRatedProduct.name}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-warmbrown">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiTrendingUp size={16} className="text-rosegold" />
                  <span className="text-sm text-taupe">Trending</span>
                </div>
                {stats?.trendingProduct ? (
                  <Link 
                    href={`/products/${stats.trendingProduct.id}`}
                    className="text-sm font-semibold text-warmbrown hover:text-rosegold transition-colors cursor-pointer"
                  >
                    {stats.trendingProduct.name}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-warmbrown">N/A</span>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Value */}
          <div className="bg-gradient-to-br from-rosegold to-softgold rounded-2xl p-6 shadow-lg text-pearl">
            <h3 className="text-sm font-semibold mb-4">Inventory Value</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-pearl/80 mb-1">Total Value</p>
                <p className="text-2xl font-playfair font-bold">{formatCurrency(stats?.inventoryValue?.total || 0)}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-pearl/20">
                <span className="text-xs">Active Stock</span>
                <span className="text-sm font-semibold">{formatCurrency(stats?.inventoryValue?.active || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Low Stock Items</span>
                <span className="text-sm font-semibold">{formatCurrency(stats?.inventoryValue?.lowStock || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Card Table */}
        <div className="bg-pearl rounded-2xl p-6 shadow-sm mb-8 border border-softgold/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-rosegold hover:text-warmbrown font-medium transition-colors">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.recentOrders?.slice(0, 5).map((order: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-softgold/20 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sand rounded-lg flex items-center justify-center">
                      <FiShoppingBag size={18} className="text-rosegold" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warmbrown">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-taupe">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-warmbrown">{formatCurrency(parseFloat(order.totalPrice))}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-sand/60 text-warmbrown border border-softgold/40' :
                      order.status === 'pending' ? 'bg-softgold/30 text-rosegold border border-softgold/50' :
                      'bg-pearl text-taupe border border-taupe/30'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best Selling Products */}
        {stats?.bestSellingProducts && stats.bestSellingProducts.length > 0 && (
          <div className="bg-pearl rounded-2xl p-6 shadow-sm mb-8 border border-softgold/20">
            <h3 className="text-sm font-playfair font-semibold text-warmbrown mb-6">Best Selling Products</h3>
            <div className="grid grid-cols-5 gap-4">
              {stats.bestSellingProducts.slice(0, 5).map((product: any, index: number) => (
                <Link
                  key={index}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl p-4 border border-softgold/20 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-sand/30 rounded-lg mb-3 flex items-center justify-center">
                    <FiPackage size={32} className="text-rosegold" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-warmbrown truncate hover:text-rosegold transition-colors">{product.name}</p>
                    <p className="text-sm font-semibold text-rosegold">{formatCurrency(parseFloat(product.price || '0'))}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-taupe">{product.totalSold} sold</span>
                      <span className="text-xs font-bold text-rosegold">#{index + 1}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Right Panel */}
      <aside className="w-[28%] px-4 py-6 hidden xl:block">
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
            <div className="bg-pearl rounded-2xl p-5 shadow-sm border border-softgold/30">
              <div className="flex items-center gap-2 mb-4">
                <FiAlertCircle className="text-red-400" size={18} />
                <h3 className="text-sm font-semibold text-warmbrown font-playfair">Low Stock Alert</h3>
              </div>
              <div className="space-y-3">
                {stats.lowStockProducts.slice(0, 5).map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-2"
                  >
                    <p className="text-sm text-warmbrown">{product.name}</p>
                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-medium">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-rosegold to-[#B8916B] rounded-2xl p-5 text-pearl shadow-lg border border-softgold/40">
            <p className="text-xs text-pearl/80 mb-2 font-medium">Quick Overview</p>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiDollarSign size={16} />
                  <span className="text-sm">Revenue</span>
                </div>
                <span className="font-semibold">₹{stats?.totalSales?.toFixed(0) || '0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiShoppingBag size={16} />
                  <span className="text-sm">Orders</span>
                </div>
                <span className="font-semibold">{stats?.totalOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiPackage size={16} />
                  <span className="text-sm">Products</span>
                </div>
                <span className="font-semibold">{stats?.bestSellingProducts?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-sand/50 rounded-2xl p-5 border border-softgold/30">
            <h3 className="text-sm font-semibold text-warmbrown mb-4 font-playfair">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/admin/products"
                className="block w-full text-left px-4 py-3 bg-pearl rounded-xl text-sm font-medium text-warmbrown hover:bg-rosegold/10 hover:text-rosegold transition-colors border border-softgold/20"
              >
                + Add Product
              </Link>
              <Link
                href="/admin/orders"
                className="block w-full text-left px-4 py-3 bg-pearl rounded-xl text-sm font-medium text-warmbrown hover:bg-rosegold/10 hover:text-rosegold transition-colors border border-softgold/20"
              >
                View Orders
              </Link>
              <Link
                href="/admin/reviews"
                className="block w-full text-left px-4 py-3 bg-pearl rounded-xl text-sm font-medium text-warmbrown hover:bg-rosegold/10 hover:text-rosegold transition-colors border border-softgold/20"
              >
                Moderate Reviews
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
