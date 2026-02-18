<div align="center">

# 🪷 CHULBULI JEWELS

<p style="color: #C89A7A; font-size: 1.2em; font-weight: 300; letter-spacing: 0.1em;">
E-Commerce Jewelry Platform
</p>

<p style="color: #5A3E2B; font-style: italic; margin: 20px 0;">
Elegance You Can Feel
</p>

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-C89A7A?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-C89A7A?style=for-the-badge&logo=postgresql)
![Drizzle](https://img.shields.io/badge/Drizzle-0.45-E6C9A8?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-C89A7A?style=for-the-badge&logo=tailwind-css)

<p style="background: linear-gradient(135deg, #F2E6D8 0%, #E8D5C2 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #C89A7A; color: #5A3E2B;">
A modern, elegant, and secure e-commerce platform for women's jewelry built with premium design and enterprise-grade security.
</p>

</div>

---

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F7F6F3 100%); padding: 25px; border-radius: 16px; border: 2px solid #C89A7A; margin: 20px 0;">

## 🆕 Recent Updates

<div style="color: #5A3E2B;">

### ✨ Latest Features (February 2026)

#### � Payment Gateway Integration
- **PhonePe Standard Checkout v2** - Complete OAuth-based payment integration
  - OAuth 2.0 authentication with Client ID/Secret
  - Secure payment initiation and webhook handling
  - Support for sandbox and production environments
  - Transaction status tracking and verification
  - Automatic payment URL validation
- **Razorpay Payment Gateway** - Alternative payment option
  - Secure order creation and payment verification
  - HMAC signature validation
  - Real-time payment status updates
