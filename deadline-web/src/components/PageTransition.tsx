import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function PageTransition() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Trigger smooth transition on route change
    const handleTransition = async () => {
      setIsTransitioning(true);
      
      // Play subtle transition sound
      try {
        horrorAudio.playStaticZap();
      } catch (error) {
        // Silent fail if audio not ready
      }
      
      // Wait for fade out animation
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Remove overlay (fade in will happen automatically)
      setIsTransitioning(false);
    };

    handleTransition();
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] pointer-events-none bg-black"
        />
      )}
    </AnimatePresence>
  );
}
