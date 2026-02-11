import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface ServerAdminUser {
  id: string
  name: string
  email: string
  role: string
}

/**
 * Server-side guard for admin routes/pages.
 * Redirects to login or home when auth/role validation fails.
 */
export async function requireServerAdmin(): Promise<ServerAdminUser> {
  const token = cookies().get('auth_token')?.value
  if (!token) {
    redirect('/login')
  }

  const payload = verifyToken(token)
  if (!payload) {
    redirect('/login')
  }

  if (payload.role !== 'admin') {
    redirect('/')
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, payload.userId),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  return user
}
