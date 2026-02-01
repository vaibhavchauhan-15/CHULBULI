'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiX, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface ProductFormModalProps {
  show: boolean
  isEdit: boolean
  formData: any
  setFormData: (data: any) => void
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  uploading: boolean
  selectedImages: File[]
  imagePreviewUrls: string[]
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
}

export default function ProductFormModal({
  show,
  isEdit,
  formData,
  setFormData,
  onClose,
  onSubmit,
  uploading,
  selectedImages,
  imagePreviewUrls,
  handleImageSelect,
  removeImage,
}: ProductFormModalProps) {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    pricing: true,
    inventory: true,
    images: true,
    attributes: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-[#F7F6F3] to-[#F2E6D8] rounded-2xl p-6 max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#C89A7A]/20">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-gradient-to-br from-[#F7F6F3] to-[#F2E6D8] pb-4 border-b border-[#C89A7A]/20 z-10">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-[#5A3E2B]">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-[#5A3E2B]/60 mt-1">
              {isEdit ? 'Update your product information' : 'Create a comprehensive jewelry product listing'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors text-[#5A3E2B]"
            type="button"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* 1️⃣ BASIC PRODUCT INFORMATION */}
          <Section 
            title="Basic Product Information" 
            expanded={expandedSections.basic} 
            onToggle={() => toggleSection('basic')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label-luxury">
                  Product Name <span className="text-[#C89A7A]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="Chulbuli Gold Floral Stud Earrings"
                  required
                />
              </div>

              <div>
                <label className="label-luxury">SKU / Product Code</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="Auto-generated or manual (e.g., CHB-EAR-001)"
                />
              </div>

              <div>
                <label className="label-luxury">
                  Product Status <span className="text-[#C89A7A]">*</span>
                </label>
                <select
                  value={formData.productStatus}
                  onChange={(e) => setFormData({ ...formData, productStatus: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">
                  Category <span className="text-[#C89A7A]">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-luxury w-full"
                  required
                >
                  <option value="earrings">Earrings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="rings">Rings</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="anklets">Anklets</option>
                  <option value="sets">Sets</option>
                  <option value="bangles">Bangles</option>
                  <option value="pendants">Pendants</option>
                  <option value="nose_pins">Nose Pins</option>
                  <option value="maang_tikka">Maang Tikka</option>
                  <option value="hair_accessories">Hair Accessories</option>
                  <option value="toe_rings">Toe Rings</option>
                  <option value="waist_belt">Waist Belt/Kamarbandh</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">Sub-Category</label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="">Select Sub-Category</option>
                  <option value="stud">Stud</option>
                  <option value="hoop">Hoop</option>
                  <option value="drop">Drop</option>
                  <option value="dangle">Dangle</option>
                  <option value="jhumka">Jhumka</option>
                  <option value="chandbali">Chandbali</option>
                  <option value="bali">Bali</option>
                  <option value="threader">Threader</option>
                  <option value="cuff">Cuff</option>
                  <option value="climber">Climber</option>
                  <option value="huggies">Huggies</option>
                  <option value="cluster">Cluster</option>
                  <option value="sui_dhaga">Sui Dhaga</option>
                  <option value="ear_jacket">Ear Jacket</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label-luxury">Brand / Collection</label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="">Select Collection</option>
                  <option value="chulbuli_signature">Chulbuli Signature</option>
                  <option value="festive_collection">Festive Collection</option>
                  <option value="bridal_collection">Bridal Collection</option>
                  <option value="daily_wear">Daily Wear</option>
                  <option value="party_wear">Party Wear</option>
                  <option value="ethnic_collection">Ethnic Collection</option>
                  <option value="modern_minimalist">Modern Minimalist</option>
                  <option value="traditional_collection">Traditional Collection</option>
                  <option value="royal_heritage">Royal Heritage</option>
                  <option value="contemporary_fusion">Contemporary Fusion</option>
                  <option value="temple_jewellery">Temple Jewellery</option>
                  <option value="navratri_special">Navratri Special</option>
                  <option value="wedding_essentials">Wedding Essentials</option>
                  <option value="office_wear">Office Wear</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="label-luxury">
                  Short Description <span className="text-[#5A3E2B]/40">(Bullet Points)</span>
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="input-luxury w-full min-h-[80px] resize-none"
                  placeholder="• Lightweight & comfortable&#10;• Skin-friendly material&#10;• Perfect for daily wear"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label-luxury">
                  Full Description <span className="text-[#C89A7A]">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-luxury w-full min-h-[100px] resize-none"
                  placeholder="These elegant floral stud earrings are designed for modern women who love minimal luxury..."
                  required
                />
              </div>
            </div>
          </Section>

          {/* 2️⃣ PRICING & TAX */}
          <Section 
            title="Pricing & Tax Section" 
            expanded={expandedSections.pricing} 
            onToggle={() => toggleSection('pricing')}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-luxury">
                  Base Price (MRP) <span className="text-[#C89A7A]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="199"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="label-luxury">
                  Selling Price <span className="text-[#C89A7A]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="149"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="label-luxury">Cost Price (Internal)</label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="80"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="label-luxury">Discount Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat (₹)</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">Discount Value</label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="10"
                  min="0"
                />
              </div>

              <div>
                <label className="label-luxury">GST / Tax (%)</label>
                <input
                  type="number"
                  value={formData.gstPercentage}
                  onChange={(e) => setFormData({ ...formData, gstPercentage: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="3"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-[#5A3E2B]/50 mt-1">Standard: 3% for jewelry in India</p>
              </div>
            </div>
          </Section>

          {/* 3️⃣ INVENTORY & STOCK */}
          <Section 
            title="Inventory & Stock Management" 
            expanded={expandedSections.inventory} 
            onToggle={() => toggleSection('inventory')}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-luxury">
                  Stock Quantity <span className="text-[#C89A7A]">*</span>
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="50"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="label-luxury">Low Stock Alert</label>
                <input
                  type="number"
                  value={formData.lowStockAlert}
                  onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="5"
                  min="0"
                />
                <p className="text-xs text-[#5A3E2B]/50 mt-1">Alert when stock drops below this</p>
              </div>

              <div>
                <label className="label-luxury">Stock Status</label>
                <select
                  value={formData.stockStatus}
                  onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="pre_order">Pre-Order</option>
                </select>
              </div>
            </div>
          </Section>

          {/* 4️⃣ PRODUCT IMAGES & MEDIA */}
          <Section 
            title="Product Images & Media" 
            expanded={expandedSections.images} 
            onToggle={() => toggleSection('images')}
          >
            <div className="space-y-4">
              <div>
                <label className="label-luxury mb-2">Product Images</label>
                <div className="bg-white/60 border-2 border-dashed border-[#C89A7A]/40 rounded-xl p-6 text-center hover:border-[#C89A7A] transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="product-images"
                  />
                  <label htmlFor="product-images" className="cursor-pointer">
                    <div className="mb-2">
                      <div className="bg-[#C89A7A]/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FiPlus className="w-6 h-6 text-[#C89A7A]" />
                      </div>
                      <p className="text-sm font-medium text-[#5A3E2B]">Click to upload images</p>
                      <p className="text-xs text-[#5A3E2B]/60 mt-1">PNG, JPG or WEBP (max. 5MB each)</p>
                      <p className="text-xs text-[#5A3E2B]/40 mt-1">Types: Main, Side View, Model, Zoom, Back View</p>
                    </div>
                  </label>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-24 object-cover rounded-lg border-2 border-[#C89A7A]/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <FiX size={12} />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-[#C89A7A] text-white text-xs px-1.5 py-0.5 rounded font-medium">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="label-luxury">Video URL (Optional)</label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="https://example.com/product-video.mp4"
                />
                <p className="text-xs text-[#5A3E2B]/50 mt-1">360° view or product video</p>
              </div>
            </div>
          </Section>

          {/* 6️⃣ EARRING-SPECIFIC ATTRIBUTES */}
          <Section 
            title="Earring-Specific Attributes" 
            expanded={expandedSections.attributes} 
            onToggle={() => toggleSection('attributes')}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-luxury">Material</label>
                <select
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="">Select Material</option>
                  <option value="gold_plated">Gold Plated</option>
                  <option value="silver">Silver</option>
                  <option value="brass">Brass</option>
                  <option value="alloy">Alloy</option>
                  <option value="german_silver">German Silver</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">Stone Type</label>
                <select
                  value={formData.stoneType}
                  onChange={(e) => setFormData({ ...formData, stoneType: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="">Select Stone Type</option>
                  <option value="cz">CZ (Cubic Zirconia)</option>
                  <option value="pearl">Pearl</option>
                  <option value="kundan">Kundan</option>
                  <option value="polki">Polki</option>
                  <option value="diamond">Diamond</option>
                  <option value="ruby">Ruby</option>
                  <option value="emerald">Emerald</option>
                  <option value="sapphire">Sapphire</option>
                  <option value="amethyst">Amethyst</option>
                  <option value="topaz">Topaz</option>
                  <option value="garnet">Garnet</option>
                  <option value="turquoise">Turquoise</option>
                  <option value="opal">Opal</option>
                  <option value="crystal">Crystal</option>
                  <option value="semi_precious">Semi-Precious</option>
                  <option value="glass">Glass</option>
                  <option value="meenakari">Meenakari</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">Color</label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="">Select Color</option>
                  <option value="gold">Gold</option>
                  <option value="rose_gold">Rose Gold</option>
                  <option value="silver">Silver</option>
                  <option value="antique_gold">Antique Gold</option>
                  <option value="oxidized">Oxidized</option>
                  <option value="white_gold">White Gold</option>
                  <option value="platinum">Platinum</option>
                  <option value="copper">Copper</option>
                  <option value="bronze">Bronze</option>
                  <option value="black">Black</option>
                  <option value="multicolor">Multicolor</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="pink">Pink</option>
                  <option value="purple">Purple</option>
                  <option value="yellow">Yellow</option>
                  <option value="white">White</option>
                  <option value="pearl_white">Pearl White</option>
                  <option value="two_tone">Two Tone</option>
                  <option value="tri_color">Tri Color</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">Earring Type</label>
                <select
                  value={formData.earringType}
                  onChange={(e) => setFormData({ ...formData, earringType: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="">Select Type</option>
                  <option value="stud">Stud</option>
                  <option value="hoop">Hoop</option>
                  <option value="drop">Drop</option>
                  <option value="dangle">Dangle</option>
                  <option value="jhumka">Jhumka</option>
                  <option value="chandbali">Chandbali</option>
                  <option value="bali">Bali</option>
                  <option value="threader">Threader</option>
                  <option value="cuff">Cuff</option>
                  <option value="climber">Climber</option>
                  <option value="huggies">Huggies</option>
                  <option value="cluster">Cluster</option>
                  <option value="tassel">Tassel</option>
                  <option value="sui_dhaga">Sui Dhaga</option>
                  <option value="ear_jacket">Ear Jacket</option>
                  <option value="long_earring">Long Earring</option>
                  <option value="bahubali">Bahubali</option>
                  <option value="kaan_chain">Kaan Chain</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">Closure Type</label>
                <select
                  value={formData.closureType}
                  onChange={(e) => setFormData({ ...formData, closureType: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="">Select Closure</option>
                  <option value="push_back">Push Back</option>
                  <option value="screw_back">Screw Back</option>
                  <option value="hook">Hook</option>
                  <option value="lever_back">Lever Back</option>
                  <option value="french_hook">French Hook</option>
                  <option value="clip_on">Clip On</option>
                  <option value="magnetic">Magnetic</option>
                  <option value="hinge">Hinge</option>
                  <option value="latch_back">Latch Back</option>
                  <option value="stud_post">Stud Post</option>
                  <option value="ear_wire">Ear Wire</option>
                  <option value="kidney_wire">Kidney Wire</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">Finish</label>
                <select
                  value={formData.finish}
                  onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                  className="input-luxury w-full"
                >
                  <option value="">Select Finish</option>
                  <option value="matte">Matte</option>
                  <option value="glossy">Glossy</option>
                  <option value="antique">Antique</option>
                  <option value="brushed">Brushed</option>
                  <option value="polished">Polished</option>
                  <option value="hammered">Hammered</option>
                  <option value="satin">Satin</option>
                  <option value="textured">Textured</option>
                  <option value="oxidized">Oxidized</option>
                  <option value="matte_gold">Matte Gold</option>
                  <option value="high_polish">High Polish</option>
                  <option value="rhodium">Rhodium</option>
                  <option value="dual_tone">Dual Tone</option>
                  <option value="sandblast">Sandblast</option>
                </select>
              </div>

              <div>
                <label className="label-luxury">Weight (grams)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="2.5"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="label-luxury">Length (mm)</label>
                <input
                  type="number"
                  value={formData.dimensionLength}
                  onChange={(e) => setFormData({ ...formData, dimensionLength: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="25"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="label-luxury">Width (mm)</label>
                <input
                  type="number"
                  value={formData.dimensionWidth}
                  onChange={(e) => setFormData({ ...formData, dimensionWidth: e.target.value })}
                  className="input-luxury w-full"
                  placeholder="15"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </Section>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-[#C89A7A]/20 sticky bottom-0 bg-gradient-to-br from-[#F7F6F3] to-[#F2E6D8]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-[#C89A7A]/30 text-[#5A3E2B] rounded-xl hover:bg-white/50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#C89A7A] to-[#E6C9A8] text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>💾 {isEdit ? 'Update Product' : 'Add Product'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Section Component
function Section({ 
  title, 
  expanded, 
  onToggle, 
  children 
}: { 
  title: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-white/40 border border-[#C89A7A]/20 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/60 transition-colors"
      >
        <h3 className="text-sm font-semibold text-[#5A3E2B]">{title}</h3>
        {expanded ? <FiChevronUp className="text-[#C89A7A]" /> : <FiChevronDown className="text-[#C89A7A]" />}
      </button>
      {expanded && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  )
}
