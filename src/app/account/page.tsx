'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { 
  FiUser, 
  FiMapPin, 
  FiStar, 
  FiLock, 
  FiSettings,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiAlertCircle,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiShoppingBag,
  FiCalendar,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi'

type Tab = 'profile' | 'addresses' | 'orders' | 'reviews' | 'security' | 'controls'

interface UserProfile {
  id: string
  name: string
  email: string
  mobile?: string
  dateOfBirth?: string
  photoUrl?: string
  provider: string
  role: string
  accountStatus: string
  createdAt: string
}

interface Address {
  id: string
  label: string
  fullName: string
  mobile: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface Review {
  id: string
  productId: string
  productName: string
  productImage: string
  rating: number
  comment: string
  approved: boolean
  verifiedPurchase: boolean
  createdAt: string
  updatedAt: string
}

interface PendingReview {
  productId: string
  productName: string
  productImage: string
  orderId: string
  orderDate: string
}

// Helper function to decode HTML entities
const decodeHtmlEntities = (str: string): string => {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = str
  return textarea.value
}

// Helper function to ensure proper image URL format
const getImageUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== 'string' || url.trim() === '') return null
  
  try {
    // Decode HTML entities first (e.g., &#x2F; to /)
    let formattedUrl = decodeHtmlEntities(url.trim())
    
    // If URL starts with //, add https:
    if (formattedUrl.startsWith('//')) {
      formattedUrl = `https:${formattedUrl}`
    }
    // If URL doesn't start with http:// or https://, add https://
    else if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`
    }
    
    // Validate URL by trying to construct it
    new URL(formattedUrl)
    return formattedUrl
  } catch (error) {
    console.error('Invalid image URL:', url, error)
    return null
  }
}

export default function AccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth({ requireAuth: true })
  const logout = useAuthStore((state) => state.logout)
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState<Partial<Address>>({})
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Check URL parameters on mount to set initial tab
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'addresses', 'orders', 'reviews', 'security', 'controls'].includes(tab)) {
      setActiveTab(tab as Tab)
    }
  }, [searchParams])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      if (activeTab === 'profile') {
        const res = await fetch('/api/user/profile', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
          setEditedProfile(data)
        }
      } else if (activeTab === 'addresses') {
        const res = await fetch('/api/user/addresses', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setAddresses(data)
        }
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/orders', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } else if (activeTab === 'reviews') {
        const res = await fetch('/api/user/reviews', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setReviews(data.reviews)
          setPendingReviews(data.pendingReviews)
        }
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    if (!isLoading && user) {
      fetchData()
    }
  }, [isLoading, user, fetchData])

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editedProfile),
      })

      const data = await res.json()

      if (res.ok) {
        setProfile(data.user)
        setIsEditingProfile(false)
        setSuccess('Profile updated successfully')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('Failed to update profile')
    }
  }

  const handleAddressSubmit = async () => {
    try {
      const url = editingAddressId 
        ? `/api/user/addresses/${editingAddressId}` 
        : '/api/user/addresses'
      
      const res = await fetch(url, {
        method: editingAddressId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addressForm),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        setIsAddingAddress(false)
        setEditingAddressId(null)
        setAddressForm({})
        fetchData()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to save address')
      }
    } catch (err) {
      setError('Failed to save address')
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        fetchData()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to delete address')
      }
    } catch (err) {
      setError('Failed to delete address')
    }
  }

  const handleReviewUpdate = async (reviewId: string) => {
    try {
      const res = await fetch(`/api/user/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reviewForm),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        setEditingReviewId(null)
        fetchData()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to update review')
      }
    } catch (err) {
      setError('Failed to update review')
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const res = await fetch(`/api/user/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        fetchData()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to delete review')
      }
    } catch (err) {
      setError('Failed to delete review')
    }
  }

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to change password')
      }
    } catch (err) {
      setError('Failed to change password')
    }
  }

  const handleDeactivateAccount = async () => {
    if (!confirm('Are you sure you want to deactivate your account? You can reactivate by logging in again.')) return

    try {
      const res = await fetch('/api/user/deactivate', {
        method: 'POST',
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok) {
        alert(data.message)
        router.push('/login')
      } else {
        setError(data.error || 'Failed to deactivate account')
      }
    } catch (err) {
      setError('Failed to deactivate account')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to permanently delete your account? This action cannot be undone. All your personal data will be removed.'
    )
    if (!confirmed) return

    const doubleConfirm = confirm('This is your last chance. Are you absolutely sure you want to delete your account?')
    if (!doubleConfirm) return

    try {
      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok) {
        // Clear auth store to log out user
        logout()
        
        // Show success message
        alert(data.message)
        
        // Redirect to home page
        router.push('/')
      } else {
        setError(data.error || 'Failed to delete account')
      }
    } catch (err) {
      setError('Failed to delete account')
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'packed':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <FiShoppingBag className="w-4 h-4" />
      case 'packed':
        return <FiPackage className="w-4 h-4" />
      case 'shipped':
        return <FiTruck className="w-4 h-4" />
      case 'delivered':
        return <FiCheckCircle className="w-4 h-4" />
      default:
        return <FiShoppingBag className="w-4 h-4" />
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pearl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosegold mx-auto"></div>
          <p className="mt-4 text-warmbrown">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pearl">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-bold text-warmbrown mb-8">My Account</h1>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <FiAlertCircle />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700">
            <FiCheck />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl shadow-lg p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'profile'
                    ? 'bg-rosegold text-white'
                    : 'text-warmbrown hover:bg-softgold/20'
                }`}
              >
                <FiUser />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-rosegold text-white'
                    : 'text-warmbrown hover:bg-softgold/20'
                }`}
              >
                <FiMapPin />
                <span>Addresses</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'orders'
                    ? 'bg-rosegold text-white'
                    : 'text-warmbrown hover:bg-softgold/20'
                }`}
              >
                <FiShoppingBag />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-rosegold text-white'
                    : 'text-warmbrown hover:bg-softgold/20'
                }`}
              >
                <FiStar />
                <span>Reviews</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'security'
                    ? 'bg-rosegold text-white'
                    : 'text-warmbrown hover:bg-softgold/20'
                }`}
              >
                <FiLock />
                <span>Security</span>
              </button>
              <button
                onClick={() => setActiveTab('controls')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'controls'
                    ? 'bg-rosegold text-white'
                    : 'text-warmbrown hover:bg-softgold/20'
                }`}
              >
                <FiSettings />
                <span>Account Controls</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && profile && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-warmbrown">Basic Information</h2>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-rosegold text-white rounded-xl hover:bg-rosegold/90 transition-all"
                      >
                        <FiEdit2 />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-warmbrown mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedProfile.name || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-warmbrown mb-2">Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full px-4 py-2 border border-softgold/50 rounded-xl bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-warmbrown mb-2">Mobile Number</label>
                        <input
                          type="tel"
                          value={editedProfile.mobile || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, mobile: e.target.value })}
                          placeholder="10-digit mobile number"
                          className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-warmbrown mb-2">Date of Birth</label>
                        <input
                          type="date"
                          value={editedProfile.dateOfBirth ? new Date(editedProfile.dateOfBirth).toISOString().split('T')[0] : ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                          className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleProfileUpdate}
                          className="flex-1 px-6 py-3 bg-rosegold text-white rounded-xl hover:bg-rosegold/90 transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingProfile(false)
                            setEditedProfile(profile)
                          }}
                          className="flex-1 px-6 py-3 bg-gray-200 text-warmbrown rounded-xl hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        {profile.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profile.photoUrl}
                            alt={profile.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-rosegold/30"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-softgold/30 flex items-center justify-center">
                            <FiUser className="w-10 h-10 text-rosegold" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-warmbrown">{profile.name}</h3>
                          <p className="text-sm text-gray-600">{profile.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
                          <p className="text-warmbrown">{profile.mobile || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                          <p className="text-warmbrown">
                            {profile.dateOfBirth 
                              ? new Date(profile.dateOfBirth).toLocaleDateString() 
                              : 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Account Type</label>
                          <p className="text-warmbrown capitalize">{profile.provider}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                          <p className="text-warmbrown">{new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-warmbrown">Saved Addresses</h2>
                    {!isAddingAddress && !editingAddressId && (
                      <button
                        onClick={() => {
                          setIsAddingAddress(true)
                          setAddressForm({ label: 'Home', isDefault: false })
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-rosegold text-white rounded-xl hover:bg-rosegold/90 transition-all"
                      >
                        <FiPlus />
                        Add Address
                      </button>
                    )}
                  </div>

                  {(isAddingAddress || editingAddressId) && (
                    <div className="mb-6 p-6 bg-softgold/10 rounded-xl">
                      <h3 className="text-lg font-bold text-warmbrown mb-4">
                        {editingAddressId ? 'Edit Address' : 'Add New Address'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">Label</label>
                          <select
                            value={addressForm.label || 'Home'}
                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">Full Name</label>
                          <input
                            type="text"
                            value={addressForm.fullName || ''}
                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">Mobile Number</label>
                          <input
                            type="tel"
                            value={addressForm.mobile || ''}
                            onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                            placeholder="10-digit mobile number"
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">Pincode</label>
                          <input
                            type="text"
                            value={addressForm.pincode || ''}
                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                            placeholder="6-digit pincode"
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-warmbrown mb-2">Address Line 1</label>
                          <input
                            type="text"
                            value={addressForm.addressLine1 || ''}
                            onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-warmbrown mb-2">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            value={addressForm.addressLine2 || ''}
                            onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">City</label>
                          <input
                            type="text"
                            value={addressForm.city || ''}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">State</label>
                          <input
                            type="text"
                            value={addressForm.state || ''}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={addressForm.isDefault || false}
                              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                              className="w-4 h-4 text-rosegold focus:ring-rosegold border-softgold/50 rounded"
                            />
                            <span className="text-sm text-warmbrown">Set as default shipping address</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleAddressSubmit}
                          className="flex-1 px-6 py-3 bg-rosegold text-white rounded-xl hover:bg-rosegold/90 transition-all"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={() => {
                            setIsAddingAddress(false)
                            setEditingAddressId(null)
                            setAddressForm({})
                          }}
                          className="flex-1 px-6 py-3 bg-gray-200 text-warmbrown rounded-xl hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No addresses saved yet</p>
                      </div>
                    ) : (
                      addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-xl ${
                            address.isDefault
                              ? 'border-rosegold bg-rosegold/5'
                              : 'border-softgold/50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-softgold/30 text-warmbrown text-sm rounded-full">
                                  {address.label}
                                </span>
                                {address.isDefault && (
                                  <span className="px-3 py-1 bg-rosegold text-white text-sm rounded-full flex items-center gap-1">
                                    <FiCheck className="w-3 h-3" />
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-bold text-warmbrown">{address.fullName}</p>
                              <p className="text-sm text-gray-600">{address.mobile}</p>
                              <p className="text-sm text-gray-600 mt-2">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingAddressId(address.id)
                                  setAddressForm(address)
                                }}
                                className="p-2 text-rosegold hover:bg-rosegold/10 rounded-lg transition-all"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-warmbrown">Order History</h2>
                    {orders.length > 0 && (
                      <div className="bg-softgold/20 px-4 py-2 rounded-full border border-rosegold/20">
                        <span className="text-sm font-medium text-warmbrown">
                          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                        </span>
                      </div>
                    )}
                  </div>

                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => {
                        const isExpanded = expandedOrders.has(order.id)
                        return (
                          <div key={order.id} className="border border-softgold/50 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                            {/* Order Header */}
                            <div className="p-6 bg-gradient-to-r from-softgold/10 to-white/50">
                              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                <div className="flex-1">
                                  <div className="flex items-start gap-3 mb-2">
                                    <div className="bg-rosegold/10 p-2 rounded-lg">
                                      <FiShoppingBag className="w-5 h-5 text-rosegold" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-lg text-warmbrown">
                                        Order #{order.id.slice(0, 8).toUpperCase()}
                                      </p>
                                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <FiCalendar className="w-3.5 h-3.5" />
                                        <span>
                                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium capitalize border ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Order Items - Collapsible */}
                            <div className="px-6 py-4 border-t border-softgold/20">
                              <button
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="w-full flex items-center justify-between text-left py-2 group"
                              >
                                <span className="font-medium text-warmbrown group-hover:text-rosegold transition-colors">
                                  Order Details ({order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'})
                                </span>
                                {isExpanded ? (
                                  <FiChevronUp className="w-5 h-5 text-rosegold" />
                                ) : (
                                  <FiChevronDown className="w-5 h-5 text-rosegold" />
                                )}
                              </button>
                              
                              {isExpanded && (
                                <div className="mt-4 space-y-3">
                                  {order.orderItems.map((item: any) => (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-center p-4 bg-softgold/5 rounded-lg border border-softgold/20 hover:border-rosegold/30 transition-colors"
                                    >
                                      <div className="flex-1">
                                        <Link 
                                          href={`/products/${item.product.id}`}
                                          className="font-medium text-warmbrown hover:text-rosegold transition-colors"
                                        >
                                          {item.product.name}
                                        </Link>
                                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                                      </div>
                                      <span className="font-semibold text-rosegold text-lg">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Order Summary */}
                            <div className="px-6 py-6 border-t border-softgold/20 bg-softgold/5">
                              <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-warmbrown">Total Amount</span>
                                <span className="text-2xl font-bold text-rosegold">
                                  ₹{Number(order.totalPrice).toFixed(2)}
                                </span>
                              </div>

                              {/* Shipping Address */}
                              <div className="bg-white rounded-xl p-5 border border-softgold/30">
                                <div className="flex items-start gap-3">
                                  <div className="bg-rosegold/10 p-2 rounded-lg mt-0.5">
                                    <FiMapPin className="w-4 h-4 text-rosegold" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-warmbrown mb-2">Shipping Address</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                      {order.addressLine1}{order.addressLine2 && `, ${order.addressLine2}`}
                                      <br />
                                      {order.city}, {order.state} - {order.pincode}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-softgold/5 rounded-xl border border-softgold/20">
                      <div className="max-w-md mx-auto">
                        <div className="bg-rosegold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiShoppingBag className="w-10 h-10 text-rosegold" />
                        </div>
                        <h3 className="text-xl font-bold text-warmbrown mb-2">
                          No orders yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Start exploring our exquisite collection of handcrafted jewelry
                        </p>
                        <button
                          onClick={() => router.push('/products')}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-rosegold text-white rounded-xl hover:bg-rosegold/90 transition-all"
                        >
                          <FiShoppingBag className="w-4 h-4" />
                          Explore Collection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-2xl font-bold text-warmbrown mb-6">My Reviews & Ratings</h2>

                  {/* Pending Reviews */}
                  {pendingReviews.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-warmbrown mb-4 flex items-center gap-2">
                        <FiAlertCircle className="text-rosegold" />
                        Pending Reviews ({pendingReviews.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingReviews.map((item) => {
                          const imageUrl = getImageUrl(item.productImage)
                          return (
                            <div
                              key={item.productId}
                              className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-4"
                            >
                              <div className="relative w-20 h-20 flex-shrink-0 bg-champagne/30 rounded-lg overflow-hidden">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-champagne/50">
                                    <span className="text-xs text-taupe/50">No Image</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <Link href={`/products/${item.productId}`} className="font-bold text-warmbrown hover:text-rosegold transition-colors">
                                  {item.productName}
                                </Link>
                                <p className="text-sm text-gray-600">
                                  Delivered on {new Date(item.orderDate).toLocaleDateString()}
                                </p>
                                <button
                                  onClick={() => router.push(`/products/${item.productId}`)}
                                  className="mt-2 text-sm text-rosegold hover:underline"
                                >
                                  Write a Review
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Submitted Reviews */}
                  <div>
                    <h3 className="text-lg font-bold text-warmbrown mb-4">My Reviews</h3>
                    {reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <FiStar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No reviews yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => {
                          const imageUrl = getImageUrl(review.productImage)
                          return (
                            <div key={review.id} className="p-4 border border-softgold/50 rounded-xl">
                              <div className="flex gap-4">
                                <div className="relative w-20 h-20 flex-shrink-0 bg-champagne/30 rounded-lg overflow-hidden">
                                  {imageUrl ? (
                                    <Image
                                      src={imageUrl}
                                      alt={review.productName}
                                      fill
                                      className="object-cover"
                                      sizes="80px"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-champagne/50">
                                      <span className="text-xs text-taupe/50">No Image</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <Link href={`/products/${review.productId}`} className="font-bold text-warmbrown hover:text-rosegold transition-colors">
                                      {review.productName}
                                    </Link>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <FiStar
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i < review.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      {review.verifiedPurchase && (
                                        <span className="text-xs text-green-600 flex items-center gap-1">
                                          <FiCheck className="w-3 h-3" />
                                          Verified Purchase
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingReviewId(review.id)
                                        setReviewForm({ rating: review.rating, comment: review.comment })
                                      }}
                                      className="p-2 text-rosegold hover:bg-rosegold/10 rounded-lg transition-all"
                                    >
                                      <FiEdit2 />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReview(review.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </div>

                                {editingReviewId === review.id ? (
                                  <div className="space-y-3 mt-3">
                                    <div>
                                      <label className="block text-sm font-medium text-warmbrown mb-2">Rating</label>
                                      <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <button
                                            key={star}
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                            className="transition-all"
                                          >
                                            <FiStar
                                              className={`w-6 h-6 ${
                                                star <= reviewForm.rating
                                                  ? 'fill-yellow-400 text-yellow-400'
                                                  : 'text-gray-300'
                                              }`}
                                            />
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-warmbrown mb-2">Comment</label>
                                      <textarea
                                        value={reviewForm.comment}
                                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                                      />
                                    </div>
                                    <div className="flex gap-3">
                                      <button
                                        onClick={() => handleReviewUpdate(review.id)}
                                        className="px-6 py-2 bg-rosegold text-white rounded-xl hover:bg-rosegold/90 transition-all"
                                      >
                                        Save Changes
                                      </button>
                                      <button
                                        onClick={() => setEditingReviewId(null)}
                                        className="px-6 py-2 bg-gray-200 text-warmbrown rounded-xl hover:bg-gray-300 transition-all"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-gray-700 mt-2">{review.comment}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                      {!review.approved && (
                                        <span className="text-yellow-600">Pending Approval</span>
                                      )}
                                      {review.updatedAt !== review.createdAt && (
                                        <span className="text-gray-500">(Edited)</span>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )})}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-warmbrown mb-6">Security Settings</h2>

                  {profile?.provider === 'google' ? (
                    <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-blue-800">
                        You are using Google Sign-In. Password management is handled by your Google account.
                      </p>
                    </div>
                  ) : (
                    <div className="max-w-md">
                      <h3 className="text-lg font-bold text-warmbrown mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                          <p className="text-xs text-gray-600 mt-1">Minimum 8 characters</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warmbrown mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-softgold/50 rounded-xl focus:ring-2 focus:ring-rosegold"
                          />
                        </div>
                        <button
                          onClick={handlePasswordChange}
                          className="w-full px-6 py-3 bg-rosegold text-white rounded-xl hover:bg-rosegold/90 transition-all"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Account Controls Tab */}
              {activeTab === 'controls' && (
                <div>
                  <h2 className="text-2xl font-bold text-warmbrown mb-6">Account Controls</h2>

                  <div className="space-y-6">
                    {/* Delete Account */}
                    <div className="p-6 border border-red-300 bg-red-50 rounded-xl">
                      <h3 className="text-lg font-bold text-red-700 mb-2">Delete Account</h3>
                      <p className="text-gray-600 mb-2">
                        Permanently delete your account and all personal data. This action cannot be undone.
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Note: Order history will be retained for business records but anonymized.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                      >
                        Delete Account Permanently
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
