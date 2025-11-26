import { useEffect, useRef, useState } from 'react';
import { useMuseRitual } from '@/hooks/useMuseRitual';
import { type GamePart, type GameLevelReward, GAME_LEVELS } from '@/data/gameLevels';
import { Icon } from '@iconify/react';
import { ArrowLeft, User, LogOut, BookOpen } from 'lucide-react';
import clsx from 'clsx';
import { GothicIcon } from './GothicIcon';
import { LevelSelect } from '@/components/LevelSelect';
import { VictoryModal } from '@/components/VictoryModal';
import { TypeImpact } from '@/components/TypeImpact';
import { TypingParticles } from '@/components/TypingParticles';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';

export function HauntingEditor() {
  const {
    gameState,
    patience,
    patienceCritical,
    currentPart,
    currentLevelId,
    sentenceIndex,
    currentSentence,
    visibleTextLength,
    typedText,
    finalWpm,
    skullsEarned,
    startPart,
    handleTyping,
    resetGame,
  } = useMuseRitual();

  const { user, signOut } = useAuth();
  const { savePartResults, isLevelUnlocked, loadProgress } = useGameProgress();
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [newlyEarnedReward, setNewlyEarnedReward] = useState<GameLevelReward | null>(null);
  const [playingLevelId, setPlayingLevelId] = useState<number | null>(null);
  const [playingPartId, setPlayingPartId] = useState<string | null>(null);
  const [impactTrigger, setImpactTrigger] = useState(0);
  const [showPhantomText, setShowPhantomText] = useState(false);
  const [whisperMessage, setWhisperMessage] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showErrorFlash, setShowErrorFlash] = useState(false);
  const [showSentenceComplete, setShowSentenceComplete] = useState(false);
  const [patienceBoost, setPatienceBoost] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const whisperMessages = ['GIVE UP', 'TOO SLOW', 'FAIL', 'STOP', 'YOU CANNOT', 'SURRENDER'];

  // UI Hallucinations when patience is critical
  useEffect(() => {
    if (gameState === 'PLAYING' && patience < 20) {
      const interval = setInterval(() => {
        setShowPhantomText(true);
        setTimeout(() => setShowPhantomText(false), 100); // Flash for 100ms
        
        // Random whisper message
        if (Math.random() > 0.5) {
          setWhisperMessage(whisperMessages[Math.floor(Math.random() * whisperMessages.length)]);
          setTimeout(() => setWhisperMessage(''), 50); // Single frame flash
        }
      }, 800); // Every 800ms

      return () => clearInterval(interval);
    }
  }, [gameState, patience]);

  // Handler to start a part from level select
  const handleStartPart = (part: GamePart, levelId: number) => {
    setPlayingLevelId(levelId);
    setPlayingPartId(part.id);
    setNewlyEarnedReward(null);
    startPart(part, levelId);
    setShowLevelSelect(false);
  };

  // Handler to return to level select
  const handleBackToLevels = async () => {
    resetGame();
    // Reload progress from Supabase to ensure fresh data
    await loadProgress();
    setShowLevelSelect(true);
    setNewlyEarnedReward(null);
    setPlayingLevelId(null);
    setPlayingPartId(null);
  };

  // Handle victory: save progress and check for rewards
  useEffect(() => {
    if (gameState === 'VICTORY' && playingLevelId !== null && playingPartId !== null) {
      // Save the part results
      savePartResults(playingLevelId, playingPartId, skullsEarned);

      // Check if the next level was unlocked
      const nextLevelId = playingLevelId + 1;
      if (nextLevelId <= GAME_LEVELS.length && isLevelUnlocked(nextLevelId)) {
        // Find the newly unlocked level and get its reward
        const nextLevel = GAME_LEVELS.find(l => l.id === nextLevelId);
        if (nextLevel && nextLevel.reward) {
          setNewlyEarnedReward(nextLevel.reward);
        }
      }
    }
  }, [gameState, playingLevelId, playingPartId, skullsEarned, savePartResults, isLevelUnlocked]);

  // Auto-focus input when playing
  useEffect(() => {
    if (gameState === 'PLAYING' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Handle keyboard input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'PLAYING') return;
    
    const char = e.key;
    if (char.length === 1) {
      // Get feedback from typing handler
      const feedback = handleTyping(char);
      
      // React to feedback
      if (feedback?.type === 'correctKey') {
        // Correct keystroke - trigger impact effect
        setImpactTrigger(prev => prev + 1);
      } else if (feedback?.type === 'incorrectKey') {
        // Incorrect keystroke - could add error shake/flash here
        // For now, the patience penalty is handled in the hook
      } else if (feedback?.type === 'sentenceComplete') {
        // Sentence complete - could add celebration effect here
        setImpactTrigger(prev => prev + 1);
      }
      
      // Clear input to prevent text accumulation
      e.currentTarget.value = '';
    }
  };

  // Get patience bar color and animation based on level
  const getPatienceColor = () => {
    if (patience > 60) return 'from-purple-500 via-purple-400 to-blue-500';
    if (patience > 30) return 'from-yellow-500 via-orange-400 to-orange-500';
    return 'from-red-600 via-red-500 to-red-800';
  };

  const getPatienceAnimation = () => {
    if (patience > 60) return 'animate-pulse-slow';
    if (patience > 30) return 'animate-pulse';
    return 'animate-pulse-fast';
  };

  // Show level select screen
  if (showLevelSelect) {
    return <LevelSelect onStartPart={handleStartPart} />;
  }

  // Show game view
  return (
    <div className="h-screen w-full bg-stone-950 bg-[url('/bg-graveyard.jpg')] bg-cover bg-center bg-fixed relative overflow-hidden">
      {/* Dark textured overlay */}
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_30%,rgba(0,0,0,0.7)_80%,rgba(0,0,0,0.9)_100%)]" />

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col">

        {/* Top HUD Bar */}
        {gameState !== 'IDLE' && (
          <div className="flex-none h-20 bg-stone-900/90 border-b-2 border-stone-800 flex items-center justify-between px-8 backdrop-blur-sm">
            {/* Left: Level & Part Info */}
            <div className="flex items-center gap-4">
              <GothicIcon variant="arcane" size="lg">
                <BookOpen />
              </GothicIcon>
              <div>
                <div className="text-sm text-gray-500 font-mono uppercase tracking-wider">
                  {currentLevelId ? `Level ${currentLevelId}` : 'Unknown Level'}
                </div>
                <div className="text-lg font-['Playfair_Display'] text-stone-100">
                  {currentPart?.name || 'Unknown Part'}
                </div>
              </div>
            </div>

            {/* Center: Spirit Patience Bar - Enhanced Volatile Visuals */}
            <div className="flex items-center gap-4 min-w-[300px]">
              <Icon 
                icon="game-icons:skull" 
                className={clsx(
                  "size-8 transition-all drop-shadow-glow",
                  patience > 60 && "text-purple-400 animate-pulse-slow",
                  patience <= 60 && patience > 30 && "text-orange-400 animate-pulse",
                  patience <= 30 && "text-red-500 animate-bounce"
                )}
                style={{
                  filter: patience <= 30 
                    ? 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.8))' 
                    : patience <= 60 
                    ? 'drop-shadow(0 0 6px rgba(251, 146, 60, 0.6))' 
                    : 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))'
                }}
              />
              <div className="flex-1">
                <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
                  Spirit Patience
                </div>
                <div className="h-5 bg-black/70 border-2 border-stone-700 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={clsx(
                      'h-full bg-gradient-to-r transition-all duration-300',
                      getPatienceColor(),
                      getPatienceAnimation()
                    )}
                    style={{ 
                      width: `${patience}%`,
                      boxShadow: patience > 60 
                        ? '0 0 25px rgba(168, 85, 247, 0.7), inset 0 0 10px rgba(168, 85, 247, 0.4)' 
                        : patience > 30 
                        ? '0 0 25px rgba(251, 146, 60, 0.7), inset 0 0 10px rgba(251, 146, 60, 0.4)'
                        : '0 0 30px rgba(220, 38, 38, 0.9), inset 0 0 15px rgba(220, 38, 38, 0.5)'
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1 text-right">
                  {Math.round(patience)}%
                </div>
              </div>
            </div>

            {/* Right: Auth/Profile Button */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-800/50 hover:bg-stone-700/50 border border-stone-700 rounded transition-all"
                    aria-label="User profile"
                  >
                    <GothicIcon variant="soul" size="xs">
                      <User />
                    </GothicIcon>
                    <span className="text-sm text-stone-300 max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-stone-800 border-2 border-stone-700 rounded shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs text-stone-500 border-b border-stone-700">
                          Signed in as
                        </div>
                        <div className="px-3 py-2 text-sm text-stone-300 truncate border-b border-stone-700">
                          {user.email}
                        </div>
                        <button
                          onClick={async () => {
                            await signOut();
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-stone-700/50 rounded transition-colors"
                        >
                          <GothicIcon variant="soul" size="xs">
                            <LogOut />
                          </GothicIcon>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 border-b-4 border-purple-900 hover:border-b-2 active:border-b-0 rounded transition-all shadow-lg shadow-purple-900/50"
                >
                  <GothicIcon variant="soul" size="xs">
                    <User />
                  </GothicIcon>
                  <span className="text-sm font-semibold">Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          {/* IDLE State - Back to Level Select */}
          {gameState === 'IDLE' && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="space-y-4">
                <Icon icon="solar:book-bold" className="size-24 text-purple-500 mx-auto animate-pulse" />
                <h1 className="text-6xl font-['Creepster'] text-white drop-shadow-[0_5px_10px_rgba(0,0,0,1)]">
                  THE RITUAL OF THE
                </h1>
                <h1 className="text-6xl font-['Creepster'] text-purple-500 drop-shadow-[0_5px_10px_rgba(168,85,247,0.8)]">
                  UNSEEN MUSE
                </h1>
              </div>

              <p className="text-xl text-gray-300 font-['Playfair_Display'] italic max-w-2xl mx-auto">
                Choose your path through the darkness...
              </p>

              <button
                onClick={handleBackToLevels}
                className="flex items-center gap-3 px-12 py-6 bg-purple-600 hover:bg-purple-700 text-white text-2xl font-['Creepster'] rounded-2xl border-b-8 border-purple-900 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.8)] transition-all hover:scale-105 active:scale-95 active:border-b-2 uppercase tracking-wider mx-auto"
              >
                <GothicIcon variant="soul" size="md">
                  <ArrowLeft />
                </GothicIcon>
                BACK TO LEVEL SELECT
              </button>
            </div>
          )}

          {/* GAME_OVER State */}
          {gameState === 'GAME_OVER' && (
            <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
              <div className="space-y-4">
                <Icon icon="solar:skull-bold" className="size-32 text-red-600 mx-auto animate-pulse drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]" />
                <h1 className="text-8xl font-['Creepster'] text-red-600 drop-shadow-[0_5px_10px_rgba(220,38,38,1)] animate-pulse">
                  THE MUSE IS DISPLEASED
                </h1>
                <p className="text-2xl text-gray-300 font-['Playfair_Display'] italic">
                  Your hesitation has angered the spirit...
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleBackToLevels}
                  className="flex items-center gap-2 px-8 py-6 bg-gray-700 hover:bg-gray-600 text-white text-xl font-['Creepster'] rounded-2xl border-b-8 border-gray-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] transition-all hover:scale-105 active:scale-95 active:border-b-2 uppercase tracking-wider"
                >
                  <GothicIcon variant="soul" size="sm">
                    <ArrowLeft />
                  </GothicIcon>
                  LEVEL SELECT
                </button>
                <button
                  onClick={resetGame}
                  className="px-12 py-6 bg-red-600 hover:bg-red-700 text-white text-xl font-['Creepster'] rounded-2xl border-b-8 border-red-900 shadow-[0_10px_40px_-10px_rgba(220,38,38,0.8)] transition-all hover:scale-105 active:scale-95 active:border-b-2 uppercase tracking-wider"
                >
                  TRY AGAIN
                </button>
              </div>
            </div>
          )}

          {/* FOCUSING State - The Inhale Sequence (Enhanced) */}
          {gameState === 'FOCUSING' && (
            <div className="absolute inset-0 bg-black/95 flex items-center justify-center animate-in fade-in duration-700 z-50">
              <div className="text-center space-y-12">
                {/* Pulsing Ritual Circle */}
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 bg-purple-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-4 bg-purple-600/20 rounded-full animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                  <div className="absolute inset-8 bg-purple-700/30 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon 
                      icon="game-icons:pentagram-rose" 
                      className="w-24 h-24 text-purple-400 animate-pulse"
                      style={{ 
                        filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))',
                        animationDuration: '1.5s'
                      }}
                    />
                  </div>
                </div>
                
                {/* Focus Text - Large Gothic */}
                <div className="space-y-4">
                  <h2 className="text-7xl font-['Creepster'] text-purple-300 animate-pulse tracking-widest" 
                      style={{ 
                        textShadow: '0 0 30px rgba(168, 85, 247, 0.8), 0 0 60px rgba(168, 85, 247, 0.4)',
                        animationDuration: '1.5s'
                      }}>
                    FOCUSING...
                  </h2>
                  <p className="text-xl text-gray-400 font-['Playfair_Display'] italic">
                    The spirit draws near
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VICTORY State */}
          {gameState === 'VICTORY' && (
            <VictoryModal
              wpm={finalWpm}
              skulls={skullsEarned}
              reward={newlyEarnedReward}
              onContinue={handleBackToLevels}
              onShowAuth={() => setShowAuthModal(true)}
            />
          )}

          {/* PLAYING State - The Dictation (Enhanced Visuals) */}
          {gameState === 'PLAYING' && currentSentence && (
            <div className="max-w-5xl w-full space-y-6 relative px-4">
              {/* Sentence Progress - Improved visibility */}
              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full">
                  <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
                    Sentence {sentenceIndex + 1} of {currentPart?.sentences.length || 0}
                  </span>
                </div>
              </div>

              {/* The Dictation Display - Improved readability */}
              <div className="relative min-h-[280px] flex items-center justify-center py-12">
                {/* Vignette Overlay - Shifts with patience */}
                <div 
                  className={clsx(
                    "absolute inset-0 pointer-events-none transition-all duration-1000 rounded-3xl",
                    patience > 60 && "bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(88,28,135,0.2)_100%)]",
                    patience <= 60 && patience > 30 && "bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(194,65,12,0.3)_100%)]",
                    patience <= 30 && "bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(127,29,29,0.5)_100%)] animate-pulse"
                  )}
                />
                
                {/* Impact particles */}
                <TypeImpact trigger={impactTrigger} />
                
                {/* Typing particles with WPM-based heat system */}
                <TypingParticles 
                  isActive={gameState === 'PLAYING'} 
                  targetElement={inputRef.current}
                />
                
                {/* Subliminal Whisper Messages - Reduced opacity for less distraction */}
                {whisperMessage && patience < 15 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <span className="text-5xl font-['Creepster'] text-red-600/60 animate-pulse">
                      {whisperMessage}
                    </span>
                  </div>
                )}
                
                {/* Text Container with better spacing and line height */}
                <div className="text-4xl md:text-5xl font-serif leading-[1.6] text-center relative z-10 px-8 max-w-4xl">
                  {/* Typed Part - High contrast, readable */}
                  <span 
                    className="text-amber-200 font-medium"
                    style={{ 
                      textShadow: '0 0 30px rgba(252, 211, 77, 0.8), 0 2px 8px rgba(0, 0, 0, 0.9)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {typedText}
                  </span>
                  
                  {/* Visible Untyped Part - Better contrast */}
                  <span 
                    className="text-zinc-400/70"
                    style={{ 
                      textShadow: '0 0 10px rgba(161, 161, 170, 0.3)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {currentSentence.substring(typedText.length, Math.floor(visibleTextLength))}
                  </span>

                  {/* Phantom Text Overlay - Only at critical patience */}
                  {showPhantomText && patience < 15 && (
                    <span className="absolute inset-0 text-red-500/50 blur-[2px] animate-pulse pointer-events-none">
                      {currentSentence.split('').map((char, i) => 
                        i >= typedText.length ? String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 10) - 5) : char
                      ).join('')}
                    </span>
                  )}
                  
                  {/* Blinking cursor - More visible */}
                  {typedText.length < currentSentence.length && (
                    <span 
                      className="inline-block w-1 h-12 md:h-14 bg-amber-400 ml-2 animate-pulse align-middle"
                      style={{ 
                        boxShadow: '0 0 15px rgba(251, 191, 36, 0.9)',
                        animationDuration: '1s'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Hidden Input for capturing keystrokes */}
              <input
                ref={inputRef}
                type="text"
                onKeyDown={handleKeyPress}
                className="absolute opacity-0 top-0 left-0 pointer-events-auto"
                autoFocus
                autoComplete="off"
                aria-label="Type the displayed text"
              />

              {/* Instructions - Better visibility */}
              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full">
                  <span className="text-sm text-zinc-400 font-mono">
                    Type the text as it appears
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-sm text-red-400/80 font-mono">
                    Errors waste time
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // Reload progress after successful auth
          loadProgress();
        }}
      />
    </div>
  );
}
