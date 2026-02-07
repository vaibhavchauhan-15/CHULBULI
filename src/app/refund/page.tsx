import Link from 'next/link'

export const metadata = {
  title: 'Refund & Cancellation Policy | Chulbuli Jewels',
  description: 'Learn about our refund and cancellation policy for orders at Chulbuli Jewels.',
}

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne py-16">
      <div className="max-w-4xl mx-auto px-8 md:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair text-warmbrown mb-4 tracking-wide">
            Refund and Cancellation Policy
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-6" />
          <p className="text-warmbrown/80 text-lg font-light">
            This refund and cancellation policy outlines how you can cancel or seek a refund for a product/service that you have purchased through the Platform.
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-gradient-to-br from-rosegold/10 via-white/70 to-softgold/10 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-luxury border-2 border-rosegold/30">
          <div className="space-y-6 text-warmbrown/80 text-sm md:text-base leading-relaxed">
            <div className="space-y-5">
              <div className="bg-white/80 border-l-4 border-rosegold p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Cancellation Timeframe</h3>
                <p>Cancellations will only be considered if the request is made <strong className="text-warmbrown">within 7 days of placing the order</strong>. However, cancellation requests may not be entertained if the orders have been communicated to such sellers/merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.</p>
              </div>

              <div className="bg-white/80 border-l-4 border-rosegold p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Non-Cancellable Items</h3>
                  <p>
                    CHULBULI JEWELS does not accept cancellation or return requests for earrings, rings, and other jewellery items due to hygiene and safety reasons. However, if you receive a product that is damaged, defective, or does not meet our quality standards, you may request a replacement or refund by contacting us within 48 hours of delivery with valid proof. Approved replacement products will be delivered within 7–10 business days.
                  </p>
              </div>
              
              <div className="bg-white/80 border-l-4 border-rosegold p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Damaged or Defective Items</h3>
                <p>In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/merchant listed on the Platform has checked and determined the same at its own end. This should be reported <strong className="text-warmbrown">within 7 days of receipt of products</strong>.</p>
              </div>

              <div className="bg-white/80 border-l-4 border-rosegold p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Product Not as Expected</h3>
                <p>In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service <strong className="text-warmbrown">within 7 days of receiving the product</strong>. The customer service team after looking into your complaint will take an appropriate decision.</p>
              </div>

              <div className="bg-white/80 border-l-4 border-rosegold p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Warranty Items</h3>
                <p>In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.</p>
              </div>

              <div className="bg-white/80 border-l-4 border-amber-500 p-5 rounded-r-lg">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Refund Processing Time</h3>
                <p>In case of any refunds approved by CHULBULI JEWELS, it will take <strong className="text-warmbrown">5 days</strong> for the refund to be processed to you.</p>
              </div>
            </div>

            <div className="mt-8 bg-rosegold/10 border border-rosegold/30 rounded-lg p-5 text-center">
              <p className="font-semibold text-warmbrown mb-2">Need Assistance?</p>
              <p className="text-sm">Contact our customer service team at <a href="mailto:support@chulbulijewels.in" className="text-rosegold hover:underline font-medium">support@chulbulijewels.in</a> or call <a href="tel:+919867732204" className="text-rosegold hover:underline font-medium">+91 9867732204</a></p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-4">
          <Link
            href="/returns"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20 hover:border-rosegold/40"
          >
            Return Policy
          </Link>
          <Link
            href="/terms"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20 hover:border-rosegold/40"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/shipping"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20 hover:border-rosegold/40"
          >
            Shipping Policy
          </Link>
          <Link
            href="/contact"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20 hover:border-rosegold/40"
          >
            Contact Us
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
