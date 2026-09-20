import React, { useState, useEffect } from 'react';
import { Thermometer } from 'lucide-react';
import { TemperatureCard } from '../components/temperature/TemperatureCard.jsx';
import { TemperatureGauge } from '../components/temperature/TemperatureGauge.jsx';
import { TemperatureChart } from '../components/temperature/TemperatureChart.jsx';
import { TemperatureStatus } from '../components/temperature/TemperatureStatus.jsx';
import { useSensorData } from '../hooks/useSensorData.js';
import { useVegetables } from '../hooks/useVegetables.js';
import { sensorService } from '../services/sensorService.js';
import { Loading } from '../components/common/Loading.jsx';

export function TemperaturePage() {
  const { activeProfile } = useVegetables();
  const { sensorData, loading } = useSensorData(4000, activeProfile);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const hist = await sensorService.getHistory(
        12,
        activeProfile?.minTemperature ?? 0,
        activeProfile?.maxTemperature ?? 5
      );
      setHistory(hist);
    }
    fetchHistory();
  }, [activeProfile]);

  if (loading || !sensorData) {
    return <Loading text="Fetching Thermal Telemetry..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
          <Thermometer className="w-6 h-6 text-teal-400" />
          Temperature Module
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Chamber Thermal Micro-Climate Monitoring & Automated Peltier Controls
        </p>
      </div>

      {/* Main Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TemperatureCard
            currentTemp={sensorData.temperature}
            targetMin={activeProfile?.minTemperature ?? 0}
            targetMax={activeProfile?.maxTemperature ?? 5}
            optimalTemp={activeProfile?.optimalTemp ?? 2.5}
          />
        </div>
        <div className="lg:col-span-5">
          <TemperatureGauge
            value={sensorData.temperature}
            targetMin={activeProfile?.minTemperature ?? 0}
            targetMax={activeProfile?.maxTemperature ?? 5}
          />
        </div>
      </div>

      {/* Automated Logic Flowchart & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <TemperatureChart
            data={history}
            targetMin={activeProfile?.minTemperature ?? 0}
            targetMax={activeProfile?.maxTemperature ?? 5}
          />
        </div>
        <div className="lg:col-span-5">
          <TemperatureStatus
            currentTemp={sensorData.temperature}
            targetMin={activeProfile?.minTemperature ?? 0}
            targetMax={activeProfile?.maxTemperature ?? 5}
            isCooling={sensorData.cooling === 'ON'}
          />
        </div>
      </div>
    </div>
  );
}
