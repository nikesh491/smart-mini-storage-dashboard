import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, Carrot, Thermometer, Droplets, Cpu, LineChart, Database, Bell, Settings, Radio, ShieldCheck, Menu, User, Clock, RefreshCw, Fan, DoorClosed, DoorOpen, Power, Sparkles, Shield, ShieldAlert, Server, Wifi, Activity, Zap, CheckCircle2, ArrowDown, Info, Download, ChevronLeft, ChevronRight, CheckCheck, Sliders, Save, Filter, Search, WifiOff, AlertOctagon, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, BarChart, Bar } from 'recharts';
import axios from 'axios';

// --- DATA & DATA MODELS ---
const vegetableProfiles = [{
  id: 'carrot',
  name: 'Carrot',
  category: 'Root Vegetable',
  minTemperature: 0.0,
  maxTemperature: 5.0,
  optimalTemp: 2.5,
  minHumidity: 90,
  maxHumidity: 95,
  optimalHumidity: 93,
  storageLife: '4-6 Months',
  image: '/images/carrot.png',
  color: 'orange',
  description: 'Requires cold, high-humidity storage to retain crispiness and prevent moisture loss.',
  tips: 'Keep air circulation consistent. Avoid storing near ethylene-producing fruits like apples.'
}, {
  id: 'tomato',
  name: 'Tomato',
  category: 'Nightshade Fruit',
  minTemperature: 10.0,
  maxTemperature: 15.0,
  optimalTemp: 12.5,
  minHumidity: 85,
  maxHumidity: 90,
  optimalHumidity: 88,
  storageLife: '1-2 Weeks',
  image: '/images/tomato.png',
  color: 'red',
  description: 'Chilling sensitive. Stored above 10°C to preserve natural sugars, aroma, and flavor compounds.',
  tips: 'Do not store below 10°C to prevent chilling injury and mealy texture.'
}, {
  id: 'cabbage',
  name: 'Cabbage',
  category: 'Brassica',
  minTemperature: 0.0,
  maxTemperature: 4.0,
  optimalTemp: 1.5,
  minHumidity: 90,
  maxHumidity: 98,
  optimalHumidity: 95,
  storageLife: '3-5 Months',
  image: '/images/cabbage.png',
  color: 'emerald',
  description: 'Thrives in near-freezing conditions with dense humidity to keep outer leaves crisp.',
  tips: 'Ensure high ventilation to prevent condensation buildup between leaf layers.'
}, {
  id: 'leafy',
  name: 'Leafy Vegetables',
  category: 'Greens (Spinach/Lettuce)',
  minTemperature: 0.5,
  maxTemperature: 3.5,
  optimalTemp: 2.0,
  minHumidity: 95,
  maxHumidity: 100,
  optimalHumidity: 98,
  storageLife: '1-3 Weeks',
  image: '/images/leafy.png',
  color: 'teal',
  description: 'Extremely sensitive to water loss. Requires ultra-high relative humidity and precise low temperature.',
  tips: 'Mist lightly if humidity drops below 92%. Avoid direct freezing contact.'
}, {
  id: 'potato',
  name: 'Potato',
  category: 'Tuber',
  minTemperature: 7.0,
  maxTemperature: 10.0,
  optimalTemp: 8.5,
  minHumidity: 85,
  maxHumidity: 90,
  optimalHumidity: 88,
  storageLife: '4-8 Months',
  image: '/images/potato.png',
  color: 'amber',
  description: 'Requires cool, dark environment. Storing below 6°C converts starch to sugars (sweetening).',
  tips: 'Keep door sealed to block ambient light exposure and prevent sprouting/greening.'
}];
const defaultSensorState = {
  temperature: 4.2,
  humidity: 92,
  door: 'CLOSED',
  cooling: 'OFF',
  status: 'SAFE',
  esp32Status: 'ONLINE',
  dht22Status: 'ACTIVE',
  wifiSignal: -58,
  lastUpdated: new Date().toISOString()
};

