import { useEffect, useState, useCallback } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode(onActivate: () => void) {
  const [keys, setKeys] = useState<string[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeys((prevKeys) => {
      const newKeys = [...prevKeys, e.key];
      
      // Keep only the last 10 keys
      if (newKeys.length > KONAMI_CODE.length) {
        newKeys.shift();
      }
      
      // Check if the sequence matches
      if (newKeys.length === KONAMI_CODE.length) {
        const matches = newKeys.every((key, index) => key === KONAMI_CODE[index]);
        if (matches) {
          onActivate();
          return []; // Reset after activation
        }
      }
      
      return newKeys;
    });
  }, [onActivate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Play demonic laugh sound procedurally
 */
export function playDemonicLaugh() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;

    // Create a descending pitch laugh effect
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      
      // Descending pitch for each "ha"
      const startFreq = 300 - (i * 20);
      const endFreq = 200 - (i * 20);
      const startTime = t + (i * 0.15);
      
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + 0.1);

      // Lowpass filter for darkness
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, startTime);
      filter.Q.setValueAtTime(5, startTime);

      // Envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.15);
    }

    // Add reverb-like echo
    const delay = ctx.createDelay();
    const delayGain = ctx.createGain();
    
    delay.delayTime.setValueAtTime(0.2, t);
    delayGain.gain.setValueAtTime(0.3, t);
    
    // This creates a feedback loop for echo effect
    // Note: In production, you'd want to be more careful with feedback loops
  } catch (error) {
    console.warn('Demonic laugh playback failed:', error);
  }
}
