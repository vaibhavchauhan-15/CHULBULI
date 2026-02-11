import AdminProductsClient from '@/components/admin/AdminProductsClient'
import { listAdminProductsService } from '@/lib/services/admin/admin-products.service'

interface PageProps {
  searchParams?: {
    page?: string
    limit?: string
    search?: string
    category?: string
    status?: string
  }
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const page = Number(searchParams?.page || '1')
  const limit = Number(searchParams?.limit || '12')
  const search = searchParams?.search || ''
  const category = searchParams?.category || 'all'
  const status = searchParams?.status || 'all'

  const result = await listAdminProductsService({
    page,
    limit,
    search,
    category,
    status,
  })

  return (
    <AdminProductsClient
      initialProducts={result.items}
      initialPagination={result.pagination}
      initialFilters={{ search, category, status }}
    />
  )
}
