import React from 'react';
import { Thermometer, DoorOpen, CheckCircle2, WifiOff, AlertOctagon, Info } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export function AlertCard({ alert, onMarkRead }) {
  const { id, type, severity, title, message, timestamp, status, read } = alert;

  const severityBadges = {
    Critical: 'critical',
    Warning: 'warning',
    Normal: 'safe',
    Information: 'info',
  };

  const icons = {
    'Temperature High': Thermometer,
    'Door Open': DoorOpen,
    'Temperature Normal': CheckCircle2,
    'Sensor Offline': WifiOff,
  };

  const Icon = icons[type] || AlertOctagon;

  return (
    <div className={`
      rounded-2xl p-5 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4
      ${read ? 'bg-slate-900/40 border-slate-800/80 opacity-80' : 'bg-slate-900/90 border-slate-700 shadow-lg glow-teal'}
    `}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl border shrink-0 ${severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : severity === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-teal-500/10 text-teal-400 border-teal-500/30'}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-white font-sans">{title}</h4>
            <Badge variant={severityBadges[severity]}>{severity}</Badge>
            <span className="text-[10px] font-mono text-slate-400">{timestamp}</span>
          </div>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
        <span className="text-xs font-mono text-slate-400">{status}</span>
        {!read && onMarkRead && (
          <button
            onClick={() => onMarkRead(id)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-teal-300 transition-colors"
          >
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
}
