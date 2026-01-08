import { useEffect, useState } from 'react';
import { getMoonPhase, type MoonPhaseData } from '@/utils/moonPhase';

export function MoonPhaseDisplay() {
  const [moonData, setMoonData] = useState<MoonPhaseData>(getMoonPhase());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Update moon phase once per hour (it changes slowly)
    const updateMoonPhase = () => {
      setMoonData(getMoonPhase());
    };

    const interval = setInterval(updateMoonPhase, 1000 * 60 * 60); // Every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 select-none group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Moon Icon - Always visible */}
      <div 
        className="text-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-300 cursor-help"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.2))' }}
      >
        {moonData.icon}
      </div>
      
      {/* Tooltip - Only on hover */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none">
          <div className="bg-zinc-950/95 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap">
            <div className="text-zinc-300 text-xs font-medium tracking-wider">
              {moonData.name}
            </div>
            <div className="text-zinc-500 text-xs italic mt-0.5">
              {moonData.flavorText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
