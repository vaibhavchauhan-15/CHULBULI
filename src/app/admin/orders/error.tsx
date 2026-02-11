'use client'

import AdminNavbar from '@/components/AdminNavbar'
import AdminPageErrorFallback from '@/components/admin/AdminPageErrorFallback'

export default function AdminOrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne via-pearl to-sand">
      <AdminNavbar />
      <AdminPageErrorFallback title="Orders Page Error" error={error} reset={reset} />
    </div>
  )
}
