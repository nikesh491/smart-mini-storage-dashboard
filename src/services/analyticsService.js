import { apiClient } from './api.js';

export const analyticsService = {
  getAnalyticsSummary: async (timeframe = '7d') => {
    const remoteData = await apiClient.get(`/analytics?timeframe=${timeframe}`);
    if (remoteData) return remoteData;

    return {
      timeframe,
      avgTemperature: 3.8,
      avgHumidity: 93.4,
      coolingRuntimeHours: 142.5,
      coolingEfficiencyPct: 94.2,
      totalAlerts: 4,
      doorOpenEvents: 18,
      totalReadings: 20160,
      systemUptimePct: 99.8,
      temperatureStabilityIdx: '98.5%',
    };
  },

  getDatabaseLogs: async (filters = {}) => {
    const remoteData = await apiClient.get('/database/logs');
    if (remoteData) return remoteData;

    // Generate 50 realistic log entries
    const vegetables = ['Carrot', 'Tomato', 'Cabbage', 'Leafy Vegetables', 'Potato'];
    const logs = [];
    const now = new Date();

    for (let i = 0; i < 60; i++) {
      const logTime = new Date(now.getTime() - i * 15 * 60 * 1000);
      const veg = vegetables[i % vegetables.length];
      const isDoorOpen = i === 12 || i === 41;
      const isHighTemp = i === 5 || i === 28;
      
      let temp = 3.5 + (Math.random() * 2 - 1);
      let cooling = 'OFF';
      let status = 'SAFE';

      if (veg === 'Tomato') temp += 8;
      if (veg === 'Potato') temp += 4;

      if (isHighTemp) {
        temp += 4.5;
        cooling = 'ON';
        status = 'WARNING';
      }

      logs.push({
        id: `LOG-${1000 + i}`,
        time: logTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        date: logTime.toISOString().split('T')[0],
        timestamp: logTime.toISOString(),
        vegetable: veg,
        temperature: `${temp.toFixed(1)}°C`,
        tempValue: parseFloat(temp.toFixed(1)),
        humidity: `${Math.floor(88 + Math.random() * 8)}%`,
        door: isDoorOpen ? 'OPEN' : 'CLOSED',
        cooling: cooling,
        status: isDoorOpen ? 'WARNING' : status,
      });
    }

    return logs;
  },

  getAlerts: async () => {
    const remoteData = await apiClient.get('/alerts');
    if (remoteData) return remoteData;

    return [
      {
        id: 'ALT-001',
        type: 'Temperature High',
        severity: 'Critical',
        title: 'Temperature Exceeded Storage Target',
        message: 'Current temperature reached 7.2°C (Target: 0–5°C). Automated Peltier cooling unit activated.',
        timestamp: '10 minutes ago',
        status: 'Active',
        read: false,
        icon: 'Thermometer'
      },
      {
        id: 'ALT-002',
        type: 'Door Open',
        severity: 'Warning',
        title: 'Chamber Door Sensor Unsealed',
        message: 'Storage chamber door remained open for > 45 seconds. Ambient air leak detected.',
        timestamp: '1 hour ago',
        status: 'Resolved',
        read: true,
        icon: 'DoorOpen'
      },
      {
        id: 'ALT-003',
        type: 'Temperature Normal',
        severity: 'Information',
        title: 'Target Thermal Equilibrium Reached',
        message: 'Chamber temperature stabilized at 3.2°C following active cooling cycle.',
        timestamp: '3 hours ago',
        status: 'Info',
        read: true,
        icon: 'CheckCircle2'
      },
      {
        id: 'ALT-004',
        type: 'Sensor Offline',
        severity: 'Warning',
        title: 'DHT22 Telemetry Jitter',
        message: 'DHT22 pin read delay exceeded 200ms. Re-synchronized ESP32 GPIO bus.',
        timestamp: 'Yesterday',
        status: 'Resolved',
        read: true,
        icon: 'WifiOff'
      }
    ];
  }
};
