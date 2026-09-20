import React from 'react';
import { TemperatureChart } from '../temperature/TemperatureChart.jsx';

export function TemperatureHistory({ data, targetMin = 0, targetMax = 5 }) {
  return (
    <TemperatureChart
      data={data}
      targetMin={targetMin}
      targetMax={targetMax}
      title="Analytics — Temperature Trend"
    />
  );
}
