import { useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

interface UseAuthOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

/**
 * Optimized auth hook with automatic verification and role checking
 * @param options - Configuration for auth requirements
 */
export function useAuth(options: UseAuthOptions = {}) {
  const {
    requireAuth = false,
    requireAdmin = false,
    redirectTo = '/login',
  } = options

  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const isVerifying = useAuthStore((state) => state.isVerifying)
  const verifyAuth = useAuthStore((state) => state.verifyAuth)
  const logout = useAuthStore((state) => state.logout)
  const isAdmin = useAuthStore((state) => state.isAdmin)

  // Auto-verify on mount if needed
  useEffect(() => {
    if (!isInitialized && !isVerifying) {
      verifyAuth()
    }
  }, [isInitialized, isVerifying, verifyAuth])

  // Handle auth requirements
  useEffect(() => {
    if (!isInitialized) return

    if (requireAuth && !user) {
      router.push(redirectTo)
    } else if (requireAdmin && !isAdmin()) {
      router.push('/')
    }
  }, [isInitialized, user, requireAuth, requireAdmin, redirectTo, router, isAdmin])

  const refresh = useCallback(() => {
    return verifyAuth()
  }, [verifyAuth])

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    isLoading: !isInitialized || isVerifying,
    isInitialized,
    refresh,
    logout,
  }
}
