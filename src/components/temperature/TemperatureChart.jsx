import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';

export function TemperatureChart({ data, targetMin = 0, targetMax = 5, title = "Temperature History" }) {
  const chartData = data && data.length > 0 ? data : [
    { time: '12:00', temperature: 23.5 },
    { time: '13:00', temperature: 24.0 },
    { time: '14:00', temperature: 24.5 },
    { time: '15:00', temperature: 25.1 },
    { time: '16:00', temperature: 24.8 },
    { time: '17:00', temperature: 24.3 },
  ];

  const temps = chartData.map(d => d.temperature);
  const minTemp = Math.min(...temps, targetMin) - 2;
  const maxTemp = Math.max(...temps, targetMax) + 2;

  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            {title}
          </h3>
          <p className="text-xs text-slate-400">Live & Historical Sensor Readings (°C)</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
            <span className="text-slate-300">Temp (°C)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-500/80"></span>
            <span className="text-slate-400">Target Range</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} domain={[Math.floor(minTemp), Math.ceil(maxTemp)]} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              formatter={(val) => [`${val}°C`, 'Temperature']}
            />
            <ReferenceLine y={targetMax} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: `Max: ${targetMax}°C`, fill: '#f43f5e', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={targetMin} stroke="#38bdf8" strokeDasharray="4 4" label={{ value: `Min: ${targetMin}°C`, fill: '#38bdf8', fontSize: 10, position: 'insideBottomRight' }} />
            <Area type="monotone" dataKey="temperature" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#tempGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
