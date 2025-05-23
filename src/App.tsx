import { useState, useEffect } from 'react';
import BaseLayer from './components/BaseLayer.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import MainApp from './components/MainApp.tsx';
import SettingsModal from './components/SettingsModal.tsx';

export interface Settings {
  excludeV1Quotes: boolean;
  removeNSFWQuotes: boolean;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('app-settings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          excludeV1Quotes: false,
          removeNSFWQuotes: false,
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
