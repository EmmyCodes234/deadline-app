# Noctuary → Grimoire Editor Switch

## Decision
Replaced the Monaco-based NoctuaryEditor with the existing GrimoireEditor for the `/noctuary` route.

## Rationale

### Why Switch?

**Monaco Editor Issues:**
- Looks like VS Code despite CSS overrides
- Technical/developer-focused aesthetic
- Requires aggressive CSS hacks to hide UI
- Doesn't fit the horror theme naturally
- Heavy dependency (~4MB)

**Grimoire Editor Benefits:**
- Already designed for horror/gothic aesthetic
- Custom-built for the app's theme
- No "code editor" associations
- Lighter weight (native textarea)
- Fully integrated with app features
- Beautiful, immersive design
- Cinematic view modes
- Fragment system
- Ritual mechanics
- Crypt integration

### What We Keep

The Noctuary-specific features we built can be preserved for future integration:

**Trope Executioner:**
- Could be added to Grimoire as optional "strict mode"
- Regex-based cliché detection
- Paragraph deletion on match

**Session Haunt:**
- Could enhance Grimoire's existing horror features
- Proper noun extraction
- Haunting messages in sidebar

**Export Ritual:**
- Could replace standard export in Grimoire
- Voice-activated export ceremony
- Microphone-based progress

**Panic Vignette:**
- Could be added to Grimoire
- Idle detection
- Red vignette effect

**Polish Features:**
- Handwritten fonts (Caveat)
- Bleed-in animations
- Monaco overrides (no longer needed)

## Changes Made

### App.tsx
```typescript
// Before
const NoctuaryEditor = lazy(() =>
  import('@/components/NoctuaryEditor').then((m) => ({ default: m.NoctuaryEditor }))
);

// After
const GrimoireEditor = lazy(() =>
  import('@/components/GrimoireEditor').then((m) => ({ default: m.GrimoireEditor }))
);
```

### Route Update
```typescript
// Before
<Route path="/noctuary" element={<NoctuaryEditor />} />

// After
<Route path="/noctuary" element={<GrimoireEditor />} />
```

## User Experience

### Before (Monaco Noctuary)
- Minimalist void aesthetic
- No line numbers or UI
- Trope Executioner active
- Session Haunt messages
- Export Ritual required
- Panic vignette on idle
- Monaco editor feel

### After (Grimoire Noctuary)
- Gothic horror aesthetic
- Cinematic view modes
- Fragment system
- Ritual mechanics
- Crypt integration
- Sidebar with documents
- Continuous scroll mode
- Corkboard view
- Compile system
- Snapshots
- Power words
- Subliminal prompts
- Native feel

## Files Status

### Active Files
- `src/App.tsx` - Updated route
- `src/components/GrimoireEditor.tsx` - Now used for Noctuary

### Preserved Files (For Reference/Future Use)
- `src/components/NoctuaryEditor.tsx` - Monaco implementation
- `src/components/ExportRitual.tsx` - Voice export modal
- `src/index.css` - Noctuary polish styles
- `NOCTUARY_*.md` - Documentation

### Can Be Removed (Optional Cleanup)
- `src/components/NoctuaryEditor.tsx`
- `@monaco-editor/react` dependency (if not used elsewhere)

## Future Integration Ideas

### Grimoire + Noctuary Features

**1. Noctuary Mode Toggle:**
```typescript
const [noctuaryMode, setNoctuaryMode] = useState(false);
```
- Enables Trope Executioner
- Activates Session Haunt
- Requires Export Ritual
- Adds Panic Vignette

**2. Fragment Enhancement:**
- Add trope detection to fragments
- Haunt messages based on fragment content
- Voice-activated fragment compilation

**3. Ritual Integration:**
- Export Ritual as alternative to Compile
- Voice-based ritual completion
- Microphone-activated features

**4. Sidebar Haunting:**
- Session Haunt messages in sidebar
- Victim tracking in document list
- Handwritten notes appear

## Benefits of This Approach

### Immediate
✅ Better aesthetic fit
✅ Lighter weight
✅ More features available
✅ Consistent with app design
✅ No Monaco overhead
✅ Native horror feel

### Long-term
✅ Single editor to maintain
✅ Can add Noctuary features incrementally
✅ Modular feature toggles
✅ Better user experience
✅ More cohesive app

## Conclusion

The GrimoireEditor is a **superior foundation** for the Noctuary experience. It already embodies the horror aesthetic we were trying to force onto Monaco. The Noctuary-specific mechanics we built (Trope Executioner, Session Haunt, Export Ritual) can be integrated into Grimoire as optional enhancements, creating a more powerful and cohesive writing tool.

**Result:** The `/noctuary` route now provides the full Grimoire experience—a gothic, immersive writing environment that naturally fits the horror theme without requiring CSS hacks or Monaco overrides.