- **Multiple Payment Methods** - Cash on Delivery, PhonePe, Razorpay
- **Payment Status Tracking** - Real-time payment status monitoring
- **Webhook Integration** - Automatic order status updates via webhooks
- **Sequential Order Numbers** - User-friendly order numbering (e.g., #1001, #1002)

#### 🔐 Google OAuth Authentication
- **Firebase Integration** - Seamless Google Sign-In with Firebase Authentication
- **One-Click Login** - Users can sign in instantly with their Google account
- **Profile Sync** - Automatic profile picture and name synchronization
- **Account Linking** - Existing email users can link their Google accounts
- **Secure Token Verification** - Server-side validation using Firebase Admin SDK

#### 👤 Enhanced User Management
- **Multiple Addresses** - Save and manage multiple delivery addresses
- **Default Address** - Set default address for quick checkout
- **Account Deactivation** - Soft delete with account recovery option
- **Profile Pictures** - Support for Google OAuth profile photos

#### 🛍️ Advanced Product Features
- **Comprehensive Product Details** - SKU, material, dimensions, weight, etc.
- **Product Status Management** - Draft, Active, Out of Stock states
- **Stock Alerts** - Low stock notifications for admins
- **SEO Optimization** - Custom URL slugs, meta descriptions, search tags
- **Multiple Images** - Support for product galleries and thumbnails
- **Product Videos** - Optional 360° product view or demo videos

#### 🎨 UI/UX Improvements
- **Responsive Discount Badges** - Mobile-optimized circular badges on product cards
- **Better Image Handling** - SVG placeholders for missing product images
- **Enhanced Product Cards** - Improved hover effects and transitions
- **Google Sign-In Button** - Branded Google OAuth button with loading states

#### 🔒 Security Enhancements
- **Multi-Provider Authentication** - Support for email/password and Google OAuth
- **Enhanced Rate Limiting** - Separate limits for OAuth endpoints
- **Audit Logging** - Track Google sign-in events and account linking
- **Token Security** - Firebase ID token verification with expiry checks
- **Webhook Signature Verification** - Secure payment webhook validation

#### 📊 Database Updates
- **Payment Tracking Fields** - `paymentProvider`, `paymentStatus`, `merchantOrderId`, `transactionId`
- **Razorpay Fields** - `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`
- **OAuth Fields** - New columns: `provider`, `googleId`, `photoUrl`
- **Address Management** - Dedicated addresses table with multiple address support
- **Order Numbers** - Sequential order number generation
- **Nullable Passwords** - Support for OAuth-only users
- **Indexed Lookups** - Fast queries for orders, payments, and user accounts
- **Account Status** - Track account deactivation and deletion

</div>

</div>

---

<div align="center">

## 📋 Table of Contents

<div style="color: #5A3E2B;">

- [Recent Updates](#recent-updates)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Frontend Pages](#frontend-pages)
- [Backend API Routes](#backend-api-routes)
- [Components](#components)
- [State Management](#state-management)
- [Security Features](#security-features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup-google-oauth)
- [Payment Gateway Setup](#payment-gateway-setup)
- [Database Setup](#database-setup)
- [Design System](#design-system)

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #F2E6D8 100%); padding: 30px; border-radius: 16px; border: 1px solid #E6C9A8; margin: 20px 0;">

## 🎯 Overview

**Chulbuli Jewels** is a premium B2C e-commerce platform designed to sell elegant jewelry for women. The platform features a sophisticated design with a feminine **rose gold & champagne** color palette, robust security measures, and a seamless shopping experience.

</div>

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F2E6D8 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #C89A7A; margin: 20px 0;">

### 🎯 Target Audience

<div style="color: #5A3E2B;">

- 👩 Women aged 18-40
- 💍 Interest in fashion jewelry, daily wear & festive jewelry
- 📱 Mobile-first users (responsive design)
- ✨ Looking for affordable yet premium-looking jewelry

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #F2E6D8 100%); padding: 25px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## ✨ Features

### 🛍️ Customer Features
- 🔐 **Secure Authentication** - Email/password signup & login with JWT tokens
- � **Google OAuth Sign-In** - One-click sign-in with Google account (Firebase Authentication)
- 🛍️ **Product Catalog** - Browse jewelry by category (Earrings, Necklaces, Rings, Bangles, Sets)
- 🔍 **Advanced Filtering** - Filter by price range, category, sort by price/latest/rating
- 🛒 **Shopping Cart** - Add/remove items, quantity management, cart validation
- ⭐ **Product Reviews** - Verified buyer reviews with 1-5 star ratings (admin-moderated)
- 📦 **Order Management** - Place orders with sequential order numbers, track status, view order history
- 💳 **Multiple Payment Methods**:
  - 💰 Cash on Delivery (COD)
  - 📱 PhonePe Payment Gateway (Standard Checkout v2 with OAuth 2.0)
  - 💳 Razorpay Payment Gateway
- 🏠 **Multiple Addresses** - Save and manage multiple delivery addresses with default selection
- 👤 **User Profile Management** - Profile pictures from Google OAuth, account linking
- 👑 **User Dashboard** - View account info, order history, review status
- 🔄 **Account Management** - Deactivate/reactivate account with soft delete support
</div>

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F2E6D8 100%); padding: 25px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

### � Admin Features
- 📊 **Admin Dashboard** - Sales analytics, revenue tracking, best-selling products
- 📦 **Product Management** - Add, edit, delete products with comprehensive attributes (SKU, material, dimensions, etc.)
- 🎨 **Image Management** - Multiple product images, cloudinary integration, video support
- 📋 **Order Management** - View all orders, update order status (placed → packed → shipped → delivered)
- 💰 **Inventory Control** - Stock management, low stock alerts, stock status tracking
- ✅ **Review Moderation** - Approve/delete customer reviews
- 📈 **Sales Reports** - Total sales, monthly sales, order statistics
- 💳 **Payment Tracking** - Monitor payment status across all payment providers (COD, PhonePe, Razorpay)
- 📱 **Order Numbers** - Sequential order numbering for easy tracking

### 💳 Payment Features
- **PhonePe Integration**:
  - OAuth 2.0 authentication with Client ID/Secret
  - Standard Checkout v2 API
  - Secure payment URL generation with signature verification
  - Webhook support for automatic payment status updates
  - Sandbox and production environment support
  - Transaction tracking and verification
  - Payment status monitoring
- **Payment Tracking**:
  - Payment provider tracking (COD, PhonePe)
  - Payment status monitoring (pending, completed, failed)
  - Transaction ID tracking
  - Merchant order ID management
  - Webhook-based automatic updates

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #E8D5C2 100%); padding: 30px; border-radius: 16px; border: 2px solid #C89A7A; margin: 20px 0;">

## 🛠️ Tech Stack

<div style="color: #5A3E2B;">

### 🎨 Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Hot Toast** - Elegant notifications
- **React Icons** - Icon library

### ⚙️ Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe SQL query builder
- **Node-Postgres (pg)** - PostgreSQL client

### 🔐 Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **Firebase Authentication** - Google OAuth 2.0 integration
- **Firebase Admin SDK** - Server-side token verification
- **bcryptjs** - Password hashing
- **Validator.js** - Input validation & sanitization
- **Zod** - Schema validation
- **Custom Rate Limiting** - API abuse prevention
- **CSRF Protection** - Cross-site request forgery protection
- **Helmet.js** - Security headers

### 📸 Image Management
- **Cloudinary** - Cloud-based image hosting & optimization

### � Payment Gateways
- **PhonePe** - Standard Checkout v2 with OAuth 2.0
  - Client ID/Secret authentication
  - Webhook integration
  - Transaction tracking

### �🔧 Development Tools
- **Drizzle Kit** - Database migrations
- **ESLint** - Code linting
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F2E6D8 0%, #E8D5C2 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## 📁 Project Structure

<div style="background: #5A3E2B; color: #F7F6F3; padding: 20px; border-radius: 8px; margin-top: 15px;">

```
CHULBULI/
├── public/                          # Static assets
│   ├── hero_image.webp             # Homepage hero image
│   ├── logo.png                     # Brand logo
│   └── test-*.html                  # Testing pages
│
├── scripts/                         # Database & utility scripts
│   ├── seed.ts                      # Database seeding script
│   ├── run-seed.js                  # Seed runner
│   └── generate-secrets.js          # Secret key generation
│
├── src/
│   ├── app/                         # Next.js App Router pages
│   │   ├── page.tsx                 # Homepage (/)
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   │
│   │   ├── products/                # Product listing & details
│   │   │   ├── page.tsx             # Product catalog (/products)
│   │   │   └── [id]/page.tsx        # Product detail page (/products/[id])
│   │   │
│   │   ├── cart/                    # Shopping cart
│   │   │   └── page.tsx             # Cart page (/cart)
│   │   │
│   │   ├── checkout/                # Checkout flow
│   │   │   └── page.tsx             # Checkout page (/checkout)
│   │   │
│   │   ├── order-success/           # Order confirmation
│   │   │   └── page.tsx             # Success page (/order-success)
│   │   │
│   │   ├── login/                   # Authentication
│   │   │   └── page.tsx             # Login page (/login)
│   │   │
│   │   ├── signup/                  # Registration
│   │   │   └── page.tsx             # Signup page (/signup)
│   │   │
│   │   ├── dashboard/               # User dashboard
│   │   │   └── page.tsx             # My orders (/dashboard)
│   │   │
│   │   ├── admin/                   # Admin panel
│   │   │   ├── page.tsx             # Admin dashboard (/admin)
│   │   │   ├── products/page.tsx    # Manage products
│   │   │   ├── orders/page.tsx      # Manage orders
│   │   │   └── reviews/page.tsx     # Moderate reviews
│   │   │
│   │   └── api/                     # API Routes (Backend)
│   │       ├── auth/                # Authentication endpoints
│   │       │   ├── login/route.ts
│   │       │   ├── signup/route.ts
│   │       │   └── logout/route.ts
│   │       │
│   │       ├── products/            # Product endpoints
│   │       │   ├── route.ts         # GET all products
│   │       │   └── [id]/route.ts    # GET single product
│   │       │
│   │       ├── orders/              # Order endpoints
│   │       │   └── route.ts         # POST new order, GET user orders
│   │       │
│   │       ├── reviews/             # Review endpoints
│   │       │   └── route.ts         # POST new review
│   │       │
│   │       ├── cart/                # Cart validation
│   │       │   └── validate/route.ts
│   │       │
│   │       └── admin/               # Admin-only endpoints
│   │           ├── dashboard/route.ts
│   │           ├── products/route.ts
│   │           ├── orders/[id]/route.ts
│   │           ├── reviews/[id]/route.ts
│   │           └── upload/route.ts
│   │
│   ├── components/                  # React components
│   │   ├── Navbar.tsx               # Navigation bar
│   │   ├── Footer.tsx               # Footer component
│   │   ├── ProductCard.tsx          # Product card component
│   │   ├── ProductFormModal.tsx     # Product form (admin)
│   │   ├── AdminSidebar.tsx         # Admin navigation
│   │   └── ErrorBoundary.tsx        # Error handling
│   │
│   ├── lib/                         # Utility libraries
│   │   ├── db/                      # Database layer
│   │   │   ├── schema.ts            # Drizzle schema definitions
│   │   │   ├── client.ts            # Database connection
│   │   │   ├── queries.ts           # Query helpers
│   │   │   └── migrations/          # SQL migrations
│   │   │
│   │   ├── auth.ts                  # JWT & password utilities
│   │   ├── validation.ts            # Input validation & sanitization
│   │   ├── rateLimit.ts             # Rate limiting middleware
│   │   ├── middleware.ts            # Auth middleware
│   │   ├── auditLog.ts              # Audit logging
│   │   ├── passwordSecurity.ts      # Password strength checking
│   │   ├── cloudinary.ts            # Image upload utilities
│   │   ├── config.ts                # App configuration
│   │   └── csrf.ts                  # CSRF protection
│   │
│   └── store/                       # Zustand state stores
│       ├── authStore.ts             # Authentication state
│       └── cartStore.ts             # Shopping cart state
│
├── middleware.ts                    # Next.js middleware (request interceptor)
├── drizzle.config.ts               # Drizzle ORM configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies & scripts
```

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #F2E6D8 100%); padding: 30px; border-radius: 16px; border: 2px solid #C89A7A; margin: 20px 0;">

## 🗄️ Database Schema

<div style="color: #5A3E2B;">

### Tables

#### 1. **Users** (`User`)
Stores customer and admin accounts.

```typescript
{
  id: string (PK)              // Unique user ID
  name: string                 // Full name
  email: string (unique)       // Email address
  password: string (nullable)  // Bcrypt hashed password (null for OAuth users)
  role: 'customer' | 'admin'   // User role
  
  // OAuth fields
  provider: string             // 'email' or 'google'
  googleId: string (unique)    // Google user ID for OAuth
  photoUrl: string             // Profile picture URL from Google
  
  createdAt: timestamp         // Account creation date
  updatedAt: timestamp         // Last update date
}
```

#### 2. **Products** (`Product`)
Comprehensive product catalog with extensive attributes.

```typescript
{
  // Basic Information
  id: string (PK)
  name: string
  sku: string (unique)         // Stock Keeping Unit
  description: text
  shortDescription: text
  category: string             // earrings, necklaces, rings, bangles, sets
  subCategory: string          // stud, hoop, drop, jhumka
  brand: string
  productStatus: string        // draft, active, out_of_stock
  
  // Pricing & Tax
  basePrice: decimal           // MRP
  price: decimal               // Selling price
  discount: decimal            // Discount percentage or flat
  discountType: string         // percentage | flat
  finalPrice: decimal          // Auto-calculated
  gstPercentage: decimal       // 3% for jewelry in India
  costPrice: decimal           // Internal use
  
  // Inventory & Stock
  stock: integer
  lowStockAlert: integer       // Alert threshold (default: 5)
  stockStatus: string          // in_stock, out_of_stock, pre_order
  
  // Images & Media
  images: text[]               // Array of image URLs
  thumbnailImage: string       // Main hero image
  videoUrl: string             // 360° or product video
  
  // Product Attributes
  material: string             // Gold Plated, Silver, Brass, Alloy
  stoneType: string            // CZ, Pearl, Kundan, None
  color: string                // Gold, Rose Gold, Silver
  earringType: string          // Stud, Hoop, Drop, Jhumka
  closureType: string          // Push Back, Screw Back, Hook
  weight: decimal              // In grams
  dimensionLength: decimal     // In mm
  dimensionWidth: decimal      // In mm
  finish: string               // Matte, Glossy, Antique
  
  // Shipping & Packaging
  productWeight: decimal       // For shipping calculations
  shippingClass: string        // standard, fragile
  packageIncludes: string
  codAvailable: boolean
  
  // SEO & Visibility
  seoTitle: string
  metaDescription: string
  urlSlug: string (unique)
  searchTags: text[]
  featured: boolean            // Featured on homepage
  isNewArrival: boolean
  
  // Compliance & Trust
  careInstructions: text
  returnPolicy: text
  warranty: text
  certification: string
  
  // Reviews
  reviewsEnabled: boolean
  
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3. **Orders** (`Order`)
Customer orders with delivery information.

```typescript
{
  id: string (PK)
  userId: string (FK)          // References User.id (nullable for guest)
  totalPrice: decimal
  status: string               // placed, packed, shipped, delivered
  
  // Customer Information
  customerName: string
  customerEmail: string
  customerPhone: string
  
  // Delivery Address
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  
  paymentMethod: string        // cod, online
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 4. **OrderItems** (`OrderItem`)
Individual products within an order.

```typescript
{
  id: string (PK)
  orderId: string (FK)         // References Order.id
  productId: string (FK)       // References Product.id
  quantity: integer
  price: decimal               // Price at time of purchase
}
```

#### 5. **Reviews** (`Review`)
Product reviews and ratings.

```typescript
{
  id: string (PK)
  productId: string (FK)       // References Product.id
  userId: string (FK)          // References User.id
  rating: integer              // 1-5 stars
  comment: text
  approved: boolean            // Admin moderation required
  verifiedPurchase: boolean    // User actually purchased the product
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 6. **ProductVariants** (`ProductVariant`)
Product variations (size, color).

```typescript
{
  id: string (PK)
  productId: string (FK)
  variantName: string          // e.g., "Gold - Medium"
  sku: string (unique)
  color: string
  size: string
  price: decimal
  stock: integer
  images: text[]
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 7. **ProductImages** (`ProductImage`)
Separate image management.

```typescript
{
  id: string (PK)
  productId: string (FK)
  url: string
  altText: string
  imageType: string            // thumbnail, side_view, model, zoom
  sortOrder: integer
  createdAt: timestamp
}
```

### 📊 Database Indexes
- Email (User) - Fast user lookup
- GoogleId (User) - OAuth user lookup
- Provider (User) - Filter by authentication provider
- Category, Featured, Price (Product) - Optimized filtering
- Status, CreatedAt (Order) - Order queries
- ProductId, Approved (Review) - Review filtering
- ProductId+UserId unique constraint (Review) - One review per user per product

</div>

</div>

---

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F7F6F3 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## 🎨 Frontend Pages

<div style="color: #5A3E2B;">

### Public Pages

#### 1. **Homepage** (`/`)
**File:** [src/app/page.tsx](src/app/page.tsx)

**Features:**
- Luxurious hero section with pearl earrings background
- Elegant tagline: "Elegance You Can Feel"
- Category cards (Earrings, Necklaces, Rings, Bangles)
- Featured products carousel (8 products)
- Premium gradient backgrounds (champagne, pearl, sand)
- Smooth animations and transitions

**Design Elements:**
- Playfair Display font for headings
- Rose gold color scheme (#C89A7A)
- Card-based layout with shadow effects
- Responsive grid system

---

#### 2. **Products Page** (`/products`)
**File:** [src/app/products/page.tsx](src/app/products/page.tsx)

**Features:**
- Left sidebar with filters:
  - Category selection (All, Earrings, Necklaces, Rings, Bangles, Sets)
  - Price range input (min/max)
  - Sort by: Latest, Price (Low-High), Price (High-Low)
- Product grid (3 columns on desktop)
- Product cards with:
  - Thumbnail image
  - Product name
  - Price with discount
  - "Quick View" on hover

**Filtering:**
- URL query params: `?category=earrings&minPrice=500&maxPrice=2000&sort=price-asc`
- Client-side state management
- Real-time filtering without page reload

---

#### 3. **Product Detail Page** (`/products/[id]`)
**File:** [src/app/products/[id]/page.tsx](src/app/products/[id]/page.tsx)

**Features:**
- Image gallery with thumbnail navigation
- Product information:
  - Name, price, discount
  - Star rating and review count
  - Stock status
  - Description, material, care instructions
  - Quantity selector
- "Add to Cart" button
- Trust badges (Secure Checkout, Free Shipping, Easy Returns)
- Customer reviews section with:
  - Star ratings
  - Review text
  - User name and verified purchase badge
  - Review submission form (logged-in users only)

**Validation:**
- Only verified buyers can leave reviews
- One review per user per product
- Reviews require admin approval

---

#### 4. **Shopping Cart** (`/cart`)
**File:** [src/app/cart/page.tsx](src/app/cart/page.tsx)

**Features:**
- Cart item list with:
  - Product image, name, price
  - Quantity controls (+/-)
  - Remove item button
  - Discount display
- Cart validation:
  - Checks product availability
  - Alerts for out-of-stock items
  - Automatic removal of unavailable products
- Order summary:
  - Subtotal
  - Total items count
- "Proceed to Checkout" button

**Empty State:**
- "Your cart is empty" message
- "Explore Collection" CTA

---

#### 5. **Checkout Page** (`/checkout`)
**File:** [src/app/checkout/page.tsx](src/app/checkout/page.tsx)

**Features:**
- Contact information form:
  - Full Name
  - Email Address
  - Phone Number
- Delivery address form:
  - Address Line 1 & 2
  - City, State, Pincode
- Order summary sidebar:
  - Product list
  - Total price
  - Payment method (COD)
- Cart validation before order placement
- Order creation with stock deduction

**Validation:**
- All fields required
- Email format validation
- Phone number format (Indian)
- Pincode validation (6 digits)

---

#### 6. **Order Success Page** (`/order-success`)
**File:** [src/app/order-success/page.tsx](src/app/order-success/page.tsx)

**Features:**
- Success confirmation message
- Order ID display
- Next steps information:
  1. Email confirmation
  2. Packing process
  3. Shipping notification
  4. COD payment
- "View Order Details" button
- "Continue Shopping" button

---

#### 7. **Login Page** (`/login`)
**File:** [src/app/login/page.tsx](src/app/login/page.tsx)

**Features:**
- Email & password form
- **Google Sign-In button** - One-click authentication with Google OAuth
- JWT authentication
- HTTP-only cookie storage
- Error handling with toast notifications
- "Sign up" link
- "Continue as Guest" option
- **Divider** - Visual separation between OAuth and email login

**Security:**
- Rate limiting (prevents brute force)
- Constant-time password comparison
- Generic error messages (prevents user enumeration)
- Detects OAuth-only accounts and prompts for Google Sign-In

---

#### 8. **Signup Page** (`/signup`)
**File:** [src/app/signup/page.tsx](src/app/signup/page.tsx)

**Features:**
- Registration form:
  - Full Name
  - Email
  - Password
  - Confirm Password
- Password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- Auto-login after signup
- "Login" link

**Validation:**
- Email uniqueness check
- Password strength validation
- Input sanitization (XSS prevention)

---

#### 9. **User Dashboard** (`/dashboard`)
**File:** [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx)

**Features:**
- Account information card:
  - Name, email, account type
- Order history:
  - Order list with status badges
  - Expandable order details
  - Product images and quantities
  - Delivery address
  - Status tracking (Placed → Packed → Shipped → Delivered)

**Protected Route:**
- Requires authentication
- Redirects to `/login` if not authenticated

---

### Admin Pages

#### 10. **Admin Dashboard** (`/admin`)
**File:** [src/app/admin/page.tsx](src/app/admin/page.tsx)

**Features:**
- Sales statistics cards:
  - Total Sales (all time)
  - Total Orders count
  - Monthly Sales
- Recent orders table
- Best-selling products list
- Low stock alerts sidebar

**Access Control:**
- Admin role required
- Redirects non-admins to homepage

---

#### 11. **Manage Products** (`/admin/products`)
**File:** [src/app/admin/products/page.tsx](src/app/admin/products/page.tsx)

**Features:**
- Product list table with:
  - Image, name, category
  - Price, stock, status
  - Edit & Delete buttons
- "Add New Product" button
- Product creation/edit modal with extensive fields:
  - Basic info (name, description, category)
  - Pricing (base price, discount)
  - Inventory (stock, SKU)
  - Images (multiple uploads)
  - Attributes (material, color, dimensions)
  - SEO (meta description, URL slug)

**Image Upload:**
- Cloudinary integration
- Multiple image upload
- Image preview

---

#### 12. **Manage Orders** (`/admin/orders`)
**File:** [src/app/admin/orders/page.tsx](src/app/admin/orders/page.tsx)

**Features:**
- Order list with filters
- Order details:
  - Customer information
  - Products ordered
  - Delivery address
  - Payment method
- Status update dropdown:
  - Placed → Packed → Shipped → Delivered
- Order search by ID, email, phone

---

#### 13. **Moderate Reviews** (`/admin/reviews`)
**File:** [src/app/admin/reviews/page.tsx](src/app/admin/reviews/page.tsx)

**Features:**
- Pending reviews list
- Approve/Delete buttons
- Review details:
  - Product name
  - User name
  - Rating, comment
  - Verified purchase badge
- Approved reviews list

---

<div style="background: linear-gradient(135deg, #F2E6D8 0%, #F7F6F3 100%); padding: 50px 40px; border-radius: 20px; border-left: 5px solid #C89A7A; margin: 40px 0;">

## 🔌 Backend API Routes

### Authentication APIs

#### `POST /api/auth/google`
**File:** [src/app/api/auth/google/route.ts](src/app/api/auth/google/route.ts)

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_...",
    "name": "Aloo Kumar",
    "email": "aloo@example.com",
    "role": "customer",
    "provider": "google",
    "googleId": "1234567890",
    "photoUrl": "https://lh3.googleusercontent.com/..."
  }
}
```

**Features:**
- Firebase ID token verification
- Automatic user creation for new Google users
- Account linking for existing email/password users
- Profile picture and name sync
- Rate limiting
- Audit logging

**Security:**
- Firebase Admin SDK token verification
- Secure token validation
- Prevents token reuse
- XSS protection via HTTP-only cookies

---

#### `POST /api/auth/signup`
**File:** [src/app/api/auth/signup/route.ts](src/app/api/auth/signup/route.ts)

**Request Body:**
```json
{
  "name": "Aloo Kumar",
  "email": "aloo@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_...",
    "name": "Aloo Kumar",
    "email": "aloo@example.com",
    "role": "customer"
  }
}
```

**Security:**
- Password validation (min 8 chars, uppercase, lowercase, number)
- Email uniqueness check
- Bcrypt hashing (12 salt rounds)
- Input sanitization
- Rate limiting (10 requests/15 minutes per IP)
- HTTP-only cookie for JWT token

---

#### `POST /api/auth/login`
**File:** [src/app/api/auth/login/route.ts](src/app/api/auth/login/route.ts)

**Request Body:**
```json
{
  "email": "aloo@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_...",
    "name": "Aloo Kumar",
    "email": "aloo@example.com",
    "role": "customer"
  }
}
```

**Security:**
- Constant-time password comparison
- Generic error messages (prevents user enumeration)
- Rate limiting (5 requests/15 minutes per IP)
- Audit logging (login attempts)

---

#### `POST /api/auth/logout`
**File:** [src/app/api/auth/logout/route.ts](src/app/api/auth/logout/route.ts)

**Response:**
```json
{
  "success": true
}
```

**Action:** Clears HTTP-only cookie

---

### Product APIs

#### `GET /api/products`
**File:** [src/app/api/products/route.ts](src/app/api/products/route.ts)

**Query Parameters:**
- `category` - Filter by category (earrings, necklaces, rings, bangles, sets)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sort` - Sort order (latest, price-asc, price-desc, rating)
- `featured` - Filter featured products (true/false)

**Example:** `/api/products?category=earrings&minPrice=500&maxPrice=2000&sort=price-asc`

**Response:**
```json
[
  {
    "id": "prod_...",
    "name": "Pearl Heart Earrings",
    "price": "1299.00",
    "discount": "10.00",
    "category": "earrings",
    "images": ["https://..."],
    "stock": 50,
    "featured": true,
    ...
  }
]
```

---

#### `GET /api/products/[id]`
**File:** [src/app/api/products/[id]/route.ts](src/app/api/products/[id]/route.ts)

**Response:**
```json
{
  "id": "prod_...",
  "name": "Pearl Heart Earrings",
  "price": "1299.00",
  "discount": "10.00",
  "description": "Beautiful pearl earrings...",
  "images": ["https://...", "https://..."],
  "stock": 50,
  "material": "Gold Plated",
  "reviews": [
    {
      "id": "review_...",
      "rating": 5,
      "comment": "Amazing quality!",
      "user": { "name": "Priya" },
      "createdAt": "2026-01-20T..."
    }
  ],
  "averageRating": 4.8
}
```

---

### Order APIs

#### `POST /api/orders`
**File:** [src/app/api/orders/route.ts](src/app/api/orders/route.ts)

**Request Body:**
```json
{
  "userId": "user_..." // Optional (guest checkout)
  "customerName": "Aloo Kumar",
  "customerEmail": "aloo@example.com",
  "customerPhone": "+91 9876543210",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "items": [
    {
      "productId": "prod_...",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "id": "order_...",
  "totalPrice": "2598.00",
  "status": "placed",
  "createdAt": "2026-01-30T..."
}
```

**Features:**
- Database transaction for atomicity
- Stock validation & deduction
- Out-of-stock prevention
- Race condition handling (row-level locking)

---

#### `GET /api/orders`
**File:** [src/app/api/orders/route.ts](src/app/api/orders/route.ts)

**Authentication:** Required (JWT token in cookie)

**Response:**
```json
[
  {
    "id": "order_...",
    "totalPrice": "2598.00",
    "status": "shipped",
    "customerName": "Aloo Kumar",
    "orderItems": [
      {
        "productId": "prod_...",
        "quantity": 2,
        "price": "1299.00",
        "product": { "name": "Pearl Heart Earrings", ... }
      }
    ],
    "createdAt": "2026-01-25T..."
  }
]
```

---

### Review APIs

#### `POST /api/reviews`
**File:** [src/app/api/reviews/route.ts](src/app/api/reviews/route.ts)

**Authentication:** Required

**Request Body:**
```json
{
  "productId": "prod_...",
  "rating": 5,
  "comment": "Amazing quality! Highly recommend."
}
```

**Response:**
```json
{
  "success": true,
  "review": {
    "id": "review_...",
    "rating": 5,
    "comment": "Amazing quality!",
    "approved": false,
    "verifiedPurchase": true
  },
  "message": "Review submitted successfully. It will be visible after admin approval."
}
```

**Validation:**
- User must have purchased the product
- One review per user per product
- Rating between 1-5
- Comment length 10-1000 characters
- Admin approval required

---

### Cart Validation API

#### `POST /api/cart/validate`
**File:** [src/app/api/cart/validate/route.ts](src/app/api/cart/validate/route.ts)

**Request Body:**
```json
{
  "productIds": ["prod_123", "prod_456"]
}
```

**Response:**
```json
{
  "valid": true,
  "unavailableProductIds": [],
  "unavailableProducts": []
}
```

**Purpose:** Validates cart items before checkout to ensure products still exist and are in stock.

---

### Payment APIs

#### `POST /api/payment/phonepe/create`
**File:** [src/app/api/payment/phonepe/create/route.ts](src/app/api/payment/phonepe/create/route.ts)

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "orderId": "order_xyz123",
  "amount": 2598.00,
  "customerName": "Aloo Kumar",
  "customerEmail": "aloo@example.com",
  "customerPhone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://mercury.phonepe.com/...",
  "merchantOrderId": "CHJ_1234567890",
  "environment": "sandbox"
}
```

**Features:**
- Creates PhonePe payment order with OAuth 2.0 authentication
- Generates secure payment URL with signature
- Returns payment URL for user redirection
- Supports sandbox and production environments

---

#### `GET /api/payment/phonepe/status?merchantOrderId=CHJ_1234567890`
**File:** [src/app/api/payment/phonepe/status/route.ts](src/app/api/payment/phonepe/status/route.ts)

**Authentication:** Required (JWT token)

**Response:**
```json
{
  "success": true,
  "status": "completed",
  "transactionId": "T1234567890",
  "amount": 2598.00,
  "paymentMethod": "UPI",
  "merchantOrderId": "CHJ_1234567890"
}
```

**Purpose:** Check payment status for a given order

---

#### `POST /api/payment/phonepe/webhook`
**File:** [src/app/api/payment/phonepe/webhook/route.ts](src/app/api/payment/phonepe/webhook/route.ts)

**Authentication:** Webhook signature verification

**Purpose:** Receives payment status updates from PhonePe. Automatically updates order status based on payment completion.

**Features:**
- Signature verification for security
- Idempotent webhook handling
- Automatic order status updates
- Transaction logging

---

### Admin APIs

#### `GET /api/admin/dashboard`
**File:** [src/app/api/admin/dashboard/route.ts](src/app/api/admin/dashboard/route.ts)

**Authentication:** Admin role required

**Response:**
```json
{
  "totalSales": 125000.00,
  "totalOrders": 342,
  "monthSales": 28500.00,
  "bestSellingProducts": [
    {
      "name": "Pearl Heart Earrings",
      "price": "1299.00",
      "totalSold": 89
    }
  ],
  "lowStockProducts": [
    {
      "id": "prod_...",
      "name": "Gold Bangles Set",
      "stock": 3
    }
  ]
}
```

---

#### `POST /api/admin/products`
**File:** [src/app/api/admin/products/route.ts](src/app/api/admin/products/route.ts)

**Authentication:** Admin role required

**Request Body:** (Extensive product fields - see schema)
```json
{
  "name": "Pearl Heart Earrings",
  "description": "Beautiful pearl earrings...",
  "price": 1299,
  "discount": 10,
  "category": "earrings",
  "stock": 50,
  "images": ["https://...", "https://..."],
  "material": "Gold Plated",
  ...
}
```

---

#### `PUT /api/admin/orders/[id]`
**File:** [src/app/api/admin/orders/[id]/route.ts](src/app/api/admin/orders/[id]/route.ts)

**Authentication:** Admin role required

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response:**
```json
{
  "success": true,
  "order": { ... }
}
```

---

#### `PUT /api/admin/reviews/[id]`
**File:** [src/app/api/admin/reviews/[id]/route.ts](src/app/api/admin/reviews/[id]/route.ts)

**Authentication:** Admin role required

**Actions:**
- Approve review: `PUT /api/admin/reviews/[id]` with `{ "approved": true }`
- Delete review: `DELETE /api/admin/reviews/[id]`

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #E8D5C2 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## 🧩 Components

<div style="color: #5A3E2B;">

### **GoogleSignInButton** (`src/components/GoogleSignInButton.tsx`)
- Google OAuth sign-in button
- Firebase Authentication integration
- Popup-based authentication flow
- Error handling and user feedback
- Loading states
- Customizable styling and redirect
- Toast notifications for success/error
- Automatic account creation/linking

---

### **Navbar** (`src/components/Navbar.tsx`)
- Fixed top navigation
- Logo and brand name
- Category links (desktop)
- Shopping cart icon with item count badge
- User menu (dropdown):
  - My Orders
  - Admin Panel (admin only)
  - Logout
- Mobile menu (hamburger)
- Scroll-based background blur effect

---

### **Footer** (`src/components/Footer.tsx`)
- Brand information
- Quick links
- Contact information
- Social media links
- Copyright notice
- Gradient background

---

### **ProductCard** (`src/components/ProductCard.tsx`)
- Product thumbnail image
- **Responsive design** - Optimized for mobile and desktop
- **SVG placeholder** - Fallback for missing images
- Product name
- Price with discount
- **Circular discount badge** - Responsive sizing (smaller on mobile)
- Hover effects with smooth transitions
- Category label
- "Quick View" button
- Link to product detail page
- Image error handling

---

### **ProductFormModal** (`src/components/ProductFormModal.tsx`)
- Modal for creating/editing products
- Form with all product fields
- Image upload component
- Validation
- Submit/Cancel buttons

---

### **AdminSidebar** (`src/components/AdminSidebar.tsx`)
- Fixed left sidebar for admin pages
- Navigation links:
  - Dashboard
  - Products
  - Orders
  - Reviews
- Active route highlighting
- Logout button

---

### **ErrorBoundary** (`src/components/ErrorBoundary.tsx`)
- Catches React errors
- Displays fallback UI
- Error logging

</div>

</div>

---

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F2E6D8 100%); padding: 30px; border-radius: 16px; border: 2px solid #C89A7A; margin: 20px 0;">

## 📦 State Management

<div style="color: #5A3E2B;">

### **Auth Store** (`src/store/authStore.ts`)
**Library:** Zustand with persistence

**State:**
```typescript
{
  user: User | null
  token: string | null
}
```

**Actions:**
- `setAuth(user, token)` - Set authentication state
- `logout()` - Clear state and call logout API
- `isAdmin()` - Check if user has admin role

**Persistence:** Local storage (`auth-storage` key)

---

### **Cart Store** (`src/store/cartStore.ts`)
**Library:** Zustand with persistence

**State:**
```typescript
{
  items: CartItem[]
}
```

**Actions:**
- `addItem(item)` - Add product to cart (merge if exists)
- `removeItem(id)` - Remove product from cart
- `updateQuantity(id, quantity)` - Change item quantity
- `clearCart()` - Empty cart
- `getTotalPrice()` - Calculate total price
- `getTotalItems()` - Count total items

**Persistence:** Local storage (`cart-storage` key)

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #E8D5C2 100%); padding: 30px; border-radius: 16px; border: 2px solid #C89A7A; margin: 20px 0;">

## 🔒 Security Features

<div style="color: #5A3E2B;">

### � Authentication & Security
- **JWT Tokens** - Secure token-based authentication
  - Algorithm: HS256
  - Expiry: 7 days
  - Issuer: `chulbuli-jewels`
  - Audience: `chulbuli-api`
- **Google OAuth 2.0** - Firebase Authentication integration
  - One-click sign-in with Google
  - Automatic user creation/linking
  - Profile picture sync
  - Secure ID token verification
- **HTTP-only Cookies** - XSS protection (token not accessible via JavaScript)
- **Bcrypt Password Hashing** - 12 salt rounds
- **Constant-time Comparison** - Prevents timing attacks
- **Role-based Access Control** - Admin vs Customer permissions
- **Multi-Provider Support** - Email/password and Google OAuth accounts can be linked

---

### Input Validation & Sanitization
**File:** [src/lib/validation.ts](src/lib/validation.ts)

- **XSS Prevention:**
  - HTML tag stripping
  - Entity escaping
  - Script tag removal
- **SQL Injection Prevention:**
  - Drizzle ORM (parameterized queries)
  - Input sanitization
- **Zod Schema Validation:**
  - Type checking
  - Range validation
  - Format validation

**Functions:**
- `sanitizeHtml()` - Remove HTML tags
- `sanitizeText()` - Clean text input
- `validateEmail()` - Email format validation
- `validatePassword()` - Password strength checking
- `validatePhoneNumber()` - Indian phone format
- `validatePincode()` - 6-digit validation

---

### Rate Limiting
**File:** [src/lib/rateLimit.ts](src/lib/rateLimit.ts)

- **Auth Endpoints:** 5 requests per 15 minutes
- **API Endpoints:** 100 requests per 15 minutes
- **Admin Endpoints:** 200 requests per 15 minutes
- **IP-based Tracking**
- **Sliding Window Algorithm**

---

### Security Headers
**File:** [next.config.js](next.config.js)

- `Strict-Transport-Security` - Force HTTPS
- `X-Frame-Options: SAMEORIGIN` - Prevent clickjacking
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection` - XSS filter
- `Referrer-Policy` - Control referrer information
- `Content-Security-Policy` - Restrict resource loading
- `Permissions-Policy` - Disable unused browser features

---

### Middleware Protection
**File:** [middleware.ts](middleware.ts)

- Request ID generation
- Origin validation for state-changing requests
- Additional security headers

---

### Password Security
**File:** [src/lib/passwordSecurity.ts](src/lib/passwordSecurity.ts)

- Common password detection
- Password strength scoring
- Requirements:
  - Minimum 8 characters
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character (optional)

---

### Audit Logging
**File:** [src/lib/auditLog.ts](src/lib/auditLog.ts)

- Login/Signup tracking
- IP address logging
- User agent tracking
- Timestamp recording

---

### 📊 Database Security
- **Connection Pooling** - Prevents connection exhaustion
- **SSL/TLS** - Encrypted connections to database
- **Row-level Locking** - Prevents race conditions
- **Transactions** - Atomic operations
- **Prepared Statements** - SQL injection prevention

</div>

</div>
- Node.js 18+ and npm
- PostgreSQL 14+
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd CHULBULI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chulbuli

# JWT Secret (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Firebase Configuration (for Google OAuth)
FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (for server-side token verification)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PhonePe Payment Gateway (Optional - for online payments)
PHONEPE_CLIENT_ID=your-phonepe-client-id
PHONEPE_CLIENT_SECRET=your-phonepe-client-secret
PHONEPE_CLIENT_VERSION=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox

# Razorpay Payment Gateway (Optional - for online payments)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# App Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
```

4. **Generate secure JWT secret**
```bash
node scripts/generate-secrets.js
```

5. **Initialize database**
```bash
# Generate migration files
npm run db:generate

# Push schema to database
npx drizzle-kit push
```

6. **Seed database with sample data**
```bash
npm run db:seed
# or
node scripts/run-seed.js
```

7. **Run development server**
<div style="background: linear-gradient(135deg, #C89A7A 0%, #E6C9A8 100%); color: white; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
✨ <strong>Your Chulbuli Jewels store is now running!</strong> ✨
</div>

</div>
</div>

```bash
npm run dev
```

8. **Open in browser**
```
http://localhost:3000
```

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #F2E6D8 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## 🌍 Environment Variables

<div style="color: #5A3E2B;">

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `abc123...xyz` |
| `FIREBASE_API_KEY` | Firebase Web API key | `AIzaSyC...` |
| `FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | `project.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-123` |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | `123456789` |
| `FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin project ID | `my-project-123` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin private key | `-----BEGIN PRIVATE KEY-----...` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin service account email | `firebase-adminsdk@...iam.gserviceaccount.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc...xyz` |
| `PHONEPE_CLIENT_ID` | PhonePe merchant client ID | `your-client-id` |
| `PHONEPE_CLIENT_SECRET` | PhonePe merchant client secret | `your-client-secret` |
| `PHONEPE_CLIENT_VERSION` | PhonePe client version | `1` |
| `PHONEPE_BASE_URL` | PhonePe API base URL | `https://api.phonepe.com/apis/pg` |
| `PHONEPE_AUTH_URL` | PhonePe OAuth URL | `https://api.phonepe.com/apis/identity-manager` |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret | `your-secret` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key (client-side) | `rzp_test_...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `NEXT_PUBLIC_APP_URL` | App base URL | `http://localhost:3000` |
| `APP_URL` | Alternative app base URL | `http://localhost:3000` |

### Payment Gateway Environment Configuration

**PhonePe Environment:**
- **Sandbox/Testing:** Use `https://api-preprod.phonepe.com/apis/pg-sandbox` for both `PHONEPE_BASE_URL` and `PHONEPE_AUTH_URL`
- **Production:** Use `https://api.phonepe.com/apis/pg` for `PHONEPE_BASE_URL` and `https://api.phonepe.com/apis/identity-manager` for `PHONEPE_AUTH_URL`

**Razorpay Environment:**
- **Test Mode:** Use test keys starting with `rzp_test_`
- **Live Mode:** Use live keys starting with `rzp_live_`

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #F2E6D8 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## 🔥 Firebase Setup (Google OAuth)

<div style="color: #5A3E2B;">

### Overview

The application uses **Firebase Authentication** for Google OAuth 2.0 sign-in, providing a seamless one-click authentication experience.

### Setup Steps

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "chulbuli-jewels")
   - Disable Google Analytics (optional)

2. **Enable Google Authentication**
   - In Firebase Console, go to **Authentication** → **Sign-in method**
   - Enable **Google** provider
   - Set support email
   - Save configuration

3. **Register Web App**
   - Go to **Project Settings** → **General**
   - Scroll to "Your apps" → Click **Web** icon (`</>`)
   - Register app with nickname (e.g., "Chulbuli Web")
   - Copy configuration values

4. **Create Service Account (for Admin SDK)**
   - Go to **Project Settings** → **Service accounts**
   - Click "Generate new private key"
   - Download JSON file
   - Extract values for `.env.local`:
     - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
     - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`
     - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`

5. **Configure Environment Variables**
   - Add Firebase config to `.env.local` (see [Environment Variables](#environment-variables))
   - **Important:** Keep `private_key` with newlines (`\n`) intact

6. **Add Authorized Domains**
   - In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
   - Add your domain(s):
     - `localhost` (for development)
     - Your production domain

### Security Considerations

- ✅ Firebase ID tokens are verified server-side using Firebase Admin SDK
- ✅ Tokens are validated for expiry and signature
- ✅ HTTP-only cookies prevent XSS attacks
- ✅ Rate limiting prevents abuse
- ✅ User creation is audited and logged

### How It Works

1. User clicks "Sign in with Google" button
2. Firebase popup opens for Google account selection
3. User authorizes the application
4. Firebase returns an ID token to the client
5. Client sends ID token to `/api/auth/google`
6. Server verifies token using Firebase Admin SDK
7. Server creates/updates user in database
8. Server generates JWT and sets HTTP-only cookie
9. User is authenticated and redirected

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #F2E6D8 100%); padding: 30px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## 💳 Payment Gateway Setup

<div style="color: #5A3E2B;">

### PhonePe Integration

**PhonePe Standard Checkout v2** uses OAuth 2.0 authentication and provides a secure payment experience.

#### Setup Steps

1. **Register with PhonePe**
   - Visit [PhonePe Business](https://business.phonepe.com/)
   - Complete merchant registration
   - Get UAT/Production credentials

2. **Obtain OAuth Credentials**
   - Login to PhonePe merchant dashboard
   - Navigate to API Configuration
   - Generate Client ID and Client Secret
   - Note down the Client Version (usually `1`)

3. **Configure Environment Variables**
   ```env
   PHONEPE_CLIENT_ID=your_client_id
   PHONEPE_CLIENT_SECRET=your_client_secret
   PHONEPE_CLIENT_VERSION=1
   
   # For Sandbox/Testing
   PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
   PHONEPE_AUTH_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
   
   # For Production
   PHONEPE_BASE_URL=https://api.phonepe.com/apis/pg
   PHONEPE_AUTH_URL=https://api.phonepe.com/apis/identity-manager
   
   # Your app URL (must be HTTPS in production)
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Configure Webhooks**
   - Add your webhook URL: `https://yourdomain.com/api/payment/phonepe/webhook`
   - PhonePe will send payment status updates to this URL
   - Webhook signature is automatically verified

#### Features
- ✅ OAuth 2.0 token-based authentication
- ✅ Automatic token refresh and caching
- ✅ Webhook signature verification
- ✅ Payment status tracking
- ✅ Transaction verification
- ✅ Support for sandbox and production environments
- ✅ Comprehensive error handling

#### Test the Integration
Run the PhonePe test endpoint:
```bash
curl http://localhost:3000/api/payment/phonepe/test
```

---

### Payment Flow

1. **Initiate Payment:**
   - User selects payment method (PhonePe/COD)
   - System creates order with unique merchant order ID
   - Payment gateway specific order is created

2. **Process Payment:**
   - User is redirected to payment gateway
   - User completes payment
   - Gateway processes the transaction

3. **Webhook/Callback:**
   - Payment gateway sends webhook notification
   - System verifies signature and updates order status
   - User is redirected to success/failure page

4. **Order Fulfillment:**
   - Order status is updated based on payment
   - Admin can view payment details
   - Customer receives order confirmation

### Security Features

- ✅ **Signature Verification** - All webhooks are verified
- ✅ **Transaction Tracking** - Unique IDs for all transactions
- ✅ **HTTPS Required** - Production requires secure connections
- ✅ **Idempotency** - Duplicate webhook handling
- ✅ **Rate Limiting** - API abuse prevention

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #E8D5C2 100%); padding: 30px; border-radius: 16px; border: 2px solid #C89A7A; margin: 20px 0;">

## 🗃️ Database Setup

<div style="color: #5A3E2B;">

### Using Drizzle Kit

1. **Generate migrations**
```bash
npm run db:generate
```

2. **Push to database**
```bash
npx drizzle-kit push
```

3. **Open Drizzle Studio (GUI)**
```bash
npx drizzle-kit studio
```

### Seeding Data

The seed script creates:
- **1 Admin User:**
  - Email: `admin@chulbulijewels.com`
  - Password: `Admin@12345`
- **1 Customer User:**
  - Email: `customer@example.com`
  - Password: `Customer@123`
- **10 Sample Products** (Earrings, Necklaces, Rings, Bangles)
- **5 Sample Orders**
- **10 Sample Reviews**

**Run seed:**
```bash
npm run db:seed
```

</div>

</div>

---

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F7F6F3 100%); padding: 30px; border-radius: 16px; border: 2px solid #C89A7A; margin: 20px 0;">

## 🚀 Deployment

<div style="color: #5A3E2B;">

### Netlify Deployment

This project is configured for easy deployment on **Netlify** with automatic CI/CD from your Git repository.

#### Quick Deploy

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Log in to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your repository
   - Netlify will auto-detect the `netlify.toml` configuration

3. **Set Environment Variables**
   
   In Netlify Dashboard → Site settings → Environment variables, add all variables from `.env.example`:
   
   - `DATABASE_URL` - PostgreSQL connection (use Supabase/Neon for production)
   - `JWT_SECRET` - Generate a new secure secret for production
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc.
   - `FIREBASE_SERVICE_ACCOUNT_KEY` - Base64 encoded service account
   - `PHONEPE_CLIENT_ID`, `PHONEPE_CLIENT_SECRET` - PhonePe payment credentials
   - `NODE_ENV=production`

4. **Update External Service Configurations**
   
   - **Firebase**: Add your Netlify domain (e.g., `yoursite.netlify.app`) to authorized domains
   - **PhonePe**: Add your Netlify domain to authorized domains
   - **Database**: Ensure your database allows connections from Netlify

5. **Deploy**
   
   Click "Deploy site" - Your site will be live in 2-5 minutes at `https://[site-name].netlify.app`

#### Configuration Files

The project includes these Netlify-ready files:

- **`netlify.toml`** - Build configuration, redirects, headers
- **`next.config.js`** - Updated with Netlify CSP domains
- **`package.json`** - Includes `@netlify/plugin-nextjs`

#### Continuous Deployment

Once connected, Netlify automatically:
- Deploys on every push to main/master branch
- Creates deploy previews for pull requests
- Provides unique URLs for each deployment

#### Custom Domain (Optional)

1. In Netlify Dashboard → Domain management
2. Add custom domain
3. Update DNS records as instructed
4. SSL certificates are provisioned automatically

📖 **Detailed Guide:** See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for complete deployment instructions, troubleshooting, and best practices.

</div>

</div>

---

<div style="background: #F7F6F3; padding: 20px; border-radius: 12px; border: 1px solid #E6C9A8;">

## 🎨 Design System

<div style="color: #5A3E2B;">

| Color | Hex | Swatch | Usage |
|-------|-----|--------|-------|
| **Champagne** | `#F2E6D8` | ![#F2E6D8](https://via.placeholder.com/80x30/F2E6D8/F2E6D8.png) | Main background |
| **Sand** | `#E8D5C2` | ![#E8D5C2](https://via.placeholder.com/80x30/E8D5C2/E8D5C2.png) | Secondary background |
| **Rose Gold** | `#C89A7A` | ![#C89A7A](https://via.placeholder.com/80x30/C89A7A/C89A7A.png) | Primary accent, buttons |
| **Soft Gold** | `#E6C9A8` | ![#E6C9A8](https://via.placeholder.com/80x30/E6C9A8/E6C9A8.png) | Highlights, hover states |
| **Pearl** | `#F7F6F3` | ![#F7F6F3](https://via.placeholder.com/80x30/F7F6F3/F7F6F3.png) | Light sections, cards |
| **Warm Brown** | `#5A3E2B` | ![#5A3E2B](https://via.placeholder.com/80x30/5A3E2B/5A3E2B.png) | Primary text, headings |
| **Taupe** | `#8B6F5A` | ![#8B6F5A](https://via.placeholder.com/80x30/8B6F5A/8B6F5A.png) | Muted text, secondary |

</div>tons |
| Soft Gold | `#E6C9A8` | Highlights, hover states |
| Pearl | `#F7F6F3` | Light sections, cards |
| Warm Brown | `#5A3E2B` | Primary text, headings |
| **Taupe** | `#8B6F5A` | ![#8B6F5A](https://via.placeholder.com/80x30/8B6F5A/8B6F5A.png) | Muted text, secondary |

<div style="background: linear-gradient(135deg, #F2E6D8 0%, #E8D5C2 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #C89A7A;">

**Fonts:**
- <span style="font-family: 'Playfair Display', serif; color: #5A3E2B; font-size: 1.5em;">**Headings:** Playfair Display (serif)</span> - 300, 400, 500, 600, 700
- **Body:** Poppins (sans-serif) - 200, 300, 400, 500, 600
- **UI Elements:** Inter (sans-serif) - 200, 300, 400, 500, 600

**Font Sizes:**
- **H1:** 3rem (mobile), 4.5rem (desktop)
- **H2:** 2.25rem (mobile), 3rem (desktop)
- **H3:** 1.5rem
- **Body:** 1rem (16px)

</div>

</div>

---

<div style="color: #5A3E2B;">

### Spacing & Layout

**Sections:**
- Padding: `py-16 md:py-24` (4rem - 6rem)
- Container max-width: `1600px`
- Grid gap: `gap-8 lg:gap-10`

**Cards:**
- Border radius: `rounded-2xl` (16px)
- Shadow: `shadow-luxury` (0 10px 30px rgba(200,154,122,0.15))
- Padding: `p-6 md:p-8`

### Animations

**Transitions:**
- Duration: `300ms` (buttons), `500ms` (cards), `600ms` (navigation)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (ease-in-out)

**Hover Effects:**
- Button: `translateY(-2px)` + shadow increase
- Card: `scale(1.02)` + shadow increase
- Text: Letter-spacing expansion

### Buttons

**Primary Button:**
```css
.btn-primary {
  background: #C89A7A      /* Rose Gold */
  color: #F7F6F3           /* Pearl */
  padding: 0.75rem 1.5rem
  border-radius: 9999px    /* Full rounded */
  box-shadow: 0 10px 30px rgba(200,154,122,0.15)
}
```

**Hover State:**
```css
background: #E6C9A8      /* Soft Gold */
color: #5A3E2B           /* Warm Brown */
transform: translateY(-2px)
box-shadow: 0 15px 40px rgba(200,154,122,0.25)
```

<div style="display: inline-block; background: #C89A7A; color: #F7F6F3; padding: 12px 24px; border-radius: 50px; font-weight: 500; margin-top: 10px;">
Example Primary Button
</div>

</div>

</div>

---

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F7F6F3 100%); padding: 25px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## 📝 Scripts

<div style="color: #5A3E2B;">

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `start` | `npm start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `db:generate` | `npm run db:generate` | Generate Drizzle migrations |
| `db:migrate` | `npm run db:migrate` | Run Drizzle migrations |
| `db:seed` | `npm run db:seed` | Seed database with sample data |

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #F2E6D8 100%); padding: 30px; border-radius: 16px; border: 2px solid #C89A7A; margin: 20px 0;">

## 🛣️ Roadmap

<div style="color: #5A3E2B;">

### Phase 1 (MVP) ✅
- [x] User authentication (email/password)
- [x] **Google OAuth Sign-In** - Firebase Authentication integration
- [x] **Multi-provider authentication** - Account linking for email and Google
- [x] Product catalog with filtering
- [x] Shopping cart
- [x] Order placement with sequential order numbers
- [x] **Online payments** - PhonePe and Razorpay integration
- [x] **Payment webhooks** - Automatic order status updates
- [x] **Multiple addresses** - Save and manage delivery addresses
- [x] Admin panel (products, orders, reviews)
- [x] Review system
- [x] **Account management** - Deactivation and soft delete

### Phase 2 (In Progress) 🚧
- [x] **Online payment (PhonePe/Razorpay)** ✅ Completed
- [ ] Email notifications (order confirmation, shipping)
- [ ] Order tracking page with real-time updates
- [ ] Wishlist feature
- [ ] Product search with autocomplete
- [ ] Customer notifications for order status changes

### Phase 3 (Planned) 📋
- [ ] Size guide and product recommendations
- [ ] Customer support chat
- [ ] Loyalty points program
- [ ] Gift wrapping option
- [ ] Order cancellation/returns management
- [ ] Product reviews with images
- [ ] Advanced analytics dashboard
- [ ] Inventory forecasting

</div>

</div>

---

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F2E6D8 100%); padding: 25px; border-radius: 16px; border-left: 5px solid #C89A7A; margin: 20px 0;">

## 🤝 Contributing

<div style="color: #5A3E2B;">

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #E8D5C2 100%); padding: 20px; border-radius: 12px; border: 1px solid #C89A7A; margin: 20px 0; text-align: center;">

## 📄 License

<div style="color: #5A3E2B;">

This project is proprietary software for Chulbuli Jewels.

</div>

</div>

---
<div align="center" style="background: linear-gradient(135deg, #F2E6D8 0%, #E8D5C2 100%); padding: 40px; border-radius: 16px; border-top: 3px solid #C89A7A; margin-top: 40px;">

<p style="font-family: 'Playfair Display', serif; font-size: 1.5em; color: #5A3E2B; margin-bottom: 10px;">
🪷 CHULBULI JEWELS 🪷
</p>

<p style="color: #C89A7A; font-style: italic; letter-spacing: 0.1em;">
Elegance You Can Feel
</p>

<p style="color: #8B6F5A; margin-top: 20px;">
Built with ❤️ and premium design
</p>

<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E6C9A8;">
<span style="color: #5A3E2B;">© 2026 Chulbuli Jewels. All rights reserved.</span>
</div>

</div>

---

<div style="background: linear-gradient(135deg, #E8D5C2 0%, #F7F6F3 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #C89A7A; margin: 20px 0;">

## 📞 Support

<div style="color: #5A3E2B;">

For support, email: **support@chulbulijewels.com**

</div>

</div>

---

<div style="background: linear-gradient(135deg, #F7F6F3 0%, #F2E6D8 100%); padding: 25px; border-radius: 16px; border: 1px solid #C89A7A; margin: 20px 0;">

## 🙏 Acknowledgments

<div style="color: #5A3E2B;">

- 🎨 Design inspiration: Luxury jewelry brands
- 🎼 Icons: React Icons (Feather Icons)
- ✨ Fonts: Google Fonts
- 🖼️ Image hosting: Cloudinary

</div>

</div>

---
