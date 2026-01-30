'use client'

import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/authStore'

/**
 * Auth initialization component
 * Verifies authentication state on app load by checking HTTP-only cookie
 * Uses caching and request deduplication for optimal performance
 */
export default function AuthInitializer() {
  const verifyAuth = useAuthStore((state) => state.verifyAuth)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const hasVerified = useRef(false)

  useEffect(() => {
    // Only verify once per session
    if (!hasVerified.current && !isInitialized) {
      hasVerified.current = true
      verifyAuth()
    }
  }, [verifyAuth, isInitialized])

  return null
}
