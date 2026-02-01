import Link from 'next/link'
import { FiFileText, FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'

export const metadata = {
  title: 'Terms & Conditions | Chulbuli Jewels',
  description: 'Terms and conditions for using Chulbuli Jewels website and services.',
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-8 md:px-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair text-warmbrown mb-4 tracking-wide">
            Terms & Conditions
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-6" />
          <p className="text-warmbrown/80 text-lg font-light">
            Please read these terms carefully before using our services
          </p>
          <p className="text-warmbrown/60 text-sm mt-2">Last Updated: February 1, 2026</p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiFileText className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Legal Agreement</h3>
            <p className="text-warmbrown/70 text-sm">Binding terms between you and Chulbuli Jewels</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiCheckCircle className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">User Obligations</h3>
            <p className="text-warmbrown/70 text-sm">Your responsibilities when using our platform</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiAlertTriangle className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Limitations</h3>
            <p className="text-warmbrown/70 text-sm">Understanding our liability limitations</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiInfo className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Policies</h3>
            <p className="text-warmbrown/70 text-sm">Rules governing purchases and usage</p>
          </div>
        </div>

        {/* Detailed Terms */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-luxury border border-rosegold/20 space-y-8">
          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Agreement to Terms
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Welcome to Chulbuli Jewels. By accessing or using our website (www.chulbulijewels.com), mobile application, or any of our services, you agree to be bound by these Terms and Conditions.</p>
              <p>If you do not agree with any part of these terms, you must not use our website or services. Your continued use constitutes acceptance of these terms and any modifications we may make.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Definitions
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-warmbrown">"We," "Us," "Our"</strong> refers to Chulbuli Jewels</li>
                <li><strong className="text-warmbrown">"You," "Your," "User"</strong> refers to the person accessing our services</li>
                <li><strong className="text-warmbrown">"Website"</strong> refers to www.chulbulijewels.com and all related platforms</li>
                <li><strong className="text-warmbrown">"Products"</strong> refers to jewelry items available for purchase</li>
                <li><strong className="text-warmbrown">"Services"</strong> refers to all services provided through our platform</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Eligibility
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>To use our services, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Provide accurate and complete information during registration</li>
                <li>Comply with all applicable laws and regulations in your jurisdiction</li>
              </ul>
              <p className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded text-sm">
                <strong className="text-warmbrown">Note:</strong> By creating an account, you represent and warrant that you meet these eligibility requirements.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Account Registration
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You agree to provide accurate, current, and complete information</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                <li>One person may not maintain multiple accounts without permission</li>
                <li>You are liable for all activities conducted through your account</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Product Information & Pricing
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Product Descriptions:</strong> We strive to provide accurate product descriptions, images, and specifications. However, slight variations in color, size, and appearance may occur.</p>
              <p><strong className="text-warmbrown">Pricing:</strong> All prices are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We reserve the right to change prices without prior notice.</p>
              <p><strong className="text-warmbrown">Errors:</strong> In case of pricing or product description errors, we reserve the right to cancel orders or request additional payment.</p>
              <p><strong className="text-warmbrown">Availability:</strong> Products are subject to availability. We do not guarantee that items will remain in stock.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Orders & Payment
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Order Placement:</strong> An order is considered placed when you receive an order confirmation email from us.</p>
              <p><strong className="text-warmbrown">Order Acceptance:</strong> We reserve the right to accept or decline any order at our discretion, including for reasons such as product availability, errors in pricing, or suspected fraudulent activity.</p>
              <p><strong className="text-warmbrown">Payment Methods:</strong> We accept credit/debit cards, UPI, net banking, and cash on delivery (subject to availability).</p>
              <p><strong className="text-warmbrown">Payment Security:</strong> All payments are processed through secure, encrypted payment gateways. We do not store your payment card information.</p>
              <p><strong className="text-warmbrown">Failed Transactions:</strong> In case of payment failure, your order will not be processed until successful payment is received.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Shipping & Delivery
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Shipping and delivery terms are governed by our <Link href="/shipping" className="text-rosegold hover:underline">Shipping Policy</Link>. Key points include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Delivery timelines are estimates and not guarantees</li>
                <li>We are not liable for delays caused by courier services or force majeure events</li>
                <li>Risk of loss passes to you upon delivery</li>
                <li>You must inspect packages upon delivery and report damage immediately</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Returns, Refunds & Exchanges
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Returns and exchanges are governed by our <Link href="/returns" className="text-rosegold hover:underline">Returns & Exchange Policy</Link>. Please review it carefully before making a purchase.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>7-day return window from date of delivery</li>
                <li>Items must be unused, unworn, and in original condition</li>
                <li>Certain items (earrings, customized jewelry) are non-returnable</li>
                <li>Refunds processed within 5-7 business days of return approval</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Intellectual Property
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>All content on this website, including but not limited to text, images, logos, graphics, videos, and software, is the property of Chulbuli Jewels and protected by copyright, trademark, and other intellectual property laws.</p>
              <p><strong className="text-warmbrown">You may not:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copy, reproduce, or distribute our content without written permission</li>
                <li>Use our trademarks, logos, or brand name without authorization</li>
                <li>Create derivative works from our website content</li>
                <li>Use automated systems to access or scrape our website</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              User Conduct
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Transmit harmful or malicious code</li>
                <li>Engage in fraudulent activities or misrepresentation</li>
                <li>Harass, abuse, or harm other users or our staff</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Post false, misleading, or defamatory reviews</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Limitation of Liability
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>To the maximum extent permitted by law:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount paid for the product in question</li>
                <li>We do not guarantee uninterrupted or error-free website operation</li>
                <li>We are not responsible for third-party content or links</li>
                <li>Product images are for illustration; actual products may vary slightly</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Warranty & Authenticity
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Product Warranty:</strong> All jewelry comes with a warranty against manufacturing defects. Warranty terms vary by product type and material.</p>
              <p><strong className="text-warmbrown">Authenticity:</strong> We guarantee the authenticity of all products. Precious metal jewelry comes with appropriate hallmark certification where applicable.</p>
              <p><strong className="text-warmbrown">Exclusions:</strong> Warranty does not cover damage from misuse, normal wear and tear, or unauthorized repairs.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Privacy
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Your use of our services is also governed by our <Link href="/privacy" className="text-rosegold hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your personal information. By using our services, you consent to our privacy practices.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Modifications to Terms
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services after changes constitutes acceptance of the modified terms.</p>
              <p>We recommend reviewing this page periodically to stay informed of any updates.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Termination
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We may suspend or terminate your access to our services at any time, without prior notice, for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation of these Terms and Conditions</li>
                <li>Fraudulent or illegal activity</li>
                <li>Requests by law enforcement or regulatory authorities</li>
                <li>Technical or security reasons</li>
              </ul>
              <p className="mt-4">Upon termination, your right to use our services ceases immediately, but these terms remain in effect for any outstanding obligations.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Governing Law & Dispute Resolution
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p><strong className="text-warmbrown">Governing Law:</strong> These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in [Your City], India.</p>
              <p><strong className="text-warmbrown">Dispute Resolution:</strong> We encourage you to contact us first to resolve any disputes amicably. If resolution is not possible, disputes may be settled through arbitration or in accordance with Indian law.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Contact Information
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>For questions or concerns regarding these Terms and Conditions, please contact us:</p>
              <div className="bg-rosegold/5 border border-rosegold/30 rounded-lg p-6 mt-4">
                <p><strong className="text-warmbrown">Chulbuli Jewels</strong></p>
                <p className="mt-2"><strong>Email:</strong> chulbulijewels@gmail.com</p>
                <p><strong>Phone:</strong> +91 9867732204</p>
                <p><strong>WhatsApp:</strong> <a href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Join our channel</a></p>
                <p><strong>Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61587171489601" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Visit our page</a></p>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section className="bg-gradient-to-br from-rosegold/10 to-softgold/10 rounded-lg p-6 border border-rosegold/30">
            <p className="text-warmbrown/80 text-center">
              <strong className="text-warmbrown">By using Chulbuli Jewels services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</strong>
            </p>
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
