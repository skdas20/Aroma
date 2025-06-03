'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const [localLoading, setLocalLoading] = useState(false);

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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-golden-50 to-nature-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-golden-200"
          >
            <ShoppingBag className="w-24 h-24 mx-auto text-golden-400 mb-6" />
            <h1 className="text-3xl font-bold text-primary-800 mb-4">Your Cart is Empty</h1>
            <p className="text-primary-600 mb-8">Discover our exquisite fragrances and add some luxury to your cart!</p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-golden-500 to-golden-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Shop Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-golden-50 to-nature-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 text-primary-700 hover:text-golden-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Continue Shopping</span>
              </motion.button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-golden-600 to-nature-600 bg-clip-text text-transparent">
            Shopping Cart ({cart.summary.itemCount} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-golden-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-center space-x-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-golden-100 to-nature-100 flex items-center justify-center">
                    <Image
                      src={`/perfume-${(index % 6) + 1}.jpg`}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Fallback to placeholder if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-golden-200 to-nature-200 flex items-center justify-center">
                            <span class="text-golden-700 text-2xl">🧴</span>
                          </div>
                        `;
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-primary-800 mb-1">{item.name}</h3>
                    <p className="text-primary-600 text-sm mb-2">{item.brand} • {item.size}</p>
                    <p className="text-2xl font-bold text-golden-600">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={localLoading || item.quantity <= 1}
                      className="w-8 h-8 rounded-full bg-golden-100 hover:bg-golden-200 flex items-center justify-center text-golden-700 disabled:opacity-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    
                    <span className="text-lg font-semibold text-primary-800 min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={localLoading}
                      className="w-8 h-8 rounded-full bg-golden-100 hover:bg-golden-200 flex items-center justify-center text-golden-700 disabled:opacity-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={localLoading}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}

            {/* Clear Cart Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={clearCart}
                disabled={localLoading}
                className="px-6 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all font-medium disabled:opacity-50"
              >
                Clear Cart
              </motion.button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-golden-200 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-primary-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-primary-700">
                  <span>Subtotal</span>
                  <span>${cart.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary-700">
                  <span>Shipping</span>
                  <span>{cart.summary.shipping === 0 ? 'Free' : `$${cart.summary.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-primary-700">
                  <span>Tax</span>
                  <span>${cart.summary.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-golden-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-primary-800">
                    <span>Total</span>
                    <span>${cart.summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {cart.summary.subtotal < 50 && (
                <div className="bg-golden-50 border border-golden-200 rounded-lg p-3 mb-6">
                  <p className="text-sm text-golden-700">
                    Add ${(50 - cart.summary.subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}

              <Link href="/checkout">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-golden-500 to-golden-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Proceed to Checkout
                </motion.button>
              </Link>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <p className="text-xs text-primary-500">🔒 Secure checkout with SSL encryption</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CartPage;
