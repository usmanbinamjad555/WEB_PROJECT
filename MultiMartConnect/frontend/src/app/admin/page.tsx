'use client';

import React, { useState } from 'react';

interface TenantEntity {
  id: string;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joined: string;
}

export default function SuperAdminCommandCenter() {
  const [tenants, setTenants] = useState<TenantEntity[]>([
    { id: "t-01", name: "Nexus Retail Group", slug: "nexus-retail", status: "ACTIVE", joined: "2026-01-10" },
    { id: "t-02", name: "Apex Alpha Brand", slug: "apex-alpha", status: "ACTIVE", joined: "2026-03-14" },
    { id: "t-03", name: "Vanguard Global Labs", slug: "vanguard-labs", status: "SUSPENDED", joined: "2026-04-02" }
  ]);

  const [inputName, setInputName] = useState('');
  const [inputSlug, setInputSlug] = useState('');

  // Handle active creation of tenant blocks inside application lifecycle context
  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputSlug) return;

    const freshTenant: TenantEntity = {
      id: `t-0${tenants.length + 1}`,
      name: inputName,
      slug: inputSlug.toLowerCase().replace(/\s+/g, '-'),
      status: 'ACTIVE',
      joined: new Date().toISOString().split('T')[0]
    };

    setTenants(prev => [...prev, freshTenant]);
    setInputName('');
    setInputSlug('');
  };

  const toggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] p-8">
      {/* Global Administrative Header Nav Bar */}
      <header className="border-b border-[#334155] pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse block"></span>
            <span className="text-xs text-rose-400 font-black tracking-widest uppercase block">Global Super Administration Space</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight m-0">MultiMart Ecosystem Center</h1>
        </div>
        <a href="/" className="bg-[#1e293b] border border-[#334155] text-white px-4 py-2.5 rounded-lg text-xs font-bold no-underline hover:bg-[#334155] transition-all">
          ← Exit Control Center
        </a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Isolated Provisioning Registration Form Component Block */}
        <div className="bg-[#1e293b] border border-[#334155] p-6 rounded-xl h-fit">
          <h3 className="text-base font-black text-white m-0 mb-4 uppercase tracking-wider text-[#38bdf8]">Provision Fresh Commercial Tenant</h3>
          <form onSubmit={handleCreateTenant} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#cbd5e1] mb-2">Corporate Organization Name</label>
              <input 
                type="text"
                required
                placeholder="e.g., Horizon Logistics"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2 rounded-lg text-sm box-border focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#cbd5e1] mb-2">Unique Workspace URI Slug</label>
              <input 
                type="text"
                required
                placeholder="e.g., horizon-log"
                value={inputSlug}
                onChange={(e) => setInputSlug(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#475569] text-white px-3 py-2 rounded-lg text-sm box-border focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-500 text-[#0f172a] font-black py-2.5 rounded-lg text-xs border-none cursor-pointer mt-2 hover:bg-emerald-400 transition-colors"
            >
              🚀 Instantiate Isolated Tenant Document
            </button>
          </form>
        </div>

        {/* Global Micro-Merchant Control Governance Tracking Registry Matrix */}
        <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#334155] flex justify-between items-center">
            <h3 className="text-sm font-black text-white m-0 uppercase tracking-wider">Active Workspace Registry Node Maps</h3>
            <span className="bg-[#0f172a] text-[#94a3b8] text-xs font-bold px-2 py-1 rounded">
              Cluster Node Size: {tenants.length} Workspaces
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#111827] text-[#cbd5e1] font-bold border-b border-[#334155]">
                  <th className="p-4 text-xs tracking-wider">CLUSTER LINK ID</th>
                  <th className="p-4 text-xs tracking-wider">ORG SYSTEM ENTITY</th>
                  <th className="p-4 text-xs tracking-wider">DOMAIN IDENTIFIER SLUG</th>
                  <th className="p-4 text-xs tracking-wider">PROVISION DATE</th>
                  <th className="p-4 text-xs tracking-wider">GOVERNANCE</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b border-[#334155] hover:bg-[#1f293d] transition-colors">
                    <td className="p-4 font-mono text-xs text-[#38bdf8]">{t.id}</td>
                    <td className="p-4 font-bold text-white">{t.name}</td>
                    <td className="p-4 font-mono text-xs text-[#cbd5e1]">/{t.slug}</td>
                    <td className="p-4 text-xs text-[#64748b] font-semibold">{t.joined}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleTenantStatus(t.id)}
                        className={`px-3 py-1.5 border-none rounded text-[10px] font-black tracking-wider cursor-pointer transition-colors ${t.status === 'ACTIVE' ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                      >
                        {t.status === 'ACTIVE' ? '🛑 SUSPEND WORKSPACE' : '✅ REVIVE WORKSPACE'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}