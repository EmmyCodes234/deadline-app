import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function SmokeTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      // Throttle particle spawning to every 30ms for performance
      if (now - lastSpawnRef.current < 30) return;
      lastSpawnRef.current = now;

      const newParticle: Particle = {
        id: particleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
      };

      setParticles((prev) => [...prev, newParticle]);
    };

    // Cleanup old particles every 100ms
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setParticles((prev) => prev.filter((p) => now - p.timestamp < 1000));
    }, 100);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997]">
      {particles.map((particle) => (
        <SmokeParticle key={particle.id} particle={particle} />
      ))}
    </div>
  );
}

function SmokeParticle({ particle }: { particle: Particle }) {
  const age = Date.now() - particle.timestamp;
  const progress = age / 1000; // 0 to 1 over 1 second

  // Calculate animated properties
  const size = 10 + progress * 30; // 10px -> 40px
  const opacity = 0.5 * (1 - progress); // 0.5 -> 0
  const blur = 4 + progress * 4; // 4px -> 8px

  return (
    <div
      className="absolute rounded-full bg-zinc-400"
      style={{
        left: particle.x,
        top: particle.y,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        opacity,
        filter: `blur(${blur}px)`,
        transition: 'all 0.1s linear',
      }}
    />
  );
}
