import React from 'react';
import { StatusIndicator } from '../common/StatusIndicator.jsx';

export function HardwareCard({ title, status = 'CONNECTED', subtitle, details = [], icon: Icon }) {
  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight font-mono">{title}</h4>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>
        <StatusIndicator status={status} size="md" />
      </div>

      <div className="space-y-2 text-xs font-mono">
        {details.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-slate-400">{item.label}</span>
            <span className="text-slate-200 font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
