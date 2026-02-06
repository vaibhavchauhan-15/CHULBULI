'use client'

import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#5A3E2B]/60 backdrop-blur-sm mt-12 md:mt-24 lg:mt-32 overflow-hidden safe-area-bottom">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rosegold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-softgold rounded-full blur-3xl" />
      </div>
      
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rosegold/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-6 md:py-10 lg:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 lg:gap-16">
          {/* About - Enhanced */}
          <div className="space-y-4 md:space-y-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl md:text-3xl font-playfair font-light text-pearl mb-2 tracking-widest">
                CHULBULI
              </h3>
              <div className="h-px w-16 bg-gradient-to-r from-rosegold to-transparent mb-3 md:mb-4 mx-auto md:mx-0" />
              <span className="text-softgold text-sm tracking-widest font-light">JEWELS</span>
            </div>
            <p className="text-pearl/90 text-xs md:text-sm leading-relaxed font-light">
              Elegant and timeless jewelry for every woman. Quality craftsmanship with sophisticated designs.
            </p>
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-rosegold/10 border border-rosegold/30 rounded-full">
              <span className="text-softgold text-[10px] md:text-xs tracking-wider font-medium">PREMIUM QUALITY</span>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="text-center md:text-left">
            <h4 className="font-playfair text-pearl mb-4 md:mb-6 tracking-widest text-sm md:text-base font-medium flex items-center gap-2 justify-center md:justify-start">
              <span className="md:hidden">QUICK LINKS</span>
              <span className="hidden md:inline">QUICK LINKS</span>
              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link href="/products" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-xs md:text-sm font-light flex items-center gap-2 group justify-center md:justify-start">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-xs md:text-sm font-light flex items-center gap-2 group justify-center md:justify-start">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-xs md:text-sm font-light flex items-center gap-2 group justify-center md:justify-start">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service - Enhanced */}
          <div className="text-center md:text-left">
            <h4 className="font-playfair text-pearl mb-4 md:mb-6 tracking-widest text-sm md:text-base font-medium flex items-center gap-2 justify-center md:justify-start">
              <span className="md:hidden">SERVICE</span>
              <span className="hidden md:inline">CUSTOMER SERVICE</span>
              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li>
                <Link href="/shipping" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-xs md:text-sm font-light flex items-center gap-2 group justify-center md:justify-start">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-xs md:text-sm font-light flex items-center gap-2 group justify-center md:justify-start">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-xs md:text-sm font-light flex items-center gap-2 group justify-center md:justify-start">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-xs md:text-sm font-light flex items-center gap-2 group justify-center md:justify-start">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Care Instructions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - Enhanced */}
          <div className="text-center md:text-left">
            <h4 className="font-playfair text-pearl mb-4 md:mb-6 tracking-widest text-sm md:text-base font-medium flex items-center gap-2 justify-center md:justify-start">
              CONTACT US
              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-2 md:gap-3 text-pearl/90 text-xs md:text-sm font-light group hover:text-white transition-colors duration-500 justify-center md:justify-start">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-rosegold group-hover:border-rosegold transition-all duration-500">
                  <FiMail className="w-3.5 h-3.5 md:w-4 md:h-4 text-softgold group-hover:text-white transition-colors" />
                </div>
                <span className="mt-0.5 md:mt-1 break-all md:break-normal">support@chulbulijewels.in</span>
              </li>
              <li className="flex items-start gap-2 md:gap-3 text-pearl/90 text-xs md:text-sm font-light group hover:text-white transition-colors duration-500 justify-center md:justify-start">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-rosegold group-hover:border-rosegold transition-all duration-500">
                  <FiPhone className="w-3.5 h-3.5 md:w-4 md:h-4 text-softgold group-hover:text-white transition-colors" />
                </div>
                <span className="mt-0.5 md:mt-1">+91 9867732204</span>
              </li>
            </ul>
            
            {/* Social Media  */}
            <div className="mt-4 md:mt-6 lg:mt-8">
              <p className="text-pearl/80 text-[10px] md:text-xs mb-2 md:mb-3 lg:mb-4 tracking-wider">FOLLOW US</p>

              <div className="flex gap-2 md:gap-2.5 lg:gap-3 justify-center md:justify-start">
                <a
                  href="https://www.instagram.com/chulbuli_jewels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center hover:bg-rosegold hover:border-rosegold hover:scale-110 hover:shadow-lg hover:shadow-rosegold/30 transition-all duration-300 group active:scale-95 touch-target"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram className="w-4 h-4 md:w-5 md:h-5 text-softgold group-hover:text-pearl group-hover:scale-110 transition-all" />
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61587171489601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center hover:bg-rosegold hover:border-rosegold hover:scale-110 hover:shadow-lg hover:shadow-rosegold/30 transition-all duration-300 group active:scale-95 touch-target"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebook className="w-4 h-4 md:w-5 md:h-5 text-softgold group-hover:text-pearl group-hover:scale-110 transition-all" />
                </a>

                <a
                  href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center hover:bg-rosegold hover:border-rosegold hover:scale-110 hover:shadow-lg hover:shadow-rosegold/30 transition-all duration-300 group active:scale-95 touch-target"
                  aria-label="Join our WhatsApp channel"
                >
                  <FaWhatsapp className="w-4 h-4 md:w-5 md:h-5 text-softgold group-hover:text-pearl group-hover:scale-110 transition-all" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom section - Premium */}
        <div className="mt-6 md:mt-12 lg:mt-16 pt-4 md:pt-6 lg:pt-8 border-t border-pearl/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3 lg:gap-4">
            <p className="text-pearl/80 text-[10px] md:text-sm font-light tracking-widest text-center md:text-left">
              © {currentYear} CHULBULI JEWELS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-3 md:gap-4 lg:gap-6 text-[10px] md:text-xs text-pearl/70">
              <Link href="/privacy" className="hover:text-white hover:underline transition-all duration-300 touch-target">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white hover:underline transition-all duration-300 touch-target">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom decorative accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rosegold to-transparent opacity-50" />
    </footer>
  )
}
