/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://chulbuli-jewels-store.firebaseapp.com https://checkout.razorpay.com https://mercury.phonepe.com https://mercury-stg.phonepe.com https://mercury-uat.phonepe.com https://mercury-t2.phonepe.com https://vercel.live https://*.vercel.app https://*.vercel-scripts.com https://*.netlify.app https://*.netlify.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com https://vercel.live",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://res.cloudinary.com https://accounts.google.com https://www.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseinstallations.googleapis.com https://chulbuli-jewels-store.firebaseapp.com https://*.firebaseio.com wss://*.firebaseio.com https://api.razorpay.com https://lumberjack.razorpay.com https://api.phonepe.com https://api-preprod.phonepe.com https://mercury.phonepe.com https://mercury-stg.phonepe.com https://mercury-uat.phonepe.com https://mercury-t2.phonepe.com https://vercel.live wss://vercel.live https://*.netlify.app https://*.netlify.com",
              "frame-src 'self' https://accounts.google.com https://www.google.com https://chulbuli-jewels-store.firebaseapp.com https://api.razorpay.com https://mercury.phonepe.com https://mercury-stg.phonepe.com https://mercury-uat.phonepe.com https://mercury-t2.phonepe.com https://vercel.live",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
