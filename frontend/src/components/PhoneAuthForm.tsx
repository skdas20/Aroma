'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, ArrowRight, RotateCcw } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface PhoneAuthFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PhoneAuthForm = ({ onSuccess, onError }: PhoneAuthFormProps) => {
  const { signInWithTestPhone } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const recaptchaRef = useRef<HTMLDivElement>(null);

  // Country codes for phone numbers
  const countryCodes = [
    { code: '+1', country: 'US/CA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
  ];  // Initialize reCAPTCHA only for non-test numbers
  useEffect(() => {
    // Don't initialize reCAPTCHA if we're in test mode
    const fullPhoneNumber = getCleanPhoneNumber();
    if (isTestNumber(fullPhoneNumber)) {
      return;
    }

    if (step === 'phone' && !recaptchaVerifier && recaptchaRef.current) {
      try {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            onError('reCAPTCHA expired. Please try again.');
          }
        });
        setRecaptchaVerifier(verifier);
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
        onError('Failed to initialize verification. Please refresh and try again.');
      }
    }

    return () => {
      // Cleanup function - don't clear here as it causes internal-error
    };
  }, [step, recaptchaVerifier, onError, phoneNumber, countryCode]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (clearError) {
          console.warn('Error clearing reCAPTCHA on unmount:', clearError);
        }
      }
    };
  }, []); // Empty dependency array - only run on unmount

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Format based on country code
    if (countryCode === '+1') {
      // US/Canada format: (123) 456-7890
      if (cleaned.length >= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
      } else if (cleaned.length >= 3) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      }
    }
    
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const getCleanPhoneNumber = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    return countryCode + cleaned;
  };
  // Test phone numbers for development (no billing required)
  const isTestNumber = (phoneNumber: string) => {
    const testNumbers = [
      '+16505553434', // +1 650-555-3434
      '+15555555555', // +1 555-555-5555
      '+14155552671', // +1 415-555-2671
      '+16505554567'  // +1 650-555-4567
    ];
    return testNumbers.includes(phoneNumber);
  };

  const getTestCode = () => '123456'; // Test verification code

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      onError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const fullPhoneNumber = getCleanPhoneNumber();
      console.log('Sending OTP to:', fullPhoneNumber);
      
      // Check if it's a test number
      if (isTestNumber(fullPhoneNumber)) {
        // Simulate test mode - no actual SMS sent
        console.log('Using test mode for phone:', fullPhoneNumber);        setStep('otp');
        setResendTimer(60);
        onError(''); // Clear any previous errors
        setLoading(false);
        return;
      }

      // For real numbers, use Firebase (requires billing)
      if (!recaptchaVerifier) {
        onError('reCAPTCHA not initialized. Please refresh and try again.');
        return;
      }
      
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      setResendTimer(60);
      
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      if (error.code === 'auth/billing-not-enabled') {
        onError('Phone authentication requires Firebase Blaze plan. Please use test numbers: +1 650-555-3434 or +1 555-555-5555');
      } else if (error.code === 'auth/invalid-phone-number') {
        onError('Invalid phone number. Please check and try again.');
      } else if (error.code === 'auth/too-many-requests') {
        onError('Too many requests. Please try again later.');      } else if (error.code === 'auth/quota-exceeded') {
        onError('SMS quota exceeded. Please try again later.');
      } else {
        onError('Failed to send verification code. Please try again.');
      }
      
      // Reset reCAPTCHA on error safely
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (clearError) {
          console.warn('Error clearing reCAPTCHA:', clearError);
        }
        setRecaptchaVerifier(null);
      }
    } finally {
      setLoading(false);
    }
  };  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      onError('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      const fullPhoneNumber = getCleanPhoneNumber();
      
      // Check if it's a test number
      if (isTestNumber(fullPhoneNumber)) {
        // For test numbers, verify with test code
        if (otpCode === getTestCode()) {
          console.log('Test number verification successful for:', fullPhoneNumber);
          // Use the test authentication method
          await signInWithTestPhone(fullPhoneNumber);
          onSuccess();
          return;
        } else {
          onError('Invalid verification code. For test numbers, use: 123456');
          return;
        }
      }

      // For real numbers, use Firebase confirmation
      if (!confirmationResult) {
        onError('No verification session found. Please try again.');
        return;
      }

      await confirmationResult.confirm(otpCode);
      onSuccess();
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      if (error.code === 'auth/invalid-verification-code') {
        onError('Invalid verification code. Please check and try again.');
      } else if (error.code === 'auth/code-expired') {
        onError('Verification code expired. Please request a new one.');
      } else {
        onError('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setOtpCode('');
    setStep('phone');
    setConfirmationResult(null);
    
    // Reset and recreate reCAPTCHA safely
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (clearError) {
        console.warn('Error clearing reCAPTCHA:', clearError);
      }
      setRecaptchaVerifier(null);
    }
  };

  return (
    <div className="space-y-6">
      {step === 'phone' ? (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-primary-800 mb-2">Sign in with Phone</h3>
            <p className="text-primary-600 text-sm">We'll send you a verification code</p>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Test Mode:</strong> Use +1 650-555-3434 or +1 555-555-5555 with code 123456
              </p>
            </div>
          </div>

          {/* Country Code Selection */}
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Country
            </label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-golden-200 focus:border-golden-400 focus:outline-none bg-white"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code} ({country.country})
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Phone Number
            </label>
            <div className="flex space-x-2">
              <div className="flex items-center px-4 py-3 bg-golden-50 border-2 border-golden-200 rounded-xl font-medium text-primary-800">
                {countryCode}
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={countryCode === '+1' ? '(123) 456-7890' : 'Phone number'}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-golden-200 focus:border-golden-400 focus:outline-none"
                maxLength={countryCode === '+1' ? 14 : 15}
              />
            </div>
          </div>          {/* reCAPTCHA container */}
          <div id="recaptcha-container" ref={recaptchaRef}></div>

          {/* Send OTP Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendOTP}
            disabled={loading || !phoneNumber.trim()}
            className="w-full py-3 rounded-xl font-semibold shadow-lg transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: loading || !phoneNumber.trim() ? '#9ca3af' : '#d97706',
              color: '#ffffff',
              border: 'none',
              outline: 'none'
            }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <span>Send Verification Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-primary-800 mb-2">Enter Verification Code</h3>            <p className="text-primary-600 text-sm">
              We sent a 6-digit code to {countryCode} {phoneNumber}
            </p>
            {isTestNumber(getCleanPhoneNumber()) && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  <strong>Test Mode:</strong> Use verification code: 123456
                </p>
              </div>
            )}
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              className="w-full px-4 py-3 rounded-xl border-2 border-golden-200 focus:border-golden-400 focus:outline-none text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>          {/* Verify Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerifyOTP}
            disabled={loading || otpCode.length !== 6}
            className="w-full py-3 rounded-xl font-semibold shadow-lg transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{ 
              backgroundColor: loading || otpCode.length !== 6 ? '#9ca3af' : '#10b981',
              color: '#ffffff',
              border: 'none',
              outline: 'none'
            }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <span>Verify & Sign In</span>
            )}
          </motion.button>

          {/* Resend Code */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-primary-600">
                Resend code in {resendTimer}s
              </p>
            ) : (
              <button
                onClick={handleResendOTP}
                className="text-sm text-golden-600 hover:text-golden-700 font-medium flex items-center justify-center space-x-1 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          {/* Back to Phone */}
          <button
            onClick={() => {
              setStep('phone');
              setOtpCode('');
              setConfirmationResult(null);
            }}
            className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            ← Use a different phone number
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PhoneAuthForm;
