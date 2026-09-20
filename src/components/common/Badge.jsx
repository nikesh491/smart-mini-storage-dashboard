import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    safe: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-teal',
    normal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    active: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
