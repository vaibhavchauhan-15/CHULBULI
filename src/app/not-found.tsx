import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-champagne via-pearl to-champagne flex items-center justify-center px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-playfair text-warmbrown mb-4">404</h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rosegold to-transparent mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-playfair text-warmbrown mb-4">
            Page Not Found
          </h2>
          <p className="text-warmbrown/70 text-lg mb-8">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-rosegold text-white rounded-full hover:bg-rosegold/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 bg-white/70 text-warmbrown rounded-full hover:bg-rosegold/10 transition-all duration-300 border border-rosegold/20"
          >
            Shop Products
          </Link>
        </div>
      </div>
    </div>
  )
}
