import React from 'react';
import './BaseLayer.css';

interface BaseLayerProps {
  children: React.ReactNode;
}

const BaseLayer: React.FC<BaseLayerProps> = ({ children }) => {
  return (
    <div className="base-layer">
      <div className="animated-background"></div>
      <div className="content-overlay">{children}</div>
    </div>
  );
};

export default BaseLayer;
