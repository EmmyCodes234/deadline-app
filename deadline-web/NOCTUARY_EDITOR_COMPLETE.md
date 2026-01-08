# The Noctuary Editor - Complete Implementation

## Overview
A minimalist, distraction-free writing environment built with Monaco Editor. Features a custom "Void" theme with a 70/30 split layout: main editor and "The Bleed" margin for metadata.

---

## Architecture

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Main Editor (70%)          │  The Bleed (30%)     │
│                             │                      │
│  [Monaco Editor]            │  [Metadata Panel]    │
│                             │                      │
│                             │                      │
└─────────────────────────────────────────────────────┘
```

**Main Editor:**
- Width: 70%
- Full height
- Monaco Editor instance
- Custom "Void" theme
- Minimal UI

**The Bleed Margin:**
- Width: 30%
- ID: `bleed-margin`
- Right side panel
- Metadata display
- Future feature space

---

## Monaco Editor Configuration

### Core Options
```typescript
{
  minimap: { enabled: false },           // No minimap
  lineNumbers: 'off',                    // No line numbers
  glyphMargin: false,                    // No glyph margin
  folding: false,                        // No code folding
  scrollbar: {
    vertical: 'hidden',                  // Hidden scrollbars
    horizontal: 'hidden',
  },
  wordWrap: 'on',                        // Wrap long lines
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 16,
  lineHeight: 28,
  padding: { top: 40, bottom: 40 },     // Breathing room
  scrollBeyondLastLine: false,
  renderLineHighlight: 'none',           // No line highlight
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  overviewRulerLanes: 0,
  contextmenu: false,                    // No right-click menu
}
```

### Why These Settings?

**No Minimap:** Reduces visual clutter  
**No Line Numbers:** Removes technical feel  
**Hidden Scrollbars:** Cleaner aesthetic  
**Word Wrap:** Better for prose writing  
**IBM Plex Mono:** Professional monospace font  
**No Context Menu:** Prevents distractions  

---

## Custom "Void" Theme

### Theme Definition
```typescript
monaco.editor.defineTheme('void', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#0b0b0b',              // Near-black
    'editor.foreground': '#a3a3a3',              // Gray text
    'editor.selectionBackground': '#7f1d1d40',   // Faint blood red
    'editorCursor.foreground': '#ef4444',        // Red cursor
    'editor.lineHighlightBackground': '#0b0b0b', // No highlight
    'editorLineNumber.foreground': '#3f3f46',    // Dark gray (unused)
    'editorLineNumber.activeForeground': '#71717a', // Gray (unused)
  },
});
```

### Color Palette

**Background:** `#0b0b0b` (zinc-950, near-black)
- Creates void-like atmosphere
- Reduces eye strain
- Focuses attention on text

**Foreground:** `#a3a3a3` (zinc-400)
- Readable gray
- Not too bright
- Professional appearance

**Selection:** `#7f1d1d40` (red-900 with 25% opacity)
- Subtle blood-red tint
- Maintains horror aesthetic
- Not distracting

**Cursor:** `#ef4444` (red-500)
- Bright red
- Easy to locate
- Thematic consistency

---

## The Bleed Margin

### Purpose
A dedicated space for metadata, statistics, and future interactive features without cluttering the main writing area.

### Current Features

**1. Header**
```tsx
<h2>The Bleed</h2>
<p>Where thoughts escape the page</p>
```

**2. Word Count**
- Real-time calculation
- Splits on whitespace
- Filters empty strings
- Large monospace display

**3. Character Count**
- Includes all characters
- Real-time updates
- Monospace display

**4. Atmospheric Quote**
```
"In the void, words take on a life of their own..."
```

**5. Instructions**
- Brief description
- Usage guidance
- Thematic text

### Styling
- Background: `zinc-950` (darker than editor)
- Border: `zinc-900` (subtle separation)
- Text: `zinc-400` to `zinc-600` (hierarchy)
- Padding: `2rem` (comfortable spacing)
- Overflow: `auto` (scrollable if needed)

