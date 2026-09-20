import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export function HumidityChart({ data, targetMin = 90, targetMax = 95, title = "Humidity History" }) {
  const chartData = data && data.length > 0 ? data : [
    { time: '12:00', humidity: 91 },
    { time: '13:00', humidity: 93 },
    { time: '14:00', humidity: 92 },
    { time: '15:00', humidity: 90 },
    { time: '16:00', humidity: 94 },
    { time: '17:00', humidity: 93 },
  ];

  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            {title}
          </h3>
          <p className="text-xs text-slate-400">Relative Humidity Telemetry (% RH)</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="text-slate-300">Humidity (% RH)</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} domain={[40, 100]} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              formatter={(val) => [`${val}% RH`, 'Humidity']}
            />
            <ReferenceLine y={targetMax} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: `Max: ${targetMax}%`, fill: '#38bdf8', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={targetMin} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: `Min: ${targetMin}%`, fill: '#38bdf8', fontSize: 10, position: 'insideBottomRight' }} />
            <Area type="monotone" dataKey="humidity" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#humGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
