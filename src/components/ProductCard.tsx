/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  key?: string;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white border border-outline-variant/30 rounded-2xl p-4 flex flex-col hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden rounded-xl aspect-square mb-4">
        <img 
          src={product.heroImage} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {product.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-surface/90 backdrop-blur-sm rounded-full text-[9px] font-bold uppercase tracking-wider text-primary">
              {tag}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-lg leading-tight hover:text-primary transition-colors">{product.name}</h3>
          </Link>
          <span className="font-serif font-bold text-primary">{formatCurrency(product.price)}</span>
        </div>
        <p className="text-on-surface-variant text-xs mb-4 line-clamp-2">{product.shortDescription}</p>
      </div>

      <button 
        onClick={() => addToCart(product)}
        className="w-full py-3 bg-primary-container text-on-primary-container rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-on-primary transition-all active:scale-95"
      >
        <Plus size={14} />
        Add to Cart
      </button>
    </motion.div>
  );
}
