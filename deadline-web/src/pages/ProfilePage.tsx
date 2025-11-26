import { useAuth } from '../hooks/useAuth';
import { useGameProgress } from '../hooks/useGameProgress';
import { GAME_LEVELS } from '../data/gameLevels';
import { Skull, BookOpen, Feather } from 'lucide-react';
import { Navigation } from '../components/Navigation';

export function ProfilePage() {
  const { user } = useAuth();
  const { levelProgress, unlockedLevelIds, totalSkulls } = useGameProgress();

  const completedLevels = unlockedLevelIds.length - 1;
  const totalLevels = GAME_LEVELS.length;
  
  // Calculate total words written
  const totalWords = Object.values(levelProgress).reduce((sum, parts) => {
    return sum + Object.keys(parts).length * 100;
  }, 0);
  
  // Calculate highest WPM (mock for now - would need actual tracking)
  const highestWPM = 85;
  
  // Extract username from email
  const username = user?.email ? user.email.split('@')[0].toUpperCase() : 'ANONYMOUS';

  return (
    <div className="min-h-screen bg-black relative">
      {/* Navigation */}
      <Navigation variant="minimal" showBackButton backTo="/hub" />

      {/* Background - Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/bg-graveyard.jpg"
          style={{
            filter: 'brightness(0.4) contrast(1.1) saturate(0.95)'
          }}
        >
          <source src="/bg-graveyard-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-12 pt-24 mt-24">

        {/* Title */}
        <h1 className="text-6xl font-['Playfair_Display'] font-bold text-red-500 mb-3 uppercase tracking-wider drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">
          The Scribe's Sanctum
        </h1>
        <p className="text-red-500/80 text-sm mb-16 font-serif uppercase tracking-widest">
          VESSEL: {username} • WANDERER OF THE VOID
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-24">
          {/* Stat Card 1 - Total Inscriptions */}
          <div className="p-6 rounded-lg bg-zinc-950/60 border border-white/10 flex flex-col items-center">
            <span className="text-zinc-500 text-xs uppercase tracking-widest">Total Inscriptions</span>
            <span className="text-4xl font-['Creepster'] text-zinc-100 mt-2">
              {totalWords.toLocaleString()}
            </span>
          </div>

          {/* Stat Card 2 - The Hero Stat (Peak WPM) */}
          <div className="p-6 rounded-lg bg-red-950/30 border border-red-500/50 flex flex-col items-center relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.2)]">
            <div className="absolute inset-0 border border-red-500/30 animate-pulse rounded-lg" />
            <span className="text-red-400 text-xs uppercase tracking-widest relative z-10">Peak WPM</span>
            <span className="text-5xl font-['Creepster'] text-red-500 mt-2 relative z-10">
              {highestWPM}
            </span>
          </div>

          {/* Stat Card 3 - Souls Harvested */}
          <div className="p-6 rounded-lg bg-zinc-950/60 border border-white/10 flex flex-col items-center">
            <span className="text-zinc-500 text-xs uppercase tracking-widest">Souls Harvested</span>
            <span className="text-4xl font-['Creepster'] text-amber-500 mt-2">
              {totalSkulls}
            </span>
          </div>
        </div>

        {/* The Record of Deeds */}
        <div className="bg-transparent">
          <h2 className="text-4xl font-['Playfair_Display'] font-bold text-zinc-100 mb-8 uppercase tracking-wider">
            The Record of Deeds
          </h2>
          <div className="space-y-3">
            {GAME_LEVELS.map((level, index) => {
              const isUnlocked = unlockedLevelIds.includes(level.id);
              const levelSkulls = levelProgress[level.id]
                ? Object.values(levelProgress[level.id]).reduce((sum, skulls) => sum + skulls, 0)
                : 0;
              const partsCompleted = levelProgress[level.id]
                ? Object.keys(levelProgress[level.id]).length
                : 0;

              return (
                <div
                  key={level.id}
                  className={`flex items-center justify-between p-5 rounded-lg transition-all ${
                    isUnlocked
                      ? 'bg-red-950/30 border border-red-900/50'
                      : 'bg-black/60 border border-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`text-2xl font-['Creepster'] ${isUnlocked ? 'text-zinc-500' : 'text-zinc-600'}`}>
                      #{index + 1}
                    </span>
                    <div>
                      <p className={`font-serif font-semibold text-lg ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>
                        {level.name}
                      </p>
                      <p className={`text-sm font-serif ${isUnlocked ? 'text-zinc-500' : 'text-zinc-600'}`}>
                        {partsCompleted} parts • {levelSkulls} souls
                      </p>
                    </div>
                  </div>
                  {isUnlocked && (
                    <Skull 
                      className="w-6 h-6 text-red-500" 
                      style={{ filter: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
