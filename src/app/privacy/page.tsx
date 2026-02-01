import Link from 'next/link'
import { FiShield, FiLock, FiEye, FiUserCheck } from 'react-icons/fi'

export const metadata = {
  title: 'Privacy Policy | Chulbuli Jewels',
  description: 'Our commitment to protecting your privacy and personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-8 md:px-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair text-warmbrown mb-4 tracking-wide">
            Privacy Policy
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-6" />
          <p className="text-warmbrown/80 text-lg font-light">
            Your privacy is important to us
          </p>
          <p className="text-warmbrown/60 text-sm mt-2">Last Updated: February 1, 2026</p>
        </div>

        {/* Key Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiShield className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Data Protection</h3>
            <p className="text-warmbrown/70 text-sm">We use industry-standard security measures to protect your data</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiLock className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Secure Transactions</h3>
            <p className="text-warmbrown/70 text-sm">All payment information is encrypted and secure</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiEye className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Transparency</h3>
            <p className="text-warmbrown/70 text-sm">Clear information about how we use your data</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4">
              <FiUserCheck className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-xl text-warmbrown mb-2">Your Rights</h3>
            <p className="text-warmbrown/70 text-sm">You control your personal information</p>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-luxury border border-rosegold/20 space-y-8">
          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Introduction
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Welcome to Chulbuli Jewels. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, store, and share your information when you visit our website or make a purchase from us.</p>
              <p>By using our website, you agree to the collection and use of information in accordance with this policy.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Information We Collect
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-4 text-warmbrown/80">
              <div>
                <h3 className="font-semibold text-warmbrown mb-2">Personal Information</h3>
                <p className="mb-2">When you create an account or make a purchase, we collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely by payment gateway)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-warmbrown mb-2">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website addresses</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-warmbrown mb-2">Communication Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Customer support inquiries and correspondence</li>
                  <li>Product reviews and feedback</li>
                  <li>Survey responses and preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              How We Use Your Information
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We use your personal information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-warmbrown">Process Orders:</strong> Fulfill your purchases, process payments, and arrange shipping</li>
                <li><strong className="text-warmbrown">Customer Service:</strong> Respond to inquiries, handle returns, and provide support</li>
                <li><strong className="text-warmbrown">Account Management:</strong> Create and manage your account, order history, and preferences</li>
                <li><strong className="text-warmbrown">Marketing:</strong> Send promotional emails about new products, offers, and updates (with your consent)</li>
                <li><strong className="text-warmbrown">Personalization:</strong> Recommend products based on your browsing and purchase history</li>
                <li><strong className="text-warmbrown">Security:</strong> Detect and prevent fraud, unauthorized access, and illegal activities</li>
                <li><strong className="text-warmbrown">Analytics:</strong> Improve our website, products, and services based on usage data</li>
                <li><strong className="text-warmbrown">Legal Compliance:</strong> Comply with applicable laws, regulations, and legal processes</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Information Sharing
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We do not sell or rent your personal information. We may share your data with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-warmbrown">Service Providers:</strong> Shipping carriers, payment processors, email service providers, and hosting services</li>
                <li><strong className="text-warmbrown">Legal Authorities:</strong> When required by law or to protect our rights and safety</li>
                <li><strong className="text-warmbrown">Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
              <p className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded text-sm">
                <strong className="text-warmbrown">Important:</strong> All third-party service providers are required to maintain the confidentiality and security of your information.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Cookies & Tracking
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We use cookies and similar tracking technologies to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Remember your preferences and settings</li>
                <li>Keep you logged in to your account</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Serve personalized content and advertisements</li>
                <li>Track shopping cart contents</li>
              </ul>
              <p className="mt-4">You can control cookies through your browser settings. However, disabling cookies may affect website functionality.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Data Security
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>Secure payment processing through trusted gateways</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Restricted access to personal data on a need-to-know basis</li>
                <li>Secure servers with firewall protection</li>
              </ul>
              <p className="mt-4 italic text-sm">While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Your Rights
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-warmbrown">Access:</strong> Request a copy of your personal data we hold</li>
                <li><strong className="text-warmbrown">Correction:</strong> Update or correct inaccurate information</li>
                <li><strong className="text-warmbrown">Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                <li><strong className="text-warmbrown">Opt-Out:</strong> Unsubscribe from marketing emails at any time</li>
                <li><strong className="text-warmbrown">Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong className="text-warmbrown">Object:</strong> Object to processing of your data for certain purposes</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at chulbulijewels@gmail.com</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Data Retention
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We retain your personal information for as long as necessary to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fulfill the purposes outlined in this policy</li>
                <li>Comply with legal, tax, and accounting requirements</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain business records for warranty and support purposes</li>
              </ul>
              <p className="mt-4">Inactive accounts may be deleted after 3 years of inactivity, with prior notice.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Third-Party Links
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Children&apos;s Privacy
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected data from a minor, please contact us immediately.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Changes to Privacy Policy
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated &ldquo;Last Updated&rdquo; date. We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
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
              <p>If you have questions or concerns about this privacy policy or our data practices, please contact us:</p>
              <div className="bg-rosegold/5 border border-rosegold/30 rounded-lg p-6 mt-4">
                <p><strong className="text-warmbrown">Chulbuli Jewels</strong></p>
                <p className="mt-2"><strong>Email:</strong> chulbulijewels@gmail.com</p>
                <p><strong>Phone:</strong> +91 9867732204</p>
                <p><strong>WhatsApp:</strong> <a href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Join our channel</a></p>
                <p><strong>Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61587171489601" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Visit our page</a></p>
              </div>
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
