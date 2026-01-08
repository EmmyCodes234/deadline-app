export interface RitualRequirement {
  id: string;
  text: string;
  type: 'required' | 'forbidden';
  words: string[];
  met: boolean;
  violated: boolean;
}

export interface RitualSpec {
  id: string;
  name: string;
  description: string;
  difficulty: 'novice' | 'intermediate' | 'master';
  requirements: RitualRequirement[];
  backgroundImage?: string;
  targetWordCount: number;
}

export const RITUAL_SPECS: RitualSpec[] = [
  {
    id: 'novice-summoning',
    name: 'The Novice Summoning',
    description: 'A simple ritual for beginners. Speak the words of darkness.',
    difficulty: 'novice',
    targetWordCount: 100,
    requirements: [
      {
        id: 'req-1',
        text: 'Invoke the shadows',
        type: 'required',
        words: ['shadow', 'shadows', 'darkness', 'dark'],
        met: false,
        violated: false,
      },
      {
        id: 'req-2',
        text: 'Speak of blood',
        type: 'required',
        words: ['blood', 'crimson', 'scarlet'],
        met: false,
        violated: false,
      },
      {
        id: 'req-3',
        text: 'Mention the night',
        type: 'required',
        words: ['night', 'midnight', 'dusk', 'twilight'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-1',
        text: 'Never speak of hope',
        type: 'forbidden',
        words: ['hope', 'hopeful', 'hoping'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-2',
        text: 'Never speak of light',
        type: 'forbidden',
        words: ['light', 'bright', 'sunshine', 'daylight'],
        met: false,
        violated: false,
      },
    ],
  },
  {
    id: 'blood-pact',
    name: 'The Blood Pact',
    description: 'A binding contract written in crimson words.',
    difficulty: 'intermediate',
    targetWordCount: 200,
    requirements: [
      {
        id: 'req-1',
        text: 'Invoke the ancient ones',
        type: 'required',
        words: ['ancient', 'elder', 'primordial', 'old'],
        met: false,
        violated: false,
      },
      {
        id: 'req-2',
        text: 'Speak of sacrifice',
        type: 'required',
        words: ['sacrifice', 'offering', 'tribute'],
        met: false,
        violated: false,
      },
      {
        id: 'req-3',
        text: 'Mention the abyss',
        type: 'required',
        words: ['abyss', 'void', 'chasm', 'depths'],
        met: false,
        violated: false,
      },
      {
        id: 'req-4',
        text: 'Call upon death',
        type: 'required',
        words: ['death', 'dying', 'dead', 'mortality'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-1',
        text: 'Never speak of safety',
        type: 'forbidden',
        words: ['safe', 'safety', 'secure', 'protected'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-2',
        text: 'Never speak of joy',
        type: 'forbidden',
        words: ['joy', 'happy', 'happiness', 'cheerful'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-3',
        text: 'Never speak of peace',
        type: 'forbidden',
        words: ['peace', 'peaceful', 'calm', 'serene'],
        met: false,
        violated: false,
      },
    ],
  },
  {
    id: 'void-call',
    name: 'The Void Call',
    description: 'Summon the nameless horror from beyond reality.',
    difficulty: 'master',
    targetWordCount: 300,
    requirements: [
      {
        id: 'req-1',
        text: 'Speak the unspeakable',
        type: 'required',
        words: ['whisper', 'whispers', 'murmur', 'echo'],
        met: false,
        violated: false,
      },
      {
        id: 'req-2',
        text: 'Invoke madness',
        type: 'required',
        words: ['madness', 'insanity', 'chaos', 'lunacy'],
        met: false,
        violated: false,
      },
      {
        id: 'req-3',
        text: 'Mention the forgotten',
        type: 'required',
        words: ['forgotten', 'lost', 'abandoned', 'forsaken'],
        met: false,
        violated: false,
      },
      {
        id: 'req-4',
        text: 'Call the eternal',
        type: 'required',
        words: ['eternal', 'endless', 'infinite', 'forever'],
        met: false,
        violated: false,
      },
      {
        id: 'req-5',
        text: 'Speak of the nameless',
        type: 'required',
        words: ['nameless', 'unknown', 'unknowable', 'eldritch'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-1',
        text: 'Never speak of love',
        type: 'forbidden',
        words: ['love', 'loving', 'beloved', 'affection'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-2',
        text: 'Never speak of salvation',
        type: 'forbidden',
        words: ['salvation', 'saved', 'rescue', 'redemption'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-3',
        text: 'Never speak of heaven',
        type: 'forbidden',
        words: ['heaven', 'paradise', 'divine', 'holy'],
        met: false,
        violated: false,
      },
      {
        id: 'taboo-4',
        text: 'Never speak of warmth',
        type: 'forbidden',
        words: ['warm', 'warmth', 'cozy', 'comfort'],
        met: false,
        violated: false,
      },
    ],
  },
];
