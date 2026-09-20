import React from 'react';

export function StatusIndicator({ status = 'ONLINE', label = '', ping = true, size = 'md' }) {
  const colors = {
    ONLINE: 'bg-emerald-400 text-emerald-400',
    CONNECTED: 'bg-teal-400 text-teal-400',
    ACTIVE: 'bg-cyan-400 text-cyan-400',
    SAFE: 'bg-emerald-400 text-emerald-400',
    WARNING: 'bg-amber-400 text-amber-400',
    CRITICAL: 'bg-rose-500 text-rose-500',
    OFFLINE: 'bg-slate-500 text-slate-500',
    DISABLED: 'bg-slate-600 text-slate-600',
  };

  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';

  const colorClass = colors[status] || colors.ONLINE;

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex items-center justify-center">
        {ping && status !== 'OFFLINE' && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${colorClass.split(' ')[0]}`}></span>
        )}
        <span className={`relative inline-block rounded-full ${dotSize} ${colorClass.split(' ')[0]}`}></span>
      </span>
      {label && <span className="text-xs font-medium text-slate-300">{label}</span>}
    </div>
  );
}
