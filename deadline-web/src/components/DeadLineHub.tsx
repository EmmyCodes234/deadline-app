import { Link } from 'react-router-dom';
import { BookOpen, Settings, Scroll } from 'lucide-react';
import { Navigation } from './Navigation';
import { WatcherIcon } from './WatcherIcon';
import { SmokeTrail } from './SmokeTrail';
import { horrorAudio } from '@/lib/audio/HorrorAudio';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export function DeadLineHub() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isTryingToLeave, setIsTryingToLeave] = useState(false);
  const cooldownRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Disable scrolling on mount - aggressive prevention
  useEffect(() => {
    // Stop Lenis smooth scroll
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.stop();
    }
    
    // Lock body and html scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Prevent scroll events
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    window.addEventListener('wheel', preventScroll, { passive: false, capture: true });
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
    window.addEventListener('scroll', preventScroll, { passive: false, capture: true });
    
    return () => {
      // Restart Lenis when leaving
      if (lenis) {
        lenis.start();
      }
      
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
      document.body.style.position = '';
      document.body.style.width = '';
      window.removeEventListener('wheel', preventScroll, true);
      window.removeEventListener('touchmove', preventScroll, true);
      window.removeEventListener('scroll', preventScroll, true);
    };
  }, []);
  
  // Tilt state for each card
  const [card3Tilt, setCard3Tilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [card4Tilt, setCard4Tilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  // Setup ambient background music
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3; // Lower volume for hub (30%)
      
      // Play audio
      const playAudio = () => {
        audio.play().catch(() => {
          // Autoplay blocked, will play on first user interaction
        });
      };
      
      // Attempt to play immediately
      playAudio();
      
      // Also try on any user interaction
      const handleInteraction = () => {
        playAudio();
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      };
      
      document.addEventListener('click', handleInteraction);
      document.addEventListener('keydown', handleInteraction);
      
      // Cleanup
      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }
  }, []);





  // Tilt handlers for card 3
  const handleCard3MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!card3Ref.current) return;
    const rect = card3Ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setCard3Tilt({ rotateX, rotateY, glareX, glareY });
  };

  const resetCard3Tilt = () => setCard3Tilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  // Tilt handlers for card 4
  const handleCard4MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!card4Ref.current) return;
    const rect = card4Ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setCard4Tilt({ rotateX, rotateY, glareX, glareY });
  };

  const resetCard4Tilt = () => setCard4Tilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  // "Don't Leave" listener - triggers when user tries to leave via top of window
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if they leave via the top (tab bar) and not on cooldown
      if (e.clientY <= 0 && !cooldownRef.current) {
        triggerScare();
      }
    };

    const triggerScare = () => {
      // 1. Audio: Growl
      horrorAudio.playGrowl();

      // 2. Visual: Flash Red
      setIsTryingToLeave(true);

      // 3. Cooldown logic
      cooldownRef.current = true;

      // Reset visual after 500ms
      setTimeout(() => setIsTryingToLeave(false), 500);

      // Reset cooldown after 5 seconds
      setTimeout(() => { cooldownRef.current = false; }, 5000);
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  return (
    <>
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/landing-mp3.mp3" type="audio/mpeg" />
      </audio>

      {/* Smoke Trail Effect */}
      <SmokeTrail />

      {/* Fixed Background Layer - Does NOT scroll */}
      <div className="fixed inset-0 w-screen h-screen z-0 m-0 p-0" style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full"
          poster="/bg-graveyard.jpg"
          style={{
            filter: 'brightness(0.5) contrast(1.1) saturate(0.95)',
            objectFit: 'cover',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto'
          }}
        >
          <source src="/bg-graveyard-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay for readability - Cemetery Integration */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* PHASE 1: Main Wrapper - fixed positioning to eliminate any gaps */}
      <div className="hub-main-wrapper fixed inset-0 w-screen h-screen overflow-hidden flex flex-col m-0 p-0" style={{ top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 0 }}>
        {/* Navigation - Absolute positioned to not take up flex space */}
        <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-6">
          <Navigation variant="full" />
        </div>
        
        {/* PHASE 2: Logo - Elastic sizing with clamp, flex-none to prevent crushing */}
        <div className="flex-none flex items-center justify-center px-6" style={{ marginTop: 'clamp(4rem, 12vh, 8rem)', marginBottom: 'clamp(1rem, 3vh, 2rem)' }}>
          <div className="relative">
            <h1 
              className={`font-serif tracking-[0.2em] leading-none text-center transition-all duration-100 ${
                isTryingToLeave ? 'epitaph-title-red' : 'epitaph-title-normal'
              }`}
              style={{ fontSize: 'clamp(5rem, 15vh, 10rem)' }}
            >
              EPITAPH
            </h1>
            <p 
              className="text-center text-neutral-300 text-lg mt-4 tracking-wide"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              What is written here remains forever.
            </p>
          </div>
        </div>
        
        <style>{`
          .epitaph-title-normal {
            color: #e5e5e5;
            text-shadow: 
              0 2px 4px rgba(0, 0, 0, 0.8),
              0 4px 8px rgba(0, 0, 0, 0.6),
              0 8px 16px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
            filter: drop-shadow(0 0 20px rgba(229, 229, 229, 0.2));
          }
          
          .epitaph-title-red {
            color: #dc2626;
            text-shadow: 
              0 2px 4px rgba(0, 0, 0, 0.8),
              0 4px 8px rgba(220, 38, 38, 0.6),
              0 8px 16px rgba(220, 38, 38, 0.4);
            filter: drop-shadow(0 0 30px rgba(220, 38, 38, 0.8));
            transform: scale(1.05) translateY(4px);
          }
        `}</style>

        {/* Red Vignette Flash */}
        <div 
          className={`fixed inset-0 bg-red-900/20 pointer-events-none transition-opacity duration-300 z-50 ${
            isTryingToLeave ? 'opacity-100' : 'opacity-0'
          }`} 
        />

        {/* PHASE 2: Menu Cards - Elastic container with flex-grow, cards scale with viewport */}
        <div className="flex-grow flex items-center justify-center relative z-10 px-6 pb-6">
          <div className="hub-cards-container flex flex-row items-center justify-center gap-4 w-full max-w-5xl" style={{ height: 'min(50vh, 400px)' }}>




          {/* Left Card: MANUSCRIPTS (The Editor) */}
          <Link
            to="/projects"
            onClick={() => horrorAudio.playClick()}
            onMouseEnter={() => horrorAudio.playHover()}
            className="block flex-1"
            style={{ maxWidth: '200px', height: '100%' }}
          >
            <motion.div
              ref={card3Ref}
              onMouseMove={handleCard3MouseMove}
              onMouseEnter={() => setHoveredCard('card3')}
              onMouseLeave={() => {
                resetCard3Tilt();
                setHoveredCard(null);
              }}
              animate={{
                rotateX: card3Tilt.rotateX,
                rotateY: card3Tilt.rotateY,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="group relative overflow-hidden rounded-lg h-full"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div 
                className="absolute inset-0 rounded-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(to bottom, rgba(10, 5, 5, 0.85) 0%, rgba(10, 5, 5, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderBottom: hoveredCard === 'card3' ? '3px solid transparent' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderImage: hoveredCard === 'card3' ? 'linear-gradient(90deg, transparent, #f97316, transparent) 1' : 'none',
                  boxShadow: hoveredCard === 'card3' 
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 40px rgba(249, 115, 22, 0.6), 0 -3px 20px rgba(249, 115, 22, 0.4) inset'
                    : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 40px rgba(0, 0, 0, 0.8)',
                }}
              />
              
              {/* Cracked Glass Texture Overlay */}
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
                    repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)
                  `,
                  mixBlendMode: 'overlay',
                }}
              />
              
              <div 
                className="absolute inset-0 pointer-events-none rounded-lg transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${card3Tilt.glareX}% ${card3Tilt.glareY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                  opacity: hoveredCard === 'card3' ? 1 : 0,
                }}
              />
              
              <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-10 text-zinc-400 pointer-events-none group-hover:text-orange-400 group-hover:opacity-15 transition-all duration-300">
                <BookOpen className="w-32 h-32" strokeWidth={2.5} />
              </div>
            
            <div className="relative z-10 px-4 py-6 flex flex-col items-center text-center h-full justify-end">
              <WatcherIcon 
                icon={BookOpen}
                className="w-12 h-12 mb-4 transition-all duration-300"
                strokeWidth={2.5}
                style={{
                  color: '#e0e0e0',
                  opacity: hoveredCard === 'card3' ? 1 : 0.8,
                  filter: 'drop-shadow(0 2px 4px black)',
                }}
              />
              
              <h2 
                className="text-sm font-bold tracking-widest uppercase mb-2 text-zinc-300 group-hover:text-white transition-colors duration-300"
                style={{ 
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: '0.15em'
                }}
              >
                MANUSCRIPTS
              </h2>
              
              <p 
                className="text-zinc-400 text-xs font-medium leading-relaxed drop-shadow-md"
                style={{ 
                  fontFamily: "'Cinzel', serif"
                }}
              >
                Return to your work.
              </p>
            </div>
            
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                style={{
                  boxShadow: '0 0 40px rgba(249, 115, 22, 0.4)'
                }}
              />
            </motion.div>
          </Link>

          {/* Middle Card: ABJURATIONS (Settings) */}
          <Link
            to="/settings"
            onClick={() => horrorAudio.playClick()}
            onMouseEnter={() => horrorAudio.playHover()}
            className="block flex-1"
            style={{ maxWidth: '200px', height: '100%' }}
          >
            <motion.div
              ref={card4Ref}
              onMouseMove={handleCard4MouseMove}
              onMouseEnter={() => setHoveredCard('card4')}
              onMouseLeave={() => {
                resetCard4Tilt();
                setHoveredCard(null);
              }}
              animate={{
                rotateX: card4Tilt.rotateX,
                rotateY: card4Tilt.rotateY,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="group relative overflow-hidden rounded-lg h-full"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div 
                className="absolute inset-0 rounded-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(to bottom, rgba(10, 5, 5, 0.85) 0%, rgba(10, 5, 5, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderBottom: hoveredCard === 'card4' ? '3px solid transparent' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderImage: hoveredCard === 'card4' ? 'linear-gradient(90deg, transparent, #8b5cf6, transparent) 1' : 'none',
                  boxShadow: hoveredCard === 'card4' 
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.6), 0 -3px 20px rgba(139, 92, 246, 0.4) inset'
                    : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 40px rgba(0, 0, 0, 0.8)',
                }}
              />
              
              {/* Cracked Glass Texture Overlay */}
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
                    repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)
                  `,
                  mixBlendMode: 'overlay',
                }}
              />
              
              <div 
                className="absolute inset-0 pointer-events-none rounded-lg transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${card4Tilt.glareX}% ${card4Tilt.glareY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                  opacity: hoveredCard === 'card4' ? 1 : 0,
                }}
              />
              
              <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-10 text-zinc-400 pointer-events-none group-hover:text-purple-400 group-hover:opacity-15 transition-all duration-300">
                <Settings className="w-32 h-32" strokeWidth={2.5} />
              </div>
            
            <div className="relative z-10 px-4 py-6 flex flex-col items-center text-center h-full justify-end">
              <WatcherIcon 
                icon={Settings}
                className="w-12 h-12 mb-4 transition-all duration-300"
                strokeWidth={2.5}
                style={{
                  color: '#e0e0e0',
                  opacity: hoveredCard === 'card4' ? 1 : 0.8,
                  filter: 'drop-shadow(0 2px 4px black)',
                }}
              />
              
              <h2 
                className="text-sm font-bold tracking-widest uppercase mb-2 text-zinc-300 group-hover:text-white transition-colors duration-300"
                style={{ 
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: '0.15em'
                }}
              >
                ABJURATIONS
              </h2>
              
              <p 
                className="text-zinc-400 text-xs font-medium leading-relaxed drop-shadow-md"
                style={{ 
                  fontFamily: "'Cinzel', serif"
                }}
              >
                Configure your workspace.
              </p>
            </div>
            
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                style={{
                  boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)'
                }}
              />
            </motion.div>
          </Link>

          {/* Right Card: MANIFESTO (About) */}
          <Link
            to="/about"
            onClick={() => horrorAudio.playClick()}
            onMouseEnter={() => horrorAudio.playHover()}
            className="block flex-1"
            style={{ maxWidth: '200px', height: '100%' }}
          >
            <motion.div
              onMouseEnter={() => setHoveredCard('card5')}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative overflow-hidden rounded-lg h-full"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div 
                className="absolute inset-0 rounded-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(to bottom, rgba(10, 5, 5, 0.85) 0%, rgba(10, 5, 5, 0.95) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderBottom: hoveredCard === 'card5' ? '3px solid transparent' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderImage: hoveredCard === 'card5' ? 'linear-gradient(90deg, transparent, #dc2626, transparent) 1' : 'none',
                  boxShadow: hoveredCard === 'card5' 
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 40px rgba(220, 38, 38, 0.6), 0 -3px 20px rgba(220, 38, 38, 0.4) inset'
                    : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 40px rgba(0, 0, 0, 0.8)',
                }}
              />
              
              {/* Cracked Glass Texture Overlay */}
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none opacity-20"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
                    repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)
                  `,
                  mixBlendMode: 'overlay',
                }}
              />
              
              <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-10 text-zinc-400 pointer-events-none group-hover:text-red-400 group-hover:opacity-15 transition-all duration-300">
                <Scroll className="w-32 h-32" strokeWidth={2.5} />
              </div>
            
            <div className="relative z-10 px-4 py-6 flex flex-col items-center text-center h-full justify-end">
              <WatcherIcon 
                icon={Scroll}
                className="w-12 h-12 mb-4 transition-all duration-300"
                strokeWidth={2.5}
                style={{
                  color: '#e0e0e0',
                  opacity: hoveredCard === 'card5' ? 1 : 0.8,
                  filter: 'drop-shadow(0 2px 4px black)',
                }}
              />
              
              <h2 
                className="text-sm font-bold tracking-widest uppercase mb-2 text-zinc-300 group-hover:text-white transition-colors duration-300"
                style={{ 
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: '0.15em'
                }}
              >
                MANIFESTO
              </h2>
              
              <p 
                className="text-zinc-400 text-xs font-medium leading-relaxed drop-shadow-md"
                style={{ 
                  fontFamily: "'Cinzel', serif"
                }}
              >
                The philosophy of permanence.
              </p>
            </div>
            
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
                style={{
                  boxShadow: '0 0 40px rgba(220, 38, 38, 0.4)'
                }}
              />
            </motion.div>
          </Link>
          </div>
        </div>

        {/* Footer - Absolute positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-6">
          <div className="flex items-center justify-center gap-8 text-zinc-500 text-xs" style={{ fontFamily: "'Cinzel', serif" }}>
            <span className="tracking-wider">© 2025 EPITAPH</span>
            <span className="text-zinc-700">•</span>
            <span className="tracking-wider hover:text-zinc-400 transition-colors cursor-default">WORDS CARVED IN STONE</span>
            <span className="text-zinc-700">•</span>
            <span className="tracking-wider hover:text-zinc-400 transition-colors cursor-default">v1.0.0</span>
          </div>
        </div>

      </div>
    </>
  );
}
