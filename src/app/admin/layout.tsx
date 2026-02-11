import { requireServerAdmin } from '@/lib/admin/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireServerAdmin()
  return children
}
