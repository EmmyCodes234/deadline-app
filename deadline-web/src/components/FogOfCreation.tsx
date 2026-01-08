/**
 * FogOfCreation Component
 * Atmospheric fog effect that drifts across the background
 * Creates depth and mystical ambiance
 */

import { useEffect, useRef } from 'react';
import './FogOfCreation.css';

interface FogOfCreationProps {
  density?: 'light' | 'medium' | 'heavy';
  color?: 'purple' | 'red' | 'blue' | 'neutral';
  speed?: 'slow' | 'medium' | 'fast';
}

export function FogOfCreation({ 
  density = 'medium',
  color = 'neutral',
  speed = 'slow'
}: FogOfCreationProps) {
  const fogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add random starting positions for organic movement
    if (fogRef.current) {
      const layers = fogRef.current.querySelectorAll('.fog-layer');
      layers.forEach((layer, index) => {
        const randomDelay = Math.random() * 10;
        (layer as HTMLElement).style.animationDelay = `${randomDelay}s`;
      });
    }
  }, []);

  return (
    <div 
      ref={fogRef}
      className={`fog-of-creation fog-${density} fog-${color} fog-${speed}`}
      aria-hidden="true"
    >
      {/* Multiple fog layers for depth */}
      <div className="fog-layer fog-layer-1" />
      <div className="fog-layer fog-layer-2" />
      <div className="fog-layer fog-layer-3" />
    </div>
  );
}
