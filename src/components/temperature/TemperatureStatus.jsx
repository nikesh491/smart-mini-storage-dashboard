import React from 'react';
import { ArrowDown, Cpu, Fan, ShieldCheck, Thermometer } from 'lucide-react';

export function TemperatureStatus({ currentTemp = 24.5, targetMin = 0, targetMax = 5, isCooling = false }) {
  const status = currentTemp > targetMax ? 'HIGH' : currentTemp < targetMin ? 'LOW' : 'NORMAL';

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
        <Cpu className="w-4 h-4 text-teal-400" />
        AUTOMATED THERMAL LOGIC FLOW
      </h3>

      {/* Visual Flowchart Nodes */}
      <div className="flex flex-col items-center gap-3 py-4 max-w-sm mx-auto font-mono text-xs">
        
        {/* Step 1: Raw Sensor Input */}
        <div className="w-full p-3 rounded-xl bg-slate-900 border border-teal-500/30 text-center flex items-center justify-center gap-2">
          <Thermometer className="w-4 h-4 text-teal-400" />
          <span>DHT22 Live Temperature ({currentTemp}°C)</span>
        </div>

        <ArrowDown className="w-4 h-4 text-slate-500 animate-pulse" />

        {/* Step 2: Logic Compare */}
        <div className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-center">
          Compare with Target Range ({targetMin}°C — {targetMax}°C)
        </div>

        <ArrowDown className="w-4 h-4 text-slate-500 animate-pulse" />

        {/* Step 3: Evaluated Status Badge */}
        <div className={`w-full p-3 rounded-xl text-center font-bold tracking-wider border ${status === 'NORMAL' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : status === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'}`}>
          STATUS EVALUATION: {status}
        </div>

        <ArrowDown className="w-4 h-4 text-slate-500 animate-pulse" />

        {/* Step 4: Cooling Action output */}
        <div className={`w-full p-3 rounded-xl border text-center font-bold flex items-center justify-center gap-2 ${isCooling ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 glow-teal' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
          <Fan className={`w-4 h-4 ${isCooling ? 'animate-fan-fast text-cyan-400' : ''}`} />
          <span>Cooling Control: {isCooling ? 'PELTIER & FAN ENGAGED (ON)' : 'IDLE (OFF)'}</span>
        </div>
      </div>
    </div>
  );
}
