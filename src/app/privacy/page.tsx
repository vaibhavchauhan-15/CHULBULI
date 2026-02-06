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
          <p className="text-warmbrown/60 text-sm mt-2">Last Updated: February 5, 2026</p>
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
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>This Privacy Policy explains how CHULBULI JEWELS collects, uses, and protects your personal information through our website <strong>www.chulbulijewels.in</strong>. We operate exclusively in India and your data is stored and processed within India.</p>
              <p>By using our platform, you agree to this Privacy Policy and our Terms of Use. If you do not agree, please do not use our services.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Information We Collect
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-4 text-warmbrown/80 leading-relaxed">
              <p>We collect information when you use our platform:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal information: name, date of birth, email, phone number, address</li>
                <li>Identity/address proof documents</li>
                <li>Payment information: credit/debit card or other payment details (with your consent)</li>
                <li>Transaction history and order details</li>
                <li>Browsing behavior and preferences</li>
                <li>Information from third-party platforms you use to access our services</li>
              </ul>
              <p className="mt-3 text-sm italic">You can choose not to provide certain information by not using specific features on our platform.</p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
                <p className="font-semibold text-warmbrown">⚠️ Security Alert</p>
                <p className="mt-2 text-sm">We will never ask for your card PIN, net-banking password, or OTP through email or phone. If someone claiming to be from Chulbuli Jewels requests this information, do not share it and report immediately to law enforcement.</p>
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
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill your orders with sellers and business partners</li>
                <li>Enhance and customize your shopping experience</li>
                <li>Send you updates about orders, products, and offers</li>
                <li>Resolve disputes and troubleshoot problems</li>
                <li>Prevent fraud, detect errors, and ensure security</li>
                <li>Provide customer support</li>
                <li>Enforce our terms and conditions</li>
                <li>Conduct marketing research and surveys</li>
              </ul>
              <p className="mt-4 text-sm italic">You can opt-out of marketing communications at any time. Note that denying certain permissions may affect your access to some features.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Information Sharing
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Group Companies:</strong> our affiliates and corporate entities (you can opt-out of marketing from them)</li>
                <li><strong>Service Providers:</strong> logistics partners, payment processors, prepaid payment issuers</li>
                <li><strong>Business Partners:</strong> sellers and partners to fulfill orders and improve services</li>
                <li><strong>Legal Requirements:</strong> government agencies, law enforcement when required by law (subpoenas, court orders)</li>
                <li><strong>Safety & Protection:</strong> to protect rights, property, or personal safety of our users and the public</li>
              </ul>
              <p className="mt-4"><strong>We never sell your personal information to third parties.</strong></p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Data Security
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>We use industry-standard security practices and procedures to protect your personal information from unauthorized access, loss, or misuse. All payment transactions are encrypted and processed through secure servers.</p>
              <p className="mt-3 text-sm"><strong>Important:</strong> While we implement strong security measures, data transmission over the internet cannot be 100% secure. By using our platform, you accept these inherent risks.</p>
              <p className="text-sm italic">You are responsible for keeping your login credentials secure. Never share your password with anyone.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Your Rights
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and update your personal information through your account</li>
                <li>Delete your account and data (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw your consent for data processing</li>
              </ul>
              <p className="mt-4 text-sm">Contact our Grievance Officer below for any data-related requests.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Data Retention
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>We retain your personal data only for as long as necessary to provide our services and comply with legal obligations. You can:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Delete your account through your profile and settings</li>
                <li>Write to us using the contact information below for deletion requests</li>
              </ul>
              <p className="mt-3 text-sm"><strong>Note:</strong> We may delay or refuse account deletion if there are pending orders, claims, grievances, or legal requirements. Once deleted, you will lose access to your account permanently.</p>
              <p className="text-sm italic">We may retain certain data for fraud prevention, legal compliance, and anonymized data for research purposes even after account deletion.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Your Consent
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>By using our platform and providing your information, you consent to the collection, use, storage, and processing of your information as described in this Privacy Policy.</p>
              <p>When you provide information, you also consent to receive communications from us (including our affiliates and partners) through SMS, calls, instant messaging, and email for the purposes mentioned in this policy.</p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                <p className="font-semibold text-warmbrown">Withdraw Your Consent</p>
                <p className="mt-2 text-sm">You can withdraw your consent by writing to our Grievance Officer (contact details below). Use the subject line: &quot;Withdrawal of consent for processing personal data&quot;.</p>
                <p className="mt-2 text-sm italic"><strong>Please note:</strong> Consent withdrawal is not retroactive and must comply with applicable laws. Withdrawing consent may restrict or deny access to certain services that require your information.</p>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Policy Updates
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes. Please check this page periodically for updates.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Contact Us
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>For any questions or concerns about your privacy or data:</p>
              <div className="bg-rosegold/5 border border-rosegold/30 rounded-lg p-6 mt-4">
                <p><strong className="text-warmbrown">CHULBULI JEWELS</strong></p>
                <p className="mt-2">C 1004 Block C Sahitya Green<br />Madhavpura Bapod<br />Vadodara, Gujarat 390019<br />India</p>
                <p className="mt-3"><strong>Email:</strong> <a href="mailto:support@chulbulijewels.in" className="text-rosegold hover:underline">support@chulbulijewels.in</a></p>
                <p><strong>Phone:</strong> <a href="tel:+919867732204" className="text-rosegold hover:underline">+91 9867732204</a></p>
                <p><strong>WhatsApp:</strong> <a href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Join our channel</a></p>
                <p><strong>Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61587171489601" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Visit our page</a></p>
                <p className="mt-3 text-sm">Available: Monday - Friday (9:00 AM - 6:00 PM IST)</p>
              </div>
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
            href="/returns"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20"
          >
            Return Policy
          </Link>
          <Link
            href="/shipping"
            className="text-center px-6 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20"
          >
            Shipping Policy
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
