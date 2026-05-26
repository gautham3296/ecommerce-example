/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, ChevronRight, Calendar, MapPin, Phone, User, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  scientificName?: string;
  price: number;
  quantity: number;
  heroImage: string;
}

interface ShippingDetails {
  name: string;
  contact: string;
  address: string;
  state: string;
  pincode: string;
}

interface Order {
  id: string;
  paymentId: string;
  date: string;
  amount: number;
  items: OrderItem[];
  shipping: ShippingDetails;
  status?: string;
  trackingId?: string | null;
}

export default function Orders() {
  const [nameInput, setNameInput] = React.useState('');
  const [contactInput, setContactInput] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [matchedOrders, setMatchedOrders] = React.useState<Order[]>([]);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Read session/stored search criteria if user already looked up in this browser session
  React.useEffect(() => {
    try {
      const savedLookup = sessionStorage.getItem('nalam_lookup_session');
      if (savedLookup) {
        const { name, contact } = JSON.parse(savedLookup);
        setNameInput(name);
        setContactInput(contact);
        performLookup(name, contact);
      }
    } catch (e) {
      console.error("Session reconstruction failed", e);
    }
  }, []);

  const performLookup = async (nameVal: string, contactVal: string) => {
    setIsSearching(true);
    setErrorMsg(null);

    try {
      // 1. Fetch from Hostinger MySQL remote DB if connected
      let mysqlOrders: Order[] = [];
      try {
        const queryParams = new URLSearchParams({ name: nameVal, contact: contactVal });
        const res = await fetch(`/api/orders/lookup?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            mysqlOrders = data.orders;
          }
        }
      } catch (err) {
        console.error("Failed to query remote DB backend, resorting to LocalStorage fallback:", err);
      }

      // 2. Fetch from standard localstorage
      let localOrders: Order[] = [];
      try {
        const storedOrders = localStorage.getItem('nalam_brews_orders');
        if (storedOrders) {
          localOrders = JSON.parse(storedOrders);
        }
      } catch (ex) {
        console.error("Error reading stored orders", ex);
      }

      const normalizedInputName = nameVal.trim().toLowerCase();
      const normalizedInputContact = contactVal.trim().replace(/\s+/g, '');

      // Filter localOrders
      const filteredLocal = localOrders.filter(order => {
        if (!order.shipping) return false;
        const orderName = (order.shipping.name || '').trim().toLowerCase();
        const orderContact = (order.shipping.contact || '').trim().replace(/\s+/g, '');
        return orderName === normalizedInputName && orderContact === normalizedInputContact;
      });

      // Merge and deduplicate by 'id'
      const mergedMap = new Map<string, Order>();
      
      // Load local first
      filteredLocal.forEach(o => {
        if (o.id) mergedMap.set(o.id, o);
      });
      
      // Add or override with MySQL entries (more accurate server-level source of truth)
      mysqlOrders.forEach(o => {
        if (o.id) mergedMap.set(o.id, o);
      });

      const finalOrders = Array.from(mergedMap.values());
      // Sort newest first by date
      finalOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setMatchedOrders(finalOrders);
      setHasSearched(true);
      
      // Save session
      sessionStorage.setItem('nalam_lookup_session', JSON.stringify({ name: nameVal, contact: contactVal }));
    } catch (e: any) {
      console.error("Error matching orders", e);
      setErrorMsg("Failed to decode store records. Please check input formats.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg("Please enter the name specified in the shipping contract.");
      return;
    }
    if (!contactInput.trim()) {
      setErrorMsg("Please provide your delivery contact phone number.");
      return;
    }
    performLookup(nameInput, contactInput);
  };

  const clearSession = () => {
    sessionStorage.removeItem('nalam_lookup_session');
    setNameInput('');
    setContactInput('');
    setHasSearched(false);
    setMatchedOrders([]);
    setErrorMsg(null);
  };

  return (
    <div className="bg-[#FAFDF6] min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-5">
        
        {/* Header Section */}
        <div className="border-b border-outline-variant/30 pb-8 mb-10 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <span className="font-sans text-xs uppercase tracking-[0.3em] font-extrabold text-[#48671c] bg-[#48671c]/10 px-4 py-1.5 rounded-full w-fit inline-block mb-3">
              📦 Secure Customer Portal
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-primary mb-2">
              Your Order <span className="italic font-normal">Vault</span>
            </h1>
            <p className="text-on-surface-variant text-sm max-w-lg">
              Unlock dispatch logs, custom recipes, and secure transaction slips by authenticating with your delivery credentials.
            </p>
          </div>
          {hasSearched && (
            <button
              onClick={clearSession}
              className="text-xs font-semibold text-primary underline hover:text-[#344d13] shrink-0 self-center md:self-end cursor-pointer"
            >
              Search Different Profile
            </button>
          )}
        </div>

        {!hasSearched ? (
          /* Lookup Authorization Card */
          <div className="max-w-md mx-auto bg-white rounded-[2.5rem] border border-outline-variant/30 p-8 md:p-10 shadow-sm space-y-6">
            <div className="text-center space-y-2 mb-2">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto text-primary">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Identity Check Verification</h3>
              <p className="font-sans text-xs text-on-surface-variant max-w-xs mx-auto">
                Type the matching Name and Mobile Number provided during checkout to fetch private records safely.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl text-xs text-red-800 text-left">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              {/* Name field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1e2f14] flex items-center gap-1.5 font-sans pl-1">
                  <User size={12} className="text-[#48671c]" /> Consignee Full Name
                </label>
                <input 
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => { setNameInput(e.target.value); setErrorMsg(null); }}
                  placeholder="e.g. Gautham S"
                  className="w-full bg-[#FAFDF6] border border-outline-variant/40 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#48671c] transition-colors"
                />
              </div>

              {/* Number field */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#1e2f14] flex items-center gap-1.5 font-sans pl-1">
                  <Phone size={12} className="text-[#48671c]" /> Mobile Contact Code
                </label>
                <input 
                  type="tel"
                  required
                  value={contactInput}
                  onChange={(e) => { setContactInput(e.target.value); setErrorMsg(null); }}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-[#FAFDF6] border border-outline-variant/40 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#48671c] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-4 bg-primary text-white rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#344d13] tracking-widest transition-all shadow-md mt-6 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSearching ? 'Querying Secure Vault...' : 'Access My Order Slip'}
              </button>
            </form>

            <div className="border-t border-outline-variant/20 pt-6 text-center">
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Looking to inspect the master ledger with other profiles? <br />
                <Link to="/admin" className="text-primary font-bold hover:underline">
                  Enter Admin Dashboard Workspace →
                </Link>
              </p>
            </div>
          </div>
        ) : matchedOrders.length === 0 ? (
          /* Empty / No Matches State */
          <div className="bg-white rounded-[2rem] border border-outline-variant/20 p-12 text-center space-y-6 shadow-xs">
            <div className="w-20 h-20 bg-[#FAFDF6] rounded-full flex items-center justify-center mx-auto text-on-surface-variant border border-outline-variant/30">
              <ShoppingBag size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold">No Records Identified</h3>
              <p className="text-on-surface-variant text-xs max-w-sm mx-auto leading-relaxed">
                We did not identify any premium order logs matching the consignee <strong className="text-primary">"{nameInput}"</strong> and number <strong className="text-primary">"{contactInput}"</strong> in this device's memory ledger.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <button 
                onClick={clearSession}
                className="px-6 py-2.5 border border-primary text-primary hover:bg-[#48671c]/10 rounded-full font-serif text-xs font-bold transition-all cursor-pointer"
              >
                Change Input Parameters
              </button>
              <Link 
                to="/products"
                className="px-6 py-2.5 bg-primary hover:bg-[#344d13] text-white rounded-full font-serif text-xs font-bold transition-all cursor-pointer"
              >
                Browse Our Organic Catalog
              </Link>
            </div>
          </div>
        ) : (
          /* Orders List output matching lookup */
          <div className="space-y-8">
            <div className="bg-[#48671c]/5 px-6 py-3.5 rounded-2xl flex items-center justify-between text-xs border border-[#48671c]/15 text-[#48671c] font-medium font-sans">
              <span>Showing <strong>{matchedOrders.length}</strong> premium health blend {matchedOrders.length === 1 ? 'order' : 'orders'} for <strong>{nameInput}</strong></span>
              <button onClick={clearSession} className="underline text-[11px] font-bold">Clear Lookup</button>
            </div>

            {matchedOrders.map((order, idx) => (
              <div 
                key={order.id || idx} 
                className="bg-white rounded-3xl border border-outline-variant/35 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Order Top Bar Info */}
                <div className="bg-[#1e2f14]/5 md:px-8 px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 text-xs">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div>
                      <span className="text-on-surface-variant uppercase tracking-wider font-bold block text-[9px] mb-0.5">Order Placed</span>
                      <span className="font-sans font-medium text-primary flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })} at {new Date(order.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-on-surface-variant uppercase tracking-wider font-bold block text-[9px] mb-0.5">Total Amount</span>
                      <span className="font-serif font-black text-sm text-[#48671c]">{formatCurrency(order.amount)}</span>
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto">
                    <span className="text-on-surface-variant uppercase tracking-wider font-bold block text-[9px] mb-0.5">Razorpay Order ID</span>
                    <span className="font-mono text-primary font-semibold selection:bg-yellow-100">{order.id}</span>
                  </div>
                </div>

                {/* Content columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
                  
                  {/* Items List */}
                  <div className="md:col-span-2 p-6 md:p-8 space-y-4">
                    <h4 className="font-serif text-sm font-bold border-b border-outline-variant/15 pb-2 mb-4 text-[#1e2f14]">
                      Botanical Packages
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <img 
                            src={item.heroImage} 
                            alt={item.name} 
                            className="w-16 h-16 rounded-xl object-cover bg-surface-container shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif text-sm text-primary font-bold truncate">{item.name}</h5>
                            {item.scientificName && (
                              <p className="text-[10px] text-on-surface-variant italic uppercase tracking-tighter mb-1">
                                {item.scientificName}
                              </p>
                            )}
                            <p className="text-xs text-on-surface-variant">
                              {formatCurrency(item.price)} × {item.quantity}
                            </p>
                          </div>
                          <div className="text-right font-serif font-bold text-sm text-primary self-center font-black">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info column */}
                  <div className="p-6 md:p-8 bg-[#FAFDF6]/30 space-y-4">
                    <h4 className="font-serif text-sm font-bold border-b border-outline-variant/15 pb-2 mb-4 flex items-center gap-1.5 text-[#1e2f14]">
                      <MapPin size={14} className="text-[#48671c]" /> Shipping Address
                    </h4>
                    {order.shipping ? (
                      <div className="space-y-3 text-xs leading-relaxed text-on-surface-variant">
                        <div className="flex items-start gap-2">
                          <User size={12} className="text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-bold text-primary block">{order.shipping.name}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone size={12} className="text-primary mt-0.5 shrink-0" />
                          <span className="font-mono">{order.shipping.contact}</span>
                        </div>
                        <div className="flex items-start gap-2 border-t border-dashed border-outline-variant/20 pt-2">
                          <div className="space-y-1">
                            <span className="block">{order.shipping.address}</span>
                            <span className="font-medium text-primary">
                              {order.shipping.state} – <span className="font-mono font-semibold">{order.shipping.pincode}</span>
                            </span>
                          </div>
                        </div>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#48671c]/10 text-[#48671c] text-[10px] font-bold uppercase tracking-wider">
                            <ShieldCheck size={11} /> Verified Gateway
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant font-sans italic">No custom shipping details captured.</p>
                    )}
                  </div>

                </div>

                {/* Footer status link bar */}
                <div className="bg-[#FAFDF6] border-t border-outline-variant/25 px-6 md:px-8 py-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] text-on-surface-variant font-extrabold uppercase tracking-wider">Status:</span>
                    {order.status === 'Packed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider text-[10px] border border-blue-200">
                        📦 Packed
                      </span>
                    ) : order.status === 'Dispatched' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-bold uppercase tracking-wider text-[10px] border border-green-200 animate-pulse">
                        🚚 Dispatched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold uppercase tracking-wider text-[10px] border border-amber-200">
                        ⏳ Preparing / Processing
                      </span>
                    )}

                    {order.trackingId && (
                      <div className="bg-white border border-outline-variant/30 text-xs px-3 py-1 rounded-lg text-on-surface flex items-center gap-1.5 shadow-3xs">
                        <span className="font-semibold text-primary">Consignment tracking number:</span>
                        <code className="font-mono font-black text-xs text-primary bg-primary/5 px-1.5 py-0.5 rounded select-all selection:bg-yellow-100 uppercase">{order.trackingId}</code>
                      </div>
                    )}
                  </div>
                  
                  <span className="font-mono text-[10px] text-on-surface-variant/70 font-semibold selection:bg-yellow-100 shrink-0">
                    ID: {order.id} | Reference: {order.paymentId.substring(0, 16)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
