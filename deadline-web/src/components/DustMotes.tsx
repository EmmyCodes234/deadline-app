import { useMemo } from 'react';

export function DustMotes() {
  // Generate 20 particles with random properties
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${5 + Math.random() * 10}s`, // 5s to 15s
      delay: `${Math.random() * 5}s`, // 0s to 5s delay
    }));
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.left,
            top: particle.top,
            width: '2px',
            height: '2px',
            backgroundColor: 'white',
            borderRadius: '50%',
            animation: `float ${particle.duration} infinite ease-in-out`,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
