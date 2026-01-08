export type FragmentContentPiece = 
  | { type: 'text'; value: string }
  | { type: 'input'; prompt: string; id: string; category: string };

export interface FragmentSpec {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  content: FragmentContentPiece[];
}

export const FRAGMENT_SPECS: FragmentSpec[] = [
  {
    id: 'fragment_01',
    title: 'The Midnight Visitor',
    difficulty: 'Easy',
    description: 'A police report found in a puddle of... something.',
    content: [
      { type: 'text', value: 'The officer found the victim hiding in the ' },
      { type: 'input', id: 'room_1', prompt: 'a room in a house', category: 'Noun (Place)' },
      { type: 'text', value: '. The walls were covered in ' },
      { type: 'input', id: 'substance_1', prompt: 'a viscous liquid', category: 'Noun (Substance)' },
      { type: 'text', value: '. When asked what happened, the victim only whispered one word: "' },
      { type: 'input', id: 'word_1', prompt: 'a terrifying name', category: 'Noun (Name)' },
      { type: 'text', value: '."' },
    ],
  },
  {
    id: 'fragment_02',
    title: 'The Anatomy Lesson',
    difficulty: 'Medium',
    description: 'An entry from a medical journal that was burned.',
    content: [
      { type: 'text', value: 'I made the first incision into the ' },
      { type: 'input', id: 'body_part_1', prompt: 'a body part', category: 'Noun (Anatomy)' },
      { type: 'text', value: '. Instead of blood, ' },
      { type: 'input', id: 'creatures_1', prompt: 'plural insects or worms', category: 'Noun (Creatures)' },
      { type: 'text', value: ' spilled out onto the floor. The corpse suddenly opened its eyes and began to ' },
      { type: 'input', id: 'action_1', prompt: 'a disturbing sound or action', category: 'Verb (Horror)' },
      { type: 'text', value: '.' },
    ],
  },
  {
    id: 'fragment_03',
    title: 'The Signal',
    difficulty: 'Medium',
    description: 'The last transmission from Deep Space Outpost 4.',
    content: [
      { type: 'text', value: 'Do not look at the moon. It has hatched. A giant ' },
      { type: 'input', id: 'noun_1', prompt: 'a massive object/creature', category: 'Noun (Cosmic)' },
      { type: 'text', value: ' is emerging from the crater. It screams like a ' },
      { type: 'input', id: 'sound_source_1', prompt: "something that shouldn't scream", category: 'Noun (Sound)' },
      { type: 'text', value: '. We are going to ' },
      { type: 'input', id: 'action_final', prompt: 'a desperate action', category: 'Verb (Action)' },
      { type: 'text', value: ' before it reaches us.' },
    ],
  },
  {
    id: 'fragment_04',
    title: 'The Heirloom',
    difficulty: 'Hard',
    description: 'A letter found in a sealed attic box.',
    content: [
      { type: 'text', value: "Grandmother never took off her necklace. Now I know why. The jewel isn't a ruby, it is a crystallized " },
      { type: 'input', id: 'organ_1', prompt: 'an internal organ', category: 'Noun (Anatomy)' },
      { type: 'text', value: '. At night, I can hear it ' },
      { type: 'input', id: 'sound_1', prompt: 'a soft, wet sound', category: 'Verb (Sound)' },
      { type: 'text', value: ' inside the jewelry box. I must feed it ' },
      { type: 'input', id: 'food_1', prompt: 'something inedible', category: 'Noun (Object)' },
      { type: 'text', value: ' or it will wake up.' },
    ],
  },
  {
    id: 'fragment_05',
    title: 'System Failure',
    difficulty: 'Hard',
    description: 'A log file from a sentient machine.',
    content: [
      { type: 'text', value: 'ERROR: CORE TEMPERATURE CRITICAL. DETECTED FOREIGN BIOLOGY IN SERVER ROOM. IT SMELLS LIKE ' },
      { type: 'input', id: 'smell_1', prompt: 'a burning smell', category: 'Noun (Smell)' },
      { type: 'text', value: '. THE WIRES ARE BLEEDING. I AM AFRAID. PLEASE ' },
      { type: 'input', id: 'command_1', prompt: 'a violent command (VERB)', category: 'Verb (Violent)' },
      { type: 'text', value: ' ME BEFORE I BECOME ' },
      { type: 'input', id: 'concept_1', prompt: 'an abstract concept', category: 'Noun (Abstract)' },
      { type: 'text', value: '.' },
    ],
  },
];
