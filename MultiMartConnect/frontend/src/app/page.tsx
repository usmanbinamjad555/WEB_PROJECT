'use client';

import React, { useState } from 'react';

export default function ProfessionalMallLanding() {
  const [showEvalPanel, setShowEvalPanel] = useState(false);

  const marketCategories = [
    { name: 'Electronic Devices', icon: '💻', count: '4.2k+ Items', tag: 'Top Brands' },
    { name: 'Fashion & Accessories', icon: '👟', count: '12k+ Items', tag: 'New Arrivals' },
    { name: 'Home & Lifestyle', icon: '🏠', count: '8.5k+ Items', tag: 'Flash Sale' },
    { name: 'Groceries & Pets', icon: '🍏', count: '3.1k+ Items', tag: 'Fresh Delivery' },
  ];

  const valueProps = [
    { title: 'Verified Global Mall', desc: 'Access 100% authentic products from certified vendor store networks with local warehouse tracking.', icon: '🏆', actionText: 'View Guarantees' },
    { title: 'Real-Time Order Streams', desc: 'Watch your orders pass instantly from point-of-sale checkout straight to localized merchant logs.', icon: '⚡', actionText: 'See Live Store' },
    { title: 'Secure Tenant Isolation', desc: 'Shop with absolute data protection. Each merchant operates on isolated schema queries.', icon: '🛡️', actionText: 'Create Account' },
  ];

  return (
    <div className="flex-1 bg-[#0f172a] text-[#f8fafc] w-full box-border pb-20 text-left">
      
      {/* 1. HERO COMMERCIAL DISPLAY PANEL */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#0f172a] px-6 py-20 md:py-32 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-r from-[#f57224]/10 to-[#38bdf8]/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-[#38bdf8] mb-6">
            <span className="animate-pulse text-[#f57224]">●</span> Global Multi-Vendor Network Active
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white m-0 leading-tight">
            The Smartest Way to Shop <br />
            <span className="bg-gradient-to-r from-[#f57224] to-orange-400 bg-clip-text text-transparent">& Grow Your Digital Retail Business</span>
          </h1>
          
          <p className="text-sm md:text-base text-[#94a3b8] max-w-2xl mx-auto leading-relaxed mt-6 mb-10">
            Welcome to MultiMart Connect. Discover an interconnected ecosystem of independent stores, authentic brands, and blazing-fast fulfillment tracking.
          </p>

          <div className="flex flex-wrap justify-center gap-4 w-full max-w-md mx-auto">
            <a href="/store" className="flex-1 min-w-[160px] bg-[#f57224] text-white font-black py-3.5 px-6 rounded-xl text-sm shadow-lg shadow-orange-500/20 hover:bg-[#e05e14] transition-all no-underline text-center">
              Explore Marketplace
            </a>
            <a href="/register" className="flex-1 min-w-[160px] bg-[#1e293b] border border-[#334155] text-white font-bold py-3.5 px-6 rounded-xl text-sm hover:bg-[#2d3d54] hover:border-[#475569] transition-all no-underline text-center">
              Become a Seller
            </a>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC RETAIL CATEGORIES PREVIEW CARDS */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-black text-white m-0 tracking-tight">Browse Trending Categories</h2>
          <a href="/store" className="text-xs font-bold text-[#f57224] hover:underline no-underline">View All Collections →</a>
        </div>

        {/* FIXED: Category cards are now wrapped in functional links that point directly to the marketplace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketCategories.map((cat, idx) => (
            <a 
              key={idx} 
              href="/store" 
              className="bg-[#1e293b] border border-[#334155] rounded-2xl p-5 flex items-center justify-between group hover:border-orange-500/40 hover:shadow-lg transition-all cursor-pointer no-underline text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white m-0 group-hover:text-[#f57224] transition-colors">{cat.name}</h4>
                  <span className="text-[11px] text-[#94a3b8] font-medium mt-0.5 block">{cat.count}</span>
                </div>
              </div>
              <span className="bg-[#f57224]/10 text-[#f57224] font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                {cat.tag}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 3. BUSINESS ONBOARDING SPLIT PROMOTIONAL SECTION */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="bg-gradient-to-br from-[#1e293b] to-[#111827] border border-[#334155] rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#38bdf8]/5 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="lg:col-span-3 text-left">
            <span className="text-xs font-black uppercase text-[#38bdf8] tracking-widest">Enterprise SaaS Infrastructure</span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mt-2 mb-4 leading-tight">
              Launch Your Dedicated Standalone <br />Digital Storefront in Minutes
            </h2>
            <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed m-0 max-w-xl">
              Are you a manufacturer, retailer, or brand distributor? MultiMart Connect provides enterprise-grade infrastructure to launch custom-branded workspaces equipped with secure order channels.
            </p>
            <div className="flex gap-6 mt-6 text-xs font-bold text-[#cbd5e1]">
              <div className="flex items-center gap-2">✨ Multi-Tenant Analytics</div>
              <div className="flex items-center gap-2">📦 Inventory Routing</div>
              <div className="flex items-center gap-2">🔒 Secure Gateways</div>
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col gap-3 w-full">
            <a href="/register" className="bg-[#f57224] hover:bg-[#e05e14] text-white font-black text-center py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all no-underline">
              Register New Store Namespace
            </a>
            <a href="/login" className="bg-[#0f172a] hover:bg-[#162030] border border-[#334155] text-[#94a3b8] hover:text-white font-bold text-center py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all no-underline">
              Access Merchant Console
            </a>
          </div>
        </div>
      </div>

      {/* 4. VALUE PROPOSITIONS SERVICES ROWS */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        {/* FIXED: Feature cards now link accurately to their intended functional counterparts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {valueProps.map((prop, idx) => (
            <a 
              key={idx}
              href={idx === 0 ? "/store" : idx === 1 ? "/dashboard" : "/register"}
              className="bg-[#111827]/50 border border-[#1e293b] p-6 rounded-2xl hover:border-orange-500/30 transition-colors no-underline group block"
            >
              <div className="text-2xl mb-4">{prop.icon}</div>
              <h3 className="text-sm font-black text-white m-0 mb-2 group-hover:text-[#f57224] transition-colors">{prop.title}</h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed m-0 mb-4">{prop.desc}</p>
              <span className="text-[11px] font-bold text-[#38bdf8] group-hover:underline">{prop.actionText} →</span>
            </a>
          ))}
        </div>
      </div>

      {/* 5. ADMIN CONTROL MATRIX ACCORDION */}
      <div className="max-w-3xl mx-auto px-6 mt-12">
        <div className="bg-[#1e293b]/60 border border-[#334155] backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
          
          {/* Header Accordion Click Bar Toggle */}
          <button 
            onClick={() => setShowEvalPanel(!showEvalPanel)}
            className="w-full bg-[#1e293b] border-none px-6 py-4 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-[#243247]"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🔧</span>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider m-0">Platform Administration & Walkthrough Portal</h4>
                <span className="text-[10px] text-[#94a3b8] font-medium block mt-0.5">Click to toggle walkthrough guidelines and role profiles</span>
              </div>
            </div>
            <span className={`text-sm text-[#94a3b8] transition-transform duration-300 ${showEvalPanel ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* Drawer Inner Flow Parameters */}
          {showEvalPanel && (
            <div className="p-6 border-t border-[#334155] text-left text-xs text-[#cbd5e1] flex flex-col gap-4 bg-[#111827]/40 animate-fadeIn">
              <div className="bg-[#0f172a] border-l-4 border-[#f57224] p-3.5 rounded-r-xl">
                <strong className="text-white block mb-1">E-Commerce Framework Summary:</strong>
                This platform maps out logical tenant isolation inside data configurations based on resource context parameters, manages background order dispatch streams cleanly, and enforces multi-role layouts.
              </div>

              <div className="flex flex-col gap-3">
                <h5 className="font-black text-[11px] uppercase tracking-wider text-[#38bdf8] m-0">Walkthrough Options Matrix:</h5>
                
                <a href="/login" className="flex items-start gap-3 bg-[#1e293b]/40 p-3 rounded-xl border border-[#334155] no-underline hover:border-orange-500/40 transition-all group">
                  <span className="bg-[#f57224] text-white font-black px-1.5 py-0.5 rounded text-[10px]">1</span>
                  <div>
                    <p className="m-0 font-bold text-white group-hover:text-[#f57224] transition-colors">Super Admin Space Access 👑</p>
                    <p className="m-0 text-[#94a3b8] mt-0.5">Click here to head to the access gate. Select the Super Admin profile token to review global infrastructure panels.</p>
                  </div>
                </a>

                <a href="/login" className="flex items-start gap-3 bg-[#1e293b]/40 p-3 rounded-xl border border-[#334155] no-underline hover:border-orange-500/40 transition-all group">
                  <span className="bg-[#f57224] text-white font-black px-1.5 py-0.5 rounded text-[10px]">2</span>
                  <div>
                    <p className="m-0 font-bold text-white group-hover:text-[#f57224] transition-colors">Isolated Merchant Control Console 🏬</p>
                    <p className="m-0 text-[#94a3b8] mt-0.5">Click here to open the seller login simulation. Inject store operator credentials to update inventory metrics and live chat.</p>
                  </div>
                </a>

                <a href="/store" className="flex items-start gap-3 bg-[#1e293b]/40 p-3 rounded-xl border border-[#334155] no-underline hover:border-orange-500/40 transition-all group">
                  <span className="bg-[#f57224] text-white font-black px-1.5 py-0.5 rounded text-[10px]">3</span>
                  <div>
                    <p className="m-0 font-bold text-white group-hover:text-[#f57224] transition-colors">B2C Marketplace Mall Grid 🛒</p>
                    <p className="m-0 text-[#94a3b8] mt-0.5">Click here to jump straight to the store. Test product filtering, claiming vouchers, and building cart total summaries.</p>
                  </div>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}