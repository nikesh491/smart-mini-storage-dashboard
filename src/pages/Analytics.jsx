import React, { useState, useEffect } from 'react';
import { LineChart, Thermometer, Droplets, Fan, DoorOpen, Activity, Calendar } from 'lucide-react';
import { AnalyticsCard } from '../components/analytics/AnalyticsCard.jsx';
import { TemperatureHistory } from '../components/analytics/TemperatureHistory.jsx';
import { HumidityHistory } from '../components/analytics/HumidityHistory.jsx';
import { CoolingHistory } from '../components/analytics/CoolingHistory.jsx';
import { analyticsService } from '../services/analyticsService.js';
import { sensorService } from '../services/sensorService.js';
import { useVegetables } from '../hooks/useVegetables.js';
import { Loading } from '../components/common/Loading.jsx';

export function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('7d');
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const { activeProfile } = useVegetables();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [sum, hist] = await Promise.all([
        analyticsService.getAnalyticsSummary(timeframe),
        sensorService.getHistory(
          timeframe === 'today' ? 12 : timeframe === '7d' ? 24 : 48,
          activeProfile?.minTemperature ?? 0,
          activeProfile?.maxTemperature ?? 5
        )
      ]);
      setSummary(sum);
      setHistory(hist);
      setLoading(false);
    }
    loadData();
  }, [timeframe, activeProfile]);

  if (loading || !summary) {
    return <Loading text="Calculating Historical IoT Analytics..." />;
  }

  const timeframes = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Date Filter Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
            <LineChart className="w-6 h-6 text-teal-400" />
            IoT Environmental Analytics
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Long-term Storage Performance, Peltier Efficiency & Telemetry Trends
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          {timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${timeframe === tf.id ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Avg Temperature"
          value={`${summary.avgTemperature}`}
          unit="°C"
          description="Mean chamber thermal readout"
          icon={Thermometer}
          colorTheme="teal"
        />
        <AnalyticsCard
          title="Avg Humidity"
          value={`${summary.avgHumidity}`}
          unit="%"
          description="Mean relative moisture level"
          icon={Droplets}
          colorTheme="cyan"
        />
        <AnalyticsCard
          title="Cooling Runtime"
          value={`${summary.coolingRuntimeHours}`}
          unit="hrs"
          description={`${summary.coolingEfficiencyPct}% efficiency index`}
          icon={Fan}
          colorTheme="emerald"
        />
        <AnalyticsCard
          title="Door Events"
          value={`${summary.doorOpenEvents}`}
          unit="times"
          description="Total chamber door unseals"
          icon={DoorOpen}
          colorTheme="amber"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureHistory
          data={history}
          targetMin={activeProfile?.minTemperature ?? 0}
          targetMax={activeProfile?.maxTemperature ?? 5}
        />
        <HumidityHistory
          data={history}
          targetMin={activeProfile?.minHumidity ?? 90}
          targetMax={activeProfile?.maxHumidity ?? 95}
        />
      </div>

      {/* Cooling Activity Bar Chart */}
      <CoolingHistory data={history} />
    </div>
  );
}
