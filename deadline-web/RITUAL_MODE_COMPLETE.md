# Ritual Mode (Focus Mode) - Complete

## Overview
Added a distraction-free "Ritual Mode" to the Grimoire Editor that hides all UI elements and centers the editor for focused writing sessions.

## Features

### Activation
**Button Location**: Top-right of the header bar, next to Export button
- **Icon**: Meditation/Focus icon
- **Label**: "Ritual Mode" (changes to "Exit Ritual" when active)
- **Keyboard Shortcut**: `Ctrl+Shift+F` (or `Cmd+Shift+F` on Mac)

### Visual Changes When Active

1. **Background Darkening**
   - Main background transitions from `#0c0c0c` to pure `black`
   - Smooth 500ms transition for cinematic effect

2. **Left Sidebar (Documents)**
   - Slides off-screen to the left (`-translate-x-full`)
   - Fades to 0 opacity
   - Becomes non-interactive (`pointer-events-none`)

3. **Right Sidebar (Dark Arts Toolkit)**
   - Slides off-screen to the right (`translate-x-full`)
   - Fades to 0 opacity
   - Hidden completely

4. **Main Editor**
   - Centers horizontally on screen
   - Constrains to max-width of 800px (optimal reading width)
   - Maintains padding for comfortable margins
   - Full vertical space utilization

5. **Exit Button**
   - Floating button appears in top-right corner
   - Purple themed with glassmorphic background
   - Icon + "Exit Ritual" label
   - Hover effects and smooth transitions

### Keyboard Shortcuts

- **Enter Ritual Mode**: `Ctrl+Shift+F` (Cmd+Shift+F on Mac)
- **Exit Ritual Mode**: 
  - `Escape` key
  - `Ctrl+Shift+F` again (toggle)
  - Click "Exit Ritual" button

### Behavior

**What Stays Visible**:
- Document title (editable)
- Main editor content
- Stats display (word count, reading time)
- Formatting toolbar (when text is selected)
- Exit Ritual button

**What Hides**:
- Left sidebar (document list)
- Right sidebar (Dark Arts toolkit)
- Header navigation elements (partially)
- View mode toggles

**Smooth Transitions**:
- All elements use 500ms duration
- Opacity and transform animations
- Color transitions for background

## Use Cases

1. **Deep Writing Sessions**
   - Remove all distractions
   - Focus solely on content
   - Optimal reading width prevents eye strain

2. **Flow State**
   - Minimal UI for maximum immersion
   - Dark background reduces visual noise
   - Centered layout feels more intimate

3. **Final Editing**
   - Review text without sidebar clutter
   - Better sense of document flow
   - Professional manuscript view

## Technical Implementation

### State Management
```typescript
const [ritualMode, setRitualMode] = useState(false);
```

### Conditional Styling
- Uses `clsx` for dynamic class application
- Tailwind transitions for smooth animations
- Conditional rendering for exit button

### Responsive Design
- Works on all screen sizes
- Mobile-friendly (though sidebars already hidden on mobile)
- Maintains accessibility

## Accessibility

- **ARIA Labels**: All buttons properly labeled
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Editor maintains focus
- **Screen Readers**: Announces mode changes

## Status
✅ Ritual Mode toggle button added
✅ Keyboard shortcuts implemented (Ctrl+Shift+F, Esc)
✅ Left sidebar hides with slide animation
✅ Right sidebar hides with slide animation
✅ Editor centers with 800px max-width
✅ Background darkens to pure black
✅ Floating "Exit Ritual" button appears
✅ Smooth 500ms transitions throughout
✅ No TypeScript errors
✅ Fully accessible
