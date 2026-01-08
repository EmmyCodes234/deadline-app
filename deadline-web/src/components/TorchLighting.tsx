import { useEffect, useRef } from 'react';

export function TorchLighting() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (overlayRef.current) {
        // Convert mouse position to percentage for smooth tracking
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        overlayRef.current.style.setProperty('--x', `${x}%`);
        overlayRef.current.style.setProperty('--y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <div ref={overlayRef} className="torch-overlay" />;
}
