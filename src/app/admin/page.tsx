import Link from 'next/link'
import AdminNavbar from '@/components/AdminNavbar'
import AdminPageContainer from '@/components/admin/AdminPageContainer'
import AdminStatsCard from '@/components/admin/AdminStatsCard'
import AdminCard from '@/components/admin/AdminCard'
import { DashboardPeriod } from '@/lib/admin/dashboard'
import { getAdminDashboardService } from '@/lib/services/admin/admin-dashboard.service'
import {
  FiArrowUp,
  FiBarChart2,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiStar,
} from 'react-icons/fi'

export const revalidate = 60

const PERIODS: DashboardPeriod[] = ['1D', '7D', '1M', '3M', '1Y', 'ALL']

interface PageProps {
  searchParams?: {
    period?: string
  }
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export default async function AdminPage({ searchParams }: PageProps) {
  const rawPeriod = searchParams?.period || '7D'
  const period = PERIODS.includes(rawPeriod as DashboardPeriod)
    ? (rawPeriod as DashboardPeriod)
    : '7D'

  const stats = await getAdminDashboardService(period)

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne via-pearl to-sand">
      <AdminNavbar />

      <AdminPageContainer maxWidth="wide">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-5">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-playfair font-semibold text-warmbrown mb-1">Dashboard Overview</h2>
            <p className="text-xs md:text-sm text-taupe font-medium">Monitor your business performance</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm p-1.5 md:p-2 rounded-2xl shadow-lg border-2 border-softgold/30">
            {PERIODS.map((item) => (
              <Link
                key={item}
                href={`/admin?period=${item}`}
                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${
                  period === item
                    ? 'bg-gradient-to-r from-rosegold to-softgold text-white shadow-lg scale-105'
                    : 'bg-transparent text-taupe hover:bg-sand/40 hover:text-warmbrown'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
          <AdminStatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalSales || 0)}
            icon={FiDollarSign}
            trend={{ value: stats.salesGrowth || 0, label: 'vs previous period' }}
            variant="primary"
          />
          <AdminStatsCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            icon={FiShoppingBag}
            trend={{ value: stats.ordersGrowth || 0, label: 'vs previous period' }}
            variant="secondary"
          />
          <AdminStatsCard
            title="Avg Order Value"
            value={formatCurrency(stats.avgOrderValue || 0)}
            icon={FiBarChart2}
            trend={{ value: stats.aovGrowth || 0, label: 'vs previous period' }}
            variant="tertiary"
          />
          <AdminStatsCard
            title="Total Products"
            value={stats.totalProducts || 0}
            icon={FiPackage}
            variant="default"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 lg:gap-8 mb-6 md:mb-8">
          <AdminCard title="Performance by Category" subtitle="Revenue breakdown by category">
            <div className="space-y-4 md:space-y-5">
              {stats.categoryPerformance?.map((cat: any) => (
                <div key={cat.category} className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-warmbrown font-semibold capitalize">{cat.category}</span>
                    <span className="text-xs md:text-sm text-taupe font-medium bg-sand/40 px-3 py-1.5 rounded-full">
                      {formatCurrency(cat.revenue)} | {cat.count} sold
                    </span>
                  </div>
                  <div className="w-full bg-sand/40 rounded-full h-3 md:h-4 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-rosegold via-softgold to-rosegold h-full rounded-full transition-all duration-700 shadow-lg"
                      style={{ width: `${(cat.revenue / (stats.totalSales || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!stats.categoryPerformance || stats.categoryPerformance.length === 0) && (
                <p className="text-sm text-taupe">No sales data available for this period.</p>
              )}
            </div>
          </AdminCard>

          <AdminCard title="Top Revenue Products" subtitle="Best performing products this period">
            <div className="space-y-2 md:space-y-3">
              {stats.topRevenueProducts?.map((product: any, index: number) => (
                <div key={product.id} className="flex items-center justify-between py-3 px-3 md:px-4 rounded-xl hover:bg-sand/30 transition-all border-b border-softgold/20 last:border-0 group">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <span className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-rosegold to-softgold rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-sm md:text-base font-semibold text-warmbrown hover:text-rosegold transition-colors truncate block"
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
              {(!stats.topRevenueProducts || stats.topRevenueProducts.length === 0) && (
                <p className="text-sm text-taupe">No revenue data available.</p>
              )}
            </div>
          </AdminCard>
        </div>

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

          <div className="space-y-3">
            {stats.recentOrders?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex justify-between items-center py-4 px-5 rounded-2xl hover:bg-sand/30 transition-all border-b border-softgold/20 last:border-0 group">
                <div>
                  <p className="text-sm font-semibold text-warmbrown">Order #{String(order.id).slice(0, 8)}</p>
                  <p className="text-xs text-taupe font-medium mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-warmbrown mb-1">{formatCurrency(Number(order.totalPrice || 0))}</p>
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
            {(!stats.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-sm text-taupe">No orders in this period.</p>
            )}
          </div>
        </div>

        {stats.bestSellingProducts && stats.bestSellingProducts.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-7 shadow-xl mb-8 border-2 border-softgold/20 hover:shadow-2xl transition-all">
            <h3 className="text-lg font-playfair font-semibold text-warmbrown mb-6 flex items-center gap-2">
              <FiStar className="text-amber-500" size={20} />
              Best Selling Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {stats.bestSellingProducts.slice(0, 5).map((product: any, index: number) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-2xl p-5 border-2 border-softgold/30 hover:border-rosegold/60 hover:shadow-xl transition-all cursor-pointer group hover:scale-105"
                >
                  <div className="aspect-square bg-gradient-to-br from-sand/40 to-softgold/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-rosegold/20 group-hover:to-softgold/30 transition-all">
                    <FiPackage size={36} className="text-rosegold" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-warmbrown truncate group-hover:text-rosegold transition-colors">{product.name}</p>
                    <p className="text-sm font-bold text-rosegold">{formatCurrency(Number(product.price || 0))}</p>
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
    </div>
  )
}
