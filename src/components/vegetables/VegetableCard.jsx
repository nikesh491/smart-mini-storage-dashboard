import React from 'react';
import { Thermometer, Droplets, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';

export function VegetableCard({ profile, isActive, onSelect }) {
  const { id, name, category, minTemperature, maxTemperature, minHumidity, maxHumidity, image, description } = profile;

  return (
    <div className={`
      relative rounded-2xl glass-panel p-6 border transition-all duration-300 flex flex-col justify-between group overflow-hidden
      ${isActive 
        ? 'border-teal-500 bg-gradient-to-b from-teal-500/10 via-slate-900/80 to-slate-950 glow-teal' 
        : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'}
    `}>
      {/* Background Accent Pill */}
      {isActive && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-mono font-bold text-teal-400 bg-teal-500/15 px-2.5 py-1 rounded-full border border-teal-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ACTIVE PROFILE</span>
        </div>
      )}

      <div>
        {/* Vegetable Image Header */}
        <div className="w-full h-36 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-3 mb-4 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="max-h-28 object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
            onError={(e) => {
              e.target.src = '/images/carrot.png';
            }}
          />
        </div>

        {/* Title & Category */}
        <div className="mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            {category}
          </span>
          <h3 className="text-xl font-bold text-white font-sans uppercase tracking-tight">
            {name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{description}</p>
        </div>

        {/* Environmental Targets */}
        <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-teal-400" />
              <span>Temperature</span>
            </div>
            <p className="font-bold text-teal-300 text-sm">{minTemperature}°C — {maxTemperature}°C</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Humidity</span>
            </div>
            <p className="font-bold text-cyan-300 text-sm">{minHumidity}% — {maxHumidity}%</p>
          </div>
        </div>
      </div>

      {/* Select Action */}
      <Button
        variant={isActive ? 'primary' : 'outline'}
        onClick={() => onSelect(id)}
        className="w-full uppercase font-mono tracking-wider"
      >
        {isActive ? 'SELECTED PROFILE' : 'SELECT VEGETABLE'}
      </Button>
    </div>
  );
}
