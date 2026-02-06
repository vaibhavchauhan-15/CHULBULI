import { Metadata } from 'next'
import Link from 'next/link'
import { FiPhone, FiMail, FiClock, FiMessageCircle, FiPackage, FiRefreshCw, FiShield, FiTruck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Help & Support - Chulbuli Jewels',
  description: 'Get help with your orders, returns, and more. Contact our support team via WhatsApp, phone, or email.',
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-pearl pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-warmbrown mb-4">
            Help & Support
          </h1>
          <p className="text-lg text-warmbrown/70">
            We&apos;re here to help! Get answers to your questions or reach out to our support team.
          </p>
        </div>

        {/* Contact Support Section - MAIN */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-rosegold/10 to-softgold/10 border-2 border-rosegold/30 rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-warmbrown mb-6 flex items-center">
              <FiMessageCircle className="mr-3 text-rosegold" />
              Contact Support
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* WhatsApp Support - Recommended */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-softgold/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <FaWhatsapp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-warmbrown mb-2">
                      WhatsApp Support
                      <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">Recommended</span>
                    </h3>
                    <a 
                      href="https://wa.me/919867732204" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-rosegold hover:text-rosegold/80 font-medium text-lg flex items-center"
                    >
                      +91 98677 32204
                    </a>
                    <p className="text-sm text-warmbrown/60 mt-2">
                      💬 Message us and we&apos;ll reply within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Support */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-softgold/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-rosegold/20 rounded-xl flex items-center justify-center">
                      <FiPhone className="w-6 h-6 text-rosegold" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-warmbrown mb-2">Phone Number</h3>
                    <a 
                      href="tel:+919867732204"
                      className="text-rosegold hover:text-rosegold/80 font-medium text-lg"
                    >
                      +91 98677 32204
                    </a>
                    <p className="text-sm text-warmbrown/60 mt-2">
                      📞 Call us during support hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Support */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-softgold/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-softgold/30 rounded-xl flex items-center justify-center">
                      <FiMail className="w-6 h-6 text-warmbrown" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-warmbrown mb-2">Support Email</h3>
                    <a 
                      href="mailto:support@chulbulijewels.in"
                      className="text-rosegold hover:text-rosegold/80 font-medium"
                    >
                      support@chulbulijewels.in
                    </a>
                    <p className="text-sm text-warmbrown/60 mt-2">
                      📧 We&apos;ll respond within 48 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Hours */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-softgold/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-champagne/50 rounded-xl flex items-center justify-center">
                      <FiClock className="w-6 h-6 text-warmbrown" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-warmbrown mb-2">Support Hours</h3>
                    <p className="text-warmbrown/80">
                      <strong>Mon - Sat:</strong> 10:00 AM - 7:00 PM<br />
                      <strong>Sunday:</strong> Closed
                    </p>
                    <p className="text-sm text-warmbrown/60 mt-2">
                      ⏰ Indian Standard Time (IST)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 rounded-lg p-4 border-l-4 border-rosegold">
              <p className="text-warmbrown/80 text-sm">
                <strong>💡 Quick Tip:</strong> Need immediate assistance? WhatsApp is the fastest way to reach us!
              </p>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-softgold/20">
            <h2 className="text-3xl font-bold text-warmbrown mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {/* FAQ 1 */}
              <div className="border-b border-softgold/20 pb-6">
                <h3 className="text-lg font-semibold text-warmbrown mb-3 flex items-center">
                  <FiPackage className="mr-2 text-rosegold" />
                  How do I track my order?
                </h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  Once your order is shipped, you&apos;ll receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the &quot;My Orders&quot; section.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="border-b border-softgold/20 pb-6">
                <h3 className="text-lg font-semibold text-warmbrown mb-3 flex items-center">
                  <FiRefreshCw className="mr-2 text-rosegold" />
                  Can I cancel my order?
                </h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  Yes! You can cancel your order within 24 hours of placing it. Go to &quot;My Orders&quot; in your account and click &quot;Cancel Order&quot;. If it&apos;s already shipped, you&apos;ll need to follow our return process once you receive it.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="border-b border-softgold/20 pb-6">
                <h3 className="text-lg font-semibold text-warmbrown mb-3 flex items-center">
                  <FiShield className="mr-2 text-rosegold" />
                  What is your return policy?
                </h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  We offer a 7-day return policy from the date of delivery. Items must be unused, in original packaging with all tags intact. Customized or engraved items cannot be returned. Visit our{' '}
                  <Link href="/returns" className="text-rosegold hover:underline font-medium">
                    Return & Refund Policy
                  </Link>{' '}
                  for complete details.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="border-b border-softgold/20 pb-6">
                <h3 className="text-lg font-semibold text-warmbrown mb-3">
                  💰 How long does refund take?
                </h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  Once we receive and inspect your returned item, refunds are processed within 5-7 business days. The amount will be credited to your original payment method. Bank processing may take an additional 3-5 days.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className="border-b border-softgold/20 pb-6">
                <h3 className="text-lg font-semibold text-warmbrown mb-3">
                  📦 What if I receive a damaged item?
                </h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  We&apos;re sorry to hear that! Please don&apos;t worry - contact us immediately via WhatsApp with photos of the damaged item and packaging. We&apos;ll arrange a replacement or full refund right away. Quality is our priority!
                </p>
              </div>

              {/* FAQ 6 */}
              <div className="pb-2">
                <h3 className="text-lg font-semibold text-warmbrown mb-3 flex items-center">
                  <FiTruck className="mr-2 text-rosegold" />
                  Do you offer COD (Cash on Delivery)?
                </h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  Yes! We offer COD for orders across India. A small COD fee may apply. COD is available for orders up to ₹50,000. Higher value orders require online payment for security reasons.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Info Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-champagne/50 to-softgold/20 rounded-2xl p-8 shadow-lg border border-softgold/30">
            <h2 className="text-3xl font-bold text-warmbrown mb-8 flex items-center">
              <FiTruck className="mr-3 text-rosegold" />
              Shipping Information
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Delivery Time */}
              <div className="bg-white/80 rounded-xl p-6 border border-softgold/20">
                <h3 className="text-lg font-semibold text-warmbrown mb-3">⏱️ Delivery Time</h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  <strong>Metro Cities:</strong> 3-5 business days<br />
                  <strong>Other Cities:</strong> 5-7 business days<br />
                  <strong>Remote Areas:</strong> 7-10 business days
                </p>
              </div>

              {/* Shipping Charges */}
              <div className="bg-white/80 rounded-xl p-6 border border-softgold/20">
                <h3 className="text-lg font-semibold text-warmbrown mb-3">💸 Shipping Charges</h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  <strong className="text-green-600">FREE Shipping:</strong> On all orders above ₹500<br />
                  <strong>Standard Shipping:</strong> ₹59 for orders below ₹500<br />
                  <strong>Express Shipping:</strong> ₹149 (Delivery within 2-3 business days in metro cities)<br />
                  <span className="text-sm text-warmbrown/60 mt-2 block">* Shipping charges are calculated at checkout based on your location and order value.</span>
                </p>
              </div>

              {/* Serviceable Locations */}
              <div className="bg-white/80 rounded-xl p-6 border border-softgold/20">
                <h3 className="text-lg font-semibold text-warmbrown mb-3">📍 Serviceable Locations</h3>
                <p className="text-warmbrown/70 leading-relaxed">
                  We ship across India to all pincodes serviced by our courier partners. International shipping coming soon!
                </p>
              </div>
            </div>

            <div className="mt-6 bg-white/60 rounded-lg p-4 border-l-4 border-rosegold">
              <p className="text-warmbrown/80 text-sm">
                <strong>📦 Track Your Order:</strong> All orders are shipped with tracking. You&apos;ll receive updates via SMS and email.
              </p>
            </div>
          </div>
        </section>

        {/* Policies Section */}
        <section>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-softgold/20">
            <h2 className="text-2xl font-bold text-warmbrown mb-6">📋 Our Policies</h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/returns"
                className="flex items-center justify-between p-4 bg-softgold/10 hover:bg-softgold/20 rounded-xl transition-all duration-300 group"
              >
                <span className="font-medium text-warmbrown group-hover:text-rosegold">
                  Return & Refund Policy
                </span>
                <span className="text-rosegold">→</span>
              </Link>

              <Link
                href="/shipping"
                className="flex items-center justify-between p-4 bg-softgold/10 hover:bg-softgold/20 rounded-xl transition-all duration-300 group"
              >
                <span className="font-medium text-warmbrown group-hover:text-rosegold">
                  Shipping Policy
                </span>
                <span className="text-rosegold">→</span>
              </Link>

              <Link
                href="/terms"
                className="flex items-center justify-between p-4 bg-softgold/10 hover:bg-softgold/20 rounded-xl transition-all duration-300 group"
              >
                <span className="font-medium text-warmbrown group-hover:text-rosegold">
                  Terms & Conditions
                </span>
                <span className="text-rosegold">→</span>
              </Link>

              <Link
                href="/privacy"
                className="flex items-center justify-between p-4 bg-softgold/10 hover:bg-softgold/20 rounded-xl transition-all duration-300 group"
              >
                <span className="font-medium text-warmbrown group-hover:text-rosegold">
                  Privacy Policy
                </span>
                <span className="text-rosegold">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-rosegold/10 to-softgold/10 rounded-2xl p-8 border border-rosegold/20">
          <h3 className="text-2xl font-bold text-warmbrown mb-3">
            Still need help?
          </h3>
          <p className="text-warmbrown/70 mb-6">
            Our support team is ready to assist you!
          </p>
          <a
            href="https://wa.me/919867732204"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FaWhatsapp className="mr-2 w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
