'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiArrowRight, FiUserCheck } from 'react-icons/fi'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setAuth(data.user, null)
        toast.success('Login successful!')
        router.push(redirectTo)
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch (error) {
      toast.error('Login failed. Please check your network connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 md:pt-24 px-4 pb-12 flex items-center justify-center bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-md w-full">
          <div className="card-luxury p-6 md:p-8 lg:p-10 shadow-luxury-lg">
            {/* Header */}
            <div className="text-center mb-6 md:mb-8 lg:mb-10">
              <div className="bg-[#C89A7A]/10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FiUserCheck className="w-8 h-8 md:w-10 md:h-10 text-[#C89A7A]" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-[#5A3E2B] mb-1 md:mb-2">
                Welcome Back
              </h1>
              <p className="text-[#5A3E2B]/60 text-sm md:text-base">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
              {/* Google Sign-In Button */}
              <GoogleSignInButton redirectTo={redirectTo} />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#C89A7A]/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-[#F7F6F3] to-[#F2E6D8] text-[#5A3E2B]/60">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-[#5A3E2B] mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="w-5 h-5 text-[#C89A7A]/60" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-luxury w-full !pl-12 pr-4"
                    placeholder="user@gmail.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-[#5A3E2B] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="w-5 h-5 text-[#C89A7A]/60" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-luxury w-full !pl-12 pr-4"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-mobile-full py-3.5 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group touch-target"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 space-y-4">
              <p className="text-center text-[#5A3E2B]/70">
                Don&apos;t have an account?{' '}
                <Link href={`/signup${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-[#C89A7A] hover:text-[#E6C9A8] font-semibold transition-colors">
                  Sign up
                </Link>
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#C89A7A]/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-[#F7F6F3] to-[#F2E6D8] text-[#5A3E2B]/60">or</span>
                </div>
              </div>

              <div className="text-center">
                <Link 
                  href="/products" 
                  className="inline-flex items-center gap-2 text-sm text-[#5A3E2B]/70 hover:text-[#C89A7A] transition-colors"
                >
                  Continue as Guest
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosegold"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
