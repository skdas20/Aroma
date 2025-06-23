'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Use the centralized Firebase config

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  verifyPhoneOTP: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  signInWithTestPhone: (phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  // Convert Firebase User to our User interface and sync with backend
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userData = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      photoURL: firebaseUser.photoURL || undefined,
    };

    // Send user data to backend
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          firebaseUid: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber,
          authProvider: 'google'
        }),
      });      if (response.ok) {
        const result = await response.json();
        console.log('✅ User synced with backend:', result.message);
        console.log('📝 Backend user data:', result.user);
        
        // Update user ID with MongoDB ID
        userData.id = result.user.id;
        console.log('🔄 Updated user ID from Firebase UID to MongoDB ID:', userData.id);
      } else {
        console.error('❌ Failed to sync user with backend');
      }
    } catch (error) {
      console.error('❌ Backend sync error:', error);
    }

    return userData;
  };  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const convertedUser = await convertFirebaseUser(firebaseUser);
        setUser(convertedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log('Starting Google Sign-In...');
      
      // This will open the real Google sign-in popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      console.log('Google Sign-In successful:', firebaseUser);
      
      // User will be automatically set via onAuthStateChanged
      closeLoginModal();
      
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup was closed by user');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Popup was blocked by browser. Please allow popups for this site.');
      } else {
        alert('Failed to sign in with Google. Please try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    try {
      setLoading(true);
      console.log('Starting Phone Sign-In for:', phoneNumber);
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('Phone verification sent successfully');
      
      return confirmationResult;
    } catch (error: any) {
      console.error('Error signing in with phone:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const verifyPhoneOTP = async (confirmationResult: ConfirmationResult, code: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('Verifying phone OTP...');
      
      await confirmationResult.confirm(code);
      console.log('Phone verification successful');
      
      // User will be automatically set via onAuthStateChanged
      closeLoginModal();
    } catch (error: any) {
      console.error('Error verifying phone OTP:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const signInWithTestPhone = async (phoneNumber: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('Signing in with test phone number:', phoneNumber);
      
      // Create user data for backend
      const userData = {
        email: `${phoneNumber.replace(/\D/g, '')}@test.phone`,
        displayName: `Test User (${phoneNumber})`,
        phoneNumber: phoneNumber,
        authProvider: 'test'
      };

      // Send test user data to backend
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Test user synced with backend:', result.message);
          
          // Create test user with MongoDB ID
          const testUser: User = {
            id: result.user.id,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: undefined
          };
          
          setUser(testUser);
        } else {
          console.error('❌ Failed to sync test user with backend');
          // Fallback to local test user
          const testUser: User = {
            id: `test_phone_${phoneNumber.replace(/\D/g, '')}`,
            email: userData.email,
            displayName: userData.displayName,
            photoURL: undefined
          };
          setUser(testUser);
        }
      } catch (error) {
        console.error('❌ Backend sync error for test user:', error);
        // Fallback to local test user
        const testUser: User = {
          id: `test_phone_${phoneNumber.replace(/\D/g, '')}`,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: undefined
        };
        setUser(testUser);
      }
      
      closeLoginModal();
      console.log('Test phone sign-in successful');
    } catch (error: any) {
      console.error('Error signing in with test phone:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      // Check if current user is a test user (starts with test_phone_)
      if (user && user.id.startsWith('test_phone_')) {
        // For test users, just clear the user state locally
        setUser(null);
        console.log('Successfully signed out test user');
        return;
      }
      
      // For Firebase users, use Firebase signOut
      await signOut(auth);
      // User will be automatically set to null via onAuthStateChanged
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneOTP,
    signInWithTestPhone,
    logout,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}