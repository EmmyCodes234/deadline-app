import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColdOpenSplashProps {
  onComplete: () => void;
}

export function ColdOpenSplash({ onComplete }: ColdOpenSplashProps) {
  const [triggered, setTriggered] = useState(false);
  const [glitch, setGlitch] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Random glitch twitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(Math.random() > 0.5 ? 2 : -2);
      setTimeout(() => setGlitch(0), 50);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);



  // Play procedural CRT power-on sound
  const playCRTSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const t = ctx.currentTime;

      // 1. The "Static" (White Noise Burst)
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter the noise to sound like a "pop" then "hiss"
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1000, t);
      noiseFilter.frequency.exponentialRampToValueAtTime(100, t + 0.2);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(t);

      // 2. The "Capacitor Charge" (High Frequency Whine)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(8000, t); // Start High
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.5); // Drop Low

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.3, t);
      oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(t);

      // 3. The "Thud" (Sub-bass impact)
      const kick = ctx.createOscillator();
      kick.type = 'triangle';
      kick.frequency.setValueAtTime(50, t);
      kick.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);

      const kickGain = ctx.createGain();
      kickGain.gain.setValueAtTime(0.8, t);
      kickGain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

      kick.connect(kickGain);
      kickGain.connect(ctx.destination);

      kick.start(t);
    } catch (error) {
      console.warn('CRT audio playback failed:', error);
    }
  };

  // Press any key to start
  useEffect(() => {
    const handleStart = (e: KeyboardEvent | MouseEvent) => {
      if (e instanceof KeyboardEvent) {
        e.preventDefault(); // Stop scrolling if Space is pressed
      }
      
      // 1. Audio
      playCRTSound();
      
      // 2. Visual Trigger
      setTriggered(true);
      
      // 3. Transition Delay (Let the sound play for 500ms before unmounting)
      setTimeout(() => {
        if (audioContextRef.current) {
          audioContextRef.current.resume();
        }
        onComplete();
      }, 800);
    };
    
    window.addEventListener('keydown', handleStart);
    window.addEventListener('click', handleStart);
    
    return () => {
      window.removeEventListener('keydown', handleStart);
      window.removeEventListener('click', handleStart);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!triggered && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Arcade Cabinet Attract Mode */}
          <div
            style={{
              fontFamily: "'Creepster', cursive",
              fontSize: '4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              userSelect: 'none',
              color: '#ffffff',
              transform: `translateX(${glitch}px)`,
              transition: 'transform 0.05s',
              animation: 'blink 2s ease-in-out infinite',
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
            }}
          >
            PRESS ANY KEY
          </div>

          <style>{`
            @keyframes blink {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.3;
              }
            }
          `}</style>
        </motion.div>
      )}
      
      {triggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-none"
        >
          {/* Flash and Scale on Trigger */}
          <div
            style={{
              fontFamily: "'Creepster', cursive",
              fontSize: '4rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              userSelect: 'none',
              color: '#ff0000',
              transform: 'scale(1.2)',
              transition: 'all 0.1s',
              textShadow: '0 0 40px rgba(255, 0, 0, 0.8)',
            }}
          >
            PRESS ANY KEY
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
