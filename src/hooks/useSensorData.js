import { useState, useEffect, useCallback } from 'react';
import { sensorService } from '../services/sensorService.js';

export function useSensorData(intervalMs = 5000, targetProfile = null) {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdatedSec, setLastUpdatedSec] = useState(0);

  const fetchSensorData = useCallback(async () => {
    try {
      const data = await sensorService.getCurrentData();
      
      // Calculate dynamic cooling & safety status if targetProfile is provided
      if (targetProfile && data) {
        const isTempHigh = data.temperature > targetProfile.maxTemperature;
        const isTempLow = data.temperature < targetProfile.minTemperature;
        const isHumLow = data.humidity < targetProfile.minHumidity;
        
        let calculatedCooling = data.cooling;
        let calculatedStatus = 'SAFE';

        if (isTempHigh) {
          calculatedCooling = 'ON';
          calculatedStatus = 'WARNING';
        } else if (data.temperature <= targetProfile.optimalTemp + 0.5) {
          calculatedCooling = 'OFF';
        }

        if (data.door === 'OPEN') {
          calculatedStatus = 'WARNING';
        }

        if (data.temperature > targetProfile.maxTemperature + 3 || data.humidity < targetProfile.minHumidity - 10) {
          calculatedStatus = 'CRITICAL';
        }

        data.cooling = calculatedCooling;
        data.status = calculatedStatus;
      }

      setSensorData(data);
      setLastUpdatedSec(0);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch sensor telemetry');
      setLoading(false);
    }
  }, [targetProfile]);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, intervalMs);
    const secTimer = setInterval(() => setLastUpdatedSec(prev => prev + 1), 1000);

    return () => {
      clearInterval(interval);
      clearInterval(secTimer);
    };
  }, [fetchSensorData, intervalMs]);

  const updateSimulatedState = (partialState) => {
    const updated = sensorService.setMockState(partialState);
    setSensorData({ ...updated });
  };

  return {
    sensorData,
    loading,
    error,
    lastUpdatedSec,
    refetch: fetchSensorData,
    updateSimulatedState,
  };
}
