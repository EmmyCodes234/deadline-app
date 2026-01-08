import { FRAGMENT_SPECS, type FragmentSpec } from '@/data/fragments';
import { Flame, Skull, Ghost } from 'lucide-react';

interface RitualSelectorProps {
  onSelectRitual: (fragment: FragmentSpec) => void;
  selectedRitualId: string | null;
}

export function RitualSelector({ onSelectRitual, selectedRitualId }: RitualSelectorProps) {
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'novice':
        return <Flame className="w-4 h-4" />;
      case 'intermediate':
        return <Skull className="w-4 h-4" />;
      case 'master':
        return <Ghost className="w-4 h-4" />;
      default:
        return <Flame className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'novice':
        return 'text-green-400';
      case 'intermediate':
        return 'text-orange-400';
      case 'master':
        return 'text-red-400';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 font-mono">
        Select Fragment
      </h3>
      {FRAGMENT_SPECS.map((ritual) => (
        <button
          key={ritual.id}
          onClick={() => {
            onSelectRitual(ritual);
          }}
          className={clsx(
            'w-full text-left p-3 rounded-lg border transition-all duration-200',
            selectedRitualId === ritual.id
              ? 'bg-purple-900/30 border-purple-500/50 shadow-lg shadow-purple-500/20'
              : 'bg-stone-800/30 border-stone-700/50 hover:border-purple-500/30 hover:bg-stone-800/50'
          )}
        >
          <div className="flex items-start gap-2">
            <div className={clsx('mt-0.5', getDifficultyColor(ritual.difficulty))}>
              {getDifficultyIcon(ritual.difficulty)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-stone-200 mb-1">
                {ritual.title}
              </div>
              <div className="text-xs text-stone-400 leading-relaxed">
                {ritual.description}
              </div>
              <div className="text-xs text-stone-500 mt-2">
                {ritual.content.filter(p => p.type === 'input').length} missing fragments
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function clsx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
