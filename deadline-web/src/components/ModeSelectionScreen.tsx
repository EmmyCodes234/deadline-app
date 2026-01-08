import { useState, useRef, useEffect } from 'react';

interface ModeSelectionScreenProps {
  onSelectMode: (mode: 'HAUNTING' | 'GRIMOIRE') => void;
}

export function ModeSelectionScreen({ onSelectMode }: ModeSelectionScreenProps) {
  const [isHoldingHaunting, setIsHoldingHaunting] = useState(false);
  const [isHoldingGrimoire, setIsHoldingGrimoire] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const HOLD_DURATION = 3000; // 3 seconds

  const startHold = (mode: 'HAUNTING' | 'GRIMOIRE') => {
    if (mode === 'HAUNTING') {
      setIsHoldingHaunting(true);
    } else {
      setIsHoldingGrimoire(true);
    }
    
    holdStartTimeRef.current = Date.now();
    setHoldProgress(0);

    // Animate progress
    const animate = () => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);

      if (progress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Ritual complete!
        onSelectMode(mode);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const cancelHold = () => {
    setIsHoldingHaunting(false);
    setIsHoldingGrimoire(false);
    setHoldProgress(0);
    
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelHold();
    };
  }, []);

  const circumference = 2 * Math.PI * 45; // radius = 45%

  return (
    <div className="h-screen w-full bg-[url('/bg-graveyard.jpg')] bg-cover bg-center bg-no-repeat relative overflow-hidden">
      {/* Dark overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Title */}
        <h1 
          className="text-5xl md:text-7xl text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] mb-16"
          style={{ fontFamily: 'Creepster, cursive' }}
        >
          CHOOSE YOUR PATH
        </h1>

        {/* Mode Selection Buttons */}
        <div className="space-y-6 w-full max-w-xl">
          {/* Haunting Mode - Timed, Chaotic - RITUAL OF BINDING */}
          <button
            onMouseDown={() => startHold('HAUNTING')}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={() => startHold('HAUNTING')}
            onTouchEnd={cancelHold}
            className={`group relative w-full bg-orange-500 hover:bg-orange-600 text-black text-2xl md:text-3xl px-8 py-6 rounded-2xl transition-all border-b-8 border-orange-900 shadow-[0_10px_40px_-10px_rgba(255,117,24,0.8)] overflow-hidden select-none ${
              isHoldingHaunting 
                ? 'scale-105' 
                : 'hover:scale-105 active:scale-95 animate-pulse'
            } ${holdProgress > 70 && isHoldingHaunting ? 'animate-shake' : ''}`}
            style={{ fontFamily: 'Creepster, cursive' }}
          >
            {/* Glowing Progress Ring */}
            {isHoldingHaunting && (
              <>
                <div className="absolute inset-0 pointer-events-none z-10">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(0, 0, 0, 0.3)"
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.9)"
                      strokeWidth="3"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (holdProgress / 100) * circumference}
                      strokeLinecap="round"
                      className="transition-all duration-100"
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
                      }}
                    />
                  </svg>
                </div>
                {/* Pulsing glow effect */}
                <div 
                  className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none"
                  style={{
                    opacity: holdProgress / 200,
                  }}
                />
              </>
            )}
            
            <div className="flex flex-col items-center gap-2 relative z-20">
              <span className="text-3xl md:text-4xl">⚡ ENTER THE HAUNTING</span>
              <span className="text-sm md:text-base font-sans font-normal opacity-80">
                {isHoldingHaunting ? 'Hold to seal the pact...' : 'Timed Mode • Words Carved in Stone'}
              </span>
            </div>
          </button>

          {/* Grimoire Mode - Manuscript, Calm - RITUAL OF BINDING */}
          <button
            onMouseDown={() => startHold('GRIMOIRE')}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={() => startHold('GRIMOIRE')}
            onTouchEnd={cancelHold}
            className={`group relative w-full bg-stone-800 hover:bg-stone-700 text-stone-100 text-2xl md:text-3xl px-8 py-6 rounded-2xl transition-all border-2 border-stone-600 border-b-8 border-b-stone-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] grimoire-texture overflow-hidden select-none ${
              isHoldingGrimoire 
                ? 'scale-105' 
                : 'hover:scale-105 active:scale-95'
            } ${holdProgress > 70 && isHoldingGrimoire ? 'animate-shake' : ''}`}
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {/* Glowing Progress Ring */}
            {isHoldingGrimoire && (
              <>
                <div className="absolute inset-0 pointer-events-none z-10">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(0, 0, 0, 0.3)"
                      strokeWidth="3"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.9)"
                      strokeWidth="3"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (holdProgress / 100) * circumference}
                      strokeLinecap="round"
                      className="transition-all duration-100"
                      style={{
                        filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.8))',
                      }}
                    />
                  </svg>
                </div>
                {/* Pulsing glow effect */}
                <div 
                  className="absolute inset-0 bg-purple-500/20 animate-pulse pointer-events-none"
                  style={{
                    opacity: holdProgress / 200,
                  }}
                />
              </>
            )}
            
            <div className="flex flex-col items-center gap-2 relative z-20">
              <span className="text-3xl md:text-4xl">📖 OPEN THE GRIMOIRE</span>
              <span className="text-sm md:text-base font-sans font-normal opacity-70">
                {isHoldingGrimoire ? 'Hold to unlock the tome...' : 'Manuscript Mode • Timeless Writing'}
              </span>
            </div>
          </button>
        </div>

        {/* Subtitle */}
        <p className="mt-12 text-lg md:text-xl text-gray-400 max-w-2xl">
          <span className="inline-block bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm">
            {isHoldingHaunting || isHoldingGrimoire 
              ? '🔮 Performing the ritual...' 
              : 'Two paths. One destination. Choose wisely.'}
          </span>
        </p>
      </div>
    </div>
  );
}