// --- MOCK SERVICE API LAYER ---
let mockLiveState = {
  ...defaultSensorState
};
const generateHistoryData = (points = 12, targetMin = 0, targetMax = 5) => {
  const data = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const timeStr = new Date(now.getTime() - i * 3600 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    const tempNoise = Math.sin(i * 0.8) * 1.2 + (Math.random() * 0.4 - 0.2);
    const humidityNoise = Math.cos(i * 0.5) * 3 + (Math.random() * 1.5 - 0.75);
    const targetCenter = (targetMin + targetMax) / 2;
    const temp = parseFloat((targetCenter + tempNoise).toFixed(1));
    const humidity = Math.min(99, Math.max(70, Math.round(92 + humidityNoise)));
    const cooling = temp > targetMax ? 'ON' : 'OFF';
    data.push({
      time: timeStr,
      timestamp: new Date(now.getTime() - i * 3600 * 1000).toISOString(),
      temperature: temp,
      humidity: humidity,
      targetMin,
      targetMax,
      cooling: cooling,
      door: i === 3 ? 'OPEN' : 'CLOSED'
    });
  }
  return data;
};

// --- COMMON COMPONENTS ---
function Badge({
  children,
  variant = 'default',
  className = ''
}) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-teal',
    normal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    active: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${variants[variant] || variants.default} ${className}`
  }, children);
}
function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button'
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-semibold shadow-lg shadow-teal-500/20 active:scale-98',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    outline: 'border border-teal-500/30 hover:border-teal-500 text-teal-400 hover:bg-teal-500/10',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5'
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    onClick: onClick,
    disabled: disabled,
    className: `${base} ${variants[variant]} ${sizes[size]} ${className}`
  }, children);
}
function StatusIndicator({
  status = 'ONLINE',
  label = '',
  ping = true,
  size = 'md'
}) {
  const colors = {
    ONLINE: 'bg-emerald-400 text-emerald-400',
    CONNECTED: 'bg-teal-400 text-teal-400',
    ACTIVE: 'bg-cyan-400 text-cyan-400',
    SAFE: 'bg-emerald-400 text-emerald-400',
    WARNING: 'bg-amber-400 text-amber-400',
    CRITICAL: 'bg-rose-500 text-rose-500',
    OFFLINE: 'bg-slate-500 text-slate-500',
    DISABLED: 'bg-slate-600 text-slate-600'
  };
  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';
  const colorClass = colors[status] || colors.ONLINE;
  return /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "relative flex items-center justify-center"
  }, ping && status !== 'OFFLINE' && /*#__PURE__*/React.createElement("span", {
    className: `absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${colorClass.split(' ')[0]}`
  }), /*#__PURE__*/React.createElement("span", {
    className: `relative inline-block rounded-full ${dotSize} ${colorClass.split(' ')[0]}`
  })), label && /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium text-slate-300"
  }, label));
}

// --- LAYOUT COMPONENTS ---
function Sidebar({
  activeTab,
  setActiveTab,
  unreadAlertsCount = 1,
  isMobileOpen,
  setIsMobileOpen
}) {
  const navItems = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  }, {
    id: 'vegetables',
    label: 'Vegetables',
    icon: Carrot
  }, {
    id: 'temperature',
    label: 'Temperature',
    icon: Thermometer
  }, {
    id: 'humidity',
    label: 'Humidity',
    icon: Droplets
  }, {
    id: 'hardware',
    label: 'Hardware',
    icon: Cpu
  }, {
    id: 'analytics',
    label: 'Analytics',
    icon: LineChart
  }, {
    id: 'database',
    label: 'Database',
    icon: Database
  }, {
    id: 'alerts',
    label: 'Alerts',
    icon: Bell,
    badge: unreadAlertsCount
  }, {
    id: 'settings',
    label: 'Settings',
    icon: Settings
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, isMobileOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden",
    onClick: () => setIsMobileOpen(false)
  }), /*#__PURE__*/React.createElement("aside", {
    className: `
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-[#0a0f1d] border-r border-slate-800/80
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "p-5 border-b border-slate-800/60 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-teal-500/20"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-full bg-[#0d1424] rounded-[10px] flex items-center justify-center overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/images/logo.png",
    alt: "Smart Mini Storage Logo",
    className: "w-8 h-8 object-contain",
    onError: e => {
      e.target.style.display = 'none';
    }
  }), /*#__PURE__*/React.createElement(ShieldCheck, {
    className: "w-5 h-5 text-teal-400"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-base font-extrabold tracking-wide text-white font-sans flex items-center gap-1.5"
  }, "SMART MINI"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-mono uppercase tracking-widest text-teal-400 font-semibold"
  }, "STORAGE IOT"))), /*#__PURE__*/React.createElement("nav", {
    className: "p-3 space-y-1"
  }, navItems.map(item => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return /*#__PURE__*/React.createElement("button", {
      key: item.id,
      onClick: () => {
        setActiveTab(item.id);
        setIsMobileOpen(false);
      },
      className: `
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200 group text-left
                    ${isActive ? 'bg-gradient-to-r from-teal-500/15 to-cyan-500/10 text-teal-300 border border-teal-500/30 shadow-sm shadow-teal-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'}
                  `
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement(Icon, {
      className: "w-4 h-4 transition-transform group-hover:scale-110 text-teal-400/80 group-hover:text-teal-300"
    }), /*#__PURE__*/React.createElement("span", null, item.label)), item.badge > 0 && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 text-xs font-bold font-mono rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse"
    }, item.badge));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400 font-medium"
  }, "System Online"), /*#__PURE__*/React.createElement(StatusIndicator, {
    status: "ONLINE",
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Radio, {
    className: "w-3.5 h-3.5 text-teal-400 animate-pulse"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-[11px] text-slate-300"
  }, "ESP32-DHT22")), /*#__PURE__*/React.createElement("span", {
    className: "px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold"
  }, "CONNECTED")))));
}
function Topbar({
  onMenuToggle,
  lastUpdatedSec = 0,
  onRefresh
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "h-16 border-b border-slate-800/80 bg-[#090e1a]/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onMenuToggle,
    className: "p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white lg:hidden border border-slate-700"
  }, /*#__PURE__*/React.createElement(Menu, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-sm lg:text-base font-extrabold text-white tracking-tight flex items-center gap-2"
  }, "SMART MINI STORAGE", /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20"
  }, "ESP32 + DHT22 IoT")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 hidden sm:block"
  }, "Real-Time Environmental Monitoring & Automated Storage Control"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 lg:gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800"
  }, /*#__PURE__*/React.createElement(StatusIndicator, {
    status: "ONLINE",
    size: "sm"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-medium text-slate-300"
  }, "System Online")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800"
  }, /*#__PURE__*/React.createElement(Clock, {
    className: "w-3.5 h-3.5 text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, lastUpdatedSec, "s ago"), onRefresh && /*#__PURE__*/React.createElement("button", {
    onClick: onRefresh,
    className: "ml-1 text-slate-400 hover:text-teal-300 transition-transform active:rotate-180",
    title: "Sync Telemetry"
  }, /*#__PURE__*/React.createElement(RefreshCw, {
    className: "w-3 h-3"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("button", {
    className: "p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors relative"
  }, /*#__PURE__*/React.createElement(Bell, {
    className: "w-4 h-4"
  }), /*#__PURE__*/React.createElement("span", {
    className: "absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 pl-2 border-l border-slate-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 flex items-center justify-center text-teal-400 shadow-sm"
  }, /*#__PURE__*/React.createElement(User, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hidden xl:block"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-semibold text-slate-200"
  }, "IoT Admin"), /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400 font-mono"
  }, "Chamber Node #1")))));
}

