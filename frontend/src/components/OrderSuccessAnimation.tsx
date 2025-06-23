'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';

interface OrderSuccessAnimationProps {
  orderNumber: string;
  onClose: () => void;
}

export default function OrderSuccessAnimation({ orderNumber, onClose }: OrderSuccessAnimationProps) {
  const [showCrackers, setShowCrackers] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCrackers(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Cracker particles
  const crackerParticles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'][Math.floor(Math.random() * 6)]
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Crackers Animation */}
      <AnimatePresence>
        {showCrackers && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {crackerParticles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ 
                  opacity: 0, 
                  scale: 0, 
                  x: `${particle.x}vw`, 
                  y: `${particle.y}vh`,
                  rotate: 0
                }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  scale: [0, 1, 1, 0], 
                  y: `${particle.y + 20}vh`,
                  rotate: 360
                }}
                transition={{ 
                  duration: 2, 
                  delay: particle.delay,
                  ease: "easeOut"
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{ backgroundColor: particle.color }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Success Card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 10 }}
            className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            🎉 Order Placed Successfully!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-6"
          >
            Thank you for your purchase! Your order has been confirmed.
          </motion.p>

          {/* Order Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 mb-6"
          >
            <p className="text-sm font-medium text-gray-700 mb-1">Order Number</p>
            <p className="text-xl font-bold text-green-700">{orderNumber}</p>
          </motion.div>

          {/* Order Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-between items-center mb-8 px-4"
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-600 font-medium">Confirmed</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                <Package className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-xs text-yellow-600 font-medium">Processing</span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Truck className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Shipped</span>
            </div>
          </motion.div>

          {/* Estimated Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center text-gray-600 mb-6"
          >
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Estimated delivery: 5-7 business days</span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-3"
          >
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.open('/orders', '_blank')}
              className="flex-1 bg-white border-2 border-green-500 text-green-600 font-semibold py-3 px-6 rounded-xl hover:bg-green-50 transition-all"
            >
              Track Order
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
