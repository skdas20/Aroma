'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md border border-primary-100"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-primary-800 mb-2"
          >
            Welcome to Aroma
          </motion.h1>
          <p className="text-primary-600">Sign in to discover your perfect fragrance</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-primary-600 mb-4">Authentication coming soon!</p>
          <Link 
            href="/"
            className="inline-block bg-golden-600 hover:bg-golden-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            Continue to Home
          </Link>
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-sm text-primary-600">
            By using this site, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}