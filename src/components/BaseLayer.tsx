import React from 'react';
import './BaseLayer.css';
import Starfield from './Starfield';

interface BaseLayerProps {
  children: React.ReactNode;
}

const BaseLayer: React.FC<BaseLayerProps> = ({ children }) => {
  return (
    <div className="base-layer">
      <Starfield />
      <div className="content-overlay">{children}</div>
    </div>
  );
};

export default BaseLayer;
