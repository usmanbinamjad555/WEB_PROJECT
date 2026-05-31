'use client';

import React, { useState, useEffect } from 'react';

interface MockOrderLine {
  id: string;
  buyer: string;
  amount: number;
  status: string;
  time: string;
}

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

export default function FullyFunctionalMerchantConsole() {
  const [session, setSession] = useState<{ email: string; role: string; tenant: string } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Dashboard Active Routing View Controller Tab State
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'chat'>('analytics');

  // Interactive Live Chat Simulation States
  const [chatInput, setChatInput] = useState('');
  const [chatLines, setChatLines] = useState([
    { sender: 'customer', text: 'Hi, I ordered the wireless headset yesterday from Islamabad. Can I change the shipping address?', time: '5 mins ago' },
    { sender: 'system', text: 'AI Assistant assigned. Waiting for merchant review...', time: '4 mins ago' }
  ]);

  // Shared Core Operational States
  const [liveOrders, setLiveOrders] = useState<MockOrderLine[]>([
    { id: "MM-7841", buyer: "Zain ul Hassan", amount: 1499.98, status: "PROCESSING", time: "2 mins ago" },
    { id: "MM-7840", buyer: "Talal Ahsan", amount: 349.50, status: "PENDING", time: "14 mins ago" },
    { id: "MM-7839", buyer: "Muhammad Khan", amount: 45.00, status: "DELIVERED", time: "1 hour ago" }
  ]);

  const [products, setProducts] = useState<ProductItem[]>([
    { id: 'p1', name: 'Quantum Alpha Core i9 Laptop', sku: 'LAP-QTM-I9', price: 1199.00, stock: 8 },
    { id: 'p2', name: 'Pro Noise-Isolating Wireless Headset', sku: 'EAR-NOISE-PRO', price: 89.99, stock: 14 },
    { id: 'p3', name: 'Aero-Weave Ergonomic Office Chair', sku: 'CHR-AERO-LUM', price: 240.00, stock: 3 }
  ]);

  // Product Creator Form States
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');

  useEffect(() => {
    setHasMounted(true);
    const activeUser = localStorage.getItem('mm_session');
    if (activeUser) {
      setSession(JSON.parse(activeUser));
    }
  }, []);

  // Professionalized simulation engine triggers
  const simulateIncomingStorefrontOrder = () => {
    const buyersPool = ["Ayesha Malik", "Usman Tariq", "Hamza Shah", "Fatima Bilal", "Zoya Ahmed"];
    const randomBuyer = buyersPool[Math.floor(Math.random() * buyersPool.length)];
    const generatedId = `MM-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const incomingOrder: MockOrderLine = {
      id: generatedId,
      buyer: randomBuyer,
      amount: parseFloat((Math.random() * 450 + 15).toFixed(2)),
      status: "PENDING",
      time: "Just Now"
    };

    setLiveOrders(prev => [incomingOrder, ...prev]);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) return;

    const newProduct: ProductItem = {
      id: `p-${Date.now()}`,
      name: prodName,
      sku: `SKU-${Math.random().toString(36).substring(3, 8).toUpperCase()}`,
      price: parseFloat(prodPrice),
      stock: parseInt(prodStock)
    };

    setProducts(prev => [newProduct, ...prev]);
    setProdName('');
    setProdPrice('');
    setProdStock('');
    alert(`📦 Inventory Saved: [${newProduct.name}] has been appended to your store catalog.`);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatLines(prev => [...prev, { sender: 'merchant', text: chatInput, time: 'Just Now' }]);
    setChatInput('');

    // Trigger an interactive automated customer reply sequence after 1 second
    setTimeout(() => {
      setChatLines(prev => [...prev, { sender: 'customer', text: 'Thank you for updating that for me! Let me know when it ships.', time: 'Just Now' }]);
    }, 1200);
  };

  if (!hasMounted) return null;

  // Security Session Verification Check Frame
  if (!session || (session.role !== 'SELLER' && session.role !== 'SUPER_ADMIN')) {
    return (
      <div className="flex-1 bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center min-h-[80vh]">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-white font-black text-lg m-0">Access Restricted</h3>
        <p className="text-xs text-[#94a3b8] max-w-sm mt-2 leading-relaxed">
          This control window requires active merchant credentials. Please access your store node via the single sign-in interface hub.
        </p>
        <a href="/login" className="mt-5 bg-[#f57224] text-white font-black text-xs px-5 py-2.5 rounded-xl no-underline hover:bg-[#e05e14] transition-all">
          Return to Portal Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex-1 flex">
      
      {/* App Sidebar Navigation Drawer Menu Frame */}
      <aside className="w-64 bg-[#1e293b] border-r border-[#334155] p-6 hidden md:flex flex-col justify-between shrink-0 text-left">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2 m-0">
              <span className="text-[#38bdf8]">💼</span> Seller Central
            </h2>
            <span className="text-[10px] text-[#38bdf8] font-bold tracking-widest uppercase block mt-1">
              Store URL: {session.tenant}.multimart.com
            </span>
          </div>
          
          {/* Functional Navigation Selectors Switchboard */}
          <nav className="flex flex-col gap-1.5">
            <button 
              onClick={() => setActiveTab('analytics')} 
              className={`w-full text-left border-none px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${activeTab === 'analytics' ? 'bg-[#334155] text-white' : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#243145]'}`}
            >
              📊 Sales Performance
            </button>
            <button 
              onClick={() => setActiveTab('products')} 
              className={`w-full text-left border-none px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${activeTab === 'products' ? 'bg-[#334155] text-white' : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#243145]'}`}
            >
              📦 Product Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`w-full text-left border-none px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${activeTab === 'orders' ? 'bg-[#334155] text-white' : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#243145]'}`}
            >
              🛒 Customer Orders
            </button>
            <button 
              onClick={() => setActiveTab('chat')} 
              className={`w-full text-left border-none px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${activeTab === 'chat' ? 'bg-[#334155] text-white' : 'bg-transparent text-[#94a3b8] hover:text-white hover:bg-[#243145]'}`}
            >
              💬 Customer Messages
            </button>
          </nav>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('mm_session'); window.location.href = '/'; }}
          className="bg-transparent border-none text-left p-0 text-xs text-[#64748b] hover:text-rose-400 font-bold cursor-pointer transition-colors"
        >
          ← Disconnect Business Session
        </button>
      </aside>

      {/* Primary Dashboard Content Area Layout Canvas */}
      <main className="flex-1 p-8 box-border text-left">
        
        {/* User-Friendly Upper Title Block */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-[#2d3d54] pb-6">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight m-0">Merchant Manager Board</h1>
            <p className="text-xs text-[#94a3b8] mt-1">Logged in manager operator terminal: <strong className="text-white">{session.email}</strong></p>
          </div>
          {/* REPLACED: Jargon-free simulation trigger hook button */}
          <button 
            onClick={simulateIncomingStorefrontOrder}
            className="bg-gradient-to-r from-[#f57224] to-orange-500 text-white border-none px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow-md hover:from-[#e05e14] hover:to-orange-600 transition-all flex items-center gap-2"
          >
            📥 Simulate New Customer Order
          </button>
        </header>

        {/* VIEW 1: DYNAMIC SALES PERFORMANCE METRICS PANELS */}
        {activeTab === 'analytics' && (
          <div className="animate-fadeIn">
            {/* User-Friendly Redesigned Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl">
                <span className="text-xs text-[#94a3b8] font-bold block mb-1 uppercase tracking-wider">Gross Store Revenue</span>
                <div className="text-3xl font-black text-white mt-1">$14,841.50</div>
                <span className="text-emerald-400 text-xs font-bold block mt-2">↑ 12% growth over current period</span>
              </div>
              <div className="grid bg-[#1e293b] border border-[#334155] p-6 rounded-xl">
                <span className="text-xs text-[#94a3b8] font-bold block mb-1 uppercase tracking-wider">Total Sales Inbound</span>
                <div className="text-3xl font-black text-white mt-1">{liveOrders.length} Completed Orders</div>
                <span className="text-[#38bdf8] text-xs font-bold block mt-2">● Active customer tracking channel synced</span>
              </div>
              <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl">
                <span className="text-xs text-[#94a3b8] font-bold block mb-1 uppercase tracking-wider">Critical Inventory Level</span>
                <div className="text-3xl font-black text-rose-400 mt-1">2 Low-Stock SKUs</div>
                <span className="text-[#94a3b8] text-xs font-bold block mt-2">Automated system re-order warnings active</span>
              </div>
            </div>

            {/* Main Live Tracking Orders Feed Module Table */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-md">
              <div className="px-6 py-4 border-b border-[#334155] flex justify-between items-center">
                <h3 className="text-sm font-black text-white m-0 uppercase tracking-wider">Live Store Dispatch Center</h3>
                <span className="bg-[#0f172a] text-[#38bdf8] border border-[#334155] text-[10px] font-black px-2 py-1 rounded">Live Sync On</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs m-0">
                  <thead>
                    <tr className="bg-[#111827] text-[#cbd5e1] font-bold border-b border-[#334155]">
                      <th className="p-4 tracking-wider">ORDER CODE</th>
                      <th className="p-4 tracking-wider">BUYER CLIENT</th>
                      <th className="p-4 tracking-wider">TOTAL AMOUNT</th>
                      <th className="p-4 tracking-wider">FULFILLMENT STATUS</th>
                      <th className="p-4 tracking-wider">RECEIVED TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#334155] hover:bg-[#1f293d] transition-colors">
                        <td className="p-4 font-mono text-white font-bold">{order.id}</td>
                        <td className="p-4 text-[#94a3b8] font-semibold">{order.buyer}</td>
                        <td className="p-4 text-[#38bdf8] font-bold">${order.amount.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wide ${order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : order.status === 'PROCESSING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-[#64748b] font-semibold">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCT INVENTORY CONSOLE CONTROLLER */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">
            
            {/* Left Column Data Feed Table List */}
            <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-white uppercase tracking-wider m-0 mb-4">Live Warehouse Stock Inventory ({products.length} entries)</h3>
              <div className="flex flex-col gap-3">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-[#0f172a] border border-[#2d3d54] p-4 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-sm block">{prod.name}</span>
                      <span className="text-[10px] text-[#64748b] font-mono font-bold uppercase mt-1 block">SKU IDENTIFIER: {prod.sku}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-amber-400 font-black text-sm block">${prod.price.toFixed(2)}</span>
                      <span className={`text-[10px] font-bold block mt-1 ${prod.stock <= 3 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                        {prod.stock} units left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column Core Creation Factory Form Container */}
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-black text-white uppercase tracking-wider m-0 mb-4">Add Store Item</h3>
              <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#94a3b8] mb-1">Item Title Name</label>
                  <input type="text" required value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="e.g., Ultra Thin Wireless Mouse" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-400 transition-all box-border"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#94a3b8] mb-1">Retail Price ($)</label>
                    <input type="number" step="0.01" required value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} placeholder="19.99" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-400 transition-all box-border"/>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#94a3b8] mb-1">Total Quantity</label>
                    <input type="number" required value={prodStock} onChange={(e) => setProdStock(e.target.value)} placeholder="100" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-amber-400 transition-all box-border"/>
                  </div>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 border-none text-[#0f172a] font-black py-2.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-md mt-2">
                  Publish Item to Marketplace
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW 3: FULL COMPREHENSIVE ORDERS DIRECTORY SEARCH SHEET */}
        {activeTab === 'orders' && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 shadow-sm animate-fadeIn">
            <h3 className="text-sm font-black text-white uppercase tracking-wider m-0 mb-4">Complete Historical Order Directory Registry</h3>
            <div className="flex flex-col gap-2">
              {liveOrders.map((order) => (
                <div key={order.id} className="bg-[#0f172a] p-4 rounded-xl flex flex-wrap justify-between items-center border border-[#2d3d54] gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-white text-sm">{order.id}</span>
                      <span className="bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded text-[10px] font-bold font-mono">{order.time}</span>
                    </div>
                    <span className="text-[#94a3b8] mt-1.5 block">Customer Profile Reference: <strong className="text-white">{order.buyer}</strong></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-[#38bdf8]">${order.amount.toFixed(2)}</span>
                    <button 
                      onClick={() => alert(`📦 Order Status Sync: Dispatch request lines for [${order.id}] have been successfully pushed to local shipping networks.`)}
                      className="bg-[#334155] hover:bg-[#475569] text-white font-bold border-none px-3 py-2 rounded-lg text-[11px] tracking-wide cursor-pointer transition-colors"
                    >
                      Update Shipping Route
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: SIMULATED CUSTOMER LIVE MESSAGES CHAT STREAM CONTAINER */}
        {activeTab === 'chat' && (
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 shadow-sm max-w-4xl mx-auto flex flex-col justify-between min-h-[480px] animate-fadeIn">
            
            <div>
              <div className="flex items-center justify-between border-b border-[#334155] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <h3 className="text-sm font-black text-white m-0 uppercase tracking-wider">Live Customer Chat Helpdesk</h3>
                </div>
                <span className="text-[10px] bg-[#0f172a] text-[#38bdf8] border border-[#334155] px-2 py-0.5 rounded font-mono font-bold">Active Ticket Session</span>
              </div>

              {/* Scrolling Window Wrapper Body */}
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-1">
                {chatLines.map((line, idx) => (
                  <div key={idx} className={`flex flex-col max-w-[75%] ${line.sender === 'merchant' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className={`p-3 rounded-2xl text-xs font-semibold ${line.sender === 'merchant' ? 'bg-[#f57224] text-white rounded-tr-none' : 'bg-[#0f172a] text-[#cbd5e1] rounded-tl-none border border-[#2d3d54]'}`}>
                      {line.text}
                    </div>
                    <span className="text-[9px] text-[#64748b] mt-1 block font-medium px-1 font-mono">{line.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Submission Footer Form */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2 border-t border-[#334155] pt-4 mt-4 relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your official business response message parameters here..." 
                className="w-full bg-[#0f172a] border border-[#475569] text-white px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#38bdf8] transition-all box-border"
              />
              <button type="submit" className="bg-[#38bdf8] text-[#0f172a] border-none font-black px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer hover:bg-[#7dd3fc] transition-colors shadow-md">
                Reply
              </button>
            </form>

          </div>
        )}

      </main>
    </div>
  );
}