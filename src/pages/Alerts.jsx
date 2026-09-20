import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, ShieldAlert } from 'lucide-react';
import { AlertList } from '../components/alerts/AlertList.jsx';
import { Button } from '../components/common/Button.jsx';
import { analyticsService } from '../services/analyticsService.js';
import { Loading } from '../components/common/Loading.jsx';

export function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      setLoading(true);
      const data = await analyticsService.getAlerts();
      setAlerts(data);
      setLoading(false);
    }
    fetchAlerts();
  }, []);

  if (loading) {
    return <Loading text="Loading Alert Center Log..." />;
  }

  const handleMarkRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true, status: 'Acknowledged' } : a));
  };

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true, status: 'Acknowledged' })));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-400" />
            Alert & Event Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated Exception Dispatch, Thermal Threshold Overflows & Hardware Diagnostics
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 text-teal-400" />
            Acknowledge All ({unreadCount})
          </Button>
        )}
      </div>

      {/* Alert Summary Banner */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">AUTOMATED SYSTEM AUDIT</h3>
            <p className="text-xs text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unacknowledged system notifications require attention.` : 'All active notifications have been acknowledged.'}
            </p>
          </div>
        </div>
      </div>

      {/* Alert List Component */}
      <AlertList alerts={alerts} onMarkRead={handleMarkRead} />
    </div>
  );
}
