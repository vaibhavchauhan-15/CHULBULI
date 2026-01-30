'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    discount: number
    images: string[]
    category?: string
    averageRating?: number
    reviewCount?: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const finalPrice = product.price - (product.price * product.discount) / 100
  
  // SVG placeholder as data URI - more reliable than external file
  const placeholderSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Crect fill='%23F2E6D8' width='800' height='800'/%3E%3Ctext fill='%238B6D57' font-family='Arial' font-size='48' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
  
  // Get valid image URL or fallback to placeholder
  const imageUrl = product.images?.[0] && product.images[0].trim() !== '' && !imgError
    ? product.images[0]
    : placeholderSvg

  return (
    <Link href={`/products/${product.id}`} className="group block">
      {/* Card Container - Clean, Large Rounded Corners, Soft Shadow */}
      <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(200,154,122,0.2)] transition-all duration-700">
        
        {/* Image Area - Hero Element, 60-65% of Card */}
        <div className="relative aspect-[4/5] overflow-hidden bg-champagne/30">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="eager"
            quality={85}
            onError={() => setImgError(true)}
            unoptimized={imageUrl.startsWith('data:')}
          />
          
          {/* Subtle Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-700" />
          
          {/* Discount Badge - Top Right, Small & Circular */}
          {product.discount > 0 && (
            <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-rosegold/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-medium">
                {product.discount}%<br/>OFF
              </span>
            </div>
          )}
        </div>
        
        {/* Product Meta - Below Image, Clean Spacing */}
        <div className="p-6 space-y-3">
          
          {/* Category/Style - Small, Muted, Lowercase */}
          {product.category && (
            <p className="text-xs lowercase tracking-wide text-taupe/70">
              {product.category}
            </p>
          )}
          
          {/* Product Name - Serif, Medium Size, 1-2 Lines */}
          <h3 className="font-playfair text-lg leading-tight text-warmbrown group-hover:text-rosegold transition-colors duration-500 line-clamp-2">
            {product.name}
          </h3>
          
          {/* Price Section - Horizontal Layout */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-2xl font-playfair font-light text-warmbrown tracking-wide">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-taupe/50 line-through font-light">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
