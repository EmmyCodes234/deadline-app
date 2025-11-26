// Placeholder ghost sprites using SVG until PixelLab assets are generated
interface GhostSpriteProps {
  distance: 'far' | 'medium' | 'close' | 'jumpscare';
  className?: string;
}

export function GhostSprite({ distance, className = '' }: GhostSpriteProps) {
  const getSize = () => {
    switch (distance) {
      case 'far': return 'w-16 h-16';
      case 'medium': return 'w-32 h-32';
      case 'close': return 'w-48 h-48';
      case 'jumpscare': return 'w-64 h-64';
    }
  };

  const getOpacity = () => {
    switch (distance) {
      case 'far': return 'opacity-40';
      case 'medium': return 'opacity-60';
      case 'close': return 'opacity-80';
      case 'jumpscare': return 'opacity-100';
    }
  };

  const getAnimation = () => {
    switch (distance) {
      case 'far': return '';
      case 'medium': return 'animate-pulse';
      case 'close': return 'animate-pulse';
      case 'jumpscare': return 'animate-shake';
    }
  };

  return (
    <div className={`${getSize()} ${getOpacity()} ${getAnimation()} ${className} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
        {/* Ghost body */}
        <ellipse cx="50" cy="60" rx="35" ry="40" fill="rgba(255, 255, 255, 0.9)" />
        
        {/* Ghost head */}
        <circle cx="50" cy="35" r="25" fill="rgba(255, 255, 255, 0.9)" />
        
        {/* Eyes - glowing red */}
        <circle cx="42" cy="32" r="4" fill="#ff0000" className="animate-pulse">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="58" cy="32" r="4" fill="#ff0000" className="animate-pulse">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        
        {/* Mouth - open scream for close/jumpscare */}
        {(distance === 'close' || distance === 'jumpscare') ? (
          <ellipse cx="50" cy="45" rx="8" ry="12" fill="#000000" />
        ) : (
          <path d="M 42 42 Q 50 48 58 42" stroke="#000000" strokeWidth="2" fill="none" />
        )}
        
        {/* Wavy bottom */}
        <path 
          d="M 15 75 Q 20 85 25 75 Q 30 65 35 75 Q 40 85 45 75 Q 50 65 55 75 Q 60 85 65 75 Q 70 65 75 75 Q 80 85 85 75 L 85 100 L 15 100 Z" 
          fill="rgba(255, 255, 255, 0.9)" 
        />
        
        {/* Ethereal glow effect */}
        <circle cx="50" cy="50" r="45" fill="url(#ghostGlow)" opacity="0.3" />
        
        <defs>
          <radialGradient id="ghostGlow">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Additional glow for jumpscare */}
      {distance === 'jumpscare' && (
        <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
      )}
    </div>
  );
}
