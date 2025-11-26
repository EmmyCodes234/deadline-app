import { useState } from 'react';
import { type ReaperStatus } from '../hooks/useReaper';

interface EditorProps {
  status: ReaperStatus;
  onKeyPress: () => void;
}

export function Editor({ status, onKeyPress }: EditorProps) {
  const [text, setText] = useState('');

  const handleKeyDown = () => {
    onKeyPress();
  };

  const getTextClasses = () => {
    if (status === 'CRITICAL') {
      return 'animate-pulse blur-[0.5px]';
    }
    return '';
  };

  if (status === 'DEAD') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif text-7xl font-bold text-red-500 tracking-tight">
              SILENCED
            </h1>
            <div className="h-1 w-32 bg-red-500/20 mx-auto" />
          </div>
          <p className="font-mono text-sm text-zinc-500 tracking-wide">
            The Reaper has claimed your words
          </p>
          <p className="font-mono text-xs text-zinc-700">
            Refresh to try again
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-[75vh] bg-transparent resize-none outline-none text-xl leading-relaxed font-serif text-zinc-100 placeholder:text-zinc-700 placeholder:italic ${getTextClasses()}`}
        placeholder="Begin writing... your time is already running out."
        autoFocus
        spellCheck={false}
      />
      {text.length > 0 && (
        <div className="absolute bottom-4 right-4 font-mono text-xs text-zinc-700 tabular-nums">
          {text.split(/\s+/).filter(Boolean).length} words
        </div>
      )}
    </div>
  );
}
