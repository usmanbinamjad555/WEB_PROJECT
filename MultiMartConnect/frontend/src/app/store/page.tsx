'use client';

import React, { useState, useEffect } from 'react';

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discountFlag: string;
  category: string;
  stock: number;
  salesVelocity: number;
  rating: number;
  reviewsCount: number;
  shippingOrigin: string;
}

export default function DynamicallyBoundStorefront() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState<{ title: string; price: number; qty: number }[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Dynamic Authentication Session Tracking Hook
  const [session, setSession] = useState<{ email: string; role: string; tenant: string } | null>(null);
  
  // UI Interactive Toggle States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [vouchersClaimed, setVouchersClaimed] = useState<string[]>([]);
  
  // Real-Time Flash Sale Countdown States
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 34, seconds: 12 });

  // 1. Derived State: Automatically derive total cart count directly from cartItems
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // 2. Unified App Lifecycle: Handle Session Initialization & Cache Recovery Sequentially
  useEffect(() => {
    setHasMounted(true);
    
    const initializeEcosystem = async () => {
      const activeUser = localStorage.getItem('mm_session');
      
      if (activeUser) {
        const parsedSession = JSON.parse(activeUser);
        setSession(parsedSession);

        // Fetch cached cart data sequentially from Redis engine on initial boot
        try {
          const response = await fetch(`http://localhost:8000/api/cart/${parsedSession.email}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setCartItems(data);
            }
          }
        } catch (err) {
          console.error("Could not recover database cache records from Redis engine:", err);
        }
      }
    };

    initializeEcosystem();

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const marketplaceCategories = [
    { name: 'All', icon: '📱' },
    { name: 'Electronic Devices', icon: '💻' },
    { name: 'Groceries & Pets', icon: '🍏' },
    { name: 'Fashion & Accessories', icon: '👟' },
    { name: 'Home & Lifestyle', icon: '🏠' },
    { name: 'Health & Beauty', icon: '💄' }
  ];

  // MASSIVE EXPANDED SEED DATA MATRIX
  const mockDarazProducts: MarketplaceItem[] = [
    // --- Electronic Devices ---
    { id: 'd1', title: 'Quantum Alpha Edition Core Intel i9 Multi-Thread Laptop', price: 1199.00, originalPrice: 1599.00, discountFlag: '25% OFF', category: 'Electronic Devices', stock: 8, salesVelocity: 75, rating: 4.9, reviewsCount: 84, shippingOrigin: 'Islamabad' },
    { id: 'd2', title: 'Pro Noise-Isolating Ergonomic Bluetooth Wireless Headset', price: 89.99, originalPrice: 199.99, discountFlag: '55% OFF', category: 'Electronic Devices', stock: 14, salesVelocity: 42, rating: 4.7, reviewsCount: 112, shippingOrigin: 'Rawalpindi' },
    { id: 'd6', title: 'ApexCharge 65W GaN Ultra-Fast Multi-Port Wall Charger', price: 34.50, originalPrice: 49.99, discountFlag: '31% OFF', category: 'Electronic Devices', stock: 120, salesVelocity: 88, rating: 4.8, reviewsCount: 240, shippingOrigin: 'Karachi' },
    { id: 'd7', title: 'StreamSync 4K Ultra-HD Webcam with Dual Noise-Canceling Mics', price: 75.00, originalPrice: 120.00, discountFlag: '37% OFF', category: 'Electronic Devices', stock: 22, salesVelocity: 54, rating: 4.5, reviewsCount: 67, shippingOrigin: 'Lahore' },
    { id: 'd16', title: 'TitanVibe Portable Waterproof Rugged Bluetooth Speaker', price: 45.99, originalPrice: 89.99, discountFlag: '48% OFF', category: 'Electronic Devices', stock: 19, salesVelocity: 63, rating: 4.6, reviewsCount: 148, shippingOrigin: 'Faisalabad' },

    // --- Groceries & Pets ---
    { id: 'd8', title: 'Premium Arabica Cold-Brew Artisanal Whole Bean Coffee (1kg)', price: 18.99, originalPrice: 24.99, discountFlag: '24% OFF', category: 'Groceries & Pets', stock: 45, salesVelocity: 61, rating: 4.9, reviewsCount: 189, shippingOrigin: 'Islamabad' },
    { id: 'd9', title: 'Organic Cold-Pressed Extra Virgin Olive Oil Extract (500ml)', price: 14.20, originalPrice: 19.99, discountFlag: '29% OFF', category: 'Groceries & Pets', stock: 60, salesVelocity: 70, rating: 4.6, reviewsCount: 95, shippingOrigin: 'Karachi' },
    { id: 'd10', title: 'NutriBite High-Protein Grain-Free Dry Salmon Adult Cat Food', price: 28.50, originalPrice: 35.00, discountFlag: '18% OFF', category: 'Groceries & Pets', stock: 12, salesVelocity: 83, rating: 4.7, reviewsCount: 142, shippingOrigin: 'Lahore' },
    { id: 'd17', title: 'PureHarvest Himalayan Pink Salt Fine Grain Shaker (1.5kg)', price: 6.50, originalPrice: 9.99, discountFlag: '35% OFF', category: 'Groceries & Pets', stock: 200, salesVelocity: 30, rating: 4.8, reviewsCount: 520, shippingOrigin: 'Multan' },

    // --- Fashion & Accessories ---
    { id: 'd4', title: 'Minimalist Anodized Tactical Vacuum Sealed Hydro Flask', price: 15.50, originalPrice: 45.00, discountFlag: '65% OFF', category: 'Fashion & Accessories', stock: 140, salesVelocity: 15, rating: 4.4, reviewsCount: 204, shippingOrigin: 'Overseas' },
    { id: 'd11', title: 'Vanguard Water-Resistant Modular Anti-Theft Travel Backpack', price: 65.00, originalPrice: 99.99, discountFlag: '35% OFF', category: 'Fashion & Accessories', stock: 34, salesVelocity: 49, rating: 4.8, reviewsCount: 310, shippingOrigin: 'Rawalpindi' },
    { id: 'd12', title: 'Chrono-Classic Brushed Stainless Steel Minimalist Quartz Watch', price: 110.00, originalPrice: 220.00, discountFlag: '50% OFF', category: 'Fashion & Accessories', stock: 7, salesVelocity: 92, rating: 4.6, reviewsCount: 53, shippingOrigin: 'Lahore' },
    { id: 'd18', title: 'UrbanFit Breathable Lightweight Comfort Walking Sneakers', price: 49.00, originalPrice: 79.99, discountFlag: '38% OFF', category: 'Fashion & Accessories', stock: 41, salesVelocity: 77, rating: 4.5, reviewsCount: 165, shippingOrigin: 'Sialkot' },

    // --- Home & Lifestyle ---
    { id: 'd3', title: 'Aero-Weave Lumbar Align Dynamic Executive Office Chair', price: 240.00, originalPrice: 300.00, discountFlag: '20% OFF', category: 'Home & Lifestyle', stock: 3, salesVelocity: 90, rating: 4.6, reviewsCount: 39, shippingOrigin: 'Lahore' },
    { id: 'd13', title: 'LuminaSense Smart Ambient RGB LED Sound-Reactive Desk Lamp', price: 42.00, originalPrice: 59.99, discountFlag: '30% OFF', category: 'Home & Lifestyle', stock: 19, salesVelocity: 66, rating: 4.4, reviewsCount: 118, shippingOrigin: 'Islamabad' },
    { id: 'd14', title: 'PureBreeze 3-Stage True HEPA Smart Room Air Purifier', price: 135.00, originalPrice: 180.00, discountFlag: '25% OFF', category: 'Home & Lifestyle', stock: 5, salesVelocity: 72, rating: 4.7, reviewsCount: 81, shippingOrigin: 'Karachi' },
    { id: 'd19', title: 'EcoSleep Hypoallergenic Memory Foam Cooling Pillow Pack', price: 38.00, originalPrice: 60.00, discountFlag: '36% OFF', category: 'Home & Lifestyle', stock: 14, salesVelocity: 58, rating: 4.3, reviewsCount: 92, shippingOrigin: 'Gujranwala' },

    // --- Health & Beauty ---
    { id: 'd5', title: 'Organic Cold-Pressed Vitamin E Repair Facial Oil Complex', price: 24.00, originalPrice: 48.00, discountFlag: '50% OFF', category: 'Health & Beauty', stock: 0, salesVelocity: 100, rating: 4.8, reviewsCount: 341, shippingOrigin: 'Karachi' },
    { id: 'd15', title: 'HydroVital Hyaluronic Acid Intense Rehydration Serum Cream', price: 19.50, originalPrice: 29.99, discountFlag: '35% OFF', category: 'Health & Beauty', stock: 85, salesVelocity: 40, rating: 4.5, reviewsCount: 219, shippingOrigin: 'Rawalpindi' },
    { id: 'd20', title: 'GlowRadiance Advanced Cica Cleansing Exfoliating Face Wash', price: 12.99, originalPrice: 22.00, discountFlag: '40% OFF', category: 'Health & Beauty', stock: 55, salesVelocity: 69, rating: 4.7, reviewsCount: 134, shippingOrigin: 'Islamabad' }
  ];

  const handleSearchExecute = () => {
    setActiveSearch(searchQuery);
  };

  const handleClaimVoucher = (voucherId: string) => {
    if (vouchersClaimed.includes(voucherId)) {
      alert('🎫 Order Notification: This discount voucher is already applied to your account session.');
      return;
    }
    setVouchersClaimed(prev => [...prev, voucherId]);
    alert('🎉 Success! 10% discount voucher has been saved and will apply automatically at checkout.');
  };

  // 3. Event-Driven Syncing Architecture: Compute structural changes and sync atomically
  const handleAddToCart = async (product: MarketplaceItem) => {
    let updatedCart;
    const existing = cartItems.find(item => item.title === product.title);
    
    if (existing) {
      updatedCart = cartItems.map(item => item.title === product.title ? { ...item, qty: item.qty + 1 } : item);
    } else {
      updatedCart = [...cartItems, { title: product.title, price: product.price, qty: 1 }];
    }
    
    // Optimistic local UI state population
    setCartItems(updatedCart);
    alert(`🛒 Added to Basket: [${product.title}] has been added to your cart. Click the cart icon at the top to view your items.`);

    // Atomic backend serialization
    if (session?.email) {
      try {
        await fetch('http://localhost:8000/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.email,
            cartItems: updatedCart
          })
        });
      } catch (err) {
        console.error("Failed to sync cart data with Redis caching engine:", err);
      }
    }
  };

  const filteredProducts = mockDarazProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-[#f4f4f6] text-[#212121] flex items-center justify-center">
        <div className="text-sm font-bold text-[#f57224] animate-pulse tracking-wide">Loading official store catalog network...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f6] text-[#212121] pb-12 relative overflow-x-hidden">
      
      {/* 1. MAIN RETAIL HUB HEADER NAVIGATION */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-[#e2e2e6]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
          
          {/* Brand Logo Wrapper */}
          <a href="/" className="flex items-center gap-2 no-underline shrink-0">
            <div className="bg-[#f57224] text-white font-black px-3 py-1.5 rounded-lg text-2xl tracking-tighter shadow-md">
              MM
            </div>
            <div className="hidden sm:block">
              <span className="text-[#f57224] font-black text-xl tracking-tight block">MultiMart</span>
              <span className="text-[9px] text-[#757575] font-bold tracking-widest uppercase block -mt-1">Official Store</span>
            </div>
          </a>

          {/* Core Product Search Engine */}
          <div className="flex-1 max-w-2xl relative flex">
            <input 
              type="text"
              placeholder="Search for items, top brands, and categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchExecute()}
              className="w-full bg-[#eff0f5] border border-transparent text-[#212121] px-4 py-2.5 rounded-l-lg text-sm focus:outline-none focus:border-[#f57224] focus:bg-white transition-all box-border"
            />
            <button 
              onClick={handleSearchExecute}
              className="bg-[#f57224] border-none text-white font-bold px-6 py-2.5 rounded-r-lg text-sm cursor-pointer hover:bg-[#d65f1c] transition-colors shrink-0"
            >
              🔍 Search
            </button>
          </div>

          {/* Interactive Cart Basket & Profile Triggers */}
          <div className="flex items-center gap-6 shrink-0 relative">
            
            {/* Shopping Cart Button */}
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative bg-transparent border-none cursor-pointer group p-0 text-2xl"
            >
              🛒
              <span className="absolute -top-2 -right-2 bg-[#f57224] text-white font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* Account Management Popover Trigger */}
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 bg-orange-100 border border-orange-200 rounded-full flex items-center justify-center text-sm font-bold text-[#f57224] cursor-pointer hover:bg-orange-200 transition-colors"
            >
              {session ? session.email.charAt(0).toUpperCase() : '?' }
            </button>

            {/* Dynamic Profile Account Panel Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-10 bg-white border border-[#e2e2e6] rounded-xl p-4 shadow-xl w-60 z-50 text-left animate-fadeIn">
                <h4 className="text-xs font-black uppercase text-[#757575] m-0 mb-2 tracking-wider">Your Account Dashboard</h4>
                <div className="text-xs flex flex-col gap-1.5 text-[#424242]">
                  {session ? (
                    <>
                      <div>👤 Profile User: <span className="font-bold text-[#212121]">{session.email}</span></div>
                      <div>🔑 Account Tier: <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">{session.role}</span></div>
                      <div>🏢 Current Store Channel: <code className="text-[#f57224] bg-orange-50 px-1 rounded font-mono">{session.tenant}</code></div>
                      <button 
                        onClick={() => { localStorage.removeItem('mm_session'); setSession(null); window.location.href = '/'; }}
                        className="w-full mt-3 bg-[#eff0f5] border-none text-[#212121] py-1.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-rose-600 hover:text-white transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div>👤 Guest Profile: <span className="font-bold text-amber-600">Browsing Anonymously</span></div>
                      <div>🛡️ Status: <span className="text-[#757575] font-semibold bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">Not Signed In</span></div>
                      <p className="text-[10px] text-[#757575] leading-normal m-0 mt-2 border-t border-[#eff0f5] pt-2">Sign in to claim premium discount vouchers and save items.</p>
                      <a href="/login" className="w-full text-center mt-3 bg-[#f57224] text-white py-1.5 rounded-lg text-xs font-black cursor-pointer hover:bg-[#d65f1c] transition-colors no-underline">
                        Log In Securely
                      </a>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* 2. CATEGORY SIDEBAR & PROMOTIONAL HERO BANNER */}
      <div className="max-w-7xl mx-auto px-4 mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Marketplace Interactive Categories Sidebar */}
        <aside className="bg-white rounded-xl shadow-sm border border-[#e2e2e6] p-2 hidden lg:block text-left">
          <h3 className="text-xs font-black text-[#757575] px-3 py-2 uppercase tracking-wider m-0 border-b border-[#eff0f5]">Product Categories</h3>
          <div className="flex flex-col mt-2">
            {marketplaceCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-3 border-none px-3 py-2.5 text-left text-xs font-bold rounded-lg cursor-pointer transition-all ${selectedCategory === cat.name ? 'bg-orange-50 text-[#f57224]' : 'bg-transparent text-[#424242] hover:bg-[#f4f4f6]'}`}
              >
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Commercial Promotional Interactive Ad Panel */}
        <main className="lg:col-span-3 bg-gradient-to-br from-[#f57224] to-[#ff914d] rounded-xl p-8 flex flex-col justify-between text-white min-h-[260px] shadow-sm relative overflow-hidden group text-left">
          <div className="absolute right-0 bottom-0 text-[180px] opacity-10 select-none font-black leading-none pointer-events-none translate-x-10 translate-y-10">MALL</div>
          <div>
            <div className="bg-white/20 backdrop-blur-md border border-white/20 text-white font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full w-fit mb-4">
              ✨ Seasonal Shopping Festival Hub
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none m-0 max-w-lg text-white">
              Mega Shopping Carnival <br />Get Up to <span className="text-yellow-300">65% Absolute Discounts</span>
            </h2>
            <p className="text-xs text-orange-50 max-w-sm mt-3 leading-relaxed">
              Shop securely across multiple independent brand stores with 100% genuine product guarantees and instant warehouse shipment dispatch tracking.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button 
              onClick={() => handleClaimVoucher('VOUCHER_MALL_10')}
              className="bg-white text-[#f57224] font-black border-none text-xs px-5 py-2.5 rounded-lg shadow-md cursor-pointer hover:bg-orange-50 transition-colors"
            >
              {vouchersClaimed.includes('VOUCHER_MALL_10') ? '🎫 Applied to Profile' : 'Collect 10% Store Voucher'}
            </button>
            <button 
              onClick={() => alert('⚖️ Store Guarantee: Authentic listings. Secured transactions. Support networks are available 24/7 through your operator chat tab module.')}
              className="text-xs font-bold bg-transparent border-none text-orange-50 border-b-2 border-white/60 pb-0.5 cursor-pointer hover:border-white transition-all"
            >
              View Purchase Protections
            </button>
          </div>
        </main>
      </div>

      {/* 3. TIMED LIVE FLASH SALE EVENT MODULE */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white border border-[#e2e2e6] rounded-xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-[#f57224] font-black text-base uppercase tracking-tight m-0">⚡ Limited Flash Deals</h3>
            
            {/* Live Visual Countdown Timer Layout */}
            <div className="flex items-center gap-1.5 text-xs font-black">
              <span className="bg-[#212121] text-white px-2 py-1 rounded">{String(countdown.hours).padStart(2, '0')}</span> :
              <span className="bg-[#212121] text-white px-2 py-1 rounded">{String(countdown.minutes).padStart(2, '0')}</span> :
              <span className="bg-[#212121] text-white px-2 py-1 rounded">{String(countdown.seconds).padStart(2, '0')}</span>
            </div>
          </div>
          <button 
            onClick={() => { setSelectedCategory('All'); setActiveSearch(''); setSearchQuery(''); alert('🔄 Filters Reset: Displaying complete un-filtered vendor product arrays.'); }}
            className="text-xs font-bold text-[#f57224] bg-transparent border-none cursor-pointer hover:underline"
          >
            Clear Filters & View All Products →
          </button>
        </div>
      </div>

      {/* 4. SELECTION DISPLAY CATALOG GRID */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-white text-center rounded-xl p-12 border border-[#e2e2e6]">
            <span className="text-4xl">🔍</span>
            <h4 className="text-[#757575] font-bold text-sm mt-2 m-0">No matching products found in this category layer.</h4>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-[#e2e2e6] rounded-xl overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer text-left"
              >
                {/* Image Placeholder Card Block */}
                <div className="bg-[#f7f8fa] w-full aspect-square flex items-center justify-center relative border-b border-[#eff0f5]">
                  <span className="text-5xl opacity-40 group-hover:scale-110 transition-transform">📦</span>
                  <span className="absolute bottom-2 left-2 bg-[#757575] text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
                    Ship from {product.shippingOrigin}
                  </span>
                  {product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white font-black text-[8px] tracking-wide uppercase px-1.5 py-0.5 rounded shadow-sm">
                      Free Shipping
                    </span>
                  )}
                </div>

                {/* Content Specifications Pricing Data Block */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-[#212121] line-clamp-2 leading-snug m-0 mb-2 group-hover:text-[#f57224] transition-colors">
                      {product.title}
                    </h4>
                    <div className="flex flex-wrap items-baseline gap-1.5 mb-1.5">
                      <span className="text-lg font-black text-[#f57224]">${product.price.toFixed(2)}</span>
                      <span className="text-[10px] text-[#757575] line-through">${product.originalPrice.toFixed(2)}</span>
                    </div>
                    <span className="bg-orange-50 border border-orange-100 text-[#f57224] font-black text-[9px] px-1.5 py-0.5 rounded">
                      {product.discountFlag}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#eff0f5]">
                    {/* Sales Stock Volume Indicator Meter */}
                    <div className="mb-2">
                      <div className="flex justify-between text-[9px] font-bold text-[#757575] mb-1">
                        <span>Fulfillment Popularity:</span>
                        <span>{product.salesVelocity}% Sold</span>
                      </div>
                      <div className="w-full bg-[#eff0f5] h-1 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#f57224] to-orange-400 h-full rounded-full" style={{ width: `${product.salesVelocity}%` }} />
                      </div>
                    </div>

                    {/* Ratings Star Row */}
                    <div className="flex items-center justify-between text-[10px] text-[#757575] font-semibold">
                      <div className="flex items-center gap-0.5 text-yellow-400 font-bold">
                        ★ <span className="text-[#212121]">{product.rating}</span>
                      </div>
                      <span>({product.reviewsCount} verified reviews)</span>
                    </div>

                    {/* Basket Append Controller Trigger */}
                    <button
                      disabled={product.stock === 0}
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className={`w-full mt-3 py-2 border-none rounded-lg font-black text-xs cursor-pointer transition-colors ${product.stock > 0 ? 'bg-[#f57224] text-white hover:bg-[#d65f1c]' : 'bg-[#e2e2e6] text-[#a0a0a4] cursor-not-allowed'}`}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. SMOOTH FULL ANIMATED SLIDEOVER CART BASKET DRAWER CHANNELS */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full p-6 text-left flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-[#eff0f5] pb-4 mb-4">
                <h3 className="text-base font-black text-[#212121] m-0 uppercase tracking-wide">Your Shopping Cart ({cartItems.reduce((a, b) => a + b.qty, 0)} Items)</h3>
                <button onClick={() => setIsCartOpen(false)} className="bg-[#eff0f5] border-none text-[#212121] rounded-full w-8 h-8 font-bold cursor-pointer hover:bg-orange-100 hover:text-[#f57224] transition-all">✕</button>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-[#757575]">
                  <span className="text-4xl block mb-2">🛒</span>
                  <p className="text-xs font-bold m-0">Your basket is currently empty. Add products to get started.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="bg-[#f7f8fa] border border-[#e2e2e6] p-3 rounded-xl flex justify-between items-center text-xs">
                      <div className="max-w-[70%]">
                        <div className="font-bold text-[#212121] truncate">{item.title}</div>
                        <div className="text-[#f57224] font-black mt-1">${item.price.toFixed(2)} <span className="text-[#757575] font-normal">x {item.qty}</span></div>
                      </div>
                      <span className="font-mono font-bold text-[#212121] bg-white border border-[#e2e2e6] px-2 py-1 rounded shadow-xs">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-[#eff0f5] pt-4">
                <div className="flex justify-between items-center font-black text-sm text-[#212121] mb-4 uppercase">
                  <span>Estimated Net Total:</span>
                  <span className="text-[#f57224] text-xl">${cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2)}</span>
                </div>
                <button 
                  onClick={async () => { 
                    alert('🚀 Order Dispatched: Payment confirmed! Your transactional data has been routed to fulfillment branches.'); 
                    setCartItems([]); 
                    setIsCartOpen(false); 

                    // Clear active basket cleanly in database engine upon order fulfillment
                    if (session?.email) {
                      try {
                        await fetch('http://localhost:8000/api/cart', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userId: session.email,
                            cartItems: []
                          })
                        });
                      } catch (err) {
                        console.error("Failed to clear cart data in Redis engine:", err);
                      }
                    }
                  }}
                  className="w-full bg-[#f57224] text-white font-black py-3 rounded-xl border-none text-xs uppercase tracking-wider cursor-pointer hover:bg-[#d65f1c] transition-colors shadow-lg shadow-orange-500/20"
                >
                  Confirm Order & Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}