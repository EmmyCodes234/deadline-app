import { useState, useEffect, useRef } from 'react';

/**
 * Peripheral Glitch Hook
 * Randomly triggers visual glitches to create subtle horror atmosphere
 * Returns isGlitching state that components can use to apply horror effects
 */
export function useGlitch() {
  const [isGlitching, setIsGlitching] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const scheduleNextGlitch = () => {
      // Random interval between 20-60 seconds
      const randomDelay = Math.random() * 40000 + 20000; // 20000ms to 60000ms

      timeoutRef.current = window.setTimeout(() => {
        // Trigger glitch
        setIsGlitching(true);

        // End glitch after 100ms
        setTimeout(() => {
          setIsGlitching(false);
          // Schedule next glitch
          scheduleNextGlitch();
        }, 100);
      }, randomDelay);
    };

    // Start the glitch cycle
    scheduleNextGlitch();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isGlitching;
}
