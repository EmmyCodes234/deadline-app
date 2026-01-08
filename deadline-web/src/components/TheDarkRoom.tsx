import { useDarkRoomEngine } from '@/hooks/useDarkRoomEngine';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export function TheDarkRoom() {
  const {
    gameState,
    words,
    mousePos,
    typedBuffer,
    battery,
    sanity,
    foundCount,
    targetCount,
    theme,
    startGame,
    mouseVelocity,
    flashlightRadius,
    flashlightOpacity,
    sonarRipples,
    magneticTarget,
  } = useDarkRoomEngine(5, 'DEATH');

  // HUD corruption based on battery
  const hudBlur = battery < 30 ? `blur(${(30 - battery) / 30}px)` : 'none';
  const hudOpacity = battery < 30 ? 0.5 + (battery / 60) : 1;

  return (
    <div className="flex h-screen w-full bg-black">
      {/* The Sidebar - The Manifest (Always Visible) */}
      {gameState === 'playing' && (
        <div 
          className="w-80 h-full bg-zinc-900 border-r border-zinc-800 p-6 overflow-y-auto z-50 flex-shrink-0 transition-all duration-300"
          style={{
            filter: hudBlur,
            opacity: hudOpacity,
          }}
        >
          <h2 className="text-xl font-['Playfair_Display'] text-zinc-400 mb-6 uppercase tracking-wider">
            The Manifest
          </h2>

          {/* Theme */}
          <div className="mb-8">
            <p className="text-sm text-zinc-500 mb-2">Find words related to:</p>
            <p className="text-2xl font-bold text-red-500 uppercase tracking-wider">
              {theme}
            </p>
          </div>

          {/* Target Slots */}
          <div className="mb-8">
            <p className="text-sm text-zinc-500 mb-3">Targets ({foundCount}/{targetCount}):</p>
            <div className="space-y-2">
              {words
                .filter(w => w.type === 'target')
                .map(word => (
                  <div
                    key={word.id}
                    className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded font-mono"
                  >
                    {word.isFound ? (
                      <span className="text-amber-500">{word.text}</span>
                    ) : (
                      <span className="text-zinc-700">[ ? ? ? ]</span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Battery */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-500">BATTERY</span>
              <span className="text-sm text-zinc-400 font-mono">{Math.round(battery)}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
                style={{
                  width: `${battery}%`,
                  boxShadow: battery < 30 ? '0 0 10px rgba(251, 191, 36, 0.6)' : 'none',
                }}
              />
            </div>
          </div>

          {/* Mental Fracture */}
          <div className="mb-6">
            <p className="text-sm text-zinc-500 mb-2 uppercase tracking-wider">Mental Fracture</p>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 relative transition-all duration-300 ${
                    i < sanity
                      ? 'animate-pulse'
                      : ''
                  }`}
                  style={{
                    background: i < sanity 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(220,38,38,0.3) 100%)'
                      : 'rgba(24, 24, 27, 0.8)',
                    boxShadow: i < sanity 
                      ? '0 0 10px rgba(220, 38, 38, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.1)'
                      : 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* Cracked glass effect */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      opacity: i < sanity ? 0.4 : 0.8,
                      background: `
                        linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 47%, transparent 47%, transparent 53%, rgba(255,255,255,0.1) 53%, rgba(255,255,255,0.1) 55%, transparent 55%),
                        linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.08) 47%, transparent 47%, transparent 53%, rgba(255,255,255,0.08) 53%, rgba(255,255,255,0.08) 55%, transparent 55%)
                      `,
                      backgroundSize: '6px 6px',
                      mixBlendMode: 'overlay',
                    }}
                  />
                  {/* Red glow for active */}
                  {i < sanity && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.4) 0%, transparent 70%)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Typed Buffer */}
          <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded">
            <p className="text-xs text-zinc-600 mb-2">TYPING:</p>
            <p className="text-xl font-mono text-white tracking-wider">
              {typedBuffer || <span className="text-zinc-700">...</span>}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          {/* Stabilization Indicator */}
          {words.some(w => w.isUnstable || w.isLocked) && (
            <div className="mt-8 p-4 bg-red-950/30 border border-red-900/50 rounded">
              <p className="text-xs text-red-400 uppercase mb-2">
                {words.some(w => w.isLocked) ? '🔒 LOCKED - Type Now!' : '⚠️ Stabilizing...'}
              </p>
              {words.filter(w => w.isUnstable).map(w => (
                <div key={w.id} className="mt-2">
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 transition-all duration-100"
                      style={{ width: `${(w.hoverDuration / 300) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded">
            <p className="text-xs text-zinc-600 uppercase mb-2">How to Play:</p>
            <ul className="text-xs text-zinc-500 space-y-1">
              <li>• Move slowly to keep light steady</li>
              <li>• Hold cursor on word to lock it</li>
              <li>• Type locked words to capture</li>
              <li>• Click to send sonar ping (-5% battery)</li>
              <li>• Geiger clicks warn of traps</li>
            </ul>
          </div>
        </div>
      )}

      {/* Game Board Wrapper */}
      <div 
        className="flex-1 relative overflow-hidden"
        style={{ cursor: gameState === 'playing' ? 'none' : 'default' }}
      >
        {/* The Flashlight Overlay */}
        {gameState === 'playing' && (
          <div
            className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-100"
            style={{
              background: `radial-gradient(circle ${flashlightRadius}px at ${mousePos.x}px ${mousePos.y}px, transparent 20%, rgba(0, 0, 0, 0.92) 100%)`,
              animation: 'breathe 3s ease-in-out infinite',
              opacity: flashlightOpacity,
            }}
          />
        )}

        {/* Sonar Ripples */}
        {gameState === 'playing' && sonarRipples.map(ripple => {
          const age = Date.now() - ripple.startTime;
          const progress = age / 200; // 200ms duration
          const radius = progress * 500; // Expands to 500px
          const opacity = 1 - progress;

          return (
            <div
              key={ripple.id}
              className="absolute pointer-events-none z-35"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: radius * 2,
                height: radius * 2,
                marginLeft: -radius,
                marginTop: -radius,
                border: '2px solid rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                opacity,
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
              }}
            />
          );
        })}

        {/* Shattered Glass Overlay (when sanity drops) */}
        {gameState === 'playing' && sanity < 3 && (
          <div className="absolute inset-0 pointer-events-none z-30">
            {Array.from({ length: 3 - sanity }).map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 animate-pulse"
                style={{
                  clipPath: `polygon(
                    ${20 + i * 30}% 0%, 
                    ${40 + i * 20}% 30%, 
                    ${60 + i * 15}% 20%, 
                    ${80 + i * 10}% 50%, 
                    ${70 + i * 5}% 80%, 
                    ${40 + i * 10}% 100%, 
                    ${10 + i * 15}% 70%, 
                    0% ${30 + i * 20}%
                  )`,
                  backdropFilter: 'blur(4px)',
                  background: 'rgba(255, 0, 0, 0.1)',
                }}
              />
            ))}
          </div>
        )}

        {/* The Words */}
        {gameState === 'playing' && words.map(word => {
          // Determine color based on state
          let color = '#71717a'; // Default dim
          let textShadow = 'none';
          let scale = 1;
          let fontWeight = 'bold';
          const isMagnetic = magneticTarget === word.id;
          
          if (word.isFound) {
            // Burn effect - charcoal branded
            color = '#18181b'; // zinc-900
            textShadow = '0 0 5px rgba(245, 158, 11, 0.5)';
            fontWeight = '900';
          } else if (word.isLocked) {
            // Locked and ready - bright red/white
            color = '#fef2f2'; // Almost white
            textShadow = '0 0 15px rgba(239, 68, 68, 1), 0 0 30px rgba(239, 68, 68, 0.5)';
            scale = 1.1;
          } else if (word.isUnstable) {
            // Unstable - dim red with jitter
            color = '#dc2626'; // red-600
            textShadow = '0 0 8px rgba(220, 38, 38, 0.6)';
          } else if (word.isHovered || isMagnetic) {
            // Hovered or magnetically locked
            color = '#ef4444'; // red-500
            textShadow = '0 0 10px red';
          } else if (word.sonarRevealed) {
            // Revealed by sonar
            color = '#a1a1aa'; // zinc-400
            textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
          }

          // Calculate opacity with phosphor decay
          let opacity = 0;
          if (word.isFound) {
            opacity = 0.3;
          } else if (word.isVisible) {
            opacity = 1;
          } else if (word.phosphorDecay > 0) {
            opacity = word.phosphorDecay * 0.6; // Fades to 60% then to 0
          }

          // Account for sidebar offset
          const SIDEBAR_WIDTH = 320;
          const gameAreaWidth = window.innerWidth - SIDEBAR_WIDTH;
          const wordX = (word.x / 100) * gameAreaWidth + SIDEBAR_WIDTH;
          const wordY = (word.y / 100) * window.innerHeight;

          return (
            <div key={word.id} className="absolute pointer-events-none">
              {/* Magnetic connection line */}
              {isMagnetic && !word.isFound && (
                <svg
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    left: 0,
                    top: 0,
                    width: '100vw',
                    height: '100vh',
                  }}
                >
                  <line
                    x1={mousePos.x}
                    y1={mousePos.y}
                    x2={wordX}
                    y2={wordY}
                    stroke="rgba(239, 68, 68, 0.3)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    style={{
                      filter: 'blur(1px)',
                    }}
                  />
                </svg>
              )}

              {/* Word with padding for larger hitbox */}
              <div
                className="absolute font-serif tracking-widest text-4xl p-12"
                style={{
                  left: `calc(${word.x}% + ${word.jitterX}px)`,
                  top: `calc(${word.y}% + ${word.jitterY}px)`,
                  opacity,
                  color,
                  fontWeight,
                  filter: word.isHovered || word.isLocked ? 'blur(0px)' : 'blur(2px)',
                  textShadow,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  transition: word.isUnstable 
                    ? 'none' 
                    : 'opacity 700ms ease-out, filter 500ms ease-out, color 200ms, transform 200ms',
                }}
              >
                {word.text}
              </div>
            </div>
          );
        })}

        {/* Start Screen */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-zinc-400 uppercase tracking-wider"
                style={{
                  textShadow: '0 0 30px rgba(161, 161, 170, 0.3)',
                }}
              >
                The Dark Room
              </h1>
              <p className="text-xl text-zinc-500 italic">
                A Horror Search & Type Puzzle
              </p>
            </div>

            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-8 space-y-4">
              <h2 className="text-2xl text-zinc-400 font-bold uppercase">Objective</h2>
              <p className="text-zinc-500 leading-relaxed">
                Use your flashlight to find specific words hidden in the darkness. 
                Type them correctly to mark them as found. But beware—typing the wrong 
                words will shatter your sanity. The geiger counter will warn you when 
                you're near a trap.
              </p>
            </div>

            <button
              onClick={startGame}
              className="px-12 py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-2xl font-bold uppercase rounded-lg transition-all transform hover:scale-105 border-2 border-zinc-700"
            >
              Enter the Darkness
            </button>

            <Link
              to="/hub"
              className="block text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <Icon icon="solar:arrow-left-bold" className="inline size-5 mr-2" />
              Back to Hub
            </Link>
          </div>
          </div>
        )}

        {/* Victory Screen */}
        {gameState === 'won' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-amber-500 uppercase tracking-wider animate-pulse"
                style={{
                  textShadow: '0 0 30px rgba(245, 158, 11, 0.8)',
                }}
              >
                Escaped
              </h1>
              <p className="text-xl text-amber-400 italic">
                You found all the words
              </p>
            </div>

            <div className="bg-zinc-900 border-2 border-amber-900 rounded-lg p-8 space-y-4">
              <div className="text-5xl font-bold text-white font-mono">
                {foundCount}/{targetCount}
              </div>
              <div className="text-amber-500 uppercase tracking-wider">
                Words Found
              </div>
              <div className="text-zinc-500">
                Battery Remaining: {Math.round(battery)}%
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Play Again
              </button>
              <Link
                to="/hub"
                className="px-8 py-3 bg-zinc-700 hover:bg-zinc-600 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Exit
              </Link>
            </div>
          </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'lost' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-red-500 uppercase tracking-wider animate-pulse"
                style={{
                  textShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
                }}
              >
                Lost
              </h1>
              <p className="text-xl text-red-400 italic">
                {battery === 0 ? 'Your light has died' : 'Your sanity has shattered'}
              </p>
            </div>

            <div className="bg-zinc-900 border-2 border-red-900 rounded-lg p-8 space-y-4">
              <div className="text-5xl font-bold text-white font-mono">
                {foundCount}/{targetCount}
              </div>
              <div className="text-red-500 uppercase tracking-wider">
                Words Found
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Try Again
              </button>
              <Link
                to="/hub"
                className="px-8 py-3 bg-zinc-700 hover:bg-zinc-600 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Exit
              </Link>
            </div>
          </div>
          </div>
        )}

        {/* CSS Animation for Breathing Flashlight */}
        <style>{`
          @keyframes breathe {
            0%, 100% {
              transform: scale(0.95);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
