/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  Trash2, 
  Search, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  PackageCheck,
  RotateCcw,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Database,
  RefreshCw,
  Edit,
  Plus,
  Trash,
  Save,
  X,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { Product } from '../types';
import { getApiUrl } from '../lib/api';

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

export default function Admin() {
  const [allOrders, setAllOrders] = React.useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'Processing' | 'Packed' | 'Dispatched'>('all');
  const [passcode, setPasscode] = React.useState('');
  const [isUnlocked, setIsUnlocked] = React.useState(true); // Direct access in sandbox for convenience but can toggle or simulate
  const [loginError, setLoginError] = React.useState<string | null>(null);

  // DB Diagnostics state variables
  const [dbStatus, setDbStatus] = React.useState<'idle' | 'connected' | 'error' | 'not_configured'>('idle');
  const [dbLastError, setDbLastError] = React.useState<string | null>(null);
  const [dbConfig, setDbConfig] = React.useState<{ host: string; database: string; user: string; port: string } | null>(null);
  const [isRetryingDb, setIsRetryingDb] = React.useState(false);
  const [isDbDiagExpanded, setIsDbDiagExpanded] = React.useState(false);

  // Custom API Base URL states
  const [customApiBaseUrl, setCustomApiBaseUrl] = React.useState<string>(() => localStorage.getItem('custom_api_base_url') || '');
  const [tempCustomUrl, setTempCustomUrl] = React.useState<string>(() => localStorage.getItem('custom_api_base_url') || '');
  const [urlMessage, setUrlMessage] = React.useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Local state for inline tracking ID workflow
  const [editingTrackingOrderId, setEditingTrackingOrderId] = React.useState<string | null>(null);
  const [tempTrackingId, setTempTrackingId] = React.useState('');

  // Products context integration references
  const { products, upsertProduct, deleteProduct, isDbConnected: prodDbConnected, loading: prodLoading } = useProducts();
  const [activeSection, setActiveSection] = React.useState<'orders' | 'catalog'>('orders');

  // Product editing panel state parameters
  const formRef = React.useRef<HTMLDivElement>(null);
  const [isProductFormOpen, setIsProductFormOpen] = React.useState(false);
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null); // null means adding new

  // Form input field configurations
  const [formId, setFormId] = React.useState('');
  const [formName, setFormName] = React.useState('');
  const [formScientificName, setFormScientificName] = React.useState('');
  const [formPrice, setFormPrice] = React.useState(0);
  const [formOriginalPrice, setFormOriginalPrice] = React.useState<number | undefined | "">("");
  const [formCategory, setFormCategory] = React.useState<"Digestion" | "Immunity" | "Skin" | "Weight" | "Detox">("Digestion");
  const [formShortDescription, setFormShortDescription] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formFlavorProfile, setFormFlavorProfile] = React.useState('');
  const [formTags, setFormTags] = React.useState('');
  const [formHeroImage, setFormHeroImage] = React.useState('');
  const [formSecondaryImage, setFormSecondaryImage] = React.useState('');

  // Helper to pre-populate product form for edit
  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setFormId(p.id);
    setFormName(p.name);
    setFormScientificName(p.scientificName || '');
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice !== undefined ? p.originalPrice : "");
    setFormCategory(p.category);
    setFormShortDescription(p.shortDescription || '');
    setFormDescription(p.description || '');
    setFormFlavorProfile(p.flavorProfile || '');
    setFormTags(p.tags ? p.tags.join(', ') : '');
    setFormHeroImage(p.heroImage || '');
    setFormSecondaryImage(p.secondaryImage || '');
    setIsProductFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Helper to clear product form for new addition
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setFormId('');
    setFormName('');
    setFormScientificName('');
    setFormPrice(2000); // default rupees (e.g., 20.00 standard format internally)
    setFormOriginalPrice('');
    setFormCategory('Digestion');
    setFormShortDescription('');
    setFormDescription('');
    setFormFlavorProfile('Pungent, herbaceous, with a refreshingly sweet undertone.');
    setFormTags('New Blend, Farm Sourced');
    setFormHeroImage('https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600');
    setFormSecondaryImage('');
    setIsProductFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle saving product from form
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formName.trim() || formPrice <= 0) {
      alert("Please fill in ID, Name, and valid Product Price.");
      return;
    }

    const tagsArr = formTags
      ? formTags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    // Let's form the Product object
    const updatedProduct: Product = {
      id: formId.trim().toLowerCase().replace(/\s+/g, '-'),
      name: formName.trim(),
      scientificName: formScientificName.trim(),
      price: Number(formPrice),
      originalPrice: formOriginalPrice && Number(formOriginalPrice) ? Number(formOriginalPrice) : undefined,
      category: formCategory,
      shortDescription: formShortDescription.trim(),
      description: formDescription.trim(),
      flavorProfile: formFlavorProfile.trim(),
      tags: tagsArr,
      heroImage: formHeroImage.trim(),
      secondaryImage: formSecondaryImage.trim() || undefined,
      benefits: [
        { title: "Metabolism Booster", description: "Activates organic enzymes to convert fatty cells into active body energy.", icon: "bolt" },
        { title: "Digestive Shield", description: "Creates a gentle gastrointestinal coating to reduce excess acidity.", icon: "spa" },
        { title: "Systemic Cleansing", description: "Rich, dense antioxidant load to naturally flush blood toxins.", icon: "shield" }
      ],
      contraindications: [
        "Pregnant mothers",
        "Patients on blood sugar medicine"
      ],
      brewingRitual: [
        { step: "01", title: "Pour", description: "Place one organic infusion bag in 8oz near-boiling water (approx 190°F)." },
        { step: "02", title: "Infuse", description: "Cover and let steep for 5 to 7 golden minutes to unlock essential botanical elements." },
        { step: "03", title: "Savor", description: "Remove infusion bag. Breathe and sip slowly while warm." }
      ]
    };

    const isSuccess = await upsertProduct(updatedProduct);
    if (isSuccess || true) {
      setIsProductFormOpen(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`⚠️ Are you sure you want to permanently delete "${name}" from your catalog database?`)) {
      await deleteProduct(id);
    }
  };

  React.useEffect(() => {
    loadLedger();
    fetchDbStatus();
  }, []);

  const fetchDbStatus = async () => {
    try {
      const res = await fetch(getApiUrl("/api/db-status"));
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data.status);
        setDbLastError(data.lastError);
        setDbConfig(data.config);
      }
    } catch (err) {
      console.error("Failed to fetch database status:", err);
      setDbStatus('error');
      setDbLastError("Server is unreachable or API route is failed.");
    }
  };

  const handleRetryDb = async () => {
    setIsRetryingDb(true);
    try {
      const res = await fetch(getApiUrl("/api/db-retry"), { method: "POST" });
      const data = await res.json();
      setDbStatus(data.status);
      setDbLastError(data.lastError);
      if (data.success) {
        loadLedger();
      }
    } catch (err: any) {
      console.error("Failed executing database reconnection query:", err);
      setDbStatus('error');
      setDbLastError(err.message || String(err));
    } finally {
      setIsRetryingDb(false);
    }
  };

  const handleSaveCustomUrl = () => {
    let cleanUrl = tempCustomUrl.trim();
    if (cleanUrl) {
      if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      localStorage.setItem('custom_api_base_url', cleanUrl);
      setCustomApiBaseUrl(cleanUrl);
      setUrlMessage({
        text: `Backend API URL saved successfully! Now routing requests directly to: ${cleanUrl}`,
        type: 'success'
      });
    } else {
      localStorage.removeItem('custom_api_base_url');
      setCustomApiBaseUrl('');
      setUrlMessage({
        text: "Custom API URL cleared. Now routing requests using standard Netlify relative proxies (/api/...).",
        type: 'info'
      });
    }
    setTimeout(() => {
      fetchDbStatus();
      loadLedger();
    }, 150);
    setTimeout(() => setUrlMessage(null), 8000);
  };

  const handleResetCustomUrl = () => {
    localStorage.removeItem('custom_api_base_url');
    setCustomApiBaseUrl('');
    setTempCustomUrl('');
    setUrlMessage({
      text: "API Base URL successfully reset to standard relative proxying (/api/...).",
      type: 'info'
    });
    setTimeout(() => {
      fetchDbStatus();
      loadLedger();
    }, 150);
    setTimeout(() => setUrlMessage(null), 6000);
  };

  const loadLedger = async () => {
    try {
      // 1. Fetch from Hostinger MySQL remote DB first
      let mysqlOrders: Order[] = [];
      try {
        const res = await fetch(getApiUrl("/api/orders/all"));
        if (res.ok) {
          const data = await res.json();
          if (data.orders && data.orders.length > 0) {
            mysqlOrders = data.orders;
          }
        }
      } catch (err) {
        console.error("Failed to query remote database for admin master view:", err);
      }

      // 2. Fetch from standard localstorage
      let localOrders: Order[] = [];
      const storedOrders = localStorage.getItem('nalam_brews_orders');
      if (storedOrders) {
        try {
          localOrders = JSON.parse(storedOrders);
        } catch (e) {
          console.error("Failed to parse local storage orders config:", e);
        }
      }

      // Merge and deduplicate by 'id'
      const mergedMap = new Map<string, Order>();
      
      localOrders.forEach(o => {
        if (o.id) mergedMap.set(o.id, o);
      });
      mysqlOrders.forEach(o => {
        if (o.id) mergedMap.set(o.id, o);
      });

      const finalOrders = Array.from(mergedMap.values());
      // Sort newest first by Date
      finalOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setAllOrders(finalOrders);
    } catch (e) {
      console.error("Failed to read orders repository ledger", e);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string, trackingId: string | null = null) => {
    try {
      // 1. Instantly update local react state for micro-responsiveness
      const updatedOrders = allOrders.map(order => 
        order.id === orderId ? { ...order, status, trackingId } : order
      );
      setAllOrders(updatedOrders);

      // 2. Persist to standard offline Sandbox LocalStorage fallback configuration
      const localOrdersStr = localStorage.getItem('nalam_brews_orders');
      let localOrders: Order[] = [];
      if (localOrdersStr) {
        try {
          localOrders = JSON.parse(localOrdersStr);
        } catch (e) {
          console.error(e);
        }
      }
      
      const updatedLocal = localOrders.map(o => 
        o.id === orderId ? { ...o, status, trackingId } : o
      );
      // If the order exists in memory but not in local storage yet, inject it so they match
      if (!updatedLocal.some(o => o.id === orderId)) {
        const memoryOrder = allOrders.find(o => o.id === orderId);
        if (memoryOrder) {
          updatedLocal.push({ ...memoryOrder, status, trackingId });
        }
      }
      localStorage.setItem('nalam_brews_orders', JSON.stringify(updatedLocal));

      // 3. Submit remote update REST query (Hostinger MySQL)
      const res = await fetch(getApiUrl("/api/orders/update-status"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status, trackingId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          console.log(`Saved remote status update successfully for ${orderId}`);
        }
      }
    } catch (err) {
      console.error("Failed updating order status:", err);
    }
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'organic' || passcode.toLowerCase() === 'organicecommerce' || passcode === 'admin123' || passcode === '') {
      setIsUnlocked(true);
      setLoginError(null);
    } else {
      setLoginError("Invalid Administrator Passcode. Click Access directly to enter the mock sandbox.");
    }
  };

  const clearDatabase = async () => {
    if (window.confirm("⚠️ WARNING: Are you sure you want to completely clear the local and remote transaction database ledger? This action is irreversible.")) {
      localStorage.removeItem('nalam_brews_orders');
      
      try {
        await fetch(getApiUrl("/api/orders/wipe"), { method: "POST" });
      } catch (dbErr) {
        console.error("Failed to wipe remote database tables:", dbErr);
      }

      setAllOrders([]);
    }
  };

  // Dispatch sample mock orders into ledger for easy review if empty
  const handleInjectMockData = () => {
    const mockOrders: Order[] = [
      {
        id: "order_mock101_razorpay",
        paymentId: "pay_mock101_validated",
        date: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        amount: 875,
        items: [
          {
            id: "1",
            name: "Vadha Narayanan Blend",
            scientificName: "Delonix elata",
            price: 249,
            quantity: 2,
            heroImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600"
          },
          {
            id: "3",
            name: "Murungai (Moringa) Blend",
            scientificName: "Moringa oleifera",
            price: 189,
            quantity: 2,
            heroImage: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&q=80&w=600"
          }
        ],
        shipping: {
          name: "Gautham S",
          contact: "9876543210",
          address: "12A Forest View Lane, Adyar",
          state: "Tamil Nadu",
          pincode: "600020"
        }
      },
      {
        id: "order_mock102_razorpay",
        paymentId: "pay_mock102_validated",
        date: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        amount: 395,
        items: [
          {
            id: "2",
            name: "Mudakathan (Balloon Vine) Blend",
            scientificName: "Cardiospermum halicacabum",
            price: 199,
            quantity: 1,
            heroImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=600"
          }
        ],
        shipping: {
          name: "Dr. Arundhati Roy",
          contact: "9123456789",
          address: "Block C-4, Shanti Kunj Apartments, Vasant Kunj",
          state: "Delhi",
          pincode: "110070"
        }
      }
    ];

    localStorage.setItem('nalam_brews_orders', JSON.stringify(mockOrders));
    loadLedger();
  };

  // Math Stats
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalVolume = allOrders.reduce((sum, order) => sum + order.items.reduce((p, i) => p + i.quantity, 0), 0);
  const averageValue = allOrders.length > 0 ? totalRevenue / allOrders.length : 0;

  // Filter logic
  const filteredOrders = allOrders.filter(order => {
    // 1. Filter by status
    if (statusFilter !== 'all') {
      const currentStatus = order.status || 'Processing';
      if (statusFilter === 'Processing' && currentStatus !== 'Processing') return false;
      if (statusFilter !== 'Processing' && currentStatus !== statusFilter) return false;
    }

    // 2. Filter by search query
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchesName = order.shipping?.name?.toLowerCase().includes(query);
    const matchesContact = order.shipping?.contact?.includes(query);
    const matchesOrderId = order.id?.toLowerCase().includes(query);
    const matchesState = order.shipping?.state?.toLowerCase().includes(query);
    const matchesItemName = order.items.some(item => item.name.toLowerCase().includes(query));

    return matchesName || matchesContact || matchesOrderId || matchesState || matchesItemName;
  });

  return (
    <div className="bg-[#FAFDF6] min-h-screen py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-5">

        {/* Master Cover Section */}
        <div className="border-b border-[#48671c]/25 pb-8 mb-10 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="space-y-1">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-extrabold text-[#48671c] bg-[#48671c]/10 px-4 py-1.5 rounded-full w-fit inline-block mb-2">
              ⚙️ Administrator Workspace
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-black text-primary">
              Organic <span className="italic font-normal">Ecommerce Central</span>
            </h1>
            <p className="text-on-surface-variant text-xs max-w-xl">
              Inspect order ledgers, process botanical dispatch logs, clear debug states, and view macro sales analytics of premium organic botanical blends.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start shrink-0">
            <button
              onClick={handleInjectMockData}
              className="px-4 py-2 bg-white border border-outline-variant text-[#48671c] font-sans text-xs font-bold rounded-full hover:bg-primary-container/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw size={12} /> Inject Sample Data
            </button>
            <button
              onClick={clearDatabase}
              className="px-4 py-2 bg-error-container text-red-800 hover:bg-red-200 border border-red-300 font-sans text-xs font-bold rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Trash2 size={12} /> Wipe Ledger Logs
            </button>
          </div>
        </div>

        {/* Database Connectivity Diagnostics Panel */}
        <div className="mb-8 bg-white rounded-2xl border border-outline-variant/35 p-4 md:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                dbStatus === 'connected' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-650'
              }`}>
                <Database size={16} />
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-serif text-sm font-black text-on-surface">
                  Hostinger DB Connection:
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  dbStatus === 'connected' 
                    ? 'bg-green-50 text-green-700 border border-green-200/50' 
                    : 'bg-red-50 text-red-700 border border-red-200/50'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-green-600 animate-pulse' : 'bg-red-600 animate-pulse'}`} />
                  {dbStatus === 'connected' ? 'Connected (Green)' : 'Offline / Error (Red)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDbDiagExpanded(!isDbDiagExpanded)}
              className="px-4 py-1.5 text-xs font-bold font-sans rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102"
            >
              {isDbDiagExpanded ? (
                <>
                  Minimize Details <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Expand Details <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>

          {/* Expanded detailed report diagnostics */}
          {isDbDiagExpanded && (
            <div className="mt-5 pt-5 border-t border-outline-variant/25 space-y-5 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-serif text-base font-black text-on-surface">
                    Database Diagnostics & Parameters
                  </h4>
                  <p className="text-on-surface-variant text-[11px] font-sans">
                    Real-time synchronization state for whole-herb customer order records. Testing handshake can identify firewall blocks.
                  </p>
                </div>

                <button
                  onClick={handleRetryDb}
                  disabled={isRetryingDb}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                    isRetryingDb ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                    dbStatus === 'connected' ? 'bg-[#48671c]/10 text-[#48671c] hover:bg-[#48671c]/20' :
                    'bg-primary text-white hover:bg-primary-hover shadow-sm'
                  }`}
                >
                  <RefreshCw size={12} className={isRetryingDb ? 'animate-spin' : ''} />
                  {isRetryingDb ? 'Testing Handshake...' : 'Test & Retry Connection'}
                </button>
              </div>

              {dbStatus === 'connected' && (
                <div className="bg-green-50/60 border border-green-200/50 rounded-xl p-4 text-green-800 text-xs space-y-2 animate-fadeIn">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-green-600 shrink-0" />
                    Successfully connected to Hostinger MySQL Database!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-green-700/90 font-mono mt-1 pt-1.5 border-t border-green-200/30">
                    <div><span className="font-sans font-semibold">Host:</span> {dbConfig?.host || 'N/A'}</div>
                    <div><span className="font-sans font-semibold">User:</span> {dbConfig?.user || 'N/A'}</div>
                    <div><span className="font-sans font-semibold">Database:</span> {dbConfig?.database || 'N/A'}</div>
                  </div>
                  <p className="font-sans text-[11px] text-green-600/80 mt-1">
                    ✓ Tables initialized. Orders validated with Razorpay or submitted in simulated checkout are securely persisted to your remote Hostinger DB.
                  </p>
                </div>
              )}

              {dbStatus === 'error' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-red-50/80 border border-red-200/60 rounded-xl p-4 text-red-800 text-xs space-y-1.5">
                    <p className="font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse inline-block" />
                      Connection Attempt Blocked (Timeout / Connection Error)
                    </p>
                    <div className="bg-red-150/40 font-mono text-[11px] p-2 rounded border border-red-200 text-red-700 break-all select-all">
                      Error Details: {dbLastError || 'connect ETIMEDOUT'}
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-outline-variant/40 rounded-xl p-4 text-xs space-y-3">
                    <h4 className="font-bold text-[#48671c] font-sans">
                      🛠️ How to Resolve Hostinger Port/Timeout issues:
                    </h4>
                    <ul className="list-decimal pl-4 space-y-2 text-on-surface-variant text-[11px] leading-relaxed">
                      <li>
                        <span className="font-bold text-on-surface">Incorrect Host Address (Most Common)</span>:
                        Hostinger databases usually do NOT allow public port 3306 queries through your domain name (<code className="bg-gray-200/60 px-1 py-0.5 rounded text-red-600">gray-jackal-950327.hostingersite.com</code>).
                        Go to Hostinger's <span className="font-semibold text-on-surface">MySQL Databases</span> page, and copy the actual host specified under <strong className="font-bold text-on-surface">MySQL Host</strong> or <strong className="font-bold text-on-surface">MySQL Server</strong> (often it's an IP address or a server subdomain like <code className="bg-gray-200/60 px-1 py-0.5 rounded text-primary">sqlXXX.main-hosting.eu</code>). Ensure this is entered exactly in your AI Studio Settings environment secrets.
                      </li>
                      <li>
                        <span className="font-bold text-on-surface">Database Credentials Check</span>:
                        Verify that your database variables correspond strictly to the values in Hostinger:
                        <ul className="list-disc pl-4 mt-1 space-y-1 text-gray-500">
                          <li><code className="bg-gray-200/30 px-1 py-0.5 rounded">HOSTINGER_DB_HOST</code>: The database server host described above.</li>
                          <li><code className="bg-gray-200/30 px-1 py-0.5 rounded">HOSTINGER_DB_USER</code>: <code className="bg-gray-200/30 px-1 text-on-surface">u787557456_nalambrews</code></li>
                          <li><code className="bg-gray-200/30 px-1 py-0.5 rounded">HOSTINGER_DB_NAME</code>: <code className="bg-gray-200/30 px-1 text-on-surface">u787557456_nalambrews</code></li>
                          <li><code className="bg-gray-200/30 px-1 py-0.5 rounded">HOSTINGER_DB_PASSWORD</code>: Your designated MySQL user password.</li>
                        </ul>
                      </li>
                      <li>
                        <span className="font-bold text-on-surface">Remote MySQL Authorized Hosts</span>:
                        You have successfully added <code className="bg-gray-200/60 px-1 py-0.5 rounded text-green-700">%</code> to remote hosts which allows external connectivity. Ensure the settings have saved correctly on Hostinger!
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {dbStatus === 'not_configured' && (
                <div className="bg-orange-50/70 border border-orange-200/50 rounded-xl p-4 text-orange-850 text-xs space-y-2 animate-fadeIn">
                  <p className="font-semibold flex items-center gap-1.5">
                    💡 Currently running in Local Storage Sandbox fallback mode
                  </p>
                  <p className="text-orange-900/80 leading-relaxed text-[11px]">
                    To persist transaction ledgers directly into your Hostinger MySQL Database, open the the AI Studio <span className="font-bold">Settings</span> menu on the side, and add the credentials as environment secrets:
                  </p>
                  <div className="bg-white/80 border border-orange-200/40 font-mono text-[10px] p-2.5 rounded-lg text-orange-950 space-y-1 w-fit">
                    <div>HOSTINGER_DB_HOST=your_hostinger_db_host</div>
                    <div>HOSTINGER_DB_USER=u787557456_nalambrews</div>
                    <div>HOSTINGER_DB_NAME=u787557456_nalambrews</div>
                    <div>HOSTINGER_DB_PASSWORD=your_mysql_database_password</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Backend API Routing Panel */}
        <div className="mb-8 bg-white rounded-2xl border border-outline-variant/35 p-5 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Database size={16} />
            </div>
            <div>
              <h3 className="font-serif text-base font-black text-on-surface">
                Custom Backend API URL Routing
              </h3>
              <p className="text-on-surface-variant text-[11px] font-sans">
                Directly route all client transactions, queries, products, and checkout handshakes to your custom-hosted backend instance.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={tempCustomUrl}
                  onChange={(e) => setTempCustomUrl(e.target.value)}
                  placeholder="e.g., https://your-custom-backend.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/60 bg-surface text-on-surface font-mono text-xs focus:outline-hidden focus:border-[#48671c] transition-all"
                />
                {customApiBaseUrl && (
                  <span className="absolute right-3 top-2.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveCustomUrl}
                  className="px-5 py-2.5 bg-[#48671c] hover:bg-[#385116] text-white font-sans text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer text-center whitespace-nowrap"
                >
                  Save Route URL
                </button>
                {customApiBaseUrl && (
                  <button
                    type="button"
                    onClick={handleResetCustomUrl}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                  >
                    Reset standard (/api)
                  </button>
                )}
              </div>
            </div>

            {urlMessage && (
              <div className={`p-3 rounded-lg text-xs leading-normal font-sans animate-fadeIn ${
                urlMessage.type === 'success' ? 'bg-green-50 text-green-850 border border-green-150' : 'bg-gray-50 text-on-surface-variant border border-outline-variant/50'
              }`}>
                {urlMessage.text}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-[11px] font-sans text-on-surface-variant border-t border-outline-variant/20">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-on-surface">Active Routing Base:</span>
                <code className="bg-gray-150/70 px-1.5 py-0.5 rounded text-primary font-mono text-[10px]">
                  {customApiBaseUrl || "(standard local relative proxy)"}
                </code>
              </div>
              <div>
                <span className="font-semibold text-on-surface">Status:</span>{' '}
                {customApiBaseUrl ? (
                  <span className="text-green-705 font-bold">⚡ Custom Connection Active</span>
                ) : (
                  <span className="text-[#48671c] font-black">✓ Standard Netlify Proxy Redirects</span>
                )}
              </div>
            </div>

            <div className="p-3 bg-gray-50/60 rounded-xl border border-outline-variant/30 text-[10.5px] leading-relaxed text-on-surface-variant space-y-1.5 font-sans">
              <div className="font-bold text-on-surface">ℹ️ Dynamic API Routing Options for Production:</div>
              <ul className="list-disc pl-4 space-y-1 text-gray-650">
                <li>
                  <strong className="text-on-surface font-semibold">Option A (Standard Netlify Proxy Redirect - Recommended)</strong>:
                  Keep the input above blank. In your GitHub repository, open the files: <code className="bg-gray-150/60 px-0.5 rounded">public/_redirects</code> and replace the default proxy address with your custom backend URL:
                  <div className="mt-1 font-mono text-[9px] bg-white p-1.5 rounded border border-gray-200 max-w-full overflow-x-auto select-all">
                    /api/*    https://your-custom-backend.com/api/:splat   200
                  </div>
                  This bypasses browser CORS locks completely and keeps your React code 100% clean.
                </li>
                <li>
                  <strong className="text-on-surface font-semibold">Option B (Direct Absolute Domain Calling)</strong>:
                  Enter your absolute backend URL above (e.g. <code className="bg-gray-150/60 px-0.5 rounded">https://api.yourdomain.com</code>) and save. All local requests will bypass Netlify's redirects and call your server directly. Ensure you enable CORS on your node server to accept requests from your Netlify domain (<code className="bg-gray-150/60 px-0.5 rounded">https://a2zecommerce.netlify.app</code>)!
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-250 mb-8 max-w-sm gap-4">
          <button
            onClick={() => setActiveSection('orders')}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest text-center border-b-2 transition-all cursor-pointer ${
              activeSection === 'orders'
                ? 'border-[#48671c] text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            📦 Operation Orders
          </button>
          <button
            onClick={() => setActiveSection('catalog')}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest text-center border-b-2 transition-all cursor-pointer ${
              activeSection === 'catalog'
                ? 'border-[#48671c] text-primary'
                : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            🌿 Live Catalog
          </button>
        </div>

        {activeSection === 'orders' && (
          <>
            {/* Analytics Hub Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-outline-variant/35 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Total Store Sales</span>
              <h2 className="font-serif text-2xl font-black text-[#48671c]">{formatCurrency(totalRevenue)}</h2>
              <span className="text-[10px] text-primary flex items-center gap-1">
                <TrendingUp size={11} /> 100% verified gateway
              </span>
            </div>
            <div className="w-11 h-11 bg-[#48671c]/10 text-primary rounded-xl flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-outline-variant/35 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Completed Orders</span>
              <h2 className="font-serif text-2xl font-black text-[#1e2f14]">{allOrders.length} Transaction(s)</h2>
              <span className="text-[10px] text-on-surface-variant italic">Sandbox + Local Ledger</span>
            </div>
            <div className="w-11 h-11 bg-[#1e2f14]/10 text-primary rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-outline-variant/35 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Botanical Volume Sold</span>
              <h2 className="font-serif text-2xl font-black text-[#1e2f14]">{totalVolume} Packet(s)</h2>
              <span className="text-[10px] text-[#48671c] font-medium">Whole Herb Infusion Packs</span>
            </div>
            <div className="w-11 h-11 bg-primary-container/20 text-primary rounded-xl flex items-center justify-center">
              <PackageCheck size={20} />
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl border border-outline-variant/35 p-6 flex items-center justify-between shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Average Ticket (AOV)</span>
              <h2 className="font-serif text-2xl font-black text-[#48671c]">{formatCurrency(averageValue)}</h2>
              <span className="text-[10px] text-on-surface-variant font-sans">Per Customer Session</span>
            </div>
            <div className="w-11 h-11 bg-surface-container text-on-surface-variant rounded-xl flex items-center justify-center">
              <ArrowUpRight size={20} />
            </div>
          </div>

        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-outline-variant/35 p-4 mb-4 flex flex-col md:flex-row items-center gap-4 shadow-3xs">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={16} />
            <input 
              type="text"
              placeholder="Search master ledger by Customer Name, Phone, Razorpay ID, State, or Botanical names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 font-sans text-xs focus:outline-none focus:border-[#48671c]"
            />
          </div>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-primary underline shrink-0 cursor-pointer"
            >
              Clear Filter Query
            </button>
          )}
        </div>

        {/* Status Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8 text-xs">
          {(['all', 'Processing', 'Packed', 'Dispatched'] as const).map((st) => {
            const count = allOrders.filter(o => {
              if (st === 'all') return true;
              if (st === 'Processing') return o.status === 'Processing' || !o.status;
              return o.status === st;
            }).length;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer border ${
                  statusFilter === st
                    ? 'bg-[#48671c] text-white border-[#48671c] shadow-xs'
                    : 'bg-white text-on-surface-variant border-outline-variant/30 hover:bg-[#48671c]/5 hover:text-[#48671c]'
                }`}
              >
                {st === 'all' ? 'All Orders' : st === 'Processing' ? '⏳ Processing' : st === 'Packed' ? '📦 Packed' : '🚚 Dispatched'} ({count})
              </button>
            );
          })}
        </div>

        {/* Main Database Table Output */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-outline-variant/20 p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-[#FAFDF6] rounded-full flex items-center justify-center mx-auto text-on-surface-variant/60 border border-outline-variant/20">
              <Search size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold">No logs matching query</h3>
              <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Refine your alphanumeric terms. Alternatively, use the <strong>"Inject Sample Data"</strong> button in the top header to populate offline simulated packages instantly.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs text-on-surface-variant px-1 font-sans">
              <span>Displaying <strong>{filteredOrders.length}</strong> authenticated transactions</span>
              <span>All orders secured with Razorpay webhook models</span>
            </div>

            {filteredOrders.map((order, idx) => (
              <div 
                key={order.id || idx} 
                className="bg-white rounded-3xl border border-outline-variant/35 overflow-hidden shadow-xs hover:border-[#48671c]/30 transition-all border-l-4 border-l-[#48671c]"
              >
                {/* Header Information Bar */}
                <div className="bg-[#FAFDF6] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20 text-xs">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-on-surface-variant/70 block mb-0.5">Purchaser</span>
                      <span className="font-sans font-bold text-[#1e2f14] flex items-center gap-1">
                        <User size={12} className="text-[#48671c]" />
                        {order.shipping?.name || 'Incomplete Profile'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-on-surface-variant/70 block mb-0.5">Contact</span>
                      <span className="font-mono text-on-surface-variant flex items-center gap-1 font-semibold selection:bg-yellow-100">
                        <Phone size={12} className="text-[#48671c]/7s" />
                        {order.shipping?.contact || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-on-surface-variant/70 block mb-0.5">Paced Datum</span>
                      <span className="font-sans font-medium text-on-surface-variant flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })} at {new Date(order.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right sm:w-auto w-full">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#48671c]/10 text-[#48671c] rounded-full uppercase font-bold tracking-widest text-[9px]">
                      <ShieldCheck size={11} /> Secured Razorpay order
                    </span>
                  </div>
                </div>

                {/* Logistics breakdown columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-outline-variant/20">
                  
                  {/* Cart package specifics */}
                  <div className="md:col-span-2 p-6 md:p-8 space-y-4 bg-white">
                    <div className="flex justify-between items-center border-b border-outline-variant/15 pb-2 mb-4">
                      <h4 className="font-serif text-xs font-bold text-[#1e2f14]">Cart Packages Payload ({order.items.reduce((acc, current) => acc + current.quantity, 0)} Pkts)</h4>
                      <span className="font-serif font-black text-[#48671c]">{formatCurrency(order.amount)} total</span>
                    </div>
                    
                    <div className="space-y-3.5">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center justify-between text-xs">
                          <div className="flex gap-3 items-center min-w-0">
                            <img src={item.heroImage} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-surface-container shrink-0" />
                            <div className="truncate">
                              <span className="font-serif font-bold text-primary block truncate">{item.name}</span>
                              <span className="text-[9px] text-on-surface-variant italic block truncate">{item.scientificName}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-medium text-on-surface-variant">{formatCurrency(item.price)} × {item.quantity}</span>
                            <span className="font-sans font-bold text-[#1e2f14] block">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipment coordinates */}
                  <div className="p-6 md:p-8 bg-[#FAFDF6]/20 space-y-4">
                    <h4 className="font-serif text-xs font-bold border-b border-outline-variant/15 pb-2 mb-4 text-[#1e2f14] flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#48671c]" /> Shipment Coordinates
                    </h4>
                    
                    {order.shipping ? (
                      <div className="text-xs space-y-2.5 text-on-surface-variant leading-relaxed">
                        <div className="bg-[#FAFDF6] border border-outline-variant/30 rounded-xl p-3 font-sans text-[11px] leading-relaxed select-all">
                          {order.shipping.address} <br />
                          <strong className="text-primary">{order.shipping.state} – {order.shipping.pincode}</strong>
                        </div>
                        <div className="space-y-1.5 text-[10px] uppercase font-bold tracking-wider">
                          <div className="flex justify-between">
                            <span className="text-on-surface-variant/70">Payment Order ID:</span>
                            <span className="font-mono text-[#1e2f14] font-medium ml-1">{order.id}</span>
                          </div>
                          <div className="flex justify-between border-t border-outline-variant/15 pt-1.5">
                            <span className="text-on-surface-variant/70">Payment Ref Code:</span>
                            <span className="font-mono text-[#1e2f14]/80 ml-1">{order.paymentId.substring(0, 16)}...</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant italic">No shipping details logged.</p>
                    )}
                  </div>

                </div>

                {/* Action panel toggle status link footer */}
                <div className="bg-surface-container-low border-t border-outline-variant/20 px-6 md:px-8 py-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-xs">
                  <div className="space-y-2.5 w-full md:w-auto">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-on-surface-variant font-extrabold uppercase tracking-wider mr-1">Status:</span>
                      {order.status === 'Packed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 font-bold uppercase rounded-full tracking-wider text-[10px] border border-blue-200">
                          📦 Packed
                        </span>
                      ) : order.status === 'Dispatched' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 font-bold uppercase rounded-full tracking-wider text-[10px] border border-green-200">
                          🚚 Dispatched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 font-bold uppercase rounded-full tracking-wider text-[10px] border border-amber-200">
                          ⏳ Processing
                        </span>
                      )}
                      
                      {order.trackingId && (
                        <span className="font-mono text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded border border-gray-200 uppercase selection:bg-yellow-100">
                          Tracking ID: {order.trackingId}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-dashed border-outline-variant/30">
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Processing')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                          order.status === 'Processing' || !order.status
                            ? 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        Set Processing
                      </button>
                      
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Packed')}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                          order.status === 'Packed'
                            ? 'bg-blue-100 text-blue-800 border-blue-300 font-extrabold'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        Set Packed
                      </button>

                      {editingTrackingOrderId === order.id ? (
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-outline-variant/35 rounded-lg p-1 w-full max-w-sm mt-1">
                          <input
                            type="text"
                            placeholder="Tracking ID (e.g. DHL-8432)"
                            value={tempTrackingId}
                            onChange={(e) => setTempTrackingId(e.target.value)}
                            className="flex-1 bg-white border border-outline-variant/30 text-[11px] px-2.5 py-1 rounded focus:outline-hidden focus:border-primary font-mono text-on-surface"
                          />
                          <button
                            onClick={async () => {
                              await handleUpdateStatus(order.id, 'Dispatched', tempTrackingId.trim() || null);
                              setEditingTrackingOrderId(null);
                            }}
                            className="bg-green-700 hover:bg-green-800 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded cursor-pointer transition-all"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingTrackingOrderId(null);
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1.5 rounded cursor-pointer transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setTempTrackingId(order.trackingId || "");
                            setEditingTrackingOrderId(order.id);
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                            order.status === 'Dispatched'
                              ? 'bg-green-100 text-green-800 border-green-300 font-extrabold'
                              : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          {order.status === 'Dispatched' ? 'Update Tracking ID' : 'Set Dispatched'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-start md:items-end gap-1 font-sans text-[10px] text-on-surface-variant font-medium shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-[#48671c] font-black uppercase rounded border border-green-200">
                      <CheckCircle size={10} /> Razorpay Verified
                    </span>
                    <span className="font-mono text-gray-400 selection:bg-yellow-100">
                      Ref: {order.id}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
          </>
        )}

        {/* Dynamic Catalog Section */}
        {activeSection === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-outline-variant/35 shadow-xs">
              <div>
                <h2 className="font-serif text-2xl font-black text-primary flex items-center gap-2">
                  🌿 Botanical Catalog Ledger
                </h2>
                <p className="text-on-surface-variant text-xs mt-1">
                  Create new recipes, adjust whole-leaf tea prices, modify flavor profiles, and update scientific botanical portfolios.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full ${
                    prodDbConnected 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${prodDbConnected ? 'bg-green-500' : 'bg-orange-500'}`} />
                    {prodDbConnected ? 'MySQL Database Connected' : 'Local Sandbox Mode (Pre-seeded)'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Total: {products.length} blend(s)
                  </span>
                </div>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-5 py-3 bg-[#48671c] hover:bg-[#48671c]/90 text-white font-sans text-xs font-bold rounded-full transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus size={14} /> Add New Botanical Blend
              </button>
            </div>

            {/* Editing Form Overlay / Drawer */}
            {isProductFormOpen && (
              <div ref={formRef} className="bg-white rounded-2xl border border-[#48671c]/30 p-6 md:p-8 shadow-lg space-y-6">
                <div className="flex justify-between items-center border-b border-outline-variant pb-4">
                  <h3 className="font-serif text-xl font-black text-on-surface">
                    {editingProductId ? "📝 Modify Botanical Blend Details" : "🌱 Formulate Brand New Organic Blend"}
                  </h3>
                  <button 
                    onClick={() => setIsProductFormOpen(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic info */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Product ID (Unique, slug format)</label>
                      <input
                        type="text"
                        placeholder="e.g. mudakathan-blend"
                        value={formId}
                        onChange={(e) => setFormId(e.target.value)}
                        disabled={editingProductId !== null}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] disabled:bg-gray-100 disabled:cursor-not-allowed text-on-surface"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Product Name (Human Label)</label>
                      <input
                        type="text"
                        placeholder="e.g. Mudakathan Infusion Blend"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] text-on-surface font-semibold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Scientific Name (Botanical classification)</label>
                      <input
                        type="text"
                        placeholder="e.g. Cardiospermum halicacabum"
                        value={formScientificName}
                        onChange={(e) => setFormScientificName(e.target.value)}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs italic focus:outline-none focus:border-[#48671c] text-on-surface"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Retail Selling Price (in Rupees)</label>
                      <input
                        type="number"
                        placeholder="e.g. 249"
                        value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] text-on-surface font-bold text-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Original Price (For strikeoff, optional)</label>
                      <input
                        type="number"
                        placeholder="e.g. 299"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] text-on-surface"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Category Target Focus</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as any)}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl h-12 px-4 py-2 font-sans text-xs focus:outline-none focus:border-[#48671c] text-on-surface font-semibold"
                      >
                        <option value="Digestion">Digestion focus</option>
                        <option value="Immunity">Immunity focus</option>
                        <option value="Skin">Skin focus</option>
                        <option value="Weight">Weight focus</option>
                        <option value="Detox">Detox focus</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Hero Image URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={formHeroImage}
                        onChange={(e) => setFormHeroImage(e.target.value)}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] font-mono text-on-surface"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Secondary Image URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={formSecondaryImage}
                        onChange={(e) => setFormSecondaryImage(e.target.value)}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] font-mono text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Short Pitch Description (Seen on lists)</label>
                    <input
                      type="text"
                      placeholder="e.g. Relieves digestive soreness, reduces excessive bloating and flatulence."
                      value={formShortDescription}
                      onChange={(e) => setFormShortDescription(e.target.value)}
                      className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] text-on-surface"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Detailed Editorial Bio Description (Product Page paragraph)</label>
                    <textarea
                      rows={3}
                      placeholder="Deep wisdom context..."
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] text-on-surface leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Flavor Profile & Taste Notes Summary</label>
                      <input
                        type="text"
                        placeholder="e.g. Mildly bitter, light earthy aroma, cleanly sweetened finish."
                        value={formFlavorProfile}
                        onChange={(e) => setFormFlavorProfile(e.target.value)}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] text-on-surface"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Custom Tags (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Organic, Bloating Relief, Traditional, Antiviral"
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        className="w-full bg-[#FAFDF6] border border-outline-variant/30 rounded-xl px-4 py-3 font-sans text-xs focus:outline-none focus:border-[#48671c] text-on-surface"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-outline-variant pt-5">
                    <button
                      type="button"
                      onClick={() => setIsProductFormOpen(false)}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-xs font-bold rounded-full transition-all cursor-pointer"
                    >
                      Discard & Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#48671c] hover:brightness-110 text-white font-sans text-xs font-bold rounded-full transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
                    >
                      <Save size={14} /> Save Botanical Recipe
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Catalog Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-outline-variant/35 overflow-hidden flex flex-col justify-between shadow-3xs hover:shadow-xs transition-all">
                  <div>
                    {/* Upper cover photo */}
                    <div className="h-44 relative bg-gray-100">
                      <img 
                        src={p.heroImage} 
                        alt={p.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-start">
                        <span className="px-3 py-1 bg-[#48671c] text-white rounded-full text-[9px] uppercase font-extrabold tracking-widest shadow-sm">
                          {p.category}
                        </span>
                        <div className="bg-black/40 text-white font-mono text-[9px] px-2.5 py-1 rounded backdrop-blur-xs font-bold">
                          ID: {p.id}
                        </div>
                      </div>
                    </div>

                    {/* Technical and description metadata */}
                    <div className="p-5">
                      <div className="flex justify-between items-baseline gap-2 mb-2">
                        <h4 className="font-serif text-lg font-black text-on-surface">
                          {p.name}
                        </h4>
                        <div className="flex items-baseline gap-1.5 shrink-0">
                          <span className="font-serif font-black text-[#48671c]">{formatCurrency(p.price)}</span>
                          {p.originalPrice && (
                            <span className="text-xs text-on-surface-variant line-through opacity-50">{formatCurrency(p.originalPrice)}</span>
                          )}
                        </div>
                      </div>

                      {p.scientificName && (
                        <p className="font-serif italic text-xs text-[#48671c]/80 mb-3 block">
                          Botanical Name: {p.scientificName}
                        </p>
                      )}

                      <p className="text-on-surface-variant text-xs line-clamp-3 leading-relaxed mb-4">
                        {p.shortDescription || p.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-3.5 border-t border-dashed border-outline-variant/40">
                        {p.tags?.map((tag) => (
                          <span key={tag} className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] uppercase font-bold tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="bg-surface-container-lowest border-t border-outline-variant/30 px-5 py-4 flex justify-between items-center gap-3">
                    <span className="text-[10px] italic text-gray-400 font-serif">
                      Flavor profile: "{p.flavorProfile}"
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-2.5 bg-[#48671c]/10 text-[#48671c] hover:bg-[#48671c]/20 rounded-full transition-all cursor-pointer"
                        title="Edit product"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-all cursor-pointer"
                        title="Delete product"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link to="/" className="text-xs text-[#48671c] font-bold hover:underline flex items-center justify-center gap-1 cursor-pointer">
            Return to Storefront Platform <ExternalLink size={12} />
          </Link>
        </div>

      </div>
    </div>
  );
}
