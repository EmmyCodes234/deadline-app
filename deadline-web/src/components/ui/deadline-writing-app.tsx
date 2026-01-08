import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useReaper } from '@/hooks/useReaper';
import { useAudio } from '@/hooks/useAudio';
import { useCrypt } from '@/hooks/useCrypt';
import { Sidebar } from '@/components/Sidebar';
import { exportToDocx } from '@/utils/exportUtils';
import clsx from 'clsx';

export function DeadLineWritingApp() {
  const crypt = useCrypt();
  const [wpm, setWpm] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeathModal, setShowDeathModal] = useState(false);
  const [showPunishmentWarning, setShowPunishmentWarning] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showGrimoireModal, setShowGrimoireModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [sessionStats, setSessionStats] = useState({ deaths: 0, wordsWritten: 0, sessionsCompleted: 0 });

  const {
    status,
    stroke,
    revive,
    timeLeft,
    lastStrokeWasPunished,
    isWarning,
    sessionGoal,
    setSessionGoal,
    pactFulfilled,
    flowStreakActive,
  } = useReaper(10000, crypt.currentDoc?.wordCount || 0, isZenMode);
  const { playKeystroke, playGlitchSound } = useAudio(status, crypt.currentDoc?.wordCount || 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [isPoltergeistActive, setIsPoltergeistActive] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFlowState, setShowFlowState] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newText = e.target.value;
    const oldText = crypt.currentDoc?.content || '';
    let sabotageOccurred = false;

    // THE POLTERGEIST - Sabotage when CRITICAL
    if (status === 'CRITICAL' && newText.length > oldText.length) {
      // 20% chance of sabotage
      if (Math.random() < 0.2) {
        sabotageOccurred = true;
        const sabotageType = Math.floor(Math.random() * 3);
        
        switch (sabotageType) {
          case 0: // The Backspace - Remove last character
            newText = newText.slice(0, -1);
            setIsPoltergeistActive(true);
            setTimeout(() => setIsPoltergeistActive(false), 200);
            playGlitchSound();
            break;
            
          case 1: // The Jumble - Insert random curse character
            const curseSet = ['#', '?', '!', '&', '6', '6', '6', '@', '*', '%'];
            const randomCurse = curseSet[Math.floor(Math.random() * curseSet.length)];
            newText = newText.slice(0, -1) + randomCurse;
            setIsPoltergeistActive(true);
            setTimeout(() => setIsPoltergeistActive(false), 200);
            playGlitchSound();
            break;
            
          case 2: // The Flicker & Scream
            setIsPoltergeistActive(true);
            setTimeout(() => setIsPoltergeistActive(false), 200);
            playGlitchSound();
            break;
        }
      }
    }

    // Update current document
    if (crypt.currentDocId) {
      crypt.updateContent(crypt.currentDocId, newText);
    }

    // Play keystroke sound
    playKeystroke();

    // Calculate WPM
    const words = newText.trim().split(/\s+/).filter((w) => w.length > 0).length;
    const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
    if (elapsedMinutes > 0) {
      setWpm(Math.round(words / elapsedMinutes));
    }

    // CRITICAL: Only add time if sabotage did NOT occur
    if (!sabotageOccurred) {
      stroke(newText);
    }

    // Trigger typing animation effect
    if (newText.length > oldText.length) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
      }, 150);
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Flow State Feedback
  useEffect(() => {
    if (flowStreakActive) {
      setShowFlowState(true);
      const timer = setTimeout(() => {
        setShowFlowState(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [flowStreakActive]);

  // Keyboard shortcuts - The Grimoire
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ? key - Open Grimoire
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowGrimoireModal(true);
        return;
      }

      // ESC - Close modals
      if (e.key === 'Escape') {
        setShowGrimoireModal(false);
        setShowAboutModal(false);
        return;
      }

      // CMD/CTRL + S - Export
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleExportDocx();
        return;
      }

      // CMD/CTRL + SHIFT + Z - Toggle Zen Mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        setIsZenMode(!isZenMode);
        showNotification(`Zen Mode ${!isZenMode ? 'Activated' : 'Deactivated'}`);
        return;
      }

      // CMD/CTRL + K - Toggle Sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZenMode, sidebarOpen]);

  // Handle death animation delay
  useEffect(() => {
    if (status === 'DEAD') {
      // Track death
      setSessionStats(prev => ({ ...prev, deaths: prev.deaths + 1 }));
      
      // Wait 1 second for evaporate animation to finish
      const timer = setTimeout(() => {
        setShowDeathModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowDeathModal(false);
    }
  }, [status]);

  // Handle punishment warning
  useEffect(() => {
    if (lastStrokeWasPunished) {
      setShowPunishmentWarning(true);
      const timer = setTimeout(() => {
        setShowPunishmentWarning(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastStrokeWasPunished]);

  // Handle pact fulfilled
  useEffect(() => {
    if (pactFulfilled) {
      showNotification('🏆 Pact Sealed! Goal achieved!');
    }
  }, [pactFulfilled]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExportTxt = () => {
    const content = crypt.currentDoc?.content || '';
    if (!content || content.trim().length === 0) return;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deadline_draft.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Draft saved as text file.');
  };

  const handleExportDocx = async () => {
    const content = crypt.currentDoc?.content || '';
    const wordCount = crypt.currentDoc?.wordCount || 0;
    if (!content || content.trim().length === 0 || wordCount === 0) return;

    try {
      await exportToDocx(content, wordCount);
      showNotification('Manuscript salvaged from the void.');
    } catch (error) {
      console.error('Failed to export DOCX:', error);
      showNotification('Export failed. Trying text format...');
      // Fallback to text export
      handleExportTxt();
    }
  };

  const getBorderGlow = () => {
    if (isZenMode) return 'border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]';
    if (status === 'SAFE') return 'border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]';
    if (status === 'WARNING') return 'border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.2),inset_0_0_40px_rgba(0,0,0,0.8)]';
    if (status === 'CRITICAL') return 'border-red-600/50 shadow-[0_0_80px_rgba(220,38,38,0.4),inset_0_0_40px_rgba(0,0,0,0.8)] animate-pulse';
    if (status === 'MOCKERY') return 'border-purple-600/50 shadow-[0_0_80px_rgba(147,51,234,0.4),inset_0_0_40px_rgba(0,0,0,0.8)] animate-pulse';
    return 'border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]';
  };

  const getGoalProgress = () => {
    if (sessionGoal === 0) return 0;
    return Math.min((crypt.currentDoc?.wordCount || 0) / sessionGoal * 100, 100);
  };

  return (
    <>
      <Sidebar
        items={crypt.items}
        currentDocId={crypt.currentDocId}
        totalProjectWords={crypt.totalProjectWords}
        onSelectDoc={crypt.selectDoc}
        onCreateDoc={crypt.createDoc}
        onCreateMausoleum={crypt.createMausoleum}
        onDeleteDoc={crypt.deleteDoc}
        onUpdateTitle={crypt.updateTitle}
        onToggleExpand={crypt.toggleExpand}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div
        className={clsx(
          "h-[100dvh] flex flex-col bg-[url('/bg-graveyard.jpg')] bg-cover bg-center bg-fixed relative overflow-hidden font-['Inter'] md:ml-80 transition-all duration-300",
          lastStrokeWasPunished && 'animate-glitch'
        )}
      >
      {/* Overlay to mute background slightly */}
      <div className="fixed inset-0 bg-black/60 z-0" />
      
      {/* Volumetric Lighting - Reactive Glow Behind Editor */}
      <div
        className={clsx(
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none z-5 transition-all duration-1000',
          status === 'SAFE' && 'bg-emerald-900/30 opacity-50',
          status === 'WARNING' && 'bg-amber-900/30 opacity-50',
          status === 'CRITICAL' && 'bg-red-900/50 opacity-60 animate-pulse',
          status === 'DEAD' && 'bg-red-950/40 opacity-40',
          status === 'MOCKERY' && 'bg-purple-900/40 opacity-50',
          isZenMode && 'bg-blue-900/30 opacity-50'
        )}
      />
      
      <div
        className={clsx(
          'fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,transparent_60%,rgba(0,0,0,0.8)_100%)] z-10 transition-opacity duration-500',
          status === 'CRITICAL' && 'opacity-80',
          status === 'DEAD' && 'opacity-90'
        )}
      />
      <main className="relative z-20 flex-1 h-full w-full overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 md:p-6 lg:p-8">
        {/* The Villain Timer - Top Center */}
        <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-30">
          <div
            className={clsx(
              'font-horror text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-red-600 drop-shadow-[0_2px_10px_rgba(255,117,24,0.5)] transition-all duration-300',
              status === 'CRITICAL' && 'animate-pulse scale-110',
              status === 'DEAD' && 'from-red-900 to-black'
            )}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* The Obsidian Tablet - Centered Glass Container */}
        <div className="max-w-4xl w-full h-full max-h-[85vh] flex flex-col my-auto">
          {/* Glassmorphism Card with Reactive Border + Obsidian Texture */}
          <div
            className={clsx(
              'flex-1 bg-black/40 bg-obsidian backdrop-blur-2xl border rounded-3xl shadow-2xl transition-all duration-500 flex flex-col overflow-hidden relative',
              getBorderGlow(),
              lastStrokeWasPunished && 'animate-glitch',
              showFlowState && 'animate-flow-shimmer'
            )}
          >
            {/* Flow State Overlay - Footer Level Center */}
            {showFlowState && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom duration-300">
                <div className="text-2xl md:text-3xl font-['Creepster'] text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-purple-400 to-green-400 drop-shadow-[0_0_20px_rgba(132,204,22,0.8)] animate-pulse">
                  FLOW STATE!
                </div>
              </div>
            )}
            {/* Header Inside Glass - Tactical HUD */}
            <div className="flex-none flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/5">
              <div className="flex items-center gap-2 md:gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-400 hover:text-gray-200 hover:bg-white/5 h-8 w-8 p-0 md:hidden"
                  title="Toggle Crypt"
                >
                  <Icon icon="solar:hamburger-menu-bold" className="size-4" />
                </Button>
                {/* Tactical Stats Display */}
                <div className="flex items-center gap-2 md:gap-4 bg-black/50 border border-white/5 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                  <span className="text-xs font-mono text-gray-400 tracking-widest">
                    {wpm} WPM
                  </span>
                  <div className="w-px h-3 bg-white/10" />
                  <span className="text-xs font-mono text-gray-400 tracking-widest">
                    {crypt.currentDoc?.wordCount || 0} WORDS
                  </span>
                  <div className="w-px h-3 bg-white/10" />
                  <span className="text-xs font-mono text-emerald-400 tracking-widest flex items-center gap-1">
                    <Icon icon="solar:check-circle-bold" className="size-3 animate-pulse" />
                    SAVED
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-200 hover:bg-white/5 h-8 w-8 p-0"
                  onClick={handleExportDocx}
                  disabled={!crypt.currentDoc?.content || crypt.currentDoc.content.trim().length === 0}
                  title="Export as DOCX"
                >
                  <Icon icon="solar:document-text-bold" className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-200 hover:bg-white/5 h-8 w-8 p-0 hidden md:inline-flex"
                  onClick={handleExportTxt}
                  disabled={!crypt.currentDoc?.content || crypt.currentDoc.content.trim().length === 0}
                  title="Download as TXT"
                >
                  <Icon icon="solar:download-bold" className="size-4" />
                </Button>
              </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
              <Textarea
                ref={textareaRef}
                value={crypt.currentDoc?.content || ''}
                onChange={handleInput}
                placeholder="The ink is running dry..."
                disabled={status === 'DEAD'}
                className={clsx(
                  'w-full h-full bg-transparent border-none text-base md:text-lg lg:text-xl text-gray-100 leading-relaxed md:leading-loose resize-none focus:ring-0 focus:outline-none placeholder:text-gray-600 font-["Merriweather"] p-0 rounded-none shadow-none transition-all duration-500',
                  'cursed-parchment glowing-caret',
                  isWarning && 'text-lime-500/80',
                  status === 'WARNING' && 'opacity-85 blur-[0.3px]',
                  status === 'CRITICAL' && 'opacity-70 blur-[0.5px] text-red-200',
                  status === 'MOCKERY' && 'text-purple-300 animate-shake',
                  status === 'DEAD' && 'animate-ink-bleed',
                  isPoltergeistActive && 'animate-flicker-black',
                  isTyping && 'animate-etch-in'
                )}
              />
            </div>

            {/* Footer Inside Glass */}
            <div className="flex-none px-4 md:px-6 py-3 border-t border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <button
                  onClick={() => setIsZenMode(!isZenMode)}
                  className={clsx(
                    'bg-black/50 px-2 md:px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-colors',
                    isZenMode
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-gray-400 hover:text-gray-300'
                  )}
                  title="Protects against the Reaper. Good for editing."
                >
                  <span className="hidden md:inline">WARDING: {isZenMode ? 'ON' : 'OFF'}</span>
                  <span className="md:hidden">ZEN: {isZenMode ? 'ON' : 'OFF'}</span>
                </button>
                {showPunishmentWarning && (
                  <span className="bg-purple-900/50 px-2 md:px-3 py-1 rounded-full text-xs font-mono text-purple-400 animate-pulse">
                    WEAK VOCAB
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sessionGoal}
                  onChange={(e) => setSessionGoal(Number(e.target.value))}
                  className="bg-black/50 border border-white/10 rounded-full px-2 md:px-3 py-1 w-16 md:w-20 text-center text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  min="100"
                  step="100"
                  placeholder="Goal"
                />
                <button
                  onClick={() => {
                    setWpm(0);
                    startTimeRef.current = Date.now();
                    revive();
                    setTimeout(() => textareaRef.current?.focus(), 100);
                  }}
                  className="p-2 md:p-3 rounded-full bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-black transition-all"
                  title="Resurrect Draft"
                >
                  <Icon icon="solar:restart-bold" className="size-3 md:size-4" />
                </button>
              </div>
            </div>

            {/* The Blood Vial - Goal Progress Bar at Bottom */}
            {sessionGoal > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/50 rounded-b-3xl overflow-hidden">
                <div
                  className={clsx(
                    'h-full bg-red-600 shadow-[0_0_10px_#dc2626] transition-all duration-500',
                    !pactFulfilled && 'animate-pulse',
                    pactFulfilled && 'bg-yellow-500 shadow-[0_0_10px_#eab308]'
                  )}
                  style={{ width: `${getGoalProgress()}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Menu Buttons */}
      <div className="fixed top-4 right-4 z-30 flex gap-2">
        <Button
          variant="ghost"
          onClick={() => setShowSettingsModal(true)}
          className="bg-black/40 backdrop-blur-xl border border-white/5 hover:bg-white/5 text-gray-400 hover:text-gray-200 h-10 w-10 p-0"
          title="Settings"
        >
          <Icon icon="solar:settings-bold" className="size-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowGrimoireModal(true)}
          className="bg-black/40 backdrop-blur-xl border border-orange-900/30 hover:bg-orange-900/20 text-orange-500 hover:text-orange-400 h-10 w-10 p-0"
          title="The Grimoire (Keyboard Shortcuts)"
        >
          <Icon icon="solar:book-bold" className="size-5" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowAboutModal(true)}
          className="bg-black/40 backdrop-blur-xl border border-white/5 hover:bg-white/5 text-gray-400 hover:text-gray-200 h-10 w-10 p-0"
          title="About DeadLine"
        >
          <Icon icon="solar:question-circle-bold" className="size-5" />
        </Button>
      </div>

      {/* Remove old layout */}
      <div className="hidden">
              <Card className="lg:col-span-3 bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={clsx(
                          'w-3 h-3 rounded-full',
                          status === 'SAFE' && 'bg-emerald-500 animate-pulse',
                          status === 'WARNING' && 'bg-amber-500 animate-pulse',
                          status === 'CRITICAL' && 'bg-red-500 animate-pulse',
                          status === 'MOCKERY' && 'bg-purple-500 animate-ping',
                          status === 'DEAD' && 'bg-red-900'
                        )}
                      />
                      <span className="text-sm text-zinc-400">
                        {status === 'DEAD'
                          ? 'Session Ended'
                          : status === 'MOCKERY'
                            ? 'Nice try, cheater...'
                            : 'Writing Session Active'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>Auto-save: On</span>
                      <span>•</span>
                      <span>Word count: {crypt.currentDoc?.wordCount || 0}</span>
                    </div>
                  </div>
                  <Textarea
                    ref={textareaRef}
                    value={crypt.currentDoc?.content || ''}
                    onChange={handleInput}
                    placeholder="The ink is running dry..."
                    disabled={status === 'DEAD'}
                    className={clsx(
                      'min-h-[400px] bg-transparent border-none text-xl text-zinc-300 leading-loose resize-none focus:ring-0 focus:outline-none placeholder:text-zinc-600 caret-rose-600 font-["Merriweather"] p-0 rounded-none shadow-none transition-all duration-500',
                      status === 'WARNING' && 'opacity-85 blur-[0.3px]',
                      status === 'CRITICAL' && 'opacity-70 blur-[0.5px] text-red-200',
                      status === 'MOCKERY' && 'text-purple-300 animate-shake',
                      status === 'DEAD' && 'animate-evaporate'
                    )}
                  />
                </CardContent>
              </Card>
            </div>

      {/* Death Overlay - YOU DIED! (Cursed Artifact) */}
      {showDeathModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 backdrop-blur-xl p-4 md:p-6 py-16 md:py-20 animate-in fade-in duration-500">
          {/* The 3D Tombstone Container - Cursed Object */}
          <div className="relative w-full max-w-2xl my-auto max-h-[90vh] overflow-visible bg-gradient-to-b from-zinc-700 to-zinc-900 bg-noise rounded-t-[40px] md:rounded-t-[50px] rounded-b-lg border-4 border-zinc-700 border-b-8 border-b-black/50 shadow-[0_0_60px_rgba(220,38,38,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] animate-pulse-slow animate-rise-from-mist">
            {/* Content Wrapper with Compact Padding */}
            <div className="px-6 py-6 md:px-8 md:py-8 overflow-y-auto max-h-[80vh]">
            {/* The Integrated Ghost - Glowing from Inside Stone */}
            <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 z-10">
              <Icon
                icon="solar:ghost-bold"
                className="w-16 h-16 md:w-20 md:h-20 text-red-500/80 drop-shadow-[0_2px_10px_rgba(220,38,38,0.8)] animate-bounce"
              />
            </div>

            {/* YOU DIED! Headline */}
            <div className="text-center pt-6 md:pt-8 mb-2">
              <h1 className="font-horror text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-[0_5px_0_rgba(0,0,0,1)] leading-none">
                YOU DIED
              </h1>
            </div>

            {/* Brutal Epitaph */}
            <div className="text-center my-3 space-y-2">
              <p className="text-base md:text-lg font-['Playfair_Display'] text-gray-300 italic leading-relaxed">
                Here lies <span className="text-6xl md:text-7xl lg:text-8xl font-horror text-white drop-shadow-xl not-italic block my-2">{crypt.currentDoc?.wordCount || 0}</span> words
              </p>
              <p className="text-base md:text-lg font-['Playfair_Display'] text-gray-300 italic leading-relaxed">
                that could have been {crypt.currentDoc?.wordCount && crypt.currentDoc.wordCount > 250 ? 'a chapter' : 'a scene'}
              </p>
              <p className="text-lg md:text-xl font-['Playfair_Display'] text-red-400 font-bold not-italic mt-3">
                Lost to cowardice.
              </p>
            </div>

            {/* Cause of Death - Grunge Rubber Stamp */}
            <div className="flex justify-center my-4">
              <div className="inline-block -rotate-3 border-3 md:border-4 border-red-500 bg-red-500/10 px-3 md:px-4 py-1 md:py-1.5 rounded-lg opacity-90">
                <p className="text-red-500 font-horror text-base md:text-lg lg:text-xl uppercase tracking-widest">
                  CAUSE: HESITATION
                </p>
              </div>
            </div>

            {/* Brutal Quote */}
            <div className="text-center my-3 px-4">
              <p className="text-sm md:text-base font-mono text-gray-500 italic leading-relaxed">
                "The only thing we have to fear is fear itself—<br />
                and the blank page you couldn't fill."
              </p>
            </div>

            {/* Session Stats - Rubbing it in */}
            {sessionStats.deaths > 1 && (
              <div className="text-center my-3 px-4 py-3 bg-black/30 rounded-lg border border-red-900/30">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">This Session</p>
                <p className="text-sm text-red-400 font-mono">
                  Death #{sessionStats.deaths} • {sessionStats.deaths === 2 ? 'Twice' : sessionStats.deaths === 3 ? 'Three times' : `${sessionStats.deaths} times`} you've failed
                </p>
              </div>
            )}

            {/* Action Buttons - Darker & Integrated */}
            <div className="w-full md:w-3/4 mx-auto space-y-2 md:space-y-3 mt-6">
              {/* Try Again Button */}
              <button
                onClick={() => {
                  setWpm(0);
                  startTimeRef.current = Date.now();
                  revive();
                  setTimeout(() => textareaRef.current?.focus(), 100);
                }}
                className="w-full bg-red-800 hover:bg-red-700 text-white font-horror text-lg md:text-xl lg:text-2xl px-6 md:px-8 py-2.5 md:py-3 rounded-full border-b-6 md:border-b-8 border-red-950 shadow-lg hover:scale-105 active:border-b-0 active:translate-y-2 transition-all uppercase tracking-widest"
              >
                TRY AGAIN
              </button>

              {/* Share Shame Button */}
              <button
                onClick={() => {
                  const text = `I died at ${crypt.currentDoc?.wordCount || 0} words on DeadLine! 💀`;
                  if (navigator.share) {
                    navigator.share({ text, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(text);
                    showNotification('Shame copied to clipboard!');
                  }
                }}
                className="w-full bg-lime-700 hover:bg-lime-600 text-white font-horror text-base md:text-lg px-5 md:px-6 py-2 md:py-2.5 rounded-full border-b-6 md:border-b-8 border-lime-900 shadow-lg hover:scale-105 active:border-b-0 active:translate-y-2 transition-all uppercase tracking-widest"
              >
                SHARE SHAME
              </button>
            </div>

            {/* Decorative Corner Skulls - Hidden on small screens */}
            <div className="hidden md:block absolute top-4 left-4 opacity-20">
              <Icon icon="solar:skull-bold" className="size-8 text-red-500" />
            </div>
            <div className="hidden md:block absolute top-4 right-4 opacity-20">
              <Icon icon="solar:skull-bold" className="size-8 text-red-500" />
            </div>
            <div className="hidden md:block absolute bottom-4 left-4 opacity-20">
              <Icon icon="solar:skull-bold" className="size-6 text-red-500" />
            </div>
            <div className="hidden md:block absolute bottom-4 right-4 opacity-20">
              <Icon icon="solar:skull-bold" className="size-6 text-red-500" />
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-zinc-900 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-lg px-6 py-4 flex items-center gap-3">
            <Icon icon="solar:check-circle-bold" className="size-5 text-emerald-400" />
            <p className="font-mono text-sm text-zinc-200">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Powered by Kiro Badge */}
      <div className="hidden md:block fixed bottom-4 right-4 z-40">
        <span
          className="text-zinc-800 text-[10px] font-mono tracking-widest uppercase hover:text-zinc-500 transition-colors cursor-default"
          title="Powered by Kiro Specs & Steering"
        >
          ALGORITHM: ACTIVE
        </span>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50 p-4 md:p-6">
          <Card className="max-w-lg w-full bg-zinc-900/90 border border-zinc-800/50 shadow-xl">
            <CardHeader>
              <CardTitle className="font-['Playfair_Display'] text-2xl text-zinc-100 flex items-center gap-2">
                <Icon icon="solar:info-circle-bold" className="size-6 text-emerald-400" />
                About DeadLine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-zinc-300">
                <p className="leading-relaxed">
                  <span className="font-bold text-emerald-400">DeadLine</span> is a writing tool that
                  uses AI to analyze your text in real-time.
                </p>
                <p className="leading-relaxed">
                  Every keystroke extends your deadline. But stop typing, and the{' '}
                  <span className="font-bold text-red-400">Reaper</span> claims your words.
                </p>
                <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-4 space-y-2">
                  <p className="font-mono text-sm text-amber-400 font-bold">⚠ WARNING</p>
                  <p className="text-sm leading-relaxed">
                    The AI detects weak vocabulary and gibberish. Key-mashing or repetitive words will{' '}
                    <span className="font-bold text-purple-400">NOT</span> extend your time.
                  </p>
                </div>
                <p className="text-sm text-zinc-500 italic">
                  Write with purpose. Write with permanence. Words carved in stone.
                </p>
              </div>
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => setShowAboutModal(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Got it
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* The Grimoire - Keyboard Shortcuts Modal */}
      {showGrimoireModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50 p-4 md:p-6">
          <Card className="max-w-lg w-full bg-zinc-900/90 border-2 border-orange-900/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="font-['Creepster'] text-3xl text-orange-500 flex items-center gap-3 tracking-wider">
                <Icon icon="solar:book-bold" className="size-8" />
                THE GRIMOIRE
              </CardTitle>
              <p className="text-sm text-gray-400 mt-2">Ancient keyboard incantations</p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Shortcuts List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-gray-300">Salvage Manuscript</span>
                  <kbd className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-gray-400">
                    ⌘ S
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-gray-300">Cast Sanctuary (Zen Mode)</span>
                  <kbd className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-gray-400">
                    ⌘ ⇧ Z
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-gray-300">Open The Crypt</span>
                  <kbd className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-gray-400">
                    ⌘ K
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-gray-300">Summon Grimoire</span>
                  <kbd className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-gray-400">
                    ?
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5">
                  <span className="text-gray-300">Dismiss</span>
                  <kbd className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-gray-400">
                    ESC
                  </kbd>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <p className="text-xs text-gray-600 font-mono">
                  Press <span className="text-orange-500">?</span> anytime
                </p>
                <Button
                  onClick={() => setShowGrimoireModal(false)}
                  className="bg-orange-600 hover:bg-orange-700 text-black font-['Creepster'] tracking-wider"
                >
                  CLOSE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50 p-4 md:p-6">
          <Card className="max-w-lg w-full bg-zinc-900/90 border border-zinc-800/50 shadow-xl">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="font-['Playfair_Display'] text-2xl text-zinc-100 flex items-center gap-2">
                <Icon icon="solar:settings-bold" className="size-6 text-gray-400" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Timer Duration */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300 block">
                  Timer Duration (seconds)
                </label>
                <input
                  type="number"
                  defaultValue="10"
                  min="5"
                  max="30"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-zinc-500">
                  How long before the Reaper claims your words
                </p>
              </div>

              {/* AI Detection Sensitivity */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300 block">
                  AI Detection
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Weak Word Detection</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  Warns you about repetitive or weak vocabulary
                </p>
              </div>

              {/* Session Goal */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300 block">
                  Default Session Goal (words)
                </label>
                <input
                  type="number"
                  value={sessionGoal}
                  onChange={(e) => setSessionGoal(Number(e.target.value))}
                  min="100"
                  step="100"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-zinc-500">
                  Your target word count for each session
                </p>
              </div>

              {/* Audio */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-300 block">
                  Audio Effects
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Heartbeat & Sounds</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  Enable atmospheric audio during writing
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <Button
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    showNotification('Settings saved');
                    setShowSettingsModal(false);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </>
  );
}
