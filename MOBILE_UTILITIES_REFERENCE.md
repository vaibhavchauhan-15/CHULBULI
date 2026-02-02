# Mobile-First Utilities Reference - Chulbuli Jewels

Quick reference for all mobile optimization classes and patterns used in the project.

## 🎨 Core CSS Classes

### Touch Targets
```css
/* Minimum 48px touch area */
.touch-target {
  min-width: 48px;
  min-height: 48px;
}

/* Larger touch area for primary actions */
.touch-target-large {
  min-width: 56px;
  min-height: 56px;
}
```

**Usage**:
```tsx
<button className="touch-target">Click me</button>
```

---

### Input System
```css
/* Luxury input - prevents iOS zoom */
.input-luxury {
  @apply h-12 px-4 py-3 rounded-xl;
  @apply border-2 border-rosegold/30;
  @apply bg-white text-warmbrown;
  @apply focus:border-rosegold focus:ring-2 focus:ring-rosegold/20;
  @apply transition-all duration-300;
  @apply text-base; /* 16px - prevents iOS zoom */
}
```

**Usage**:
```tsx
<input 
  type="text"
  className="input-luxury w-full"
  placeholder="Enter your email"
/>
```

---

### Buttons
```css
/* Mobile-first button */
.btn-mobile-full {
  @apply w-full md:w-auto;
  @apply min-h-12; /* 48px touch target */
}

/* Active feedback */
.active\:scale-95:active {
  transform: scale(0.95);
}

.active\:scale-98:active {
  transform: scale(0.98);
}
```

**Usage**:
```tsx
<button className="btn-mobile-full min-h-12 active:scale-98 
                   bg-gradient-to-r from-rosegold to-softgold 
                   text-white rounded-full transition-all">
  Add to Cart
</button>
```

---

### Safe Areas (iPhone X+)
```css
/* Basic safe area */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}

/* Enhanced safe area with minimum */
.safe-area-bottom {
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
}
```

**Usage**:
```tsx
{/* Bottom navigation */}
<nav className="fixed bottom-0 left-0 right-0 pb-safe">
  {/* content */}
</nav>
```

---

### Sticky Mobile Elements
```css
/* Sticky CTA button at bottom */
.sticky-bottom-mobile {
  @apply fixed bottom-0 left-0 right-0 md:sticky md:bottom-auto;
  @apply bg-pearl border-t border-rosegold/20;
  @apply p-4 md:p-6 z-40;
}
```

**Usage**:
```tsx
<div className="sticky-bottom-mobile pb-safe">
  <button className="btn-mobile-full">Checkout</button>
</div>
```

---

### Cards
```css
/* Mobile-optimized card */
.mobile-card {
  @apply rounded-xl md:rounded-2xl;
  @apply p-3 md:p-6;
}

/* Card with shadow */
.shadow-luxury {
  box-shadow: 0 10px 40px rgba(90, 62, 43, 0.1);
}
```

**Usage**:
```tsx
<div className="mobile-card bg-pearl shadow-luxury">
  {/* content */}
</div>
```

---

### Scrollbars
```css
/* Hide scrollbar */
.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

**Usage**:
```tsx
<div className="overflow-y-auto scrollbar-hide max-h-screen">
  {/* scrollable content */}
</div>
```

---

## 📱 Responsive Patterns

### Typography Scale
```tsx
/* Mobile-first heading sizes */
<h1 className="text-2xl md:text-5xl lg:text-7xl">Hero Title</h1>
<h2 className="text-xl md:text-3xl lg:text-4xl">Section Title</h2>
<h3 className="text-lg md:text-2xl">Subsection</h3>
<p className="text-sm md:text-base">Body text</p>
```

### Spacing
```tsx
/* Mobile: 1rem, Desktop: 2rem */
<div className="p-4 md:p-8">
  <div className="mb-4 md:mb-8">
    <div className="gap-3 md:gap-6">
      {/* content */}
    </div>
  </div>
</div>
```

### Grid Layouts
```tsx
/* Product Grid */
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
  {products.map(product => <ProductCard key={product.id} {...product} />)}
</div>

