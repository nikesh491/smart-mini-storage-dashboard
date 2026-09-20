import React from 'react';
import { Droplets } from 'lucide-react';
import { Badge } from '../common/Badge.jsx';

export function HumidityCard({ currentHumidity = 68, targetMin = 90, targetMax = 95, avgHumidity = 92 }) {
  const isOptimal = currentHumidity >= targetMin && currentHumidity <= targetMax;
  const isLow = currentHumidity < targetMin;

  return (
    <div className="rounded-2xl glass-panel p-6 border border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider">
          RELATIVE HUMIDITY MONITOR
        </span>
        <Badge variant={isOptimal ? 'safe' : isLow ? 'warning' : 'info'}>
          {isOptimal ? 'OPTIMAL MOISTURE' : isLow ? 'HUMIDITY LOW' : 'HIGH HUMIDITY'}
        </Badge>
      </div>

      <div className="my-6 flex items-baseline gap-3">
        <span className="text-5xl font-extrabold font-mono text-white tracking-tight">
          {currentHumidity}%
        </span>
        <span className="text-sm font-medium text-slate-400">
          Target: <span className="text-cyan-300 font-mono font-bold">{targetMin}% — {targetMax}% RH</span>
        </span>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
        <span>Historical Average: <strong className="text-white">{avgHumidity}% RH</strong></span>
        <span>Sensor: <strong className="text-emerald-400">DHT22 Digital</strong></span>
      </div>
    </div>
  );
}
