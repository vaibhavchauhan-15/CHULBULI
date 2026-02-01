import Link from 'next/link'
import { FiRotateCcw, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi'

export const metadata = {
  title: 'Returns & Exchange Policy | Chulbuli Jewels',
  description: 'Easy returns and exchanges within 7 days. Learn about our hassle-free return policy.',
}

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-8 md:px-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair text-warmbrown mb-4 tracking-wide">
            Returns & Exchange
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-6" />
          <p className="text-warmbrown/80 text-lg font-light">
            Your satisfaction is our priority. Hassle-free returns within 7 days
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiClock className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">7-Day Return Window</h3>
            <p className="text-warmbrown/70 text-sm">Return or exchange within 7 days of delivery</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiRotateCcw className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Easy Process</h3>
            <p className="text-warmbrown/70 text-sm">Simple return process with free pickup</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiCheckCircle className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Full Refund</h3>
            <p className="text-warmbrown/70 text-sm">Get complete refund on eligible returns</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiAlertCircle className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Quality Check</h3>
            <p className="text-warmbrown/70 text-sm">Items inspected upon return</p>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-luxury border border-rosegold/20 space-y-8">
          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Return Eligibility
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We accept returns within <strong className="text-warmbrown">7 days of delivery</strong> if the following conditions are met:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The product is unused, unworn, and in its original condition</li>
                <li>All original tags, certificates, and packaging are intact</li>
                <li>The jewelry has not been altered, resized, or customized</li>
                <li>The product was not purchased during a clearance or final sale</li>
                <li>Return request is initiated within the 7-day window</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Non-Returnable Items
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>The following items cannot be returned or exchanged:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Earrings and other pierced jewelry (for hygiene reasons)</li>
                <li>Customized or personalized jewelry pieces</li>
                <li>Products purchased during clearance sales or marked "Final Sale"</li>
                <li>Items without original packaging or authenticity certificates</li>
                <li>Products damaged due to misuse or negligence</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              How to Initiate a Return
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-4 text-warmbrown/80">
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">Step 1: Contact Us</p>
                <p className="text-sm">Email us at chulbulijewels@gmail.com or call +91 9867732204 with your order number and reason for return.</p>
              </div>
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">Step 2: Get Approval</p>
                <p className="text-sm">Our team will review your request and provide return authorization within 24 hours.</p>
              </div>
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">Step 3: Pack the Item</p>
                <p className="text-sm">Securely pack the jewelry in its original packaging with all tags and certificates.</p>
              </div>
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">Step 4: Schedule Pickup</p>
                <p className="text-sm">We'll arrange a free pickup from your address or you can ship it to our return address.</p>
              </div>
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">Step 5: Quality Check & Refund</p>
                <p className="text-sm">Once we receive and inspect the item, refund will be processed within 5-7 business days.</p>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Exchange Policy
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We accept exchanges for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-warmbrown">Different Size:</strong> If the jewelry doesn't fit properly</li>
                <li><strong className="text-warmbrown">Different Design:</strong> Exchange for another item of equal or greater value</li>
                <li><strong className="text-warmbrown">Defective Product:</strong> Manufacturing defects covered under warranty</li>
              </ul>
              <p className="mt-4">Exchange requests follow the same 7-day window and eligibility criteria as returns. If exchanging for a higher-value item, you'll need to pay the difference. For lower-value items, the balance will be issued as store credit.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Refund Process
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Refund Timeline:</strong> Once we receive and approve your return, refunds are processed within 5-7 business days.</p>
              <p><strong className="text-warmbrown">Refund Method:</strong> Refunds are issued to the original payment method used during purchase.</p>
              <p><strong className="text-warmbrown">Credit/Debit Card:</strong> 5-7 business days after processing</p>
              <p><strong className="text-warmbrown">UPI/Net Banking:</strong> 3-5 business days after processing</p>
              <p><strong className="text-warmbrown">Cash on Delivery:</strong> Bank transfer within 7-10 business days</p>
              <p className="text-sm italic mt-4">* Actual credit time may vary depending on your bank's processing time.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Damaged or Defective Items
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>If you receive a damaged or defective item:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact us immediately within 48 hours of delivery</li>
                <li>Provide clear photos of the damaged product and packaging</li>
                <li>We'll arrange a free return pickup and send a replacement at no extra cost</li>
                <li>For manufacturing defects, lifetime warranty applies on gold and silver jewelry</li>
              </ul>
              <p className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded text-sm">
                <strong className="text-warmbrown">Important:</strong> Please inspect your order upon delivery. Report any damage or defects immediately to ensure a smooth resolution.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Cancellation Policy
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Before Dispatch:</strong> Orders can be cancelled free of charge before they are dispatched. Contact us immediately via email or phone.</p>
              <p><strong className="text-warmbrown">After Dispatch:</strong> Once shipped, cancellation is not possible. You can refuse delivery or initiate a return after receiving the product.</p>
              <p><strong className="text-warmbrown">Refund for Cancellation:</strong> Cancelled orders are refunded within 3-5 business days to the original payment method.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Contact Our Support Team
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>For return or exchange assistance, reach out to our dedicated customer support:</p>
              <p><strong className="text-warmbrown">Email:</strong> chulbulijewels@gmail.com</p>
              <p><strong className="text-warmbrown">Phone:</strong> +91 9867732204</p>
              <p><strong className="text-warmbrown">WhatsApp:</strong> <a href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Join our channel</a></p>
              <p><strong className="text-warmbrown">Business Hours:</strong> Monday - Saturday, 10:00 AM - 7:00 PM IST</p>
            </div>
          </section>
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
