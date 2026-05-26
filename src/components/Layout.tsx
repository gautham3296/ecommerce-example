/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isCartOpen, setIsCartOpen, itemCount } = useCart();
  
  return (
    <div className="min-h-screen flex flex-col bg-surface overflow-x-clip">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* Slide-over cart drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Floating Action Button (FAB) for Cart - pops up when item is added and cart is closed */}
      <AnimatePresence>
        {itemCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ scale: 0, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0, y: 50, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center border border-white/10 cursor-pointer group hover:bg-primary/95 transition-all focus:outline-hidden md:bottom-8 md:right-8"
            title="View Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6 group-hover:animate-bounce" />
              <span className="absolute -top-3.5 -right-3.5 bg-primary-container text-primary font-black text-[10px] w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-surface shadow-xs">
                {itemCount}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
