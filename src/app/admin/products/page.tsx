'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import AdminSidebar from '@/components/AdminSidebar'
import AdminMobileNav from '@/components/AdminMobileNav'
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
    <div className="min-h-screen bg-gradient-to-br from-champagne via-pearl to-sand">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-72 px-4 md:px-8 py-6 md:py-8 pb-24 lg:pb-8 overflow-y-auto min-h-screen">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-playfair font-bold text-warmbrown mb-2">Products Management</h1>
            <p className="text-sm text-taupe font-medium">Manage your jewelry inventory and product catalog</p>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-rosegold to-softgold text-white rounded-2xl hover:shadow-xl transition-all font-semibold text-sm shadow-lg hover:scale-105 flex-1 lg:flex-none"
            >
              <FiPlus size={20} className="font-bold" /> <span>Add New Product</span>
            </button>
            <div className="flex items-center gap-4 pl-5 border-l-2 border-softgold/40">
              <button className="relative p-2.5 hover:bg-white/80 rounded-xl transition-all hover:text-rosegold group">
                <FiBell size={22} className="transition-transform group-hover:scale-110" />
              </button>
              <button className="p-2.5 hover:bg-white/80 rounded-xl transition-all hover:text-rosegold group hidden md:block">
                <FiSettings size={22} className="transition-transform group-hover:rotate-90 duration-500" />
              </button>
              <div className="w-11 h-11 bg-gradient-to-br from-rosegold via-softgold to-[#B8916B] rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg ring-2 ring-white/50 hover:scale-105 transition-transform cursor-pointer">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid (Card-based instead of table) */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-3xl p-7 shadow-lg animate-pulse border-2 border-softgold/20">
                <div className="h-8 bg-sand/40 rounded-xl w-1/3 mb-4"></div>
                <div className="h-5 bg-sand/40 rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-7 shadow-xl hover:shadow-2xl transition-all border-2 border-softgold/20 hover:border-rosegold/30 group">
                <div className="flex flex-col lg:flex-row items-start gap-6">
                  {/* Product Image */}
                  {product.images && product.images.length > 0 && (
                    <div className="flex-shrink-0 w-full lg:w-auto">
                      <Image
                        src={Array.isArray(product.images) ? product.images[0] : product.images}
                        alt={product.name}
                        width={140}
                        height={140}
                        className="w-full lg:w-32 h-56 lg:h-32 object-cover rounded-2xl shadow-md border-2 border-softgold/30 group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col lg:flex-row items-start justify-between mb-4 gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-playfair font-bold text-warmbrown text-lg lg:text-xl">{product.name}</h3>
                          {product.featured && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border-2 border-amber-300 shadow-sm">
                              <FiStar size={14} /> Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-taupe line-clamp-2 leading-relaxed">{product.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 lg:flex-none px-4 py-2.5 text-rosegold bg-rosegold/10 hover:bg-rosegold hover:text-white rounded-xl transition-all font-semibold text-sm shadow-sm hover:shadow-md border-2 border-rosegold/30 hover:border-rosegold flex items-center justify-center gap-2"
                          title="Edit"
                        >
                          <FiEdit size={18} /> <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 lg:flex-none px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all font-semibold text-sm shadow-sm hover:shadow-md border-2 border-red-200 hover:border-red-600 flex items-center justify-center gap-2"
                          title="Delete"
                        >
                          <FiTrash2 size={18} /> <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Product Meta */}
                    <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t-2 border-softgold/20">
                      <div>
                        <p className="text-xs text-taupe font-medium mb-1">Price</p>
                        <p className="text-base font-bold text-warmbrown">
                          ₹{product.price}
                          {product.discount > 0 && (
                            <span className="ml-2 text-sm font-semibold text-rosegold bg-rosegold/10 px-2 py-1 rounded-lg">
                              {product.discount}% OFF
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-taupe font-medium mb-1">Stock Status</p>
                        <span
                          className={`inline-flex px-3 py-1.5 text-xs font-bold rounded-xl shadow-sm ${
                            product.stock === 0 
                              ? 'bg-red-100 text-red-700 border-2 border-red-200' 
                              : product.stock <= 10 
                              ? 'bg-amber-100 text-amber-700 border-2 border-amber-200' 
                              : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                          }`}
                        >
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-taupe font-medium mb-1">Category</p>
                        <span className="text-sm font-semibold text-warmbrown capitalize bg-sand/40 px-3 py-1.5 rounded-xl">{product.category}</span>
                      </div>
                      {product.material && (
                        <div>
                          <p className="text-xs text-taupe font-medium mb-1">Material</p>
                          <span className="text-sm font-semibold text-warmbrown bg-softgold/20 px-3 py-1.5 rounded-xl border border-softgold/30">{product.material}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-16 text-center shadow-xl border-2 border-softgold/30">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sand/50 to-softgold/30 rounded-3xl flex items-center justify-center">
                  <FiPackage size={48} className="text-rosegold" />
                </div>
                <p className="text-warmbrown text-2xl font-playfair font-bold mb-2">No products yet</p>
                <p className="text-taupe text-base mb-6">Start building your jewelry catalog by adding your first product</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rosegold to-softgold text-white rounded-2xl hover:shadow-xl transition-all font-semibold shadow-lg hover:scale-105"
                >
                  <FiPlus size={20} /> Add Your First Product
                </button>
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

      {/* Mobile Navigation */}
      <AdminMobileNav />

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
