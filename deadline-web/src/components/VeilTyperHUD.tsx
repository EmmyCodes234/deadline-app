interface VeilTyperHUDProps {
  score: number;
  timeLeft: number;
  typedBuffer: string;
  comboStreak: number;
  mana: number;
  multiplier: number;
}

export function VeilTyperHUD({
  score,
  timeLeft,
  typedBuffer,
  comboStreak,
  mana,
  multiplier,
}: VeilTyperHUDProps) {
  const manaPercentage = (mana / 100) * 100;
  const timePercentage = (timeLeft / 60) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Left - Score & Combo */}
      <div className="absolute top-6 left-6 space-y-2">
        <div className="text-4xl font-bold text-white font-mono tracking-wider">
          {score.toLocaleString()}
        </div>
        {multiplier > 1 && (
          <div 
            className="text-2xl font-bold animate-pulse"
            style={{
              color: multiplier > 5 ? '#60a5fa' : '#fbbf24',
              textShadow: `0 0 20px ${multiplier > 5 ? '#60a5fa' : '#fbbf24'}`,
            }}
          >
            {multiplier}x COMBO
          </div>
        )}
        {comboStreak > 0 && (
          <div className="text-sm text-purple-400 font-mono">
            🔥 {comboStreak} streak
          </div>
        )}
      </div>

      {/* Top Center - Timer Bar (THIN) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <div className="text-center mb-2">
          <div className="text-2xl font-bold text-red-500 font-mono">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        {/* Bleeding Hourglass Bar - THIN */}
        <div className="w-96 h-2 bg-black/80 border border-red-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000"
            style={{
              width: `${timePercentage}%`,
              boxShadow: '0 0 10px rgba(220, 38, 38, 0.8)',
            }}
          />
        </div>
      </div>

      {/* Bottom Center - Typed Buffer & Mana */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center space-y-4">
        {/* Typed Buffer - NO BORDER, SUBTITLE STYLE */}
        <div className="min-w-[600px]">
          <div 
            className="text-6xl font-serif text-white tracking-wider"
            style={{
              textShadow: '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {typedBuffer || '\u00A0'}
            {typedBuffer && <span className="animate-pulse">|</span>}
          </div>
        </div>

        {/* Mana Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-purple-400 font-mono uppercase">Mana</span>
            <div className="w-64 h-6 bg-black/80 border-2 border-purple-500 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300"
                style={{
                  width: `${manaPercentage}%`,
                  boxShadow: mana >= 100 ? '0 0 20px rgba(168, 85, 247, 1)' : 'none',
                }}
              />
            </div>
            <span className="text-sm text-purple-400 font-mono">{mana}%</span>
          </div>

          {/* Ultimate Ready */}
          {mana >= 100 && (
            <div 
              className="text-xl font-bold text-white animate-pulse"
              style={{
                textShadow: '0 0 20px #a855f7',
              }}
            >
              ⚡ ULTIMATE READY: TYPE [EXORCISE] ⚡
            </div>
          )}
        </div>
      </div>

      {/* Vignette overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
        }}
      />
    </div>
  );
}
