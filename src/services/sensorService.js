import { apiClient } from './api.js';
import { defaultSensorState } from '../data/vegetableData.js';

let mockLiveState = { ...defaultSensorState };
let currentSelectedProfileId = 'carrot';

// Historical log generator
export const generateHistoryData = (points = 12, targetMin = 0, targetMax = 5) => {
  const data = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const timeStr = new Date(now.getTime() - i * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const tempNoise = (Math.sin(i * 0.8) * 1.2) + (Math.random() * 0.4 - 0.2);
    const humidityNoise = (Math.cos(i * 0.5) * 3) + (Math.random() * 1.5 - 0.75);
    
    // Calculate realistic temp based on target profile center
    const targetCenter = (targetMin + targetMax) / 2;
    const temp = parseFloat((targetCenter + tempNoise).toFixed(1));
    const humidity = Math.min(99, Math.max(70, Math.round(92 + humidityNoise)));
    const cooling = temp > targetMax ? 'ON' : 'OFF';

    data.push({
      time: timeStr,
      timestamp: new Date(now.getTime() - i * 3600 * 1000).toISOString(),
      temperature: temp,
      humidity: humidity,
      targetMin,
      targetMax,
      cooling: cooling,
      door: i === 3 ? 'OPEN' : 'CLOSED',
    });
  }
  return data;
};

export const sensorService = {
  getCurrentData: async () => {
    const remoteData = await apiClient.get('/current');
    if (remoteData) return remoteData;
    
    // Add micro variations to mock data for live feel
    const jitterTemp = (Math.random() * 0.2 - 0.1);
    const jitterHum = (Math.random() * 0.6 - 0.3);

    mockLiveState = {
      ...mockLiveState,
      temperature: parseFloat(Math.max(-2, Math.min(35, mockLiveState.temperature + jitterTemp)).toFixed(1)),
      humidity: Math.min(99, Math.max(40, Math.round(mockLiveState.humidity + jitterHum))),
      lastUpdated: new Date().toISOString(),
    };

    return mockLiveState;
  },

  setMockState: (partialState) => {
    mockLiveState = {
      ...mockLiveState,
      ...partialState,
      lastUpdated: new Date().toISOString(),
    };
    return mockLiveState;
  },

  getHistory: async (hours = 12, targetMin = 0, targetMax = 5) => {
    const remoteData = await apiClient.get(`/history?hours=${hours}`);
    if (remoteData) return remoteData;
    return generateHistoryData(hours, targetMin, targetMax);
  },

  updateCoolingMode: async (mode) => {
    mockLiveState.cooling = mode;
    return apiClient.post('/hardware/cooling', { mode });
  },

  toggleDoor: async (doorState) => {
    mockLiveState.door = doorState;
    return apiClient.post('/hardware/door', { door: doorState });
  }
};
