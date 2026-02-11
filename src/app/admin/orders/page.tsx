import AdminOrdersClient from '@/components/admin/AdminOrdersClient'
import { listAdminOrdersService } from '@/lib/services/admin/admin-orders.service'

interface PageProps {
  searchParams?: {
    page?: string
    limit?: string
    search?: string
    status?: string
  }
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const page = Number(searchParams?.page || '1')
  const limit = Number(searchParams?.limit || '10')
  const search = searchParams?.search || ''
  const status = searchParams?.status || 'all'

  const result = await listAdminOrdersService({
    page,
    limit,
    search,
    status,
  })

  return (
    <AdminOrdersClient
      initialOrders={result.items}
      initialPagination={result.pagination}
      initialFilters={{ search, status }}
    />
  )
}
