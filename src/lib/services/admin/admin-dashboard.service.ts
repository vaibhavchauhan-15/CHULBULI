import { DashboardPeriod, getCachedDashboardStats } from '@/lib/admin/dashboard'
import { toAdminDashboardDto } from '@/lib/services/admin/dto'

export async function getAdminDashboardService(period: DashboardPeriod) {
  const stats = await getCachedDashboardStats(period)
  return toAdminDashboardDto(stats)
}
