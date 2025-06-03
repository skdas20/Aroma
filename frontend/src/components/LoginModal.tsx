'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, signInWithGoogle } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'google' | 'otp'>('google');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
      alert('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    if (!showOtpInput) {
      // Send OTP
      setIsLoading(true);
      // Simulate OTP sending
      setTimeout(() => {
        setShowOtpInput(true);
        setIsLoading(false);
        alert('OTP sent to your phone!');
      }, 1500);
    } else {
      // Verify OTP
      if (otp === '123456') {
        alert('Login successful!');
        closeLoginModal();
      } else {
        alert('Invalid OTP. Please try again.');
      }
    }
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
          </div>

          {/* Login Method Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLoginMethod('google')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'google'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-primary-700'
              }`}
            >
              Google Sign-In
            </button>
            <button
              onClick={() => setLoginMethod('otp')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginMethod === 'otp'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-primary-700'
              }`}
            >
              Phone OTP
            </button>
          </div>          {/* Google Sign In */}
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
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
              </button>
            </motion.div>
          )}

          {/* OTP Login */}
          {loginMethod === 'otp' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {!showOtpInput ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    onClick={handleOtpLogin}
                    disabled={isLoading || !phoneNumber}
                    className="w-full bg-gradient-to-r from-primary-600 to-golden-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:transform-none"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Enter the 6-digit OTP sent to {phoneNumber}
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-golden-500 focus:border-transparent transition-all text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <button
                    onClick={handleOtpLogin}
                    disabled={otp.length !== 6}
                    className="w-full bg-gradient-to-r from-primary-600 to-golden-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:transform-none"
                  >
                    Verify OTP
                  </button>
                  <button
                    onClick={() => setShowOtpInput(false)}
                    className="w-full text-gray-600 py-2 text-sm hover:text-primary-700 transition-colors"
                  >
                    Change phone number
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Demo Note */}
          <div className="mt-6 p-3 bg-golden-50 rounded-lg border border-golden-200">
            <p className="text-xs text-golden-800 text-center">
              <strong>Demo:</strong> For OTP login, use code: 123456
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
