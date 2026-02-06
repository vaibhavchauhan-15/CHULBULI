import Link from 'next/link'
import { FiDroplet, FiSun, FiShield, FiHeart } from 'react-icons/fi'
import { GiJewelCrown, GiSparkles } from 'react-icons/gi'

export const metadata = {
  title: 'Jewelry Care Guide | Chulbuli Jewels',
  description: 'Learn how to care for your precious jewelry and keep it sparkling for years.',
}

export default function CareInstructions() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne py-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-8 md:px-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair text-warmbrown mb-4 tracking-wide">
            Jewelry Care Guide
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-6" />
          <p className="text-warmbrown/80 text-lg font-light">
            Keep your precious jewelry sparkling and beautiful for a lifetime
          </p>
        </div>

        {/* Care Tips Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20 text-center">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4 mx-auto">
              <GiSparkles className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-lg text-warmbrown mb-2">Regular Cleaning</h3>
            <p className="text-warmbrown/70 text-sm">Clean jewelry regularly to maintain shine</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20 text-center">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4 mx-auto">
              <FiShield className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-lg text-warmbrown mb-2">Proper Storage</h3>
            <p className="text-warmbrown/70 text-sm">Store in dry, safe places</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-luxury border border-rosegold/20 text-center">
            <div className="w-12 h-12 rounded-full bg-rosegold/10 flex items-center justify-center mb-4 mx-auto">
              <FiHeart className="w-6 h-6 text-rosegold" />
            </div>
            <h3 className="font-playfair text-lg text-warmbrown mb-2">Handle with Care</h3>
            <p className="text-warmbrown/70 text-sm">Gentle handling preserves beauty</p>
          </div>
        </div>

        {/* Detailed Care Instructions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 md:p-12 shadow-luxury border border-rosegold/20 space-y-8">
          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-6 flex items-center gap-3">
              <GiJewelCrown className="w-7 h-7 text-rosegold" />
              General Care Guidelines
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Always remove jewelry before bathing, swimming, or engaging in physical activities</li>
                <li>Apply perfumes, lotions, and cosmetics before wearing jewelry</li>
                <li>Remove jewelry before sleeping to prevent damage</li>
                <li>Keep jewelry away from harsh chemicals, detergents, and cleaning agents</li>
                <li>Store each piece separately to avoid scratches and tangling</li>
                <li>Have your jewelry professionally inspected and cleaned annually</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-6 flex items-center gap-3">
              <GiSparkles className="w-7 h-7 text-rosegold" />
              Cleaning Your Jewelry
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            
            <div className="space-y-6">
              <div className="bg-rosegold/5 border-l-4 border-rosegold p-5 rounded">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Gold Jewelry</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-warmbrown/80 text-sm">
                  <li>Mix warm water with mild soap or dishwashing liquid</li>
                  <li>Soak jewelry for 10-15 minutes</li>
                  <li>Gently scrub with a soft-bristled brush (baby toothbrush works well)</li>
                  <li>Rinse thoroughly with clean water</li>
                  <li>Pat dry with a soft, lint-free cloth</li>
                  <li>Polish with a jewelry polishing cloth for extra shine</li>
                </ul>
              </div>

              <div className="bg-rosegold/5 border-l-4 border-rosegold p-5 rounded">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Silver Jewelry</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-warmbrown/80 text-sm">
                  <li>Use a silver polishing cloth to remove tarnish</li>
                  <li>For heavy tarnish, use a silver cleaning solution</li>
                  <li>Create a paste with baking soda and water for gentle cleaning</li>
                  <li>Avoid using toothpaste as it can be abrasive</li>
                  <li>Store in anti-tarnish bags or with chalk to prevent oxidation</li>
                </ul>
              </div>

              <div className="bg-rosegold/5 border-l-4 border-rosegold p-5 rounded">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Gemstone & Diamond Jewelry</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-warmbrown/80 text-sm">
                  <li>Use lukewarm water with mild soap</li>
                  <li>Soak for 20-30 minutes, then gently brush around the stone settings</li>
                  <li>Rinse carefully and dry with a soft cloth</li>
                  <li>For delicate stones (pearls, opals, emeralds), wipe with a damp cloth only</li>
                  <li>Never use ultrasonic cleaners on fragile gemstones</li>
                </ul>
              </div>

              <div className="bg-rosegold/5 border-l-4 border-rosegold p-5 rounded">
                <h3 className="font-semibold text-warmbrown mb-3 text-lg">Artificial/Fashion Jewelry</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-warmbrown/80 text-sm">
                  <li>Wipe with a dry or slightly damp soft cloth</li>
                  <li>Avoid water contact as it may damage the plating</li>
                  <li>Do not use chemical cleaners</li>
                  <li>Apply a clear nail polish coating to prevent tarnishing</li>
                  <li>Store in airtight containers with silica gel packets</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-6 flex items-center gap-3">
              <FiShield className="w-7 h-7 text-rosegold" />
              Storage Guidelines
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-warmbrown">Separate Storage:</strong> Store each piece in individual pouches or compartments to prevent scratching</li>
                <li><strong className="text-warmbrown">Dry Environment:</strong> Keep jewelry in a cool, dry place away from humidity</li>
                <li><strong className="text-warmbrown">Jewelry Box:</strong> Use a fabric-lined jewelry box with compartments</li>
                <li><strong className="text-warmbrown">Anti-Tarnish Strips:</strong> Place anti-tarnish strips in silver jewelry storage</li>
                <li><strong className="text-warmbrown">Chains & Necklaces:</strong> Hang or lay flat to prevent tangling and kinking</li>
                <li><strong className="text-warmbrown">Pearls:</strong> Store separately as they can be scratched by harder gemstones</li>
              </ul>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-6 flex items-center gap-3">
              <FiDroplet className="w-7 h-7 text-rosegold" />
              What to Avoid
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <FiDroplet className="w-4 h-4" />
                  Water & Moisture
                </h3>
                <p className="text-sm text-red-700">Remove before showering, swimming, or exercising. Chlorine and saltwater can damage jewelry.</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <FiSun className="w-4 h-4" />
                  Heat & Sunlight
                </h3>
                <p className="text-sm text-red-700">Prolonged exposure can fade colored gemstones and weaken metal settings.</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h3 className="font-semibold text-red-800 mb-2">Chemicals</h3>
                <p className="text-sm text-red-700">Avoid perfumes, hairsprays, bleach, chlorine, and household cleaners.</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h3 className="font-semibold text-red-800 mb-2">Physical Impact</h3>
                <p className="text-sm text-red-700">Remove jewelry during sports, gardening, or heavy lifting to prevent damage.</p>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-6 flex items-center gap-3">
              <FiHeart className="w-7 h-7 text-rosegold" />
              Maintenance Tips
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0 text-white font-semibold">1</div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1">Regular Inspection</h3>
                  <p className="text-warmbrown/80 text-sm">Check clasps, prongs, and settings regularly for loose stones or wear</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0 text-white font-semibold">2</div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1">Professional Cleaning</h3>
                  <p className="text-warmbrown/80 text-sm">Get jewelry professionally cleaned and inspected at least once a year</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0 text-white font-semibold">3</div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1">Wear Order</h3>
                  <p className="text-warmbrown/80 text-sm">Jewelry should be the last thing you put on and first thing you take off</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-rosegold flex items-center justify-center flex-shrink-0 text-white font-semibold">4</div>
                <div>
                  <h3 className="font-semibold text-warmbrown mb-1">Insurance</h3>
                  <p className="text-warmbrown/80 text-sm">Consider insuring valuable pieces against loss, theft, or damage</p>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section>
            <h2 className="font-playfair text-2xl text-warmbrown mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-rosegold/50 to-transparent" />
              Professional Services
              <div className="h-px flex-1 bg-gradient-to-l from-rosegold/50 to-transparent" />
            </h2>
            <div className="space-y-3 text-warmbrown/80">
              <p>Chulbuli Jewels offers professional jewelry care services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-warmbrown">Free Cleaning:</strong> Complimentary professional cleaning for all purchases</li>
                <li><strong className="text-warmbrown">Repair Services:</strong> Expert repair for damaged or broken jewelry</li>
                <li><strong className="text-warmbrown">Resizing:</strong> Ring and bangle resizing services available</li>
                <li><strong className="text-warmbrown">Polishing:</strong> Professional polishing to restore original luster</li>
                <li><strong className="text-warmbrown">Stone Setting:</strong> Loose stone re-setting and prong tightening</li>
              </ul>
              <p className="mt-4">Contact us at support@chulbulijewels.in or +91 9867732204 to schedule a service appointment.</p>
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-rosegold/30 to-transparent" />

          <section className="bg-gradient-to-br from-rosegold/10 to-softgold/10 rounded-lg p-6 border border-rosegold/30">
            <h3 className="font-playfair text-xl text-warmbrown mb-4 text-center">💡 Pro Tip</h3>
            <p className="text-warmbrown/80 text-center italic">
              &ldquo;Create a jewelry care routine: Clean your pieces monthly, check settings quarterly, and get professional inspection annually. Your jewelry will thank you with lasting beauty and brilliance!&rdquo;
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
