import React from 'react';
import { Menu, Bell, User, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { StatusIndicator } from '../common/StatusIndicator.jsx';

export function Topbar({ onMenuToggle, lastUpdatedSec = 0, onRefresh }) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#090e1a]/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white lg:hidden border border-slate-700"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm lg:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
            SMART MINI STORAGE
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20">
              ESP32 + DHT22 IoT
            </span>
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            Real-Time Environmental Monitoring & Automated Storage Control
          </p>
        </div>
      </div>

      {/* Right Telemetry Indicators & Controls */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* System Online Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <StatusIndicator status="ONLINE" size="sm" />
          <span className="text-xs font-medium text-slate-300">System Online</span>
        </div>

        {/* Refresh Timer */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span>{lastUpdatedSec}s ago</span>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="ml-1 text-slate-400 hover:text-teal-300 transition-transform active:rotate-180"
              title="Force sync telemetry"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button 
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </button>
        </div>

        {/* User / Profile Icon */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-teal-400 shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block">
            <p className="text-xs font-semibold text-slate-200">IoT Admin</p>
            <p className="text-[10px] text-slate-400 font-mono">Chamber Node #1</p>
          </div>
        </div>
      </div>
    </header>
  );
}
