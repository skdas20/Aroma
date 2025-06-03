'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type Molecule = { x: number; y: number; duration: number };
const MOLECULE_COUNT = 20;

const getRandomMolecules = (): Molecule[] => {
  if (typeof window === 'undefined') return [];
  return Array.from({ length: MOLECULE_COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    duration: Math.random() * 15 + 10,
  }));
};

const LoadingAnimation = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const logoFrames = ['a.png', 'b.png', 'c.png', 'd.png', 'e.png', 'f.png'];

  useEffect(() => {
    setMolecules(getRandomMolecules());
    
    // Animate through logo frames in sequence: a -> b -> c -> d -> e -> f -> repeat
    const frameInterval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentFrame((prev) => (prev + 1) % logoFrames.length);
        setIsTransitioning(false);
      }, 600); // Half of the transition time
    }, 1200); // Change frame every 1.2 seconds for smooth animation
    
    return () => clearInterval(frameInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-nature-50 to-golden-50 flex items-center justify-center relative overflow-hidden">
      {/* Floating perfume molecules */}
      <div className="absolute inset-0">
        {molecules.map((mol, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-golden-400 to-nature-400 shadow-lg"
            initial={{ x: mol.x, y: mol.y, scale: 0 }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 0),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 0),
              scale: [0, 1, 0.5, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: mol.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)'
            }}
          />
        ))}
      </div>

      {/* Shiny Golden-Green Bubbles Background */}
      <div className="absolute inset-0 opacity-30">
        {/* Large Golden Bubbles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-golden-300 via-golden-400 to-golden-500 rounded-full blur-3xl animate-float shadow-2xl" style={{ boxShadow: '0 0 60px rgba(255, 215, 0, 0.6)' }}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-nature-300 via-nature-400 to-golden-400 rounded-full blur-2xl animate-float shadow-2xl" style={{ animationDelay: '2s', boxShadow: '0 0 40px rgba(34, 197, 94, 0.5)' }}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-golden-400 via-nature-300 to-sky-400 rounded-full blur-2xl animate-float shadow-xl" style={{ animationDelay: '4s', boxShadow: '0 0 30px rgba(255, 193, 7, 0.7)' }}></div>
        
        {/* Medium Shiny Bubbles */}
        <div className="absolute top-60 right-1/3 w-16 h-16 bg-gradient-to-br from-golden-200 via-nature-200 to-golden-300 rounded-full blur-xl animate-float shadow-lg" style={{ animationDelay: '1s', boxShadow: '0 0 25px rgba(255, 235, 59, 0.6)' }}></div>
        <div className="absolute bottom-60 right-10 w-14 h-14 bg-gradient-to-br from-nature-400 via-golden-300 to-nature-500 rounded-full blur-xl animate-float shadow-lg" style={{ animationDelay: '3s', boxShadow: '0 0 20px rgba(76, 175, 80, 0.5)' }}></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-br from-golden-300 via-sunshine-300 to-golden-400 rounded-full blur-lg animate-float shadow-md" style={{ animationDelay: '5s', boxShadow: '0 0 18px rgba(255, 214, 0, 0.8)' }}></div>
      </div>

      {/* Main loading container */}
      <div className="text-center z-10">
        {/* Logo Animation using your images */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8"
        >          <div className="w-32 h-32 mx-auto relative">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full relative rounded-full shadow-2xl overflow-hidden border-4 border-golden-400 animate-glow"
            >              {/* Current Image with smooth transition */}
              <motion.div
                key={currentFrame}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0,
                  scale: 1.2
                }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut"
                }}
                className="absolute inset-0"
              >
                <Image
                  src={`/${logoFrames[currentFrame]}`}
                  alt="Amaraa Luxury Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-6"
        >          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-golden-600 via-nature-600 to-sky-600 bg-clip-text text-transparent mb-2">
            Amaraa Luxury
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-lg md:text-xl text-primary-700 font-light tracking-wide"
          >
            Exquisite Fragrances Collection
          </motion.p>
        </motion.div>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex justify-center space-x-2 mb-6"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                backgroundColor: ['#22c55e', '#facc15', '#84cc16', '#22c55e'], // primary-500, golden-400, nature-500
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-primary-500 shadow-lg"
            />
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 2.5, duration: 2 }}
          className="max-w-md mx-auto"
        >
          <div className="h-2 bg-cream-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-golden-500 via-nature-500 to-sky-500 rounded-full shadow-lg"
            />
          </div>
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mt-4 text-primary-600 text-sm tracking-wide font-medium"
        >
          Crafting your luxury experience...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingAnimation;
