'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    }, 1500)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne pt-20 md:pt-24 pb-12 md:pb-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair text-warmbrown mb-3 md:mb-4 tracking-wide">
            Contact Us
          </h1>
          <div className="h-px w-24 md:w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-4 md:mb-6" />
          <p className="text-warmbrown/80 text-sm md:text-lg font-light px-4">
            We&apos;d love to hear from you. Get in touch with us today!
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 lg:mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 md:p-5 lg:p-6 shadow-luxury border border-rosegold/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300 active:shadow-luxury-lg touch-target">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <FiPhone className="w-6 h-6 md:w-7 md:h-7 text-rosegold" />
            </div>
            <h3 className="font-playfair text-base md:text-lg text-warmbrown mb-2">Phone</h3>
            <a href="tel:+919867732204" className="text-warmbrown/70 hover:text-rosegold transition-colors text-sm touch-target">
              +91 9867732204
            </a>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 md:p-5 lg:p-6 shadow-luxury border border-rosegold/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300 active:shadow-luxury-lg touch-target">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <FiMail className="w-6 h-6 md:w-7 md:h-7 text-rosegold" />
            </div>
            <h3 className="font-playfair text-base md:text-lg text-warmbrown mb-2">Email</h3>
            <a href="mailto:support@chulbulijewels.in" className="text-warmbrown/70 hover:text-rosegold transition-colors text-xs md:text-sm break-all touch-target">
              support@chulbulijewels.in
            </a>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 md:p-5 lg:p-6 shadow-luxury border border-rosegold/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300 active:shadow-luxury-lg touch-target">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <FaWhatsapp className="w-6 h-6 md:w-7 md:h-7 text-rosegold" />
            </div>
            <h3 className="font-playfair text-base md:text-lg text-warmbrown mb-2">WhatsApp</h3>
            <a 
              href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-warmbrown/70 hover:text-rosegold transition-colors text-sm touch-target"
            >
              Join Channel
            </a>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 md:p-5 lg:p-6 shadow-luxury border border-rosegold/20 text-center hover:transform hover:-translate-y-2 transition-all duration-300 active:shadow-luxury-lg">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-rosegold/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
              <FiClock className="w-6 h-6 md:w-7 md:h-7 text-rosegold" />
            </div>
            <h3 className="font-playfair text-base md:text-lg text-warmbrown mb-2">Hours</h3>
            <p className="text-warmbrown/70 text-sm">
              Mon-Sat: 10am-7pm
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12 lg:mb-16">
          {/* Contact Form */}
          <div className="md:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-5 md:p-8 lg:p-10 shadow-luxury border border-rosegold/20">
              <h2 className="font-playfair text-xl md:text-2xl text-warmbrown mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                <FiMessageCircle className="w-5 h-5 md:w-6 md:h-6 text-rosegold" />
                Send us a Message
              </h2>
              
              {submitStatus === 'success' && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-xs md:text-sm">
                    ✓ Thank you for your message! We&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-warmbrown font-medium mb-2 text-xs md:text-sm">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-luxury w-full"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-warmbrown font-medium mb-2 text-xs md:text-sm">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-luxury w-full"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-warmbrown font-medium mb-2 text-xs md:text-sm">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-luxury w-full"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-warmbrown font-medium mb-2 text-xs md:text-sm">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="input-luxury w-full"
                  >
                    <option value="">Select a subject</option>
                    <option value="product">Product Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="customization">Custom Order</option>
                    <option value="return">Returns & Exchange</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-warmbrown font-medium mb-2 text-xs md:text-sm">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-luxury w-full min-h-[120px] md:min-h-[140px] resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-mobile-full px-6 md:px-8 py-3.5 md:py-4 bg-rosegold text-white rounded-lg hover:bg-rosegold/90 transition-all duration-300 hover:shadow-lg hover:shadow-rosegold/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4 md:w-5 md:h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="md:col-span-2 space-y-6">
            {/* Business Hours */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
              <div className="flex items-center gap-3 mb-4">
                <FiClock className="w-6 h-6 text-rosegold" />
                <h3 className="font-playfair text-xl text-warmbrown">Business Hours</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-warmbrown font-medium">Monday - Friday</span>
                  <span className="text-warmbrown/70">10:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warmbrown font-medium">Saturday</span>
                  <span className="text-warmbrown/70">10:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warmbrown font-medium">Sunday</span>
                  <span className="text-warmbrown/70">Closed</span>
                </div>
                <p className="text-xs text-warmbrown/60 mt-4 italic">
                  * Hours may vary during holidays
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
              <h3 className="font-playfair text-xl text-warmbrown mb-4">Follow Us</h3>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/chulbuli_jewels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-rosegold/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-rosegold/10 flex items-center justify-center group-hover:bg-rosegold transition-all">
                    <FaInstagram className="w-5 h-5 text-rosegold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-warmbrown font-medium text-sm">Instagram</p>
                    <p className="text-warmbrown/60 text-xs">@chulbuli_jewels</p>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61587171489601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-rosegold/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-rosegold/10 flex items-center justify-center group-hover:bg-rosegold transition-all">
                    <FaFacebook className="w-5 h-5 text-rosegold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-warmbrown font-medium text-sm">Facebook</p>
                    <p className="text-warmbrown/60 text-xs">Chulbuli Jewels</p>
                  </div>
                </a>

                <a
                  href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-rosegold/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-rosegold/10 flex items-center justify-center group-hover:bg-rosegold transition-all">
                    <FaWhatsapp className="w-5 h-5 text-rosegold group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-warmbrown font-medium text-sm">WhatsApp</p>
                    <p className="text-warmbrown/60 text-xs">Join our channel</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-rosegold/10 to-softgold/10 rounded-lg p-6 border border-rosegold/30">
              <h3 className="font-playfair text-lg text-warmbrown mb-4">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <Link href="/shipping" className="block text-warmbrown/70 hover:text-rosegold transition-colors">
                  → Shipping Information
                </Link>
                <Link href="/returns" className="block text-warmbrown/70 hover:text-rosegold transition-colors">
                  → Returns & Exchange
                </Link>
                <Link href="/care" className="block text-warmbrown/70 hover:text-rosegold transition-colors">
                  → Jewelry Care Guide
                </Link>
                <Link href="/terms" className="block text-warmbrown/70 hover:text-rosegold transition-colors">
                  → Terms & Conditions
                </Link>
                <Link href="/privacy" className="block text-warmbrown/70 hover:text-rosegold transition-colors">
                  → Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 md:p-10 shadow-luxury border border-rosegold/20">
          <h2 className="font-playfair text-2xl text-warmbrown text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-warmbrown mb-2">How long does shipping take?</h3>
              <p className="text-warmbrown/70 text-sm">
                We deliver within 3-7 business days across India. Metro cities receive orders in 3-5 days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-warmbrown mb-2">Do you offer customization?</h3>
              <p className="text-warmbrown/70 text-sm">
                Yes! Contact us to discuss custom designs and personalized jewelry pieces.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-warmbrown mb-2">What is your return policy?</h3>
              <p className="text-warmbrown/70 text-sm">
                We offer a 7-day hassle-free return policy on eligible items. See our returns page for details.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-warmbrown mb-2">Are your products certified?</h3>
              <p className="text-warmbrown/70 text-sm">
                Yes, all precious metal jewelry comes with proper hallmark certification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
