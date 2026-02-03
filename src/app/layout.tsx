import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from '@/components/ErrorBoundary'
import AuthInitializer from '@/components/AuthInitializer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chulbuli Jewels - Elegant Jewelry for Women',
  description: 'Shop beautiful and affordable jewelry for every occasion',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthInitializer />
          {children}
        </ErrorBoundary>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
