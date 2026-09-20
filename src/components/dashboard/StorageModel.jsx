import React from 'react';
import { Fan, Shield, ShieldAlert, Sparkles, Thermometer, Droplets, DoorClosed, DoorOpen, Power } from 'lucide-react';
import { StatusIndicator } from '../common/StatusIndicator.jsx';

export function StorageModel({ 
  sensorData, 
  activeVegetable, 
  onToggleDoor, 
  onToggleCooling 
}) {
  const isCoolingOn = sensorData?.cooling === 'ON';
  const isDoorOpen = sensorData?.door === 'OPEN';
  const isSafe = sensorData?.status === 'SAFE';

  return (
    <div className="relative rounded-3xl glass-panel p-6 overflow-hidden border border-slate-700/50 shadow-2xl">
      {/* Background Neon Glow & Mist Effect */}
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full ${isCoolingOn ? 'bg-cyan-500/10' : 'bg-teal-500/5'} blur-3xl pointer-events-none`}></div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg font-bold text-white tracking-wide uppercase font-mono">
              LIVE STORAGE CHAMBER
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical Mini Storage Unit Telemetry & Active Climate Simulation
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Target Profile:</span>
            <span className="text-xs font-bold text-teal-300 font-mono flex items-center gap-1">
              {activeVegetable?.name || 'Carrot'}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono ${isSafe ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
            {isSafe ? <Shield className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4 animate-bounce" />}
            <span>{isSafe ? 'OPTIMAL ENVIRONMENT' : 'ATTENTION REQUIRED'}</span>
          </div>
        </div>
      </div>

      {/* Chamber Visual Hardware Renderer */}
      <div className="mt-6 relative bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-[#070b12] rounded-2xl border-2 border-slate-800 p-6 md:p-8 overflow-hidden shadow-inner">
        {/* Cold Air Mist Visual when cooling is ON */}
        {isCoolingOn && (
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-teal-500/5 to-transparent pointer-events-none animate-mist"></div>
        )}

        {/* Top Hardware Banner: ESP32 + Cooling Fan */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-teal-400 animate-ping"></div>
            <span className="text-xs font-mono text-slate-300 uppercase tracking-widest font-semibold">
              SMART STORAGE CHAMBER NODE #01
            </span>
          </div>

          {/* Interactive Cooling Fan Assembly */}
          <div className="flex items-center gap-3 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
            <Fan className={`w-5 h-5 ${isCoolingOn ? 'text-cyan-400 animate-fan-fast' : 'text-slate-600'}`} />
            <div className="text-left">
              <p className="text-[10px] text-slate-400 uppercase font-mono">Peltier Cooler</p>
              <p className={`text-xs font-bold font-mono ${isCoolingOn ? 'text-cyan-400' : 'text-slate-500'}`}>
                {isCoolingOn ? 'ACTIVE (COOLING)' : 'STANDBY (OFF)'}
              </p>
            </div>
            {onToggleCooling && (
              <button
                onClick={onToggleCooling}
                className={`ml-2 p-1.5 rounded-lg border text-xs transition-all ${isCoolingOn ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                title="Manual Peltier Override"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Inner Chamber Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center relative z-10">
          
          {/* Chamber Left: 3D Hardware Model Preview & Item Display */}
          <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 relative group">
            
            {/* Storage Door Seal Frame */}
            <div className={`w-full relative rounded-xl border-2 transition-colors p-4 flex flex-col items-center justify-center gap-4 ${isDoorOpen ? 'border-amber-500/50 bg-amber-500/5' : 'border-teal-500/30 bg-slate-950/80'}`}>
              
              {/* Hardware Chamber Image / Vegetable Tray */}
              <div className="relative w-48 h-36 flex items-center justify-center">
                <img 
                  src={activeVegetable?.image || '/images/carrot.png'} 
                  alt={activeVegetable?.name || 'Vegetables'}
                  className="max-h-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = '/images/carrot.png';
                  }}
                />
              </div>

              {/* Items Tray Label */}
              <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                <span className="text-xl">🥕 🥦 🍅 🥬</span>
                <span className="text-xs font-semibold text-slate-300">{activeVegetable?.name || 'Carrot'} Batch</span>
              </div>

              {/* Interactive Door Control Button */}
              {onToggleDoor && (
                <button
                  onClick={onToggleDoor}
                  className={`mt-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${isDoorOpen ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-teal-500'}`}
                >
                  {isDoorOpen ? <DoorOpen className="w-4 h-4 text-amber-400" /> : <DoorClosed className="w-4 h-4 text-teal-400" />}
                  <span>DOOR: {sensorData?.door || 'CLOSED'} (Click to Toggle)</span>
                </button>
              )}
            </div>
          </div>

          {/* Chamber Right: Live Sensor Telemetry Parameters */}
          <div className="md:col-span-6 space-y-4">
            
            {/* Live Temperature Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Inside Temperature</p>
                  <p className="text-2xl font-extrabold font-mono text-white">
                    {sensorData?.temperature ?? 24.5}°C
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-mono">Target Range</p>
                <p className="text-xs font-mono font-bold text-teal-300">
                  {activeVegetable?.minTemperature ?? 0}°C — {activeVegetable?.maxTemperature ?? 5}°C
                </p>
              </div>
            </div>

            {/* Live Humidity Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Inside Humidity</p>
                  <p className="text-2xl font-extrabold font-mono text-white">
                    {sensorData?.humidity ?? 68}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-mono">Target Range</p>
                <p className="text-xs font-mono font-bold text-cyan-300">
                  {activeVegetable?.minHumidity ?? 90}% — {activeVegetable?.maxHumidity ?? 95}%
                </p>
              </div>
            </div>

            {/* Status Summary Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIndicator status={isSafe ? 'SAFE' : 'WARNING'} />
                <span className="text-xs font-semibold text-slate-300">Micro-Climate Control</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                {isCoolingOn ? '❄ COOLING ENGAGED' : '● REGULATION STABLE'}
              </span>
            </div>

          </div>
        </div>

        {/* Footer Hardware Strip */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2 relative z-10">
          <div>DHT22 Sensor: <span className="text-emerald-400">● ONLINE</span></div>
          <div>ESP32 Telemetry: <span className="text-teal-300">100% Signal (-58 dBm)</span></div>
          <div>Chamber Seal: <span className={isDoorOpen ? 'text-amber-400 font-bold' : 'text-slate-300'}>{sensorData?.door || 'CLOSED'}</span></div>
        </div>
      </div>
    </div>
  );
}
