import { type GameLevelReward } from '../data/gameLevels';
import { Skull, ScrollText, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useGameProgress } from '../hooks/useGameProgress';
import { VictoryCelebration } from './VictoryCelebration';

interface VictoryModalProps {
  wpm: number;
  skulls: number;
  reward: GameLevelReward | null;
  onContinue: () => void;
  onShowAuth?: () => void;
}

export function VictoryModal({ wpm, skulls, reward, onContinue, onShowAuth }: VictoryModalProps) {
  const { user } = useGameProgress();
  return (
    <>
      {/* Golden Particle Explosion */}
      <VictoryCelebration />
      
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 animate-in fade-in duration-500">
        <div className="relative bg-black/80 backdrop-blur-xl border-4 border-orange-700 rounded-lg p-12 max-w-md w-full text-center shadow-2xl shadow-orange-900/50 animate-in zoom-in duration-500">
        {/* Glowing Border Effect */}
        <div className="absolute -inset-1 rounded-lg border-4 border-orange-500 blur-sm opacity-50"></div>
        
        <div className="relative z-10">
          {/* Title */}
          <h2 className="text-5xl font-creepster text-amber-500 uppercase tracking-widest mb-3 drop-shadow-lg">
            RITUAL COMPLETE
          </h2>
          <p className="text-zinc-400 italic mb-10 font-serif">The Muse is appeased... for now.</p>

          {/* Skulls Earned - Larger and More Prominent */}
          <div className="flex justify-center gap-6 mb-10">
            {[...Array(3)].map((_, index) => (
              <Skull
                key={index}
                size={64}
                className={
                  index < skulls
                    ? 'text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-pulse'
                    : 'text-zinc-700'
                }
              />
            ))}
          </div>

          {/* Final WPM - De-boxed and Centered */}
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
              FINAL VELOCITY
            </p>
            <p className="text-7xl font-creepster text-white drop-shadow-md">
              {wpm}
            </p>
          </div>

          {/* Reward Section */}
          {reward && (
            <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border-2 border-yellow-600/50 rounded-lg p-4 mb-6 animate-in slide-in-from-bottom duration-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <ScrollText className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs text-yellow-400 font-mono uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    NEW REWARD UNLOCKED!
                  </div>
                  <div className="text-lg font-bold text-yellow-300 mb-1">
                    {reward.name}
                  </div>
                  <div className="text-xs text-gray-300 italic">
                    {reward.description}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flavor Text */}
          <p className="text-stone-400 italic text-sm mb-6">
            {skulls === 3 && "A masterful performance! The spirits sing your praises."}
            {skulls === 2 && "Well done. The Muse acknowledges your dedication."}
            {skulls === 1 && "You have survived... barely. The Muse expects more."}
          </p>

          {/* Guest Mode Warning */}
          {!user && onShowAuth && (
            <div className="mb-6 p-4 bg-yellow-900/30 border-2 border-yellow-700/50 rounded-lg animate-in slide-in-from-bottom duration-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-yellow-300 font-bold text-sm mb-1">
                    ⚠️ Playing as Guest
                  </p>
                  <p className="text-stone-400 text-xs mb-3">
                    Your progress will be lost when you close the browser. Sign up now to save your {skulls} skull{skulls !== 1 ? 's' : ''}!
                  </p>
                  <button
                    onClick={onShowAuth}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded transition-all border-b-2 border-purple-900"
                  >
                    Sign Up to Save Progress
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button - Ghost Style */}
          <button
            onClick={onContinue}
            className="w-full border border-amber-600/50 text-amber-500 hover:bg-amber-900/20 hover:border-amber-500 hover:text-amber-300 transition-all uppercase tracking-widest py-4 rounded-lg font-bold flex items-center justify-center gap-3 group"
          >
            PROCEED TO MAP
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
