import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'

interface User {
  id: string
  name: string
  email: string
  role: string
  // OAuth fields
  provider?: string // 'email' or 'google'
  googleId?: string
  photoUrl?: string // Profile picture URL from Google
  // Additional profile fields
  mobile?: string // Phone number
  dateOfBirth?: string // Date of birth
  accountStatus?: string // Account status: active, deactivated, deleted
}

interface AuthStore {
  user: User | null
  token: string | null
  isInitialized: boolean
  isVerifying: boolean
  lastVerified: number | null
  setAuth: (user: User, token: string | null) => void
  logout: () => void
  isAdmin: () => boolean
  verifyAuth: () => Promise<void>
  setInitialized: (initialized: boolean) => void
}

// Singleton promise to prevent duplicate verification requests
let verificationPromise: Promise<void> | null = null

// Cache duration: 5 minutes
const VERIFICATION_CACHE_MS = 5 * 60 * 1000

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isInitialized: false,
      isVerifying: false,
      lastVerified: null,
      
      setAuth: (user, token) => {
        set({ user, token, lastVerified: Date.now() })
      },
      
      logout: async () => {
        try {
          // Call logout API to clear HTTP-only cookie
          await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          })
        } catch (error) {
          // Silent logout error
        } finally {
          // Clear local state regardless of API call success
          set({ user: null, token: null, lastVerified: null })
          verificationPromise = null
        }
      },
      
      isAdmin: () => {
        return get().user?.role === 'admin'
      },

      setInitialized: (initialized) => {
        set({ isInitialized: initialized })
      },

      verifyAuth: async () => {
        const state = get()
        
        // If already verifying, return existing promise to prevent duplicate requests
        if (verificationPromise) {
          return verificationPromise
        }

        // Check cache: skip verification if recently verified
        if (state.lastVerified && Date.now() - state.lastVerified < VERIFICATION_CACHE_MS) {
          if (!state.isInitialized) {
            set({ isInitialized: true })
          }
          return Promise.resolve()
        }

        // Create new verification promise
        verificationPromise = (async () => {
          set({ isVerifying: true })
          
          try {
            const response = await fetch('/api/auth/verify', {
              credentials: 'include',
              cache: 'no-store',
            })

            if (response.ok) {
              const data = await response.json()
              if (data.success && data.user) {
                set({ 
                  user: data.user, 
                  token: null, 
                  isInitialized: true,
                  lastVerified: Date.now()
                })
              } else {
                set({ 
                  user: null, 
                  token: null, 
                  isInitialized: true,
                  lastVerified: null
                })
              }
            } else {
              // Token invalid or expired, clear auth
              set({ 
                user: null, 
                token: null, 
                isInitialized: true,
                lastVerified: null
              })
            }
          } catch (error) {
            console.error('Auth verification error:', error)
            // Network error: keep existing auth state, mark as initialized
            set({ isInitialized: true })
          } finally {
            set({ isVerifying: false })
          }
        })()

        // Wait for promise to complete before clearing reference
        try {
          await verificationPromise
        } finally {
          verificationPromise = null
        }

        return Promise.resolve()
      },
    }),
    {
      name: 'auth-storage',
      // Don't persist temporary state
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        lastVerified: state.lastVerified,
      }),
    }
  )
)
