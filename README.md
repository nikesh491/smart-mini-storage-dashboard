# Smart Mini Storage — Real-Time IoT Dashboard

A production-quality, industrial-grade **Smart Mini Storage IoT Dashboard** frontend for monitoring micro-climate environmental conditions (Temperature, Humidity, Peltier Cooling, Chamber Door Status) powered by ESP32 + DHT22 hardware.

## Features & Highlights

- **Real-Time 3D/Glassmorphism Hardware Chamber**: Live interactive representation of the physical storage chamber featuring animated Peltier cooling fan, door status toggle, item badges, and telemetry readouts.
- **Dynamic Vegetable Storage Profiles**: Pre-configured target profiles for **Carrot**, **Tomato**, **Cabbage**, **Leafy Vegetables**, and **Potato**. Selecting a vegetable dynamically updates target temperature and humidity thresholds across all pages.
- **Automated Control Logic & Flowcharts**: Real-time evaluation of live telemetry against crop targets with visual decision flowchart (Sensor → Target Compare → Evaluation → Peltier Control).
- **Interactive Telemetry Graphs**: Recharts line and bar graphs with live tooltips, target min/max range reference lines, and timeframe filtering.
- **Hardware Architecture Topology**: Visual topology flow diagram (DHT22 → ESP32 → Wi-Fi → Backend → Database → Dashboard) with individual hardware health status cards.
- **Database Logs & Search**: Filterable, searchable, paginated log table ready for backend REST/WebSocket integration.
- **Alert & Event Center**: Real-time exception notifications with severity levels (Critical, Warning, Normal, Information) and sidebar badge counter.
- **Modular Service Layer**: Abstracted `api.js`, `sensorService`, `vegetableService`, `analyticsService`, and `useSensorData` hook supporting environment variable `VITE_API_URL`.

## Project Directory Structure

```text
smart-mini-storage-dashboard/
├── public/
│   └── images/
│       ├── logo.png
│       ├── storage-model.png
│       ├── tomato.png
│       ├── carrot.png
│       ├── cabbage.png
│       ├── leafy.png
│       └── potato.png
├── src/
│   ├── components/
│   │   ├── layout/ (Sidebar.jsx, Topbar.jsx, MainLayout.jsx)
│   │   ├── dashboard/ (StorageModel.jsx, SensorCard.jsx, SystemStatus.jsx, QuickStats.jsx)
│   │   ├── temperature/ (TemperatureCard.jsx, TemperatureGauge.jsx, TemperatureChart.jsx, TemperatureStatus.jsx)
│   │   ├── humidity/ (HumidityCard.jsx, HumidityGauge.jsx, HumidityChart.jsx, HumidityStatus.jsx)
│   │   ├── vegetables/ (VegetableCard.jsx, VegetableSelector.jsx, StorageProfile.jsx)
│   │   ├── hardware/ (HardwareCard.jsx, ESP32Status.jsx, DHT22Status.jsx, DoorStatus.jsx, CoolingStatus.jsx)
│   │   ├── analytics/ (AnalyticsCard.jsx, TemperatureHistory.jsx, HumidityHistory.jsx, CoolingHistory.jsx)
│   │   ├── alerts/ (AlertCard.jsx, AlertList.jsx)
│   │   └── common/ (Button.jsx, Badge.jsx, Loading.jsx, StatusIndicator.jsx)
│   ├── pages/ (Dashboard.jsx, Vegetables.jsx, Temperature.jsx, Humidity.jsx, Hardware.jsx, Analytics.jsx, Database.jsx, Alerts.jsx, Settings.jsx)
│   ├── services/ (api.js, sensorService.js, vegetableService.js, analyticsService.js)
│   ├── hooks/ (useSensorData.js, useVegetables.js, useHardwareStatus.js)
│   ├── data/ (vegetableData.js)
│   ├── styles/ (globals.css, dashboard.css)
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env
├── index.html
├── package.json
└── vite.config.js
```

## Running the Application

### Option A: Standard Vite Server (Node / NPM environment)
```bash
npm install
npm run dev
```

### Option B: Standalone Web Browser Execution
Simply open `index.html` directly in any modern web browser! The application is bundled with inline ES module loading and Tailwind CSS CDN for immediate zero-setup rendering.
