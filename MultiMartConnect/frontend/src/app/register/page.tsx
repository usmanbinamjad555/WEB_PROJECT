'use client';

import React, { useState, useEffect } from 'react';

export default function CentralizedWorkspaceRegister() {
  const [accountType, setAccountType] = useState('SELLER');
  const [orgName, setOrgName] = useState('');
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Guard state to prevent browser extension/autofill hydration mismatches
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const executeRegistrationPipeline = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Registration Successful! Onboarded Account [${email}] under Workspace: ${slug || 'shared-mall-pool'}`);
    window.location.href = '/login';
  };

  // Render a clean structural fallback placeholder while mounting to protect layout shifts
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex items-center justify-center">
        <div className="text-sm font-bold text-[#f57224] animate-pulse tracking-wide">
          Initializing core registration layout tree...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0f172a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-2xl p-8 shadow-xl box-border">
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-white m-0">Ecosystem Core Registration</h2>
          <p className="text-xs text-[#94a3b8] mt-1">Initialize your isolated multi-vendor environment workspace nodes</p>
        </div>

        {/* Account Type Selection Toggle */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button 
            type="button" 
            onClick={() => setAccountType('SELLER')} 
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border-none ${accountType === 'SELLER' ? 'bg-[#f57224] text-white shadow-md' : 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#162238]'}`}
          >
            🏬 Store Merchant
          </button>
          <button 
            type="button" 
            onClick={() => setAccountType('CUSTOMER')} 
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border-none ${accountType === 'CUSTOMER' ? 'bg-[#38bdf8] text-[#0f172a] shadow-md' : 'bg-[#0f172a] text-[#94a3b8] hover:bg-[#162238]'}`}
          >
            🛒 Market Buyer
          </button>
        </div>

        <form onSubmit={executeRegistrationPipeline} className="flex flex-col gap-4">
          
          {accountType === 'SELLER' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5">Merchant Company Name</label>
                <input type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g., Al-Makkah Electronics" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#f57224] transition-colors box-border"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5">Tenant Subdomain URI Slug</label>
                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="e.g., makkah-elect" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#f57224] transition-colors box-border"/>
                <span className="text-[10px] text-[#64748b] font-semibold mt-1 block">Your store will live at: <code className="text-[#38bdf8]">/store?tenant={slug || 'your-slug'}</code></span>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5">Account Admin Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@workspace.com" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#f57224] transition-colors box-border"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5">Secure Password Access Key</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#f57224] transition-colors box-border"/>
          </div>

          <button type="submit" className={`w-full text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider border-none cursor-pointer mt-2 transition-colors shadow-md ${accountType === 'SELLER' ? 'bg-[#f57224] hover:bg-[#e05e14]' : 'bg-[#38bdf8] text-[#0f172a] hover:bg-[#34aed3]'}`}>
            Provision Profile Lifecycle →
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-[#334155]">
          <span className="text-xs text-[#94a3b8]">Already have an account? </span>
          <a href="/login" className="text-xs text-[#f57224] font-bold no-underline hover:underline">Log in here</a>
        </div>

      </div>
    </div>
  );
}