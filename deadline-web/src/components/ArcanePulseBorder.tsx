/**
 * ArcanePulseBorder Component
 * Glowing veins of energy that pulse slowly between panels
 * Creates the feeling of magical pressure held back by the interface
 */

import { useEffect, useRef } from 'react';
import './ArcanePulseBorder.css';

interface ArcanePulseBorderProps {
  position?: 'left' | 'right' | 'top' | 'bottom';
  color?: 'purple' | 'red' | 'blue' | 'gold';
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function ArcanePulseBorder({ 
  position = 'right',
  color = 'purple',
  intensity = 'medium'
}: ArcanePulseBorderProps) {
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add random variation to pulse timing for organic feel
    if (borderRef.current) {
      const randomDelay = Math.random() * 2;
      borderRef.current.style.animationDelay = `${randomDelay}s`;
    }
  }, []);

  return (
    <div 
      ref={borderRef}
      className={`arcane-pulse-border arcane-pulse-${position} arcane-pulse-${color} arcane-pulse-${intensity}`}
      aria-hidden="true"
    />
  );
}
