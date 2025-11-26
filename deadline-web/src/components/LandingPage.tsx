import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Skull, Feather } from 'lucide-react';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [card1Tilt, setCard1Tilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [card2Tilt, setCard2Tilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [hoveredCard, setHoveredCard] = useState<'card1' | 'card2' | null>(null);
  const [isTryingToLeave, setIsTryingToLeave] = useState(false);
  const cooldownRef = useRef(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleCard1MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!card1Ref.current) return;
    const rect = card1Ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 15; // Max 15deg tilt
    const rotateX = ((centerY - y) / centerY) * 15;
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    setCard1Tilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleCard2MouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!card2Ref.current) return;
    const rect = card2Ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = ((centerY - y) / centerY) * 15;
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    setCard2Tilt({ rotateX, rotateY, glareX, glareY });
  };

  const resetCard1Tilt = () => {
    setCard1Tilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const resetCard2Tilt = () => {
    setCard2Tilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  useEffect(() => {
    // Ensure video plays on mount
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    }
    
    // Setup background music
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.5; // Set to 50% volume for background ambience
      
      // Try to play after user interaction
      const playAudio = () => {
        audio.play().catch(() => {
          // Autoplay blocked, will play on first user interaction
        });
      };
      
      // Attempt to play on any user interaction
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
    
    // Trigger fade-in animation
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

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
    <div 
      className="h-screen w-full relative overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/landing-mp3.mp3" type="audio/mpeg" />
      </audio>

      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="/bg-graveyard.jpg"
        style={{
          filter: 'brightness(0.5) contrast(1.1) saturate(0.95)'
        }}
      >
        <source src="/bg-graveyard-video.mp4" type="video/mp4" />
      </video>

      {/* Flashlight Darkness Layer - Reveals video underneath */}
      <div 
        className="absolute inset-0 bg-black z-5 pointer-events-none"
        style={{
          opacity: 0.85,
          maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, black 100%)`,
        }}
      />

      {/* Hidden Lore Messages - Only visible in darkness */}
      <div className="absolute inset-0 z-8 pointer-events-none">
        <span 
          className="absolute text-red-900/60 italic font-['Crimson_Text'] text-xl"
          style={{ 
            top: '15%', 
            left: '10%',
            opacity: Math.min(1, Math.hypot(mousePos.x - window.innerWidth * 0.1, mousePos.y - window.innerHeight * 0.15) / 300)
          }}
        >
          Don't stop writing...
        </span>
        <span 
          className="absolute text-red-900/60 italic font-['Crimson_Text'] text-2xl"
          style={{ 
            top: '25%', 
            right: '15%',
            opacity: Math.min(1, Math.hypot(mousePos.x - window.innerWidth * 0.85, mousePos.y - window.innerHeight * 0.25) / 300)
          }}
        >
          It sees you
        </span>
        <span 
          className="absolute text-red-900/60 italic font-['Crimson_Text'] text-lg"
          style={{ 
            bottom: '30%', 
            left: '8%',
            opacity: Math.min(1, Math.hypot(mousePos.x - window.innerWidth * 0.08, mousePos.y - window.innerHeight * 0.7) / 300)
          }}
        >
          Run
        </span>
        <span 
          className="absolute text-red-900/60 italic font-['Crimson_Text'] text-xl"
          style={{ 
            bottom: '20%', 
            right: '12%',
            opacity: Math.min(1, Math.hypot(mousePos.x - window.innerWidth * 0.88, mousePos.y - window.innerHeight * 0.8) / 300)
          }}
        >
          The deadline approaches
        </span>
        <span 
          className="absolute text-red-900/60 italic font-['Crimson_Text'] text-lg"
          style={{ 
            top: '40%', 
            left: '5%',
            opacity: Math.min(1, Math.hypot(mousePos.x - window.innerWidth * 0.05, mousePos.y - window.innerHeight * 0.4) / 300)
          }}
        >
          Your words are mine
        </span>
        <span 
          className="absolute text-red-900/60 italic font-['Crimson_Text'] text-2xl"
          style={{ 
            top: '60%', 
            right: '8%',
            opacity: Math.min(1, Math.hypot(mousePos.x - window.innerWidth * 0.92, mousePos.y - window.innerHeight * 0.6) / 300)
          }}
        >
          Write or die
        </span>
      </div>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/70 z-10" />

      {/* Content - Cinematic Layout */}
      <div className="relative z-30 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        
        {/* Main Title - Spectral Chrome Effect with Scare State */}
        <h1 
          className={`text-8xl md:text-9xl tracking-widest leading-none mb-12 text-center transition-all duration-100 opacity-100 ${
            isTryingToLeave 
              ? 'text-red-600 scale-110 translate-y-2' 
              : 'text-white'
          }`}
          style={{ 
            fontFamily: 'Creepster, cursive',
            filter: isTryingToLeave 
              ? 'drop-shadow(0 0 50px rgba(220, 38, 38, 1))' 
              : 'drop-shadow(0 4px 4px rgba(0, 0, 0, 0.8))'
          }}
        >
          DEADLINE
        </h1>

        {/* Red Vignette Flash */}
        <div 
          className={`fixed inset-0 bg-red-900/20 pointer-events-none transition-opacity duration-300 z-50 ${
            isTryingToLeave ? 'opacity-100' : 'opacity-0'
          }`} 
        />

        {/* Glass Cards - Side by Side */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center w-full max-w-4xl" style={{ perspective: '1000px' }}>
          
          {/* Card 1: The Haunting Ritual */}
          <motion.div
            ref={card1Ref}
            onMouseMove={handleCard1MouseMove}
            onMouseEnter={() => setHoveredCard('card1')}
            onMouseLeave={() => {
              resetCard1Tilt();
              setHoveredCard(null);
            }}
            animate={{
              rotateX: card1Tilt.rotateX,
              rotateY: card1Tilt.rotateY,
              scale: hoveredCard === 'card2' ? 0.95 : 1,
              opacity: hoveredCard === 'card2' ? 0.8 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative overflow-hidden rounded-lg flex-1 max-w-md ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
            }}
          >
            {/* Glass Background - Darker for better contrast */}
            <div className="absolute inset-0 bg-black/60 border border-white/10 rounded-lg" />
            
            {/* Glare Effect */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-lg transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${card1Tilt.glareX}% ${card1Tilt.glareY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                opacity: hoveredCard === 'card1' ? 1 : 0,
              }}
            />
            
            {/* Watermark Icon - Large decorative */}
            <div className="absolute -top-6 -right-6 opacity-5 text-zinc-500 rotate-12 pointer-events-none">
              <Skull className="w-48 h-48" strokeWidth={1.5} />
            </div>
            
            {/* Content - Left Aligned with z-index */}
            <div className="relative z-10 px-8 py-10 flex flex-col items-start text-left min-h-[320px]">
              <h2 
                className="text-2xl font-bold tracking-wider uppercase mb-4 text-white"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.1em'
                }}
              >
                THE HAUNTING RITUAL
              </h2>
              <p 
                className="text-zinc-400 mb-8 leading-relaxed flex-grow"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.95rem'
                }}
              >
                Face the Muse's wrath in a timed typing challenge. Every word counts. Every second matters. Write or perish.
              </p>
              
              {/* Action Button - Full width with red hover */}
              <button
                onClick={() => {
                  horrorAudio.startAmbience();
                  horrorAudio.playClick();
                  onEnter();
                }}
                onMouseEnter={() => horrorAudio.playHover()}
                className="w-full py-3 px-6 border border-white/20 bg-transparent text-white font-semibold tracking-wider transition-all duration-300 hover:bg-red-900 hover:border-red-900 rounded"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem'
                }}
              >
                ENTER
              </button>
            </div>
          </motion.div>

          {/* Card 2: Grimoire Editor */}
          <motion.div
            ref={card2Ref}
            onMouseMove={handleCard2MouseMove}
            onMouseEnter={() => setHoveredCard('card2')}
            onMouseLeave={() => {
              resetCard2Tilt();
              setHoveredCard(null);
            }}
            animate={{
              rotateX: card2Tilt.rotateX,
              rotateY: card2Tilt.rotateY,
              scale: hoveredCard === 'card1' ? 0.95 : 1,
              opacity: hoveredCard === 'card1' ? 0.8 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative overflow-hidden rounded-lg flex-1 max-w-md ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s',
            }}
          >
            {/* Glass Background - Darker for better contrast */}
            <div className="absolute inset-0 bg-black/60 border border-white/10 rounded-lg" />
            
            {/* Glare Effect */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-lg transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${card2Tilt.glareX}% ${card2Tilt.glareY}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                opacity: hoveredCard === 'card2' ? 1 : 0,
              }}
            />
            
            {/* Watermark Icon - Large decorative */}
            <div className="absolute -top-6 -right-6 opacity-5 text-zinc-500 rotate-12 pointer-events-none">
              <Feather className="w-48 h-48" strokeWidth={1.5} />
            </div>
            
            {/* Content - Left Aligned with z-index */}
            <div className="relative z-10 px-8 py-10 flex flex-col items-start text-left min-h-[320px]">
              <h2 
                className="text-2xl font-bold tracking-wider uppercase mb-4 text-white"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.1em'
                }}
              >
                GRIMOIRE EDITOR
              </h2>
              <p 
                className="text-zinc-400 mb-8 leading-relaxed flex-grow"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.95rem'
                }}
              >
                Inscribe your dark tales in a distraction-free gothic sanctuary. A minimalist editor for the macabre mind.
              </p>
              
              {/* Action Button - Full width with red hover */}
              <button
                onClick={() => {
                  horrorAudio.startAmbience();
                  horrorAudio.playClick();
                  onEnter();
                }}
                onMouseEnter={() => horrorAudio.playHover()}
                className="w-full py-3 px-6 border border-white/20 bg-transparent text-white font-semibold tracking-wider transition-all duration-300 hover:bg-red-900 hover:border-red-900 rounded"
                style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem'
                }}
              >
                ENTER
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
