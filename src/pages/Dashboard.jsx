import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Fan, DoorClosed, DoorOpen, Activity } from 'lucide-react';
import { SensorCard } from '../components/dashboard/SensorCard.jsx';
import { StorageModel } from '../components/dashboard/StorageModel.jsx';
import { SystemStatus } from '../components/dashboard/SystemStatus.jsx';
import { QuickStats } from '../components/dashboard/QuickStats.jsx';
import { TemperatureChart } from '../components/temperature/TemperatureChart.jsx';
import { HumidityChart } from '../components/humidity/HumidityChart.jsx';
import { useSensorData } from '../hooks/useSensorData.js';
import { useVegetables } from '../hooks/useVegetables.js';
import { useHardwareStatus } from '../hooks/useHardwareStatus.js';
import { sensorService } from '../services/sensorService.js';
import { Loading } from '../components/common/Loading.jsx';

export function DashboardPage() {
  const { activeProfile } = useVegetables();
  const { sensorData, loading, updateSimulatedState } = useSensorData(4000, activeProfile);
  const { hardware } = useHardwareStatus();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      const hist = await sensorService.getHistory(
        12, 
        activeProfile?.minTemperature ?? 0, 
        activeProfile?.maxTemperature ?? 5
      );
      setHistoryData(hist);
    }
    loadHistory();
  }, [activeProfile]);

  if (loading || !sensorData) {
    return <Loading text="Initializing Real-Time IoT Telemetry Stream..." />;
  }

  const handleToggleDoor = () => {
    const nextDoor = sensorData.door === 'OPEN' ? 'CLOSED' : 'OPEN';
    updateSimulatedState({ door: nextDoor });
  };

  const handleToggleCooling = () => {
    const nextCooling = sensorData.cooling === 'ON' ? 'OFF' : 'ON';
    updateSimulatedState({ cooling: nextCooling });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight uppercase font-sans">
          SMART MINI STORAGE
        </h1>
        <p className="text-xs lg:text-sm text-teal-400 font-mono font-medium mt-1">
          Real-Time Environmental Monitoring & Automated Storage Control
        </p>
      </div>

      {/* 4 Primary Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SensorCard
          title="Temperature"
          value={`${sensorData.temperature}`}
          unit="°C"
          subtitle="Current Temperature"
          status={sensorData.temperature > (activeProfile?.maxTemperature ?? 5) ? 'HIGH' : 'NORMAL'}
          statusVariant={sensorData.temperature > (activeProfile?.maxTemperature ?? 5) ? 'critical' : 'safe'}
          icon={Thermometer}
          colorTheme="teal"
          glow={sensorData.temperature > (activeProfile?.maxTemperature ?? 5)}
        />

        <SensorCard
          title="Humidity"
          value={`${sensorData.humidity}`}
          unit="%"
          subtitle="Current Humidity"
          status={sensorData.humidity < (activeProfile?.minHumidity ?? 90) ? 'LOW' : 'NORMAL'}
          statusVariant={sensorData.humidity < (activeProfile?.minHumidity ?? 90) ? 'warning' : 'active'}
          icon={Droplets}
          colorTheme="cyan"
        />

        <SensorCard
          title="Cooling"
          value={sensorData.cooling}
          subtitle="Cooling System"
          status={sensorData.cooling === 'ON' ? 'ACTIVE' : 'IDLE'}
          statusVariant={sensorData.cooling === 'ON' ? 'active' : 'default'}
          icon={Fan}
          colorTheme="emerald"
        />

        <SensorCard
          title="Door"
          value={sensorData.door}
          subtitle="Storage Door"
          status={sensorData.door === 'CLOSED' ? 'SECURE' : 'UNSEALED'}
          statusVariant={sensorData.door === 'CLOSED' ? 'safe' : 'warning'}
          icon={sensorData.door === 'CLOSED' ? DoorClosed : DoorOpen}
          colorTheme={sensorData.door === 'CLOSED' ? 'teal' : 'amber'}
        />
      </div>

      {/* Quick Stats Bar */}
      <QuickStats activeVegetable={activeProfile} sensorData={sensorData} />

      {/* Live Physical Storage Chamber Visual Renderer */}
      <StorageModel
        sensorData={sensorData}
        activeVegetable={activeProfile}
        onToggleDoor={handleToggleDoor}
        onToggleCooling={handleToggleCooling}
      />

      {/* Dual Telemetry Line Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureChart
          data={historyData}
          targetMin={activeProfile?.minTemperature ?? 0}
          targetMax={activeProfile?.maxTemperature ?? 5}
        />
        <HumidityChart
          data={historyData}
          targetMin={activeProfile?.minHumidity ?? 90}
          targetMax={activeProfile?.maxHumidity ?? 95}
        />
      </div>

      {/* Hardware System Health */}
      <SystemStatus hardware={hardware} />
    </div>
  );
}
