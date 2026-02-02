'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { FiSearch, FiX, FiMic } from 'react-icons/fi'

interface SearchResult {
  id: string
  name: string
  category: string
  price: number
}

export default function SearchBarEnhanced() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch search results with debounce
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    setIsSearching(true)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(searchTerm)}&limit=8`)
        const data = await response.json()
        setResults(data.products || [])
        setShowDropdown(true)
        setIsSearching(false)
      } catch (error) {
        console.error('Search error:', error)
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    window.location.href = `/products/${result.id}`
  }

  const clearSearch = () => {
    setSearchTerm('')
    setResults([])
    setShowDropdown(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const handleVoiceSearch = () => {
    // Placeholder for voice search - can be implemented with Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      alert('Voice search will be available soon!')
    } else {
      alert('Voice search is not supported in your browser')
    }
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-rosegold/70 w-5 h-5 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search for jewelry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-24 md:pr-28 py-3 md:py-4 rounded-full border-2 border-rosegold/30 bg-white/70 backdrop-blur-sm focus:border-rosegold focus:bg-white focus:outline-none focus:ring-2 focus:ring-rosegold/20 focus:shadow-lg focus:shadow-rosegold/10 text-warmbrown placeholder:text-taupe/50 transition-all duration-300 input-luxury"
        />
        
        {/* Right Side Buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className="p-2 text-rosegold/70 hover:text-rosegold hover:bg-rosegold/10 rounded-full transition-all touch-target active:scale-95"
            aria-label="Voice search"
          >
            <FiMic className="w-5 h-5" />
          </button>

          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 text-rosegold/70 hover:text-rosegold hover:bg-rosegold/10 rounded-full transition-all touch-target active:scale-95"
              aria-label="Clear search"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-luxury border border-rosegold/20 overflow-hidden max-h-[60vh] overflow-y-auto z-50 scrollbar-hide">
          {isSearching ? (
            <div className="p-6 text-center">
              <div className="inline-block w-6 h-6 border-2 border-rosegold/30 border-t-rosegold rounded-full animate-spin"></div>
              <p className="text-sm text-warmbrown/60 mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full px-4 py-3 flex items-center gap-4 hover:bg-champagne active:bg-champagne/80 transition-all text-left touch-target min-h-12 ${
                    index === selectedIndex ? 'bg-champagne' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-warmbrown line-clamp-1">{result.name}</h4>
                    <p className="text-xs text-rosegold">{result.category}</p>
                  </div>
                  <p className="text-sm font-bold text-warmbrown shrink-0">₹{result.price.toFixed(2)}</p>
                </button>
              ))}
              <div className="px-4 py-3 border-t border-rosegold/10">
                <a
                  href={`/products?search=${encodeURIComponent(searchTerm)}`}
                  className="text-sm text-rosegold hover:text-warmbrown transition-colors inline-flex items-center gap-1 touch-target"
                >
                  View all results <span className="text-xs">→</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-warmbrown/60">No results found for &quot;{searchTerm}&quot;</p>
              <p className="text-xs text-rosegold/60 mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
