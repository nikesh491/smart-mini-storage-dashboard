import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';

export function MainLayout({ unreadAlertsCount = 1, lastUpdatedSec = 0, onRefresh }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#080c14] text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar 
        unreadAlertsCount={unreadAlertsCount}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar Navigation */}
        <Topbar 
          onMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          lastUpdatedSec={lastUpdatedSec}
          onRefresh={onRefresh}
        />

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-grid-pattern">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
