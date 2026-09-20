import React from 'react';
import { DoorClosed } from 'lucide-react';
import { HardwareCard } from './HardwareCard.jsx';

export function DoorStatus({ doorSensor }) {
  const details = [
    { label: 'Sensor Type', value: doorSensor?.name || 'Magnetic Reed Switch' },
    { label: 'Chamber Seal', value: doorSensor?.status || 'CLOSED' },
    { label: 'Debounce Delay', value: `${doorSensor?.debounceMs || 50} ms` },
    { label: 'State Log', value: 'Security Locked' },
  ];

  return (
    <HardwareCard
      title="Door Seal Sensor"
      status={doorSensor?.status === 'OPEN' ? 'WARNING' : 'CLOSED'}
      subtitle="Chamber Access Telemetry"
      details={details}
      icon={DoorClosed}
    />
  );
}
