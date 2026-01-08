// Abstract shadow presence using pure CSS - terrifying and unstable
interface GhostSpriteProps {
  distance: 'far' | 'medium' | 'close' | 'jumpscare';
  isBoss?: boolean;
  isHit?: boolean;
  className?: string;
}

export function GhostSprite({ distance, isBoss = false, isHit = false, className = '' }: GhostSpriteProps) {
  const getSize = () => {
    const sizes = {
      far: { width: 100, height: 150 },
      medium: { width: 150, height: 225 },
      close: { width: 200, height: 300 },
      jumpscare: { width: 250, height: 375 },
    };

    const base = sizes[distance];
    
    // Bosses are 50% larger
    if (isBoss) {
      return {
        width: base.width * 1.5,
        height: base.height * 1.5,
      };
    }

    return base;
  };

  const getOpacity = () => {
    switch (distance) {
      case 'far':
        return 0.4;
      case 'medium':
        return 0.6;
      case 'close':
        return 0.8;
      case 'jumpscare':
        return 1;
    }
  };

  const size = getSize();
  const opacity = getOpacity();
  const isClose = distance === 'close' || distance === 'jumpscare';
  
  // Boss gets darker, more intense colors
  const shadowColor = isBoss ? 'rgba(139, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)';
  const insetColor = isBoss ? '#1a0000' : '#1a0033';
  const eyeColor = isBoss ? '#ff0000' : '#ff3333';

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: `${size.width}px`, 
        height: `${size.height}px`,
        opacity 
      }}
    >
      {/* Boss crown indicator */}
      {isBoss && (
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2 z-20"
          style={{
            width: '60px',
            height: '30px',
          }}
        >
          <svg viewBox="0 0 60 30" className="w-full h-full">
            <polygon
              points="10,25 15,5 20,25 30,0 40,25 45,5 50,25"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="2"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
              }}
            />
          </svg>
        </div>
      )}

      {/* The Shadow Presence - amorphous shadow monster with enhanced contrast */}
      <div
        className={`absolute inset-0 ghost-entity ${isHit ? 'hit' : ''}`}
        style={{
          background: isBoss 
            ? 'radial-gradient(circle at center, rgba(40, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)'
            : 'radial-gradient(circle at center, rgba(20, 0, 20, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%)',
          borderRadius: '50% 50% 50% 50%',
          boxShadow: `
            inset 0 0 50px #000,
            0 0 60px rgba(0, 0, 0, 0.95),
            0 0 80px rgba(0, 0, 0, 0.8),
            0 0 100px ${isBoss ? 'rgba(139, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.6)'}
          `,
          filter: isHit 
            ? 'brightness(2) drop-shadow(0 0 20px red) blur(20px)' 
            : `blur(20px) contrast(1.2) brightness(${isBoss ? '0.7' : '0.6'})`,
          animation: `
            morph ${isBoss ? '4s' : '6s'} ease-in-out infinite,
            ${isClose ? 'glitchShake 0.3s ease-in-out infinite' : ''}
          `,
          transform: isHit ? 'scale(0.9)' : isClose ? 'scale(1.1)' : 'scale(1)',
          transition: isHit ? 'all 0.1s' : 'transform 0.3s ease-out',
        }}
      />

      {/* Additional shadow layers for depth when close */}
      {isClose && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'transparent',
              borderRadius: '50% 50% 50% 50%',
              boxShadow: 'inset 0 0 40px #000, 0 0 50px rgba(0, 0, 0, 0.8)',
              opacity: 0.6,
              transform: 'translate(-3px, -3px)',
              filter: 'blur(18px)',
              animation: 'morph 5s ease-in-out infinite',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'transparent',
              borderRadius: '50% 50% 50% 50%',
              boxShadow: 'inset 0 0 40px #000, 0 0 50px rgba(0, 0, 0, 0.8)',
              opacity: 0.6,
              transform: 'translate(3px, 3px)',
              filter: 'blur(18px)',
              animation: 'morph 5s ease-in-out infinite reverse',
            }}
          />
        </>
      )}

      {/* Glowing red eyes with enhanced visibility */}
      <div
        className="absolute top-1/3 left-1/3 rounded-full z-30"
        style={{
          width: isBoss ? '16px' : '12px',
          height: isBoss ? '16px' : '12px',
          background: eyeColor,
          boxShadow: `
            0 0 ${isBoss ? '30px' : '20px'} ${eyeColor},
            0 0 ${isBoss ? '60px' : '40px'} ${eyeColor},
            0 0 ${isBoss ? '90px' : '60px'} rgba(255, 0, 0, 0.4)
          `,
          animation: `eyeBlink ${isBoss ? '3s' : '4s'} ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
          transition: 'opacity 0.1s ease-out',
          filter: 'brightness(1.5) contrast(1.3)',
        }}
      />
      <div
        className="absolute top-1/3 right-1/3 rounded-full z-30"
        style={{
          width: isBoss ? '16px' : '12px',
          height: isBoss ? '16px' : '12px',
          background: eyeColor,
          boxShadow: `
            0 0 ${isBoss ? '30px' : '20px'} ${eyeColor},
            0 0 ${isBoss ? '60px' : '40px'} ${eyeColor},
            0 0 ${isBoss ? '90px' : '60px'} rgba(255, 0, 0, 0.4)
          `,
          animation: `eyeBlink ${isBoss ? '3s' : '4s'} ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
          transition: 'opacity 0.1s ease-out',
          filter: 'brightness(1.5) contrast(1.3)',
        }}
      />

      {/* Boss particle effects */}
      {isBoss && (
        <>
          <div
            className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-600 rounded-full"
            style={{
              boxShadow: '0 0 15px rgba(220, 38, 38, 0.8)',
              animation: 'particlePulse 2s ease-in-out infinite',
            }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-600 rounded-full"
            style={{
              boxShadow: '0 0 15px rgba(220, 38, 38, 0.8)',
              animation: 'particlePulse 2s ease-in-out infinite',
              animationDelay: '0.5s',
            }}
          />
          <div
            className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-red-600 rounded-full"
            style={{
              boxShadow: '0 0 15px rgba(220, 38, 38, 0.8)',
              animation: 'particlePulse 2s ease-in-out infinite',
              animationDelay: '1s',
            }}
          />
        </>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes morph {
          0% {
            border-radius: 50% 50% 50% 50%;
            transform: translate(0, 0);
          }
          33% {
            border-radius: 60% 40% 30% 70%;
            transform: translate(-10px, 10px);
          }
          66% {
            border-radius: 40% 60% 70% 30%;
            transform: translate(10px, -10px);
          }
          100% {
            border-radius: 50% 50% 50% 50%;
            transform: translate(0, 0);
          }
        }

        @keyframes glitchShake {
          0%, 100% {
            transform: translate(0, 0) scale(1.1);
          }
          10% {
            transform: translate(-2px, 1px) scale(1.1);
          }
          20% {
            transform: translate(2px, -1px) scale(1.1);
          }
          30% {
            transform: translate(-1px, 2px) scale(1.1);
          }
          40% {
            transform: translate(1px, -2px) scale(1.1);
          }
          50% {
            transform: translate(-2px, -1px) scale(1.1);
          }
          60% {
            transform: translate(2px, 1px) scale(1.1);
          }
          70% {
            transform: translate(-1px, -2px) scale(1.1);
          }
          80% {
            transform: translate(1px, 2px) scale(1.1);
          }
          90% {
            transform: translate(-2px, -1px) scale(1.1);
          }
        }

        @keyframes eyeBlink {
          0%, 90%, 100% {
            opacity: 1;
          }
          92%, 96% {
            opacity: 0;
          }
          94%, 98% {
            opacity: 0.5;
          }
        }

        @keyframes particlePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
