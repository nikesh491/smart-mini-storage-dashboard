import React from 'react';
import { Cpu, Server, DoorClosed, Fan, Wifi, Database, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ESP32Status } from '../components/hardware/ESP32Status.jsx';
import { DHT22Status } from '../components/hardware/DHT22Status.jsx';
import { DoorStatus } from '../components/hardware/DoorStatus.jsx';
import { CoolingStatus } from '../components/hardware/CoolingStatus.jsx';
import { HardwareCard } from '../components/hardware/HardwareCard.jsx';
import { useHardwareStatus } from '../hooks/useHardwareStatus.js';

export function HardwarePage() {
  const { hardware } = useHardwareStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
          <Cpu className="w-6 h-6 text-teal-400" />
          Hardware Architecture & Component Telemetry
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Physical Hardware Nodes, Sensor Interfaces & Telemetry Stream Topology
        </p>
      </div>

      {/* Visual Hardware Architecture Topology Flow Diagram */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          IOT HARDWARE TELEMETRY TOPOLOGY
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-teal-500/30">
            <Server className="w-4 h-4 text-teal-400" />
            <span>DHT22 Sensor</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>ESP32 MCU</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-blue-500/30">
            <Wifi className="w-4 h-4 text-blue-400" />
            <span>Wi-Fi Network</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-purple-500/30">
            <Server className="w-4 h-4 text-purple-400" />
            <span>Backend Server</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Database Log</span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold">
            <span>Dashboard UI</span>
          </div>
        </div>
      </div>

      {/* Component Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ESP32Status esp32={hardware.esp32} />
        <DHT22Status dht22={hardware.dht22} />
        <DoorStatus doorSensor={hardware.doorSensor} />
        <CoolingStatus coolingSystem={hardware.coolingSystem} />

        <HardwareCard
          title="Wi-Fi Communications"
          status={hardware.wifi.status}
          subtitle="2.4GHz IEEE 802.11b/g/n"
          details={[
            { label: 'SSID', value: hardware.wifi.name },
            { label: 'Signal Strength', value: '-58 dBm (Strong)' },
            { label: 'Channel', value: `Ch ${hardware.wifi.channel}` },
            { label: 'Bandwidth', value: hardware.wifi.bandwidth }
          ]}
          icon={Wifi}
        />

        <HardwareCard
          title="Database Backend"
          status={hardware.database.status}
          subtitle="TimeSeries Node Engine"
          details={[
            { label: 'Database', value: 'PostgreSQL IoT' },
            { label: 'API Latency', value: `${hardware.backend.latencyMs} ms` },
            { label: 'Logs Saved', value: '142,850 Records' },
            { label: 'Sync State', value: 'Live Replicated' }
          ]}
          icon={Database}
        />
      </div>
    </div>
  );
}