// --- DASHBOARD COMPONENTS ---
function SensorCard({
  title,
  value,
  unit = '',
  subtitle,
  status,
  statusVariant = 'normal',
  icon: Icon,
  colorTheme = 'teal',
  glow = false
}) {
  const themes = {
    teal: 'from-teal-500/10 to-cyan-500/5 text-teal-400 border-teal-500/20',
    blue: 'from-sky-500/10 to-blue-500/5 text-sky-400 border-sky-500/20',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-400 border-amber-500/20',
    emerald: 'from-emerald-500/10 to-green-500/5 text-emerald-400 border-emerald-500/20',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-400 border-rose-500/20'
  };
  const themeClass = themes[colorTheme] || themes.teal;
  return /*#__PURE__*/React.createElement("div", {
    className: `relative p-5 rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between ${glow ? 'glow-teal' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${themeClass} opacity-30 blur-2xl pointer-events-none`
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold uppercase tracking-wider text-slate-400"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: `p-2 rounded-xl bg-slate-900/80 border border-slate-800 ${themeClass.split(' ')[2]}`
  }, Icon && /*#__PURE__*/React.createElement(Icon, {
    className: "w-5 h-5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "my-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-white"
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-medium text-slate-400"
  }, unit)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 mt-1 font-medium"
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-slate-500 font-mono uppercase"
  }, "State"), /*#__PURE__*/React.createElement(Badge, {
    variant: statusVariant
  }, status)));
}
function StorageModel({
  sensorData,
  activeVegetable,
  onToggleDoor,
  onToggleCooling
}) {
  const isCoolingOn = sensorData?.cooling === 'ON';
  const isDoorOpen = sensorData?.door === 'OPEN';
  const isSafe = sensorData?.status === 'SAFE';
  return /*#__PURE__*/React.createElement("div", {
    className: "relative rounded-3xl glass-panel p-6 overflow-hidden border border-slate-700/50 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute top-0 right-0 w-72 h-72 rounded-full ${isCoolingOn ? 'bg-cyan-500/10' : 'bg-teal-500/5'} blur-3xl pointer-events-none`
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(Sparkles, {
    className: "w-5 h-5 text-teal-400"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-bold text-white tracking-wide uppercase font-mono"
  }, "LIVE STORAGE CHAMBER")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 mt-0.5"
  }, "Physical Mini Storage Unit Telemetry & Active Climate Simulation")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-slate-400"
  }, "Target Profile:"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-teal-300 font-mono"
  }, activeVegetable?.name || 'Carrot')), /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${isSafe ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`
  }, isSafe ? /*#__PURE__*/React.createElement(Shield, {
    className: "w-4 h-4"
  }) : /*#__PURE__*/React.createElement(ShieldAlert, {
    className: "w-4 h-4 animate-bounce"
  }), /*#__PURE__*/React.createElement("span", null, isSafe ? 'OPTIMAL ENVIRONMENT' : 'ATTENTION REQUIRED')))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 relative bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#070b12] rounded-2xl border-2 border-slate-800 p-6 md:p-8 overflow-hidden shadow-inner"
  }, isCoolingOn && /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-teal-500/5 to-transparent pointer-events-none animate-mist"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-6 border-b border-slate-800/80 relative z-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3 h-3 rounded-full bg-teal-400 animate-ping"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono text-slate-300 uppercase tracking-widest font-semibold"
  }, "SMART STORAGE CHAMBER NODE #01")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800"
  }, /*#__PURE__*/React.createElement(Fan, {
    className: `w-5 h-5 ${isCoolingOn ? 'text-cyan-400 animate-fan-fast' : 'text-slate-600'}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-left"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400 uppercase font-mono"
  }, "Peltier Cooler"), /*#__PURE__*/React.createElement("p", {
    className: `text-xs font-bold font-mono ${isCoolingOn ? 'text-cyan-400' : 'text-slate-500'}`
  }, isCoolingOn ? 'ACTIVE (COOLING)' : 'STANDBY (OFF)')), onToggleCooling && /*#__PURE__*/React.createElement("button", {
    onClick: onToggleCooling,
    className: `ml-2 p-1.5 rounded-lg border text-xs transition-all ${isCoolingOn ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`,
    title: "Manual Override"
  }, /*#__PURE__*/React.createElement(Power, {
    className: "w-3.5 h-3.5"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center relative z-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 relative group"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-full relative rounded-xl border-2 transition-colors p-4 flex flex-col items-center justify-center gap-4 ${isDoorOpen ? 'border-amber-500/50 bg-amber-500/5' : 'border-teal-500/30 bg-slate-950/80'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-48 h-36 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: activeVegetable?.image || '/images/carrot.png',
    alt: activeVegetable?.name || 'Vegetables',
    className: "max-h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105",
    onError: e => {
      e.target.src = '/images/carrot.png';
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl"
  }, "\uD83E\uDD55 \uD83E\uDD66 \uD83C\uDF45 \uD83E\uDD6C"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-slate-300"
  }, activeVegetable?.name || 'Carrot', " Batch")), onToggleDoor && /*#__PURE__*/React.createElement("button", {
    onClick: onToggleDoor,
    className: `mt-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${isDoorOpen ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-teal-500'}`
  }, isDoorOpen ? /*#__PURE__*/React.createElement(DoorOpen, {
    className: "w-4 h-4 text-amber-400"
  }) : /*#__PURE__*/React.createElement(DoorClosed, {
    className: "w-4 h-4 text-teal-400"
  }), /*#__PURE__*/React.createElement("span", null, "DOOR: ", sensorData?.door || 'CLOSED', " (Click to Toggle)")))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-6 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400"
  }, /*#__PURE__*/React.createElement(Thermometer, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 font-medium"
  }, "Inside Temperature"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold font-mono text-white"
  }, sensorData?.temperature ?? 24.5, "\xB0C"))), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400 font-mono"
  }, "Target Range"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-mono font-bold text-teal-300"
  }, activeVegetable?.minTemperature ?? 0, "\xB0C \u2014 ", activeVegetable?.maxTemperature ?? 5, "\xB0C"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
  }, /*#__PURE__*/React.createElement(Droplets, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400 font-medium"
  }, "Inside Humidity"), /*#__PURE__*/React.createElement("p", {
    className: "text-2xl font-extrabold font-mono text-white"
  }, sensorData?.humidity ?? 68, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] text-slate-400 font-mono"
  }, "Target Range"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-mono font-bold text-cyan-300"
  }, activeVegetable?.minHumidity ?? 90, "% \u2014 ", activeVegetable?.maxHumidity ?? 95, "%"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement(StatusIndicator, {
    status: isSafe ? 'SAFE' : 'WARNING'
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-slate-300"
  }, "Micro-Climate Control")), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono font-bold text-slate-400 uppercase"
  }, isCoolingOn ? '❄ COOLING ENGAGED' : '● REGULATION STABLE')))), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2 relative z-10"
  }, /*#__PURE__*/React.createElement("div", null, "DHT22 Sensor: ", /*#__PURE__*/React.createElement("span", {
    className: "text-emerald-400"
  }, "\u25CF ONLINE")), /*#__PURE__*/React.createElement("div", null, "ESP32 Telemetry: ", /*#__PURE__*/React.createElement("span", {
    className: "text-teal-300"
  }, "100% Signal (-58 dBm)")), /*#__PURE__*/React.createElement("div", null, "Chamber Seal: ", /*#__PURE__*/React.createElement("span", {
    className: isDoorOpen ? 'text-amber-400 font-bold' : 'text-slate-300'
  }, sensorData?.door || 'CLOSED')))));
}
function TemperatureChart({
  data,
  targetMin = 0,
  targetMax = 5,
  title = "Temperature History"
}) {
  const chartData = data && data.length > 0 ? data : [{
    time: '12:00',
    temperature: 23.5
  }, {
    time: '13:00',
    temperature: 24.0
  }, {
    time: '14:00',
    temperature: 24.5
  }, {
    time: '15:00',
    temperature: 25.1
  }, {
    time: '16:00',
    temperature: 24.8
  }, {
    time: '17:00',
    temperature: 24.3
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass-panel p-5 border border-slate-800 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold uppercase tracking-wider text-slate-200 font-mono"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Live & Historical Sensor Readings (\xB0C)")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-xs font-mono"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full bg-teal-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-300"
  }, "Temp (\xB0C)")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-0.5 bg-rose-500/80"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-400"
  }, "Target Range")))), /*#__PURE__*/React.createElement("div", {
    className: "h-64 w-full"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: chartData,
    margin: {
      top: 10,
      right: 10,
      left: -20,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "tempGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "5%",
    stopColor: "#14b8a6",
    stopOpacity: 0.4
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "95%",
    stopColor: "#14b8a6",
    stopOpacity: 0.0
  }))), /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: "#1e293b"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "time",
    stroke: "#64748b",
    fontSize: 11,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    stroke: "#64748b",
    fontSize: 11,
    tickLine: false
  }), /*#__PURE__*/React.createElement(Tooltip, {
    contentStyle: {
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '12px'
    }
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    y: targetMax,
    stroke: "#f43f5e",
    strokeDasharray: "4 4",
    label: {
      value: `Max: ${targetMax}°C`,
      fill: '#f43f5e',
      fontSize: 10,
      position: 'insideTopRight'
    }
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    y: targetMin,
    stroke: "#38bdf8",
    strokeDasharray: "4 4",
    label: {
      value: `Min: ${targetMin}°C`,
      fill: '#38bdf8',
      fontSize: 10,
      position: 'insideBottomRight'
    }
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "temperature",
    stroke: "#2dd4bf",
    strokeWidth: 3,
    fillOpacity: 1,
    fill: "url(#tempGrad)"
  })))));
}
function HumidityChart({
  data,
  targetMin = 90,
  targetMax = 95,
  title = "Humidity History"
}) {
  const chartData = data && data.length > 0 ? data : [{
    time: '12:00',
    humidity: 91
  }, {
    time: '13:00',
    humidity: 93
  }, {
    time: '14:00',
    humidity: 92
  }, {
    time: '15:00',
    humidity: 90
  }, {
    time: '16:00',
    humidity: 94
  }, {
    time: '17:00',
    humidity: 93
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "rounded-2xl glass-panel p-5 border border-slate-800 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold uppercase tracking-wider text-slate-200 font-mono"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-400"
  }, "Relative Humidity Telemetry (% RH)")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 text-xs font-mono"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full bg-cyan-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-300"
  }, "Humidity (% RH)")))), /*#__PURE__*/React.createElement("div", {
    className: "h-64 w-full"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement(AreaChart, {
    data: chartData,
    margin: {
      top: 10,
      right: 10,
      left: -20,
      bottom: 0
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "humGrad",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "5%",
    stopColor: "#06b6d4",
    stopOpacity: 0.4
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "95%",
    stopColor: "#06b6d4",
    stopOpacity: 0.0
  }))), /*#__PURE__*/React.createElement(CartesianGrid, {
    strokeDasharray: "3 3",
    stroke: "#1e293b"
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "time",
    stroke: "#64748b",
    fontSize: 11,
    tickLine: false
  }), /*#__PURE__*/React.createElement(YAxis, {
    stroke: "#64748b",
    fontSize: 11,
    domain: [40, 100],
    tickLine: false
  }), /*#__PURE__*/React.createElement(Tooltip, {
    contentStyle: {
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '12px'
    }
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    y: targetMax,
    stroke: "#38bdf8",
    strokeDasharray: "4 4",
    label: {
      value: `Max: ${targetMax}%`,
      fill: '#38bdf8',
      fontSize: 10,
      position: 'insideTopRight'
    }
  }), /*#__PURE__*/React.createElement(ReferenceLine, {
    y: targetMin,
    stroke: "#38bdf8",
    strokeDasharray: "4 4",
    label: {
      value: `Min: ${targetMin}%`,
      fill: '#38bdf8',
      fontSize: 10,
      position: 'insideBottomRight'
    }
  }), /*#__PURE__*/React.createElement(Area, {
    type: "monotone",
    dataKey: "humidity",
    stroke: "#22d3ee",
    strokeWidth: 3,
    fillOpacity: 1,
    fill: "url(#humGrad)"
  })))));
}

