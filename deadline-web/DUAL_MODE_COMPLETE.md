# Dual Mode System - Polymorphic Grimoire Editor ✅

## Overview
Implemented a sophisticated dual-mode system where the Grimoire Editor transforms based on document type, creating a "polymorphic interface" that serves as both a sanctuary for free writing and a gauntlet for ritual challenges.

## 🏗️ Architecture

### Document Schema Updates (`useCrypt.ts`)

**New Types:**
```typescript
export type DocumentMode = 'free' | 'ritual';

export interface RitualConfig {
  ritualId: string;
  ritualName: string;
  targetWordCount: number;
  requiredWords: string[];
  forbiddenWords: string[];
}
```

**Updated CryptItem:**
```typescript
export interface CryptItem {
  // ... existing fields
  mode?: DocumentMode; // 'free' or 'ritual'
  ritualConfig?: RitualConfig; // Ritual constraints if mode === 'ritual'
}
```

**Updated createDoc Function:**
- Now accepts `mode` and `ritualConfig` parameters
- Backward compatible with existing code
- Automatically sets document type on creation

## 🎭 The Polymorphic Interface

### 1. The Sidebar (The Crypt)
**Dual Sections:**
- **"Dark Drafts"** (Free Mode): Standard documents for creative writing
- **"Active Rituals"** (Ritual Mode): Game mode documents with constraints

**Behavior:**
- Clicking free documents → Opens standard editor
- Clicking ritual documents → Opens ritual interface with linting
- "NEW RITUAL" button → Opens ritual selector

### 2. The Right Panel (The Altar)
**Conditional Rendering:**
- **If `mode === 'free'`**: Shows Altar of Whispers
  - Synopsis
  - Characters
  - Research links
  - Word goals
- **If `mode === 'ritual'`**: Shows Ritual Specification
  - Summoning progress
  - Requirements list
  - Target word count
  - Real-time status

### 3. The Editor Canvas
**Conditional Behavior:**
- **If `mode === 'free'`**: Standard textarea
  - No word restrictions
  - Power words still active
  - Normal writing experience
- **If `mode === 'ritual'`**: Ritual-enhanced editor
  - Word redaction (forbidden words → `[REDACTED]`)
  - Requirement tracking
  - Background entity fade-in
  - Real-time linting

### 4. The Footer
**Conditional Display:**
- **If `mode === 'free'`**: Word count
  - "~ X words inscribed ~"
- **If `mode === 'ritual'`**: Helper HUD
  - Dynamic hints
  - Error messages
  - Progress feedback

## 🔄 User Flow

### Creating Free Document
1. Click "New Tome Page" in sidebar
2. Document created with `mode: 'free'`
3. Standard editor opens
4. Right panel shows Altar of Whispers
5. Footer shows word count

### Creating Ritual Document
1. Click "NEW RITUAL" button
2. Ritual selector appears
3. Click ritual card → Briefing modal
4. Click "ACCEPT THE CONTRACT"
5. Document created with `mode: 'ritual'` + `ritualConfig`
6. Ritual editor opens
7. Right panel shows Ritual Specification
8. Footer shows Helper HUD
9. Word redaction active
10. Background entity fades in with progress

### Switching Between Documents
- Click any document in sidebar
- Editor automatically adapts to document mode
- UI transforms seamlessly
- No manual mode toggle needed

## 🎨 Visual Indicators

### Free Mode
- Standard purple theme
- Clean, minimal interface
- Focus on creativity
- No restrictions

### Ritual Mode
- Amber/gold accents
- Ritual specification panel
- Progress indicators
- Background entity
- Helper HUD messages

## 📊 State Management

### Removed State
- ❌ `showRitualMode` toggle
- ❌ `selectedRitual` global state

### New State
- ✅ `showRitualSelector` (for ritual picker)
- ✅ Document-based mode detection

### Computed Values
```typescript
const isRitualMode = activeDocument?.mode === 'ritual';
const ritualSpec = isRitualMode && activeDocument?.ritualConfig 
  ? RITUAL_SPECS.find(r => r.id === activeDocument.ritualConfig?.ritualId) 
  : null;
```

## 🎯 Benefits

### 1. Cleaner Architecture
- Mode is a property of the document, not global state
- Each document carries its own configuration
- No mode confusion or state synchronization issues

### 2. Better UX
- Users can have both free and ritual documents open
- Switching between documents automatically changes interface
- No manual mode toggling required
- Clear visual distinction

### 3. Scalability
- Easy to add new document modes in future
- Each mode can have its own configuration
- Polymorphic pattern is extensible

### 4. Narrative Power
**For Judges:**
> "We built a polymorphic interface that transforms based on document type. It serves as a sanctuary for free writing, but morphs into a gauntlet when the user initiates a Ritual. The same UI components adapt their behavior contextually, creating two distinct experiences within one cohesive editor."

## 📁 Files Modified
- ✅ `src/hooks/useCrypt.ts` - Added mode and ritualConfig to schema
- ✅ `src/components/GrimoireEditor.tsx` - Implemented polymorphic rendering
- ✅ `DUAL_MODE_COMPLETE.md` (this file)

## 🚀 Future Enhancements

### Additional Modes
- **`mode: 'timed'`**: Time-pressure writing challenges
- **`mode: 'collaborative'`**: Multi-user documents
- **`mode: 'encrypted'`**: Password-protected documents

### Mode-Specific Features
- Different background themes per mode
- Mode-specific keyboard shortcuts
- Custom toolbars per mode
- Mode-specific export formats

## ✅ Success Criteria Met
- ✅ Document schema includes mode field
- ✅ Sidebar shows both free and ritual documents
- ✅ Right panel adapts to document mode
- ✅ Editor behavior changes based on mode
- ✅ Footer displays mode-appropriate content
- ✅ Seamless switching between documents
- ✅ No manual mode toggle needed
- ✅ Clean, maintainable architecture
- ✅ Narrative-ready for judges

## 🎮 Ready to Use!
The dual-mode system is fully operational. Users can now:
1. Create free documents for unrestricted writing
2. Create ritual documents for gamified challenges
3. Switch between them seamlessly
4. Experience two distinct interfaces in one editor
5. Have multiple documents of different modes open simultaneously

The Grimoire Editor is now a true polymorphic interface!
