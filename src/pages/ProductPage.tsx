/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import { ShoppingCart, ArrowLeft, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart, setIsCartOpen } = useCart();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5">
        <h1 className="font-serif text-4xl mb-4">Botanical Not Found</h1>
        <p className="mb-8 opacity-60">This particular herb seems to be missing from our garden.</p>
        <Link to="/" className="text-primary border-b-2 border-primary pb-1 font-bold uppercase tracking-widest text-xs">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Back Button Desktop */}
      <div className="max-w-7xl mx-auto px-5 md:px-16 pt-8 hidden md:block">
        <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} />
          Back to Collection
        </Link>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-5 md:px-16 pt-8 md:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
        {/* Left: Images */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-3xl shadow-xl"
          >
            <img 
              src={product.heroImage} 
              alt={product.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {product.secondaryImage && (
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                <img src={product.secondaryImage} alt={`${product.name} lifestyle`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="bg-surface-container-high rounded-2xl p-6 flex flex-col justify-center items-center text-center">
              <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-primary mb-2">Flavor Profile</span>
              <p className="font-serif italic text-lg leading-tight">"{product.flavorProfile}"</p>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary-container/40 text-on-primary-container rounded-full text-[10px] uppercase font-bold tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-on-surface leading-tight">
              {product.name} <br />
              <span className="italic font-normal text-primary/70 text-2xl md:text-3xl">({product.scientificName})</span>
            </h1>
            <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-baseline gap-4 pt-4">
              <span className="font-serif text-4xl text-primary font-bold">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-on-surface-variant line-through opacity-50">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              onClick={() => {
                addToCart(product);
                setIsCartOpen(true);
              }}
              className="w-full h-16 bg-primary text-on-primary rounded-full font-sans font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:brightness-110 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button className="w-full h-16 border-2 border-primary/20 text-primary rounded-full font-sans font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center hover:bg-primary-container/20 transition-all">
              Subscribe & Save 15%
            </button>
          </div>

          <div className="pt-8 border-t border-outline-variant/30 grid grid-cols-2 gap-4">
            {product.benefits.slice(0, 2).map((benefit, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 bg-surface-container-low rounded-xl">
                <div className="font-serif font-bold text-primary flex items-center gap-2">
                  <CheckCircle size={14} />
                  {benefit.title}
                </div>
                <p className="text-[11px] text-on-surface-variant leading-tight">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Holistic Virtues Bento Grid */}
      <section className="max-w-7xl mx-auto px-5 md:px-16 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-3xl md:text-5xl text-on-surface mb-4">Holistic <span className="italic">Virtues</span></h2>
            <p className="text-on-surface-variant">A classic of whole-leaf botanical traditions, this blend is much more than a drink; it is a complex, soothing herbal infusion.</p>
          </div>
          <div className="h-px flex-1 bg-outline-variant/30 mb-4 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl border border-outline-variant/30 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary mb-6">
                <Info size={24} />
              </div>
              <h3 className="font-serif text-xl mb-3">{benefit.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}

          {/* Precaution Note Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 lg:col-span-1 bg-error-container/20 border border-error/10 p-8 rounded-2xl flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 text-error mb-4">
              <AlertTriangle size={20} />
              <h4 className="font-sans font-bold uppercase tracking-widest text-[10px]">Precautionary Note</h4>
            </div>
            <ul className="space-y-2">
              {product.contraindications.map((note, i) => (
                <li key={i} className="flex gap-2 text-sm text-on-error-container/80">
                  <span className="text-error">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Brewing Ritual Section */}
      <section className="bg-surface-container py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-12">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl italic mb-6">The Brewing Ritual</h2>
              <p className="font-serif italic text-lg text-primary border-l-2 border-primary pl-6">
                "Patience is the first ingredient of any healing potion."
              </p>
            </div>
            
            <div className="space-y-10">
              {product.brewingRitual.map((step) => (
                <div key={step.step} className="flex gap-8">
                  <span className="font-serif text-3xl text-primary/30 italic">{step.step}</span>
                  <div>
                    <h4 className="font-sans font-bold text-xs uppercase tracking-widest mb-2">{step.title}</h4>
                    <p className="text-on-surface-variant leading-relaxed max-w-md">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="absolute inset-0 organic-shape bg-primary/5 -rotate-12 translate-x-4 translate-y-4" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[4rem] overflow-hidden aspect-square shadow-2xl"
            >
              <img 
                src={product.secondaryImage || product.heroImage} 
                alt="Brewing Ritual" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-8 left-8 p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl max-w-[240px] hidden md:block">
                <p className="font-serif italic text-primary leading-tight text-xl">Savor the transformation of the botanical essence.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
