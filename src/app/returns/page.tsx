import Link from 'next/link'
import { FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi'

export const metadata = {
  title: 'Return & Exchange Policy | Chulbuli Jewels',
  description: 'Returns and exchanges within 7 days from purchase date. Learn about our return policy and eligibility requirements.',
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
            Return or exchange within 7 days from purchase date
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiClock className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">7-Day Window</h3>
            <p className="text-warmbrown/70 text-sm">Return or exchange within 7 days from purchase date</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiCheckCircle className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Quality Inspection</h3>
            <p className="text-warmbrown/70 text-sm">All returns are inspected and verified</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiAlertCircle className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Conditions Apply</h3>
            <p className="text-warmbrown/70 text-sm">Items must be unused with original packaging</p>
          </div>
        </div>

        {/* Formal Policy Notice */}
        <div className="mb-12 bg-gradient-to-br from-rosegold/10 via-white/70 to-softgold/10 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-luxury border-2 border-rosegold/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-playfair text-warmbrown mb-4">
              Return Policy
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto" />
          </div>
          
          <div className="space-y-6 text-warmbrown/80 text-sm md:text-base leading-relaxed">
            <div className="space-y-5">
              <div className="bg-white/80 border-l-4 border-rosegold p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Return & Exchange Timeframe</h3>
                <p>We offer refund/exchange <strong className="text-warmbrown">within first 7 days from the date of your purchase</strong>. If 7 days have passed since your purchase, you will not be offered a return, exchange or refund of any kind.</p>
              </div>

              <div className="bg-white/80 border-l-4 border-rosegold p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Eligibility Requirements</h3>
                <p className="mb-3">In order to become eligible for a return or an exchange:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
                  <li>The purchased item should be <strong className="text-warmbrown">unused and in the same condition</strong> as you received it</li>
                  <li>The item must have <strong className="text-warmbrown">original packaging</strong></li>
                  <li>If the item was purchased on a sale, then the item may <strong className="text-warmbrown">not be eligible</strong> for a return/exchange</li>
                </ul>
              </div>

              <div className="bg-white/80 border-l-4 border-rosegold p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Defective or Damaged Items</h3>
                <p>Only such items are replaced by us (based on an exchange request), if such items are found <strong className="text-warmbrown">defective or damaged</strong>.</p>
              </div>

              <div className="bg-white/80 border-l-4 border-amber-500 p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Exempt Categories</h3>
                <p>You agree that there may be a certain category of products/items that are <strong className="text-warmbrown">exempted from returns or refunds</strong>. Such categories of the products would be identified to you at the time of purchase.</p>
              </div>

              <div className="bg-white/80 border-l-4 border-blue-500 p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Return Processing</h3>
                <p>For exchange/return accepted request(s) (as applicable), once your returned product/item is <strong className="text-warmbrown">received and inspected</strong> by us, we will send you an <strong className="text-warmbrown">email to notify you</strong> about receipt of the returned/exchanged product. Further, if the same has been <strong className="text-warmbrown">approved after the quality check</strong> at our end, your request (i.e. return/exchange) will be processed in accordance with our policies.</p>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-300 rounded-lg p-5 text-center">
              <p className="font-semibold text-warmbrown mb-2">Questions About Returns?</p>
              <p className="text-sm">Contact our customer service team at <a href="mailto:support@chulbulijewels.in" className="text-rosegold hover:underline font-medium">support@chulbulijewels.in</a> or call <a href="tel:+919867732204" className="text-rosegold hover:underline font-medium">+91 9867732204</a></p>
            </div>
          </div>
        </div>

        {/* How to Initiate a Return */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-luxury border border-rosegold/20 mb-12">
          <h2 className="font-playfair text-2xl text-warmbrown mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
            How to Initiate a Return
            <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
          </h2>
          <div className="space-y-3 text-warmbrown/80">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">1. Contact Us</p>
                <p className="text-sm">Email or call with your order number and reason for return within 7 days of purchase.</p>
              </div>
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">2. Get Approval</p>
                <p className="text-sm">Receive return authorization and instructions from our team.</p>
              </div>
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">3. Ship the Item</p>
                <p className="text-sm">Pack the item securely with original packaging and ship it back to us.</p>
              </div>
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-4 rounded">
                <p className="font-semibold text-warmbrown mb-2">4. Quality Check</p>
                <p className="text-sm">After inspection and approval, your refund or exchange will be processed.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
          <Link
            href="/refund"
            className="text-center px-6 py-3 bg-rosegold/10 text-warmbrown rounded-full hover:bg-rosegold/20 transition-all duration-300 border border-rosegold/30 hover:border-rosegold/50"
          >
            Refund Policy
          </Link>
          <Link
            href="/terms"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20 hover:border-rosegold/40"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20 hover:border-rosegold/40"
          >
            Privacy Policy
          </Link>
          <Link
            href="/shipping"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20 hover:border-rosegold/40"
          >
            Shipping Policy
          </Link>
          <a
            href="/Policies.pdf"
            download
            className="text-center px-6 py-3 bg-rosegold/10 text-warmbrown rounded-full hover:bg-rosegold/20 transition-all duration-300 border border-rosegold/30 hover:border-rosegold/50"
          >
            Download PDF
          </a>
        </div>
      </div>
    </div>
  )
}
