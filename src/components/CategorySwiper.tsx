/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../lib/utils";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

interface CategorySwiperProps {
  title: string;
  tagline: string;
  description: string;
  bannerImage: string;
  products: Product[];
  accentColor?: string;
}

export default function CategorySwiper({
  title,
  tagline,
  description,
  bannerImage,
  products,
}: CategorySwiperProps) {
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll state to show or hide navigation buttons on desktop
  const checkScrollState = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollState);
      // Run once initially
      checkScrollState();
      // Handle page resizes
      window.addEventListener("resize", checkScrollState);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollState);
      }
      window.removeEventListener("resize", checkScrollState);
    };
  }, [products]);

  const slideNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const slidePrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  return (
    <div className="my-8 md:my-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Creative Banner (Hidden on mobile to reduce extreme vertical scroll depth) */}
        <div className="hidden md:flex lg:col-span-4 relative rounded-3xl overflow-hidden shadow-md min-h-[300px] flex-col justify-end p-6 group border border-outline-variant/20">
          <img
            src={bannerImage}
            alt={title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-1" />
          
          <div className="relative z-10 text-white space-y-2">
            <span className="text-[#c2e88d] text-[10px] font-extrabold uppercase tracking-widest">{tagline}</span>
            <h3 className="font-serif text-2xl lg:text-3xl font-bold">{title}</h3>
            <p className="text-white/85 text-xs leading-relaxed max-w-sm">{description}</p>
          </div>
        </div>

        {/* Right Column: Swipeable Products Carousel */}
        <div className="col-span-1 lg:col-span-8 relative flex flex-col justify-center">
          
          {/* Scroll Area Wrapper */}
          <div className="relative group/carousel">
            
            {/* Desktop Left Slide Button */}
            {canScrollLeft && (
              <button
                onClick={slidePrev}
                className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white hover:bg-[#48671c] hover:text-white text-on-surface shadow-md rounded-full items-center justify-center transition-all cursor-pointer border border-outline-variant/30"
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Swipeable container (Supports touches and dragging) */}
            <div
              ref={scrollContainerRef}
              className="w-full flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-2 px-1"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {products.map((product) => {
                const originalPrice = product.id === 'avarampoo' ? 2600 : product.price + 400; // Simulated MSRP
                return (
                  <motion.div
                    key={product.id}
                    className="w-[82%] sm:w-[290px] md:w-[310px] flex-shrink-0 snap-start bg-white border border-outline-variant/40 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Hero Image */}
                    <div className="relative mb-3">
                      <Link to={`/product/${product.id}`} className="block aspect-video overflow-hidden rounded-xl">
                        <img
                          src={product.heroImage}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                        />
                      </Link>
                      <div className="absolute top-2 left-2">
                        {product.tags.slice(0, 1).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#48671c] text-white rounded-full text-[8px] font-bold uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metadata & Rating info */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/product/${product.id}`} className="block">
                          <h4 className="font-serif text-base font-bold hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                        </Link>
                        <span className="text-[10px] text-[#48671c] font-bold whitespace-nowrap mt-0.5">
                          {product.scientificName}
                        </span>
                      </div>
                      
                      {/* Rating Line */}
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-500 leading-none">
                          <Star size={11} fill="currentColor" className="inline" />
                          <Star size={11} fill="currentColor" className="inline" />
                          <Star size={11} fill="currentColor" className="inline" />
                          <Star size={11} fill="currentColor" className="inline" />
                          <Star size={11} fill="currentColor" className="inline" />
                        </div>
                        <span className="text-[9px] text-on-surface-variant font-medium">(100+)</span>
                      </div>

                      <p className="text-on-surface-variant text-[11px] line-clamp-2 leading-relaxed min-h-[32px] pt-1">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Pricing & Checkout Block */}
                    <div className="space-y-2 pt-3 border-t border-outline-variant/10 mt-3">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-lg font-black text-[#1e2f14]">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-[10px] text-on-surface-variant line-through font-sans">
                            {formatCurrency(originalPrice)}
                          </span>
                        </div>
                        <span className="text-[9px] bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Save {Math.round(((originalPrice - product.price) / originalPrice) * 100)}%
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2.5 bg-[#fde047] hover:bg-[#eab308] text-[#1e2f14] font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-97 cursor-pointer"
                      >
                        Add to cart
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop Right Slide Button */}
            {canScrollRight && (
              <button
                onClick={slideNext}
                className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-25 w-10 h-10 bg-white hover:bg-[#48671c] hover:text-white text-on-surface shadow-md rounded-full items-center justify-center transition-all cursor-pointer border border-outline-variant/30"
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            )}

          </div>

          {/* Prompt/Guide to swipe (Mobile only) */}
          <div className="flex md:hidden justify-center items-center gap-1.5 text-[10px] text-on-surface-variant/70 mt-2">
            <span>Swipe left / right to browse blends</span>
            <span className="inline-block animate-bounce font-bold">→</span>
          </div>

        </div>
      </div>
    </div>
  );
}
