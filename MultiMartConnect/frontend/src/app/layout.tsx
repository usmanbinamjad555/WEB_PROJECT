'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ email: string; role: string; tenant: string } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    // Poll local storage to update navbar state across page changes seamlessly
    const checkSession = () => {
      const activeUser = localStorage.getItem('mm_session');
      if (activeUser) {
        setSession(JSON.parse(activeUser));
      } else {
        setSession(null);
      }
    };

    checkSession();
    window.addEventListener('storage', checkSession);
    const interval = setInterval(checkSession, 1000); // Fail-safe tracker
    return () => {
      window.removeEventListener('storage', checkSession);
      clearInterval(interval);
    };
  }, []);

  const executeClearSession = () => {
    localStorage.removeItem('mm_session');
    setSession(null);
    window.location.href = '/';
  };

  return (
    <html lang="en" className="h-full bg-[#0f172a]" suppressHydrationWarning>
      <head />
      <body 
        className="bg-[#0f172a] text-[#f8fafc] min-h-screen flex flex-col font-sans antialiased m-0 p-0" 
        suppressHydrationWarning
      >
        
        {/* Universal Application Shell Navbar */}
        <nav className="bg-[#1e293b] border-b border-[#334155] sticky top-0 z-50 px-6 py-3.5 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Core Branding */}
            <a href="/" className="flex items-center gap-3 no-underline group">
              <div className="bg-[#f57224] text-white font-black px-2.5 py-1 rounded-lg text-xl tracking-tighter shadow-md">
                MM
              </div>
              <div>
                <span className="text-white font-black text-base tracking-tight block group-hover:text-[#f57224] transition-colors">
                  MultiMart <span className="text-[#38bdf8]">Connect</span>
                </span>
                <span className="text-[9px] text-[#38bdf8] font-bold tracking-widest uppercase block mt-0.5">
                  Global Commerce Platform
                </span>
              </div>
            </a>
            
            {/* Conditional Navigation Links based on User Role Matrix */}
            <div className="flex items-center gap-2">
              <a href="/" className="text-xs font-bold text-[#94a3b8] hover:text-white px-3 py-2 rounded-lg hover:bg-[#2d3d54] transition-all no-underline">
                Home Hub
              </a>
              <a href="/store" className="text-xs font-bold text-[#94a3b8] hover:text-white px-3 py-2 rounded-lg hover:bg-[#2d3d54] transition-all no-underline">
                Marketplace
              </a>
              
              {/* Show Merchant Link ONLY to Sellers & Super Admins */}
              {hasMounted && session && (session.role === 'SELLER' || session.role === 'SUPER_ADMIN') && (
                <a href="/dashboard" className="text-xs font-bold text-amber-400 border border-amber-500/30 bg-amber-500/5 px-3 py-2 rounded-lg hover:bg-amber-500/10 transition-all no-underline">
                  Merchant Console
                </a>
              )}

              {/* Show Super Admin Link ONLY to Super Admins */}
              {hasMounted && session && session.role === 'SUPER_ADMIN' && (
                <a href="/admin" className="text-xs font-bold text-rose-400 border border-rose-500/30 bg-rose-500/5 px-3 py-2 rounded-lg hover:bg-rose-500/10 transition-all no-underline">
                  Super Admin
                </a>
              )}

              <div className="h-4 w-[1px] bg-[#334155] mx-2"></div>

              {hasMounted && session ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#94a3b8] font-medium hidden md:inline">
                    Active Profile: <strong className="text-white">{session.email}</strong>
                  </span>
                  <button 
                    onClick={executeClearSession}
                    className="bg-[#334155] text-white border-none text-xs font-bold px-3 py-2 rounded-lg hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <a href="/login" className="bg-[#f57224] text-white text-xs font-black px-4 py-2 rounded-lg shadow-md hover:bg-[#e05e14] transition-all no-underline">
                    Sign In
                  </a>
                  <a href="/register" className="border border-[#475569] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#2d3d54] transition-all no-underline">
                    Register
                  </a>
                </>
              )}
            </div>

          </div>
        </nav>
        
        {/* Core Content Injection Router Canvas */}
        <div className="flex-1 flex flex-col w-full box-border">
          {children}
        </div>

      </body>
    </html>
  );
}