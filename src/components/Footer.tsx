'use client'

import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#5A3E2B]/60 backdrop-blur-sm mt-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rosegold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-softgold rounded-full blur-3xl" />
      </div>
      
      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rosegold/40 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* About - Enhanced */}
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-playfair font-light text-pearl mb-2 tracking-widest">
                CHULBULI
              </h3>
              <div className="h-px w-16 bg-gradient-to-r from-rosegold to-transparent mb-4" />
              <span className="text-softgold text-sm tracking-widest font-light">JEWELS</span>
            </div>
            <p className="text-pearl/90 text-sm leading-relaxed font-light">
              Elegant and timeless jewelry for every woman. Quality craftsmanship with sophisticated designs.
            </p>
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rosegold/10 border border-rosegold/30 rounded-full">
              <span className="text-softgold text-xs tracking-wider font-medium">PREMIUM QUALITY</span>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div>
            <h4 className="font-playfair text-pearl mb-6 tracking-widest text-base font-medium flex items-center gap-2">
              QUICK LINKS
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-sm font-light flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-sm font-light flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-sm font-light flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service - Enhanced */}
          <div>
            <h4 className="font-playfair text-pearl mb-6 tracking-widest text-base font-medium flex items-center gap-2">
              CUSTOMER SERVICE
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/shipping" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-sm font-light flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-sm font-light flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-pearl/90 hover:text-white hover:pl-2 transition-all duration-500 text-sm font-light flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-rosegold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Care Instructions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - Enhanced */}
          <div>
            <h4 className="font-playfair text-pearl mb-6 tracking-widest text-base font-medium flex items-center gap-2">
              CONTACT US
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-pearl/90 text-sm font-light group hover:text-white transition-colors duration-500">
                <div className="w-8 h-8 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-rosegold group-hover:border-rosegold transition-all duration-500">
                  <FiMail className="w-4 h-4 text-softgold group-hover:text-white transition-colors" />
                </div>
                <span className="mt-1">hello@chulbulijewels.com</span>
              </li>
              <li className="flex items-start gap-3 text-pearl/90 text-sm font-light group hover:text-white transition-colors duration-500">
                <div className="w-8 h-8 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center flex-shrink-0 group-hover:bg-rosegold group-hover:border-rosegold transition-all duration-500">
                  <FiPhone className="w-4 h-4 text-softgold group-hover:text-white transition-colors" />
                </div>
                <span className="mt-1">+91 98765 43210</span>
              </li>
            </ul>
            
            {/* Social Media  */}
            <div className="mt-8">
  <p className="text-pearl/80 text-xs mb-4 tracking-wider">FOLLOW US</p>

  <div className="flex gap-3">
    <a
      href="https://www.instagram.com/chulbuli_jewels/"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center hover:bg-rosegold hover:border-rosegold hover:scale-110 hover:shadow-lg hover:shadow-rosegold/30 transition-all duration-500 group"
    >
      <FaInstagram className="w-4 h-4 text-softgold group-hover:text-pearl group-hover:scale-110 transition-all" />
    </a>

    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center hover:bg-rosegold hover:border-rosegold hover:scale-110 hover:shadow-lg hover:shadow-rosegold/30 transition-all duration-500 group"
    >
      <FaFacebook className="w-4 h-4 text-softgold group-hover:text-pearl group-hover:scale-110 transition-all" />
    </a>

    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-rosegold/10 border border-rosegold/30 flex items-center justify-center hover:bg-rosegold hover:border-rosegold hover:scale-110 hover:shadow-lg hover:shadow-rosegold/30 transition-all duration-500 group"
    >
      <FaWhatsapp className="w-4 h-4 text-softgold group-hover:text-pearl group-hover:scale-110 transition-all" />
    </a>
  </div>
</div>

          </div>
        </div>

        {/* Bottom section - Premium */}
        <div className="mt-16 pt-8 border-t border-pearl/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-pearl/80 text-sm font-light tracking-widest">
              © {currentYear} CHULBULI JEWELS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6 text-xs text-pearl/70">
              <Link href="/privacy" className="hover:text-white hover:underline transition-all duration-500">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white hover:underline transition-all duration-500">
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
