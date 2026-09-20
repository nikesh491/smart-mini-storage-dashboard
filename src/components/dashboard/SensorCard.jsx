import React from 'react';
import { Badge } from '../common/Badge.jsx';

export function SensorCard({ title, value, unit = '', subtitle, status, statusVariant = 'normal', icon: Icon, colorTheme = 'teal', glow = false }) {
  const themes = {
    teal: 'from-teal-500/10 to-cyan-500/5 text-teal-400 border-teal-500/20',
    blue: 'from-sky-500/10 to-blue-500/5 text-sky-400 border-sky-500/20',
    amber: 'from-amber-500/10 to-orange-500/5 text-amber-400 border-amber-500/20',
    emerald: 'from-emerald-500/10 to-green-500/5 text-emerald-400 border-emerald-500/20',
    rose: 'from-rose-500/10 to-pink-500/5 text-rose-400 border-rose-500/20',
  };

  const themeClass = themes[colorTheme] || themes.teal;

  return (
    <div className={`
      relative p-5 rounded-2xl glass-panel glass-panel-hover overflow-hidden flex flex-col justify-between
      ${glow ? 'glow-teal' : ''}
    `}>
      {/* Background Subtle Gradient Glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${themeClass} opacity-30 blur-2xl pointer-events-none`}></div>

      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2 rounded-xl bg-slate-900/80 border border-slate-800 ${themeClass.split(' ')[2]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* Primary Value Display */}
      <div className="my-1">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl lg:text-4xl font-extrabold font-mono tracking-tight text-white">
            {value}
          </span>
          {unit && <span className="text-lg font-medium text-slate-400">{unit}</span>}
        </div>
        <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
      </div>

      {/* Status Footer Badge */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono uppercase">State</span>
        <Badge variant={statusVariant}>{status}</Badge>
      </div>
    </div>
  );
}
