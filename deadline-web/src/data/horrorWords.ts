export const HORROR_WORDS = [
  // Short (3-5 letters)
  'death', 'fear', 'doom', 'dark', 'evil', 'hell', 'pain', 'blood', 'ghost', 'demon',
  'curse', 'grave', 'tomb', 'crypt', 'skull', 'bone', 'rot', 'decay', 'dread', 'terror',
  
  // Medium (6-8 letters)
  'shadow', 'horror', 'scream', 'murder', 'corpse', 'zombie', 'vampire', 'phantom',
  'specter', 'wraith', 'banshee', 'ghoul', 'monster', 'nightmare', 'haunted', 'cursed',
  'twisted', 'macabre', 'sinister', 'malice', 'torment', 'anguish', 'despair', 'madness',
  
  // Long (9+ letters)
  'possession', 'exorcism', 'abomination', 'resurrection', 'damnation', 'suffering',
  'apocalypse', 'necromancy', 'malevolent', 'grotesque', 'carnage', 'slaughter',
  'desecration', 'corruption', 'annihilation', 'obliteration', 'manifestation',
];

export const BOSS_SENTENCES = [
  'The dead shall rise from their graves',
  'Your soul belongs to the darkness now',
  'There is no escape from eternal torment',
  'The veil between worlds grows thin',
  'Ancient evil awakens from its slumber',
  'Death comes for all who dare enter',
  'The shadows consume everything they touch',
  'Madness awaits those who seek the truth',
];

export function getRandomWord(): string {
  return HORROR_WORDS[Math.floor(Math.random() * HORROR_WORDS.length)];
}

export function getRandomBossSentence(): string {
  return BOSS_SENTENCES[Math.floor(Math.random() * BOSS_SENTENCES.length)];
}
