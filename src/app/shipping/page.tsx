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
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Domestic Shipping</h3>
            <p className="text-warmbrown/70 text-sm">3-7 business days across India</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiClock className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Processing Time</h3>
            <p className="text-warmbrown/70 text-sm">Orders processed within 1-2 business days</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiPackage className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Secure Packaging</h3>
            <p className="text-warmbrown/70 text-sm">Premium packaging with insurance</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiMapPin className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Order Tracking</h3>
            <p className="text-warmbrown/70 text-sm">Real-time tracking for all orders</p>
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
              <p><strong className="text-warmbrown">Express Shipping:</strong> ₹149 (Delivery within 2-3 business days in metro cities)</p>
              <p className="text-sm italic">* Shipping charges are calculated at checkout based on your location and order value.</p>
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
              <p><strong className="text-warmbrown">Metro Cities:</strong> 3-5 business days</p>
              <p><strong className="text-warmbrown">Other Cities:</strong> 5-7 business days</p>
              <p><strong className="text-warmbrown">Remote Areas:</strong> 7-10 business days</p>
              <p className="text-sm italic">* Delivery times are estimates and may vary due to courier delays or unforeseen circumstances.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Order Processing
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>All orders are processed within <strong className="text-warmbrown">1-2 business days</strong>. Orders placed on weekends or public holidays will be processed the next business day.</p>
              <p>You will receive an order confirmation email immediately after placing your order, followed by a shipping confirmation email with tracking details once your order has been dispatched.</p>
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
              <p>At Chulbuli Jewels, we understand the value of your purchase. All jewelry items are:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Packed in premium, secure packaging to prevent damage during transit</li>
                <li>Wrapped in elegant gift boxes suitable for gifting</li>
                <li>Insured against loss or damage during shipping</li>
                <li>Shipped via trusted courier partners with tamper-proof sealing</li>
              </ul>
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
              <p>Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order through:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your Chulbuli Jewels account dashboard</li>
                <li>The courier partner&apos;s website using your tracking number</li>
                <li>Our customer support team at hello@chulbulijewels.com</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Delivery Issues
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Incorrect Address:</strong> Please ensure your shipping address is accurate. We are not responsible for orders shipped to incorrect addresses provided by the customer.</p>
              <p><strong className="text-warmbrown">Failed Delivery Attempts:</strong> If delivery fails due to unavailability, the courier will make 2-3 attempts. Please ensure someone is available to receive the package.</p>
              <p><strong className="text-warmbrown">Damaged Package:</strong> If you receive a damaged package, please refuse delivery and contact us immediately at support@chulbulijewels.in or +91 9867732204.</p>
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <a
            href="/Policies.pdf"
            download
            className="text-center px-6 py-3 bg-rosegold/10 text-warmbrown rounded-full hover:bg-rosegold/20 transition-all duration-300 border border-rosegold/30"
          >
            Download PDF
          </a>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-rosegold text-pearl rounded-full hover:bg-rosegold/90 transition-all duration-500 hover:shadow-lg hover:shadow-rosegold/30"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
