'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import AdminSidebar from '@/components/AdminSidebar'
import ProductFormModal from '@/components/ProductFormModal'
import { 
  FiBell, FiSettings, FiSearch, FiEdit, FiTrash2, 
  FiPlus, FiEyeOff, FiMoreVertical, FiX, FiPackage, FiStar
} from 'react-icons/fi'
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
    // Basic Information
    name: '',
    sku: '',
    description: '',
    shortDescription: '',
    category: 'earrings',
    subCategory: '',
    brand: '',
    productStatus: 'draft',
    
    // Pricing & Tax
    basePrice: '',
    price: '',
    discount: '0',
    discountType: 'percentage',
    gstPercentage: '3',
    costPrice: '',
    
    // Inventory & Stock
    stock: '',
    lowStockAlert: '5',
    stockStatus: 'in_stock',
    
    // Images & Media
    images: '',
    thumbnailImage: '',
    videoUrl: '',
    
    // Earring-Specific Attributes
    material: '',
    stoneType: '',
    color: '',
    earringType: '',
    closureType: '',
    weight: '',
    dimensionLength: '',
    dimensionWidth: '',
    finish: '',
    
    // Shipping & Packaging
    productWeight: '',
    shippingClass: 'standard',
    packageIncludes: '',
    codAvailable: true,
    
    // SEO & Visibility
    seoTitle: '',
    metaDescription: '',
    urlSlug: '',
    searchTags: '',
    featured: false,
    isNewArrival: false,
    
    // Compliance & Trust
    careInstructions: '',
    returnPolicy: '',
    warranty: '',
    certification: '',
    
    // Reviews
    reviewsEnabled: true,
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
      // Error fetching products
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(files)
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
        resetForm()
        fetchProducts()
      } else {
        toast.error('Failed to add product')
      }
    } catch (error) {
      toast.error('Failed to add product')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
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
      toast.error('Failed to delete product')
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setFormData({
      // Basic Information
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      category: product.category || 'earrings',
      subCategory: product.subCategory || '',
      brand: product.brand || '',
      productStatus: product.productStatus || 'draft',
      
      // Pricing & Tax
      basePrice: product.basePrice?.toString() || '',
      price: product.price?.toString() || '',
      discount: product.discount?.toString() || '0',
      discountType: product.discountType || 'percentage',
      gstPercentage: product.gstPercentage?.toString() || '3',
      costPrice: product.costPrice?.toString() || '',
      
      // Inventory & Stock
      stock: product.stock?.toString() || '',
      lowStockAlert: product.lowStockAlert?.toString() || '5',
      stockStatus: product.stockStatus || 'in_stock',
      
      // Images & Media
      images: product.images || '',
      thumbnailImage: product.thumbnailImage || '',
      videoUrl: product.videoUrl || '',
      
      // Earring-Specific Attributes
      material: product.material || '',
      stoneType: product.stoneType || '',
      color: product.color || '',
      earringType: product.earringType || '',
      closureType: product.closureType || '',
      weight: product.weight?.toString() || '',
      dimensionLength: product.dimensionLength?.toString() || '',
      dimensionWidth: product.dimensionWidth?.toString() || '',
      finish: product.finish || '',
      
      // Shipping & Packaging
      productWeight: product.productWeight?.toString() || '',
      shippingClass: product.shippingClass || 'standard',
      packageIncludes: product.packageIncludes || '',
      codAvailable: product.codAvailable !== undefined ? product.codAvailable : true,
      
      // SEO & Visibility
      seoTitle: product.seoTitle || '',
      metaDescription: product.metaDescription || '',
      urlSlug: product.urlSlug || '',
      searchTags: Array.isArray(product.searchTags) ? product.searchTags.join(', ') : '',
      featured: product.featured || false,
      isNewArrival: product.isNewArrival || false,
      
      // Compliance & Trust
      careInstructions: product.careInstructions || '',
      returnPolicy: product.returnPolicy || '',
      warranty: product.warranty || '',
      certification: product.certification || '',
      
      // Reviews
      reviewsEnabled: product.reviewsEnabled !== undefined ? product.reviewsEnabled : true,
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
        resetForm()
        fetchProducts()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update product')
      }
    } catch (error) {
      toast.error('Failed to update product')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      // Basic Information
      name: '',
      sku: '',
      description: '',
      shortDescription: '',
      category: 'earrings',
      subCategory: '',
      brand: '',
      productStatus: 'draft',
      
      // Pricing & Tax
      basePrice: '',
      price: '',
      discount: '0',
      discountType: 'percentage',
      gstPercentage: '3',
      costPrice: '',
      
      // Inventory & Stock
      stock: '',
      lowStockAlert: '5',
      stockStatus: 'in_stock',
      
      // Images & Media
      images: '',
      thumbnailImage: '',
      videoUrl: '',
      
      // Earring-Specific Attributes
      material: '',
      stoneType: '',
      color: '',
      earringType: '',
      closureType: '',
      weight: '',
      dimensionLength: '',
      dimensionWidth: '',
      finish: '',
      
      // Shipping & Packaging
      productWeight: '',
      shippingClass: 'standard',
      packageIncludes: '',
      codAvailable: true,
      
      // SEO & Visibility
      seoTitle: '',
      metaDescription: '',
      urlSlug: '',
      searchTags: '',
      featured: false,
      isNewArrival: false,
      
      // Compliance & Trust
      careInstructions: '',
      returnPolicy: '',
      warranty: '',
      certification: '',
      
      // Reviews
      reviewsEnabled: true,
    })
    setSelectedImages([])
    setImagePreviewUrls([])
  }

  if (!user || user.role !== 'admin') return null

  return (
    <div className="flex min-h-screen bg-champagne">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-playfair font-semibold text-warmbrown mb-1">Products Management</h1>
            <p className="text-sm text-taupe">Manage your jewelry inventory</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rosegold text-pearl rounded-xl hover:bg-softgold transition-colors font-medium text-sm shadow-sm"
            >
              <FiPlus size={18} /> Add Product
            </button>
            <div className="flex items-center gap-5 text-taupe pl-4 border-l border-softgold/30">
              <button className="hover:text-rosegold transition-colors relative">
                <FiBell size={20} />
              </button>
              <button className="hover:text-rosegold transition-colors">
                <FiSettings size={20} />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-rosegold to-softgold rounded-xl flex items-center justify-center text-pearl font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid (Card-based instead of table) */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-pearl rounded-2xl p-6 shadow-sm animate-pulse border border-softgold/20">
                <div className="h-6 bg-sand rounded w-1/4 mb-3"></div>
                <div className="h-4 bg-sand rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product: any) => (
              <div key={product.id} className="bg-pearl rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-softgold/20">
                <div className="flex items-start gap-6">
                  {/* Product Image */}
                  {product.images && product.images.length > 0 && (
                    <div className="flex-shrink-0">
                      <Image
                        src={Array.isArray(product.images) ? product.images[0] : product.images}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-playfair font-semibold text-warmbrown">{product.name}</h3>
                          {product.featured && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-softgold/20 text-rosegold border border-softgold/30">
                              <FiStar size={12} /> Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-taupe max-w-2xl">{product.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-rosegold hover:bg-softgold/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Product Meta */}
                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <p className="text-xs text-taupe">Price</p>
                        <p className="text-sm font-semibold text-warmbrown">
                          ₹{product.price}
                          {product.discount > 0 && (
                            <span className="ml-2 text-xs text-rosegold">
                              {product.discount}% OFF
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-taupe">Stock</p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                            product.stock === 0 
                              ? 'bg-red-50 text-red-700 border border-red-100' 
                              : product.stock <= 10 
                              ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}
                        >
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-taupe">Category</p>
                        <span className="text-sm font-medium text-warmbrown capitalize">{product.category}</span>
                      </div>
                      {product.material && (
                        <div>
                          <p className="text-xs text-taupe">Material</p>
                          <span className="text-sm font-medium text-warmbrown">{product.material}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="bg-pearl rounded-2xl p-12 text-center shadow-sm border border-softgold/20">
                <FiPackage size={48} className="mx-auto text-sand mb-4" />
                <p className="text-warmbrown text-lg font-playfair">No products yet</p>
                <p className="text-taupe text-sm mt-2">Click &quot;Add Product&quot; to create your first product</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Right Panel - Product Stats */}
      <aside className="w-[28%] px-4 py-6 hidden xl:block">
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Product Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Total Products</span>
                <span className="font-semibold text-gray-800">{products.length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">In Stock</span>
                <span className="font-medium text-emerald-600">
                  {products.filter((p: any) => p.stock > 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="font-medium text-red-600">
                  {products.filter((p: any) => p.stock === 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Featured</span>
                <span className="font-medium text-amber-600">
                  {products.filter((p: any) => p.featured).length}
                </span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-100 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Categories</h3>
            <div className="space-y-2">
              {Array.from(new Set(products.map((p: any) => p.category))).map((category: any) => (
                <div key={category} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-700 capitalize">{category}</span>
                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-lg">
                    {products.filter((p: any) => p.category === category).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Add/Edit Product Modal */}
      <ProductFormModal
        show={showAddModal || showEditModal}
        isEdit={showEditModal}
        formData={formData}
        setFormData={setFormData}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          resetForm()
          setEditingProduct(null)
        }}
        onSubmit={showEditModal ? handleUpdateProduct : handleAddProduct}
        uploading={uploading}
        selectedImages={selectedImages}
        imagePreviewUrls={imagePreviewUrls}
        handleImageSelect={handleImageSelect}
        removeImage={removeImage}
      />
    </div>
  )
}