/* Admin Stats */
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
  {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
</div>

/* Two-column form */
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
  <input className="input-luxury" />
  <input className="input-luxury" />
</div>
```

---

## 🎯 Common Patterns

### Modal (Full-screen mobile)
```tsx
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm 
                flex items-center justify-center sm:p-4 z-50">
  <div className="bg-pearl h-full w-full sm:rounded-2xl 
                  sm:max-w-4xl sm:max-h-[90vh] 
                  overflow-y-auto">
    {/* Modal content */}
  </div>
</div>
```

### Form Input
```tsx
<div className="space-y-4">
  <label className="block text-sm font-medium text-warmbrown mb-1">
    Email Address
  </label>
  <input 
    type="email"
    className="input-luxury w-full"
    placeholder="your@email.com"
  />
</div>
```

### Button with Icon
```tsx
<button className="btn-mobile-full min-h-12 touch-target active:scale-98
                   flex items-center justify-center gap-2
                   bg-gradient-to-r from-rosegold to-softgold 
                   text-white rounded-full transition-all">
  <FiShoppingCart className="w-5 h-5" />
  <span>Add to Cart</span>
</button>
```

### Card with Image
```tsx
<div className="mobile-card bg-pearl shadow-luxury overflow-hidden">
  <div className="aspect-square bg-sand relative overflow-hidden">
    <img 
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </div>
  <div className="p-3 md:p-6">
    <h3 className="text-sm md:text-base font-semibold">{product.name}</h3>
    <p className="text-lg md:text-xl font-bold text-rosegold">₹{product.price}</p>
  </div>
</div>
```

### Sticky Header
```tsx
<header className="sticky top-0 z-50 bg-pearl border-b border-rosegold/20 
                   shadow-sm backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
    {/* Header content */}
  </div>
</header>
```

### Bottom Navigation (Admin)
```tsx
<nav className="fixed bottom-0 left-0 right-0 md:hidden 
                bg-white border-t border-rosegold/20 
                pb-safe z-50">
  <div className="grid grid-cols-5 gap-1">
    {navItems.map(item => (
      <button 
        key={item.id}
        className="flex flex-col items-center justify-center 
                   py-2 touch-target active:scale-95 transition-transform"
      >
        <item.icon className="w-5 h-5 mb-1" />
        <span className="text-xs">{item.label}</span>
      </button>
    ))}
  </div>
</nav>
```

---

## 🎨 Color Utilities

### Backgrounds
```tsx
<div className="bg-champagne">    {/* #F2E6D8 - Page background */}
<div className="bg-pearl">        {/* #F7F6F3 - Card background */}
<div className="bg-sand">         {/* #E8DCC8 - Skeleton/divider */}
<div className="bg-rosegold">     {/* #C89A7A - Primary accent */}
<div className="bg-warmbrown">    {/* #5A3E2B - Dark background */}
```

### Text Colors
```tsx
<p className="text-warmbrown">    {/* #5A3E2B - Primary text */}
<p className="text-rosegold">     {/* #C89A7A - Accent text */}
<p className="text-taupe">        {/* #9B8B7E - Secondary text */}
```

### Gradients
```tsx
<div className="bg-gradient-to-r from-rosegold to-softgold">
  Primary gradient
</div>

<div className="bg-gradient-to-br from-pearl to-champagne">
  Subtle gradient
</div>
```

---

## ⚡ Performance Utilities

### Image Loading
```tsx
<img 
  src={product.image}
  alt={product.name}
  loading="lazy"          // Lazy load
  decoding="async"        // Async decode
  className="w-full"
/>
```

### Aspect Ratios
```tsx
<div className="aspect-square">   {/* 1:1 */}
<div className="aspect-video">    {/* 16:9 */}
<div className="aspect-[4/3]">    {/* Custom 4:3 */}
```

### Skeleton Loading
```tsx
<div className="bg-sand animate-pulse rounded h-6 w-3/4"></div>
```

---

## 📱 Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

**Mobile-first approach**:
```tsx
{/* Base (mobile): 2 columns */}
{/* Medium (tablet): 3 columns */}
{/* Large (desktop): 4 columns */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
```

---

## 🎯 Accessibility Utilities

### Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Usage**:
```tsx
<button>
  <FiShoppingCart />
  <span className="sr-only">Add to cart</span>
</button>
```

### Focus Visible
```tsx
<button className="focus-visible:ring-2 focus-visible:ring-rosegold 
                   focus-visible:ring-offset-2 
                   focus-visible:outline-none">
  Keyboard accessible
</button>
```

---

## 🔧 Animation Utilities

### Transitions
```tsx
<button className="transition-all duration-300">
  Smooth transition
</button>

<div className="transition-transform duration-200 active:scale-98">
  Quick feedback
</div>
```

### Hover States (Desktop only)
```tsx
<button className="hover:bg-rosegold/10 hover:shadow-lg 
                   transition-all duration-300">
  Hover effect
</button>
```

### Loading Spinner
```tsx
<div className="w-6 h-6 border-2 border-rosegold/30 border-t-rosegold 
                rounded-full animate-spin">
</div>
```

---

## 📦 Component Templates

### Product Card
```tsx
<div className="mobile-card bg-pearl shadow-luxury group cursor-pointer">
  <div className="aspect-square bg-sand rounded-xl overflow-hidden mb-3">
    <img 
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover group-hover:scale-105 
                 transition-transform duration-300"
      loading="lazy"
    />
  </div>
  <h3 className="text-sm md:text-base font-semibold text-warmbrown 
                 line-clamp-2 mb-2">
    {product.name}
  </h3>
  <p className="text-lg md:text-xl font-bold text-rosegold mb-3">
    ₹{product.price}
  </p>
  <button className="btn-mobile-full min-h-12 touch-target active:scale-98
                     bg-gradient-to-r from-rosegold to-softgold 
                     text-white rounded-full transition-all">
    Add to Cart
  </button>
</div>
```

### Form Section
```tsx
<div className="mobile-card bg-pearl shadow-luxury">
  <h2 className="text-xl md:text-2xl font-playfair font-bold 
                 text-warmbrown mb-6">
    Contact Information
  </h2>
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-warmbrown mb-1">
        Full Name
      </label>
      <input 
        type="text"
        className="input-luxury w-full"
        placeholder="John Doe"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-warmbrown mb-1">
        Email
      </label>
      <input 
        type="email"
        className="input-luxury w-full"
        placeholder="john@example.com"
      />
    </div>
  </div>
</div>
```

### Stats Card
```tsx
<div className="mobile-card bg-pearl shadow-luxury">
  <div className="flex items-center gap-3 mb-3">
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full 
                    bg-gradient-to-r from-rosegold to-softgold 
                    flex items-center justify-center">
      <FiShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
    </div>
    <h3 className="text-sm md:text-base text-taupe">Total Orders</h3>
  </div>
  <p className="text-2xl md:text-3xl font-bold text-warmbrown">
    {stats.totalOrders}
  </p>
  <p className="text-xs md:text-sm text-rosegold/60 mt-1">
    +12% from last month
  </p>
</div>
```

---

## 🚀 Quick Copy-Paste Snippets

### Primary Button
```tsx
<button className="btn-mobile-full min-h-12 touch-target active:scale-98 
                   bg-gradient-to-r from-rosegold to-softgold text-white 
                   rounded-full font-semibold transition-all shadow-lg 
                   hover:shadow-xl">
  Click Me
</button>
```

### Secondary Button
```tsx
<button className="btn-mobile-full min-h-12 touch-target active:scale-98 
                   border-2 border-rosegold/30 text-warmbrown 
                   rounded-full font-semibold transition-all 
                   hover:bg-rosegold/10">
  Cancel
</button>
```

### Text Input
```tsx
<input 
  type="text"
  className="input-luxury w-full"
  placeholder="Enter value..."
/>
```

### Textarea
```tsx
<textarea 
  className="input-luxury w-full min-h-[100px] resize-none"
  placeholder="Enter description..."
/>
```

### Select Dropdown
```tsx
<select className="input-luxury w-full">
  <option value="">Select an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</select>
```

### Icon Button
```tsx
<button className="touch-target p-2 rounded-full 
                   hover:bg-rosegold/10 active:scale-95 
                   text-rosegold transition-all"
        aria-label="Search">
  <FiSearch className="w-5 h-5" />
</button>
```

### Badge
```tsx
<span className="px-3 py-1 rounded-full text-xs font-semibold 
               bg-gradient-to-r from-rosegold to-softgold text-white">
  New
</span>
```

### Divider
```tsx
<hr className="border-rosegold/20 my-6" />
```

---

## 💡 Pro Tips

1. **Always use mobile-first**: Start with mobile styles, add `md:` prefixes for desktop
2. **Touch targets**: Minimum 48px for all interactive elements
3. **Safe areas**: Use `pb-safe` on bottom navigation/sticky elements
4. **Input font size**: Always 16px or larger to prevent iOS zoom
5. **Active states**: Add `active:scale-95` or `active:scale-98` for tactile feedback
6. **Transitions**: Use 200-300ms for smooth animations
7. **Aspect ratios**: Use `aspect-square`, `aspect-video` for consistent image sizes
8. **Loading states**: Always provide skeleton screens
9. **Error states**: Make retry buttons large and obvious
10. **Accessibility**: Add ARIA labels to icon-only buttons

---

**Last Updated**: Mobile Optimization Phase  
**Status**: Production Ready ✅  
**Files**: 31 modified/created  
**Completion**: 25/28 tasks (89%)
