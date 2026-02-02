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
      {/* Card Container - Mobile-optimized */}
      <div className="bg-white rounded-2xl md:rounded-[20px] overflow-hidden shadow-md hover:shadow-xl md:shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:hover:shadow-[0_12px_40px_rgba(200,154,122,0.2)] transition-all duration-300 md:duration-700 active:scale-[0.98] md:active:scale-100">
        
        {/* Image Area - Mobile-first aspect ratio */}
        <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-champagne/30">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 md:duration-700 ease-out group-hover:scale-[1.05] md:group-hover:scale-[1.03]"
            loading="eager"
            quality={85}
            onError={() => setImgError(true)}
            unoptimized={imageUrl.startsWith('data:')}
          />
          
          {/* Subtle Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 md:duration-700" />
          
          {/* Discount Badge - Larger on mobile for visibility */}
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-rosegold/95 backdrop-blur-sm flex items-center justify-center shadow-lg ring-2 ring-white/50">
              <span className="text-white text-xs md:text-xs font-bold leading-tight text-center">
                {product.discount}%<br/>OFF
              </span>
            </div>
          )}
        </div>
        
        {/* Product Meta - Mobile-optimized spacing */}
        <div className="p-3 md:p-6 space-y-2 md:space-y-3">
          
          {/* Category - Smaller on mobile */}
          {product.category && (
            <p className="text-[10px] md:text-xs lowercase tracking-wide text-taupe/70 font-medium">
              {product.category}
            </p>
          )}
          
          {/* Product Name - Smaller font on mobile, 2 lines max */}
          <h3 className="font-playfair text-sm md:text-lg leading-snug md:leading-tight text-warmbrown group-hover:text-rosegold transition-colors duration-300 md:duration-500 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
            {product.name}
          </h3>
          
          {/* Price Section - Prominent on mobile */}
          <div className="flex items-center gap-2 md:gap-3 pt-1 md:pt-2">
            <span className="text-xl md:text-2xl font-playfair font-semibold md:font-light text-warmbrown tracking-wide">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {product.discount > 0 && (
              <span className="text-xs md:text-sm text-taupe/50 line-through font-light">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
