import React from 'react';
import { ShieldCheck, Info, Clock, Thermometer, Droplets } from 'lucide-react';

export function StorageProfile({ profile }) {
  if (!profile) return null;

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-teal-400 font-semibold">
            ACTIVE HARDWARE CONTROLLER PROFILE
          </span>
          <h3 className="text-2xl font-extrabold text-white font-sans uppercase">
            {profile.name} Storage Parameters
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-4 h-4 text-teal-400" />
          <span>Expected Shelf Life: <strong className="text-white">{profile.storageLife}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 font-mono">
            <Thermometer className="w-4 h-4" />
            <span>THERMAL REGULATION RANGE</span>
          </div>
          <p className="text-2xl font-extrabold font-mono text-white">
            {profile.minTemperature}°C — {profile.maxTemperature}°C
          </p>
          <p className="text-xs text-slate-400">
            Target Cooling Setpoint: <strong className="text-teal-400">{profile.optimalTemp}°C</strong>. Trigger peltier fan when temp {'>'} {profile.maxTemperature}°C.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 font-mono">
            <Droplets className="w-4 h-4" />
            <span>MOISTURE HUMIDITY TARGET</span>
          </div>
          <p className="text-2xl font-extrabold font-mono text-white">
            {profile.minHumidity}% — {profile.maxHumidity}% RH
          </p>
          <p className="text-xs text-slate-400">
            Optimal relative humidity setpoint: <strong className="text-cyan-400">{profile.optimalHumidity}% RH</strong>.
          </p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Storage Tip: </strong>
          {profile.tips}
        </div>
      </div>
    </div>
  );
}
