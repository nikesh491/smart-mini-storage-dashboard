import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { analyticsService } from '../services/analyticsService.js';
import { Loading } from '../components/common/Loading.jsx';

export function DatabasePage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVegetable, setSelectedVegetable] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const data = await analyticsService.getDatabaseLogs();
      setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  if (loading) {
    return <Loading text="Querying TimeSeries Sensor Database..." />;
  }

  // Filtering Logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.vegetable.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.temperature.includes(searchTerm);
    const matchesVeg = selectedVegetable === 'ALL' || log.vegetable === selectedVegetable;
    const matchesStatus = selectedStatus === 'ALL' || log.status === selectedStatus;
    return matchesSearch && matchesVeg && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const currentLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusVariant = {
    SAFE: 'safe',
    WARNING: 'warning',
    CRITICAL: 'critical',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
            <Database className="w-6 h-6 text-teal-400" />
            Sensor Telemetry Database Logs
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Historical IoT Telemetry Storage & Analytical Records (Ready for API integration)
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => alert('Exported 50 sensor logs as CSV.')}>
          <Download className="w-4 h-4" />
          Export CSV Log
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by crop, ID, or value..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Vegetable:</span>
            <select
              value={selectedVegetable}
              onChange={(e) => { setSelectedVegetable(e.target.value); setCurrentPage(1); }}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Crops</option>
              <option value="Carrot">Carrot</option>
              <option value="Tomato">Tomato</option>
              <option value="Cabbage">Cabbage</option>
              <option value="Leafy Vegetables">Leafy Vegetables</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SAFE">SAFE</option>
              <option value="WARNING">WARNING</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="p-4">Time</th>
                <th className="p-4">Vegetable</th>
                <th className="p-4">Temperature</th>
                <th className="p-4">Humidity</th>
                <th className="p-4">Door State</th>
                <th className="p-4">Cooling Unit</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
              {currentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-white">{log.time}</td>
                  <td className="p-4 text-teal-300">{log.vegetable}</td>
                  <td className="p-4 font-bold text-slate-100">{log.temperature}</td>
                  <td className="p-4 text-cyan-300">{log.humidity}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${log.door === 'OPEN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {log.door}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${log.cooling === 'ON' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'bg-slate-800 text-slate-500'}`}>
                      {log.cooling}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Badge variant={statusVariant[log.status] || 'default'}>
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>
            Showing {Math.min(filteredLogs.length, (currentPage - 1) * itemsPerPage + 1)}–{Math.min(filteredLogs.length, currentPage * itemsPerPage)} of {filteredLogs.length} entries
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
