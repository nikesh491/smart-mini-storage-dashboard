import React from 'react';

export function Loading({ text = 'Loading Telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 min-h-[180px]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-teal-500/20"></div>
        <div className="absolute inset-0 rounded-full border-2 border-teal-400 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xs text-slate-400 font-mono animate-pulse">{text}</p>
    </div>
  );
}
