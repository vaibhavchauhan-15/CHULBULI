import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from '@/lib/middleware'
import { DashboardPeriod } from '@/lib/admin/dashboard'
import { getAdminDashboardService } from '@/lib/services/admin/admin-dashboard.service'

const PERIODS: DashboardPeriod[] = ['1D', '7D', '1M', '3M', '1Y', 'ALL']

async function handleGET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawPeriod = searchParams.get('period') || '7D'
    const period = PERIODS.includes(rawPeriod as DashboardPeriod)
      ? (rawPeriod as DashboardPeriod)
      : '7D'

    const stats = await getAdminDashboardService(period)

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'private, max-age=180, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = authMiddleware(handleGET)
