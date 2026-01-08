import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { horrorAudio } from '@/lib/audio/HorrorAudio';
import { useSeance } from '@/hooks/useSeance';

const GHOST_SUGGESTIONS = [
  "The shadows whisper secrets only the dead can hear...",
  "In the darkness between heartbeats, something watches...",
  "They say the house remembers everything...",
  "The mirror shows reflections that shouldn't exist...",
  "At midnight, the walls begin to breathe...",
  "She heard her name called from the empty room...",
  "The photograph changed when no one was looking...",
  "Something cold touched my shoulder in the dark...",
  "The music box plays a song no one taught it...",
  "I found a door in my house that wasn't there yesterday...",
];

export function SeanceEditor() {
  const [content, setContent] = useState('');
  const [manualGhostText, setManualGhostText] = useState('');
  const [quillPos, setQuillPos] = useState({ x: 0, y: 0 });
  const [showQuill, setShowQuill] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the séance hook for ghost intervention (AI-powered)
  const { presence, ghostSuggestion, isGhostTyping, acceptGhostSuggestion } = useSeance(content, setContent);

  // Show manual ghost suggestions periodically
  useEffect(() => {
    if (content.length > 0 && content.length % 50 === 0 && !manualGhostText) {
      const randomSuggestion = GHOST_SUGGESTIONS[Math.floor(Math.random() * GHOST_SUGGESTIONS.length)];
      setManualGhostText(randomSuggestion);
      horrorAudio.playHover();
    }
  }, [content, manualGhostText]);

  // Track cursor position for quill
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setQuillPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setShowQuill(true);
    }
  };

  const handleMouseLeave = () => {
    setShowQuill(false);
  };

  const handleAcceptSuggestion = () => {
    if (manualGhostText) {
      acceptGhostSuggestion(manualGhostText);
      setManualGhostText('');
      horrorAudio.playClick();
    }
  };

  return (
    <div 
      className="relative h-screen w-screen overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #1a1410 0%, #2a231d 50%, #1a1410 100%)',
        cursor: 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-sm flex items-center px-5 gap-4 z-50 border-b border-amber-900/30">
        <Link
          to="/hub"
          className="flex items-center gap-2 text-amber-600 hover:text-amber-400 transition-colors px-3 py-2"
        >
          <Icon icon="solar:arrow-left-bold" className="size-5" />
          <span className="text-sm">Hub</span>
        </Link>

        <div className="flex items-center gap-3">
          <Icon icon="solar:ghost-bold" className="size-6 text-amber-500" />
          <h1 className="font-['Playfair_Display'] text-2xl text-amber-500 uppercase tracking-wider">
            The Séance
          </h1>
        </div>

        <div className="flex-1" />

        <div className="text-xs text-amber-600 font-mono">
          {content.split(' ').filter(w => w).length} words channeled
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 pt-16 pb-0 flex">
        {/* Central Paper Area */}
        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-8"
        >
          <div 
            className="relative w-full max-w-4xl h-full max-h-[600px] p-12 rounded-lg shadow-2xl"
            style={{
              background: 'linear-gradient(to bottom, #f4f1ea 0%, #e8e4d8 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}
          >
            {/* Paper texture overlay */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none rounded-lg"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
              }}
            />

            {/* AI Ghost Suggestion (Whisper) */}
            {ghostSuggestion && !isGhostTyping && (
              <div className="absolute top-12 left-12 right-12 pointer-events-none z-20">
                <p 
                  className="font-serif text-lg italic text-purple-400 opacity-50 animate-pulse"
                  style={{
                    textShadow: '0 0 15px rgba(168, 85, 247, 0.6)',
                  }}
                >
                  {ghostSuggestion}
                </p>
                <button
                  onClick={() => {
                    acceptGhostSuggestion(ghostSuggestion);
                    horrorAudio.playClick();
                  }}
                  className="mt-2 px-3 py-1 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 text-sm rounded pointer-events-auto transition-colors border border-purple-500/30"
                >
                  Accept the Spirit's Whisper
                </button>
              </div>
            )}

            {/* Manual Ghost Text Layer (fallback) */}
            {manualGhostText && !isGhostTyping && !ghostSuggestion && (
              <div className="absolute top-12 left-12 right-12 pointer-events-none">
                <p 
                  className="font-serif text-xl italic text-blue-400 opacity-40 animate-pulse"
                  style={{
                    textShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                  }}
                >
                  {manualGhostText}
                </p>
                <button
                  onClick={handleAcceptSuggestion}
                  className="mt-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 text-sm rounded pointer-events-auto transition-colors"
                >
                  Channel this message
                </button>
              </div>
            )}

            {/* Ghost Typing Indicator */}
            {isGhostTyping && (
              <div className="absolute top-12 left-12 right-12 pointer-events-none z-30">
                <p 
                  className="font-serif text-xl italic text-purple-300 opacity-70 animate-pulse"
                  style={{
                    textShadow: '0 0 20px rgba(216, 180, 254, 0.8)',
                  }}
                >
                  ✨ The spirits are manifesting through the veil...
                </p>
              </div>
            )}

            {/* Text Editor */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Place your hands upon the board... The spirits will guide your words..."
              disabled={isGhostTyping}
              className={`relative z-10 w-full h-full bg-transparent border-none outline-none resize-none font-serif text-xl text-stone-800 placeholder:text-stone-400 placeholder:italic ${
                isGhostTyping ? 'cursor-not-allowed' : ''
              }`}
              style={{
                caretColor: 'transparent', // Hide default caret
                lineHeight: '1.8',
              }}
              spellCheck={false}
            />

            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-800/30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-800/30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-800/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-800/30" />
          </div>
        </div>

        {/* Right Panel - The Connection */}
        <div className="w-80 bg-black/60 backdrop-blur-sm border-l border-amber-900/30 p-6 overflow-y-auto">
          <h2 className="text-xl font-['Playfair_Display'] text-amber-500 mb-6 uppercase tracking-wider">
            The Connection
          </h2>

          {/* Spirit Presence */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-amber-600 font-mono">SPIRIT PRESENCE</span>
              <span className="text-sm text-amber-500 font-mono">{Math.round(presence)}%</span>
            </div>
            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-amber-900/50">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                style={{ 
                  width: `${presence}%`,
                  boxShadow: presence > 50 ? '0 0 10px rgba(251, 191, 36, 0.6)' : 'none',
                }}
              />
            </div>
            <p className="text-xs text-amber-700 mt-2 italic">
              {presence > 75 ? 'The veil is thin...' : 
               presence > 50 ? 'Presence growing stronger...' :
               presence > 25 ? 'Faint whispers detected...' :
               'Silence...'}
            </p>
            {isGhostTyping && (
              <p className="text-xs text-blue-400 mt-2 animate-pulse font-bold">
                ⚡ THE SPIRITS ARE INTERVENING
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="p-4 bg-amber-900/10 border border-amber-900/30 rounded-lg">
            <h3 className="text-sm font-bold text-amber-500 mb-2 uppercase">How to Channel</h3>
            <ul className="text-xs text-amber-700 space-y-2">
              <li>• Write to summon the spirits</li>
              <li>• Ghost text appears as guidance</li>
              <li>• Accept suggestions to strengthen the connection</li>
              <li>• The more you write, the stronger the presence</li>
            </ul>
          </div>

          {/* Atmosphere */}
          <div className="mt-8 text-center">
            <Icon 
              icon="solar:ghost-bold" 
              className="size-24 text-amber-900/20 mx-auto animate-pulse"
            />
            <p className="text-xs text-amber-800 italic mt-2">
              "The dead speak through the living..."
            </p>
          </div>
        </div>
      </div>

      {/* The Quill (Custom Cursor) */}
      {showQuill && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: quillPos.x,
            top: quillPos.y,
            transform: 'translate(-20%, -80%) rotate(-45deg)',
          }}
        >
          {/* Black Quill Pen */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Feather shaft */}
            <path
              d="M5 35 L20 20 L22 22 L7 37 Z"
              fill="#1a1a1a"
              stroke="#000000"
              strokeWidth="0.5"
            />
            {/* Feather body */}
            <path
              d="M20 20 Q25 15 30 5 Q28 10 25 15 Q22 18 20 20 Z"
              fill="#2a2a2a"
              stroke="#000000"
              strokeWidth="0.5"
            />
            {/* Feather details (barbs) */}
            <path
              d="M22 18 Q24 14 26 10"
              stroke="#1a1a1a"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M23 17 Q25 13 27 9"
              stroke="#1a1a1a"
              strokeWidth="0.5"
              fill="none"
            />
            <path
              d="M24 16 Q26 12 28 8"
              stroke="#1a1a1a"
              strokeWidth="0.5"
              fill="none"
            />
            {/* Nib point */}
            <path
              d="M5 35 L7 37 L8 36 L6 34 Z"
              fill="#000000"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
