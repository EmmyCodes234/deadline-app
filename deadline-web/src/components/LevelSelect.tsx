import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_LEVELS, type GamePart } from '../data/gameLevels';
import { useGameProgress } from '../hooks/useGameProgress';
import { Skull, Lock, Play, X, Check, Medal, RotateCcw } from 'lucide-react';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

interface LevelSelectProps {
  onStartPart: (part: GamePart, levelId: number) => void;
}

// Convert number to Roman numerals
const toRoman = (num: number): string => {
  const romanNumerals: [number, string][] = [
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let result = '';
  for (const [value, numeral] of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
};

export function LevelSelect({ onStartPart }: LevelSelectProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const { isLevelUnlocked, getSkullsForLevel, getSkullsForPart } = useGameProgress();

  const selectedLevel = GAME_LEVELS.find((level) => level.id === selectedLevelId);

  // Group levels by act
  const acts = Array.from(new Set(GAME_LEVELS.map((level) => level.act)));

  return (
    <div className="min-h-screen bg-[url('/bg-graveyard.jpg')] bg-cover bg-center bg-fixed relative flex justify-center pt-20 pb-10 px-4">
      {/* Dark overlay with granite texture */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundColor: '#1a1a1a',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.15\'/%3E%3C/svg%3E")'
        }}
      />
      
      {/* Enhanced Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_20%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.95)_100%)]" />

      <div className="max-w-6xl w-full z-10 relative">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-7xl md:text-9xl tracking-widest mb-3 relative inline-block"
            style={{
              fontFamily: 'Creepster, cursive',
              color: '#e8e8e3',
              textShadow: '0 4px 10px black'
            }}
          >
            THE PATH OF THE DAMNED
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg uppercase"
            style={{
              fontFamily: 'IM Fell English, serif',
              color: '#e8e8e3',
              letterSpacing: '0.2em',
              textShadow: '0 4px 10px black'
            }}
          >
            Choose your descent into darkness...
          </motion.p>
        </motion.header>

        {/* Acts Container */}
        <div className="space-y-16 relative">
          {acts.map((act, actIndex) => {
            const actLevels = GAME_LEVELS.filter((level) => level.act === act);
            
            return (
              <motion.section 
                key={act} 
                className={`relative ${actIndex > 0 ? 'mt-24' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: actIndex * 0.1 }}
              >
                {/* Act Header with Divider Line */}
                <div className="flex items-center gap-4 mb-6">
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: actIndex * 0.1 + 0.2 }}
                    className="text-2xl"
                    style={{
                      fontFamily: 'IM Fell English, serif',
                      color: '#e8e8e3',
                      letterSpacing: '0.2em',
                      textShadow: '0 4px 10px black'
                    }}
                  >
                    {act}
                  </motion.h2>
                  <div className="h-px bg-gradient-to-r from-zinc-800 to-transparent flex-grow" />
                </div>

                {/* Level Cards Grid with Connecting Lines */}
                <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {/* SVG Connecting Lines - Thread of Fate */}
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none" 
                    style={{ zIndex: 0 }}
                  >
                    {actLevels.map((level, index) => {
                      if (index === actLevels.length - 1) return null;
                      
                      const nextLevel = actLevels[index + 1];
                      const currentUnlocked = isLevelUnlocked(level.id);
                      const nextUnlocked = isLevelUnlocked(nextLevel.id);
                      const currentSkulls = getSkullsForLevel(level.id);
                      const currentMaxSkulls = level.parts.length * 3;
                      const isCurrentCompleted = currentSkulls === currentMaxSkulls && currentMaxSkulls > 0;
                      
                      // Calculate positions (approximate center of each card)
                      const cols = window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 4 : 2;
                      const currentCol = index % cols;
                      const currentRow = Math.floor(index / cols);
                      const nextCol = (index + 1) % cols;
                      const nextRow = Math.floor((index + 1) / cols);
                      
                      const cardWidth = 100 / cols;
                      const x1 = `${(currentCol + 0.5) * cardWidth}%`;
                      const y1 = `${(currentRow + 0.7) * 100}px`;
                      const x2 = `${(nextCol + 0.5) * cardWidth}%`;
                      const y2 = `${(nextRow + 0.3) * 100}px`;
                      
                      // Determine line color based on completion
                      const lineColor = isCurrentCompleted 
                        ? 'rgba(245, 158, 11, 0.8)' // Gold for completed
                        : currentUnlocked && nextUnlocked
                        ? 'rgba(239, 68, 68, 0.8)' // Red for active path
                        : 'rgba(120, 120, 120, 0.5)'; // Grey for inactive
                      
                      const glowColor = isCurrentCompleted 
                        ? '#f59e0b'
                        : '#ef4444';
                      
                      // Create jagged path (like lightning/heartbeat)
                      const x1Num = parseFloat(x1);
                      const x2Num = parseFloat(x2);
                      const y1Num = parseFloat(y1);
                      const y2Num = parseFloat(y2);
                      const midX = (x1Num + x2Num) / 2;
                      const midY = (y1Num + y2Num) / 2;
                      const offsetX = (Math.random() - 0.5) * 3;
                      const offsetY = (Math.random() - 0.5) * 10;
                      
                      const pathData = `M ${x1} ${y1} L ${midX + offsetX}% ${midY + offsetY}px L ${x2} ${y2}`;
                      
                      return (
                        <path
                          key={`line-${level.id}`}
                          d={pathData}
                          stroke={lineColor}
                          strokeWidth="2"
                          fill="none"
                          style={{
                            filter: isCurrentCompleted || (currentUnlocked && nextUnlocked)
                              ? `drop-shadow(0 0 5px ${glowColor})`
                              : 'none'
                          }}
                        />
                      );
                    })}
                  </svg>
                  
                {actLevels.map((level, index) => {
                  const unlocked = isLevelUnlocked(level.id);
                  const skulls = getSkullsForLevel(level.id);
                  const maxSkulls = level.parts.length * 3;
                  const isCompleted = skulls === maxSkulls && maxSkulls > 0;
                  
                  // Find the highest unlocked level
                  const unlockedLevels = GAME_LEVELS.filter(l => isLevelUnlocked(l.id));
                  const highestUnlockedLevel = unlockedLevels[unlockedLevels.length - 1];
                  const isActive = unlocked && !isCompleted && level.id === highestUnlockedLevel?.id;
                  const isReplayable = unlocked && !isActive;

                  return (
                    <motion.button
                      key={level.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      whileHover={unlocked ? { 
                        y: -20,
                        transition: { duration: 0.3 }
                      } : {}}
                      whileTap={unlocked ? { y: -15 } : {}}
                      onClick={() => {
                        if (unlocked) {
                          horrorAudio.playClick();
                          setSelectedLevelId(level.id);
                        }
                      }}
                      onMouseEnter={() => unlocked && horrorAudio.playHover()}
                      disabled={!unlocked}
                      className={`
                        w-full aspect-[3/4] flex flex-col items-center justify-center transition-all duration-300 relative group
                        ${!unlocked ? 'cursor-not-allowed gap-2 p-3' : ''}
                        ${isActive ? 'gap-2 p-3' : ''}
                        ${isCompleted || isReplayable ? 'gap-2 p-3' : ''}
                      `}
                      style={{
                        borderRadius: '50% 50% 0 0',
                        background: isActive 
                          ? 'radial-gradient(circle at center, #1a0500 40%, #ffaa00 150%)'
                          : isCompleted || isReplayable 
                          ? 'linear-gradient(to bottom, #3a3a3a 0%, #1a1a15 100%)'
                          : 'linear-gradient(to bottom, #2a2a2a 0%, #111 100%)',
                        backgroundImage: isCompleted || isReplayable
                          ? 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12), transparent 60%), url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.08\'/%3E%3C/svg%3E")'
                          : isActive
                          ? 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.08\'/%3E%3C/svg%3E")'
                          : 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
                        boxShadow: isActive 
                          ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -10px 20px rgba(0,0,0,0.8), inset 0 0 40px #ff6600, inset 0 0 10px #ffaa00, 0 0 20px rgba(255, 100, 0, 0.3), 5px 5px 15px rgba(0, 0, 0, 0.5)'
                          : isCompleted || isReplayable
                          ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -10px 20px rgba(0,0,0,0.8)'
                          : 'inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -10px 20px rgba(0,0,0,0.8), 5px 5px 15px rgba(0, 0, 0, 0.5)',
                        filter: isCompleted || isReplayable ? 'grayscale(100%) brightness(0.8)' : 'none',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                        maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                      }}
                    >
                      {!unlocked && (
                        <>
                          <Lock className="w-10 h-10 text-zinc-800 opacity-60" />
                          <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">R.I.P.</span>
                        </>
                      )}
                      
                      {isActive && (
                        <>
                          <Skull 
                            className="w-5 h-5"
                            style={{
                              color: '#fffef0',
                              filter: 'drop-shadow(0 2px 0 black) drop-shadow(0 0 10px rgba(0,0,0,0.8))'
                            }}
                          />
                          <h3 
                            className="font-bold text-base uppercase tracking-widest text-center px-2 leading-tight"
                            style={{
                              color: '#fffef0',
                              textShadow: '0 2px 0 black, 0 0 10px rgba(0,0,0,0.8)'
                            }}
                          >
                            {level.name}
                          </h3>
                          <span 
                            className="text-[9px] font-bold tracking-[0.2em]"
                            style={{
                              color: '#ffaa00',
                              textShadow: '0 2px 0 black, 0 0 10px rgba(0,0,0,0.8)'
                            }}
                          >
                            TRIAL {toRoman(level.id)}
                          </span>
                          <span className="text-zinc-500 text-[10px] font-mono">
                            {skulls} {skulls === 1 ? 'Soul' : 'Souls'}
                          </span>
                        </>
                      )}
                      
                      {isCompleted && (
                        <>
                          <Medal 
                            className="w-7 h-7"
                            style={{
                              color: '#555',
                              filter: 'drop-shadow(1px 1px 0 rgba(255,255,255,0.1)) drop-shadow(-1px -1px 0 black)'
                            }}
                          />
                          <span 
                            className="font-bold text-sm text-center px-2 leading-tight"
                            style={{
                              color: '#555',
                              textShadow: '1px 1px 0 rgba(255,255,255,0.1)'
                            }}
                          >
                            {level.name}
                          </span>
                          <div 
                            className="flex items-center gap-1 text-xs"
                            style={{
                              color: '#555',
                              textShadow: '1px 1px 0 rgba(255,255,255,0.1)'
                            }}
                          >
                            <Check className="w-3 h-3" />
                            <span>Complete</span>
                          </div>
                          {/* Replay icon on hover */}
                          <RotateCcw 
                            className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity absolute top-2 right-2"
                            style={{ color: '#555' }}
                          />
                        </>
                      )}
                      
                      {isReplayable && !isCompleted && (
                        <>
                          <Skull 
                            className="w-6 h-6"
                            style={{
                              color: '#555',
                              filter: 'drop-shadow(1px 1px 0 rgba(255,255,255,0.1)) drop-shadow(-1px -1px 0 black)'
                            }}
                          />
                          <span 
                            className="font-bold text-sm text-center px-2 leading-tight"
                            style={{
                              color: '#555',
                              textShadow: '1px 1px 0 rgba(255,255,255,0.1)'
                            }}
                          >
                            {level.name}
                          </span>
                          <span 
                            className="text-[10px] font-mono"
                            style={{
                              color: '#555',
                              textShadow: '1px 1px 0 rgba(255,255,255,0.1)'
                            }}
                          >
                            {toRoman(skulls)} of {toRoman(maxSkulls)}
                          </span>
                          {/* Replay icon on hover */}
                          <RotateCcw 
                            className="w-4 h-4 opacity-0 group-hover:opacity-70 transition-opacity absolute top-2 right-2"
                            style={{ color: '#555' }}
                          />
                        </>
                      )}
                    </motion.button>
                  );
                })}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>

      {/* Level Details Modal */}
      <AnimatePresence>
        {selectedLevel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLevelId(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 border border-red-900/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl shadow-black"
              style={{
                background: 'radial-gradient(ellipse at top center, rgba(127, 29, 29, 0.15) 0%, rgb(9, 9, 11) 50%)'
              }}
            >

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  horrorAudio.playClick();
                  setSelectedLevelId(null);
                }}
                onMouseEnter={() => horrorAudio.playHover()}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-50"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </motion.button>

            {/* Level Header */}
            <div className="p-8 pb-6">
              <h2 className="text-5xl font-['Creepster'] text-center mb-4 text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-950 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                {selectedLevel.name}
              </h2>
              <p className="text-zinc-400 text-lg italic text-center font-serif">
                {selectedLevel.description}
              </p>
            </div>

            {/* Reward Info - Centered and Compact */}
            <div className="flex justify-center mb-6 px-8">
              <div className="bg-black/40 border border-amber-900/30 rounded-lg p-4 max-w-md text-center">
                <div className="text-amber-700 text-[10px] tracking-widest mb-1.5 uppercase">Reward</div>
                <div className="text-lg font-['Creepster'] text-amber-500">
                  {selectedLevel.reward.name}
                </div>
                <div className="text-xs text-zinc-400 italic mt-1">
                  {selectedLevel.reward.description}
                </div>
              </div>
            </div>

            {/* Parts List */}
            <div className="bg-zinc-900/50 border-t border-white/5">
              {selectedLevel.parts.map((part, index) => {
                const partSkulls = getSkullsForPart(selectedLevel.id, part.id);

                return (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between px-8 py-5 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-white uppercase tracking-wide">
                          {part.name}
                        </h4>
                        {partSkulls > 0 && (
                          <span className="text-[10px] bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-600/50 uppercase tracking-wider">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      
                      {/* Skull Display */}
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((skullNum) => (
                          <Skull
                            key={skullNum}
                            className={`w-4 h-4 transition-all ${
                              skullNum <= partSkulls 
                                ? 'text-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]' 
                                : 'text-zinc-700'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-zinc-500 ml-1">
                          {toRoman(partSkulls)} of III
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        horrorAudio.playClick();
                        onStartPart(part, selectedLevel.id);
                        setSelectedLevelId(null);
                      }}
                      onMouseEnter={() => horrorAudio.playHover()}
                      className="flex items-center gap-2 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-colors duration-300 uppercase tracking-widest text-xs px-6 py-3 rounded"
                    >
                      <Play className="w-3 h-3" />
                      {partSkulls > 0 ? 'REPLAY' : 'START'}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Required Skulls Footer */}
            <div className="bg-black/50 py-3 text-center text-xs text-zinc-500 uppercase tracking-widest border-t border-white/5">
              Required skulls to unlock next: <span className="text-red-400 font-bold">{selectedLevel.requiredSkullsToUnlockNext}</span>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
