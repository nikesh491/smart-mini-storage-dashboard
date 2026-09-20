import React from 'react';
import { Thermometer } from 'lucide-react';

export function TemperatureGauge({ value = 24.5, min = -5, max = 35, targetMin = 0, targetMax = 5 }) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const strokeDasharray = 283;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  const isHigh = value > targetMax;
  const isLow = value < targetMin;

  const colorClass = isHigh ? 'text-rose-500' : isLow ? 'text-amber-400' : 'text-teal-400';

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800 relative">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* SVG Radial Arc */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            className={`transition-all duration-700 ease-out ${colorClass}`}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Thermometer className={`w-6 h-6 mb-1 ${colorClass}`} />
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {value}°C
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
            CHAMBER TEMP
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs text-slate-400 font-mono">
          Target Range: <strong className="text-teal-300">{targetMin}°C — {targetMax}°C</strong>
        </span>
      </div>
    </div>
  );
}
