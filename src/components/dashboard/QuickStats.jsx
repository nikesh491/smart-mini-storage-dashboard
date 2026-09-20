import React from 'react';
import { Activity, Clock, ShieldCheck, Zap } from 'lucide-react';

export function QuickStats({ activeVegetable, sensorData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-mono">Active Profile</p>
          <p className="text-sm font-bold text-white font-mono">{activeVegetable?.name || 'Carrot'}</p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-mono">Cooling Duty</p>
          <p className="text-sm font-bold text-white font-mono">{sensorData?.cooling === 'ON' ? '100% PWM' : '0% Idle'}</p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-mono">Peltier Draw</p>
          <p className="text-sm font-bold text-white font-mono">{sensorData?.cooling === 'ON' ? '45 Watts' : '2.1 Watts'}</p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-mono">Uptime</p>
          <p className="text-sm font-bold text-white font-mono">14d 06h 22m</p>
        </div>
      </div>
    </div>
  );
}
