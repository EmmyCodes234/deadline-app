interface SummoningLoaderProps {
  size?: number;
  message?: string;
}

export function SummoningLoader({ size = 80, message }: SummoningLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated Rune/Sigil */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow ring */}
        <div 
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        
        {/* SVG Pentagram Rune */}
        <svg
          viewBox="0 0 100 100"
          className="animate-summoning-rotate"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.8))',
          }}
        >
          {/* Outer Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#purpleGradient)"
            strokeWidth="2"
            className="animate-draw-circle"
            style={{
              strokeDasharray: 283,
              strokeDashoffset: 283,
            }}
          />
          
          {/* Pentagram Star */}
          <path
            d="M 50 10 L 61 43 L 95 43 L 68 61 L 79 95 L 50 73 L 21 95 L 32 61 L 5 43 L 39 43 Z"
            fill="none"
            stroke="url(#purpleGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-pentagram"
            style={{
              strokeDasharray: 400,
              strokeDashoffset: 400,
            }}
          />
          
          {/* Inner Circle */}
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="url(#purpleGradient)"
            strokeWidth="1.5"
            className="animate-draw-circle-delayed"
            style={{
              strokeDasharray: 126,
              strokeDashoffset: 126,
            }}
          />
          
          {/* Mystical Dots at Star Points */}
          <circle cx="50" cy="10" r="2" fill="#a855f7" className="animate-pulse-glow" />
          <circle cx="95" cy="43" r="2" fill="#a855f7" className="animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
          <circle cx="79" cy="95" r="2" fill="#a855f7" className="animate-pulse-glow" style={{ animationDelay: '0.4s' }} />
          <circle cx="21" cy="95" r="2" fill="#a855f7" className="animate-pulse-glow" style={{ animationDelay: '0.6s' }} />
          <circle cx="5" cy="43" r="2" fill="#a855f7" className="animate-pulse-glow" style={{ animationDelay: '0.8s' }} />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6a0dad" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Optional Loading Message */}
      {message && (
        <p className="text-purple-400 text-sm font-['Crimson_Text'] italic animate-pulse">
          {message}
        </p>
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes summoning-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-summoning-rotate {
          animation: summoning-rotate 8s linear infinite;
        }
        
        @keyframes draw-circle {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-draw-circle {
          animation: draw-circle 2s ease-out forwards;
        }
        
        .animate-draw-circle-delayed {
          animation: draw-circle 2s ease-out 0.5s forwards;
        }
        
        @keyframes draw-pentagram {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        .animate-draw-pentagram {
          animation: draw-pentagram 3s ease-out forwards;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
