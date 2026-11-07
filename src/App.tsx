import React, { useState, useEffect } from 'react';
import { Bike } from './types';
import { DEFAULT_BIKE } from './data/defaults';
import { InitialBikeForm } from './components/InitialBikeForm';
import { MainDashboardScreen } from './components/MainDashboardScreen';

export default function App() {
  // Theme state: always starts in light mode per user requirement ("siempre debe iniciar en modo claro")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Track if bike has completed initial setup
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean>(() => {
    return localStorage.getItem('pitracer_setup_completed') === 'true';
  });

  const [currentBike, setCurrentBike] = useState<Bike>(() => {
    const saved = localStorage.getItem('pitracer_bike');
    return saved ? JSON.parse(saved) : DEFAULT_BIKE;
  });

  // Sync dark mode class on document and body (clean up any previous dark class on startup)
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDarkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      localStorage.removeItem('pitracer_theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleCompleteInitialSetup = (bike: Bike) => {
    setCurrentBike(bike);
    setHasCompletedSetup(true);
    localStorage.setItem('pitracer_bike', JSON.stringify(bike));
    localStorage.setItem('pitracer_garage', JSON.stringify([bike]));
    localStorage.setItem('pitracer_setup_completed', 'true');
  };

  const handleResetApp = () => {
    localStorage.removeItem('pitracer_setup_completed');
    localStorage.removeItem('pitracer_bike');
    localStorage.removeItem('pitracer_fuel_logs');
    localStorage.removeItem('pitracer_tasks');
    localStorage.removeItem('pitracer_service_logs');
    localStorage.removeItem('pitracer_trips');
    localStorage.removeItem('pitracer_garage');
    setHasCompletedSetup(false);
    setCurrentBike(DEFAULT_BIKE);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {!hasCompletedSetup ? (
        <InitialBikeForm
          onComplete={handleCompleteInitialSetup}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
        />
      ) : (
        <MainDashboardScreen
          initialBike={currentBike}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
          onResetApp={handleResetApp}
        />
      )}
    </div>
  );
}
