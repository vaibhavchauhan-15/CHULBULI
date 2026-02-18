import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Debug endpoint to check Firebase configuration (DO NOT expose in production)
export async function GET() {
  // Disable in production for security unless explicitly enabled
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  const debugEnabled = process.env.DEBUG_MODE === 'true';
  
  if (isProduction && !debugEnabled) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.json({
    firebaseConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing',
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '✓ Set' : '✗ Missing',
    },
    firebaseAdmin: {
      serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? '✓ Set' : '✗ Missing',
    },
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'Not on Vercel',
  })
}
