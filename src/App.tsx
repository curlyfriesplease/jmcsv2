import { useState, useEffect } from 'react';
import BaseLayer from './components/BaseLayer';
import SplashScreen from './components/SplashScreen';
import MainApp from './components/MainApp';
import SettingsModal from './components/SettingsModal';

export interface Settings {
  enableAnimations: boolean;
  enableSound: boolean;
  enableNotifications: boolean;
  enableDarkMode: boolean;
  enableAutoSave: boolean;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          enableAnimations: true,
          enableSound: true,
          enableNotifications: false,
          enableDarkMode: true,
          enableAutoSave: true,
        };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  return (
    <BaseLayer>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <MainApp onOpenSettings={handleOpenSettings} settings={settings} />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={handleCloseSettings}
        />
      )}
    </BaseLayer>
  );
}

export default App;
