/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Leaf, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="z-50 w-full sticky top-0 flex flex-col">
      {/* Promo Ticker Bar */}
      <div className="bg-primary text-white py-1.5 md:py-2 px-3 md:px-4 text-center text-[10px] md:text-xs font-sans tracking-wide overflow-hidden whitespace-nowrap relative">
        {/* Mobile Marquee container (visible on small screens) */}
        <div className="md:hidden flex overflow-hidden">
          <div className="animate-marquee-mobile flex gap-8 items-center pr-8 min-w-full">
            <span className="inline-flex items-center gap-1 font-semibold flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              🎉 20 Lakh + Happy Customers
            </span>
            <span className="text-white/40">•</span>
            <span className="font-sans text-white/95">FREE Gift On Orders Above ₹499</span>
            <span className="text-white/40">•</span>
            <span className="font-semibold text-primary-container">100% Caffeine-Free Botanical Infusions</span>
            <span className="text-white/40">•</span>
            
            {/* Duplicate for seamless looping */}
            <span className="inline-flex items-center gap-1 font-semibold flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              🎉 20 Lakh + Happy Customers
            </span>
            <span className="text-white/40">•</span>
            <span className="font-sans text-white/95">FREE Gift On Orders Above ₹499</span>
            <span className="text-white/40">•</span>
            <span className="font-semibold text-primary-container">100% Caffeine-Free Botanical Infusions</span>
            <span className="text-white/40">•</span>
          </div>
        </div>

        {/* Desktop Ticker container (centered and spacious) */}
        <div className="hidden md:flex justify-center items-center gap-6">
          <span className="inline-flex items-center gap-1 font-semibold flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            🎉 20 Lakh + Happy Customers
          </span>
          <span className="text-white/40">•</span>
          <span className="font-sans text-white/95 text-xs">FREE Gift On Orders Above ₹499</span>
          <span className="text-white/40">•</span>
          <span className="font-semibold text-primary-container">100% Caffeine-Free Botanical Infusions</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-surface/95 backdrop-blur-md h-14 md:h-16 shadow-md border-b border-outline-variant/20' 
            : 'bg-surface h-16 md:h-20 border-b border-outline-variant/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-16 h-full flex justify-between items-center">
          
          {/* Left: Mobile Toggle & Logo */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 md:hidden hover:bg-primary-container/20 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
            </button>
            <Link to="/" className="flex items-center gap-1 md:gap-2 group">
              <Leaf className="text-primary w-5 h-5 md:w-7 md:h-7 group-hover:rotate-12 transition-transform" />
              <span className="font-serif text-base sm:text-lg md:text-2xl text-primary tracking-tight font-bold">Organic Ecommerce</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link to="/" className="font-sans text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Home</Link>
            <Link to="/products" className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Our Blends</Link>
            <a href="#categories" className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Categories</a>
            <a href="#story" className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Our Story</a>
            <Link to="/orders" className="font-sans text-xs font-bold text-white bg-primary hover:bg-primary/95 px-3 py-1.5 rounded-full uppercase tracking-wider transition-colors">
              My Orders
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 md:gap-4">
            <Link to="/products" className="p-1.5 hover:bg-primary-container/20 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5 text-on-surface-variant" />
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 pt-2 hover:bg-primary-container/20 rounded-full transition-colors relative group"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-surface shadow-xs"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark sheet background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 top-[96px] md:hidden"
            />
            {/* Drawer menu body */}
            <motion.div 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-[96px] bg-surface border-b border-outline-variant shadow-lg z-50 md:hidden p-5 space-y-3.5 flex flex-col"
            >
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-base text-primary font-bold py-1.5 border-b border-outline-variant/15"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary py-1.5 border-b border-outline-variant/15"
              >
                All Botanical Blends
              </Link>
              <a 
                href="#categories" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary py-1.5 border-b border-outline-variant/15"
              >
                Categories
              </a>
              <a 
                href="#story" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary py-1.5 border-b border-outline-variant/15"
              >
                Our Story
              </a>
              <Link 
                to="/orders" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-serif text-sm font-bold text-primary py-1.5"
              >
                My Orders
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

