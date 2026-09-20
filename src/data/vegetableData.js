export const vegetableProfiles = [
  {
    id: 'carrot',
    name: 'Carrot',
    category: 'Root Vegetable',
    minTemperature: 0.0,
    maxTemperature: 5.0,
    optimalTemp: 2.5,
    minHumidity: 90,
    maxHumidity: 95,
    optimalHumidity: 93,
    storageLife: '4-6 Months',
    image: '/images/carrot.png',
    color: 'orange',
    accentColor: '#f97316',
    description: 'Requires cold, high-humidity storage to retain crispiness and prevent moisture loss.',
    tips: 'Keep air circulation consistent. Avoid storing near ethylene-producing fruits like apples.'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    category: 'Nightshade Fruit',
    minTemperature: 10.0,
    maxTemperature: 15.0,
    optimalTemp: 12.5,
    minHumidity: 85,
    maxHumidity: 90,
    optimalHumidity: 88,
    storageLife: '1-2 Weeks',
    image: '/images/tomato.png',
    color: 'red',
    accentColor: '#ef4444',
    description: 'Chilling sensitive. Stored above 10°C to preserve natural sugars, aroma, and flavor compounds.',
    tips: 'Do not store below 10°C to prevent chilling injury and mealy texture.'
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    category: 'Brassica',
    minTemperature: 0.0,
    maxTemperature: 4.0,
    optimalTemp: 1.5,
    minHumidity: 90,
    maxHumidity: 98,
    optimalHumidity: 95,
    storageLife: '3-5 Months',
    image: '/images/cabbage.png',
    color: 'emerald',
    accentColor: '#10b981',
    description: 'Thrives in near-freezing conditions with dense humidity to keep outer leaves crisp.',
    tips: 'Ensure high ventilation to prevent condensation buildup between leaf layers.'
  },
  {
    id: 'leafy',
    name: 'Leafy Vegetables',
    category: 'Greens (Spinach/Lettuce)',
    minTemperature: 0.5,
    maxTemperature: 3.5,
    optimalTemp: 2.0,
    minHumidity: 95,
    maxHumidity: 100,
    optimalHumidity: 98,
    storageLife: '1-3 Weeks',
    image: '/images/leafy.png',
    color: 'teal',
    accentColor: '#14b8a6',
    description: 'Extremely sensitive to water loss. Requires ultra-high relative humidity and precise low temperature.',
    tips: 'Mist lightly if humidity drops below 92%. Avoid direct freezing contact.'
  },
  {
    id: 'potato',
    name: 'Potato',
    category: 'Tuber',
    minTemperature: 7.0,
    maxTemperature: 10.0,
    optimalTemp: 8.5,
    minHumidity: 85,
    maxHumidity: 90,
    optimalHumidity: 88,
    storageLife: '4-8 Months',
    image: '/images/potato.png',
    color: 'amber',
    accentColor: '#f59e0b',
    description: 'Requires cool, dark environment. Storing below 6°C converts starch to sugars (sweetening).',
    tips: 'Keep door sealed to block ambient light exposure and prevent sprouting/greening.'
  }
];

export const defaultSensorState = {
  temperature: 4.2,
  humidity: 92,
  door: 'CLOSED', // 'CLOSED' | 'OPEN'
  cooling: 'OFF',  // 'ON' | 'OFF'
  fanSpeed: 0,    // 0 - 100%
  status: 'SAFE',  // 'SAFE' | 'WARNING' | 'CRITICAL'
  esp32Status: 'ONLINE',
  dht22Status: 'ACTIVE',
  wifiSignal: -58, // dBm
  lastUpdated: new Date().toISOString(),
};
