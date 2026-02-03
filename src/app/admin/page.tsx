'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import AdminNavbar from '@/components/AdminNavbar'
import AdminPageContainer from '@/components/admin/AdminPageContainer'
import AdminStatsCard from '@/components/admin/AdminStatsCard'
import AdminCard from '@/components/admin/AdminCard'
import AdminFilterChips from '@/components/admin/AdminFilterChips'
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton'
import { 
  FiTrendingUp, FiAlertCircle, FiBell, FiSettings, FiSearch,
  FiArrowUp, FiDollarSign, FiShoppingBag, FiPackage, FiArrowDown, 
  FiBarChart2, FiActivity, FiEye, FiStar, FiPlus, FiUsers
} from 'react-icons/fi'

type TimeFilter = '1D' | '7D' | '1M' | '3M' | '1Y' | 'ALL'

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth({ requireAdmin: true })
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7D')

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

  useEffect(() => {
    if (user && !isLoading) {
      fetchDashboardStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, timeFilter])

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

  const timeFilters: Array<{ id: TimeFilter; label: string }> = [
    { id: '1D' as TimeFilter, label: '1D' },
    { id: '7D' as TimeFilter, label: '7D' },
    { id: '1M' as TimeFilter, label: '1M' },
    { id: '3M' as TimeFilter, label: '3M' },
    { id: '1Y' as TimeFilter, label: '1Y' },
    { id: 'ALL' as TimeFilter, label: 'ALL' },
  ]

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne via-pearl to-sand">
      <AdminNavbar />

      {/* Main Content Area */}
      <AdminPageContainer maxWidth="wide" className="lg:pr-[340px]">
        {/* Dashboard Header with Time Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-5">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-playfair font-semibold text-warmbrown mb-1">Dashboard Overview</h2>
            <p className="text-xs md:text-sm text-taupe font-medium">Monitor your business performance</p>
          </div>
          <AdminFilterChips
            filters={timeFilters}
            activeFilter={timeFilter}
            onFilterChange={(id) => setTimeFilter(id as TimeFilter)}
          />
        </div>

        {/* Stats Cards Grid - Now using AdminStatsCard */}
        {loading ? (
          <AdminLoadingSkeleton type="stats" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
            <AdminStatsCard
              title="Total Revenue"
              value={formatCurrency(stats?.totalSales || 0)}
              icon={FiDollarSign}
              trend={{
                value: stats?.salesGrowth || 0,
                label: 'vs previous period',
              }}
              variant="primary"
            />
            <AdminStatsCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon={FiShoppingBag}
              trend={{
                value: stats?.ordersGrowth || 0,
                label: 'vs previous period',
              }}
              variant="secondary"
            />
            <AdminStatsCard
              title="Avg Order Value"
              value={formatCurrency(stats?.avgOrderValue || 0)}
              icon={FiBarChart2}
              trend={{
                value: stats?.aovGrowth || 0,
                label: 'vs previous period',
              }}
              variant="tertiary"
            />
            <AdminStatsCard
              title="Total Products"
              value={stats?.totalProducts || 0}
              icon={FiPackage}
              variant="default"
            />
          </div>
        )}

        {/* Product Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 lg:gap-8 mb-6 md:mb-8">
          {/* Performance by Category */}
          <AdminCard
            title="Performance by Category"
            subtitle="Revenue breakdown by product categories"
          >
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-sand/30 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 md:space-y-5">
                {stats?.categoryPerformance?.map((cat: any, index: number) => (
                  <div key={index} className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm md:text-base text-warmbrown font-semibold capitalize">{cat.category}</span>
                      <span className="text-xs md:text-sm text-taupe font-medium bg-sand/40 px-3 py-1.5 rounded-full">
                        {formatCurrency(cat.revenue)} • {cat.count} sold
                      </span>
                    </div>
                    <div className="w-full bg-sand/40 rounded-full h-3 md:h-4 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-rosegold via-softgold to-rosegold h-full rounded-full transition-all duration-700 shadow-lg"
                        style={{ width: `${(cat.revenue / (stats?.totalSales || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>

          {/* Top Products by Revenue */}
          <AdminCard
            title="Top Revenue Products"
            subtitle="Best performing products this period"
          >
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-sand/30 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {stats?.topRevenueProducts?.map((product: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-3 px-3 md:px-4 rounded-xl hover:bg-sand/30 transition-all border-b border-softgold/20 last:border-0 group">
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <span className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-rosegold to-softgold rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link 
                          href={`/products/${product.id}`}
                          className="text-sm md:text-base font-semibold text-warmbrown hover:text-rosegold transition-colors cursor-pointer truncate block"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-taupe font-medium mt-0.5">{product.soldCount} units sold</p>
                      </div>
                    </div>
                    <span className="text-sm md:text-base font-bold text-rosegold whitespace-nowrap ml-2">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Stock & Inventory Insights - Mobile optimized grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
          {/* Stock Status Overview */}
          <AdminCard title="Stock Status">
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-sand/50 to-softgold/30 rounded-xl md:rounded-2xl border-2 border-softgold/40 hover:border-softgold/60 transition-all">
                <span className="text-xs md:text-sm text-warmbrown font-semibold">In Stock</span>
                <span className="text-xl md:text-2xl font-bold text-rosegold">{stats?.stockStatus?.inStock || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl md:rounded-2xl border-2 border-amber-200 hover:border-amber-300 transition-all">
                <span className="text-xs md:text-sm text-warmbrown font-semibold">Low Stock</span>
                <span className="text-xl md:text-2xl font-bold text-amber-600">{stats?.stockStatus?.lowStock || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-gray-100 to-gray-200/50 rounded-xl md:rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-all">
                <span className="text-xs md:text-sm text-warmbrown font-semibold">Out of Stock</span>
                <span className="text-xl md:text-2xl font-bold text-gray-600">{stats?.stockStatus?.outOfStock || 0}</span>
              </div>
            </div>
          </AdminCard>

          {/* Product Activity */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 shadow-xl border-2 border-softgold/20 hover:shadow-2xl transition-all">
            <h3 className="text-lg font-playfair font-semibold text-warmbrown mb-5 flex items-center gap-2">
              <FiActivity className="text-rosegold" size={20} />
              Product Activity
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-sand/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rosegold/10 rounded-xl group-hover:bg-rosegold/20 transition-colors">
                    <FiEye size={18} className="text-rosegold" />
                  </div>
                  <span className="text-sm text-taupe font-medium">Most Viewed</span>
                </div>
                {stats?.mostViewedProduct ? (
                  <Link 
                    href={`/products/${stats.mostViewedProduct.id}`}
                    className="text-sm font-bold text-warmbrown hover:text-rosegold transition-colors cursor-pointer max-w-[150px] truncate"
                  >
                    {stats.mostViewedProduct.name}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-taupe/50">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-sand/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                    <FiStar size={18} className="text-amber-600" />
                  </div>
                  <span className="text-sm text-taupe font-medium">Best Rated</span>
                </div>
                {stats?.bestRatedProduct ? (
                  <Link 
                    href={`/products/${stats.bestRatedProduct.id}`}
                    className="text-sm font-bold text-warmbrown hover:text-rosegold transition-colors cursor-pointer max-w-[150px] truncate"
                  >
                    {stats.bestRatedProduct.name}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-taupe/50">N/A</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-sand/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                    <FiTrendingUp size={18} className="text-emerald-600" />
                  </div>
                  <span className="text-sm text-taupe font-medium">Trending</span>
                </div>
                {stats?.trendingProduct ? (
                  <Link 
                    href={`/products/${stats.trendingProduct.id}`}
                    className="text-sm font-bold text-warmbrown hover:text-rosegold transition-colors cursor-pointer max-w-[150px] truncate"
                  >
                    {stats.trendingProduct.name}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-taupe/50">N/A</span>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Value */}
          <div className="bg-gradient-to-br from-rosegold via-softgold to-[#D4A574] rounded-3xl p-7 shadow-xl text-white border-2 border-white/20 hover:scale-105 transition-transform">
            <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
              <FiDollarSign size={20} />
              Inventory Value
            </h3>
            <div className="space-y-4">
              <div className="pb-4 border-b-2 border-white/20">
                <p className="text-sm text-white/80 mb-2 font-medium">Total Value</p>
                <p className="text-3xl font-playfair font-bold">{formatCurrency(stats?.inventoryValue?.total || 0)}</p>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <span className="text-sm font-medium">Active Stock</span>
                <span className="text-base font-bold">{formatCurrency(stats?.inventoryValue?.active || 0)}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <span className="text-sm font-medium">Low Stock Items</span>
                <span className="text-base font-bold">{formatCurrency(stats?.inventoryValue?.lowStock || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Card Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 shadow-xl mb-8 border-2 border-softgold/20 hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-lg font-playfair font-semibold text-warmbrown flex items-center gap-2">
              <FiShoppingBag className="text-rosegold" size={20} />
              Recent Orders
            </h3>
            <Link href="/admin/orders" className="text-sm text-rosegold hover:text-warmbrown font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-sand/30 flex items-center gap-2">
              View all <FiArrowUp className="rotate-90" size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-sand/30 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {stats?.recentOrders?.slice(0, 5).map((order: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-4 px-5 rounded-2xl hover:bg-sand/30 transition-all border-b border-softgold/20 last:border-0 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rosegold/20 to-softgold/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FiShoppingBag size={20} className="text-rosegold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-warmbrown">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-taupe font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-warmbrown mb-1">{formatCurrency(parseFloat(order.totalPrice))}</p>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      order.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 shadow-xl mb-8 border-2 border-softgold/20 hover:shadow-2xl transition-all">
            <h3 className="text-lg font-playfair font-semibold text-warmbrown mb-6 flex items-center gap-2">
              <FiStar className="text-amber-500" size={20} />
              Best Selling Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {stats.bestSellingProducts.slice(0, 5).map((product: any, index: number) => (
                <Link
                  key={index}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-2xl p-5 border-2 border-softgold/30 hover:border-rosegold/60 hover:shadow-xl transition-all cursor-pointer group hover:scale-105"
                >
                  <div className="aspect-square bg-gradient-to-br from-sand/40 to-softgold/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-rosegold/20 group-hover:to-softgold/30 transition-all">
                    <FiPackage size={36} className="text-rosegold" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-warmbrown truncate group-hover:text-rosegold transition-colors">{product.name}</p>
                    <p className="text-sm font-bold text-rosegold">{formatCurrency(parseFloat(product.price || '0'))}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-taupe font-medium bg-sand/40 px-2 py-1 rounded-full">{product.totalSold} sold</span>
                      <span className="text-xs font-bold text-white bg-gradient-to-r from-rosegold to-softgold px-2 py-1 rounded-full">#{index + 1}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </AdminPageContainer>

      {/* Right Sidebar */}
      <aside className="fixed right-0 top-20 w-[320px] px-5 py-8 hidden lg:block bg-white/40 backdrop-blur-sm border-l-2 border-softgold/30 overflow-y-auto z-10" style={{ height: 'calc(100vh - 5rem)' }}>
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-2 border-red-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-red-100 rounded-xl">
                  <FiAlertCircle className="text-red-500" size={20} />
                </div>
                <h3 className="text-base font-bold text-warmbrown font-playfair">Low Stock Alert</h3>
              </div>
              <div className="space-y-3">
                {stats.lowStockProducts.slice(0, 5).map((product: any) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-red-50 transition-all border-b border-red-100 last:border-0"
                  >
                    <p className="text-sm font-medium text-warmbrown truncate flex-1 mr-2">{product.name}</p>
                    <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Overview */}
          <div className="bg-gradient-to-br from-rosegold via-softgold to-[#D4A574] rounded-3xl p-6 text-white shadow-xl border-2 border-white/20">
            <p className="text-sm text-white/90 mb-1 font-semibold">Quick Overview</p>
            <p className="text-xs text-white/70 mb-5">Key metrics at a glance</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <div className="flex items-center gap-3">
                  <FiDollarSign size={18} />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <span className="font-bold text-base">₹{stats?.totalSales?.toFixed(0) || '0'}</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <div className="flex items-center gap-3">
                  <FiShoppingBag size={18} />
                  <span className="text-sm font-medium">Orders</span>
                </div>
                <span className="font-bold text-base">{stats?.totalOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
                <div className="flex items-center gap-3">
                  <FiPackage size={18} />
                  <span className="text-sm font-medium">Products</span>
                </div>
                <span className="font-bold text-base">{stats?.bestSellingProducts?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-2 border-softgold/30 shadow-xl">
            <h3 className="text-base font-bold text-warmbrown mb-5 font-playfair">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-3 w-full px-5 py-3.5 bg-gradient-to-r from-rosegold/10 to-softgold/10 hover:from-rosegold hover:to-softgold rounded-2xl text-sm font-semibold text-warmbrown hover:text-white transition-all border-2 border-rosegold/30 hover:border-rosegold/60 hover:shadow-lg group"
              >
                <FiPlus size={18} className="group-hover:rotate-90 transition-transform" />
                Add Product
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 w-full px-5 py-3.5 bg-gradient-to-r from-sand/50 to-softgold/30 hover:from-softgold/50 hover:to-softgold/40 rounded-2xl text-sm font-semibold text-warmbrown hover:text-rosegold transition-all border-2 border-softgold/40 hover:border-softgold/70 hover:shadow-lg"
              >
                <FiShoppingBag size={18} />
                View Orders
              </Link>
              <Link
                href="/admin/reviews"
                className="flex items-center gap-3 w-full px-5 py-3.5 bg-gradient-to-r from-sand/50 to-softgold/30 hover:from-softgold/50 hover:to-softgold/40 rounded-2xl text-sm font-semibold text-warmbrown hover:text-rosegold transition-all border-2 border-softgold/40 hover:border-softgold/70 hover:shadow-lg"
              >
                <FiStar size={18} />
                Moderate Reviews
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
