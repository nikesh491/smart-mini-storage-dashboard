import { useState, useEffect } from 'react';

export function useHardwareStatus() {
  const [hardware, setHardware] = useState({
    esp32: { name: 'ESP32-WROOM-32U', status: 'CONNECTED', ip: '192.168.1.145', uptime: '14d 06h 22m', rssi: -58, heapFree: '184 KB' },
    dht22: { name: 'DHT22 / AM2302 Sensor', status: 'ACTIVE', samplingRate: '2.0 sec', accuracyTemp: '±0.5°C', accuracyHum: '±2-5% RH' },
    doorSensor: { name: 'Magnetic Switch', status: 'CLOSED', debounceMs: 50 },
    coolingSystem: { name: '12V Peltier + PWM Fan', status: 'READY', pwrConsumption: '45W', rpm: 2800 },
    wifi: { name: 'IoT Mesh 2.4GHz', status: 'CONNECTED', channel: 6, bandwidth: '72 Mbps' },
    backend: { name: 'Node/Express API', status: 'CONNECTED', latencyMs: 24 },
    database: { name: 'TimeSeries DB Storage', status: 'CONNECTED', totalRecords: 142850 }
  });

  return { hardware, setHardware };
}
