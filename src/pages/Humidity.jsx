import React, { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';
import { HumidityCard } from '../components/humidity/HumidityCard.jsx';
import { HumidityGauge } from '../components/humidity/HumidityGauge.jsx';
import { HumidityChart } from '../components/humidity/HumidityChart.jsx';
import { HumidityStatus } from '../components/humidity/HumidityStatus.jsx';
import { useSensorData } from '../hooks/useSensorData.js';
import { useVegetables } from '../hooks/useVegetables.js';
import { sensorService } from '../services/sensorService.js';
import { Loading } from '../components/common/Loading.jsx';

export function HumidityPage() {
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
    return <Loading text="Fetching Humidity Telemetry..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
          <Droplets className="w-6 h-6 text-cyan-400" />
          Humidity Module
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Relative Moisture Telemetry & Transpirational Preservation Control
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <HumidityCard
            currentHumidity={sensorData.humidity}
            targetMin={activeProfile?.minHumidity ?? 90}
            targetMax={activeProfile?.maxHumidity ?? 95}
          />
        </div>
        <div className="lg:col-span-5">
          <HumidityGauge
            value={sensorData.humidity}
            targetMin={activeProfile?.minHumidity ?? 90}
            targetMax={activeProfile?.maxHumidity ?? 95}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <HumidityChart
            data={history}
            targetMin={activeProfile?.minHumidity ?? 90}
            targetMax={activeProfile?.maxHumidity ?? 95}
          />
        </div>
        <div className="lg:col-span-5">
          <HumidityStatus
            currentHumidity={sensorData.humidity}
            targetMin={activeProfile?.minHumidity ?? 90}
            targetMax={activeProfile?.maxHumidity ?? 95}
          />
        </div>
      </div>
    </div>
  );
}
