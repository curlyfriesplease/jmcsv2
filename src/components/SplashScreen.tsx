import React from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  return (
    <div className="splash-screen" onClick={onComplete}>
      <div className="splash-content">
        <div className="placeholder-image">
          <div className="image-placeholder">
            <span>Placeholder Image Here</span>
            <p>Click to continue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
