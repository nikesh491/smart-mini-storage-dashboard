import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function CoolingHistory({ data }) {
  const chartData = data && data.length > 0 ? data.map(d => ({
    time: d.time,
    duty: d.cooling === 'ON' ? 100 : 0
  })) : [
    { time: '12:00', duty: 100 },
    { time: '13:00', duty: 0 },
    { time: '14:00', duty: 100 },
    { time: '15:00', duty: 100 },
    { time: '16:00', duty: 0 },
    { time: '17:00', duty: 0 },
  ];

  return (
    <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
          Cooling Duty Cycles (% Active)
        </h3>
        <p className="text-xs text-slate-400">Automated Peltier Refrigeration Engagements</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              formatter={(val) => [`${val}% Duty`, 'Cooling Active']}
            />
            <Bar dataKey="duty" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
