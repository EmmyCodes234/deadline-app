// Sensory Lexicon - Horror-themed adjectives for writers
export interface SensoryCategory {
  name: string;
  words: string[];
}

export const SENSORY_LEXICON: SensoryCategory[] = [
  {
    name: 'Sight',
    words: [
      'Shadowy', 'Lurking', 'Pallid', 'Visceral', 'Geometric',
      'Distorted', 'Flickering', 'Gaunt', 'Hollow', 'Twisted',
      'Skeletal', 'Translucent', 'Veiled', 'Warped', 'Withered',
      'Ashen', 'Bloodless', 'Cadaverous', 'Spectral', 'Sunken'
    ]
  },
  {
    name: 'Sound',
    words: [
      'Raspy', 'Wet', 'Clicking', 'Thumping', 'Silenced',
      'Creaking', 'Dripping', 'Echoing', 'Grating', 'Hissing',
      'Moaning', 'Rattling', 'Scraping', 'Shrieking', 'Whispering',
      'Crackling', 'Gurgling', 'Howling', 'Rustling', 'Wailing'
    ]
  },
  {
    name: 'Touch',
    words: [
      'Clammy', 'Slick', 'Rough', 'Cold', 'Feverish',
      'Brittle', 'Damp', 'Greasy', 'Icy', 'Numb',
      'Prickly', 'Slimy', 'Sticky', 'Tender', 'Waxy',
      'Coarse', 'Frigid', 'Moist', 'Papery', 'Tacky'
    ]
  },
  {
    name: 'Smell',
    words: [
      'Metallic', 'Rotting', 'Ozone', 'Stale', 'Sweet',
      'Acrid', 'Bitter', 'Coppery', 'Dank', 'Earthy',
      'Fetid', 'Musty', 'Pungent', 'Rancid', 'Sour',
      'Charred', 'Moldy', 'Putrid', 'Sulfurous', 'Vinegary'
    ]
  },
  {
    name: 'Taste',
    words: [
      'Bitter', 'Coppery', 'Acrid', 'Sour', 'Metallic',
      'Ashen', 'Briny', 'Chalky', 'Rancid', 'Stale',
      'Acidic', 'Burnt', 'Dusty', 'Ferrous', 'Salty'
    ]
  }
];
