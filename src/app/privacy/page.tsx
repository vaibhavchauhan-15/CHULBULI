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
              <p>This Privacy Policy describes how CHULBULI JEWELS and its affiliates (collectively "CHULBULI JEWELS, we, our, us") collect, use, share, protect or otherwise process your information/ personal data through our website https://www.chulbulijewels.in (hereinafter referred to as Platform). Please note that you may be able to browse certain sections of the Platform without registering with us.</p>
              <p>We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Collection
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-4 text-warmbrown/80 leading-relaxed">
              <p>We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship and related information provided from time to time. Some of the information that we may collect includes but is not limited to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal data / information provided to us during sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number, email ID</li>
                <li>Any such information shared as proof of identity or address</li>
                <li>Bank account or credit or debit card or other payment instrument information (with your consent)</li>
                <li>Biometric information such as your facial features or physiological information (in order to enable use of certain features when opted for, available on the Platform)</li>
                <li>Your behaviour, preferences, and other information that you choose to provide on our Platform</li>
                <li>Information related to your transactions on Platform and such third-party business partner platforms</li>
              </ul>
              <p className="mt-4 text-sm italic">All of the above being in accordance with applicable law(s). You always have the option to not provide information, by choosing not to use a particular service or feature on the Platform.</p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
                <p className="font-semibold text-warmbrown">Important Security Notice</p>
                <p className="mt-2 text-sm">If you receive an email, a call from a person/association claiming to be CHULBULI JEWELS seeking any personal data like debit/credit card PIN, net-banking or mobile banking password, we request you to never provide such information. If you have already revealed such information, report it immediately to an appropriate law enforcement agency.</p>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Usage
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses. We use your personal data to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Assist sellers and business partners in handling and fulfilling orders</li>
                <li>Enhance customer experience</li>
                <li>Resolve disputes and troubleshoot problems</li>
                <li>Inform you about online and offline offers, products, services, and updates</li>
                <li>Customise your experience</li>
                <li>Detect and protect us against error, fraud and other criminal activity</li>
                <li>Enforce our terms and conditions</li>
                <li>Conduct marketing research, analysis and surveys</li>
              </ul>
              <p className="mt-4 text-sm">You understand that your access to these products/services may be affected in the event permission is not provided to us.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Sharing
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>We may share your personal data internally within our group entities, our other corporate entities, and affiliates to provide you access to the services and products offered by them. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out.</p>
              <p>We may disclose personal data to third parties such as:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Sellers and business partners</li>
                <li>Third party service providers including logistics partners</li>
                <li>Prepaid payment instrument issuers</li>
                <li>Third-party reward programs and other payment methods opted by you</li>
              </ul>
              <p className="mt-3">These disclosure may be required for us to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide you access to our services and products offered to you</li>
                <li>Comply with our legal obligations</li>
                <li>Enforce our user agreement</li>
                <li>Facilitate our marketing and advertising activities</li>
                <li>Prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our services</li>
              </ul>
              <p className="mt-4">We may disclose personal and sensitive personal data to government agencies or other authorised law enforcement agencies if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process.</p>
              <p className="bg-amber-50 border border-amber-200 p-4 rounded text-sm mt-4">
                <strong className="text-warmbrown">Note:</strong> We may disclose personal data to law enforcement offices, third party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to: enforce our Terms of Use or Privacy Policy; respond to claims that an advertisement, posting or other content violates the rights of a third party; or protect the rights, property or personal safety of our users or the general public.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Consent
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy. If you disclose to us any personal data relating to other people, you represent that you have the authority to do so and permit us to use the information in accordance with this Privacy Policy.</p>
              <p>You, while providing your personal data over the Platform or any partner platforms or establishments, consent to us (including our other corporate entities, affiliates, lending partners, technology partners, marketing channels, business partners and other third parties) to contact you through SMS, instant messaging apps, call and/or e-mail for the purposes specified in this Privacy Policy.</p>
              <p>You have an option to withdraw your consent that you have already provided by writing to the Grievance Officer at the contact information provided below. Please mention "Withdrawal of consent for processing personal data" in your subject line of your communication. We may verify such requests before acting on our request.</p>
              <p className="bg-amber-50 border border-amber-200 p-4 rounded text-sm mt-4">
                <strong className="text-warmbrown">Please Note:</strong> Your withdrawal of consent will not be retrospective and will be in accordance with the Terms of Use, this Privacy Policy, and applicable laws. In the event you withdraw consent given to us under this Privacy Policy, we reserve the right to restrict or deny the provision of our services for which we consider such information to be necessary.
              </p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Security Precautions
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures. Once your information is in our possession or whenever you access your account information, we adhere to our security guidelines to protect it against unauthorised access and offer the use of a secure server.</p>
              <p>However, the transmission of information is not completely secure for reasons beyond our control. By using the Platform, the users accept the security implications of data transmission over the internet and the World Wide Web which cannot always be guaranteed as completely secure, and therefore, there would always remain certain inherent risks regarding use of the Platform.</p>
              <p className="bg-amber-50 border border-amber-200 p-4 rounded text-sm mt-4">
                <strong className="text-warmbrown">Your Responsibility:</strong> Users are responsible for ensuring the protection of login and password records for their account.
              </p>
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
              <p>You may access, rectify, and update your personal data directly through the functionalities provided on the Platform.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Data Deletion and Retention
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>You have an option to delete your account by visiting your profile and settings on our Platform, this action would result in you losing all information related to your account. You may also write to us at the contact information provided below to assist you with these requests.</p>
              <p>We may in event of any pending grievance, claims, pending shipments or any other services we may refuse or delay deletion of the account. Once the account is deleted, you will lose access to the account.</p>
              <p>We retain your personal data information for a period no longer than is required for the purpose for which it was collected or as required under any applicable law. However, we may retain data related to you if we believe it may be necessary to prevent fraud or future abuse or for other legitimate purposes.</p>
              <p>We may continue to retain your data in anonymised form for analytical and research purposes.</p>
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
              Changes to this Privacy Policy
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices. We may alert / notify you about the significant changes to the Privacy Policy, in the manner as may be required under applicable laws.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Grievance Officer
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80 leading-relaxed">
              <p>If you have questions or concerns about this privacy policy or our data practices, please contact us:</p>
              <div className="bg-rosegold/5 border border-rosegold/30 rounded-lg p-6 mt-4">
                <p><strong className="text-warmbrown">CHULBULI JEWELS</strong></p>
                <p className="mt-2"><strong>Address:</strong> C 1004 Block C Sahitya Green Madhavpura Bapod Vadodara Gujarat 390019 India</p>
                <p className="mt-3"><strong>Contact Information:</strong></p>
                <p className="mt-2"><strong>Email:</strong> <a href="mailto:chulbulijewels@gmail.com" className="text-rosegold hover:underline">chulbulijewels@gmail.com</a></p>
                <p><strong>Phone:</strong> <a href="tel:+919867732204" className="text-rosegold hover:underline">+91 9867732204</a></p>
                <p><strong>WhatsApp:</strong> <a href="https://whatsapp.com/channel/0029Vb7CuMe9MF8tE3LGor3R" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Join our channel</a></p>
                <p><strong>Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61587171489601" className="text-rosegold hover:underline" target="_blank" rel="noopener noreferrer">Visit our page</a></p>
                <p className="mt-3 text-sm italic">Time: Monday - Friday (9:00 - 18:00)</p>
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
