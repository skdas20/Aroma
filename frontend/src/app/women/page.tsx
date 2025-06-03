'use client';

import { useState, useEffect } from 'react';
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

export default function WomenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, sortBy]);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { category: 'Women' };
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
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-golden-50 to-nature-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-800 via-golden-700 to-nature-800 bg-clip-text text-transparent mb-4">
            Women's Collection
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Embrace your feminine essence with our curated selection of exquisite fragrances. From fresh florals to warm orientals.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-cream-50 to-golden-50 rounded-2xl p-6 mb-8 shadow-lg border-2 border-golden-200"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search women's fragrances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-golden-200 focus:border-golden-400 focus:outline-none bg-cream-50"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Filter className="text-primary-600 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-golden-200 focus:border-golden-400 focus:outline-none bg-cream-50"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-golden-500"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-cream-50 to-golden-50 rounded-2xl p-6 shadow-lg border-2 border-golden-200 group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Product Image */}                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <Image
                    src={product.image || `/perfume-${product.id}.jpg`}
                    alt={product.name}
                    width={300}
                    height={300}
                    unoptimized={product.image?.includes('bing.com')}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        target.style.display = 'none';
                        parent.innerHTML = `
                          <div class="w-full h-48 bg-gradient-to-br from-golden-300 to-golden-500 rounded-xl flex items-center justify-center">
                            <span class="text-4xl text-cream-50">🧴</span>
                          </div>
                        `;
                      }
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-400 to-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      SALE
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-primary-800 group-hover:text-golden-700 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-primary-600">{product.brand}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-golden-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-primary-500 ml-1">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-golden-700">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Notes Preview */}
                  <div className="text-xs text-primary-500">
                    <p className="truncate">
                      <span className="font-semibold">Top:</span> {product.notes.top.join(', ')}
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-golden-500 to-golden-600 text-cream-50 rounded-xl font-semibold shadow-md hover:from-golden-600 hover:to-golden-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {sortedProducts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-golden-200 to-golden-300 rounded-full mx-auto flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-golden-600" />
            </div>
            <h3 className="text-xl font-bold text-primary-800 mb-2">No products found</h3>
            <p className="text-primary-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
