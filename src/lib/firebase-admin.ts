// Firebase Admin SDK for server-side token verification
import * as admin from 'firebase-admin'

// Singleton instance
let firebaseAdmin: admin.app.App | null = null

/**
 * Initialize Firebase Admin SDK
 * Call this function before using any Firebase Admin features
 * @returns Firebase Admin App instance or null if configuration is missing
 */
export const initializeFirebaseAdmin = (): admin.app.App | null => {
  // Return existing instance if already initialized
  if (firebaseAdmin) {
    return firebaseAdmin
  }

  // Check if Firebase Admin is already initialized (prevents duplicate initialization errors)
  if (admin.apps.length > 0) {
    console.log('ℹ️  Firebase Admin SDK already initialized, using existing instance')
    firebaseAdmin = admin.apps[0]
    return firebaseAdmin
  }

  try {
    // Check if service account key is provided
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

    if (!serviceAccountKey) {
      console.error('❌ Firebase Admin SDK Configuration Error:')
      console.error('   FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing')
      console.error('   ')
      console.error('   📋 To fix this:')
      console.error('   1. Open FIREBASE_SETUP_GUIDE.md in your project root')
      console.error('   2. Follow Steps 2 & 3 to get your service account key')
      console.error('   3. Add it to your .env.local file')
      console.error('   4. Restart the development server')
      console.error('   ')
      return null
    }

    // Decode base64 service account key
    let serviceAccount
    try {
      serviceAccount = JSON.parse(
        Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
      )
    } catch (parseError) {
      console.error('❌ Firebase Admin SDK Configuration Error:')
      console.error('   Failed to decode FIREBASE_SERVICE_ACCOUNT_KEY')
      console.error('   The service account key must be base64 encoded')
      console.error('   ')
      console.error('   📋 To fix this:')
      console.error('   1. Check FIREBASE_SETUP_GUIDE.md Step 2 for encoding instructions')
      console.error('   2. Make sure you copied the entire base64 string')
      console.error('   ')
      return null
    }

    // Validate service account structure
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      console.error('❌ Firebase Admin SDK Configuration Error:')
      console.error('   Invalid service account key structure')
      console.error('   Required fields: project_id, private_key, client_email')
      console.error('   ')
      return null
    }

    // Initialize Firebase Admin
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    })

    console.log('✅ Firebase Admin SDK initialized successfully')
    console.log(`   Project: ${serviceAccount.project_id}`)
    return firebaseAdmin
  } catch (error: any) {
    // Check if error is due to already initialized app
    if (error.code === 'app/duplicate-app') {
      console.log('ℹ️  Firebase Admin SDK already initialized (duplicate app), using existing instance')
      firebaseAdmin = admin.apps[0]
      return firebaseAdmin
    }
    
    console.error('❌ Failed to initialize Firebase Admin SDK:')
    console.error(`   ${error.message}`)
    console.error(`   Error code: ${error.code}`)
    console.error('   ')
    console.error('   📋 See FIREBASE_SETUP_GUIDE.md for complete setup instructions')
    console.error('   ')
    return null
  }
}

/**
 * Get Firebase Admin Auth instance
 * @returns Firebase Auth instance or null if not initialized
 */
export const getAdminAuth = (): admin.auth.Auth | null => {
  try {
    if (!firebaseAdmin) {
      firebaseAdmin = initializeFirebaseAdmin()
    }
    
    if (!firebaseAdmin) {
      console.error('⚠️  Firebase Admin SDK not initialized - auth operations will fail')
      return null
    }
    
    return firebaseAdmin.auth()
  } catch (error: any) {
    console.error('❌ Error getting Firebase Admin Auth instance:', error.message)
    return null
  }
}

/**
 * Verify Firebase ID token
 * @param idToken - Firebase ID token from client
 * @returns Decoded token payload
 * @throws Error if token is invalid or Firebase Admin is not initialized
 */
export const verifyFirebaseToken = async (
  idToken: string
): Promise<admin.auth.DecodedIdToken> => {
  try {
    const auth = getAdminAuth()
    
    if (!auth) {
      throw new Error(
        'Firebase Admin SDK is not initialized. ' +
        'Please check your FIREBASE_SERVICE_ACCOUNT_KEY environment variable. ' +
        'See FIREBASE_SETUP_GUIDE.md for setup instructions.'
      )
    }
    
    const decodedToken = await auth.verifyIdToken(idToken)
    return decodedToken
  } catch (error: any) {
    console.error('Token verification failed:', error.message)
    throw new Error('Invalid or expired token')
  }
}

/**
 * Get user by UID from Firebase
 * @param uid - Firebase user UID
 * @returns User record from Firebase
 * @throws Error if user not found or Firebase Admin is not initialized
 */
export const getFirebaseUser = async (
  uid: string
): Promise<admin.auth.UserRecord> => {
  try {
    const auth = getAdminAuth()
    
    if (!auth) {
      throw new Error(
        'Firebase Admin SDK is not initialized. ' +
        'Please check your FIREBASE_SERVICE_ACCOUNT_KEY environment variable.'
      )
    }
    
    const user = await auth.getUser(uid)
    return user
  } catch (error: any) {
    console.error('Failed to get Firebase user:', error.message)
    throw new Error('User not found in Firebase')
  }
}
