import { useState, useRef, useEffect } from 'react';
import type { FragmentSpec } from '@/data/fragments';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

interface FragmentEditorProps {
  fragment: FragmentSpec;
  onComplete: (completedStory: string) => void;
}

export function FragmentEditor({ fragment, onComplete }: FragmentEditorProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [lockedInputs, setLockedInputs] = useState<Record<string, boolean>>({});
  const [burningInputs, setBurningInputs] = useState<Record<string, boolean>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Check if all inputs are filled
  const isComplete = fragment.content
    .filter(piece => piece.type === 'input')
    .every(piece => piece.type === 'input' && inputs[piece.id]?.trim());

  useEffect(() => {
    if (isComplete) {
      // Generate completed story
      const story = fragment.content
        .map(piece => {
          if (piece.type === 'text') return piece.value;
          return inputs[piece.id] || '';
        })
        .join('');
      
      onComplete(story);
    }
  }, [isComplete, fragment.content, inputs, onComplete]);

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleInputComplete = (id: string) => {
    if (inputs[id]?.trim() && !lockedInputs[id]) {
      // Start burning animation
      setBurningInputs(prev => ({ ...prev, [id]: true }));
      
      // Play restoration sound
      horrorAudio.playClick();
      
      // Lock after brief burn flash
      setTimeout(() => {
        setLockedInputs(prev => ({ ...prev, [id]: true }));
        setBurningInputs(prev => ({ ...prev, [id]: false }));
      }, 400);
      
      // Move to next input after burn animation
      setTimeout(() => {
        const inputPieces = fragment.content.filter(p => p.type === 'input');
        const currentIndex = inputPieces.findIndex(p => p.type === 'input' && p.id === id);
        if (currentIndex < inputPieces.length - 1) {
          const nextPiece = inputPieces[currentIndex + 1];
          if (nextPiece.type === 'input') {
            inputRefs.current[nextPiece.id]?.focus();
          }
        }
      }, 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-['Playfair_Display'] text-stone-200 mb-2">
          {fragment.title}
        </h2>
        <p className="text-stone-400 italic">{fragment.description}</p>
      </div>

      <div className="text-xl leading-relaxed font-serif text-stone-300">
        {fragment.content.map((piece, index) => {
          if (piece.type === 'text') {
            return (
              <span key={index} className="whitespace-pre-wrap">
                {piece.value}
              </span>
            );
          }

          const isFilled = inputs[piece.id]?.trim();
          const isFocused = focusedInput === piece.id;
          const isLocked = lockedInputs[piece.id];
          const isBurning = burningInputs[piece.id];

          return (
            <span key={index} className="inline-block relative group">
              <input
                ref={el => {
                  if (el) inputRefs.current[piece.id] = el;
                }}
                type="text"
                value={inputs[piece.id] || ''}
                onChange={e => !isLocked && handleInputChange(piece.id, e.target.value)}
                onFocus={() => !isLocked && setFocusedInput(piece.id)}
                onBlur={() => setFocusedInput(null)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInputComplete(piece.id);
                  }
                }}
                placeholder={piece.prompt}
                disabled={isLocked}
                className={`
                  inline-block min-w-[120px] max-w-[300px] px-3 py-1 mx-1
                  font-mono text-lg font-bold
                  border-2 rounded
                  transition-all duration-500
                  ${isBurning
                    ? 'bg-orange-600/50 text-orange-200 border-orange-400 shadow-2xl shadow-orange-500/80 scale-105'
                    : isLocked
                    ? 'bg-black/80 text-stone-600 border-stone-900 cursor-not-allowed shadow-inner'
                    : !isFilled && !isFocused
                    ? 'bg-zinc-900 text-transparent border-zinc-800 cursor-text'
                    : isFilled
                    ? 'bg-transparent text-amber-400 border-amber-500/70 shadow-lg shadow-amber-500/30 animate-pulse'
                    : 'bg-zinc-800 text-amber-300 border-amber-500 shadow-lg shadow-amber-500/20'
                  }
                  focus:outline-none focus:ring-2 focus:ring-amber-500/50
                  placeholder:text-zinc-700 placeholder:text-sm placeholder:font-normal
                `}
                style={{
                  width: isFilled 
                    ? `${Math.max(inputs[piece.id].length * 12, 120)}px`
                    : '120px',
                  textShadow: isBurning 
                    ? '0 0 20px rgba(249, 115, 22, 1), 0 0 40px rgba(249, 115, 22, 0.5)' 
                    : isFilled && !isLocked 
                    ? '0 0 10px rgba(251, 191, 36, 0.8)' 
                    : 'none',
                }}
              />
              
              {/* Tooltip on hover */}
              {!isFilled && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-stone-950 border border-amber-500/50 rounded text-xs text-stone-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {piece.category}
                </div>
              )}
            </span>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-8 p-4 bg-amber-900/20 border-2 border-amber-500/50 rounded-lg animate-in fade-in duration-500">
          <p className="text-amber-400 text-center font-bold">
            ✨ Fragment Restored! The story has been resurrected.
          </p>
        </div>
      )}
    </div>
  );
}
