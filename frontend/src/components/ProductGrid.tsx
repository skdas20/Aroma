'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';

interface Perfume {
  _id: string;
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription?: string;
  fragrance: {
    family: string;
    topNotes: string[];
    middleNotes: string[];
    baseNotes: string[];
  };
  size: string;
  intensity: string;
  longevity: string;
  sillage: string;
  rating: number;
  reviews: number;
  image: string;
  isActive: boolean;
  stock: number;
}

const ProductGrid = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Fragrances', icon: '🌸' },
    { id: 'men', name: 'Men', icon: '👨' },
    { id: 'women', name: 'Women', icon: '👩' },
    { id: 'unisex', name: 'Unisex', icon: '⚡' },
  ];
  useEffect(() => {
    const fetchPerfumes = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setPerfumes(data.products || []);
        } else {
          console.error('Failed to fetch products');
          // Fallback to empty array
          setPerfumes([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setPerfumes([]);      } finally {
        setLoading(false);
      }
    };

    fetchPerfumes();
  }, []);  const ProductCard = ({ perfume, index }: { perfume: Perfume; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-light-surface rounded-2xl shadow-lg hover:shadow-xl border border-primary-200 transition-all duration-300 overflow-hidden group"
    >
      {/* Product Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary-100 via-secondary-100 to-accent-mint/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">          {/* Perfume bottle placeholder */}
          <div className="w-20 h-32 bg-gradient-to-b from-primary-200 via-secondary-200 to-accent-mint/50 rounded-lg relative transform group-hover:scale-110 transition-transform duration-300">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-primary-400 to-primary-600 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-primary-500 via-secondary-400 to-transparent opacity-70 rounded-b-lg"></div>
            <div className="absolute top-4 left-2 w-2 h-8 bg-white/40 rounded-full"></div>
          </div>
        </div>
        
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-light-surface/95 text-sm font-medium text-light-text rounded-full capitalize border border-primary-200">
            {perfume.category}
          </span>
        </div>

        {/* Wishlist button */}
        <button className="absolute top-4 right-4 p-2 bg-light-surface/95 rounded-full hover:bg-light-surface transition-colors border border-primary-200">
          <Heart className="w-4 h-4 text-light-muted hover:text-error-primary" />
        </button>{/* Discount badge */}
        {perfume.originalPrice && perfume.originalPrice > perfume.price && (
          <div className="absolute bottom-4 right-4">
            <span className="px-2 py-1 bg-error-primary text-white text-xs font-bold rounded">
              {Math.round((1 - perfume.price / perfume.originalPrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      <div className="p-6">        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(perfume.rating)
                  ? 'text-secondary-500 fill-current'
                  : 'text-light-muted'
              }`}
            />
          ))}
          <span className="text-sm text-light-muted ml-2">
            {perfume.rating} ({perfume.reviews} reviews)
          </span>
        </div>

        {/* Product name */}
        <h3 className="text-xl font-bold text-light-text mb-2 group-hover:text-primary-500 transition-colors">
          {perfume.name}
        </h3>

        {/* Description */}
        <p className="text-light-muted text-sm mb-4 line-clamp-2">
          {perfume.description}
        </p>        {/* Notes preview */}
        <div className="mb-4">
          <p className="text-xs text-light-muted mb-1">Top Notes:</p>
          <div className="flex flex-wrap gap-1">
            {perfume.fragrance.topNotes.slice(0, 3).map((note: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-primary-100 text-xs text-primary-600 rounded border border-primary-200">
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Price and actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-light-text">${perfume.price}</span>
            {perfume.originalPrice && perfume.originalPrice > perfume.price && (
              <span className="text-sm text-light-muted line-through ml-2">
                ${perfume.originalPrice}
              </span>
            )}
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >        <h2 className="text-4xl sm:text-5xl font-bold text-light-text mb-4">
          Our <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Collection</span>
        </h2>
        <p className="text-xl text-light-muted max-w-2xl mx-auto">
          Discover luxury perfumes crafted to perfection. Each fragrance tells a unique story.
        </p>
      </motion.div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-light-surface text-light-text hover:bg-primary-100 shadow-md border border-primary-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>      {/* Products grid */}
      {loading ? (        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-light-surface rounded-2xl shadow-lg h-96 animate-pulse border border-primary-200">
              <div className="h-64 bg-primary-100 rounded-t-2xl"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-primary-200 rounded w-3/4"></div>
                <div className="h-4 bg-primary-200 rounded w-1/2"></div>
                <div className="h-8 bg-primary-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {perfumes.map((perfume, index) => (
            <ProductCard key={perfume.id} perfume={perfume} index={index} />
          ))}
        </div>
      )}

      {/* View all button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-12"
      >        <button className="px-8 py-4 border-2 border-primary-500 text-light-text font-semibold rounded-full hover:border-secondary-500 hover:text-secondary-500 transform hover:scale-105 transition-all duration-200">
          View All Products
        </button>
      </motion.div>
    </section>
  );
};

export default ProductGrid;
