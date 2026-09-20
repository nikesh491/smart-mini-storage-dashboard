import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Carrot, 
  Thermometer, 
  Droplets, 
  Cpu, 
  LineChart, 
  Database, 
  Bell, 
  Settings,
  Radio,
  ShieldCheck
} from 'lucide-react';
import { StatusIndicator } from '../common/StatusIndicator.jsx';

export function Sidebar({ unreadAlertsCount = 1, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/vegetables', label: 'Vegetables', icon: Carrot },
    { path: '/temperature', label: 'Temperature', icon: Thermometer },
    { path: '/humidity', label: 'Humidity', icon: Droplets },
    { path: '/hardware', label: 'Hardware', icon: Cpu },
    { path: '/analytics', label: 'Analytics', icon: LineChart },
    { path: '/database', label: 'Database', icon: Database },
    { path: '/alerts', label: 'Alerts', icon: Bell, badge: unreadAlertsCount },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-[#0a0f1d] border-r border-slate-800/80
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div>
          <div className="p-5 border-b border-slate-800/60 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-[#0d1424] rounded-[10px] flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/logo.png" 
                  alt="Smart Mini Storage Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // SVG fallback if image fail
                    e.target.style.display = 'none';
                  }}
                />
                <ShieldCheck className="w-5 h-5 text-teal-400 hidden" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wide text-white font-sans flex items-center gap-1.5">
                SMART MINI
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-semibold">
                STORAGE IOT
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-teal-500/15 to-cyan-500/10 text-teal-300 border border-teal-500/30 shadow-sm shadow-teal-500/10' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110 text-teal-400/80 group-hover:text-teal-300" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Hardware Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">System Online</span>
            <StatusIndicator status="ONLINE" size="sm" />
          </div>
          
          <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span className="font-mono text-[11px] text-slate-300">ESP32-DHT22</span>
            </div>
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
              CONNECTED
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
