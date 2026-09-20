import React from 'react';
import { Droplets, CheckCircle2, AlertTriangle } from 'lucide-react';

export function HumidityStatus({ currentHumidity = 68, targetMin = 90, targetMax = 95 }) {
  const isOptimal = currentHumidity >= targetMin && currentHumidity <= targetMax;

  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <Droplets className="w-4 h-4 text-cyan-400" />
          MOISTURE STATUS DIAGNOSTIC
        </h3>
        <span className={`text-xs font-mono font-bold ${isOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isOptimal ? 'HUMIDITY IN RANGE' : 'MOISTURE DEFICIT'}
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Relative humidity directly impacts crop crispiness and prevents transpirational weight loss in storage.
      </p>

      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        {isOptimal ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        )}
        <div className="text-xs">
          <p className="font-semibold text-slate-200">
            {isOptimal ? 'Ideal Micro-Climate Sealed' : 'Humidity below optimal threshold'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            {isOptimal ? 'No moisture adjustment needed.' : 'Ensure chamber door remains closed to lock in moisture.'}
          </p>
        </div>
      </div>
    </div>
  );
}
