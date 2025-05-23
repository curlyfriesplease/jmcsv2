import React from 'react';
import type { Settings } from '../App';
import './SettingsModal.css';

interface SettingsModalProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSettingsChange,
  onClose,
}) => {
  const handleSettingToggle = (key: keyof Settings) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="settings-modal-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal">
        <header className="settings-header">
          <h2>Settings</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close Settings"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        <div className="settings-content">
          <div className="settings-section">
            <h3>Display</h3>
            <div className="setting-item">
              <label htmlFor="animations">
                <input
                  type="checkbox"
                  id="animations"
                  checked={settings.enableAnimations}
                  onChange={() => handleSettingToggle('enableAnimations')}
                />
                <span className="checkmark"></span>
                Enable Animations
              </label>
              <p>Turn on/off smooth animations throughout the app</p>
            </div>

            <div className="setting-item">
              <label htmlFor="darkmode">
                <input
                  type="checkbox"
                  id="darkmode"
                  checked={settings.enableDarkMode}
                  onChange={() => handleSettingToggle('enableDarkMode')}
                />
                <span className="checkmark"></span>
                Dark Mode
              </label>
              <p>Use dark theme for better nighttime viewing</p>
            </div>
          </div>

          <div className="settings-section">
            <h3>Audio & Notifications</h3>
            <div className="setting-item">
              <label htmlFor="sound">
                <input
                  type="checkbox"
                  id="sound"
                  checked={settings.enableSound}
                  onChange={() => handleSettingToggle('enableSound')}
                />
                <span className="checkmark"></span>
                Enable Sound Effects
              </label>
              <p>Play sound effects for interactions</p>
            </div>

            <div className="setting-item">
              <label htmlFor="notifications">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={settings.enableNotifications}
                  onChange={() => handleSettingToggle('enableNotifications')}
                />
                <span className="checkmark"></span>
                Enable Notifications
              </label>
              <p>Receive app notifications and updates</p>
            </div>
          </div>

          <div className="settings-section">
            <h3>Data & Storage</h3>
            <div className="setting-item">
              <label htmlFor="autosave">
                <input
                  type="checkbox"
                  id="autosave"
                  checked={settings.enableAutoSave}
                  onChange={() => handleSettingToggle('enableAutoSave')}
                />
                <span className="checkmark"></span>
                Auto-save Data
              </label>
              <p>Automatically save your progress and settings</p>
            </div>
          </div>
        </div>

        <footer className="settings-footer">
          <button className="settings-button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="settings-button primary" onClick={onClose}>
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
