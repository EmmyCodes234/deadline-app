# Verbum Dei HUD Cleanup - Complete

## Overview
Cleaned up the Heads Up Display (HUD) in Verbum Dei to improve visual hierarchy, reduce clutter, and enhance the horror atmosphere.

## Changes Made

### 1. Stats Display (Top Bar)
**Location:** Top center of screen

**Old Design:**
- Stats positioned on the left side
- Mixed font styles (Crimson + Creepster)
- Inconsistent sizing and colors
- Divider lines between stats

**New Design:**
- **Position:** Perfectly centered at top of screen
- **Font:** Crimson Text serif with small caps for labels
- **Labels:** Small caps, stone-500 color, subtle
- **Numbers:** Large (2.5rem), gold/amber-500 color with glow
- **Layout:** Clean horizontal alignment with consistent spacing
- **Hierarchy:** All stats have equal visual weight

### 2. "Type to Banish" Instructions
**Location:** Below the phrase display

**Old Design:**
- Yellow bordered box with dark background
- Multiple pieces of information
- Icon + text + error warnings
- Always visible and prominent

**New Design:**
- **Style:** Small, italicized serif font (Crimson Text)
- **Color:** text-stone-500 (subtle gray)
- **Text:** Simple "Type to banish the spirits"
- **Behavior:** Fades away (opacity 0) once typing starts
- **No border or background** - just text
- **Transition:** Smooth 1-second fade

### 3. Monster/Shadow Figure Enhancement
**Location:** Center of game area (GhostSprite component)

**Enhancements:**
- **Red Eyes:**
  - Increased size: 12px → 16px (boss), 8px → 12px (normal)
  - Enhanced glow with triple shadow layers
  - Added brightness(1.5) and contrast(1.3) filters
  - Larger glow radius for better visibility
  - z-index: 30 to ensure eyes are always on top

- **Shadow Body:**
  - Added radial gradient background for depth
  - Boss: Dark red gradient (rgba(40, 0, 0, 0.9))
  - Normal: Dark purple gradient (rgba(20, 0, 20, 0.9))
  - Enhanced contrast (1.2) and adjusted brightness
  - Additional shadow layer with red tint for bosses
  - Darker overall appearance for better definition

## Visual Improvements

### Hierarchy
✅ Stats are now perfectly centered and balanced
✅ Gold numbers stand out against dark background
✅ Small caps labels are subtle but readable
✅ Instructions fade away to reduce clutter during gameplay

### Horror Atmosphere
✅ Removed bright yellow borders that broke immersion
✅ Enhanced monster visibility with darker, more defined shadows
✅ Red eyes are now clearly visible and menacing
✅ Cleaner, more focused UI that doesn't distract from the horror

### Readability
✅ Gold numbers are highly visible against dark background
✅ Consistent serif font family throughout
✅ Better contrast on all text elements
✅ Monster figure is clearly defined against background

## Technical Details

### Fonts Used
- **Crimson Text**: Serif font for stats labels and instructions
- **font-variant: small-caps**: For stat labels (Score, Wave, Banished, Combo)

### Colors
- **Gold/Amber**: #f59e0b for stat numbers
- **Stone-500**: #78716c for instructions
- **Stone-400**: #a8a29e for stat labels

### Animations
- **Fade Out**: Instructions fade from 60% to 0% opacity when typing starts
- **Duration**: 1 second smooth transition

## Files Modified
- `deadline-web/src/components/VerbumDei.tsx`
- `deadline-web/src/components/GhostSprite.tsx`

## Testing Notes
All components compile without errors. Visual testing recommended to verify:
- Stats are perfectly centered at all screen sizes
- Instructions fade smoothly when typing begins
- Monster eyes are clearly visible
- Shadow figure has good contrast against background
- Gold numbers are readable and prominent
