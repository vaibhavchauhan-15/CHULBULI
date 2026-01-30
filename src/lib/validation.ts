/**
 * Input Validation & Sanitization Utilities
 * Protects against XSS, SQL Injection, and malformed inputs
 */

import validator from 'validator'
import { z } from 'zod'
import { SECURITY_CONFIG } from './config'
import { isCommonPassword, calculatePasswordStrength } from './passwordSecurity'

/**
 * Sanitize HTML content to prevent XSS attacks
 * Strips all HTML tags and special characters
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== 'string') return ''
  
  // Use validator.js to escape HTML entities
  let sanitized = validator.escape(dirty)
  
  // Additional layer: strip all HTML tags using regex
  sanitized = sanitized.replace(/<[^>]*>/g, '')
  
  // Remove any remaining script-like content
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=/gi, '')
  
  return sanitized
}

/**
 * Sanitize text input (removes HTML, trims whitespace)
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return ''
  return sanitizeHtml(text).trim()
}

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): { valid: boolean; email: string; error?: string } {
  const sanitized = sanitizeText(email).toLowerCase()

  if (!sanitized) {
    return { valid: false, email: '', error: 'Email is required' }
  }

  if (!SECURITY_CONFIG.EMAIL_REGEX.test(sanitized)) {
    return { valid: false, email: sanitized, error: 'Invalid email format' }
  }

  if (sanitized.length > 255) {
    return { valid: false, email: sanitized, error: 'Email too long' }
  }

  return { valid: true, email: sanitized }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string; strength?: number } {
  if (!password) {
    return { valid: false, error: 'Password is required' }
  }

  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`,
    }
  }

  if (password.length > SECURITY_CONFIG.PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      error: `Password must not exceed ${SECURITY_CONFIG.PASSWORD_MAX_LENGTH} characters`,
    }
  }

  // Check for common passwords
  if (isCommonPassword(password)) {
    return {
      valid: false,
      error: 'This password is too common. Please choose a stronger password.',
    }
  }

  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  const requirements: string[] = []

  if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !hasUpperCase) {
    requirements.push('one uppercase letter')
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !hasLowerCase) {
    requirements.push('one lowercase letter')
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBER && !hasNumber) {
    requirements.push('one number')
  }

  if (SECURITY_CONFIG.PASSWORD_REQUIRE_SPECIAL && !hasSpecial) {
    requirements.push('one special character')
  }

  if (requirements.length > 0) {
    return {
      valid: false,
      error: `Password must contain at least: ${requirements.join(', ')}`,
    }
  }

  // Calculate password strength
  const { score } = calculatePasswordStrength(password)

  return { valid: true, strength: score }

  return { valid: true }
}

/**
 * Zod schemas for API validation
 */
export const ValidationSchemas = {
  signup: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(SECURITY_CONFIG.PASSWORD_MIN_LENGTH),
  }),

  login: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),

  product: z.object({
    name: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    price: z.number().positive().max(1000000),
    discount: z.number().min(0).max(100).optional(),
    category: z.enum(['earrings', 'necklaces', 'rings', 'bangles', 'sets']),
    stock: z.number().int().min(0).max(100000),
    images: z.array(z.string().url()).min(1).max(10),
    material: z.string().max(100).optional(),
    featured: z.boolean().optional(),
  }),

  order: z.object({
    customerName: z.string().min(2).max(100),
    customerEmail: z.string().email(),
    customerPhone: z.string().regex(/^[0-9]{10}$/),
    addressLine1: z.string().min(5).max(200),
    addressLine2: z.string().max(200).optional(),
    city: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    pincode: z.string().regex(/^[0-9]{6}$/),
    items: z
      .array(
        z.object({
          productId: z.string(),
          quantity: z.number().int().positive().max(100),
        })
      )
      .min(1),
    userId: z.string().optional().nullable(),
  }),

  review: z.object({
    productId: z.string(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10).max(1000),
  }),
}

/**
 * Validate and sanitize order data
 */
export function sanitizeOrderData(data: any) {
  return {
    customerName: sanitizeText(data.customerName),
    customerEmail: sanitizeText(data.customerEmail).toLowerCase(),
    customerPhone: sanitizeText(data.customerPhone),
    addressLine1: sanitizeText(data.addressLine1),
    addressLine2: data.addressLine2 ? sanitizeText(data.addressLine2) : undefined,
    city: sanitizeText(data.city),
    state: sanitizeText(data.state),
    pincode: sanitizeText(data.pincode),
    items: data.items,
    userId: data.userId || null,
  }
}

/**
 * Sanitize review data
 */
export function sanitizeReviewData(data: any) {
  return {
    productId: sanitizeText(data.productId),
    rating: safeParseInt(data.rating, 0),
    comment: sanitizeText(data.comment),
  }
}

/**
 * Safe parse float with fallback
 */
export function safeParseFloat(value: any, fallback: number = 0): number {
  const parsed = parseFloat(value)
  if (isNaN(parsed) || !isFinite(parsed)) {
    return fallback
  }
  return parsed
}

