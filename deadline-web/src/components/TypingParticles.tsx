import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface TypingParticlesProps {
  isActive: boolean;
  targetElement?: HTMLElement | null;
}

let particleIdCounter = 0;

export function TypingParticles({ isActive, targetElement }: TypingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [wpm, setWpm] = useState(0);
  const keystrokeTimestamps = useRef<number[]>([]);

  // Calculate WPM based on recent keystrokes
  const updateWpm = useCallback(() => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Filter keystrokes from the last minute
    keystrokeTimestamps.current = keystrokeTimestamps.current.filter(
      timestamp => timestamp > oneMinuteAgo
    );
    
    // Calculate WPM (assuming average word is 5 characters)
    const charactersTyped = keystrokeTimestamps.current.length;
    const wordsTyped = charactersTyped / 5;
    const minutesElapsed = Math.min(keystrokeTimestamps.current.length > 0 
      ? (now - keystrokeTimestamps.current[0]) / 60000 
      : 1, 1);
    
    const calculatedWpm = minutesElapsed > 0 ? Math.round(wordsTyped / minutesElapsed) : 0;
    setWpm(calculatedWpm);
  }, []);

  const spawnParticles = useCallback((x: number, y: number) => {
    const particleCount = Math.floor(Math.random() * 3) + 4; // 4-6 particles
    const newParticles: Particle[] = [];

    // Gold and white sparks to match the yellow text
    const colors = ['#FFD700', '#FFD700', '#FFFFFF', '#FFF8DC']; // Gold and white

    for (let i = 0; i < particleCount; i++) {
      // Slight horizontal spread, but mainly upward
      const horizontalSpread = (Math.random() - 0.5) * 40; // -20 to 20px horizontal
      
      newParticles.push({
        id: particleIdCounter++,
        x,
        y,
        vx: horizontalSpread, // Minimal horizontal movement
        vy: -80, // Upward movement (rising sparks)
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 2, // 2-5px
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Auto-cleanup after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 500);
  }, []);

  // Listen for keystrokes and spawn particles at input position
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys and special keys
      if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') return;
      if (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter') return;

      // Track keystroke for WPM calculation
      keystrokeTimestamps.current.push(Date.now());
      updateWpm();

      // Get position from target element or use default
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        // Spawn particles near the input field
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        // Try to get caret position
        try {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            if (rect.left && rect.top) {
              x = rect.left;
              y = rect.top;
            }
          }
        } catch (error) {
          // Use default position
        }
      }

      spawnParticles(x, y);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, targetElement, spawnParticles, updateWpm]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: particle.x + particle.vx,
              y: particle.y - 50, // Float upward 50px (rising heat)
              opacity: 0,
              scale: 0.3,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 4}px ${particle.color}`, // Glow for all gold/white particles
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
