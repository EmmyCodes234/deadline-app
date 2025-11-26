import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function PageTransition() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flashWhite, setFlashWhite] = useState(false);

  useEffect(() => {
    // Trigger transition on route change
    const handleTransition = async () => {
      // 1. Show black overlay immediately
      setIsTransitioning(true);
      setFlashWhite(false);
      
      // Play static zap sound (after user interaction)
      horrorAudio.playStaticZap();
      
      // 2. Wait 100ms
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Flash white for 50ms
      setFlashWhite(true);
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // 4. Remove overlay
      setIsTransitioning(false);
      setFlashWhite(false);
    };

    handleTransition();
  }, [location.pathname]);

  if (!isTransitioning) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] pointer-events-none transition-colors duration-0 ${
        flashWhite ? 'bg-white' : 'bg-black'
      }`}
    />
  );
}
