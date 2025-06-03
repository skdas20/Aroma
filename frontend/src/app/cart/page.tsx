'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const [localLoading, setLocalLoading] = useState(false);
  const router = useRouter();

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLocalLoading(true);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    setLocalLoading(true);
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-golden-50 to-nature-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-golden-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-golden-50 to-nature-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link
              href="/products"
              className="flex items-center text-primary-600 hover:text-primary-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-primary-800">Your Cart</h1>
        </motion.div>

        {!cart || cart.items.length === 0 ? (
          /* Empty Cart */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-golden-200 to-golden-300 rounded-full mx-auto flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-golden-600" />
            </div>
            <h2 className="text-2xl font-bold text-primary-800 mb-4">Your cart is empty</h2>
            <p className="text-primary-600 mb-8">Discover our amazing collection of luxury fragrances</p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 rounded-2xl font-semibold shadow-lg hover:from-golden-600 hover:to-golden-700 transition-all transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-cream-50 to-golden-50 rounded-2xl p-6 shadow-lg border-2 border-golden-200"
                >
                  <div className="flex items-center space-x-6">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-golden-300 to-golden-500 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <Image
                        src={`/perfume-${(item.id % 6) + 1}.jpg`}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-2xl text-cream-50">🧴</span>';
                          }
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-primary-800">{item.name}</h3>
                      <p className="text-sm text-primary-600">{item.brand}</p>
                      <p className="text-sm text-primary-500 mt-1">Size: {item.size}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-xl font-bold text-golden-700">${item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={localLoading || item.quantity <= 1}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-golden-200 to-golden-300 flex items-center justify-center hover:from-golden-300 hover:to-golden-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4 text-golden-700" />
                      </button>
                      <span className="w-8 text-center font-semibold text-primary-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={localLoading}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-golden-200 to-golden-300 flex items-center justify-center hover:from-golden-300 hover:to-golden-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 text-golden-700" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={localLoading}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={clearCart}
                disabled={localLoading}
                className="w-full mt-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Cart
              </motion.button>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-cream-50 to-golden-50 rounded-2xl p-6 shadow-lg border-2 border-golden-200 h-fit"
            >
              <h2 className="text-xl font-bold text-primary-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-primary-600">
                    Subtotal ({cart.summary?.itemCount || cart.items.length} items)
                  </span>
                  <span className="font-semibold text-primary-800">
                    ${(cart.summary?.subtotal || cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-primary-600">Shipping</span>
                  <span className="font-semibold text-primary-800">
                    {(cart.summary?.shipping || 0) === 0 ? 'Free' : `$${(cart.summary?.shipping || 0).toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-primary-600">Tax</span>
                  <span className="font-semibold text-primary-800">
                    ${(cart.summary?.tax || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="border-t border-golden-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-primary-800">Total</span>
                    <span className="text-lg font-bold text-golden-700">
                      ${(cart.summary?.total || cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={localLoading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 rounded-2xl font-semibold shadow-lg hover:from-golden-600 hover:to-golden-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </motion.button>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <p className="text-xs text-primary-500">🔒 Secure checkout with SSL encryption</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
