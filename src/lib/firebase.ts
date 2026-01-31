// Firebase client-side configuration for authentication
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import type { Auth, UserCredential } from 'firebase/auth'

// Your Firebase configuration
// These values come from environment variables for security
// If env vars are not set, falls back to existing hardcoded values for development
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCcdum-kszxqBtKXZfpvF5BDUaVoX3R9rg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "chulbuli-jewels-store.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "chulbuli-jewels-store",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "chulbuli-jewels-store.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "553889037702",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:553889037702:web:fc6fc223a7d6ddf1e18007",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-H3HS9VR885"
}

// Initialize Firebase (client-side only)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app)

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force account selection even if user is already signed in
})

/**
 * Sign in with Google using popup
 * @returns UserCredential from Firebase
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled')
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked by browser. Please allow popups for this site.')
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your connection.')
    }
    throw error
  }
}

/**
 * Sign out from Firebase
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Error signing out from Firebase:', error)
    throw error
  }
}

/**
 * Get ID token from current user
 * @returns Firebase ID token or null
 */
export const getIdToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser
    if (!user) return null
    
    const token = await user.getIdToken()
    return token
  } catch (error) {
    console.error('Error getting ID token:', error)
    return null
  }
}

export default app
