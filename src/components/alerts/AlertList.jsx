import React from 'react';
import { AlertCard } from './AlertCard.jsx';

export function AlertList({ alerts = [], onMarkRead }) {
  if (alerts.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 font-mono text-xs">
        No active system alerts recorded.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} onMarkRead={onMarkRead} />
      ))}
    </div>
  );
}
