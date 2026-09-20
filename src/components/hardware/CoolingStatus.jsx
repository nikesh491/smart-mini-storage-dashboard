import React from 'react';
import { Fan } from 'lucide-react';
import { HardwareCard } from './HardwareCard.jsx';

export function CoolingStatus({ coolingSystem }) {
  const details = [
    { label: 'Cooling Element', value: coolingSystem?.name || '12V Peltier TEC1-1206' },
    { label: 'System State', value: coolingSystem?.status || 'READY' },
    { label: 'Power Consumption', value: coolingSystem?.pwrConsumption || '45W' },
    { label: 'Exhaust Fan Speed', value: `${coolingSystem?.rpm || 2800} RPM` },
  ];

  return (
    <HardwareCard
      title="Cooling & Fan Module"
      status={coolingSystem?.status === 'ACTIVE' ? 'ACTIVE' : 'CONNECTED'}
      subtitle="Thermoelectric Refrigeration"
      details={details}
      icon={Fan}
    />
  );
}
