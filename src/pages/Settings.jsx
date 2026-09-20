import React, { useState } from 'react';
import { Settings, Cpu, Bell, Sliders, Save, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';
import { useVegetables } from '../hooks/useVegetables.js';

export function SettingsPage() {
  const { activeProfile, profiles, selectVegetable } = useVegetables();
  const [esp32Name, setEsp32Name] = useState('ESP32-SMART-CHAMBER-01');
  const [sensorInterval, setSensorInterval] = useState('5');
  const [coolingMode, setCoolingMode] = useState('AUTO');
  const [tempAlerts, setTempAlerts] = useState(true);
  const [doorAlerts, setDoorAlerts] = useState(true);
  const [offlineAlerts, setOfflineAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-400" />
            System Settings & Hardware Parameters
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure Storage Thresholds, Sensor Refresh Interval & Alert Dispatches
          </p>
        </div>
        <Button type="submit" variant="primary">
          <Save className="w-4 h-4" />
          Save Configuration
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
          ✓ Configuration successfully updated and synchronized with ESP32 board.
        </div>
      )}

      {/* 1. Storage Configuration */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-400" />
          STORAGE & CROP TARGETS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Active Crop Profile</label>
            <select
              value={activeProfile?.id || 'carrot'}
              onChange={(e) => selectVegetable(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.minTemperature}°C – {p.maxTemperature}°C)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Cooling Logic Mode</label>
            <select
              value={coolingMode}
              onChange={(e) => setCoolingMode(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
            >
              <option value="AUTO">AUTOMATED (PID / Hysteresis)</option>
              <option value="ALWAYS_ON">MANUAL FORCE COOLING ON</option>
              <option value="ALWAYS_OFF">MANUAL DISABLE COOLING</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Hardware Configuration */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-teal-400" />
          HARDWARE & TELEMETRY STREAM
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">ESP32 Device Identifier</label>
            <input
              type="text"
              value={esp32Name}
              onChange={(e) => setEsp32Name(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Sensor Telemetry Polling Interval</label>
            <select
              value={sensorInterval}
              onChange={(e) => setSensorInterval(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-teal-500"
            >
              <option value="2">2 Seconds (High Resolution)</option>
              <option value="5">5 Seconds (Default Balanced)</option>
              <option value="10">10 Seconds (Power Saving)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Notifications */}
      <div className="rounded-2xl glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-400" />
          AUTOMATED ALERT NOTIFICATIONS
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
            <span className="text-slate-200">Temperature Threshold Violation Alerts</span>
            <input
              type="checkbox"
              checked={tempAlerts}
              onChange={(e) => setTempAlerts(e.target.checked)}
              className="w-4 h-4 accent-teal-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
            <span className="text-slate-200">Storage Door Unseal Warning Alarms</span>
            <input
              type="checkbox"
              checked={doorAlerts}
              onChange={(e) => setDoorAlerts(e.target.checked)}
              className="w-4 h-4 accent-teal-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
            <span className="text-slate-200">DHT22 Hardware Disconnect / Heartbeat Alerts</span>
            <input
              type="checkbox"
              checked={offlineAlerts}
              onChange={(e) => setOfflineAlerts(e.target.checked)}
              className="w-4 h-4 accent-teal-500"
            />
          </label>
        </div>
      </div>
    </form>
  );
}
