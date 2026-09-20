import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout.jsx';
import { DashboardPage } from './pages/Dashboard.jsx';
import { VegetablesPage } from './pages/Vegetables.jsx';
import { TemperaturePage } from './pages/Temperature.jsx';
import { HumidityPage } from './pages/Humidity.jsx';
import { HardwarePage } from './pages/Hardware.jsx';
import { AnalyticsPage } from './pages/Analytics.jsx';
import { DatabasePage } from './pages/Database.jsx';
import { AlertsPage } from './pages/Alerts.jsx';
import { SettingsPage } from './pages/Settings.jsx';

export function createRouter(layoutProps) {
  return [
    {
      path: '/',
      element: <MainLayout {...layoutProps} />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'vegetables', element: <VegetablesPage /> },
        { path: 'temperature', element: <TemperaturePage /> },
        { path: 'humidity', element: <HumidityPage /> },
        { path: 'hardware', element: <HardwarePage /> },
        { path: 'analytics', element: <AnalyticsPage /> },
        { path: 'database', element: <DatabasePage /> },
        { path: 'alerts', element: <AlertsPage /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ];
}
