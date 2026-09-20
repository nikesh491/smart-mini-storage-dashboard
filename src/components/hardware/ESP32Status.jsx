import React from 'react';
import { Cpu } from 'lucide-react';
import { HardwareCard } from './HardwareCard.jsx';

export function ESP32Status({ esp32 }) {
  const details = [
    { label: 'Chipset', value: esp32?.name || 'ESP32-WROOM-32U' },
    { label: 'IP Address', value: esp32?.ip || '192.168.1.145' },
    { label: 'Uptime', value: esp32?.uptime || '14d 06h 22m' },
    { label: 'Free SRAM', value: esp32?.heapFree || '184 KB' },
  ];

  return (
    <HardwareCard
      title="ESP32 Microcontroller"
      status={esp32?.status || 'CONNECTED'}
      subtitle="Main IoT Processing Node"
      details={details}
      icon={Cpu}
    />
  );
}
