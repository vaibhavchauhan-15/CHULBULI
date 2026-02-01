'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithGoogle } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'

interface GoogleSignInButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
  redirectTo?: string
}

export default function GoogleSignInButton({
  onSuccess,
  onError,
  className = '',
  redirectTo = '/',
}: GoogleSignInButtonProps) {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)

    try {
      // Sign in with Google popup
      const result = await signInWithGoogle()
      
      // Get Firebase ID token
      const idToken = await result.user.getIdToken()

      // Send ID token to backend for verification and user creation
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update auth store with user data
        setAuth(data.user, null)
        
        toast.success(`Welcome ${data.user.name}!`)
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess()
        }
        
        // Redirect to specified page
        router.push(redirectTo)
      } else {
        const errorMessage = data.error || 'Google sign-in failed'
        console.error('Backend authentication error:', {
          status: response.status,
          error: data.error,
          details: data.details
        })
        toast.error(errorMessage)
        
        if (onError) {
          onError(errorMessage)
        }
      }
    } catch (error: any) {
      console.error('==========================================')
      console.error('🔴 GOOGLE SIGN-IN ERROR (Client-side):')
      console.error('==========================================')
      console.error('Error:', error)
      console.error('Error Code:', error.code)
      console.error('Error Message:', error.message)
      console.error('Firebase Auth Error:', error.customData)
      console.error('==========================================')
      
      let errorMessage = 'Google sign-in failed. Please try again.'
      let showSetupGuide = false
      
      // Handle specific error messages
      if (error.message === 'Sign-in cancelled') {
        errorMessage = 'Sign-in was cancelled'
        toast.error(errorMessage)
      } else if (error.message.includes('Popup blocked')) {
        errorMessage = 'Popup blocked. Please allow popups for this site.'
        toast.error(errorMessage)
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Network error. Please check your connection.'
        toast.error(errorMessage)
      } else if (error.message.includes('popup_closed_by_user')) {
        errorMessage = 'Sign-in popup was closed. Please try again.'
        toast.error(errorMessage)
      } else if (error.message.includes('auth/configuration-not-found')) {
        errorMessage = '⚠️ Firebase not configured. Check FIREBASE_SETUP_GUIDE.md'
        showSetupGuide = true
        toast.error(errorMessage, { duration: 5000 })
      } else {
        toast.error(errorMessage)
      }
      
      // Log setup guide reminder for configuration errors
      if (showSetupGuide) {
        console.error('🔥 Firebase Configuration Error - Follow these steps:')
        console.error('1. Open FIREBASE_SETUP_GUIDE.md in your project root')
        console.error('2. Complete all 6 setup steps')
        console.error('3. Restart the dev server after adding environment variables')
      }
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`
        w-full flex items-center justify-center gap-3 px-6 py-3
        bg-white border-2 border-[#C89A7A]/30
        text-[#5A3E2B] font-semibold
        rounded-lg
        hover:border-[#C89A7A] hover:bg-[#C89A7A]/5
        focus:outline-none focus:ring-2 focus:ring-[#C89A7A]/50
        disabled:opacity-60 disabled:cursor-not-allowed
        transition-all duration-200
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-[#C89A7A] border-t-transparent rounded-full animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <FcGoogle className="w-6 h-6" />
          <span>Continue with Google</span>
        </>
      )}
    </button>
  )
}