// --- MAIN APPLICATION APP ---
export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProfile, setActiveProfile] = useState(vegetableProfiles[0]);
  const [sensorData, setSensorData] = useState({
    temperature: 4.2,
    humidity: 92,
    door: 'CLOSED',
    cooling: 'OFF',
    status: 'SAFE'
  });
  const [lastUpdatedSec, setLastUpdatedSec] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [history, setHistory] = useState([]);

  // Telemetry loop
  useEffect(() => {
    const updateLoop = () => {
      const jTemp = Math.random() * 0.2 - 0.1;
      const jHum = Math.random() * 0.6 - 0.3;
      setSensorData(prev => {
        const nextTemp = parseFloat(Math.max(-2, Math.min(35, prev.temperature + jTemp)).toFixed(1));
        const nextHum = Math.min(99, Math.max(40, Math.round(prev.humidity + jHum)));
        let cooling = prev.cooling;
        let status = 'SAFE';
        if (nextTemp > activeProfile.maxTemperature) {
          cooling = 'ON';
          status = 'WARNING';
        } else if (nextTemp <= activeProfile.optimalTemp + 0.5) {
          cooling = 'OFF';
        }
        if (prev.door === 'OPEN') status = 'WARNING';
        return {
          ...prev,
          temperature: nextTemp,
          humidity: nextHum,
          cooling,
          status
        };
      });
      setLastUpdatedSec(0);
    };
    updateLoop();
    const interval = setInterval(updateLoop, 4000);
    const secTimer = setInterval(() => setLastUpdatedSec(p => p + 1), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(secTimer);
    };
  }, [activeProfile]);
  useEffect(() => {
    setHistory(generateHistoryData(12, activeProfile.minTemperature, activeProfile.maxTemperature));
  }, [activeProfile]);
  const handleToggleDoor = () => {
    setSensorData(prev => ({
      ...prev,
      door: prev.door === 'OPEN' ? 'CLOSED' : 'OPEN'
    }));
  };
  const handleToggleCooling = () => {
    setSensorData(prev => ({
      ...prev,
      cooling: prev.cooling === 'ON' ? 'OFF' : 'ON'
    }));
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return /*#__PURE__*/React.createElement("div", {
          className: "space-y-6"
        }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
          className: "text-2xl lg:text-3xl font-extrabold text-white tracking-tight uppercase font-sans"
        }, "SMART MINI STORAGE"), /*#__PURE__*/React.createElement("p", {
          className: "text-xs lg:text-sm text-teal-400 font-mono font-medium mt-1"
        }, "Real-Time Environmental Monitoring & Automated Storage Control")), /*#__PURE__*/React.createElement("div", {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        }, /*#__PURE__*/React.createElement(SensorCard, {
          title: "Temperature",
          value: `${sensorData.temperature}`,
          unit: "\xB0C",
          subtitle: "Current Temperature",
          status: sensorData.temperature > activeProfile.maxTemperature ? 'HIGH' : 'NORMAL',
          statusVariant: sensorData.temperature > activeProfile.maxTemperature ? 'critical' : 'safe',
          icon: Thermometer,
          colorTheme: "teal",
          glow: sensorData.temperature > activeProfile.maxTemperature
        }), /*#__PURE__*/React.createElement(SensorCard, {
          title: "Humidity",
          value: `${sensorData.humidity}`,
          unit: "%",
          subtitle: "Current Humidity",
          status: sensorData.humidity < activeProfile.minHumidity ? 'LOW' : 'NORMAL',
          statusVariant: sensorData.humidity < activeProfile.minHumidity ? 'warning' : 'active',
          icon: Droplets,
          colorTheme: "cyan"
        }), /*#__PURE__*/React.createElement(SensorCard, {
          title: "Cooling",
          value: sensorData.cooling,
          subtitle: "Cooling System",
          status: sensorData.cooling === 'ON' ? 'ACTIVE' : 'IDLE',
          statusVariant: sensorData.cooling === 'ON' ? 'active' : 'default',
          icon: Fan,
          colorTheme: "emerald"
        }), /*#__PURE__*/React.createElement(SensorCard, {
          title: "Door",
          value: sensorData.door,
          subtitle: "Storage Door",
          status: sensorData.door === 'CLOSED' ? 'SECURE' : 'UNSEALED',
          statusVariant: sensorData.door === 'CLOSED' ? 'safe' : 'warning',
          icon: sensorData.door === 'CLOSED' ? DoorClosed : DoorOpen,
          colorTheme: sensorData.door === 'CLOSED' ? 'teal' : 'amber'
        })), /*#__PURE__*/React.createElement(StorageModel, {
          sensorData: sensorData,
          activeVegetable: activeProfile,
          onToggleDoor: handleToggleDoor,
          onToggleCooling: handleToggleCooling
        }), /*#__PURE__*/React.createElement("div", {
          className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
        }, /*#__PURE__*/React.createElement(TemperatureChart, {
          data: history,
          targetMin: activeProfile.minTemperature,
          targetMax: activeProfile.maxTemperature
        }), /*#__PURE__*/React.createElement(HumidityChart, {
          data: history,
          targetMin: activeProfile.minHumidity,
          targetMax: activeProfile.maxHumidity
        })));
      case 'vegetables':
        return /*#__PURE__*/React.createElement("div", {
          className: "space-y-6"
        }, /*#__PURE__*/React.createElement("h1", {
          className: "text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2"
        }, /*#__PURE__*/React.createElement(Carrot, {
          className: "w-6 h-6 text-teal-400"
        }), "Vegetable Storage Profiles"), /*#__PURE__*/React.createElement("div", {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        }, vegetableProfiles.map(p => {
          const isSelected = activeProfile.id === p.id;
          return /*#__PURE__*/React.createElement("div", {
            key: p.id,
            className: `rounded-2xl glass-panel p-5 border flex flex-col justify-between ${isSelected ? 'border-teal-500 bg-teal-500/10' : 'border-slate-800'}`
          }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
            className: "w-full h-32 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-3 mb-3"
          }, /*#__PURE__*/React.createElement("img", {
            src: p.image,
            alt: p.name,
            className: "max-h-24 object-contain",
            onError: e => {
              e.target.src = '/images/carrot.png';
            }
          })), /*#__PURE__*/React.createElement("h3", {
            className: "text-lg font-bold text-white uppercase"
          }, p.name), /*#__PURE__*/React.createElement("p", {
            className: "text-xs text-slate-400 mt-1"
          }, p.description), /*#__PURE__*/React.createElement("div", {
            className: "mt-4 space-y-2 text-xs font-mono"
          }, /*#__PURE__*/React.createElement("div", {
            className: "p-2 rounded bg-slate-950 border border-slate-800"
          }, /*#__PURE__*/React.createElement("span", {
            className: "text-slate-400"
          }, "Temp: "), /*#__PURE__*/React.createElement("span", {
            className: "text-teal-300 font-bold"
          }, p.minTemperature, "\xB0C \u2014 ", p.maxTemperature, "\xB0C")), /*#__PURE__*/React.createElement("div", {
            className: "p-2 rounded bg-slate-950 border border-slate-800"
          }, /*#__PURE__*/React.createElement("span", {
            className: "text-slate-400"
          }, "Humidity: "), /*#__PURE__*/React.createElement("span", {
            className: "text-cyan-300 font-bold"
          }, p.minHumidity, "% \u2014 ", p.maxHumidity, "%")))), /*#__PURE__*/React.createElement(Button, {
            variant: isSelected ? 'primary' : 'outline',
            onClick: () => setActiveProfile(p),
            className: "w-full mt-4"
          }, isSelected ? 'ACTIVE TARGET' : 'SELECT CROP'));
        })));
      default:
        return /*#__PURE__*/React.createElement("div", {
          className: "space-y-6"
        }, /*#__PURE__*/React.createElement("h1", {
          className: "text-2xl font-extrabold text-white tracking-tight uppercase"
        }, activeTab.toUpperCase(), " MODULE"), /*#__PURE__*/React.createElement("div", {
          className: "p-8 rounded-2xl glass-panel border border-slate-800 text-center font-mono text-xs text-slate-400"
        }, "Module ", activeTab, " running live telemetry diagnostics."));
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex h-screen overflow-hidden bg-[#080c14] text-slate-100"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    activeTab: activeTab,
    setActiveTab: setActiveTab,
    unreadAlertsCount: 1,
    isMobileOpen: isMobileOpen,
    setIsMobileOpen: setIsMobileOpen
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 flex flex-col min-w-0 overflow-hidden"
  }, /*#__PURE__*/React.createElement(Topbar, {
    onMenuToggle: () => setIsMobileOpen(!isMobileOpen),
    lastUpdatedSec: lastUpdatedSec,
    onRefresh: () => setLastUpdatedSec(0)
  }), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 overflow-y-auto p-4 lg:p-6 bg-grid-pattern"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto"
  }, renderContent()))));
}

// --- DOM RENDERER ---
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render( /*#__PURE__*/React.createElement(App, null));
}