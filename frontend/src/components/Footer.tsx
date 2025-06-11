'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-800 via-slate-900 to-black text-white py-12 border-t-4 border-golden-400 relative z-10" style={{ backgroundColor: 'rgba(15, 23, 42, 0.98)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-golden-400 via-golden-500 to-golden-600 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-golden-300 to-golden-400 bg-clip-text text-transparent">
                AMARAA LUXURY
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Discover the essence of luxury with our premium collection of perfumes. 
              Each fragrance tells a unique story of elegance and sophistication.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-golden-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-golden-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-golden-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </motion.div>          {/* Shop Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4 text-golden-300 text-lg">Shop</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/products" className="hover:text-golden-300 transition-colors">All Products</Link></li>
              <li><Link href="/men" className="hover:text-golden-300 transition-colors">Men's Fragrances</Link></li>
              <li><Link href="/women" className="hover:text-golden-300 transition-colors">Women's Fragrances</Link></li>
              <li><Link href="/products?category=Unisex" className="hover:text-golden-300 transition-colors">Unisex Collection</Link></li>
              <li><Link href="/products?featured=true" className="hover:text-golden-300 transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?bestseller=true" className="hover:text-golden-300 transition-colors">Best Sellers</Link></li>
            </ul>
          </motion.div>
          
          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4 text-golden-300 text-lg">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/contact" className="hover:text-golden-300 transition-colors">Contact Us</Link></li>
              <li><Link href="/size-guide" className="hover:text-golden-300 transition-colors">Fragrance Guide</Link></li>
              <li><Link href="/shipping" className="hover:text-golden-300 transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-golden-300 transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-golden-300 transition-colors">FAQ</Link></li>
              <li><Link href="/track-order" className="hover:text-golden-300 transition-colors">Track Your Order</Link></li>
            </ul>
          </motion.div>
          
          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4 text-golden-300 text-lg">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about" className="hover:text-golden-300 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-golden-300 transition-colors">Careers</Link></li>
              <li><Link href="/newsletter" className="hover:text-golden-300 transition-colors">Newsletter</Link></li>
              <li><Link href="/blog" className="hover:text-golden-300 transition-colors">Blog</Link></li>
              <li><Link href="/press" className="hover:text-golden-300 transition-colors">Press</Link></li>
              <li><Link href="/privacy" className="hover:text-golden-300 transition-colors">Privacy Policy</Link></li>
            </ul>
          </motion.div>
        </div>
          {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-golden-400/30 mt-8 pt-8 text-center"
        >
          {/* Desktop Footer */}
          <p className="hidden md:flex items-center justify-center gap-2 text-white">
            © 2025 AMARAA LUXURY. Made with <Heart className="w-4 h-4 text-golden-400" /> by{' '}
            <span className="text-golden-300 font-semibold">Sumit Kumar Das</span>
          </p>
          
          {/* Mobile Footer */}
          <p className="md:hidden flex items-center justify-center gap-2 text-white">
            © 2025 AMARAA LUXURY. Created by{' '}
            <span className="text-golden-300 font-semibold">Sumit Kumar Das</span>
          </p>
          
          <p className="mt-2 text-sm text-gray-300">
            All rights reserved. Luxury fragrances for the discerning individual.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}