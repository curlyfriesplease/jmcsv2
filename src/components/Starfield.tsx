import { useMemo, type CSSProperties } from 'react';
import './Starfield.css';

const SPREAD = 2000;
const FIREFLIES = 15;

function starShadows(count: number) {
  let shadows = '';
  for (let i = 0; i < count; i += 1) {
    if (i > 0) shadows += ',';
    const x = Math.floor(Math.random() * SPREAD);
    const y = Math.floor(Math.random() * SPREAD);
    shadows += `${x}px ${y}px #fff`;
  }
  return shadows;
}

function fireflyCss() {
  let css = '';
  for (let i = 1; i <= FIREFLIES; i += 1) {
    const steps = 16 + Math.floor(Math.random() * 12);
    let frames = '';
    for (let step = 0; step <= steps; step += 1) {
      const percent = ((step * 100) / steps).toFixed(2);
      const x = Math.floor(Math.random() * 100) - 50;
      const y = Math.floor(Math.random() * 100) - 50;
      const scale = (Math.random() * 0.75 + 0.25).toFixed(2);
      frames += `${percent}%{transform:translateX(${x}vw) translateY(${y}vh) scale(${scale})}`;
    }
    const drift = (8 + Math.random() * 10).toFixed(1);
    const flash = Math.floor(5000 + Math.random() * 6000);
    const delay = Math.floor(500 + Math.random() * 8000);
    const travel = Math.floor(45 + Math.random() * 40);
    css += `.firefly:nth-child(${i}){animation-name:firefly-move-${i};animation-duration:${travel}s}`;
    css += `.firefly:nth-child(${i})::before{animation-duration:${drift}s}`;
    css += `.firefly:nth-child(${i})::after{animation-duration:${drift}s,${flash}ms;animation-delay:0ms,${delay}ms}`;
    css += `@keyframes firefly-move-${i}{${frames}}`;
  }
  return css;
}

const Starfield = () => {
  const field = useMemo(
    () => ({
      small: starShadows(700),
      medium: starShadows(200),
      large: starShadows(100),
      fireflies: fireflyCss(),
    }),
    []
  );

  return (
    <div className="starfield" aria-hidden="true">
      <style>{field.fireflies}</style>
      <div className="stars stars-small" style={{ '--star-shadows': field.small } as CSSProperties} />
      <div className="stars stars-medium" style={{ '--star-shadows': field.medium } as CSSProperties} />
      <div className="stars stars-large" style={{ '--star-shadows': field.large } as CSSProperties} />
      <div className="fireflies">
        {Array.from({ length: FIREFLIES }, (_, index) => (
          <div className="firefly" key={index} />
        ))}
      </div>
    </div>
  );
};

export default Starfield;
