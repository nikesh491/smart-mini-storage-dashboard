import React from 'react';
import { Droplets } from 'lucide-react';

export function HumidityGauge({ value = 68, min = 0, max = 100, targetMin = 90, targetMax = 95 }) {
  const percentage = Math.min(100, Math.max(0, value));
  const strokeDasharray = 283;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  const isOptimal = value >= targetMin && value <= targetMax;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800 relative">
      <div className="relative w-44 h-44 flex items-center justify-center">
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
            className={`transition-all duration-700 ease-out ${isOptimal ? 'text-cyan-400' : 'text-amber-400'}`}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Droplets className="w-6 h-6 mb-1 text-cyan-400" />
          <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {value}%
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
            RELATIVE HUMIDITY
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs text-slate-400 font-mono">
          Target Moisture: <strong className="text-cyan-300">{targetMin}% — {targetMax}% RH</strong>
        </span>
      </div>
    </div>
  );
}
