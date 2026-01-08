/**
 * Calculate the current moon phase based on the date
 * Uses astronomical calculations to determine the lunar cycle
 */

export type MoonPhase = 
  | 'new'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export interface MoonPhaseData {
  phase: MoonPhase;
  icon: string;
  name: string;
  flavorText: string;
  illumination: number; // 0-100%
}

/**
 * Calculate moon phase for a given date
 * Based on the synodic month (29.53 days)
 */
export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  // Known new moon: January 6, 2000, 18:14 UTC
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const synodicMonth = 29.53058867; // days
  
  // Calculate days since known new moon
  const daysSinceNew = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  
  // Calculate current position in lunar cycle (0-1)
  const phase = (daysSinceNew % synodicMonth) / synodicMonth;
  
  // Calculate illumination percentage
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) * 50);
  
  // Determine phase name and details
  if (phase < 0.0625 || phase >= 0.9375) {
    return {
      phase: 'new',
      icon: '🌑',
      name: 'New Moon',
      flavorText: 'The moon is dead. Darkness reigns.',
      illumination,
    };
  } else if (phase < 0.1875) {
    return {
      phase: 'waxing-crescent',
      icon: '🌒',
      name: 'Waxing Crescent',
      flavorText: 'The moon awakens. Shadows stir.',
      illumination,
    };
  } else if (phase < 0.3125) {
    return {
      phase: 'first-quarter',
      icon: '🌓',
      name: 'First Quarter',
      flavorText: 'Half-light reveals what hides in shadow.',
      illumination,
    };
  } else if (phase < 0.4375) {
    return {
      phase: 'waxing-gibbous',
      icon: '🌔',
      name: 'Waxing Gibbous',
      flavorText: 'The moon swells. Power grows.',
      illumination,
    };
  } else if (phase < 0.5625) {
    return {
      phase: 'full',
      icon: '🌕',
      name: 'Full Moon',
      flavorText: 'The moon is full. The veil is thinnest.',
      illumination,
    };
  } else if (phase < 0.6875) {
    return {
      phase: 'waning-gibbous',
      icon: '🌖',
      name: 'Waning Gibbous',
      flavorText: 'The moon wanes. Secrets fade.',
      illumination,
    };
  } else if (phase < 0.8125) {
    return {
      phase: 'last-quarter',
      icon: '🌗',
      name: 'Last Quarter',
      flavorText: 'Half-light conceals what was revealed.',
      illumination,
    };
  } else {
    return {
      phase: 'waning-crescent',
      icon: '🌘',
      name: 'Waning Crescent',
      flavorText: 'The moon dies. Darkness approaches.',
      illumination,
    };
  }
}
