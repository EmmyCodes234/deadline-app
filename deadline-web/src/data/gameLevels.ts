// Data structure for "The Ritual of the Unseen Muse" - The Path of the Damned
// 20 Levels across 4 Acts, each with thematic progression

export interface GamePart {
  id: string;
  name: string;
  sentences: string[];
  baseSpeed: number; // Characters per second for text bleeding
  skullCriteria: {
    oneSkullWpm: number;
    twoSkullWpm: number;
    threeSkullWpm: number;
  };
}

export interface GameLevelReward {
  type: 'title' | 'theme' | 'lore';
  name: string;
  description: string;
}

export interface GameLevel {
  id: number;
  name: string;
  act: string;
  description: string;
  parts: GamePart[];
  requiredSkullsToUnlockNext: number;
  reward: GameLevelReward;
}

export const GAME_LEVELS: GameLevel[] = [
  // ═══════════════════════════════════════════════════════════════
  // ACT 1: THE FORGOTTEN GRAVEYARD (Levels 1-5)
  // Theme: Decay, earth, restless spirits, entry into the underworld
  // ═══════════════════════════════════════════════════════════════

  {
    id: 1,
    name: 'The Cracked Gate',
    act: 'ACT I: THE FORGOTTEN GRAVEYARD',
    description: 'You stand before an ancient iron gate, its hinges weeping rust.',
    requiredSkullsToUnlockNext: 3,
    reward: { type: 'title', name: 'Grave Walker', description: 'You have taken your first steps into the realm of the dead.' },
    parts: [
      {
        id: 'level1-part1',
        name: 'The Rusty Hinges',
        baseSpeed: 1.5,
        skullCriteria: { oneSkullWpm: 5, twoSkullWpm: 15, threeSkullWpm: 25 },
        sentences: [
          'The gate groans as you approach.',
          'Rust falls like dried blood.',
        ],
      },
      {
        id: 'level1-part2',
        name: 'The Overgrown Path',
        baseSpeed: 1.5,
        skullCriteria: { oneSkullWpm: 5, twoSkullWpm: 15, threeSkullWpm: 25 },
        sentences: [
          'The path winds through an abandoned garden.',
          'Dead roses cling to crumbling trellises.',
        ],
      },
      {
        id: 'level1-part3',
        name: 'The First Whisper',
        baseSpeed: 1.5,
        skullCriteria: { oneSkullWpm: 5, twoSkullWpm: 15, threeSkullWpm: 25 },
        sentences: [
          'You hear a voice, soft and cold.',
          'It speaks your name.',
        ],
      },
    ],
  },

  {
    id: 2,
    name: 'The Weeping Willow',
    act: 'ACT I: THE FORGOTTEN GRAVEYARD',
    description: 'A massive willow tree stands sentinel, its branches trailing like tears.',
    requiredSkullsToUnlockNext: 7,
    reward: { type: 'lore', name: 'The Willow\'s Sorrow', description: 'You learn the tragic tale of the tree and the souls bound to its roots.' },
    parts: [
      { id: 'level2-part1', name: 'The Hanging Fog', baseSpeed: 4, skullCriteria: { oneSkullWpm: 40, twoSkullWpm: 55, threeSkullWpm: 70 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
      { id: 'level2-part2', name: 'The Sorrowful Moan', baseSpeed: 4.5, skullCriteria: { oneSkullWpm: 45, twoSkullWpm: 60, threeSkullWpm: 75 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
      { id: 'level2-part3', name: 'The Root-Bound Soul', baseSpeed: 5, skullCriteria: { oneSkullWpm: 50, twoSkullWpm: 65, threeSkullWpm: 80 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    ],
  },

  {
    id: 3,
    name: 'The Mausoleum of Silence',
    act: 'ACT I: THE FORGOTTEN GRAVEYARD',
    description: 'A marble tomb stands alone, its doors sealed with wax and prayers.',
    requiredSkullsToUnlockNext: 7,
    reward: { type: 'title', name: 'Tomb Breaker', description: 'You have violated the sanctity of the dead.' },
    parts: [
      { id: 'level3-part1', name: 'The Dusty Antechamber', baseSpeed: 4.5, skullCriteria: { oneSkullWpm: 50, twoSkullWpm: 65, threeSkullWpm: 80 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
      { id: 'level3-part2', name: 'The Sealed Crypt', baseSpeed: 5, skullCriteria: { oneSkullWpm: 55, twoSkullWpm: 70, threeSkullWpm: 85 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
      { id: 'level3-part3', name: 'The Echo of a Scream', baseSpeed: 5.5, skullCriteria: { oneSkullWpm: 60, twoSkullWpm: 75, threeSkullWpm: 90 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    ],
  },

  {
    id: 4,
    name: 'The Potter\'s Field',
    act: 'ACT I: THE FORGOTTEN GRAVEYARD',
    description: 'Where the nameless and unwanted are buried in shallow graves.',
    requiredSkullsToUnlockNext: 7,
    reward: { type: 'lore', name: 'The Forgotten Masses', description: 'You hear the voices of those who died without names.' },
    parts: [
      { id: 'level4-part1', name: 'The Unmarked Graves', baseSpeed: 5, skullCriteria: { oneSkullWpm: 60, twoSkullWpm: 75, threeSkullWpm: 90 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
      { id: 'level4-part2', name: 'The Restless Earth', baseSpeed: 5.5, skullCriteria: { oneSkullWpm: 65, twoSkullWpm: 80, threeSkullWpm: 95 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
      { id: 'level4-part3', name: 'The Forgotten Names', baseSpeed: 6, skullCriteria: { oneSkullWpm: 70, twoSkullWpm: 85, threeSkullWpm: 100 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    ],
  },

  {
    id: 5,
    name: 'The Undertaker\'s Cottage',
    act: 'ACT I: THE FORGOTTEN GRAVEYARD',
    description: 'A small house at the edge of the cemetery, where death is a trade.',
    requiredSkullsToUnlockNext: 7,
    reward: { type: 'theme', name: 'Mortician\'s Tools', description: 'The UI takes on the aesthetic of embalming instruments.' },
    parts: [
      { id: 'level5-part1', name: 'The Cold Hearth', baseSpeed: 5.5, skullCriteria: { oneSkullWpm: 70, twoSkullWpm: 85, threeSkullWpm: 100 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
      { id: 'level5-part2', name: 'The Book of the Dead', baseSpeed: 6, skullCriteria: { oneSkullWpm: 75, twoSkullWpm: 90, threeSkullWpm: 105 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
      { id: 'level5-part3', name: 'The Shadow at the Window', baseSpeed: 6.5, skullCriteria: { oneSkullWpm: 80, twoSkullWpm: 95, threeSkullWpm: 110 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ACT 2: THE CURSED CATHEDRAL (Levels 6-10)
  // Theme: Gothic horror, corrupted religion, demons, madness
  // ═══════════════════════════════════════════════════════════════

  { id: 6, name: 'The Gargoyle\'s Perch', act: 'ACT II: THE CURSED CATHEDRAL', description: 'Stone watchers line the rooftops, their eyes following your every move.', requiredSkullsToUnlockNext: 7, reward: { type: 'title', name: 'Stone Whisperer', description: 'The gargoyles recognize you as one of their own.' }, parts: [
    { id: 'level6-part1', name: 'The Watchful Stone', baseSpeed: 6, skullCriteria: { oneSkullWpm: 80, twoSkullWpm: 95, threeSkullWpm: 110 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level6-part2', name: 'The Stormy Night', baseSpeed: 6.5, skullCriteria: { oneSkullWpm: 85, twoSkullWpm: 100, threeSkullWpm: 115 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level6-part3', name: 'The Lightning Strike', baseSpeed: 7, skullCriteria: { oneSkullWpm: 90, twoSkullWpm: 105, threeSkullWpm: 120 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 7, name: 'The Shattered Stained Glass', act: 'ACT II: THE CURSED CATHEDRAL', description: 'Holy images lie broken on the cathedral floor.', requiredSkullsToUnlockNext: 7, reward: { type: 'lore', name: 'The Fallen Saint', description: 'You witness the corruption of the divine.' }, parts: [
    { id: 'level7-part1', name: 'The Fragmented Saint', baseSpeed: 6.5, skullCriteria: { oneSkullWpm: 90, twoSkullWpm: 105, threeSkullWpm: 120 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level7-part2', name: 'The Blood-Red Light', baseSpeed: 7, skullCriteria: { oneSkullWpm: 95, twoSkullWpm: 110, threeSkullWpm: 125 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level7-part3', name: 'The Unholy Reflection', baseSpeed: 7.5, skullCriteria: { oneSkullWpm: 100, twoSkullWpm: 115, threeSkullWpm: 130 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 8, name: 'The Crypt Beneath the Altar', act: 'ACT II: THE CURSED CATHEDRAL', description: 'A hidden staircase leads to forbidden depths.', requiredSkullsToUnlockNext: 7, reward: { type: 'title', name: 'Heretic', description: 'You have desecrated the holiest of places.' }, parts: [
    { id: 'level8-part1', name: 'The Hidden Staircase', baseSpeed: 7, skullCriteria: { oneSkullWpm: 100, twoSkullWpm: 115, threeSkullWpm: 130 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level8-part2', name: 'The Ancient Relic', baseSpeed: 7.5, skullCriteria: { oneSkullWpm: 105, twoSkullWpm: 120, threeSkullWpm: 135 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level8-part3', name: 'The Awakened Evil', baseSpeed: 8, skullCriteria: { oneSkullWpm: 110, twoSkullWpm: 125, threeSkullWpm: 140 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 9, name: 'The Bell Tower\'s Toll', act: 'ACT II: THE CURSED CATHEDRAL', description: 'The bells ring for the dead, though no one pulls the rope.', requiredSkullsToUnlockNext: 7, reward: { type: 'theme', name: 'Midnight Chime', description: 'The UI darkens with each toll of the bell.' }, parts: [
    { id: 'level9-part1', name: 'The Endless Climb', baseSpeed: 7.5, skullCriteria: { oneSkullWpm: 110, twoSkullWpm: 125, threeSkullWpm: 140 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level9-part2', name: 'The Deceiving Chime', baseSpeed: 8, skullCriteria: { oneSkullWpm: 115, twoSkullWpm: 130, threeSkullWpm: 145 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level9-part3', name: 'The Final Peal', baseSpeed: 8.5, skullCriteria: { oneSkullWpm: 120, twoSkullWpm: 135, threeSkullWpm: 150 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 10, name: 'The Corrupted Confessional', act: 'ACT II: THE CURSED CATHEDRAL', description: 'Where sins are whispered and demons listen.', requiredSkullsToUnlockNext: 7, reward: { type: 'lore', name: 'The Demon\'s Bargain', description: 'You learn the price of absolution.' }, parts: [
    { id: 'level10-part1', name: 'The Whispered Sin', baseSpeed: 8, skullCriteria: { oneSkullWpm: 120, twoSkullWpm: 135, threeSkullWpm: 150 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level10-part2', name: 'The Laughing Demon', baseSpeed: 8.5, skullCriteria: { oneSkullWpm: 125, twoSkullWpm: 140, threeSkullWpm: 155 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level10-part3', name: 'The Penance of Blood', baseSpeed: 9, skullCriteria: { oneSkullWpm: 130, twoSkullWpm: 145, threeSkullWpm: 160 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},

  // ═══════════════════════════════════════════════════════════════
  // ACT 3: THE HAUNTED ASYLUM (Levels 11-15)
  // Theme: Psychological horror, torment, experiments, lost minds
  // ═══════════════════════════════════════════════════════════════

  { id: 11, name: 'The Intake Ward', act: 'ACT III: THE HAUNTED ASYLUM', description: 'Where the broken are processed and catalogued.', requiredSkullsToUnlockNext: 7, reward: { type: 'title', name: 'Patient Zero', description: 'You have been admitted to the asylum.' }, parts: [
    { id: 'level11-part1', name: 'The Cold Intake', baseSpeed: 8.5, skullCriteria: { oneSkullWpm: 130, twoSkullWpm: 145, threeSkullWpm: 160 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level11-part2', name: 'The Straitjacket', baseSpeed: 9, skullCriteria: { oneSkullWpm: 135, twoSkullWpm: 150, threeSkullWpm: 165 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level11-part3', name: 'The First Treatment', baseSpeed: 9.5, skullCriteria: { oneSkullWpm: 140, twoSkullWpm: 155, threeSkullWpm: 170 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 12, name: 'The Isolation Chamber', act: 'ACT III: THE HAUNTED ASYLUM', description: 'A padded cell where time loses all meaning.', requiredSkullsToUnlockNext: 7, reward: { type: 'lore', name: 'The Madness Within', description: 'You understand what it means to be truly alone.' }, parts: [
    { id: 'level12-part1', name: 'The Padded Walls', baseSpeed: 9, skullCriteria: { oneSkullWpm: 140, twoSkullWpm: 155, threeSkullWpm: 170 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level12-part2', name: 'The Ticking Clock', baseSpeed: 9.5, skullCriteria: { oneSkullWpm: 145, twoSkullWpm: 160, threeSkullWpm: 175 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level12-part3', name: 'The Voice in the Walls', baseSpeed: 10, skullCriteria: { oneSkullWpm: 150, twoSkullWpm: 165, threeSkullWpm: 180 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 13, name: 'The Doctor\'s Laboratory', act: 'ACT III: THE HAUNTED ASYLUM', description: 'Where science and madness become one.', requiredSkullsToUnlockNext: 7, reward: { type: 'theme', name: 'Surgical Horror', description: 'The UI takes on the aesthetic of medical instruments.' }, parts: [
    { id: 'level13-part1', name: 'The Bubbling Vials', baseSpeed: 9.5, skullCriteria: { oneSkullWpm: 150, twoSkullWpm: 165, threeSkullWpm: 180 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level13-part2', name: 'The Failed Experiment', baseSpeed: 10, skullCriteria: { oneSkullWpm: 155, twoSkullWpm: 170, threeSkullWpm: 185 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level13-part3', name: 'The Creature in the Jar', baseSpeed: 10.5, skullCriteria: { oneSkullWpm: 160, twoSkullWpm: 175, threeSkullWpm: 190 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 14, name: 'The Patient\'s Journal', act: 'ACT III: THE HAUNTED ASYLUM', description: 'Mad scrawlings reveal terrible truths.', requiredSkullsToUnlockNext: 7, reward: { type: 'lore', name: 'The Truth Revealed', description: 'You discover the asylum\'s darkest secret.' }, parts: [
    { id: 'level14-part1', name: 'The Mad Scrawlings', baseSpeed: 10, skullCriteria: { oneSkullWpm: 160, twoSkullWpm: 175, threeSkullWpm: 190 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level14-part2', name: 'The Truth Revealed', baseSpeed: 10.5, skullCriteria: { oneSkullWpm: 165, twoSkullWpm: 180, threeSkullWpm: 195 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level14-part3', name: 'The Descent into Madness', baseSpeed: 11, skullCriteria: { oneSkullWpm: 170, twoSkullWpm: 185, threeSkullWpm: 200 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 15, name: 'The Riot in Block C', act: 'ACT III: THE HAUNTED ASYLUM', description: 'Chaos unleashed, the inmates have taken control.', requiredSkullsToUnlockNext: 7, reward: { type: 'title', name: 'Survivor', description: 'You escaped the asylum alive... or did you?' }, parts: [
    { id: 'level15-part1', name: 'The Broken Locks', baseSpeed: 10.5, skullCriteria: { oneSkullWpm: 170, twoSkullWpm: 185, threeSkullWpm: 200 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level15-part2', name: 'The Chaos Unleashed', baseSpeed: 11, skullCriteria: { oneSkullWpm: 175, twoSkullWpm: 190, threeSkullWpm: 205 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level15-part3', name: 'The Escape Attempt', baseSpeed: 11.5, skullCriteria: { oneSkullWpm: 180, twoSkullWpm: 195, threeSkullWpm: 210 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},

  // ═══════════════════════════════════════════════════════════════
  // ACT 4: THE VOID (Levels 16-20)
  // Theme: Cosmic horror, non-existence, the Reaper's domain
  // ═══════════════════════════════════════════════════════════════

  { id: 16, name: 'The Edge of Reality', act: 'ACT IV: THE VOID', description: 'Where the world begins to dissolve into nothingness.', requiredSkullsToUnlockNext: 7, reward: { type: 'lore', name: 'The Dissolving World', description: 'You witness reality unraveling at the seams.' }, parts: [
    { id: 'level16-part1', name: 'The Dissolving World', baseSpeed: 11, skullCriteria: { oneSkullWpm: 180, twoSkullWpm: 195, threeSkullWpm: 210 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level16-part2', name: 'The Impossible Geometry', baseSpeed: 11.5, skullCriteria: { oneSkullWpm: 185, twoSkullWpm: 200, threeSkullWpm: 215 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level16-part3', name: 'The Endless Fall', baseSpeed: 12, skullCriteria: { oneSkullWpm: 190, twoSkullWpm: 205, threeSkullWpm: 220 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 17, name: 'The River Styx', act: 'ACT IV: THE VOID', description: 'The boundary between life and death, where souls cross over.', requiredSkullsToUnlockNext: 7, reward: { type: 'title', name: 'Ferryman\'s Passenger', description: 'You have paid the price for passage.' }, parts: [
    { id: 'level17-part1', name: 'The Ferryman\'s Price', baseSpeed: 11.5, skullCriteria: { oneSkullWpm: 190, twoSkullWpm: 205, threeSkullWpm: 220 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level17-part2', name: 'The Souls of the Damned', baseSpeed: 12, skullCriteria: { oneSkullWpm: 195, twoSkullWpm: 210, threeSkullWpm: 225 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level17-part3', name: 'The Crossing', baseSpeed: 12.5, skullCriteria: { oneSkullWpm: 200, twoSkullWpm: 215, threeSkullWpm: 230 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 18, name: 'The Hall of Judgment', act: 'ACT IV: THE VOID', description: 'Where your soul is weighed and your fate decided.', requiredSkullsToUnlockNext: 7, reward: { type: 'theme', name: 'Scales of Anubis', description: 'The UI transforms into ancient Egyptian death imagery.' }, parts: [
    { id: 'level18-part1', name: 'The Scales of Anubis', baseSpeed: 12, skullCriteria: { oneSkullWpm: 200, twoSkullWpm: 215, threeSkullWpm: 230 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level18-part2', name: 'The Weight of Your Sins', baseSpeed: 12.5, skullCriteria: { oneSkullWpm: 205, twoSkullWpm: 220, threeSkullWpm: 235 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level18-part3', name: 'The Final Verdict', baseSpeed: 13, skullCriteria: { oneSkullWpm: 210, twoSkullWpm: 225, threeSkullWpm: 240 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},
  { id: 19, name: 'The Reaper\'s Throne', act: 'ACT IV: THE VOID', description: 'You stand before Death itself.', requiredSkullsToUnlockNext: 7, reward: { type: 'lore', name: 'The Offer of Oblivion', description: 'The Reaper makes you an offer you cannot refuse.' }, parts: [
    { id: 'level19-part1', name: 'The Cloaked Figure', baseSpeed: 12.5, skullCriteria: { oneSkullWpm: 210, twoSkullWpm: 225, threeSkullWpm: 240 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level19-part2', name: 'The Scythe\'s Edge', baseSpeed: 13, skullCriteria: { oneSkullWpm: 215, twoSkullWpm: 230, threeSkullWpm: 245 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
    { id: 'level19-part3', name: 'The Offer of Oblivion', baseSpeed: 13.5, skullCriteria: { oneSkullWpm: 220, twoSkullWpm: 235, threeSkullWpm: 250 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.'] },
  ]},

  // LEVEL 20: THE FINAL RITUAL - The Boss Gauntlet (5 Parts)
  {
    id: 20,
    name: 'The Final Ritual',
    act: 'ACT IV: THE VOID',
    description: 'The culmination of your journey. The Muse demands the ultimate sacrifice.',
    requiredSkullsToUnlockNext: 12,
    reward: { type: 'title', name: 'Master of the Unseen', description: 'You have completed the ritual and transcended mortality itself.' },
    parts: [
      { id: 'level20-part1', name: 'The Summoning Circle', baseSpeed: 13, skullCriteria: { oneSkullWpm: 220, twoSkullWpm: 235, threeSkullWpm: 250 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.', 'Placeholder sentence 4.'] },
      { id: 'level20-part2', name: 'The Breaking of the Seals', baseSpeed: 13.5, skullCriteria: { oneSkullWpm: 225, twoSkullWpm: 240, threeSkullWpm: 255 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.', 'Placeholder sentence 4.'] },
      { id: 'level20-part3', name: 'The Manifestation', baseSpeed: 14, skullCriteria: { oneSkullWpm: 230, twoSkullWpm: 245, threeSkullWpm: 260 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.', 'Placeholder sentence 4.'] },
      { id: 'level20-part4', name: 'The Battle for Your Soul', baseSpeed: 14.5, skullCriteria: { oneSkullWpm: 235, twoSkullWpm: 250, threeSkullWpm: 265 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.', 'Placeholder sentence 4.'] },
      { id: 'level20-part5', name: 'The Ascension or Damnation', baseSpeed: 15, skullCriteria: { oneSkullWpm: 240, twoSkullWpm: 255, threeSkullWpm: 270 }, sentences: ['Placeholder sentence 1.', 'Placeholder sentence 2.', 'Placeholder sentence 3.', 'Placeholder sentence 4.', 'Placeholder sentence 5.'] },
    ],
  },
];
