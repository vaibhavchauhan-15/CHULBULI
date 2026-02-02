'use client'

import { FiSearch, FiX } from 'react-icons/fi'
import { useEffect, useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export default function SearchBar({ value, onChange, placeholder = 'Search products...', className = '', autoFocus = true }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small delay to ensure smooth focus
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <FiSearch className="w-5 h-5 text-rosegold/70" />
      </div>
      
      {/* Search Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 md:py-4 bg-white/70 backdrop-blur-sm border border-rosegold/30 rounded-full 
                 text-warmbrown placeholder:text-taupe/50 
                 focus:outline-none focus:border-rosegold focus:bg-white focus:shadow-lg focus:shadow-rosegold/10
                 transition-all duration-300
                 text-sm md:text-base tracking-wide"
      />
      
      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe/50 hover:text-rosegold transition-colors duration-300"
          aria-label="Clear search"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
