'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import AdminNavbar from '@/components/AdminNavbar'
import { getCloudinaryThumbnailUrl } from '@/lib/cloudinary-url'
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiPackage,
  FiStar,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const ProductFormModal = dynamic(() => import('@/components/ProductFormModal'), {
  ssr: false,
})

interface PaginationMeta {
  page: number
  limit: number
  totalCount: number
  totalPages: number
}

interface ProductsPayload {
  products: any[]
  pagination: PaginationMeta
}

interface AdminProductsClientProps {
  initialProducts: any[]
  initialPagination: PaginationMeta
  initialFilters: {
    search: string
    category: string
    status: string
  }
}

const fetcher = async (url: string): Promise<ProductsPayload> => {
  const response = await fetch(url, { credentials: 'include' })
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return response.json()
}

export default function AdminProductsClient({
  initialProducts,
  initialPagination,
  initialFilters,
}: AdminProductsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [loadingProductDetails, setLoadingProductDetails] = useState(false)
  const [searchInput, setSearchInput] = useState(initialFilters.search)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    shortDescription: '',
    category: 'earrings',
    subCategory: '',
    brand: '',
    productStatus: 'draft',
    basePrice: '',
    price: '',
    discount: '0',
    discountType: 'percentage',
    gstPercentage: '3',
    costPrice: '',
    stock: '',
    lowStockAlert: '5',
    stockStatus: 'in_stock',
    images: '',
    thumbnailImage: '',
    videoUrl: '',
    material: '',
    stoneType: '',
    color: '',
    earringType: '',
    closureType: '',
    weight: '',
    dimensionLength: '',
    dimensionWidth: '',
    finish: '',
    productWeight: '',
    shippingClass: 'standard',
    packageIncludes: '',
    codAvailable: true,
    seoTitle: '',
    metaDescription: '',
    urlSlug: '',
    searchTags: '',
    featured: false,
    isNewArrival: false,
    careInstructions: '',
    returnPolicy: '',
    warranty: '',
    certification: '',
    reviewsEnabled: true,
  })

  const activePage = Number(searchParams.get('page') || initialPagination.page || 1)
  const activeLimit = Number(searchParams.get('limit') || initialPagination.limit || 12)
  const activeSearch = searchParams.get('search') || initialFilters.search || ''
  const activeCategory = searchParams.get('category') || initialFilters.category || 'all'
  const activeStatus = searchParams.get('status') || initialFilters.status || 'all'

  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set('page', String(activePage))
    params.set('limit', String(activeLimit))
    if (activeSearch) params.set('search', activeSearch)
    if (activeCategory && activeCategory !== 'all') params.set('category', activeCategory)
    if (activeStatus && activeStatus !== 'all') params.set('status', activeStatus)
    return params.toString()
  }, [activePage, activeLimit, activeSearch, activeCategory, activeStatus])

  const { data, mutate, isLoading } = useSWR<ProductsPayload>(
    `/api/admin/products?${queryString}`,
    fetcher,
    {
      fallbackData: {
        products: initialProducts,
        pagination: initialPagination,
      },
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  )

  const products = data?.products || []
  const pagination = data?.pagination || initialPagination

  const updateRoute = (updates: Record<string, string | undefined>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    if (resetPage) {
      params.set('page', '1')
    } else if (!params.get('page')) {
      params.set('page', String(activePage))
    }

    if (!params.get('limit')) {
      params.set('limit', String(activeLimit))
    }

    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== activeSearch) {
        updateRoute({ search: searchInput || undefined }, true)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchInput, activeSearch]) // eslint-disable-line react-hooks/exhaustive-deps

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
        await mutate()
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

    const previous = data
    await mutate(
      (current) => {
        if (!current) return current
        return {
          ...current,
          products: current.products.filter((product: any) => product.id !== id),
          pagination: {
            ...current.pagination,
            totalCount: Math.max(0, current.pagination.totalCount - 1),
          },
        }
      },
      false
    )

    try {
      const response = await fetch(`/api/admin/products/${id}?force=true`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Product deleted successfully')
        await mutate()
      } else {
        const payload = await response.json()
        toast.error(payload.error || 'Failed to delete product')
        await mutate(previous, false)
      }
    } catch (error) {
      toast.error('Failed to delete product')
      await mutate(previous, false)
    }
  }

  const handleEditProduct = async (product: any) => {
    setLoadingProductDetails(true)
    let productDetails = product

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        credentials: 'include',
      })

      if (response.ok) {
        const payload = await response.json()
        if (payload?.product) {
          productDetails = payload.product
        }
      }
    } catch (error) {
      toast.error('Using list data for edit (full details could not be loaded)')
    } finally {
      setLoadingProductDetails(false)
    }

    setEditingProduct(productDetails)
    setFormData({
      name: productDetails.name || '',
      sku: productDetails.sku || '',
      description: productDetails.description || '',
      shortDescription: productDetails.shortDescription || '',
      category: productDetails.category || 'earrings',
      subCategory: productDetails.subCategory || '',
      brand: productDetails.brand || '',
      productStatus: productDetails.productStatus || 'draft',
      basePrice: productDetails.basePrice?.toString() || '',
      price: productDetails.price?.toString() || '',
      discount: productDetails.discount?.toString() || '0',
      discountType: productDetails.discountType || 'percentage',
      gstPercentage: productDetails.gstPercentage?.toString() || '3',
      costPrice: productDetails.costPrice?.toString() || '',
      stock: productDetails.stock?.toString() || '',
      lowStockAlert: productDetails.lowStockAlert?.toString() || '5',
      stockStatus: productDetails.stockStatus || 'in_stock',
      images: productDetails.images || '',
      thumbnailImage: productDetails.thumbnailImage || '',
      videoUrl: productDetails.videoUrl || '',
      material: productDetails.material || '',
      stoneType: productDetails.stoneType || '',
      color: productDetails.color || '',
      earringType: productDetails.earringType || '',
      closureType: productDetails.closureType || '',
      weight: productDetails.weight?.toString() || '',
      dimensionLength: productDetails.dimensionLength?.toString() || '',
      dimensionWidth: productDetails.dimensionWidth?.toString() || '',
      finish: productDetails.finish || '',
      productWeight: productDetails.productWeight?.toString() || '',
      shippingClass: productDetails.shippingClass || 'standard',
      packageIncludes: productDetails.packageIncludes || '',
      codAvailable: productDetails.codAvailable !== undefined ? productDetails.codAvailable : true,
      seoTitle: productDetails.seoTitle || '',
      metaDescription: productDetails.metaDescription || '',
      urlSlug: productDetails.urlSlug || '',
      searchTags: Array.isArray(productDetails.searchTags) ? productDetails.searchTags.join(', ') : '',
      featured: productDetails.featured || false,
      isNewArrival: productDetails.isNewArrival || false,
      careInstructions: productDetails.careInstructions || '',
      returnPolicy: productDetails.returnPolicy || '',
      warranty: productDetails.warranty || '',
      certification: productDetails.certification || '',
      reviewsEnabled: productDetails.reviewsEnabled !== undefined ? productDetails.reviewsEnabled : true,
    })
    const normalizedImages = Array.isArray(productDetails.images)
      ? productDetails.images
      : productDetails.images
      ? [productDetails.images]
      : []
    setImagePreviewUrls(normalizedImages)
    setShowEditModal(true)
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
        await mutate()
      } else {
        const payload = await response.json()
        toast.error(payload.error || 'Failed to update product')
      }
    } catch (error) {
      toast.error('Failed to update product')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      shortDescription: '',
      category: 'earrings',
      subCategory: '',
      brand: '',
      productStatus: 'draft',
      basePrice: '',
      price: '',
      discount: '0',
      discountType: 'percentage',
      gstPercentage: '3',
      costPrice: '',
      stock: '',
      lowStockAlert: '5',
      stockStatus: 'in_stock',
      images: '',
      thumbnailImage: '',
      videoUrl: '',
      material: '',
      stoneType: '',
      color: '',
      earringType: '',
      closureType: '',
      weight: '',
      dimensionLength: '',
      dimensionWidth: '',
      finish: '',
      productWeight: '',
      shippingClass: 'standard',
      packageIncludes: '',
      codAvailable: true,
      seoTitle: '',
      metaDescription: '',
      urlSlug: '',
      searchTags: '',
      featured: false,
      isNewArrival: false,
      careInstructions: '',
      returnPolicy: '',
      warranty: '',
      certification: '',
      reviewsEnabled: true,
    })
    setSelectedImages([])
    setImagePreviewUrls([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-champagne via-pearl to-sand">
      <AdminNavbar />

      <main className="px-4 md:px-8 py-6 md:py-8 pb-24 lg:pb-8 overflow-y-auto min-h-screen max-w-[1800px]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4 md:gap-6">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-playfair font-bold text-warmbrown mb-1 md:mb-2">Products Management</h1>
            <p className="text-xs md:text-sm text-taupe font-medium">Manage your product catalog</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 md:gap-2.5 px-5 md:px-6 py-3 md:py-3.5 bg-gradient-to-r from-rosegold to-softgold text-white rounded-xl md:rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold text-sm shadow-lg active:scale-95 md:hover:scale-105 touch-target"
          >
            <FiPlus size={18} className="md:w-5 md:h-5 font-bold" /> <span>Add Product</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-5 md:mb-6">
          <div className="md:col-span-2 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe/70" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, SKU, or description..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-softgold/30 bg-white/90 focus:outline-none focus:border-rosegold/50 text-warmbrown"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={activeCategory}
              onChange={(e) => updateRoute({ category: e.target.value }, true)}
              className="px-3 py-3 rounded-xl border-2 border-softgold/30 bg-white/90 text-warmbrown focus:outline-none focus:border-rosegold/50"
            >
              <option value="all">All Categories</option>
              <option value="earrings">Earrings</option>
              <option value="necklaces">Necklaces</option>
              <option value="rings">Rings</option>
              <option value="bangles">Bangles</option>
              <option value="sets">Sets</option>
            </select>
            <select
              value={activeStatus}
              onChange={(e) => updateRoute({ status: e.target.value }, true)}
              className="px-3 py-3 rounded-xl border-2 border-softgold/30 bg-white/90 text-warmbrown focus:outline-none focus:border-rosegold/50"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {isLoading && !data ? (
          <div className="grid grid-cols-1 gap-4 md:gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-lg animate-pulse border-2 border-softgold/20">
                <div className="h-6 md:h-8 bg-sand/40 rounded-xl w-1/3 mb-3 md:mb-4"></div>
                <div className="h-4 md:h-5 bg-sand/40 rounded-lg w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5">
            {products.map((product: any) => {
              const primaryImage = Array.isArray(product.images) ? product.images[0] : product.images
              const optimizedImage = getCloudinaryThumbnailUrl(primaryImage, { width: 320, height: 320 })

              return (
                <div key={product.id} className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-7 shadow-xl hover:shadow-2xl transition-all border-2 border-softgold/20 hover:border-rosegold/30 group">
                  <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6">
                    {optimizedImage && (
                      <div className="flex-shrink-0 w-full lg:w-auto">
                        <Image
                          src={optimizedImage}
                          alt={product.name}
                          width={140}
                          height={140}
                          className="w-full lg:w-32 h-56 lg:h-32 object-cover rounded-2xl shadow-md border-2 border-softgold/30 group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}

                    <div className="flex-1 w-full">
                      <div className="flex flex-col lg:flex-row items-start justify-between mb-4 gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <Link href={`/products/${product.id}`}>
                              <h3 className="font-playfair font-bold text-warmbrown text-lg lg:text-xl hover:text-rosegold transition-colors cursor-pointer">{product.name}</h3>
                            </Link>
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
                            disabled={loadingProductDetails}
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

                      <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t-2 border-softgold/20">
                        <div>
                          <p className="text-xs text-taupe font-medium mb-1">Price</p>
                          <p className="text-base font-bold text-warmbrown">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(product.price || 0))}
                            {Number(product.discount) > 0 && (
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
                        <div>
                          <p className="text-xs text-taupe font-medium mb-1">Reviews</p>
                          <span className="text-sm font-semibold text-warmbrown bg-softgold/20 px-3 py-1.5 rounded-xl border border-softgold/30">
                            {product._count?.reviews || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {products.length === 0 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-16 text-center shadow-xl border-2 border-softgold/30">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-sand/50 to-softgold/30 rounded-3xl flex items-center justify-center">
                  <FiPackage size={48} className="text-rosegold" />
                </div>
                <p className="text-warmbrown text-2xl font-playfair font-bold mb-2">No products found</p>
                <p className="text-taupe text-base mb-6">Try another search/filter or add a new product.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rosegold to-softgold text-white rounded-2xl hover:shadow-xl transition-all font-semibold shadow-lg hover:scale-105"
                >
                  <FiPlus size={20} /> Add Product
                </button>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-2 pt-2">
                <button
                  onClick={() => updateRoute({ page: String(Math.max(1, pagination.page - 1)) })}
                  disabled={pagination.page <= 1}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-softgold/30 bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft /> Previous
                </button>
                <p className="text-sm font-semibold text-warmbrown">
                  Page {pagination.page} of {pagination.totalPages} ({pagination.totalCount} products)
                </p>
                <button
                  onClick={() => updateRoute({ page: String(Math.min(pagination.totalPages, pagination.page + 1)) })}
                  disabled={pagination.page >= pagination.totalPages}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-softgold/30 bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

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
