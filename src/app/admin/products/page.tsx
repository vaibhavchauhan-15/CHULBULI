'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import { FiEdit, FiTrash2, FiPlus, FiPackage, FiStar, FiEyeOff, FiMoreVertical } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    category: 'earrings',
    stock: '',
    images: '',
    material: '',
    featured: false,
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
      return
    }
    fetchProducts()
  }, [user, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(files)

    // Create preview URLs
    const previewUrls = files.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls(previewUrls)
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedImages.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    setUploading(true)
    
    try {
      // Upload images to Cloudinary
      const uploadFormData = new FormData()
      selectedImages.forEach((file) => {
        uploadFormData.append('images', file)
      })

      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload images')
      }

      const { urls } = await uploadResponse.json()

      // Create product with uploaded image URLs
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...formData, images: urls }),
      })

      if (response.ok) {
        toast.success('Product added successfully')
        setShowAddModal(false)
        setFormData({
          name: '',
          description: '',
          price: '',
          discount: '0',
          category: 'earrings',
          stock: '',
          images: '',
          material: '',
          featured: false,
        })
        setSelectedImages([])
        setImagePreviewUrls([])
        fetchProducts()
      } else {
        toast.error('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      // Force delete by default (removes product and all order references)
      const response = await fetch(`/api/admin/products/${id}?force=true`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        fetchProducts()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount: product.discount?.toString() || '0',
      category: product.category,
      stock: product.stock.toString(),
      images: product.images,
      material: product.material || '',
      featured: product.featured || false,
    })
    setImagePreviewUrls(Array.isArray(product.images) ? product.images : [product.images])
    setShowEditModal(true)
    setActiveDropdown(null)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setUploading(true)

    try {
      let imageUrls = imagePreviewUrls

      // Upload new images if selected
      if (selectedImages.length > 0) {
        const uploadFormData = new FormData()
        selectedImages.forEach((file) => {
          uploadFormData.append('images', file)
        })

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images')
        }

        const { urls } = await uploadResponse.json()
        imageUrls = urls
      }

      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ...formData, images: imageUrls }),
      })

      if (response.ok) {
        toast.success('Product updated successfully')
        setShowEditModal(false)
        setEditingProduct(null)
        setSelectedImages([])
        setImagePreviewUrls([])
        fetchProducts()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    } finally {
      setUploading(false)
    }
  }

  const handleQuickAction = async (productId: string, action: string) => {
    const product = products.find((p: any) => p.id === productId)
    if (!product) return

    setActiveDropdown(null)

    try {
      let updateData = {}
      
      switch (action) {
        case 'out-of-stock':
          updateData = { ...product, stock: 0 }
          break
        case 'toggle-featured':
          updateData = { ...product, featured: !product.featured }
          break
        case 'duplicate':
          // Create a duplicate product
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              ...product,
              name: `${product.name} (Copy)`,
              id: undefined,
            }),
          })
          if (response.ok) {
            toast.success('Product duplicated successfully')
            fetchProducts()
          }
          return
        default:
          return
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const actionMessages = {
          'out-of-stock': 'Product marked as out of stock',
          'toggle-featured': product.featured ? 'Removed from featured' : 'Marked as featured',
        }
        toast.success(actionMessages[action as keyof typeof actionMessages])
        fetchProducts()
      } else {
        toast.error('Failed to update product')
      }
    } catch (error) {
      console.error('Quick action error:', error)
      toast.error('Failed to update product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '0',
      category: 'earrings',
      stock: '',
      images: '',
      material: '',
      featured: false,
    })
    setSelectedImages([])
    setImagePreviewUrls([])
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-rose-gold">
                ← Back
              </Link>
              <h1 className="text-2xl font-playfair font-bold">Products</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus /> Add Product
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 && (
                          <Image
                            src={Array.isArray(product.images) ? product.images[0] : product.images}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 max-w-xs truncate">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blush-pink/30 text-charcoal capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{product.price}</div>
                      {product.discount > 0 && (
                        <span className="text-xs text-green-600">
                          {product.discount}% OFF
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock === 0 
                            ? 'bg-red-100 text-red-800' 
                            : product.stock <= 10 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                          <FiStar className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === product.id ? null : product.id)}
                            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="More Actions"
                          >
                            <FiMoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeDropdown === product.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setActiveDropdown(null)}
                              />
                              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                <button
                                  onClick={() => handleQuickAction(product.id, 'out-of-stock')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                  disabled={product.stock === 0}
                                >
                                  <FiEyeOff className="w-4 h-4" />
                                  Mark as Out of Stock
                                </button>
                                <button
                                  onClick={() => handleQuickAction(product.id, 'toggle-featured')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <FiStar className="w-4 h-4" />
                                  {product.featured ? 'Remove from Featured' : 'Mark as Featured'}
                                </button>
                                <button
                                  onClick={() => handleQuickAction(product.id, 'duplicate')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <FiPackage className="w-4 h-4" />
                                  Duplicate Product
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                  Delete Product
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-playfair font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
              />
              <textarea
                placeholder="Description *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input-field min-h-[100px]"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="input-field"
                />
              </div>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="earrings">Earrings</option>
                <option value="necklaces">Necklaces</option>
                <option value="rings">Rings</option>
                <option value="bangles">Bangles</option>
                <option value="sets">Sets</option>
              </select>
              <input
                type="number"
                placeholder="Stock Quantity *"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="input-field"
              />
              
              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  required={selectedImages.length === 0}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-rose-gold/10 file:text-rose-gold
                    hover:file:bg-rose-gold/20
                    cursor-pointer"
                />
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Material (optional)"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="input-field"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-rose-gold"
                />
                <span>Featured Product</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="btn-secondary flex-1"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-playfair font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-field"
              />
              <textarea
                placeholder="Description *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input-field min-h-[100px]"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Price *"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="input-field"
                />
              </div>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="earrings">Earrings</option>
                <option value="necklaces">Necklaces</option>
                <option value="rings">Rings</option>
                <option value="bangles">Bangles</option>
                <option value="sets">Sets</option>
              </select>
              <input
                type="number"
                placeholder="Stock Quantity *"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="input-field"
              />
              
              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images (Upload new images to replace current ones)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-rose-gold/10 file:text-rose-gold
                    hover:file:bg-rose-gold/20
                    cursor-pointer"
                />
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        {selectedImages.length > 0 && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Material (optional)"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="input-field"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-rose-gold"
                />
                <span>Featured Product</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                  disabled={uploading}
                >
                  {uploading ? 'Updating...' : 'Update Product'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingProduct(null)
                    resetForm()
                  }}
                  className="btn-secondary flex-1"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
