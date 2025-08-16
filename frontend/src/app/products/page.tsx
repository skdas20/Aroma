'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from "next/image";
import { Search, Filter, ShoppingBag, Star, Plus, Minus, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { api, CartItem } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  sex: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  size: string;
  stock: number;
  rating: number;
  reviews: number;
}

// Component that uses useSearchParams
function ProductsWithSearchParams() {  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [successTimeout, setSuccessTimeout] = useState<NodeJS.Timeout | null>(null);
  const [cartOperationInProgress, setCartOperationInProgress] = useState<number | null>(null);
  const { addToCart, updateQuantity, removeItem, cart, isLoading: cartLoading } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle URL search parameters
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    const urlSex = searchParams.get('sex');
    
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    if (urlSex) {
      setSelectedCategory(urlSex);
    } else if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeouts
      if (successTimeout) {
        clearTimeout(successTimeout);
      }
    };
  }, [successTimeout]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory !== 'All') params.sex = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sort = sortBy;
      
      console.log('Fetching products with params:', params);
      
      const data = await api.getProducts(params);
      if (data && data.success) {
        setProducts(data.products);
        console.log('Products fetched:', data.products.length);
      } else {
        setProducts([]); // Clear products on failure to render blank state
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Clear products on failure to render blank state
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      setCartOperationInProgress(product.id);
      await addToCart(product.id, 1);
      // Show success message
      showSuccessMessageWithTimeout(`${product.name} added to cart!`);
      // Don't redirect - let user stay on products page
      // router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setCartOperationInProgress(null);
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    try {
      setCartOperationInProgress(productId);
      const cartItem = cart?.items.find(item => item.id === productId);
      if (cartItem) {
        if (cartItem.quantity === 1) {
          await removeItem(cartItem.cartItemId);
          showSuccessMessageWithTimeout(`${cartItem.name} removed from cart!`);
        } else {
          await updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
          showSuccessMessageWithTimeout(`Quantity updated!`);
        }
        // Don't redirect - let user stay on products page
        // router.push('/cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setCartOperationInProgress(null);
    }
  };

  const getCartQuantity = (productId: number) => {
    const cartItem = cart?.items.find(item => item.id === productId);
    return cartItem?.quantity || 0;
  };

  const showSuccessMessageWithTimeout = (message: string) => {
    // Clear any existing timeout
    if (successTimeout) {
      clearTimeout(successTimeout);
    }
    setShowSuccessMessage(message);
    const newTimeout = setTimeout(() => setShowSuccessMessage(null), 3000);
    setSuccessTimeout(newTimeout);
  };

  const categories = ['All', 'For Him', 'For Her', 'Unisex'];

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          {showSuccessMessage}
        </motion.div>
      )}
      
      {/* Products Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-nature-50 to-golden-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-800 via-golden-700 to-nature-800 bg-clip-text text-transparent mb-4">
              Discover Our Collection
            </h1>
            <p className="text-xl text-primary-700 max-w-2xl mx-auto">
              Explore our carefully curated selection of luxury fragrances from around the world
            </p>
          </motion.div>

          {/* Filters */}
          <div className="bg-gradient-to-r from-golden-50 to-sky-50 rounded-2xl p-6 shadow-xl border-2 border-golden-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Search */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-600" />
                  <input
                    type="text"
                    placeholder="Search fragrances..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-cream-50 border-2 border-golden-200 rounded-lg focus:border-golden-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-700">Filter by Target Audience</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-cream-50 border-2 border-golden-200 rounded-lg focus:border-golden-400 focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-primary-700">Sort Products</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-cream-50 border-2 border-golden-200 rounded-lg focus:border-golden-400 focus:outline-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            {/* Cart Summary */}
            {cart && cart.summary.itemCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gradient-to-r from-primary-50 to-golden-50 rounded-lg border border-primary-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-5 h-5 text-primary-600" />
                    <span className="text-primary-700 font-medium">
                      Cart: {cart.summary.itemCount} items
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-primary-600">Total:</div>
                    <div className="text-lg font-bold text-primary-800">₹{cart.summary.total}</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/cart')}
                    className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all"
                  >
                    View Cart
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-golden-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={`${product.id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-cream-50 rounded-2xl shadow-xl overflow-hidden border border-golden-100 hover:shadow-2xl transition-all hover:-translate-y-1"
                >
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-sky-100 to-nature-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>                    <div className="w-full h-full flex items-center justify-center p-4">
                      <Image
                        src={product.image || `/perfume-${product.id}.jpg`}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full rounded-lg"
                        unoptimized={product.image?.includes('bing.com')}
                        onError={(e) => {
                          // Fallback to emoji if image doesn't exist
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            target.style.display = 'none';
                            parent.innerHTML = `
                              <div class="w-32 h-32 bg-gradient-to-br from-golden-300 to-golden-500 rounded-full flex items-center justify-center mx-auto">
                                <span class="text-cream-50 font-bold text-2xl">🧴</span>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-cream-50/90 rounded-full flex items-center justify-center shadow-lg hover:bg-cream-50 transition-colors">
                      <Heart className="w-5 h-5 text-primary-600 hover:text-red-500 transition-colors" />
                    </button>
                    {/* Discount Badge */}
                    {product.originalPrice > product.price && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-cream-50 px-3 py-1 rounded-full text-sm font-bold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-sm text-primary-600 font-medium">{product.brand}</span>
                    </div>
                    <h3 className="text-lg font-bold text-primary-800 mb-2 group-hover:text-golden-700 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Gender Badge */}
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        product.sex === 'For Him' 
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : product.sex === 'For Her'
                          ? 'bg-pink-100 text-pink-700 border border-pink-200'
                          : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        {product.sex}
                      </span>
                    </div>
                    
                    <p className="text-sm text-primary-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-golden-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-primary-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Size */}
                    <div className="mb-3">
                      <span className="text-sm text-primary-600">Size: {product.size}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-golden-700">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 10 
                          ? 'bg-nature-100 text-nature-700' 
                          : product.stock > 0 
                          ? 'bg-golden-100 text-golden-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                    </div>                    {/* Cart Controls */}
                    <div className="space-y-3">
                      {product.stock > 0 && (
                        <div className="flex items-center justify-center space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveFromCart(product.id)}
                            disabled={getCartQuantity(product.id) === 0 || cartOperationInProgress === product.id}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-red-200 to-red-300 flex items-center justify-center hover:from-red-300 hover:to-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove from cart"
                          >
                            {cartOperationInProgress === product.id ? (
                              <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Minus className="w-4 h-4 text-red-700" />
                            )}
                          </motion.button>
                          
                          <div className="flex flex-col items-center min-w-[60px]">
                            <span className="text-lg font-bold text-primary-800">
                              {getCartQuantity(product.id)}
                            </span>
                            <span className="text-xs text-golden-600">
                              in cart
                            </span>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAddToCart(product)}
                            disabled={getCartQuantity(product.id) >= product.stock || cartOperationInProgress === product.id}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-golden-200 to-golden-300 flex items-center justify-center hover:from-golden-300 hover:to-golden-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Add to cart"
                          >
                            {cartOperationInProgress === product.id ? (
                              <div className="w-4 h-4 border-2 border-golden-700 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Plus className="w-4 h-4 text-golden-700" />
                            )}
                          </motion.button>
                        </div>
                      )}

                      {/* Quick Add Button (for when cart is empty or out of stock) */}
                      {product.stock > 0 && getCartQuantity(product.id) === 0 ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(product)}
                          disabled={cartOperationInProgress === product.id}
                          className="w-full py-3 bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cartOperationInProgress === product.id ? (
                            <div className="w-5 h-5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <ShoppingBag className="w-5 h-5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </motion.button>
                      ) : product.stock === 0 ? (
                        <button
                          disabled
                          className="w-full py-3 bg-gray-300 text-gray-500 cursor-not-allowed rounded-lg font-semibold flex items-center justify-center space-x-2"
                        >
                          <ShoppingBag className="w-5 h-5" />
                          <span>Out of Stock</span>
                        </button>
                      ) : getCartQuantity(product.id) > 0 ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push('/cart')}
                          className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-cream-50 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                        >
                          <ShoppingBag className="w-5 h-5" />
                          <span>View Cart ({getCartQuantity(product.id)} items)</span>
                        </motion.button>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>      <Footer />
    </div>
  );
}

// Main export with Suspense wrapper
export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsWithSearchParams />
    </Suspense>
  );
}