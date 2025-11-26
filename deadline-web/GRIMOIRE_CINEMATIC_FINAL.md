# Grimoire Editor - Cinematic Final Polish

## Overview
The final 1% polish to remove all remaining "sci-fi" and "editor toolbar" elements, transforming the Grimoire into a pure cinematic horror writing experience.

## Changes Applied

### 1. Cast & Lore Buttons (Anti-Cyberpunk Fix)
**Location:** Right Panel tab navigation in `AltarOfWhispers.tsx`

**Before:**
- Angled polygon background shapes
- Solid background colors
- Border-based active state

**After:**
- Pure ghost-style buttons
- No backgrounds or shapes
- Icon: `text-purple-500 group-hover:text-purple-400 group-hover:scale-110`
- Text: `text-zinc-400 font-serif uppercase tracking-widest text-xs`
- Hover: Underline appears with `border-b border-purple-500`
- Active state: Purple text with underline

### 2. Top Toolbar Icons
**Location:** View mode toggle buttons in `GrimoireEditor.tsx`

**Changes:**
- Removed `p-2` padding backgrounds
- Made icons float in the void
- Simplified to `transition-colors` only
- Inactive: `text-zinc-600 hover:text-zinc-300`
- Active: `text-purple-400` with glow effect

### 3. Soul Essence Empty State
**Location:** `AltarOfWhispers.tsx` - when no word goal is set

**Before:**
- Bottle icon: `opacity-20` (barely visible)
- Text: `text-zinc-600`

**After:**
- Bottle icon: `text-zinc-600` (more visible, no opacity)
- Text: `text-zinc-500 italic` (lighter, more readable)

### 4. Cinematic Vignette Overlay
**Location:** Added to `GrimoireEditor.tsx` as final element

**Implementation:**
```tsx
<div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
```

**Effect:**
- Darkens the corners of the screen
- Focuses the eye on the center (the text)
- Creates a movie-like cinematic feel
- Non-interactive (pointer-events-none)
- Highest z-index to overlay everything

## Visual Impact

### Before
- Buttons had geometric shapes and solid backgrounds
- Toolbar icons had padding/background blocks
- Empty states were too dark to see
- Screen felt flat and software-like

### After
- Buttons are pure ghost elements floating in space
- Icons are standalone, minimal, ethereal
- Empty states are visible but subtle
- Screen has cinematic depth with vignette
- Feels like watching a horror film

## Design Philosophy
This polish removes the last traces of "UI software" feel:
- No more geometric shapes or polygons
- No more solid backgrounds on interactive elements
- Everything floats in the darkness
- Focus is drawn to the center (the writing)
- Pure horror atmosphere

## Files Modified
- `deadline-web/src/components/GrimoireEditor.tsx`
- `deadline-web/src/components/AltarOfWhispers.tsx`

## Visibility & Contrast Polish (Follow-up)

### Empty State Icons
**Changed:** All empty state icons from `opacity-30` to `text-zinc-600`
- "No characters yet" user icon
- "No research yet" book icon
- "Set a goal..." bottle icon

**Result:** Icons are now visible and legible while maintaining subtle presence.

### Add Character/Research Buttons
**Before:** Dashed border boxes with backgrounds
```tsx
className="w-full py-3 border-2 border-dashed border-stone-800..."
```

**After:** Pure text links
```tsx
className="flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors py-4 uppercase tracking-widest text-xs"
```
- Removed all borders and backgrounds
- Smaller icon (`size-3`)
- Clean hover state

### Word Goal Layout
**Before:** Label left, number right
**After:** Stacked and centered
```tsx
<div className="flex flex-col items-center justify-center mt-6 mb-6">
  <label className="text-xs uppercase tracking-widest text-zinc-600 mb-2">Word Goal</label>
  <input className="text-4xl font-serif text-zinc-500 text-center..." />
</div>
```
- Large centered number (`text-4xl`)
- Label above
- More elegant and focused

### Resurrect Button
**Changed:** Border opacity reduced from `border-amber-900/50` to `border-amber-900/30`
- Feels like a whisper until hovered
- Less dominant in the UI
- Maintains elegance

## Testing Checklist
- [ ] Cast/Lore buttons have no backgrounds
- [ ] Cast/Lore buttons show underline on hover
- [ ] View mode icons float without backgrounds
- [ ] Soul Essence bottle icon is visible (text-zinc-600)
- [ ] Empty state icons are legible (text-zinc-600)
- [ ] Add Character/Research buttons are text links
- [ ] Word Goal is stacked and centered
- [ ] Resurrect button is subtle until hovered
- [ ] Cinematic vignette darkens screen edges
- [ ] Overall feel is movie-like, not software-like
