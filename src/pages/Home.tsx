/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../context/ProductsContext';
import CategorySwiper from '../components/CategorySwiper';
import ProductCard from '../components/ProductCard';
import { Sparkles, Shield, Heart, Activity, Flame, Eye, Leaf, HelpCircle, Star, Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function Home() {
  const { products, loading } = useProducts();

  // Categorized lists
  const weightProducts = products.filter(p => p.category === 'Weight' || p.id === 'guava-leaves');
  const digestionProducts = products.filter(p => p.category === 'Digestion');
  const skinProducts = products.filter(p => p.category === 'Skin' || p.id === 'curry-leaves');
  const immunityProducts = products.filter(p => p.category === 'Immunity');
  const detoxProducts = products.filter(p => p.category === 'Detox' || p.id === 'black-nightshade');

  const bestSellers = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  const [activeReviewIndex, setActiveReviewIndex] = React.useState(0);
  const reviews = [
    {
      text: "The best Herbal Tea! Wow! Keep sipping, keep glowing. Organic Ecommerce's blends are truly transformational.",
      author: "Arshi",
      title: "Social Media Professional",
      location: "India"
    },
    {
      text: "Adding Pure Betel leaves to my morning routine cured my constant afternoon bloating. Simple wellness routines that worked instantly.",
      author: "Gordhan S.",
      title: "Yoga Instructor",
      location: "New Delhi"
    },
    {
      text: "Moringa and Tulasi is a shield of energy! I replaced my caffeine drinks and feel active throughout the day.",
      author: "Meera Nair",
      title: "Wellness Consultant",
      location: "Kochi"
    }
  ];

  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
  };
  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Hero carousel setup
  const [activeHeroSlide, setActiveHeroSlide] = React.useState(0);
  const heroSlides = [
    {
      tagline: "🌿 Pure Botanical Nutrition • Premium Whole-leaf Infusions",
      titlePart1: "Level Up Your",
      titlePart2: "Daily Routine",
      description: "Detox with 100% natural, hand-plucked botanical leaf infusions. Nurtured by Indian farmer families for premium lifestyle herbal teas.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1600",
      ctaText: "Shop Our Blends",
      ctaLink: "#categories"
    },
    {
      tagline: "☕ 100% Caffeine-Free • Clean Infusions",
      titlePart1: "Pure Vitality,",
      titlePart2: "Zero Crash",
      description: "Lightweight and clean organic botanical infusions in a convenient modern brewing pouch. Experience deep hydration without any of the jittery caffeine.",
      image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=1600",
      ctaText: "Explore Blends",
      ctaLink: "#categories"
    },
    {
      tagline: "🚜 Supporting Indian Farmers • Direct Sourcing",
      titlePart1: "Direct Harvest,",
      titlePart2: "Honest Impact",
      description: "Harvested with care in Southern and Western India. Empowering rural agricultural families to bring direct-plucked leaves straight to your cup.",
      image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1600",
      ctaText: "Our Story",
      ctaLink: "#story"
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="bg-surface text-on-surface space-y-0">
      
      {/* 16:9 Responsive Automatic Hero Carousel */}
      <section className="max-w-7xl mx-auto px-4 md:px-16 pt-6 md:pt-10 pb-4">
        <div className="relative aspect-[16/10] sm:aspect-video md:aspect-[16/7] lg:aspect-[16/6] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-md bg-primary group">
          {/* Slides */}
          <div className="absolute inset-0 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHeroSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 w-full h-full"
              >
                <img 
                  src={heroSlides[activeHeroSlide].image}
                  alt={heroSlides[activeHeroSlide].titlePart1}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover brightness-[0.55]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-3xl space-y-2 sm:space-y-4 md:space-y-5 lg:space-y-6 text-white text-left">
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-extrabold text-[#d9ebd9] bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 rounded-full"
                    >
                      {heroSlides[activeHeroSlide].tagline}
                    </motion.span>
                    
                    <h1 className="font-serif text-xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15]">
                      {heroSlides[activeHeroSlide].titlePart1}{" "}
                      <span className="italic text-[#d9ebd9]">{heroSlides[activeHeroSlide].titlePart2}</span>
                    </h1>
                    
                    <p className="font-sans text-[10px] sm:text-xs md:text-sm lg:text-base opacity-90 leading-normal sm:leading-relaxed max-w-xs sm:max-w-md md:max-w-xl">
                      {heroSlides[activeHeroSlide].description}
                    </p>
                    
                    <div className="flex gap-3 pt-1 sm:pt-2">
                      {heroSlides[activeHeroSlide].ctaLink.startsWith("#") ? (
                        <a 
                          href={heroSlides[activeHeroSlide].ctaLink}
                          className="px-4 sm:px-8 py-1.5 sm:py-3 bg-primary-container text-[#121c16] hover:bg-white rounded-full font-sans text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-97 cursor-pointer"
                        >
                          {heroSlides[activeHeroSlide].ctaText}
                        </a>
                      ) : (
                        <a 
                          href={heroSlides[activeHeroSlide].ctaLink}
                          className="px-4 sm:px-8 py-1.5 sm:py-3 bg-primary-container text-[#121c16] hover:bg-white rounded-full font-sans text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-97 cursor-pointer"
                        >
                          {heroSlides[activeHeroSlide].ctaText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Indicators / Dots */}
          <div className="absolute bottom-3 md:bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveHeroSlide(index)}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeHeroSlide === index 
                    ? 'bg-primary-container w-5 md:w-6' 
                    : 'bg-white/40 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Quick Nav arrows on hover */}
          <button
            onClick={() => setActiveHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-black/25 hover:bg-black/55 text-white items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer text-center"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="mx-auto" />
          </button>
          <button
            onClick={() => setActiveHeroSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-black/25 hover:bg-black/55 text-white items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer text-center"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="mx-auto" />
          </button>
        </div>
      </section>

      {/* Promoted Sale Highlights Section */}
      <section className="py-12 bg-primary-container/35">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-red-600 bg-red-50 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full w-fit">Seasonal Offer</span>
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-on-surface">Get 7 Premium Organic Herbals Combo Box</h3>
              <p className="text-xs md:text-sm text-on-surface/80">Start your holistic wellness routine today with 7 specialized infusions designed for daily restoration.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="text-center md:text-right">
                <span className="text-sm line-through text-on-surface-variant block">Regular ₹1,999</span>
                <span className="font-serif text-3xl font-black text-primary block">₹999 Only</span>
              </div>
              <button 
                onClick={() => {
                  const giftProd = products[0];
                  if(giftProd) {
                    window.location.hash = "#categories";
                  }
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-[#103321] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
              >
                Claim Package
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Botanical Framework Category Slider Matrices */}
      <section id="categories" className="py-20 max-w-7xl mx-auto px-4 md:px-16">
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-extrabold text-primary">The Healing Portfolio</span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold">
            Explore our <span className="italic text-primary">Botanical Matrix</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm md:text-base">
            Hand-harvested infusions categorised for targeted wellness rituals. Choose your wellness path.
          </p>
        </div>

        {/* 1. For Weight Loss */}
        <div className="border-b border-outline-variant/20 pb-12 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-container/30 rounded-xl text-primary">
              <Flame size={24} />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-black tracking-tight">For Weight Loss & Metabolism</h3>
          </div>
          <CategorySwiper
            title="Metabolic Control"
            tagline="The Science of Horse Gram"
            description="Ignite natural warmth and fat metabolisers. Formulated with mineral-dense Horse Gram and metabolic botanicals."
            bannerImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBziyhOYTt8ICvwcN4j4MvxjTb4HkGByiOckJoisEmj9eEjXDyEsQbIEV4SDUReMPRd09k5q-HuoTKaC8UIX7lEIg9UA5yQLHL63Mg28mVftgcaJqtz06NuWzkVG4W8tKaEtJdQn87UCPEZgIUHYgAbIWRW3CuGzQqUpDg8hOZ70paQ4r1YXBu5kM1pWl9Q_2Z8iq3WiBnOicrylyWABjd48FNcZYM5NCJJPGCmQr-dbNOAbHUu7zVnkFo0SkS6LlDJ6CkTJWUMZ_xe"
            products={weightProducts}
          />
        </div>

        {/* 2. For Digestion */}
        <div className="border-b border-outline-variant/20 pb-12 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#f4f9eb] rounded-xl text-[#48671c]">
              <Activity size={24} />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-black tracking-tight">For Digestion & Gut Balance</h3>
          </div>
          <CategorySwiper
            title="Internal Digestive Fire"
            tagline="The Ritual of Agni"
            description="Revitalize your gut environment. Contains Betel Leaves, Curry Leaves, and Jamun to enhance enzymes and soothe bloating."
            bannerImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCuTR9AJL_WZ_NHJmozn2XH9US7TGGPkPO9RbbTSH5two4rMHlWOCRmbYyeWxPUxg7HBd5qW-eUEX8vFfhPVeWgnhJvEvWd6G2XovcWAKJoQgnFPHviZ_0k_OZJcwm-VGkDMPYRfU_irPNkvppyfQKx0ePXsd4Ylv0TcyRbeJM2fpbrfMIqjibdvooVdgu2BkGeq0o3i3BhoLGIpHlV5TdrnRhAnTlP_hTZfnkZrdW78cCJiMjYfnRy0UAndYSm-9h0Ficisc-HO6iM"
            products={digestionProducts}
          />
        </div>

        {/* 3. For Skin Care */}
        <div className="border-b border-outline-variant/20 pb-12 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#f4f9eb] rounded-xl text-[#48671c]">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-black tracking-tight">For Skin Care & Cell Glow</h3>
          </div>
          <CategorySwiper
            title="Dermal Radiance"
            tagline="The Golden Flower"
            description="Rejuvenate skin from within. Infused with Golden Avarampoo flower petals packed with cooling herbal active antioxidants."
            bannerImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBJQ1_8FW2e8EpI0uf6FCZUDpEpui_rV4jrLf4NY_xAt6UDZh3YgoTC-srCYW6aRglZ6o524Vbtpnj-LJhUhI5aIf6uDhZciLAC_dpnCRBW8KYAqujqrVDnYW8J292jNsxGxl83RiNv1TXBo5lg3-6BezoGYgW5L4C-GfKzkgXWx9SRhDjRKbq5uvbkrwIjBLEBm3qgQPH-m8grnDlX_YeeOb07-XZ8M7JsZG6G9ajAV2ItK3fa4E0KhTZBnhQmh6GJGyMV-rpQlycw"
            products={skinProducts}
          />
        </div>

        {/* 4. For Immunity */}
        <div className="border-b border-outline-variant/20 pb-12 mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#f4f9eb] rounded-xl text-[#48671c]">
              <Shield size={24} />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-black tracking-tight">For Immunity & Respiratory Support</h3>
          </div>
          <CategorySwiper
            title="Eternal Holy Basil"
            tagline="Queen of Herbs"
            description="Strengthen your systemic essence and lungs. Blended with Sacred Tulasi and nutrient-dense Moringa superfood nectar."
            bannerImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDvZwHffLZSWjzTzaHEUtZLM9nSyfyfc04lems7lFJ6UX_80rGLfQYlmGNRQJsXaKiK39lrddVQMdqaABilLZkH9R-iP6PYa-Rhdoye6X56p8jlhtLob18fcSGA0eRFMJ1mBKCDyiX38MYTAYyoJlBHaVOYf4D8f3rFsl6lfqaD54XugNl9q8NL0jMBRa4y6L8t8U_smx8adly7tqzeOquA0Wjo2GAS_Sixz86g_keetO-CzRvbPqe1KhxxJgLuqsC2_ibjcKqzg-3Q"
            products={immunityProducts}
          />
        </div>

        {/* 5. For Detox & Sleep */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-container/30 rounded-xl text-primary">
              <Heart size={24} />
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-black tracking-tight">For Detoxification & Muscle Sleep</h3>
          </div>
          <CategorySwiper
            title="Night Sanctuary"
            tagline="Restorative Flow"
            description="Unwind and shield your liver from toxins. Contains therapeutic Black Nightshade and holy basil adaptogens."
            bannerImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAe8v_2QiW56U-Ofb3VLs_v64I9WgQmyY19Zokbh6sNfXeLFIoO-7bkmplYKCucZ9nNloGoWxvKPJ1iAoK80-6P1tEw_wchuuej9OjS2BX3OJfHuEtwbqMomDXoq_WOUUU-GFtaC-BypJTll4U21b3K3pgq8KBodRYSLLk42k_k8r-HHTdKYqrB_U72OLI_PQ1hUcOjiHl4h6ReQ0xyG5Q1h-iqFPhChvhKnhSEI0YmX4STKwoIIfmcRuHTxusyNFez8CGP_GigZw2Z"
            products={detoxProducts}
          />
        </div>
      </section>

      {/* Trust Capsules Ribbon (Shifted to after product listing) */}
      <section className="bg-primary py-8 text-white select-none border-y border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center text-center">
            {[
              { label: "Zero Caffeine", icon: "☕", sub: "Natural vitality" },
              { label: "100% Flower-Based", icon: "🌸", sub: "Pure botanicals" },
              { label: "Sun-Dried Leaves", icon: "☀️", sub: "Herbal nutrients" },
              { label: "Direct-From-Farms", icon: "🚜", sub: "Ethical sourcing" },
              { label: "Free Shipping", icon: "📦", sub: "On orders above ₹499" },
            ].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center space-y-1 group">
                <span className="text-2xl transform group-hover:scale-125 transition-transform duration-300 mb-1">{benefit.icon}</span>
                <span className="font-serif text-sm font-bold tracking-wide">{benefit.label}</span>
                <span className="text-[10px] text-white/60 uppercase tracking-widest">{benefit.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Catalogue Call to Action Banner */}
      <section className="py-16 bg-primary-container/30 border-y border-outline-variant/10 text-center">
        <div className="max-w-3xl mx-auto px-5 space-y-6">
          <span className="text-primary font-black text-xs uppercase tracking-[0.25em] bg-white px-4 py-1.5 rounded-full border border-outline-variant/20 shadow-xs inline-block">
            🌱 The Complete Catalogue
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-primary">
            Can't find what you are looking for?
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto text-sm md:text-base">
            Discover our entire spectrum of organic whole-leaf herbal infusions.
          </p>
          <div className="pt-4">
            <Link 
              to="/products"
              className="px-10 py-4.5 bg-primary hover:bg-[#103321] text-white rounded-full font-serif text-base font-bold shadow-md hover:scale-103 transition-all inline-block cursor-pointer"
            >
              Browse All 9 Botanical Blends
            </Link>
          </div>
        </div>
      </section>

      {/* Customer voice reviews - slider container */}
      <section className="py-24 bg-white border-y border-outline-variant/10">
        <div className="max-w-4xl mx-auto px-5 text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.3em] font-black text-primary block">Tested & Approved</span>
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold">The Voice of Our Customers</h2>
          
          {/* Review Slider */}
          <div className="relative bg-primary-container/20 rounded-3xl p-8 md:p-14 border border-outline-variant/30 shadow-xs">
            <Quote className="w-12 h-12 text-primary/25 mx-auto mb-6" />
            
            <div className="min-h-[140px] flex items-center justify-center">
              <p className="font-serif text-xl md:text-2xl text-on-surface leading-relaxed max-w-2xl italic">
                "{reviews[activeReviewIndex].text}"
              </p>
            </div>

            {/* Stars Row */}
            <div className="flex justify-center text-amber-500 gap-1.5 mt-8 mb-4">
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
              <Star size={18} fill="currentColor" />
            </div>

            {/* Author */}
            <div className="space-y-1">
              <h4 className="font-sans font-extrabold text-sm text-on-surface">
                {reviews[activeReviewIndex].author}
              </h4>
              <p className="text-xs text-on-surface-variant uppercase tracking-widest leading-none font-semibold">
                {reviews[activeReviewIndex].title} • {reviews[activeReviewIndex].location}
              </p>
            </div>

            {/* Slides controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 md:-left-6 right-2 md:-right-6 flex justify-between pointer-events-none">
              <button 
                onClick={handlePrevReview}
                className="w-10 h-10 rounded-full bg-white border border-outline-variant hover:bg-primary hover:text-white shadow-md flex items-center justify-center pointer-events-auto transition-all cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={handleNextReview}
                className="w-10 h-10 rounded-full bg-white border border-outline-variant hover:bg-primary hover:text-white shadow-md flex items-center justify-center pointer-events-auto transition-all cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-8">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReviewIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeReviewIndex === i ? 'w-5 bg-primary' : 'w-1.5 bg-on-surface-variant/35'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Community Heritage / Our Story */}
      <section id="story" className="py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-[3rem] -rotate-3 scale-103" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl border border-outline-variant/30"
            >
              <img 
                src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1000"
                alt="Woman farmer harvesting botanicals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          
          <div className="space-y-8">
            <span className="font-sans text-xs uppercase tracking-[0.3em] font-extrabold text-primary bg-primary/10 px-3 py-1.5 rounded-full w-fit block">Our Story & Farmer Heritage</span>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-on-surface font-extrabold">
              Nurturing Over <br />
              <span className="italic text-primary font-light">1,000 Farmer Families</span>
            </h2>
            <div className="space-y-6 text-on-surface-variant text-sm md:text-base leading-relaxed">
              <p>
                Our vision is to provide authentic Indian organic herbal infusions across the world and while on this journey, we commit to the advancement of our community along with us. We are proud to change the lives of over 1,000 farmer's families.
              </p>
              <p>
                We grow our own herbs directly with small agricultural farmer families. With our efficient supply chain, we bring direct-plucked leaves and botanical petals into your cups within as little as 48 hours. 
              </p>
              <p className="font-semibold text-on-surface flex items-center gap-2">
                🇮🇳 <span className="text-primary">90% of our farmers are passionate rural women</span>, inspiring true economic independence and sustainable progress in native sectors.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-outline-variant/35 text-center sm:text-left">
              <div>
                <h4 className="font-serif text-3xl font-black text-primary">100%</h4>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Natural & Pure</p>
              </div>
              <div className="hidden sm:block border-r border-outline-variant/35" />
              <div>
                <h4 className="font-serif text-3xl font-black text-primary">1,000+</h4>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Local Farms Uplifted</p>
              </div>
              <div className="hidden sm:block border-r border-outline-variant/35" />
              <div>
                <h4 className="font-serif text-3xl font-black text-primary">90%</h4>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Women Agriculture Workforce</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Banner */}
      <section className="py-24 px-5">
        <div className="max-w-7xl mx-auto relative rounded-[3rem] overflow-hidden bg-primary p-12 md:p-24 text-center border border-white/5 shadow-2x">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <Leaf className="w-10 h-10 text-primary-container mx-auto animate-pulse" />
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-tight font-extrabold">
              Cultivate Your Inner <span className="italic font-light text-primary-container">Daily Balance</span>.
            </h2>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Begin your natural journey towards holistic wellness today with our sustainably harvested whole-leaf botanical infusions.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-fit mx-auto pt-6">
              <a href="#categories" className="px-10 py-5 bg-primary-container hover:bg-white text-primary rounded-full font-serif text-lg font-bold shadow-xl transition-all block">
                Connect and Shop Blends
              </a>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
