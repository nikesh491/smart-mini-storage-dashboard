import React from 'react';
import { Thermometer, ArrowUpRight, ArrowDownRight, Flame } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export function TemperatureCard({ currentTemp, targetMin, targetMax, optimalTemp }) {
  const isHigh = currentTemp > targetMax;
  const isLow = currentTemp < targetMin;
  const isOptimal = !isHigh && !isLow;

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
          TEMPERATURE CONTROL CENTER
        </span>
        <Badge variant={isOptimal ? 'safe' : isHigh ? 'critical' : 'warning'}>
          {isOptimal ? 'OPTIMAL' : isHigh ? 'HIGH TEMPERATURE' : 'LOW TEMPERATURE'}
        </Badge>
      </div>

      <div className="my-6 flex items-baseline gap-3">
        <span className="text-5xl font-extrabold font-mono text-white tracking-tight">
          {currentTemp}°C
        </span>
        <span className="text-sm font-medium text-slate-400">
          Target: <span className="text-teal-300 font-mono font-bold">{targetMin}°C — {targetMax}°C</span>
        </span>
      </div>

      {/* Range Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>Min ({targetMin}°C)</span>
          <span className="text-teal-400 font-bold">Optimal ({optimalTemp}°C)</span>
          <span>Max ({targetMax}°C)</span>
        </div>
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isOptimal ? 'bg-gradient-to-r from-teal-500 to-emerald-400' : isHigh ? 'bg-rose-500' : 'bg-amber-400'}`}
            style={{ width: `${Math.min(100, Math.max(10, ((currentTemp - (targetMin - 5)) / ((targetMax + 5) - (targetMin - 5))) * 100))}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