---

## Auto-Focus Behavior

### Implementation
```typescript
const handleEditorDidMount: OnMount = (editor, monaco) => {
  editorRef.current = editor;
  
  // Define theme
  monaco.editor.defineTheme('void', { ... });
  monaco.editor.setTheme('void');
  
  // Focus immediately
  editor.focus();
};
```

**Why Auto-Focus?**
- Immediate writing readiness
- No extra click required
- Seamless entry experience
- Reduces friction

---

## State Management

### Editor Reference
```typescript
const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
```
- Stores Monaco editor instance
- Enables programmatic control
- Used for future features

### Content State
```typescript
const [content, setContent] = useState('');
```
- Tracks editor content
- Updates on every change
- Powers word/character counts
- Enables future features (save, export, etc.)

### Change Handler
```typescript
const handleEditorChange = (value: string | undefined) => {
  setContent(value || '');
};
```
- Fires on every keystroke
- Updates state
- Triggers re-renders for counts

---

## Default Content

```markdown
# The Noctuary

Begin writing in the void...
```

**Purpose:**
- Provides starting point
- Sets tone
- Demonstrates markdown support
- Invites user to begin

---

## Navigation

### Exit Button
- Position: Top-left overlay
- Icon: Left arrow
- Text: "EXIT"
- Link: `/hub`
- Styling: Subtle, non-intrusive
- Z-index: 10 (above editor)

**Design Rationale:**
- Always accessible
- Doesn't interfere with writing
- Consistent with app navigation
- Hover state for feedback

---

## Technical Details

### Package
```json
"@monaco-editor/react": "^4.6.0"
```

### Monaco Editor
- Full-featured code editor
- Used by VS Code
- Syntax highlighting
- IntelliSense support
- Extensible

### React Integration
- `@monaco-editor/react` wrapper
- Handles Monaco loading
- Provides React-friendly API
- Type-safe

### Performance
- Lazy loaded via React.lazy()
- Only loads when route accessed
- Monaco loads asynchronously
- Minimal bundle impact

---

## Future Enhancements

### Planned Features

**1. Auto-Save**
- Save to localStorage
- Periodic backups
- Restore on return

**2. Export Options**
- Download as .txt
- Download as .md
- Copy to clipboard

**3. The Bleed Interactions**
- Writing prompts
- Mood tracking
- Session timer
- Distraction counter

**4. Horror Elements**
- Subtle text corruption
- Occasional glitches
- Whispered suggestions
- Sanity meter

**5. Themes**
- Multiple void variants
- Time-based themes
- Mood-based themes

**6. Statistics**
- Writing streaks
- Total words written
- Average session length
- Most productive times

---

## Comparison to Dark Room

### Dark Room
- Game-focused
- Typing challenges
- Horror mechanics
- Time pressure
- Complex interactions

### Noctuary
- Writing-focused
- Minimalist design
- Atmospheric
- No pressure
- Simple, clean

**Philosophy:**
The Noctuary is about **creation**, not **challenge**. It's a space for writers to focus without distraction, wrapped in a subtle horror aesthetic.

---

## Route

**Path:** `/noctuary`  
**Protection:** Requires onboarding completion  
**Lazy Loaded:** Yes

---

## Files Created

1. **src/components/NoctuaryEditor.tsx** - Main component
2. **src/App.tsx** - Route updated (replaced Dark Room)
3. **package.json** - Added @monaco-editor/react

---

## Installation

```bash
npm install @monaco-editor/react
```

---

## Usage

```tsx
import { NoctuaryEditor } from '@/components/NoctuaryEditor';

// In route
<Route path="/noctuary" element={<NoctuaryEditor />} />
```

---

## Result

A professional, minimalist writing environment that:
- Removes all distractions
- Provides essential metadata
- Maintains horror aesthetic
- Offers smooth, responsive editing
- Auto-focuses for immediate use
- Scales for future features

The Noctuary replaces The Dark Room with a tool focused on **creation** rather than **challenge**, providing a calm space in the horror-themed app.
