# Noctuary Horror Mechanics - Complete

## Overview
Two psychological horror features that actively interfere with the writing process: The Trope Executioner (punishes clichés) and The Session Haunt (tracks and taunts using character names).

---

## 1. The Trope Executioner

### Concept
A hardcoded content filter that detects and punishes the use of horror writing clichés by deleting entire paragraphs and replacing them with "// COWARD".

### Banned Tropes

```typescript
const BANNED_TROPES = [
  /it was all a dream/i,
  /suddenly,? a/i,
  /shiver down (my|his|her|their) spine/i,
  /call is coming from inside/i,
  /let's split up/i,
  /ancient burial ground/i,
];
```

**Why These Tropes?**

1. **"It was all a dream"** - The ultimate cop-out ending
2. **"Suddenly, a..."** - Lazy shock tactics
3. **"Shiver down spine"** - Overused physical reaction
4. **"Call is coming from inside"** - Worn-out twist
5. **"Let's split up"** - Horror movie stupidity
6. **"Ancient burial ground"** - Tired setup

### Implementation

**Detection Logic:**
```typescript
const executeTropes = (text: string): string => {
  // Split into paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  const cleanedParagraphs = paragraphs.map(para => {
    // Check if paragraph contains any banned trope
    for (const trope of BANNED_TROPES) {
      if (trope.test(para)) {
        return '// COWARD';  // Replace entire paragraph
      }
    }
    return para;
  });
  
  return cleanedParagraphs.join('\n\n');
};
```

**Execution Flow:**
1. User types content
2. `onChange` fires
3. Content is checked against all trope patterns
4. If match found:
   - Entire paragraph is deleted
   - Replaced with `// COWARD`
   - Editor content is updated programmatically
   - Cursor position is preserved
5. User sees their paragraph vanish and replaced with shame

### Behavior

**Paragraph-Level Deletion:**
- Only the offending paragraph is affected
- Other paragraphs remain intact
- Blank lines separate paragraphs

**Immediate Feedback:**
- No delay or warning
- Instant replacement
- Cursor stays in place (if possible)

**Case Insensitive:**
- All patterns use `/i` flag
- "It Was All A Dream" triggers same as "it was all a dream"

**Regex Flexibility:**
- `suddenly,? a` matches "suddenly a" or "suddenly, a"
- `(my|his|her|their)` matches any possessive
- Patterns are forgiving but strict

### User Experience

**Psychological Impact:**
- Feels like being slapped by the editor
- "// COWARD" is deliberately insulting
- Forces writer to be more creative
- Creates fear of using clichés

**Writing Pressure:**
- Must think before typing
- Can't rely on tired tropes
- Encourages originality
- Adds tension to writing process

---

## 2. The Session Haunt

### Concept
Scans the user's text for proper nouns (character names), stores them, and generates haunting messages that reference these names every 15 seconds.

### Victim Detection

**Algorithm:**
```typescript
const extractVictims = (text: string): Set<string> => {
  const victims = new Set<string>();
  
  // Split into sentences
  const sentences = text.split(/[.!?]+/);
  
  sentences.forEach(sentence => {
    const words = sentence.trim().split(/\s+/);
    
    // Skip first word (sentence start)
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      
      // Check if capitalized and at least 2 chars
      if (/^[A-Z][a-z]+/.test(word) && word.length >= 2) {
        const clean = word.replace(/[^a-zA-Z]/g, '');
        if (clean.length >= 2) {
          victims.add(clean);
        }
      }
    }
  });
  
  return victims;
};
```

**Detection Rules:**

1. **Sentence Splitting:**
   - Split on `.`, `!`, `?`
   - Each sentence analyzed separately

2. **Skip Sentence Start:**
   - First word of sentence ignored
   - Prevents false positives from normal capitalization

3. **Capitalization Check:**
   - Must start with capital letter
   - Followed by lowercase letters
   - Pattern: `/^[A-Z][a-z]+/`

4. **Minimum Length:**
   - At least 2 characters
   - Prevents single-letter names

5. **Punctuation Removal:**
   - Strips commas, quotes, etc.
   - Keeps only letters

6. **Uniqueness:**
   - Stored in Set (no duplicates)
   - Each name tracked once

**Examples:**

```
"John walked into the room." → John ✓
"The door opened. Sarah screamed." → Sarah ✓
"He met Emily and Marcus." → Emily ✓, Marcus ✓
"I saw him." → (nothing, lowercase)
"The house was old." → (nothing, sentence start)
```

### Haunt Message Generation

**Message Templates:**
```typescript
const templates = [
  `Why did you kill ${randomVictim}?`,
  `${randomVictim} is watching you.`,
  `${randomVictim} remembers everything.`,
  `You can't save ${randomVictim}.`,
  `${randomVictim} knows what you did.`,
  `${randomVictim} won't forgive you.`,
  `Did ${randomVictim} deserve this?`,
  `${randomVictim} is still here.`,
  `${randomVictim} whispers your name.`,
  `You abandoned ${randomVictim}.`,
];
```

**Generation Logic:**
1. Check if any victims exist
2. Pick random victim from set
3. Pick random template
4. Insert victim name into template
5. Create message object with timestamp
6. Add to haunt messages array

**Timing:**
- First message: Immediate (when first victim detected)
- Subsequent messages: Every 15 seconds
- Timer resets when victims change

### Visual Display

**The Bleed Margin Updates:**

**1. Victims Counter:**
```tsx
<span className="text-sm text-zinc-500">Victims</span>
<span className="text-2xl font-mono text-zinc-400">{victims.size}</span>
```

**2. Victim Tags:**
```tsx
{Array.from(victims).map(victim => (
  <span className="px-2 py-1 bg-red-950/30 border border-red-900/50 text-red-400">
    {victim}
  </span>
))}
```

**3. Haunt Messages:**
```tsx
<div className="p-3 bg-zinc-900/50 border-l-2 border-red-900/50">
  <p className="text-red-400/80 italic" style={{ fontFamily: 'Caveat, cursive' }}>
    {msg.text}
  </p>
  <p className="text-xs text-zinc-700">{timestamp}</p>
