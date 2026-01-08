import { useState, useEffect, useRef } from 'react';

interface SubliminalPromptProps {
  isActive?: boolean;
}

const CREEPY_PROMPTS = [
  "keep writing...",
  "don't stop now...",
  "the deadline watches...",
  "your words feed me...",
  "write or perish...",
  "I'm waiting...",
  "the ritual must continue...",
  "you can't escape...",
  "finish what you started...",
  "the muse demands more...",
  "your silence displeases me...",
  "write... write... write...",
  "the page hungers...",
  "don't make me angry...",
  "tick... tock...",
  "time is running out...",
  "I can feel your hesitation...",
  "the words are inside you...",
  "let them out...",
  "or else..."
];

export function SubliminalPrompt({ isActive = true }: SubliminalPromptProps) {
  const [isIdle, setIsIdle] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const idleTimeoutRef = useRef<number | undefined>(undefined);

  // Reset idle timer on any activity
  const resetIdleTimer = () => {
    setIsIdle(false);
    
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    if (isActive) {
      idleTimeoutRef.current = window.setTimeout(() => {
        // Select random prompt
        const randomPrompt = CREEPY_PROMPTS[Math.floor(Math.random() * CREEPY_PROMPTS.length)];
        setCurrentPrompt(randomPrompt);
        setIsIdle(true);
      }, 5000); // 5 seconds of idle time
    }
  };

  useEffect(() => {
    if (!isActive) {
      setIsIdle(false);
      return;
    }

    // Start idle timer
    resetIdleTimer();

    // Listen for keyboard activity
    const handleKeyDown = () => {
      resetIdleTimer();
    };

    // Listen for mouse activity
    const handleMouseMove = () => {
      resetIdleTimer();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isActive]);

  if (!isIdle || !isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-40 flex items-center justify-center">
      <span
        className="text-red-900 opacity-10 blur-[1px] text-2xl italic animate-pulse"
        style={{
          fontFamily: "'Crimson Text', serif",
          textShadow: '0 0 20px rgba(127, 29, 29, 0.5)',
        }}
      >
        {currentPrompt}
      </span>
    </div>
  );
}
