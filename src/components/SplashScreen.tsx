import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './SplashScreen.css';
import '../styles/imageEnhancements.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const clickTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial state - everything hidden and transformed
    gsap.set([backgroundRef.current, logoRef.current, clickTextRef.current], {
      opacity: 0,
      scale: 0,
      rotation: -360,
    });

    // Crazy entrance animations
    tl.to(backgroundRef.current, {
      duration: 1.5,
      opacity: 1,
      scale: 1,
      rotation: 0,
      ease: 'elastic.out(1, 0.8)',
    })
      .to(
        logoRef.current,
        {
          duration: 1.2,
          opacity: 1,
          scale: 1,
          rotation: 0,
          ease: 'back.out(2)',
          y: 0,
        },
        '-=0.8'
      )
      .to(logoRef.current, {
        duration: 2,
        rotation: 360,
        ease: 'none',
        repeat: -1,
        yoyo: false,
      })
      .to(
        clickTextRef.current,
        {
          duration: 0.8,
          opacity: 1,
          scale: 1,
          rotation: 0,
          ease: 'bounce.out',
        },
        '-=1'
      )
      .to(clickTextRef.current, {
        duration: 1.5,
        scale: 1.1,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      });
  }, []);

  const handleClick = () => {
    // Crazy exit animation
    const exitTl = gsap.timeline({
      onComplete: onComplete,
    });

    exitTl
      .to([backgroundRef.current, logoRef.current], {
        duration: 0.8,
        scale: 2,
        rotation: 720,
        opacity: 0,
        ease: 'power4.in',
      })
      .to(
        clickTextRef.current,
        {
          duration: 0.6,
          scale: 0,
          rotation: -180,
          opacity: 0,
          ease: 'back.in(2)',
        },
        '-=0.4'
      )
      .to(containerRef.current, {
        duration: 0.4,
        scale: 0,
        opacity: 0,
        ease: 'power4.in',
      });
  };

  return (
    <div ref={containerRef} className="splash-screen" onClick={handleClick}>
      <div className="splash-content">
        <div className="splash-images">
          <img
            ref={backgroundRef}
            src="/src/assets/splash/splashMe.png"
            alt="Splash Background"
            className="splash-background-enhanced"
          />
          <img
            ref={logoRef}
            src="/src/assets/splash/splashLogo.png"
            alt="Splash Logo"
            className="splash-logo-enhanced"
          />
        </div>
        <p ref={clickTextRef} className="click-text">
          Click to continue
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
