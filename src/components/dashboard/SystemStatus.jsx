import React from 'react';
import { Cpu, Wifi, Database, Server, CheckCircle2 } from 'lucide-react';
import { StatusIndicator } from '../common/StatusIndicator.jsx';

export function SystemStatus({ hardware }) {
  const items = [
    { label: 'ESP32 Microcontroller', status: 'CONNECTED', detail: 'IP: 192.168.1.145', icon: Cpu },
    { label: 'DHT22 Temp & Humidity', status: 'ACTIVE', detail: 'Rate: 2.0 sec', icon: Server },
    { label: 'Wi-Fi Network Mesh', status: 'CONNECTED', detail: '-58 dBm RSSI', icon: Wifi },
    { label: 'TimeSeries Database', status: 'CONNECTED', detail: 'PostgreSQL IoT', icon: Database },
  ];

  return (
    <div className="rounded-2xl glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          SYSTEM HARDWARE HEALTH
        </h3>
        <span className="text-xs text-emerald-400 font-mono font-semibold">ALL SYSTEMS NOMINAL</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.detail}</p>
                </div>
              </div>
              <StatusIndicator status={item.status} size="sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
