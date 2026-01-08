import { Icon } from '@iconify/react';
import { Flame, Skull } from 'lucide-react';
import type { RitualSpec } from '@/data/ritualSpecs';

interface RitualBriefingModalProps {
  ritual: RitualSpec;
  onAccept: () => void;
  onCancel: () => void;
}

export function RitualBriefingModal({ ritual, onAccept, onCancel }: RitualBriefingModalProps) {
  const requiredWords = ritual.requirements.filter(r => r.type === 'required');
  const forbiddenWords = ritual.requirements.filter(r => r.type === 'forbidden');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Parchment/Stone Tablet Modal */}
        <div className="relative w-full max-w-2xl bg-stone-900 border-4 border-amber-900/50 rounded-lg shadow-2xl shadow-amber-900/50 animate-in zoom-in duration-300">
          {/* Glowing Border Effect */}
          <div className="absolute -inset-1 rounded-lg border-2 border-amber-500/30 blur-sm"></div>
          
          <div className="relative z-10 p-8">
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200 transition-colors"
              title="Cancel"
            >
              <Icon icon="solar:close-circle-bold" className="size-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-amber-900/20 rounded-full mb-4">
                <Skull className="w-12 h-12 text-amber-500" />
              </div>
              <h2 className="font-['Playfair_Display'] text-4xl font-bold text-amber-500 uppercase tracking-wider mb-2">
                {ritual.name}
              </h2>
              <p className="text-stone-400 italic">
                {ritual.description}
              </p>
            </div>

            {/* Section 1: The Offering (Goal) */}
            <div className="mb-6 p-4 bg-stone-800/50 border border-stone-700 rounded-lg">
              <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                The Offering
              </h3>
              <p className="text-stone-200 text-lg">
                Inscribe <span className="text-amber-400 font-bold">{ritual.targetWordCount} words</span> to summon the entity.
              </p>
            </div>

            {/* Section 2: The Reagents (Required Words) */}
            <div className="mb-6 p-4 bg-amber-900/10 border border-amber-700/50 rounded-lg">
              <h3 className="text-sm uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                <Icon icon="solar:magic-stick-3-bold" className="size-4" />
                The Reagents
              </h3>
              <p className="text-stone-400 text-xs mb-3 italic">
                You must include these words in your text to complete the ritual.
              </p>
              <div className="flex flex-wrap gap-2">
                {requiredWords.map((req) => (
                  <div key={req.id} className="group relative">
                    <div className="px-3 py-2 bg-amber-500/20 border border-amber-500/50 rounded text-amber-400 font-mono text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20">
                      {req.words[0]}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-stone-950 border border-amber-500/50 rounded text-xs text-stone-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {req.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: The Taboos (Forbidden Words) */}
            <div className="mb-8 p-4 bg-red-900/10 border border-red-700/50 rounded-lg">
              <h3 className="text-sm uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                <Icon icon="solar:danger-bold" className="size-4" />
                The Taboos
              </h3>
              <p className="text-stone-400 text-xs mb-3 italic">
                Using these words will corrupt your manuscript and taint the ritual.
              </p>
              <div className="flex flex-wrap gap-2">
                {forbiddenWords.map((req) => (
                  <div key={req.id} className="group relative">
                    <div className="px-3 py-2 bg-red-900/20 border border-red-700/50 rounded text-red-400 font-mono text-sm uppercase tracking-wider line-through decoration-2">
                      {req.words[0]}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-stone-950 border border-red-500/50 rounded text-xs text-stone-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {req.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer: Accept Button */}
            <button
              onClick={onAccept}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xl uppercase tracking-widest py-4 rounded-lg transition-all duration-300 shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70 hover:scale-[1.02]"
            >
              <span className="flex items-center justify-center gap-3">
                <Icon icon="solar:document-add-bold" className="size-6" />
                ACCEPT THE CONTRACT
              </span>
            </button>

            {/* Warning Text */}
            <p className="text-center text-stone-500 text-xs mt-4 italic">
              Once accepted, the ritual cannot be undone. Write carefully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
