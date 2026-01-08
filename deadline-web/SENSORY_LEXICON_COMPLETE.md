# Sensory Lexicon Feature Complete

## Overview
Added a Sensory Lexicon feature to The Anatomy panel - a curated collection of horror-themed adjectives categorized by sense to inspire writers when describing scary scenes.

## Implementation

### 1. Data Structure (`src/data/sensoryLexicon.ts`)

Created a new data file with 100 horror-themed adjectives organized by sensory category:

- **Sight** (20 words): Shadowy, Lurking, Pallid, Visceral, Geometric, Distorted, Flickering, Gaunt, Hollow, Twisted, Skeletal, Translucent, Veiled, Warped, Withered, Ashen, Bloodless, Cadaverous, Spectral, Sunken

- **Sound** (20 words): Raspy, Wet, Clicking, Thumping, Silenced, Creaking, Dripping, Echoing, Grating, Hissing, Moaning, Rattling, Scraping, Shrieking, Whispering, Crackling, Gurgling, Howling, Rustling, Wailing

- **Touch** (20 words): Clammy, Slick, Rough, Cold, Feverish, Brittle, Damp, Greasy, Icy, Numb, Prickly, Slimy, Sticky, Tender, Waxy, Coarse, Frigid, Moist, Papery, Tacky

- **Smell** (20 words): Metallic, Rotting, Ozone, Stale, Sweet, Acrid, Bitter, Coppery, Dank, Earthy, Fetid, Musty, Pungent, Rancid, Sour, Charred, Moldy, Putrid, Sulfurous, Vinegary

- **Taste** (15 words): Bitter, Coppery, Acrid, Sour, Metallic, Ashen, Briny, Chalky, Rancid, Stale, Acidic, Burnt, Dusty, Ferrous, Salty

### 2. UI Updates (`src/components/AltarOfWhispers.tsx`)

#### New Tab System
- Expanded from 2 tabs (Cast, Lore) to 4 tabs (Notes, Senses, Cast, Lore)
- **Notes**: Word goals, synopsis, and progress tracking
- **Senses**: New sensory lexicon feature
- **Cast**: Character management
- **Lore**: Research links

#### Tab Navigation
- Minimal design with `text-[10px]` mono uppercase
- Active indicator: `border-b-[0.5px] border-purple-400`
- Hover states for inactive tabs
- Centered layout with 6-unit gaps

#### Sensory Lexicon Tab
**Layout**:
- Scrollable container with padding
- Categories displayed vertically with spacing
- Category headers: `text-[10px]` uppercase in zinc-600

**Word Chips**:
- Clickable buttons styled as minimal tags
- Font: `font-['Crimson_Text']` at `text-xs`
- Border: `border-[0.5px] border-white/10`
- Hover: `hover:border-purple-400/30` and `hover:bg-white/5`
- Active (copied): `text-purple-400 border-purple-400`
- Flex-wrap layout for responsive arrangement

**Copy Functionality**:
- Click any word to copy to clipboard
- Uses `navigator.clipboard.writeText()`
- Visual feedback: word turns purple when copied
- Toast notification appears for 2 seconds

#### Toast Notification
- Fixed position: `bottom-6 right-6`
- Background: `bg-purple-900/90`
- Border: `border-[0.5px] border-purple-400`
- Shows: "Copied: [word]" in Crimson Text
- Auto-dismisses after 2 seconds
- Fade-in animation

### 3. State Management

Added new state variables:
```typescript
const [activeTab, setActiveTab] = useState<'notes' | 'senses' | 'characters' | 'research'>('notes');
const [copiedWord, setCopiedWord] = useState<string | null>(null);
```

Added copy handler:
```typescript
const handleCopyWord = async (word: string) => {
  try {
    await navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
```

## User Experience

### Workflow
1. Writer opens a document in Noctuary
2. Clicks "Senses" tab in The Anatomy panel
3. Browses horror adjectives organized by sense
4. Clicks a word to copy it to clipboard
5. Sees "Copied: [word]" toast confirmation
6. Pastes word into their writing

### Benefits
- **Instant Inspiration**: Quick access to evocative horror vocabulary
- **Organized by Sense**: Easy to find the right type of description
- **One-Click Copy**: Seamless integration into writing workflow
- **Visual Feedback**: Clear indication of copied words
- **Professional Tool**: Feels like a serious writing assistant

## Design Consistency

Maintains the Cursed Minimalist aesthetic:
- Pure void background (#050505)
- Ultra-thin borders (0.5px)
- Silver/grey text (zinc-300/400)
- Purple spectral accents (purple-400)
- Crimson Text font for word chips
- Minimal, clean interface

## Technical Details

- **Total Words**: 100 horror-themed adjectives
- **Categories**: 5 sensory categories
- **Copy Method**: Clipboard API
- **Toast Duration**: 2000ms
- **Animation**: Fade-in for toast
- **Accessibility**: Title attributes on buttons
- **Error Handling**: Console error for clipboard failures

## Future Enhancements

Potential additions:
- User-customizable word lists
- Favorites/bookmarks system
- Search/filter functionality
- More categories (emotion, atmosphere, etc.)
- Export word lists
- Integration with AI for contextual suggestions

---
*Sensory inspiration at your fingertips.*
