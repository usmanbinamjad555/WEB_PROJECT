'use client';

import React, { useState, useEffect } from 'react';

export default function UnifiedLoginController() {
  const [tenant, setTenant] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('CUSTOMER');
  
  // Guard state to safely isolate form assistants and auto-fills
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const triggerQuickDemoFill = (role: 'SUPER_ADMIN' | 'SELLER' | 'CUSTOMER') => {
    if (role === 'SUPER_ADMIN') {
      setTenant('system-root');
      setEmail('admin@multimart.com');
      setPassword('admin123');
      setSelectedRole('SUPER_ADMIN');
    } else if (role === 'SELLER') {
      setTenant('nexus-retail');
      setEmail('seller@nexus.com');
      setPassword('seller123');
      setSelectedRole('SELLER');
    } else {
      setTenant('nexus-retail');
      setEmail('buyer@gmail.com');
      setPassword('buyer123');
      setSelectedRole('CUSTOMER');
    }
  };

  const processFormAuthentication = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Structure the session payload mapping model
    const sessionModel = {
      email,
      role: selectedRole,
      tenant: tenant || 'nexus-retail'
    };

    // Persist session to sync navigation visibility rules globally
    localStorage.setItem('mm_session', JSON.stringify(sessionModel));

    // Dynamic core redirection matrix router execution
    if (selectedRole === 'SUPER_ADMIN') {
      window.location.href = '/admin';
    } else if (selectedRole === 'SELLER') {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/store';
    }
  };

  // Render uniform loading container while mounting to completely clear browser attribute collisions
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex items-center justify-center">
        <div className="text-sm font-bold text-[#f57224] animate-pulse tracking-wide">
          Initializing secure authentication gateway...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0f172a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-2xl p-8 shadow-xl box-border">
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-white m-0">Ecosystem Single Sign-In</h2>
          <p className="text-xs text-[#94a3b8] mt-1">Select a role identity pill below to instantly test isolated workflows</p>
        </div>

        {/* Clickable Quick Demo Access Selectors */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button 
            type="button" 
            onClick={() => triggerQuickDemoFill('SUPER_ADMIN')} 
            className="bg-[#0f172a] hover:bg-[#223147] border border-[#334155] text-rose-400 font-extrabold py-2.5 px-1 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer"
          >
            👑 Super Admin
          </button>
          <button 
            type="button" 
            onClick={() => triggerQuickDemoFill('SELLER')} 
            className="bg-[#0f172a] hover:bg-[#223147] border border-[#334155] text-amber-400 font-extrabold py-2.5 px-1 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer"
          >
            🏬 Merchant
          </button>
          <button 
            type="button" 
            onClick={() => triggerQuickDemoFill('CUSTOMER')} 
            className="bg-[#0f172a] hover:bg-[#223147] border border-[#334155] text-emerald-400 font-extrabold py-2.5 px-1 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer"
          >
            🛒 Buyer Client
          </button>
        </div>

        <form onSubmit={processFormAuthentication} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5">Tenant Workspace Slug</label>
            <input type="text" required value={tenant} onChange={(e) => setTenant(e.target.value)} placeholder="system-root or store-slug" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#f57224] transition-colors box-border"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5">User Identity Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@domain.com" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#f57224] transition-colors box-border"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5">Account Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#f57224] transition-colors box-border"/>
          </div>

          <button type="submit" className="w-full bg-[#f57224] text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider border-none cursor-pointer mt-2 hover:bg-[#e05e14] transition-colors shadow-md">
            Sign In As {selectedRole.replace('_', ' ')} →
          </button>
        </form>

        <div className="text-center mt-5 pt-4 border-t border-[#334155]">
          <span className="text-xs text-[#94a3b8]">New to the platform? </span>
          <a href="/register" className="text-xs text-[#f57224] font-bold no-underline hover:underline">Create a workspace</a>
        </div>

      </div>
    </div>
  );
}