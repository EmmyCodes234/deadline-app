# Ritual Summoning Engine - Implementation Spec

## Overview
Transform the Grimoire Editor into a spec-driven horror linting system where users complete "rituals" by typing specific words while avoiding forbidden ones.

## Components Created

### 1. Data Layer
- **`src/data/ritualSpecs.ts`** - Defines ritual specifications with requirements
  - 3 pre-built rituals: Novice Summoning, Blood Pact, Void Call
  - Each has required words (reagents) and forbidden words (taboos)

### 2. UI Components
- **`src/components/RitualSpecList.tsx`** - Displays ritual requirements
  - Pending: Gray circle icon, zinc-600 text
  - Met: Flame icon (animated), amber-500 text
  - Violated: Warning icon, red-500 text

- **`src/components/RitualSelector.tsx`** - Sidebar ritual picker
  - Replaces file list with pre-set rituals
  - Shows difficulty and word count

### 3. Logic Hook
- **`src/hooks/useRitualLinter.ts`** - Core linting logic
  - Tracks which requirements are met/violated
  - Calculates summoning progress (0-100%)
  - Provides forbidden/required word lists

## Integration Steps

### Step 1: Update GrimoireEditor State
```typescript
const [selectedRitual, setSelectedRitual] = useState<RitualSpec | null>(null);
const { requirements, summoningProgress, getForbiddenWords, getRequiredWords } = 
  useRitualLinter(selectedRitual, activeDocument?.content || '');
```

### Step 2: Replace Sidebar Content
Replace the current file list with `<RitualSelector />`:
```typescript
<RitualSelector 
  onSelectRitual={setSelectedRitual}
  selectedRitualId={selectedRitual?.id || null}
/>
```

### Step 3: Add Right Panel - Ritual Specification
Add a new right panel showing requirements:
```typescript
<div className="w-80 bg-stone-900/50 border-l border-stone-800 p-6">
  <h2 className="text-xl font-['Playfair_Display'] text-stone-200 mb-4">
    RITUAL SPECIFICATION
  </h2>
  <RitualSpecList requirements={requirements} />
  
  {/* Summoning Progress */}
  <div className="mt-6">
    <div className="text-xs text-zinc-500 mb-2">SUMMONING PROGRESS</div>
    <div className="text-3xl font-creepster text-amber-500">
      {Math.round(summoningProgress)}%
    </div>
  </div>
</div>
```

### Step 4: Implement Word Redaction
In the content change handler, redact forbidden words:
```typescript
const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  let newContent = e.target.value;
  const forbiddenWords = getForbiddenWords();
  
  // Redact forbidden words
  forbiddenWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(newContent)) {
      newContent = newContent.replace(regex, '[REDACTED]');
      horrorAudio.playGrowl(); // Fizzle sound
    }
  });
  
  // Check for power words
  checkForPowerWords(newContent);
  
  if (activeDocument) {
    crypt.updateItem(activeDocument.id, { content: newContent });
  }
};
```

### Step 5: Add Background Opacity Effect
Add a background entity that fades in based on progress:
```typescript
<div 
  className="absolute inset-0 pointer-events-none bg-cover bg-center transition-opacity duration-1000"
  style={{
    backgroundImage: 'url(/demon-entity.jpg)',
    opacity: summoningProgress / 100,
    mixBlendMode: 'overlay'
  }}
/>
```

### Step 6: Highlight Required Words
When a required word is typed, make it glow:
```typescript
// In the editor, wrap required words in spans
const highlightRequiredWords = (text: string) => {
  const requiredWords = getRequiredWords();
  let highlighted = text;
  
  requiredWords.forEach(word => {
    const regex = new RegExp(`\\b(${word})\\b`, 'gi');
    highlighted = highlighted.replace(
      regex, 
      '<span class="text-amber-400 animate-pulse">$1</span>'
    );
  });
  
  return highlighted;
};
```

## Visual Design

### Ritual Spec Panel (Right Side)
- Dark stone background
- No checkboxes - just icons and text
- Smooth color transitions
- Flame icons pulse when met

### Editor Area
- Background entity fades in as progress increases
- Forbidden words get replaced with `[REDACTED]` in red
- Required words glow gold briefly when typed

### Sidebar
- "Select Ritual" header
- 3 ritual cards with difficulty indicators
- Word count and reagent count shown

## Audio Cues
- **Forbidden word typed**: Growl/fizzle sound
- **Required word typed**: Subtle chime (can use existing audio)
- **Ritual complete**: Victory sound

## Next Steps
1. Integrate components into GrimoireEditor
2. Add background entity images
3. Test word detection logic
4. Polish animations and transitions
5. Add completion state when all requirements met

## Files Created
- ✅ `src/data/ritualSpecs.ts`
- ✅ `src/components/RitualSpecList.tsx`
- ✅ `src/components/RitualSelector.tsx`
- ✅ `src/hooks/useRitualLinter.ts`
- ✅ `RITUAL_SUMMONING_SPEC.md` (this file)

## Files to Modify
- ⏳ `src/components/GrimoireEditor.tsx` - Main integration
- ⏳ `src/components/Sidebar.tsx` - Add ritual selector mode
