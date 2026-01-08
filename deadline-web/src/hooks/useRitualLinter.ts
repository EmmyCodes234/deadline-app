import { useState, useEffect, useCallback } from 'react';
import type { RitualSpec, RitualRequirement } from '@/data/ritualSpecs';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function useRitualLinter(spec: RitualSpec | null, content: string) {
  const [requirements, setRequirements] = useState<RitualRequirement[]>([]);
  const [summoningProgress, setSummoningProgress] = useState(0);
  const [lastViolation, setLastViolation] = useState<string | null>(null);

  // Initialize requirements from spec
  useEffect(() => {
    if (spec) {
      setRequirements(spec.requirements.map(req => ({ ...req, met: false, violated: false })));
    }
  }, [spec]);

  // Check content against requirements
  useEffect(() => {
    if (!spec || !content) return;

    const lowerContent = content.toLowerCase();
    const words = lowerContent.split(/\s+/);

    const updatedRequirements = requirements.map(req => {
      const hasWord = req.words.some(word => 
        words.some(w => w.includes(word.toLowerCase()))
      );

      if (req.type === 'required') {
        return { ...req, met: hasWord, violated: false };
      } else {
        // Forbidden word
        if (hasWord && !req.violated) {
          // First time violation
          setLastViolation(req.words[0]);
          horrorAudio.playGrowl();
        }
        return { ...req, met: false, violated: hasWord };
      }
    });

    setRequirements(updatedRequirements);

    // Calculate summoning progress
    const requiredReqs = updatedRequirements.filter(r => r.type === 'required');
    const metReqs = requiredReqs.filter(r => r.met);
    const progress = requiredReqs.length > 0 
      ? (metReqs.length / requiredReqs.length) * 100 
      : 0;
    setSummoningProgress(progress);
  }, [content, spec]);

  // Get all forbidden words for redaction
  const getForbiddenWords = useCallback(() => {
    return requirements
      .filter(r => r.type === 'forbidden')
      .flatMap(r => r.words);
  }, [requirements]);

  // Get all required words for highlighting
  const getRequiredWords = useCallback(() => {
    return requirements
      .filter(r => r.type === 'required')
      .flatMap(r => r.words);
  }, [requirements]);

  return {
    requirements,
    summoningProgress,
    lastViolation,
    getForbiddenWords,
    getRequiredWords,
  };
}
