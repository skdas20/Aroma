'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-mint/20">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-primary-200/30 to-secondary-200/30"
            initial={{ 
              x: Math.random() * windowSize.width, 
              y: Math.random() * windowSize.height,
              scale: 0 
            }}
            animate={{ 
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              scale: [0, 1, 0.5, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-mint bg-clip-text text-transparent">
              Discover
            </span>
            <br />            <span className="text-light-text">Your Perfect</span>
            <br />
            <span className="bg-gradient-to-r from-secondary-500 via-primary-500 to-accent-mint bg-clip-text text-transparent">
              Scent
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl sm:text-2xl text-light-muted mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Explore our curated collection of luxury perfumes. From fresh florals to bold orientals, 
          find the fragrance that tells your unique story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/products"
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-full hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Shop Collection
          </Link>
            <button className="px-8 py-4 border-2 border-primary-500 text-light-text font-semibold rounded-full hover:border-secondary-500 hover:text-secondary-500 transform hover:scale-105 transition-all duration-200">
            AI Fragrance Guide
          </button>
        </motion.div>        {/* Perfume bottles illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-16 flex justify-center space-x-8"
        >
          {[1, 2, 3].map((bottle, index) => (
            <motion.div
              key={bottle}
              animate={{ 
                y: [0, -10, 0],
                rotateY: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut"
              }}
              className="w-16 h-24 sm:w-20 sm:h-30 relative"
            >
              <div className={`w-full h-full rounded-lg bg-gradient-to-b ${
                index === 0 ? 'from-primary-300 to-primary-500' :
                index === 1 ? 'from-secondary-300 to-secondary-500' :
                'from-accent-mint to-primary-400'
              } relative overflow-hidden shadow-lg`}>
                {/* Bottle cap */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-primary-200 to-primary-400 rounded-t-lg"></div>
                
                {/* Perfume liquid */}
                <div className={`absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t ${
                  index === 0 ? 'from-primary-600 to-primary-400' :
                  index === 1 ? 'from-secondary-600 to-secondary-400' :
                  'from-accent-mint to-primary-300'
                } opacity-80 rounded-b-lg`}></div>
                
                {/* Reflection */}
                <div className="absolute top-2 left-2 w-2 h-6 bg-white/30 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="mt-16 grid grid-cols-3 gap-8 text-center"
        >          <div>
            <div className="text-3xl sm:text-4xl font-bold text-light-text mb-2">7</div>
            <div className="text-light-muted">Premium Fragrances</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-light-text mb-2">1K+</div>
            <div className="text-light-muted">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-light-text mb-2">4.8★</div>
            <div className="text-light-muted">Average Rating</div>
          </div>
        </motion.div>      </div>
    </section>
  );
}
