'use client';

import Link from 'next/link';

export default function SimpleHeader() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Aroma
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-light-text hover:text-primary-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-light-text hover:text-primary-600 transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              href="/categories" 
              className="text-light-text hover:text-primary-600 transition-colors font-medium"
            >
              Categories
            </Link>
            <Link 
              href="/about" 
              className="text-light-text hover:text-primary-600 transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search icon */}
            <button className="p-2 text-light-text hover:text-primary-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart icon */}
            <button className="p-2 text-light-text hover:text-primary-600 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Login button */}
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-light-text hover:text-primary-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}