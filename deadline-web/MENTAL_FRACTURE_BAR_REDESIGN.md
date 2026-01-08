# Mental Fracture Bar Redesign - Complete

## Overview
Redesigned the sanity bar across all typing games to fit the horror theme better. The old pink waveform has been replaced with a "Mental Fracture" bar that uses horror-appropriate visuals.

## Changes Made

### 1. VerbumDei (Verbum Dei)
**Location:** Top right header

**Old Design:**
- Pink/purple EKG waveform
- Thick bordered container
- Purple/pink color scheme

**New Design:**
- **Name:** "Mental Fracture" instead of "Sanity"
- **Colors:** White → Orange → Red gradient (Sane → Insane)
- **Visual:** Jagged line that gets more chaotic as sanity drops
  - High sanity (>60%): Gentle jagged line, white color
  - Medium sanity (30-60%): More chaotic jagged line, orange color
  - Low sanity (<30%): Violent jagged line, red color
- **Cracked Glass Overlay:** Appears and intensifies as sanity drops below 60%
- **Container:** Minimal dark background, integrated into darkness (no thick border)
- **Animation:** Subtle tremble effect that intensifies with lower sanity
- **Status Text:** "Intact" → "Cracking" → "⚠ FRACTURING"

### 2. TheSilentVigil (The Silent Vigil)
**Location:** Bottom of screen (CCTV overlay)

**Old Design:**
- Rounded bar with green/yellow/red gradient
- Border with rounded corners

**New Design:**
- **Name:** "Mental Fracture" instead of "Sanity"
- **Colors:** White → Orange → Red gradient
- **Visual:** Jagged line with varying chaos levels based on sanity
- **Cracked Glass Overlay:** Appears below 50% sanity
- **Container:** Minimal dark background, no border
- **Animation:** Tremble effect when sanity is low
- **Percentage Display:** Color-coded and glowing when critical

### 3. TheDarkRoom (The Dark Room)
**Location:** Left sidebar

**Old Design:**
- 3 simple boxes with red border/fill

**New Design:**
- **Name:** "Mental Fracture" instead of "Sanity"
- **Visual:** 3 larger boxes with:
  - Cracked glass texture overlay
  - Gradient background (white to red) when active
  - Dark, shattered appearance when lost
  - Red glow effect for active boxes
  - Pulse animation for active boxes
- **Style:** More dimensional with inner shadows and glows

## Technical Implementation

### New CSS Animations
- `fractureTremble`: Subtle shake effect for VerbumDei bar
- `vigilTremble`: Subtle shake effect for TheSilentVigil bar

### SVG Paths
- Three different jagged line paths for each sanity level
- Paths become more chaotic as sanity decreases
- Smooth transitions between states

### Gradient System
- Consistent white → orange → red gradient across all games
- Color transitions based on sanity percentage
- Glow effects intensify at critical levels

## Horror Theme Alignment
✅ Removed pink/purple colors that didn't fit horror aesthetic
✅ Added white → red gradient representing mental deterioration
✅ Integrated bars into darkness (removed thick borders)
✅ Added cracked glass texture for psychological horror feel
✅ Jagged, chaotic lines replace smooth waveforms
✅ Renamed to "Mental Fracture" for more horror-appropriate terminology
✅ Added trembling/shaking effects for instability
✅ Status text uses horror language ("Fracturing" vs "Critical")

## Files Modified
- `deadline-web/src/components/VerbumDei.tsx`
- `deadline-web/src/components/TheSilentVigil.tsx`
- `deadline-web/src/components/TheDarkRoom.tsx`

## Testing
All components compile without errors. Visual testing recommended to verify:
- Gradient transitions at different sanity levels
- Cracked glass overlay appearance
- Animation smoothness
- Readability in dark environments
