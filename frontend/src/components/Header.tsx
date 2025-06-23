'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const router = useRouter();
  const { cartItemCount } = useCart();
  const { user, openLoginModal, logout } = useAuth();
  
  const cartCount = cartItemCount;

  const navigation = [
    { name: 'Home', href: '/' },
    { 
      name: 'Products', 
      href: '/products', 
      hasDropdown: true,
      dropdownItems: [
        { name: 'Fragrances', href: '/products', available: true },
        { name: 'Bags', href: '#', available: false },
        { name: 'Glasses', href: '#', available: false },
        { name: 'Clothing', href: '#', available: false },
        { name: 'Shoes', href: '#', available: false },
        { name: 'Accessories', href: '#', available: false },
      ]
    },
    { name: 'Men', href: '/men' },
    { name: 'Women', href: '/women' },
    { name: 'Unisex', href: '/products?category=Unisex' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-sky-100/95 via-golden-50/95 to-nature-100/95 backdrop-blur-md shadow-xl border-b-2 border-golden-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo.jpg"
                alt="Aroma Perfume Logo"
                width={40}
                height={40}
                className="rounded-full shadow-lg border-3 border-golden-400 animate-glow"
              />              <span className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-golden-600 bg-clip-text text-transparent">
                AMARAA LUXURY
              </span>
            </Link>
          </motion.div>          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {item.hasDropdown ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsProductsDropdownOpen(true)}
                    onMouseLeave={() => setIsProductsDropdownOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className="text-primary-800 hover:text-golden-600 transition-colors font-semibold hover:scale-105 transform flex items-center space-x-1"
                    >
                      <span>{item.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {isProductsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-golden-200 z-50"
                      >
                        {item.dropdownItems?.map((dropdownItem, idx) => (
                          <div key={dropdownItem.name}>
                            {dropdownItem.available ? (
                              <Link
                                href={dropdownItem.href}
                                className="block px-4 py-3 text-primary-700 hover:text-golden-600 hover:bg-golden-50 transition-all font-medium"
                              >
                                {dropdownItem.name}
                              </Link>
                            ) : (
                              <div className="block px-4 py-3 text-gray-400 cursor-not-allowed relative">
                                <span>{dropdownItem.name}</span>
                                <span className="text-xs text-golden-600 ml-2 font-semibold">Coming Soon</span>
                              </div>
                            )}
                            {idx < item.dropdownItems.length - 1 && (
                              <div className="border-t border-golden-100"></div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-primary-800 hover:text-golden-600 transition-colors font-semibold hover:scale-105 transform"
                  >
                    {item.name}
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>{/* Desktop Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-4"
          >
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search luxury items..."
                    className="w-64 px-4 py-2 pl-10 pr-4 border border-golden-300 rounded-full focus:outline-none focus:ring-2 focus:ring-golden-400 focus:border-transparent bg-white/90 backdrop-blur-sm"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-golden-100 transition-colors"
                >
                  <Search className="w-5 h-5 text-primary-700 hover:text-golden-600 transition-all hover:scale-110" />
                </button>
              )}
            </div>
            
            {/* User Profile / Login */}
            {user ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-golden-400"
                    />
                  ) : (
                    <User className="w-5 h-5 text-primary-700 hover:text-golden-600 transition-all hover:scale-110" />
                  )}
                  <span className="text-sm text-primary-700 font-medium">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </div>                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/orders"
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-golden-50 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center space-x-1 text-primary-700 hover:text-golden-600 transition-all hover:scale-110"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}

            <Link href="/cart" className="relative">
              <ShoppingBag className="w-5 h-5 text-primary-700 hover:text-golden-600 cursor-pointer transition-all hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-golden-400 to-golden-500 text-cream-50 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary-700 hover:text-golden-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-golden-200"
          >            <div className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <Link
                        href={item.href}
                        className="text-primary-700 hover:text-golden-600 transition-colors font-medium px-2 py-1 flex items-center justify-between"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      <div className="ml-4 mt-2 space-y-1">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <div key={dropdownItem.name}>
                            {dropdownItem.available ? (
                              <Link
                                href={dropdownItem.href}
                                className="block text-primary-600 hover:text-golden-600 transition-colors font-normal px-2 py-1 text-sm"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {dropdownItem.name}
                              </Link>
                            ) : (
                              <div className="block text-gray-400 px-2 py-1 text-sm cursor-not-allowed">
                                <span>{dropdownItem.name}</span>
                                <span className="text-xs text-golden-600 ml-2 font-semibold">Coming Soon</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-primary-700 hover:text-golden-600 transition-colors font-medium px-2 py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}<div className="flex items-center justify-between px-2 py-2 border-t border-golden-200 mt-3 pt-3">
                <div className="flex items-center space-x-4">
                  {/* Mobile Search */}
                  <div className="relative">
                    {isSearchOpen ? (
                      <form onSubmit={handleSearch} className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search..."
                          className="w-48 px-3 py-1 pl-8 pr-8 border border-golden-300 rounded-full focus:outline-none focus:ring-2 focus:ring-golden-400 text-sm bg-white/90"
                          autoFocus
                        />
                        <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                        <button
                          type="button"
                          onClick={() => setIsSearchOpen(false)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-1"
                      >
                        <Search className="w-5 h-5 text-primary-700" />
                      </button>
                    )}
                  </div>
                  <Link href="/cart" className="relative">
                    <ShoppingBag className="w-5 h-5 text-primary-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-golden-400 to-golden-500 text-cream-50 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                
                {/* Mobile Auth */}
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="Profile"
                          width={24}
                          height={24}
                          className="rounded-full border border-golden-400"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary-700" />
                      )}
                      <span className="text-sm text-primary-700 font-medium">
                        {user.displayName?.split(' ')[0]}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="flex items-center space-x-1 text-primary-700 hover:text-golden-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-sm">Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}