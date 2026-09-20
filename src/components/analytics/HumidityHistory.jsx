import React from 'react';
import { HumidityChart } from '../humidity/HumidityChart.jsx';

export function HumidityHistory({ data, targetMin = 90, targetMax = 95 }) {
  return (
    <HumidityChart
      data={data}
      targetMin={targetMin}
      targetMax={targetMax}
      title="Analytics — Moisture & Humidity Profile"
    />
  );
}
