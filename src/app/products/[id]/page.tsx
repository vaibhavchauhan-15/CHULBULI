'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiPackage, FiTruck, FiShield, FiCheck, FiUser, FiHeart } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(5)
  const [imgError, setImgError] = useState<boolean[]>([])
  const addItem = useCartStore((state) => state.addItem)
  const user = useAuthStore((state) => state.user)
  
  // SVG placeholder as data URI
  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Crect fill='%23F2E6D8' width='800' height='800'/%3E%3Ctext fill='%238B6D57' font-family='Arial' font-size='48' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      // Error fetching product
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id, fetchProduct])

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      discount: Number(product.discount),
      image: product.images[0],
      quantity,
      stock: product.stock,
    })

    toast.success('Added to cart!')
  }

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review')
      router.push('/login')
      return
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review')
      return
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: product.id,
          rating,
          comment: reviewText,
        }),
      })

      if (response.ok) {
        toast.success('Review submitted! Waiting for admin approval.')
        setReviewText('')
        setRating(5)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to submit review')
      }
    } catch (error) {
      toast.error('Failed to submit review')
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold"></div>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <button onClick={() => router.push('/products')} className="btn-primary">
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Convert numeric strings from database to numbers
  const price = Number(product.price)
  const discount = Number(product.discount)
  const finalPrice = price - (price * discount) / 100

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12 bg-gradient-to-br from-champagne via-[#F2E6D8] to-sand">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Images */}
            <div>
              <div className="card-luxury overflow-hidden mb-4 shadow-luxury">
                <div className="relative aspect-square">
                  <Image
                    src={(
                      product.images[selectedImage] && 
                      product.images[selectedImage].trim() !== '' && 
                      !imgError[selectedImage]
                    ) ? product.images[selectedImage] : placeholderSvg}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    onError={() => {
                      const newErrors = [...imgError]
                      newErrors[selectedImage] = true
                      setImgError(newErrors)
                    }}
                    unoptimized={!(product.images[selectedImage] && product.images[selectedImage].trim() !== '' && !imgError[selectedImage])}
                  />
                </div>
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`card-luxury overflow-hidden transition-all ${
                        selectedImage === index ? 'ring-2 ring-[#C89A7A] shadow-md' : 'hover:shadow-md'
                      }`}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={(image && image.trim() !== '' && !imgError[index]) ? image : placeholderSvg}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          sizes="(max-width: 1024px) 25vw, 12vw"
                          className="object-cover"
                          onError={() => {
                            const newErrors = [...imgError]
                            newErrors[index] = true
                            setImgError(newErrors)
                          }}
                          unoptimized={!(image && image.trim() !== '' && !imgError[index])}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 text-[#5A3E2B] leading-tight">
                {product.name}
              </h1>

              {product.averageRating > 0 && (
                <div className="flex items-center gap-3 mb-6 bg-white/50 rounded-lg p-3 w-fit border border-[#C89A7A]/10">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(product.averageRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-[#5A3E2B]">{product.averageRating}</span>
                  <span className="text-[#5A3E2B]/60 text-sm">
                    ({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-4xl md:text-5xl font-playfair font-bold text-[#C89A7A]">
                  ₹{finalPrice.toFixed(2)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-2xl text-[#5A3E2B]/40 line-through">
                      ₹{price.toFixed(2)}
                    </span>
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-[#5A3E2B]/80 mb-6 leading-relaxed text-lg">
                {product.description}
              </p>

              {/* Product Details Card */}
              {(product.material || product.category || product.stoneType || product.color || 
                product.weight || product.dimensionLength || product.dimensionWidth || 
                product.subCategory || product.brand) && (
                <div className="mb-6 bg-white/60 rounded-xl p-5 border border-[#C89A7A]/10">
                  <h3 className="font-semibold mb-3 text-[#5A3E2B] flex items-center gap-2">
                    <FiPackage className="w-4 h-4 text-[#C89A7A]" />
                    Product Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {product.material && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5A3E2B]/60 mb-1">Material</span>
                        <span className="text-sm font-medium text-[#5A3E2B] capitalize">
                          {product.material.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                    {product.category && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5A3E2B]/60 mb-1">Category</span>
                        <span className="text-sm font-medium text-[#5A3E2B] capitalize">
                          {product.category}
                        </span>
                      </div>
                    )}
                    {product.subCategory && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5A3E2B]/60 mb-1">Sub-Category</span>
                        <span className="text-sm font-medium text-[#5A3E2B] capitalize">
                          {product.subCategory.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                    {product.brand && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5A3E2B]/60 mb-1">Collection</span>
                        <span className="text-sm font-medium text-[#5A3E2B] capitalize">
                          {product.brand.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                    {product.stoneType && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5A3E2B]/60 mb-1">Stone Type</span>
                        <span className="text-sm font-medium text-[#5A3E2B] capitalize">
                          {product.stoneType.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                    {product.color && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5A3E2B]/60 mb-1">Color</span>
                        <span className="text-sm font-medium text-[#5A3E2B] capitalize">
                          {product.color.replace(/_/g, ' ')}
                        </span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5A3E2B]/60 mb-1">Weight</span>
                        <span className="text-sm font-medium text-[#5A3E2B]">
                          {product.weight}g
                        </span>
                      </div>
                    )}
                    {(product.dimensionLength || product.dimensionWidth) && (
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5A3E2B]/60 mb-1">Dimensions</span>
                        <span className="text-sm font-medium text-[#5A3E2B]">
                          {product.dimensionLength && product.dimensionWidth 
                            ? `${product.dimensionLength}mm × ${product.dimensionWidth}mm`
                            : product.dimensionLength 
                            ? `${product.dimensionLength}mm (L)`
                            : `${product.dimensionWidth}mm (W)`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mb-6 flex items-center gap-2">
                <span className="font-semibold text-[#5A3E2B]">Availability:</span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-2 text-emerald-600 font-medium">
                    <FiCheck className="w-4 h-4" />
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {product.stock > 0 && (
                <>
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-semibold text-[#5A3E2B]">Quantity:</span>
                    <div className="flex items-center bg-white/60 border-2 border-[#C89A7A]/30 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-[#C89A7A]/10 transition-colors text-[#C89A7A]"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="px-6 font-semibold text-[#5A3E2B] min-w-[3rem] text-center">{quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="p-3 hover:bg-[#C89A7A]/10 transition-colors text-[#C89A7A]"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4 group"
                  >
                    <FiShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-white/50 rounded-lg border border-[#C89A7A]/10">
                      <FiTruck className="w-5 h-5 text-[#C89A7A] mx-auto mb-1" />
                      <p className="text-xs text-[#5A3E2B]/70 font-medium">Free Shipping</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 rounded-lg border border-[#C89A7A]/10">
                      <FiShield className="w-5 h-5 text-[#C89A7A] mx-auto mb-1" />
                      <p className="text-xs text-[#5A3E2B]/70 font-medium">Secure Payment</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 rounded-lg border border-[#C89A7A]/10">
                      <FiCheck className="w-5 h-5 text-[#C89A7A] mx-auto mb-1" />
                      <p className="text-xs text-[#5A3E2B]/70 font-medium">Quality Assured</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Detailed Product Information Tabs */}
          <div className="border-t border-[#C89A7A]/20 pt-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Details */}
              {(product.packageIncludes || product.weight || product.productWeight || product.shippingClass) && (
                <div className="card-luxury p-6 shadow-luxury hover:shadow-luxury-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C89A7A] to-[#E6C9A8] rounded-full flex items-center justify-center shadow-md">
                      <FiPackage className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-playfair font-bold text-[#5A3E2B]">
                      Product Details
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {product.packageIncludes && (
                      <div>
                        <p className="text-sm font-semibold text-[#5A3E2B]/80">Package Includes</p>
                        <p className="text-sm text-[#5A3E2B]/60">{product.packageIncludes}</p>
                      </div>
                    )}
                    {product.shippingClass && (
                      <div>
                        <p className="text-sm font-semibold text-[#5A3E2B]/80">Shipping Class</p>
                        <p className="text-sm text-[#5A3E2B]/60 capitalize">{product.shippingClass}</p>
                      </div>
                    )}
                    {product.codAvailable !== undefined && (
                      <div>
                        <p className="text-sm font-semibold text-[#5A3E2B]/80">Cash on Delivery</p>
                        <p className="text-sm text-[#5A3E2B]/60">{product.codAvailable ? 'Available' : 'Not Available'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Care & Compliance */}
              {(product.careInstructions || product.warranty || product.certification) && (
                <div className="card-luxury p-6 shadow-luxury hover:shadow-luxury-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C89A7A] to-[#E6C9A8] rounded-full flex items-center justify-center shadow-md">
                      <FiHeart className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-playfair font-bold text-[#5A3E2B]">
                      Care & Quality
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {product.careInstructions && (
                      <div>
                        <p className="text-sm font-semibold text-[#5A3E2B]/80">Care Instructions</p>
                        <p className="text-sm text-[#5A3E2B]/60 leading-relaxed">{product.careInstructions}</p>
                      </div>
                    )}
                    {product.warranty && (
                      <div>
                        <p className="text-sm font-semibold text-[#5A3E2B]/80">Warranty</p>
                        <p className="text-sm text-[#5A3E2B]/60">{product.warranty}</p>
                      </div>
                    )}
                    {product.certification && (
                      <div>
                        <p className="text-sm font-semibold text-[#5A3E2B]/80">Certification</p>
                        <p className="text-sm text-[#5A3E2B]/60">{product.certification}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Return Policy */}
              {product.returnPolicy && (
                <div className="card-luxury p-6 shadow-luxury hover:shadow-luxury-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C89A7A] to-[#E6C9A8] rounded-full flex items-center justify-center shadow-md">
                      <FiShield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-playfair font-bold text-[#5A3E2B]">
                      Returns & Exchange
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-[#5A3E2B]/80">Return Policy</p>
                      <p className="text-sm text-[#5A3E2B]/60 leading-relaxed">{product.returnPolicy}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-[#C89A7A]/20 pt-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-8 text-[#5A3E2B]">
              Customer Reviews
            </h2>

            {user && (
              <div className="card-luxury p-6 mb-8 shadow-luxury">
                <h3 className="text-xl font-playfair font-semibold mb-6 text-[#5A3E2B]">Write a Review</h3>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3 text-[#5A3E2B]">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <FiStar
                          className={`w-8 h-8 transition-colors ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3 text-[#5A3E2B]">Your Review</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="input-luxury min-h-[150px] resize-none"
                  />
                </div>
                <button onClick={handleSubmitReview} className="btn-primary flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  Submit Review
                </button>
              </div>
            )}

            <div className="space-y-6">
              {product.reviews.length > 0 ? (
                product.reviews.map((review: any) => (
                  <div key={review.id} className="card-luxury p-6 shadow-luxury hover:shadow-luxury-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#C89A7A] to-[#E6C9A8] rounded-full flex items-center justify-center shadow-md">
                          <FiUser className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#5A3E2B] text-lg">{review.user.name}</p>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-[#5A3E2B]/50 font-medium">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-[#5A3E2B]/70 leading-relaxed text-base">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 card-luxury shadow-luxury">
                  <FiStar className="w-16 h-16 text-[#C89A7A]/30 mx-auto mb-4" />
                  <p className="text-[#5A3E2B]/60 text-lg font-medium">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
