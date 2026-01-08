import { Circle, Flame, AlertTriangle } from 'lucide-react';
import type { RitualRequirement } from '@/data/ritualSpecs';

interface RitualSpecListProps {
  requirements: RitualRequirement[];
}

export function RitualSpecList({ requirements }: RitualSpecListProps) {
  return (
    <div className="space-y-3">
      {requirements.map((req) => {
        const isRequired = req.type === 'required';
        const icon = req.violated ? (
          <AlertTriangle className="w-5 h-5 text-red-500" />
        ) : req.met ? (
          <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
        ) : (
          <Circle className="w-5 h-5 text-zinc-700" />
        );

        const textColor = req.violated
          ? 'text-red-500'
          : req.met
          ? 'text-amber-500'
          : 'text-zinc-600';

        return (
          <div
            key={req.id}
            className="flex items-start gap-3 transition-all duration-300"
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${textColor} transition-colors duration-300`}>
                {req.text}
              </p>
              {req.violated && (
                <p className="text-xs text-red-400 italic mt-1">
                  Taboo violated! The ritual is tainted.
                </p>
              )}
              {req.met && isRequired && (
                <p className="text-xs text-amber-400 italic mt-1">
                  Reagent acquired
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
