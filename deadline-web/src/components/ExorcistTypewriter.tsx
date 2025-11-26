import { useEffect, useRef } from 'react';
import { useExorcismGame } from '@/hooks/useExorcismGame';
import { useAudio } from '@/hooks/useAudio';
import { ScreenCorruption } from '@/components/ScreenCorruption';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

export function ExorcistTypewriter() {
  const {
    gameState,
    playerSanity,
    score,
    wave,
    activeEntity,
    startGame,
    handleTyping,
  } = useExorcismGame();

  const { playAtmosphere, setAtmosphereVolume, stopAtmosphere } = useAudio('SAFE', 0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when playing
  useEffect(() => {
    if (gameState === 'PLAYING' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Thinning Veil - Start/Stop atmosphere sounds based on game state
  useEffect(() => {
    if (gameState === 'PLAYING') {
      playAtmosphere('BREATHING');
      playAtmosphere('WHISPERS');
    } else {
      stopAtmosphere('BREATHING');
      stopAtmosphere('WHISPERS');
    }

    return () => {
      stopAtmosphere('BREATHING');
      stopAtmosphere('WHISPERS');
    };
  }, [gameState, playAtmosphere, stopAtmosphere]);

  // Thinning Veil - Dynamic volume based on entity proximity
  useEffect(() => {
    if (activeEntity && gameState === 'PLAYING') {
      // Calculate volume based on position (0-100)
      const volume = activeEntity.position / 100;
      
      // Breathing builds up gradually
      setAtmosphereVolume('BREATHING', volume);
      
      // Whispers only start at 50% and ramp up quickly for intensity
      const whispersVolume = Math.max(0, (volume - 0.5) * 2);
      setAtmosphereVolume('WHISPERS', whispersVolume);
    }
  }, [activeEntity, gameState, setAtmosphereVolume]);

  // Get ghost image source based on position
  const getGhostImageSrc = (position: number): string => {
    if (position < 30) return '/assets/ghosts/ghost-far.png';
    if (position < 70) return '/assets/ghosts/ghost-medium.png';
    return '/assets/ghosts/ghost-close.png';
  };

  // Calculate scale based on position for smooth zoom effect
  const getGhostScale = (position: number): number => {
    return 0.5 + (position / 100) * 2; // Scale from 0.5 to 2.5
  };

  // Handle keyboard input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'PLAYING') return;
    
    const char = e.key;
    if (char.length === 1 && char.match(/[a-zA-Z\s]/)) {
      handleTyping(char);
      // Clear input to prevent text accumulation
      e.currentTarget.value = '';
    }
  };

  // Calculate corruption intensity for Thinning Veil effect
  const intensity = activeEntity ? activeEntity.position / 100 : 0;

  return (
    <div 
      className={clsx(
        "h-screen w-full bg-[url('/bg-graveyard.jpg')] bg-cover bg-center bg-fixed relative overflow-hidden",
        intensity > 0.5 && intensity <= 0.8 && 'animate-shake-subtle',
        intensity > 0.8 && 'animate-shake-violent'
      )}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(0,0,0,0.6)_80%,rgba(0,0,0,0.9)_100%)]" />

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* HUD - Top Bar */}
        {gameState === 'PLAYING' && (
          <div className="flex-none p-6 flex items-center justify-between">
            {/* Sanity Bar */}
            <div className="flex-1 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <Icon icon="solar:heart-bold" className="size-6 text-red-500" />
                <span className="text-sm font-mono text-gray-300 uppercase tracking-wider">Sanity</span>
              </div>
              <div className="h-6 bg-black/50 border-2 border-red-900/50 rounded-lg overflow-hidden">
                <div
                  className={clsx(
                    'h-full transition-all duration-300',
                    playerSanity > 50 && 'bg-gradient-to-r from-green-500 to-lime-500',
                    playerSanity <= 50 && playerSanity > 25 && 'bg-gradient-to-r from-yellow-500 to-orange-500',
                    playerSanity <= 25 && 'bg-gradient-to-r from-red-500 to-red-700 animate-pulse'
                  )}
                  style={{ width: `${playerSanity}%` }}
                />
              </div>
            </div>

            {/* Score & Wave */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Score</div>
                <div className="text-3xl font-['Creepster'] text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)]">
                  {score}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Wave</div>
                <div className="text-3xl font-['Creepster'] text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
                  {wave}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Area */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* IDLE State */}
          {gameState === 'IDLE' && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-8xl font-['Creepster'] text-white drop-shadow-[0_5px_10px_rgba(0,0,0,1)] animate-pulse">
                  THE EXORCIST'S
                </h1>
                <h1 className="text-6xl md:text-8xl font-['Creepster'] text-orange-500 drop-shadow-[0_5px_10px_rgba(249,115,22,0.8)]">
                  TYPEWRITER
                </h1>
              </div>
              
              <p className="text-xl text-gray-300 font-['Playfair_Display'] italic max-w-2xl mx-auto px-6">
                Type the Latin incantations to banish the approaching spirits before they consume your sanity...
              </p>

              <button
                onClick={startGame}
                className="group relative px-12 py-6 bg-red-600 hover:bg-red-700 text-white text-2xl font-['Creepster'] rounded-2xl border-b-8 border-red-900 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.8)] transition-all hover:scale-105 active:scale-95 active:border-b-2 uppercase tracking-wider"
              >
                <span className="relative z-10">Start Exorcism</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
              </button>

              <div className="text-sm text-gray-500 font-mono">
                Press any key to begin typing when the game starts
              </div>
            </div>
          )}

          {/* PLAYING State */}
          {gameState === 'PLAYING' && activeEntity && (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Phrase Display */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center z-20">
                <div className="text-4xl md:text-6xl font-['Creepster'] tracking-wider mb-4">
                  {/* Typed portion - glowing orange */}
                  <span className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]">
                    {activeEntity.typedPhrase}
                  </span>
                  {/* Untyped portion - ghostly white */}
                  <span className="text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    {activeEntity.phrase.substring(activeEntity.typedPhrase.length)}
                  </span>
                </div>
                
                {/* Progress indicator */}
                <div className="w-64 h-2 bg-black/50 border border-white/20 rounded-full overflow-hidden mx-auto">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-100"
                    style={{ width: `${(activeEntity.typedPhrase.length / activeEntity.phrase.length) * 100}%` }}
                  />
                </div>
              </div>



              {/* Distance warning */}
              {activeEntity.position > 70 && (
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center animate-pulse">
                  <div className="text-2xl font-['Creepster'] text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
                    ⚠️ TOO CLOSE! ⚠️
                  </div>
                </div>
              )}

              {/* Hidden input for capturing keystrokes */}
              <input
                ref={inputRef}
                type="text"
                onKeyDown={handleKeyPress}
                className="absolute opacity-0 pointer-events-auto"
                autoFocus
                autoComplete="off"
              />
            </div>
          )}

          {/* GAME OVER State */}
          {gameState === 'GAME_OVER' && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="space-y-6">
                {/* Red Skull Icon */}
                <div className="flex justify-center mb-8">
                  <Icon 
                    icon="solar:skull-bold" 
                    className="w-32 h-32 text-red-600 animate-pulse" 
                    style={{ filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.8))' }}
                  />
                </div>
                
                <h1 className="text-7xl md:text-9xl font-['Creepster'] text-red-600 drop-shadow-[0_5px_10px_rgba(220,38,38,1)] animate-pulse">
                  POSSESSED
                </h1>
                <p className="text-2xl text-gray-300 font-['Playfair_Display'] italic">
                  Your sanity has been consumed...
                </p>
              </div>

              {/* Final Stats */}
              <div className="bg-black/50 border-2 border-red-900/50 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 font-mono uppercase mb-2">Final Score</div>
                    <div className="text-4xl font-['Creepster'] text-orange-500">{score}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-mono uppercase mb-2">Wave Reached</div>
                    <div className="text-4xl font-['Creepster'] text-purple-500">{wave}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={startGame}
                className="px-12 py-6 bg-red-600 hover:bg-red-700 text-white text-2xl font-['Creepster'] rounded-2xl border-b-8 border-red-900 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.8)] transition-all hover:scale-105 active:scale-95 active:border-b-2 uppercase tracking-wider"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Instructions Footer */}
        {gameState === 'PLAYING' && (
          <div className="flex-none p-4 text-center">
            <p className="text-sm text-gray-500 font-mono">
              Type the Latin phrases to banish the spirits • Mistakes cost sanity
            </p>
          </div>
        )}
      </div>

      {/* Thinning Veil - Screen Corruption Effect */}
      <ScreenCorruption intensity={intensity} />
    </div>
  );
}
