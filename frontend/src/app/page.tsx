'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, User, Star, Heart, Sparkles } from 'lucide-react';
import LoadingAnimation from '@/components/LoadingAnimation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import dynamic from 'next/dynamic';

// Dynamically import the 3D component to avoid SSR issues
const PerfumeBottle3D = dynamic(() => import('@/components/PerfumeBottle3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { cartItemCount } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Show loading for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-sky-50 via-nature-50 to-golden-50">
        {/* Shiny Golden-Green Bubbles Background */}
        <div className="absolute inset-0 opacity-40">
          {/* Large Golden Bubbles */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-golden-300 via-golden-400 to-golden-500 rounded-full blur-3xl animate-float shadow-2xl" style={{ boxShadow: '0 0 60px rgba(255, 215, 0, 0.6)' }}></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-nature-300 via-nature-400 to-golden-400 rounded-full blur-2xl animate-float shadow-2xl" style={{ animationDelay: '2s', boxShadow: '0 0 40px rgba(34, 197, 94, 0.5)' }}></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-golden-400 via-nature-300 to-sky-400 rounded-full blur-2xl animate-float shadow-xl" style={{ animationDelay: '4s', boxShadow: '0 0 30px rgba(255, 193, 7, 0.7)' }}></div>
          
          {/* Medium Shiny Bubbles */}
          <div className="absolute top-60 right-1/3 w-16 h-16 bg-gradient-to-br from-golden-200 via-nature-200 to-golden-300 rounded-full blur-xl animate-float shadow-lg" style={{ animationDelay: '1s', boxShadow: '0 0 25px rgba(255, 235, 59, 0.6)' }}></div>
          <div className="absolute bottom-60 right-10 w-14 h-14 bg-gradient-to-br from-nature-400 via-golden-300 to-nature-500 rounded-full blur-xl animate-float shadow-lg" style={{ animationDelay: '3s', boxShadow: '0 0 20px rgba(76, 175, 80, 0.5)' }}></div>
          <div className="absolute top-1/2 left-20 w-12 h-12 bg-gradient-to-br from-golden-300 via-sunshine-300 to-golden-400 rounded-full blur-lg animate-float shadow-md" style={{ animationDelay: '5s', boxShadow: '0 0 18px rgba(255, 214, 0, 0.8)' }}></div>
          
          {/* Small Sparkling Bubbles */}
          <div className="absolute top-32 left-1/3 w-8 h-8 bg-gradient-to-br from-golden-400 to-nature-400 rounded-full blur-md animate-float shadow-sm" style={{ animationDelay: '0.5s', boxShadow: '0 0 15px rgba(255, 193, 7, 0.9)' }}></div>
          <div className="absolute bottom-32 left-2/3 w-6 h-6 bg-gradient-to-br from-nature-300 to-golden-300 rounded-full blur-sm animate-float shadow-sm" style={{ animationDelay: '2.5s', boxShadow: '0 0 12px rgba(139, 195, 74, 0.7)' }}></div>
          <div className="absolute top-1/4 right-1/4 w-10 h-10 bg-gradient-to-br from-sunshine-300 via-golden-300 to-nature-300 rounded-full blur-lg animate-float shadow-md" style={{ animationDelay: '1.5s', boxShadow: '0 0 16px rgba(255, 235, 59, 0.8)' }}></div>
          
          {/* Extra Tiny Sparkling Dots */}
          <div className="absolute top-16 right-16 w-4 h-4 bg-gradient-to-br from-golden-500 to-golden-600 rounded-full animate-float shadow-sm" style={{ animationDelay: '3.5s', boxShadow: '0 0 8px rgba(255, 193, 7, 1)' }}></div>
          <div className="absolute bottom-16 left-16 w-3 h-3 bg-gradient-to-br from-nature-500 to-nature-600 rounded-full animate-float shadow-sm" style={{ animationDelay: '4.5s', boxShadow: '0 0 6px rgba(76, 175, 80, 1)' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                {/* Spray particles that appear around the text */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gradient-to-br from-golden-400 to-nature-400 rounded-full opacity-60"
                    initial={{ 
                      opacity: 0, 
                      x: 0, 
                      y: 0, 
                      scale: 0 
                    }}
                    animate={{ 
                      opacity: [0, 0.8, 0.3, 0],
                      x: [0, (Math.random() - 0.5) * 100],
                      y: [0, (Math.random() - 0.5) * 80],
                      scale: [0, 1.5, 0.8, 0],
                    }}
                    transition={{ 
                      duration: 2.5,
                      delay: i * 0.3,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${30 + Math.random() * 40}%`,
                      boxShadow: '0 0 6px rgba(255, 215, 0, 0.7)'
                    }}
                  />
                ))}
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 relative z-10">
                  <span className="bg-gradient-to-r from-sky-600 via-primary-600 to-nature-600 bg-clip-text text-transparent">
                    Discover
                  </span>
                  <br />
                  <span className="text-primary-800">Your Perfect</span>
                  <br />
                  <span className="bg-gradient-to-r from-golden-500 via-sunshine-500 to-golden-600 bg-clip-text text-transparent">
                    Fragrance
                  </span>
                </h1>
              </div>
              <p className="text-xl text-primary-700 mb-8 leading-relaxed">
                Immerse yourself in our curated collection of luxury perfumes. 
                From fresh citrus notes to deep woody scents, find the fragrance that tells your story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-golden-500 via-golden-600 to-golden-700 text-cream-50 px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all animate-glow"
                >
                  Shop Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Trigger chatbot quiz
                    const event = new CustomEvent('openChatbotQuiz');
                    window.dispatchEvent(event);
                  }}
                  className="bg-gradient-to-r from-nature-100 to-nature-200 border-2 border-nature-400 text-nature-700 px-8 py-4 rounded-full font-semibold hover:from-nature-200 hover:to-nature-300 transition-all shadow-lg"
                >
                  Take Quiz
                </motion.button>
              </div>
            </motion.div>
            
            {/* Interactive 3D Perfume Bottle */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-golden-200/30 via-sky-200/30 to-nature-200/30 rounded-3xl blur-3xl"></div>
              <PerfumeBottle3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-nature-100/80 via-golden-50/80 to-sky-100/80">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-800 via-golden-700 to-nature-800 bg-clip-text text-transparent mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-primary-700">
              Explore our carefully curated fragrance collections
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'For Her', 
                desc: 'Elegant & Feminine', 
                color: 'from-pink-400 via-rose-500 to-purple-600', 
                bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
                icon: '🌸',
                pattern: 'radial-gradient(circle at 20% 80%, rgba(219, 39, 119, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
                href: '/women'
              },
              { 
                title: 'For Him', 
                desc: 'Bold & Sophisticated', 
                color: 'from-blue-500 via-indigo-600 to-gray-700', 
                bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                icon: '👔',
                pattern: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(75, 85, 99, 0.3) 0%, transparent 50%)',
                href: '/men'
              },
              { 
                title: 'Unisex', 
                desc: 'Balanced & Versatile', 
                color: 'from-emerald-400 via-teal-500 to-cyan-600', 
                bgColor: 'bg-gradient-to-br from-emerald-50 to-cyan-50',
                icon: '🌿',
                pattern: 'radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
                href: '/products?category=Unisex'
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`${category.bgColor} rounded-2xl shadow-xl overflow-hidden group cursor-pointer border-2 border-golden-200 hover:border-golden-400 transition-all`}
              >
                <div 
                  className={`h-48 bg-gradient-to-br ${category.color} relative overflow-hidden`}
                  style={{ backgroundImage: category.pattern }}
                >
                  {/* Decorative elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/20 blur-sm"></div>
                    <div className="absolute bottom-8 left-8 w-8 h-8 rounded-full bg-white/30"></div>
                    <div className="absolute top-12 left-12 w-4 h-4 rounded-full bg-white/40"></div>
                  </div>
                  
                  {/* Category icon */}
                  <div className="absolute top-6 left-6 text-4xl opacity-80 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  
                  {/* Perfume bottle silhouette */}
                  <div className="absolute top-1/2 right-8 transform -translate-y-1/2 opacity-30 group-hover:opacity-50 transition-opacity">
                    <svg width="40" height="60" viewBox="0 0 40 60" fill="none" className="text-white">
                      <path d="M15 8V4C15 2 16 1 18 1H22C24 1 25 2 25 4V8H28C29 8 30 9 30 10V50C30 55 26 59 21 59H19C14 59 10 55 10 50V10C10 9 11 8 12 8H15Z" 
                            fill="currentColor" fillOpacity="0.6"/>
                      <circle cx="20" cy="35" r="3" fill="currentColor" fillOpacity="0.8"/>
                    </svg>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent group-hover:from-black/40 transition-all"></div>
                  <div className="absolute bottom-4 left-4 text-cream-50">
                    <h3 className="text-2xl font-bold drop-shadow-lg">{category.title}</h3>
                    <p className="text-cream-100/90 drop-shadow-md">{category.desc}</p>
                  </div>
                </div>
                <div className="p-6">
                  <Link href={category.href}>
                    <button className="w-full bg-gradient-to-r from-golden-200 via-golden-300 to-golden-400 text-golden-800 py-3 rounded-lg font-semibold hover:from-golden-300 hover:to-golden-500 transition-all shadow-md hover:shadow-lg transform hover:scale-105">
                      Explore Collection
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-golden-100 via-sunshine-50 to-sky-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Curated Selection', desc: 'Hand-picked fragrances from world-renowned perfumers', color: 'from-sky-400 to-primary-500' },
              { icon: Star, title: 'Premium Quality', desc: 'Only the finest ingredients and authentic formulations', color: 'from-golden-400 to-sunshine-500' },
              { icon: Sparkles, title: 'Personal Consultation', desc: 'AI-powered recommendations for your perfect scent', color: 'from-nature-400 to-nature-500' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-gradient-to-br from-cream-50 to-golden-50 p-8 rounded-2xl shadow-xl border-2 border-golden-200 hover:border-golden-400 transition-all"
              >
                <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-cream-50" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">{feature.title}</h3>
                <p className="text-primary-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
