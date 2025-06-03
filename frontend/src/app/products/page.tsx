'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from "next/image";
import { Search, Filter, ShoppingBag, Star, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { api, CartItem } from '@/lib/api';

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
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
function ProductsWithSearchParams() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart, cart } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle URL search parameters
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]);const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      if (sortBy) params.sort = sortBy;
      
      const data = await api.getProducts(params);
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      // You can add a toast notification here
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const categories = ['All', 'Men', 'Women', 'Unisex'];

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Header />
      
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
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

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 border-2 border-golden-200 rounded-lg focus:border-golden-400 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Sort */}
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
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-gradient-to-br from-cream-50 to-golden-50 rounded-2xl shadow-xl overflow-hidden border-2 border-golden-200 hover:border-golden-400 transition-all group"
                >                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-sky-100 to-nature-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-full h-full flex items-center justify-center p-4">                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full rounded-lg"onError={(e) => {
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
                        <span className="text-2xl font-bold text-golden-700">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.originalPrice}
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
                    </div>                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                        product.stock > 0
                          ? 'bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 hover:from-golden-600 hover:to-golden-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5" />                      <span>
                        {(() => {
                          const cartItem = cart?.items.find((item: CartItem) => item.id === product.id);
                          return cartItem && cartItem.quantity > 0 
                            ? `In Cart (${cartItem.quantity})`
                            : product.stock > 0 
                            ? 'Add to Cart' 
                            : 'Out of Stock';
                        })()}
                      </span>
                    </button>
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