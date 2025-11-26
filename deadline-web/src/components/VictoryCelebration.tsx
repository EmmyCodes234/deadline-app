import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export function VictoryCelebration() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Spawn 50 golden particles from center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const newParticles: Particle[] = [];
    const colors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#ea580c', '#fb923c'];

    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50 + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 300 + 200; // 200-500px/s
      
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100, // Slight upward bias
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4, // 4-12px
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 720, // -360 to 360 degrees/s
      });
    }

    setParticles(newParticles);

    // Cleanup after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 1,
              rotate: particle.rotation,
            }}
            animate={{
              x: particle.x + particle.vx * 1.2,
              y: particle.y + particle.vy * 1.2 + 200, // Gravity effect
              opacity: 0,
              scale: 0.3,
              rotate: particle.rotation + particle.rotationSpeed * 1.2,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94], // Ease-out-cubic
            }}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
