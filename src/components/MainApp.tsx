import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { quotesManager, type Quote } from '../utils/quotesManager';
import type { Settings } from '../App';
import './MainApp.css';
import '../styles/imageEnhancements.css';
import '../styles/rainbowText.css';

interface MainAppProps {
  onOpenSettings: () => void;
  settings: Settings;
}

const jonFaces = [
  '/src/assets/jonfaces/jonface1PNG.png',
  '/src/assets/jonfaces/jonface2PNG.png',
  '/src/assets/jonfaces/jonface3PNG.png',
  '/src/assets/jonfaces/jonface4PNG.png',
];

const MainApp: React.FC<MainAppProps> = ({ onOpenSettings, settings }) => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentJonFace, setCurrentJonFace] = useState(0);
  const [rainbowMode, setRainbowMode] = useState<
    'none' | 'enabled' | 'simple' | 'shimmer'
  >('enabled');

  const quoteRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const jonButtonRef = useRef<HTMLButtonElement>(null);

  const animateQuoteIn = (text: string) => {
    if (!quoteRef.current) return;

    // Use only standard ASCII characters that work well in monospace
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const words = text.split(' ');

    // Create word spans, each containing character spans with the final text
    quoteRef.current.innerHTML = words
      .map((word, wordIndex) => {
        const charSpans = word
          .split('')
          .map(
            (char, charIndex) =>
              `<span class="char" data-char="${char}" data-word="${wordIndex}" data-char-index="${charIndex}" style="--char-index: ${
                wordIndex * 10 + charIndex
              }">
                ${char}
              </span>`
          )
          .join('');
        return `<span class="word" data-word-index="${wordIndex}">${charSpans}</span>`;
      })
      .join(' ');

    // Apply rainbow effect class
    const rainbowClass = rainbowMode !== 'none' ? `rainbow-${rainbowMode}` : '';
    console.log(
      '🌈 Applying rainbow class:',
      rainbowClass,
      'for mode:',
      rainbowMode
    );
    if (rainbowClass) {
      quoteRef.current.classList.add(rainbowClass);
      console.log(
        '🌈 Added class:',
        rainbowClass,
        'to element:',
        quoteRef.current
      );
    } else {
      // Remove any existing rainbow classes
      quoteRef.current.classList.remove(
        'rainbow-enabled',
        'rainbow-simple',
        'rainbow-shimmer'
      );
      console.log('🌈 Removed all rainbow classes');
    }

    console.log('🌈 Current element classes:', quoteRef.current.className);

    // Debug: Check if the CSS is actually being applied
    setTimeout(() => {
      const firstChar = quoteRef.current?.querySelector('.char');
      if (firstChar) {
        const computedStyle = window.getComputedStyle(firstChar);
        console.log('🌈 First character computed color:', computedStyle.color);
        console.log(
          '🌈 First character computed text-shadow:',
          computedStyle.textShadow
        );
        console.log(
          '🌈 First character computed animation:',
          computedStyle.animation
        );
        console.log('🌈 Character element:', firstChar);
      }
    }, 100);

    const wordElements = quoteRef.current.querySelectorAll('.word');

    // Set initial GSAP state
    gsap.set(quoteRef.current, {
      opacity: 1,
      scale: 0.8,
      rotationX: -90,
    });

    // Set initial word states
    gsap.set(wordElements, {
      opacity: 0,
      y: 50,
      rotationX: 90,
      transformOrigin: 'center bottom',
    });

    // Animate container in
    gsap.to(quoteRef.current, {
      scale: 1,
      rotationX: 0,
      duration: 0.4,
      ease: 'back.out(1.7)',
    });

    // Animate words in with stagger
    wordElements.forEach((wordEl, wordIndex) => {
      const wordChars = wordEl.querySelectorAll('.char');

      // Animate word in after staggered delay
      gsap.delayedCall(wordIndex * 0.15, () => {
        // First animate the word container
        gsap.to(wordEl, {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.4,
          ease: 'back.out(1.7)',
        });

        // Then scramble and reveal characters within the word
        // Note: Using fixed-width chars (1ch width + monospace font) prevents jumping
        // as all scrambled characters occupy identical space regardless of letter/symbol
        wordChars.forEach((charEl, charIndex) => {
          let scrambleCount = 0;
          const maxScrambles = 6 + Math.random() * 4;

          // Add scrambling class to disable rainbow during scramble (only once)
          if (wordIndex === 0 && charIndex === 0 && quoteRef.current) {
            quoteRef.current.classList.add('scrambling');
          }

          // Start with scrambled character
          charEl.textContent = chars[Math.floor(Math.random() * chars.length)];

          gsap.delayedCall(charIndex * 0.03, () => {
            const scrambleInterval = setInterval(() => {
              if (scrambleCount < maxScrambles) {
                charEl.textContent =
                  chars[Math.floor(Math.random() * chars.length)];
                scrambleCount++;
              } else {
                // Reveal final character
                charEl.textContent = charEl.getAttribute('data-char') || '';
                clearInterval(scrambleInterval);

                // Only remove scrambling class when this is the LAST character to complete
                if (
                  wordIndex === wordElements.length - 1 &&
                  charIndex === wordChars.length - 1 &&
                  quoteRef.current
                ) {
                  quoteRef.current.classList.remove('scrambling');
                }

                // Add bounce effect when character is revealed
                gsap.fromTo(
                  charEl,
                  { scale: 1.3, filter: 'brightness(1.5)' },
                  {
                    scale: 1,
                    filter: 'brightness(1)',
                    duration: 0.15,
                    ease: 'back.out(2)',
                  }
                );

                // Check if this is the last character to complete
                if (
                  wordIndex === wordElements.length - 1 &&
                  charIndex === wordChars.length - 1
                ) {
                  setIsAnimating(false);
                }
              }
            }, 25);
          });
        });
      });
    });
  };

  const animateQuoteOut = (callback: () => void) => {
    if (!quoteRef.current) {
      callback();
      return;
    }

    const charElements = quoteRef.current.querySelectorAll('.char');
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Animate characters into scrambled state smoothly
    charElements.forEach((charEl, index) => {
      if (charEl.textContent === ' ') return;

      let scrambleCount = 0;
      const maxScrambles = 3 + Math.random() * 2; // Fewer scrambles for exit

      gsap.delayedCall(index * 0.008, () => {
        // Faster stagger for exit
        const scrambleInterval = setInterval(() => {
          if (scrambleCount < maxScrambles) {
            charEl.textContent =
              chars[Math.floor(Math.random() * chars.length)];
            scrambleCount++;
          } else {
            // Keep final scrambled character visible during exit
            charEl.textContent =
              chars[Math.floor(Math.random() * chars.length)];
            clearInterval(scrambleInterval);
          }
        }, 30);
      });
    });

    // Start the exit animation after a brief delay to let scrambling begin
    gsap.delayedCall(0.2, () => {
      // Animate container out
      gsap.to(quoteRef.current, {
        opacity: 0,
        scale: 0.6,
        rotationX: 90,
        duration: 0.3, // Faster exit
        ease: 'power4.in',
        onComplete: callback,
      });

      // Add individual character animations
      gsap.to(charElements, {
        scale: 0,
        rotation: 180,
        duration: 0.25, // Faster character exit
        ease: 'power2.in',
        stagger: 0.005,
      });
    });
  };

  const loadNextQuote = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (currentQuote) {
      // Animate out current quote, then load new one
      animateQuoteOut(() => {
        const nextQuote = quotesManager.getRandomQuote();
        setCurrentQuote(nextQuote);
        if (nextQuote) {
          setTimeout(() => animateQuoteIn(nextQuote.text), 100);
        } else {
          setIsAnimating(false);
        }
      });
    } else {
      // First load
      const nextQuote = quotesManager.getRandomQuote();
      setCurrentQuote(nextQuote);
      if (nextQuote) {
        setTimeout(() => animateQuoteIn(nextQuote.text), 500);
      } else {
        setIsAnimating(false);
      }
    }
  };

  useEffect(() => {
    // Update available quotes when settings change
    quotesManager.updateAvailableQuotes(settings);
    loadNextQuote();
  }, [settings]);

  // Debug: Log rainbow mode changes
  useEffect(() => {
    console.log('🌈 Rainbow mode changed to:', rainbowMode);
  }, [rainbowMode]);

  // Apply rainbow mode changes immediately to existing quote
  useEffect(() => {
    if (!quoteRef.current) return;

    // Remove any existing rainbow classes
    quoteRef.current.classList.remove(
      'rainbow-enabled',
      'rainbow-simple',
      'rainbow-shimmer'
    );

    // Apply new rainbow class if not 'none'
    const rainbowClass = rainbowMode !== 'none' ? `rainbow-${rainbowMode}` : '';
    if (rainbowClass) {
      quoteRef.current.classList.add(rainbowClass);
      console.log('🌈 Immediately applied class:', rainbowClass);
    } else {
      console.log('🌈 Removed all rainbow classes');
    }
  }, [rainbowMode]);

  const cycleRainbowMode = () => {
    console.log('🌈 Rainbow button clicked! Current mode:', rainbowMode);
    setRainbowMode((current) => {
      const modes: Array<'none' | 'enabled' | 'simple' | 'shimmer'> = [
        'none',
        'enabled',
        'simple',
        'shimmer',
      ];
      const currentIndex = modes.indexOf(current);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      console.log('🌈 Cycling from:', current, 'to:', nextMode);
      return nextMode;
    });
  };

  useEffect(() => {
    // Initial entrance animation (reduced to preserve rainbow text)
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          scale: 0.9,
          rotationY: 45,
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          delay: 0.2,
        }
      );
    }
  }, []);

  const handleJonFaceClick = () => {
    if (isAnimating) return;

    // Animate button
    if (jonButtonRef.current) {
      gsap.to(jonButtonRef.current, {
        scale: 0.8,
        rotation: 360,
        duration: 0.3,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    }

    // Change to random jon face
    setCurrentJonFace(Math.floor(Math.random() * jonFaces.length));

    // Load next quote
    loadNextQuote();
  };

  return (
    <div ref={containerRef} className="main-app">
      {/* Rainbow mode cycle button */}
      <button
        className="rainbow-button"
        onClick={cycleRainbowMode}
        aria-label={`Rainbow Mode: ${rainbowMode}`}
        title={`Current: ${
          rainbowMode === 'none' ? 'Off' : rainbowMode
        }. Click to cycle.`}
      >
        🌈
      </button>

      {/* Settings button */}
      <button
        className="settings-button"
        onClick={onOpenSettings}
        aria-label="Open Settings"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Main content */}
      <div className="main-content">
        <div className="quote-container">
          {currentQuote ? (
            <div ref={quoteRef} className="quote-text">
              {currentQuote.text}
            </div>
          ) : (
            <div className="no-quotes">
              <h2>No more quotes available!</h2>
              <p>Adjust your settings or restore default quotes to see more.</p>
            </div>
          )}
        </div>
        {/* Jon face button */}
        <button
          ref={jonButtonRef}
          className="jon-face-button-enhanced"
          onClick={handleJonFaceClick}
          disabled={isAnimating || !currentQuote}
        >
          <img
            src={jonFaces[currentJonFace]}
            alt="Jon Face"
            className="jon-face-image-enhanced"
          />
        </button>
      </div>
    </div>
  );
};

export default MainApp;
