/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  ChevronLeft,
  User,
  Phone,
  MapPin,
  Building,
  Navigation
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { cart, cartTotal, removeFromCart, updateQuantity, itemCount, clearCart } = useCart();
  const [checkoutStep, setCheckoutStep] = React.useState<'cart' | 'shipping'>('cart');
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = React.useState<{ orderId: string; paymentId: string; amount: number } | null>(null);

  const [shippingForm, setShippingForm] = React.useState({
    name: '',
    contact: '',
    address: '',
    state: '',
    pincode: ''
  });

  // Reset steps on open/close
  React.useEffect(() => {
    if (isOpen) {
      setCheckoutStep('cart');
      setPaymentError(null);
      setFormError(null);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const validateForm = () => {
    if (!shippingForm.name.trim()) return 'Please enter your full name.';
    if (!shippingForm.contact.trim()) return 'Please enter your contact number.';
    if (shippingForm.contact.trim().length < 10) return 'Contact number should be at least 10 digits.';
    if (!shippingForm.address.trim()) return 'Please enter your complete shipping address.';
    if (!shippingForm.state.trim()) return 'Please enter your state.';
    if (!shippingForm.pincode.trim()) return 'Please enter your postal pincode.';
    if (!/^\d{6}$/.test(shippingForm.pincode.trim())) return 'Pincode must be exactly 6 numeric digits.';
    return null;
  };

  // Load Razorpay Script dynamically safely
  const loadRazorpaySDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    try {
      setIsCheckingOut(true);
      setPaymentError(null);

      // Create Razorpay Order on the backend
      const res = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal, // cartTotal is standard INR
          currency: 'INR'
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create payment order');
      }

      const orderData = await res.json();

      // Load SDK
      const loaded = await loadRazorpaySDK();
      if (!loaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // Configure Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Organic Ecommerce',
        description: 'Selected Premium Organic Infusions',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=200',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            setIsCheckingOut(true);
            // Verify signature on the server to prevent tamper and persist to MySQL
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: cartTotal,
                items: cart.map(item => ({
                  id: item.id,
                  name: item.name,
                  scientificName: item.scientificName,
                  price: item.price,
                  heroImage: item.heroImage,
                  quantity: item.quantity
                })),
                shipping: { ...shippingForm }
              })
            });

            if (!verifyRes.ok) {
              const verifyErr = await verifyRes.json();
              throw new Error(verifyErr.error || 'Payment signature verification failed.');
            }

            // Save order into client-side order history (localStorage)
            const newOrder = {
              id: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              date: new Date().toISOString(),
              amount: cartTotal,
              items: cart.map(item => ({
                id: item.id,
                name: item.name,
                scientificName: item.scientificName,
                price: item.price,
                heroImage: item.heroImage,
                quantity: item.quantity
              })),
              shipping: { ...shippingForm }
            };

            const existingOrdersStr = localStorage.getItem('nalam_brews_orders');
            let existingOrders = [];
            if (existingOrdersStr) {
               try {
                 existingOrders = JSON.parse(existingOrdersStr);
               } catch(ex) {
                 console.error("Failed to parse orders", ex);
               }
            }
            existingOrders.push(newOrder);
            localStorage.setItem('nalam_brews_orders', JSON.stringify(existingOrders));

            // Capture transaction details
            setOrderSuccess({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: cartTotal
            });
            clearCart();
          } catch (err: any) {
            console.error('Verify error:', err);
            setPaymentError(err.message || 'Verification failed. Please contact support.');
          } finally {
            setIsCheckingOut(false);
          }
        },
        prefill: {
          name: shippingForm.name,
          email: 'gautham3296@gmail.com',
          contact: shippingForm.contact
        },
        theme: {
          color: '#48671c'
        },
        modal: {
          ondismiss: function () {
            setIsCheckingOut(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (failedResponse: any) {
        console.error('Payment failed:', failedResponse.error);
        setPaymentError(failedResponse.error.description || 'Payment rejected by bank.');
        setIsCheckingOut(false);
      });
      rzp.open();
    } catch (e: any) {
      console.error('Checkout error:', e);
      setPaymentError(e.message || 'Checkout failed due to connection error.');
      setIsCheckingOut(false);
    }
  };

  const resetAfterSuccess = () => {
    setOrderSuccess(null);
    onClose();
    navigate('/orders');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface">
              <div className="flex items-center gap-2">
                {checkoutStep === 'shipping' && !orderSuccess && (
                  <button 
                    onClick={() => setCheckoutStep('cart')}
                    className="p-1.5 hover:bg-primary-container/20 rounded-full text-primary mr-1 cursor-pointer"
                    aria-label="Back to Cart"
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <ShoppingBag className="text-primary" size={20} />
                <h2 className="font-serif text-lg font-bold">
                  {orderSuccess 
                    ? 'Payment Confirmed' 
                    : checkoutStep === 'shipping' 
                      ? 'Delivery Details' 
                      : 'Your Selected Blends'
                  }
                </h2>
                {!orderSuccess && (
                  <span className="text-xs font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-primary-container/20 rounded-full transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {orderSuccess ? (
              /* Success Checkout Receipt Mode */
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FAFDF6] overflow-y-auto">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  className="w-20 h-20 bg-[#48671c]/10 text-primary rounded-full flex items-center justify-center mb-6 shrink-0"
                >
                  <CheckCircle size={48} className="text-[#48671c]" />
                </motion.div>
                
                <h3 className="font-serif text-xl font-extrabold mb-2">Order Authenticated!</h3>
                <p className="text-xs text-on-surface-variant max-w-xs mb-8">
                  Payment verification completed. Your premium organic botanical infusions are being carefully packed and heading to your doorstep!
                </p>

                <div className="w-full bg-[#1e2f14]/5 border border-[#1e2f14]/10 rounded-2xl p-5 mb-8 text-left space-y-3 font-sans text-xs shrink-0">
                  <div className="flex justify-between border-b border-black/5 pb-2">
                    <span className="text-on-surface-variant uppercase font-bold tracking-wider text-[10px]">Order ID</span>
                    <span className="font-mono text-[#1e2f14] font-medium selection:bg-yellow-100">{orderSuccess.orderId}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-2">
                    <span className="text-on-surface-variant uppercase font-bold tracking-wider text-[10px]">Payment ID</span>
                    <span className="font-mono text-on-surface-variant selection:bg-yellow-100">{orderSuccess.paymentId}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-2">
                    <span className="text-on-surface-variant uppercase font-bold tracking-wider text-[10px]">Amount Settled</span>
                    <span className="font-serif font-black text-[#48671c] text-sm">{formatCurrency(orderSuccess.amount)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-on-surface-variant uppercase font-bold tracking-wider text-[10px]">Status</span>
                    <span className="text-[#48671c] flex items-center gap-1 font-bold">● PAID (TEST VERIFIED)</span>
                  </div>
                </div>

                <button
                  onClick={resetAfterSuccess}
                  className="w-full py-4 bg-primary text-on-primary rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all cursor-pointer"
                >
                  Go to Order History
                </button>
              </div>
            ) : checkoutStep === 'shipping' ? (
              /* Delivery Shipping Details Collection Screen */
              <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white">
                <div className="flex-1 overflow-y-auto p-6 space-y-5 hide-scrollbar">
                  <div>
                    <h3 className="font-serif text-base font-bold text-primary mb-1">Shipping Destination</h3>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                      Please enter your contact information and physical address below.
                    </p>
                  </div>

                  {/* Errors in Form */}
                  {formError && (
                    <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex items-start gap-2 text-left text-xs">
                      <AlertCircle className="text-red-700 shrink-0 mt-0.5" size={14} />
                      <p className="font-sans text-red-800 leading-normal">{formError}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#1e2f14] flex items-center gap-1.5 font-sans">
                        <User size={12} className="text-[#48671c]" /> Consignee Name
                      </label>
                      <input 
                        type="text"
                        name="name"
                        value={shippingForm.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Gautham S"
                        className="w-full bg-[#FAFDF6] border border-outline-variant/40 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#48671c] transition-colors"
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#1e2f14] flex items-center gap-1.5 font-sans">
                        <Phone size={12} className="text-[#48671c]" /> Editable Contact Number
                      </label>
                      <input 
                        type="tel"
                        name="contact"
                        value={shippingForm.contact}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-[#FAFDF6] border border-outline-variant/40 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#48671c] transition-colors"
                      />
                      <p className="text-[9px] text-on-surface-variant/70 italic leading-none pl-1">
                        * Used dynamically to prefills and completes Razorpay.
                      </p>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#1e2f14] flex items-center gap-1.5 font-sans">
                        <MapPin size={12} className="text-[#48671c]" /> Delivery Address
                      </label>
                      <textarea 
                        name="address"
                        value={shippingForm.address}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Flat/House No, Building, Street, Area"
                        className="w-full bg-[#FAFDF6] border border-outline-variant/40 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#48671c] transition-colors resize-none"
                      />
                    </div>

                    {/* State & Pincode */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#1e2f14] flex items-center gap-1.5 font-sans">
                          <Building size={12} className="text-[#48671c]" /> State
                        </label>
                        <input 
                          type="text"
                          name="state"
                          value={shippingForm.state}
                          onChange={handleInputChange}
                          placeholder="Delhi / Tamil Nadu"
                          className="w-full bg-[#FAFDF6] border border-outline-variant/40 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#48671c] transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#1e2f14] flex items-center gap-1.5 font-sans">
                          <Navigation size={12} className="text-[#48671c]" /> Pincode
                        </label>
                        <input 
                          type="text"
                          name="pincode"
                          maxLength={6}
                          value={shippingForm.pincode}
                          onChange={handleInputChange}
                          placeholder="110001 / 600001"
                          className="w-full bg-[#FAFDF6] border border-outline-variant/40 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#48671c] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Step Bottom Action Bar */}
                <div className="p-6 border-t border-outline-variant/30 bg-surface-container-low space-y-4">
                  {paymentError && (
                    <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl flex items-start gap-1.5 text-left text-xs text-red-800">
                      <AlertCircle className="text-red-700 shrink-0 mt-0.5" size={14} />
                      <p className="font-sans leading-normal">{paymentError}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant">Selected Amount</span>
                    <span className="font-serif text-xl text-[#48671c] font-black">{formatCurrency(cartTotal)}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-4 bg-primary text-on-primary rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader size={15} className="animate-spin" />
                          Spawning Razorpay Sandbox...
                        </>
                      ) : (
                        'Secure Pay With Razorpay'
                      )}
                    </button>
                    <button 
                      onClick={() => setCheckoutStep('cart')}
                      disabled={isCheckingOut}
                      className="w-full py-3 border border-primary text-primary text-center rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-primary-container/20 transition-all cursor-pointer"
                    >
                      Return to Basket View
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular Cart Items Drawer Screen */
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar bg-white">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-75">
                      <div className="w-16 h-16 bg-[#FAFDF6] rounded-full flex items-center justify-center border border-outline-variant/20">
                        <ShoppingBag size={28} className="text-primary/70" />
                      </div>
                      <div>
                        <p className="font-serif text-sm font-bold">Your basket is currently empty</p>
                        <p className="font-sans text-xs text-on-surface-variant/80 mt-1 max-w-xs">
                          Start exploring our collection of hand-plucked botanical lifestyle organic infusions.
                        </p>
                      </div>
                      <button 
                        onClick={onClose}
                        className="font-sans text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary pt-2 cursor-pointer"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex gap-4 group bg-surface p-3 rounded-2xl border border-outline-variant/15 hover:border-outline-variant/35 transition-all">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0">
                          <img src={item.heroImage} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-serif text-sm text-primary font-bold truncate pr-1">{item.name}</h4>
                            <span className="font-serif font-bold text-xs shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                          <p className="text-[10px] text-on-surface-variant mb-3 uppercase tracking-tighter italic font-medium">{item.scientificName}</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center bg-surface-container rounded-full px-2 py-0.5">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 text-primary hover:text-black transition-colors cursor-pointer"
                                disabled={isCheckingOut}
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-6 text-center text-xs font-bold font-mono">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 text-primary hover:text-black transition-colors cursor-pointer"
                                disabled={isCheckingOut}
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 text-error/40 hover:text-error hover:bg-error/5 rounded-full transition-all cursor-pointer"
                              title="Remove item"
                              disabled={isCheckingOut}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-outline-variant/30 bg-[#FAFDF6] space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant">Subtotal</span>
                      <span className="font-serif text-2xl text-[#48671c] font-black">{formatCurrency(cartTotal)}</span>
                    </div>
                    
                    <p className="text-[10px] text-on-surface-variant italic leading-normal">
                      Taxes and delivery shipping coordinates calculated inside checkout step. Secure automatic validation.
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2.5">
                      <button 
                        onClick={() => setCheckoutStep('shipping')}
                        disabled={isCheckingOut}
                        className="w-full py-4 bg-primary text-on-primary rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Proceed to Delivery Details
                      </button>
                      <button 
                        onClick={onClose}
                        className="w-full py-3 border border-primary/40 text-primary text-center rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#48671c]/10 transition-all cursor-pointer"
                      >
                        Keep Browsing Portfolio
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
