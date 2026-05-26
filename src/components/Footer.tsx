/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Leaf, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30 pt-20 pb-24 md:pb-12 px-5 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Leaf className="text-primary w-6 h-6" />
              <span className="font-serif text-xl text-primary">Organic Ecommerce</span>
            </div>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-xs">
              Honoring ancestral botanical wisdom through modern wellness rituals. Ethically sourced and botanically bound.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full border border-outline-variant hover:bg-primary hover:text-on-primary transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full border border-outline-variant hover:bg-primary hover:text-on-primary transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 rounded-full border border-outline-variant hover:bg-primary hover:text-on-primary transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-primary mb-8">Shop</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link to="/products" className="hover:text-primary transition-colors">Our Blends</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Bundles</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors font-semibold">Track My Orders</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-primary mb-8">Wellness</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><a href="#story" className="hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#categories" className="hover:text-primary transition-colors">Ingredients</a></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">Verifications</Link></li>
              <li><Link to="/admin" className="hover:text-primary transition-colors">Ledger Checks</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-primary mb-8">Newsletter</h4>
            <p className="text-sm text-on-surface-variant mb-6">Join our botanical circle for seasonal rituals.</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
              />
              <button 
                type="submit"
                className="w-full bg-primary text-on-primary font-sans text-xs font-bold uppercase tracking-widest py-3 rounded-lg hover:brightness-110 transition-all cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 text-[11px] uppercase tracking-wider">
          <p>© 2026 Organic Ecommerce. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2 select-none justify-center">
            <Link to="/orders" className="hover:text-primary font-bold">Track My Orders</Link>
            <Link to="/admin" className="hover:text-primary font-bold">Admin Console</Link>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
