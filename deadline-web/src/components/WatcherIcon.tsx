import { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface WatcherIconProps {
  icon: LucideIcon;
  className?: string;
  strokeWidth?: number;
  maxRotation?: number;
  style?: React.CSSProperties;
}

export function WatcherIcon({ 
  icon: Icon, 
  className = '', 
  strokeWidth = 2.5,
  maxRotation = 15,
  style 
}: WatcherIconProps) {
  const iconRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  // Spring animation for smooth, creepy lag
  const rotate = useSpring(0, { stiffness: 50, damping: 15 });
  const translateX = useSpring(0, { stiffness: 50, damping: 15 });
  const translateY = useSpring(0, { stiffness: 50, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!iconRef.current) return;

    const rect = iconRef.current.getBoundingClientRect();
    const iconCenterX = rect.left + rect.width / 2;
    const iconCenterY = rect.top + rect.height / 2;

    // Calculate vector from icon to mouse
    const deltaX = mousePos.x - iconCenterX;
    const deltaY = mousePos.y - iconCenterY;
    
    // Calculate distance for falloff effect
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 1000; // Icons stop tracking beyond this distance
    const distanceFactor = Math.max(0, 1 - distance / maxDistance);

    // Calculate angle to mouse (in degrees)
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Calculate subtle translation towards mouse (max 3px)
    const maxTranslate = 3;
    const tx = (deltaX / distance) * maxTranslate * distanceFactor;
    const ty = (deltaY / distance) * maxTranslate * distanceFactor;

    // Apply rotation (constrained)
    const targetRotation = angle * 0.1 * distanceFactor; // Subtle rotation
    const clampedRotation = Math.max(-maxRotation, Math.min(maxRotation, targetRotation));

    rotate.set(clampedRotation);
    translateX.set(isNaN(tx) ? 0 : tx);
    translateY.set(isNaN(ty) ? 0 : ty);
  }, [mousePos, maxRotation, rotate, translateX, translateY]);

  return (
    <motion.div
      ref={iconRef}
      style={{
        rotate,
        x: translateX,
        y: translateY,
        ...style,
      }}
      className="inline-block origin-center"
    >
      <Icon 
        className={className}
        strokeWidth={strokeWidth}
      />
    </motion.div>
  );
}
