import React from 'react';
import { Server } from 'lucide-react';
import { HardwareCard } from './HardwareCard.jsx';

export function DHT22Status({ dht22 }) {
  const details = [
    { label: 'Sensor Model', value: dht22?.name || 'DHT22 / AM2302' },
    { label: 'Sampling Rate', value: dht22?.samplingRate || '2.0 sec' },
    { label: 'Temp Accuracy', value: dht22?.accuracyTemp || '±0.5°C' },
    { label: 'Hum Accuracy', value: dht22?.accuracyHum || '±2-5% RH' },
  ];

  return (
    <HardwareCard
      title="DHT22 Sensor Module"
      status={dht22?.status || 'ACTIVE'}
      subtitle="Digital Temperature & Humidity"
      details={details}
      icon={Server}
    />
  );
}
