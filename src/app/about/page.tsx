import Link from 'next/link'
import Image from 'next/image'
import { FiHeart, FiAward, FiShield, FiUsers } from 'react-icons/fi'
import { GiJewelCrown, GiDiamondRing, GiSparkles } from 'react-icons/gi'

export const metadata = {
  title: 'About Us | Chulbuli Jewels',
  description: 'Discover the story behind Chulbuli Jewels - your trusted destination for elegant and timeless jewelry.',
}

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne pt-20 md:pt-24 pb-12 md:pb-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair text-warmbrown mb-3 md:mb-4 tracking-wide">
            About Chulbuli Jewels
          </h1>
          <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-4 md:mb-6" />
          <p className="text-warmbrown/80 text-sm md:text-lg font-light max-w-2xl mx-auto px-4">
            Crafting timeless elegance and celebrating your precious moments with exquisite jewelry
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 md:p-8 lg:p-12 shadow-luxury border border-rosegold/20 mb-8 md:mb-12 lg:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-12 items-center">
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl text-warmbrown mb-2 md:mb-4">
                Our Story
              </h2>
              <p className="text-warmbrown/80 leading-relaxed text-sm md:text-base">
                Welcome to <strong className="text-warmbrown">Chulbuli Jewels</strong>, where every piece tells a story of elegance, craftsmanship, and timeless beauty. Founded with a passion for creating exquisite jewelry that celebrates life&apos;s precious moments, we have become a trusted name in the world of fine jewelry.
              </p>
              <p className="text-warmbrown/80 leading-relaxed text-sm md:text-base">
                Our journey began with a simple vision: to make beautiful, high-quality jewelry accessible to every woman who desires to add a touch of sparkle to her life. Today, we continue that mission by offering a carefully curated collection that blends traditional artistry with contemporary design.
              </p>
              <p className="text-warmbrown/80 leading-relaxed text-sm md:text-base">
                At Chulbuli Jewels, we believe that jewelry is more than just an accessory—it&apos;s a reflection of your personality, a celebration of your milestones, and a treasure to be cherished for generations.
              </p>
            </div>
            <div className="relative order-first md:order-last">
              <div className="aspect-square rounded-lg overflow-hidden shadow-luxury border-4 border-rosegold/20">
                <div className="w-full h-full bg-gradient-to-br from-rosegold/20 via-softgold/20 to-pearl flex items-center justify-center">
                  <GiJewelCrown className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-rosegold" />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-20 h-20 md:w-24 md:h-24 bg-rosegold/10 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-24 h-24 md:w-32 md:h-32 bg-softgold/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-8 md:mb-12 lg:mb-16">
          <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl text-warmbrown text-center mb-6 md:mb-10 lg:mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 md:p-6 lg:p-8 shadow-luxury border border-rosegold/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300 active:shadow-luxury-lg">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <FiAward className="w-7 h-7 md:w-8 md:h-8 text-rosegold" />
              </div>
              <h3 className="font-playfair text-lg md:text-xl text-warmbrown mb-2 md:mb-3">Quality</h3>
              <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                We never compromise on quality. Every piece is crafted with precision and care using premium materials.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 md:p-6 lg:p-8 shadow-luxury border border-rosegold/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300 active:shadow-luxury-lg">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <FiShield className="w-7 h-7 md:w-8 md:h-8 text-rosegold" />
              </div>
              <h3 className="font-playfair text-lg md:text-xl text-warmbrown mb-2 md:mb-3">Trust</h3>
              <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                Transparency and authenticity are at the heart of everything we do. Your trust is our treasure.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 md:p-6 lg:p-8 shadow-luxury border border-rosegold/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300 active:shadow-luxury-lg">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <GiSparkles className="w-7 h-7 md:w-8 md:h-8 text-rosegold" />
              </div>
              <h3 className="font-playfair text-lg md:text-xl text-warmbrown mb-2 md:mb-3">Design</h3>
              <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                Timeless designs that blend traditional elegance with modern aesthetics for every occasion.
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 md:p-6 lg:p-8 shadow-luxury border border-rosegold/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300 active:shadow-luxury-lg">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <FiHeart className="w-7 h-7 md:w-8 md:h-8 text-rosegold" />
              </div>
              <h3 className="font-playfair text-lg md:text-xl text-warmbrown mb-2 md:mb-3">Customer Love</h3>
              <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                Your satisfaction is our priority. We go above and beyond to make your experience exceptional.
              </p>
            </div>
          </div>
        </div>

        {/* What Makes Us Special */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 md:p-8 lg:p-12 shadow-luxury border border-rosegold/20 mb-8 md:mb-12 lg:mb-16">
          <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl text-warmbrown text-center mb-8 md:mb-10 lg:mb-12">
            What Makes Us Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
            <div className="space-y-4 md:space-y-5 lg:space-y-6">
              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0">
                  <GiDiamondRing className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1.5 md:mb-2 text-base md:text-lg">Handpicked Collection</h3>
                  <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                    Every piece in our collection is carefully selected and curated to ensure it meets our high standards of beauty and craftsmanship.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0">
                  <FiShield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1.5 md:mb-2 text-base md:text-lg">Certified Authenticity</h3>
                  <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                    All our precious metal jewelry comes with proper hallmark certification, ensuring you receive genuine, authentic products.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0">
                  <FiAward className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1.5 md:mb-2 text-base md:text-lg">Quality Craftsmanship</h3>
                  <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                    Our skilled artisans bring years of expertise to create jewelry that&apos;s not just beautiful but built to last a lifetime.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:space-y-5 lg:space-y-6">
              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0">
                  <FiUsers className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1.5 md:mb-2 text-base md:text-lg">Customer-Centric Approach</h3>
                  <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                    From personalized recommendations to hassle-free returns, we put you at the center of everything we do.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0">
                  <GiSparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1.5 md:mb-2 text-base md:text-lg">Affordable Luxury</h3>
                  <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                    We believe beautiful jewelry should be accessible. Enjoy premium quality at prices that won&apos;t break the bank.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0">
                  <FiHeart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1.5 md:mb-2 text-base md:text-lg">Sustainable Practices</h3>
                  <p className="text-warmbrown/70 text-xs md:text-sm leading-relaxed">
                    We&apos;re committed to ethical sourcing and sustainable practices in all our operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Collection */}
        <div className="bg-gradient-to-br from-rosegold/10 to-softgold/10 rounded-lg p-5 md:p-8 lg:p-12 border border-rosegold/30 mb-8 md:mb-12 lg:mb-16">
          <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl text-warmbrown text-center mb-5 md:mb-6 lg:mb-8">
            Our Collection
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 text-center">
            <div className="bg-white/50 rounded-lg p-4 md:p-5 lg:p-6 hover:bg-white/70 transition-all duration-300 active:scale-95 touch-target">
              <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">💍</div>
              <p className="font-playfair text-warmbrown text-sm md:text-base">Rings</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4 md:p-5 lg:p-6 hover:bg-white/70 transition-all duration-300 active:scale-95 touch-target">
              <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">💎</div>
              <p className="font-playfair text-warmbrown text-sm md:text-base">Earrings</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4 md:p-5 lg:p-6 hover:bg-white/70 transition-all duration-300 active:scale-95 touch-target">
              <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">📿</div>
              <p className="font-playfair text-warmbrown text-sm md:text-base">Necklaces</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4 md:p-5 lg:p-6 hover:bg-white/70 transition-all duration-300 active:scale-95 touch-target">
              <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">⭕</div>
              <p className="font-playfair text-warmbrown text-sm md:text-base">Bangles</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4 md:p-5 lg:p-6 hover:bg-white/70 transition-all duration-300 active:scale-95 touch-target col-span-2 md:col-span-1">
              <div className="text-2xl md:text-3xl mb-1.5 md:mb-2">✨</div>
              <p className="font-playfair text-warmbrown text-sm md:text-base">Sets</p>
            </div>
          </div>
        </div>

        {/* Our Promise */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 md:p-8 lg:p-12 shadow-luxury border border-rosegold/20 mb-8 md:mb-12 lg:mb-16">
          <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl text-warmbrown text-center mb-5 md:mb-6 lg:mb-8">
            Our Promise to You
          </h2>
          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4 text-warmbrown/80">
            <p className="leading-relaxed text-xs md:text-sm lg:text-base">
              <strong className="text-warmbrown">✓ Authentic Products:</strong> Every piece is genuine and comes with proper certification.
            </p>
            <p className="leading-relaxed text-xs md:text-sm lg:text-base">
              <strong className="text-warmbrown">✓ Quality Assurance:</strong> Rigorous quality checks ensure you receive only the best.
            </p>
            <p className="leading-relaxed text-xs md:text-sm lg:text-base">
              <strong className="text-warmbrown">✓ Secure Shopping:</strong> Your transactions are protected with industry-leading security.
            </p>
            <p className="leading-relaxed text-xs md:text-sm lg:text-base">
              <strong className="text-warmbrown">✓ Easy Returns:</strong> 7-day hassle-free return policy for your peace of mind.
            </p>
            <p className="leading-relaxed text-xs md:text-sm lg:text-base">
              <strong className="text-warmbrown">✓ Lifetime Support:</strong> Our customer service team is always here to help.
            </p>
            <p className="leading-relaxed text-xs md:text-sm lg:text-base">
              <strong className="text-warmbrown">✓ Fast Delivery:</strong> Quick and secure shipping to your doorstep.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-rosegold/20 via-softgold/20 to-rosegold/20 rounded-lg p-5 md:p-8 lg:p-12 border border-rosegold/30 mb-8 md:mb-12 lg:mb-16 text-center">
          <h2 className="font-playfair text-xl md:text-2xl lg:text-3xl text-warmbrown mb-4 md:mb-5 lg:mb-6">
            Why Choose Chulbuli Jewels?
          </h2>
          <p className="text-warmbrown/80 text-sm md:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto mb-6 md:mb-8 px-2">
            We&apos;re not just another jewelry store—we&apos;re your partners in celebrating life&apos;s beautiful moments. Whether you&apos;re looking for everyday elegance or something special for a milestone occasion, we have the perfect piece waiting for you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
            <div className="bg-white/50 rounded-lg p-4 md:p-5 lg:p-6 active:scale-95 transition-transform touch-target">
              <div className="text-3xl md:text-4xl font-bold text-rosegold mb-1.5 md:mb-2">10K+</div>
              <p className="text-warmbrown font-semibold text-xs md:text-sm lg:text-base">Happy Customers</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4 md:p-5 lg:p-6 active:scale-95 transition-transform touch-target">
              <div className="text-3xl md:text-4xl font-bold text-rosegold mb-1.5 md:mb-2">500+</div>
              <p className="text-warmbrown font-semibold text-xs md:text-sm lg:text-base">Unique Designs</p>
            </div>
            <div className="bg-white/50 rounded-lg p-4 md:p-5 lg:p-6 active:scale-95 transition-transform touch-target">
              <div className="text-3xl md:text-4xl font-bold text-rosegold mb-1.5 md:mb-2">100%</div>
              <p className="text-warmbrown font-semibold text-xs md:text-sm lg:text-base">Authentic Jewelry</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-lg p-5 md:p-6 lg:p-8 shadow-luxury border border-rosegold/20">
          <h2 className="font-playfair text-xl md:text-2xl text-warmbrown mb-3 md:mb-4">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-warmbrown/80 mb-6 md:mb-8 text-sm md:text-base px-4">
            Explore our exquisite collection and discover jewelry that speaks to your soul.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              href="/products"
              className="btn-mobile-full px-6 md:px-8 py-3 md:py-3.5 bg-rosegold text-pearl rounded-full hover:bg-rosegold/90 transition-all duration-300 hover:shadow-lg hover:shadow-rosegold/30 font-medium active:scale-95"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="btn-mobile-full px-6 md:px-8 py-3 md:py-3.5 bg-white text-rosegold border-2 border-rosegold rounded-full hover:bg-rosegold hover:text-white transition-all duration-300 font-medium active:scale-95"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
