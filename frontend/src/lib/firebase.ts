import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDF3FBk30I4y1UfRvAB0nnOfOfiZnDfhPk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "healthpix-63617.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "healthpix-63617",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "healthpix-63617.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "275934394685",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:275934394685:web:healthpix63617",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Phone authentication functions
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response: any) => {
      console.log('reCAPTCHA solved:', response);
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
};

export const sendPhoneVerification = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending phone verification:', error);
    throw error;
  }
};

export const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string) => {
  try {
    const result = await confirmationResult.confirm(code);
    return result.user;
  } catch (error) {
    console.error('Error verifying phone code:', error);
    throw error;
  }
};
