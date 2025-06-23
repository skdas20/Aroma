'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PhoneAuthForm from './PhoneAuthForm';
import Image from 'next/image';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, signInWithGoogle } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'google' | 'phone'>('google');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google sign in failed:', error);
      setError('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuthSuccess = () => {
    setError('');
    // Modal will close automatically via AuthContext
  };

  const handlePhoneAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeLoginModal}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeLoginModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/logo.jpg"
              alt="Aroma Logo"
              width={60}
              height={60}
              className="mx-auto rounded-full shadow-lg border-3 border-golden-400 mb-4"
            />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-golden-600 bg-clip-text text-transparent">
              Welcome to AMARAA LUXURY
            </h2>
            <p className="text-gray-600 mt-2">Sign in to continue your fragrance journey</p>
          </div>          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </motion.div>
          )}

          {/* Login Method Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setLoginMethod('google');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'google'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-primary-700'
              }`}
            >
              Google Sign-In
            </button>
            <button
              onClick={() => {
                setLoginMethod('phone');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-primary-700'
              }`}
            >
              Phone Number
            </button>
          </div>

          {/* Google Sign In */}
          {loginMethod === 'google' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 hover:border-golden-300 rounded-lg py-3 px-4 text-gray-700 font-medium transition-all hover:shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
              </button>
            </motion.div>
          )}

          {/* Phone Authentication */}
          {loginMethod === 'phone' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PhoneAuthForm
                onSuccess={handlePhoneAuthSuccess}
                onError={handlePhoneAuthError}
              />
            </motion.div>
          )}        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