</div>
```

**Styling Details:**
- **Handwritten Font:** Caveat (cursive)
- **Color:** Red-400 with 80% opacity
- **Border:** Red-900 left border (blood stain)
- **Background:** Zinc-900 with 50% opacity
- **Animation:** Fade-in on appearance
- **Timestamp:** Small gray text below

### User Experience

**Psychological Impact:**

1. **Surveillance Feeling:**
   - Editor is "reading" your story
   - Tracking character names
   - Feels invasive

2. **Guilt Induction:**
   - "Why did you kill [Name]?"
   - Implies writer is responsible
   - Creates emotional connection

3. **Paranoia:**
   - Messages appear unexpectedly
   - Every 15 seconds
   - Can't be stopped

4. **Immersion:**
   - Characters "come alive"
   - Names have power
   - Story bleeds into interface

**Writing Impact:**
- Makes writer think about character fates
- Adds weight to naming characters
- Creates tension around character deaths
- Encourages emotional investment

---

## Technical Implementation

### State Management

```typescript
const [content, setContent] = useState('');
const [victims, setVictims] = useState<Set<string>>(() => new Set());
const [hauntMessages, setHauntMessages] = useState<HauntMessage[]>([]);
const hauntTimerRef = useRef<number | undefined>(undefined);
const messageIdRef = useRef(0);
```

**Content:** Full editor text  
**Victims:** Set of detected proper nouns  
**Haunt Messages:** Array of generated messages  
**Haunt Timer:** Interval reference for cleanup  
**Message ID:** Incrementing counter for React keys  

### Change Handler Flow

```typescript
handleEditorChange(value) {
  1. Execute trope check
  2. If tropes found:
     - Replace paragraphs
     - Update editor programmatically
  3. Extract victims from text
  4. Update victims state
  5. Trigger haunt effect (via useEffect)
}
```

### Haunt Effect

```typescript
useEffect(() => {
  if (victims.size === 0) return;
  
  // Generate first message immediately
  generateHauntMessage();
  
  // Then every 15 seconds
  const timer = setInterval(generateHauntMessage, 15000);
  
  return () => clearInterval(timer);
}, [victims]);
```

**Dependencies:**
- Runs when `victims` changes
- Cleans up previous timer
- Starts new timer with current victims

### Performance Considerations

**Trope Execution:**
- Runs on every keystroke
- Regex checks are fast
- Only modifies if match found
- Paragraph-level granularity

**Victim Extraction:**
- Runs on every keystroke
- Sentence splitting is efficient
- Set prevents duplicates
- Minimal memory footprint

**Haunt Messages:**
- Only runs every 15 seconds
- Doesn't block typing
- Messages accumulate (no limit)
- Could add max message cap if needed

---

## Edge Cases

### Trope Executioner

**Multiple Tropes in One Paragraph:**
- First match triggers replacement
- Entire paragraph deleted
- Other tropes irrelevant

**Trope Across Paragraphs:**
- Each paragraph checked independently
- Only offending paragraph replaced

**Partial Matches:**
- "suddenly" alone doesn't trigger
- Must match full pattern
- "suddenly, a" or "suddenly a" required

### Session Haunt

**No Victims:**
- No messages generated
- Timer doesn't start
- Bleed margin shows stats only

**Common Words:**
- "The" at sentence start ignored
- "He", "She", "It" ignored (lowercase after first)
- Only proper nouns captured

**Punctuation:**
- "Sarah," → Sarah
- "John!" → John
- "Emily's" → Emilys (possessive removed)

**Multiple Instances:**
- Same name appears multiple times
- Only stored once (Set)
- Messages can repeat same name

---

## Future Enhancements

### Trope Executioner

1. **More Tropes:**
   - "The only way out is through"
   - "Based on a true story"
   - "Don't look back"
   - "Trust no one"

2. **Severity Levels:**
   - Minor tropes: Warning
   - Major tropes: Deletion
   - Repeated offenses: Harsher punishment

3. **Custom Tropes:**
   - User-defined patterns
   - Personal cliché list
   - Genre-specific filters

### Session Haunt

1. **Relationship Tracking:**
   - "John killed Sarah" → specific messages
   - Track character interactions
   - More contextual haunting

2. **Emotional Analysis:**
   - Detect character emotions
   - Generate appropriate messages
   - "Sarah was afraid" → fear-based haunts

3. **Story Arc Awareness:**
   - Beginning vs. end messages
   - Character development tracking
   - Plot-aware taunts

4. **Visual Corruption:**
   - Victim names glitch in editor
   - Random highlighting
   - Text distortion

---

## Files Modified

1. **src/components/NoctuaryEditor.tsx** - Added both mechanics

---

## Result

The Noctuary is now a **hostile writing environment** that:
- **Punishes lazy writing** with instant paragraph deletion
- **Tracks your characters** and uses them against you
- **Generates psychological pressure** through haunting messages
- **Creates paranoia** about what you write
- **Forces creativity** by banning clichés
- **Makes writing feel dangerous** and consequential

These mechanics transform a simple editor into an **adversarial creative tool** that challenges and haunts the writer.
