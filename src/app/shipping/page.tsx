import Link from 'next/link'
import { FiPackage, FiTruck, FiMapPin, FiClock } from 'react-icons/fi'

export const metadata = {
  title: 'Shipping Policy | Chulbuli Jewels',
  description: 'Learn about our shipping policies, delivery times, and shipping charges for jewelry orders.',
}

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-8 md:px-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair text-warmbrown mb-4 tracking-wide">
            Shipping Policy
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-6" />
          <p className="text-warmbrown/80 text-lg font-light">
            Fast, secure, and reliable delivery of your precious jewelry
          </p>
        </div>

        {/* Shipping Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiTruck className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Courier Partners</h3>
            <p className="text-warmbrown/70 text-sm">Registered domestic courier companies & speed post</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiClock className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Shipping Time</h3>
            <p className="text-warmbrown/70 text-sm">Orders shipped within 5 days from order date</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiPackage className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Secure Packaging</h3>
            <p className="text-warmbrown/70 text-sm">Safe and secure packaging for your orders</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiMapPin className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Email Confirmation</h3>
            <p className="text-warmbrown/70 text-sm">Delivery confirmation sent to your registered email</p>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-luxury border border-rosegold/20 space-y-8">
          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Shipping Charges
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">FREE Shipping:</strong> On all orders above ₹500</p>
              <p><strong className="text-warmbrown">Standard Shipping:</strong> ₹59 for orders below ₹500</p>
              <p className="text-sm italic">* Shipping charges are calculated at checkout based on your location and order value.</p>
              <p className="text-sm font-semibold text-warmbrown mt-4"><strong>Important:</strong> Shipping costs are non-refundable.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Delivery Timeline
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Delivery times are subject to courier company and post office norms. While we strive for timely delivery, the platform owner shall not be liable for any delay in delivery by the courier company or postal authority.</p>
              <p className="text-sm italic mt-4">* Actual delivery times may vary based on your location and courier service.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Shipping & Order Processing
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Courier Partners:</strong> Orders are shipped through registered domestic courier companies and/or speed post only.</p>
              <p><strong className="text-warmbrown">Shipping Timeline:</strong> Orders are shipped within <strong className="text-warmbrown">7 days</strong> from the date of order and/or payment, or as per the delivery date agreed at the time of order confirmation.</p>
              <p><strong className="text-warmbrown">Delivery Address:</strong> All orders will be delivered to the address provided by you at the time of purchase. Please ensure the address is accurate.</p>
              <p><strong className="text-warmbrown">Confirmation:</strong> You will receive delivery confirmation and deliver product withing 7 working days.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Packaging & Safety
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>All jewelry items are securely packaged to prevent damage during transit and shipped via trusted courier partners.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Order Tracking
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Once your order is shipped, you will receive tracking information via email. You can track your order through the courier partner&apos;s website using your tracking number or contact our customer support team.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Important Notes
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Delivery Address:</strong> Please ensure your shipping address is accurate. We are not responsible for orders shipped to incorrect addresses provided by the customer.</p>
              <p><strong className="text-warmbrown">Courier Delays:</strong> The platform owner shall not be liable for any delay in delivery by the courier company or postal authority.</p>
              <p><strong className="text-warmbrown">Shipping Costs:</strong> If there are any shipping costs levied by the seller or the platform owner, the same are not refundable.</p>
              <p><strong className="text-warmbrown">Damaged Package:</strong> If you receive a damaged package, please contact us immediately at support@chulbulijewels.in or +91 9867732204.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Contact Us
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>For any shipping-related queries, please reach out to us:</p>
              <p><strong className="text-warmbrown">Email:</strong> support@chulbulijewels.in</p>
              <p><strong className="text-warmbrown">Phone:</strong> +91 9867732204</p>
              <p><strong className="text-warmbrown">WhatsApp:</strong> <a href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Join our channel</a></p>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
          <Link
            href="/terms"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20"
          >
            Privacy Policy
          </Link>
          <Link
            href="/returns"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20"
          >
            Return Policy
          </Link>
          <Link
            href="/refund"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20"
          >
            Refund Policy
          </Link>
          <a
            href="/Policies.pdf"
            download
            className="text-center px-6 py-3 bg-rosegold/10 text-warmbrown rounded-full hover:bg-rosegold/20 transition-all duration-300 border border-rosegold/30"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  )
}