/**
 * Safe parse int with fallback
 */
export function safeParseInt(value: any, fallback: number = 0): number {
  const parsed = parseInt(value, 10)
  if (isNaN(parsed) || !isFinite(parsed)) {
    return fallback
  }
  return parsed
}

/**
 * Validate Indian phone number
 */
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeText(phone)
  
  // Indian mobile numbers: 10 digits, starting with 6-9
  const phoneRegex = /^[6-9][0-9]{9}$/
  
  if (!phoneRegex.test(sanitized)) {
    return {
      valid: false,
      error: 'Invalid phone number. Must be 10 digits starting with 6-9',
    }
  }
  
  return { valid: true }
}

/**
 * Validate Indian pincode
 */
export function validatePincode(pincode: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeText(pincode)
  
  // Indian pincodes: 6 digits, not starting with 0
  const pincodeRegex = /^[1-9][0-9]{5}$/
  
  if (!pincodeRegex.test(sanitized)) {
    return {
      valid: false,
      error: 'Invalid pincode. Must be 6 digits not starting with 0',
    }
  }
  
  return { valid: true }
}

/**
 * Sanitize product data - Comprehensive version with all fields
 */
export function sanitizeProductData(data: any) {
  return {
    // Basic Information
    name: sanitizeText(data.name),
    sku: data.sku ? sanitizeText(data.sku) : null,
    description: sanitizeText(data.description),
    shortDescription: data.shortDescription ? sanitizeText(data.shortDescription) : null,
    category: sanitizeText(data.category),
    subCategory: data.subCategory ? sanitizeText(data.subCategory) : null,
    brand: data.brand ? sanitizeText(data.brand) : null,
    productStatus: data.productStatus ? sanitizeText(data.productStatus) : 'draft',
    
    // Pricing & Tax
    basePrice: data.basePrice ? safeParseFloat(data.basePrice, 0) : null,
    price: safeParseFloat(data.price, 0),
    discount: data.discount ? safeParseFloat(data.discount, 0) : 0,
    discountType: data.discountType ? sanitizeText(data.discountType) : 'percentage',
    gstPercentage: data.gstPercentage ? safeParseFloat(data.gstPercentage, 3) : 3,
    costPrice: data.costPrice ? safeParseFloat(data.costPrice, 0) : null,
    
    // Inventory & Stock
    stock: safeParseInt(data.stock, 0),
    lowStockAlert: data.lowStockAlert ? safeParseInt(data.lowStockAlert, 5) : 5,
    stockStatus: data.stockStatus ? sanitizeText(data.stockStatus) : 'in_stock',
    
    // Images & Media
    images: Array.isArray(data.images) ? data.images : [],
    thumbnailImage: data.thumbnailImage ? sanitizeText(data.thumbnailImage) : null,
    videoUrl: data.videoUrl ? sanitizeText(data.videoUrl) : null,
    
    // Attributes
    material: data.material ? sanitizeText(data.material) : null,
    stoneType: data.stoneType ? sanitizeText(data.stoneType) : null,
    color: data.color ? sanitizeText(data.color) : null,
    earringType: data.earringType ? sanitizeText(data.earringType) : null,
    closureType: data.closureType ? sanitizeText(data.closureType) : null,
    weight: data.weight ? safeParseFloat(data.weight, 0) : null,
    dimensionLength: data.dimensionLength ? safeParseFloat(data.dimensionLength, 0) : null,
    dimensionWidth: data.dimensionWidth ? safeParseFloat(data.dimensionWidth, 0) : null,
    finish: data.finish ? sanitizeText(data.finish) : null,
    
    // Shipping & Packaging
    productWeight: data.productWeight ? safeParseFloat(data.productWeight, 0) : null,
    shippingClass: data.shippingClass ? sanitizeText(data.shippingClass) : 'standard',
    packageIncludes: data.packageIncludes ? sanitizeText(data.packageIncludes) : null,
    codAvailable: data.codAvailable !== undefined ? Boolean(data.codAvailable) : true,
    
    // SEO & Visibility
    seoTitle: data.seoTitle ? sanitizeText(data.seoTitle) : null,
    metaDescription: data.metaDescription ? sanitizeText(data.metaDescription) : null,
    urlSlug: data.urlSlug ? sanitizeText(data.urlSlug) : null,
    searchTags: data.searchTags || [],
    featured: Boolean(data.featured),
    isNewArrival: Boolean(data.isNewArrival),
    
    // Compliance & Trust
    careInstructions: data.careInstructions ? sanitizeText(data.careInstructions) : null,
    returnPolicy: data.returnPolicy ? sanitizeText(data.returnPolicy) : null,
    warranty: data.warranty ? sanitizeText(data.warranty) : null,
    certification: data.certification ? sanitizeText(data.certification) : null,
    
    // Reviews
    reviewsEnabled: data.reviewsEnabled !== undefined ? Boolean(data.reviewsEnabled) : true,
  }
}
