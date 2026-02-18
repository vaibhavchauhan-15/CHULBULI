// Firebase client-side configuration for authentication
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import type { Auth, UserCredential } from 'firebase/auth'
import { firebase } from './config/environment'

// Get Firebase configuration from centralized environment
const firebaseConfig = {
  apiKey: firebase.apiKey,
  authDomain: firebase.authDomain,
  projectId: firebase.projectId,
  storageBucket: firebase.storageBucket,
  messagingSenderId: firebase.messagingSenderId,
  appId: firebase.appId,
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
