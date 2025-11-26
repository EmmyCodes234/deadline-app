import { useEffect, useState } from 'react';

interface TypeImpactProps {
  trigger: number; // Increment this to trigger animation
}

export function TypeImpact({ trigger }: TypeImpactProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    // Create particles
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 100,
    }));

    setParticles(newParticles);

    // Remove particles after animation
    const timeout = setTimeout(() => {
      setParticles([]);
    }, 600);

    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-500 rounded-full animate-ping"
          style={{
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
}
