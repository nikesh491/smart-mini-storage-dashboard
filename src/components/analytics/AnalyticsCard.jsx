import React from 'react';

export function AnalyticsCard({ title, value, unit = '', description, icon: Icon, colorTheme = 'teal' }) {
  const colorMap = {
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2 rounded-xl border ${colorMap[colorTheme] || colorMap.teal}`}>
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>

      <div className="my-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold font-mono text-white">{value}</span>
          {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
        </div>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}
