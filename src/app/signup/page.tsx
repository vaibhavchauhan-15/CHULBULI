'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GoogleSignInButton from '@/components/GoogleSignInButton'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiUser, FiCheck, FiArrowRight, FiUserPlus } from 'react-icons/fi'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long and contain uppercase, lowercase, and a number')
      return
    }

    // Validate password requirements
    const hasUpperCase = /[A-Z]/.test(formData.password)
    const hasLowerCase = /[a-z]/.test(formData.password)
    const hasNumber = /[0-9]/.test(formData.password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json();

      if (response.ok) {
        setAuth(data.user, null)
        toast.success('Account created successfully!')
        router.push(redirectTo)
      } else {
        toast.error(data.error || 'Signup failed')
      }
    } catch (error) {
      toast.error('Signup failed. Please check your network connection and try again.')
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
                <FiUserPlus className="w-8 h-8 md:w-10 md:h-10 text-[#C89A7A]" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-[#5A3E2B] mb-1 md:mb-2">
                Create Account
              </h1>
              <p className="text-[#5A3E2B]/60 text-sm md:text-base">Join our exclusive jewelry collection</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-4 lg:space-y-5">
              {/* Google Sign-In Button */}
              <GoogleSignInButton redirectTo={redirectTo} />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#C89A7A]/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-[#F7F6F3] to-[#F2E6D8] text-[#5A3E2B]/60">
                    or sign up with email
                  </span>
                </div>
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-[#5A3E2B] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="w-5 h-5 text-[#C89A7A]/60" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-luxury w-full !pl-12 pr-4"
                    placeholder="Your Name"
                  />
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
                    placeholder="aloo@gmail.com"
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
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-[#5A3E2B]/60 mt-2 flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>Min 8 characters with uppercase, lowercase, and number</span>
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-[#5A3E2B] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="w-5 h-5 text-[#C89A7A]/60" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                className="btn-primary btn-mobile-full py-3.5 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-4 md:mt-6 touch-target"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <p className="text-center mt-6 md:mt-8 text-[#5A3E2B]/70 text-sm md:text-base">
              Already have an account?{' '}
              <Link href={`/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} className="text-[#C89A7A] hover:text-[#E6C9A8] font-semibold transition-colors touch-target">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosegold"></div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
