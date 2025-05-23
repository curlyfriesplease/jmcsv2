import React from 'react';
import type { Settings } from '../App';
import { quotesManager } from '../utils/quotesManager';
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

  const handleRestoreDefaults = () => {
    quotesManager.restoreAllQuotes();
    onSettingsChange({
      excludeV1Quotes: false,
      removeNSFWQuotes: false,
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
            <h3>Quote Filters</h3>
            <div className="setting-item">
              <label htmlFor="excludeV1">
                <input
                  type="checkbox"
                  id="excludeV1"
                  checked={settings.excludeV1Quotes}
                  onChange={() => handleSettingToggle('excludeV1Quotes')}
                />
                <span className="checkmark"></span>
                Exclude v1 quotes
              </label>
              <p>Hide questions from the original v1 question set</p>
            </div>

            <div className="setting-item">
              <label htmlFor="removeNSFW">
                <input
                  type="checkbox"
                  id="removeNSFW"
                  checked={settings.removeNSFWQuotes}
                  onChange={() => handleSettingToggle('removeNSFWQuotes')}
                />
                <span className="checkmark"></span>
                Remove NSFW questions
              </label>
              <p>Filter out questions that might be inappropriate</p>
            </div>
          </div>

          <div className="settings-section">
            <h3>Quote Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">
                  {quotesManager.getTotalCount()}
                </span>
                <span className="stat-label">Total quotes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {quotesManager.getSeenCount()}
                </span>
                <span className="stat-label">Seen quotes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {quotesManager.getRemainingCount()}
                </span>
                <span className="stat-label">Remaining</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="settings-footer">
          <button
            className="settings-button secondary"
            onClick={handleRestoreDefaults}
          >
            Restore Default Quotes
          </button>
          <button className="settings-button primary" onClick={onClose}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
