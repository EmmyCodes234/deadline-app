import { useState } from 'react';
import { Volume2, VolumeX, Moon, Lock } from 'lucide-react';
import { Howler } from 'howler';
import { Navigation } from '../components/Navigation';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function SettingsPage() {
  const [isMuted, setIsMuted] = useState(Howler.volume() === 0);
  const [autoSave, setAutoSave] = useState(true);
  const [difficulty, setDifficulty] = useState('Normal');

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    Howler.volume(newMutedState ? 0 : 1);
    horrorAudio.toggleMute(newMutedState);
    horrorAudio.playSwitch();
  };

  const handleDarkModeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Shake animation on click
    e.currentTarget.classList.add('animate-shake');
    setTimeout(() => {
      e.currentTarget.classList.remove('animate-shake');
    }, 500);
  };

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
      <div className="relative z-10 max-w-3xl mx-auto px-8 py-12 pt-24 mt-24">

        {/* Title */}
        <h1 className="font-['Creepster'] text-5xl text-red-600 drop-shadow-md text-center mb-4">
          ABJURATIONS
        </h1>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-900 to-transparent mx-auto mt-4 mb-8" />

        {/* Main Glass Panel */}
        <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-white/5 p-8 rounded-xl space-y-6">
          
          {/* Audio Settings */}
          <div className="space-y-4">
            <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              Audio
            </h2>
            
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-white font-serif">Sound Effects</p>
                <p className="text-sm text-zinc-500">
                  Enable or disable ambient sounds
                </p>
              </div>
              <button
                onClick={toggleMute}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  !isMuted 
                    ? 'bg-red-950 border border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-zinc-950 border border-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-300 ${
                    !isMuted 
                      ? 'translate-x-6 bg-red-500' 
                      : 'translate-x-1 bg-zinc-600'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Appearance Settings */}
          <div className="space-y-4">
            <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Appearance
            </h2>
            
            <div 
              onClick={handleDarkModeClick}
              className="flex items-center justify-between py-4 opacity-50 cursor-not-allowed grayscale"
            >
              <div>
                <p className="text-zinc-500 font-serif">Dark Mode</p>
                <p className="text-sm text-red-900/80 italic">
                  Cursed to remain in darkness
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-zinc-600" />
                <button
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-950 border border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)] pointer-events-none"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full translate-x-6 bg-red-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Game Settings */}
          <div className="space-y-4">
            <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-zinc-500">
              Game
            </h2>
            
            <div className="py-4">
              <p className="text-white font-serif mb-2">Difficulty</p>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 text-zinc-300 rounded px-4 py-2 hover:border-red-500 focus:outline-none focus:border-red-500 transition-colors font-sans"
              >
                <option>Normal</option>
                <option>Hard</option>
                <option>Nightmare</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-white font-serif">Auto-Save</p>
                <p className="text-sm text-zinc-500">
                  Preserve your progress automatically
                </p>
              </div>
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  autoSave 
                    ? 'bg-red-950 border border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-zinc-950 border border-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-300 ${
                    autoSave 
                      ? 'translate-x-6 bg-red-500' 
                      : 'translate-x-1 bg-zinc-600'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer - About */}
        <div className="mt-12 text-center text-zinc-600 text-xs uppercase tracking-widest space-y-2">
          <p>The Deadline • Version 1.0.0</p>
          <p>A Gothic Writing Experience</p>
        </div>
      </div>

      {/* Shake Animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
