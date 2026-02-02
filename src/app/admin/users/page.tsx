'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import AdminSidebar from '@/components/AdminSidebar'
import AdminMobileNav from '@/components/AdminMobileNav'
import { 
  FiUser, FiMail, FiCalendar, FiEdit2, FiTrash2, FiSearch,
  FiChevronLeft, FiChevronRight, FiShield, FiUsers as FiUsersIcon
} from 'react-icons/fi'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: string
  provider: string
  photoUrl: string | null
  createdAt: string
  updatedAt: string
}

interface UserStats {
  totalOrders: number
  totalReviews: number
  totalSpent: number
}

export default function AdminUsersPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [providerFilter, setProviderFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingRole, setEditingRole] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, page, roleFilter, providerFilter])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchUsers()
      } else {
        setPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        role: roleFilter,
        provider: providerFilter,
      })

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.pagination.totalPages)
        setTotalCount(data.pagination.totalCount)
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      toast.error('Error loading users')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setUserStats(data.stats)
      }
    } catch (error) {
      toast.error('Failed to load user details')
    }
  }

  const handleEditUser = (userData: User) => {
    setSelectedUser(userData)
    setEditingRole(userData.role)
    setShowEditModal(true)
    fetchUserDetails(userData.id)
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: editingRole }),
      })

      if (response.ok) {
        toast.success('User role updated successfully')
        setShowEditModal(false)
        fetchUsers()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update user')
      }
    } catch (error) {
      toast.error('Error updating user')
    }
  }

  const handleDeleteUser = (userData: User) => {
    setSelectedUser(userData)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('User deleted successfully')
        setShowDeleteModal(false)
        fetchUsers()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete user')
      }
    } catch (error) {
      toast.error('Error deleting user')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-rosegold/10">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <AdminMobileNav />

      <main className="lg:ml-72 px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 lg:pb-8 min-h-screen">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-rosegold to-[#C89A7A] rounded-xl shadow-lg">
              <FiUsersIcon className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-darkbrown font-playfair">User Management</h1>
              <p className="text-sm text-gray-600">Manage all registered users</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-rosegold transition-colors"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-rosegold transition-colors"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Provider Filter */}
            <div>
              <select
                value={providerFilter}
                onChange={(e) => {
                  setProviderFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-rosegold transition-colors"
              >
                <option value="all">All Providers</option>
                <option value="email">Email</option>
                <option value="google">Google</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-darkbrown">{users.length}</span> of{' '}
              <span className="font-semibold text-darkbrown">{totalCount}</span> users
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rosegold"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <FiUsersIcon className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-rosegold/10 to-rosegold/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-darkbrown uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-darkbrown uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-darkbrown uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-darkbrown uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-darkbrown uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-darkbrown uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((userData) => (
                      <tr key={userData.id} className="hover:bg-rosegold/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {userData.photoUrl ? (
                              <Image
                                src={userData.photoUrl}
                                alt={userData.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rosegold to-[#C89A7A] flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {userData.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-darkbrown">{userData.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <FiMail className="text-gray-400" size={14} />
                            <span className="text-sm">{userData.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              userData.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <FiShield size={12} />
                            {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            {userData.provider === 'google' ? '🔑 Google' : '📧 Email'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FiCalendar size={14} />
                            {formatDate(userData.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditUser(userData)}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="Edit User"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(userData)}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                              title="Delete User"
                              disabled={userData.id === user.id}
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronLeft />
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-darkbrown mb-4 font-playfair">Edit User</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                {selectedUser.photoUrl ? (
                  <Image
                    src={selectedUser.photoUrl}
                    alt={selectedUser.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rosegold to-[#C89A7A] flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-darkbrown">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              </div>

              {userStats && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">{userStats.totalOrders}</p>
                    <p className="text-xs text-gray-600">Orders</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{userStats.totalReviews}</p>
                    <p className="text-xs text-gray-600">Reviews</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(userStats.totalSpent)}</p>
                    <p className="text-xs text-gray-600">Spent</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-darkbrown mb-2">
                  User Role
                </label>
                <select
                  value={editingRole}
                  onChange={(e) => setEditingRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-rosegold transition-colors"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-rosegold to-[#C89A7A] text-white rounded-xl hover:shadow-lg transition-all font-semibold"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4 font-playfair">Delete User</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedUser.name}</span>? 
              This action cannot be undone and will remove all their data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
