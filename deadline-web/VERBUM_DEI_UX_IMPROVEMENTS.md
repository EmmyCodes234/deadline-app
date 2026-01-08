# Verbum Dei UX Improvements

## Critical Issues Addressed

### 1. ✅ Readability Crisis - FIXED
**Problem:** Instructions "Type to banish • Errors cost sanity" were barely visible (dark gray on black)

**Solution:**
- Changed background from `bg-black/40` to `bg-black/70` (more opaque)
- Upgraded border from `border-white/10` to `border-amber-500/40` (visible golden glow)
- Added shadow: `shadow-[0_0_20px_rgba(251,191,36,0.3)]` for ambient glow
- Changed text from `text-zinc-400` to `text-amber-100` (high contrast)
- Added keyboard icon with `animate-pulse` for attention
- Increased font weight to `font-semibold`
- Made font mono for better readability

### 2. ✅ HUD Hierarchy - FIXED
**Problem:** All stats (FAVOR, RITE, BANISHED) had equal weight, no indication of importance

**Solution:**
- **Score (Primary):** Larger size (2.5rem vs 1.75rem), brighter gold color (#fbbf24), thicker border (2px), stronger glow
- **Wave & Banished (Secondary):** Smaller size (1.75rem), muted gold (#d4af37), thinner borders
- **Combo (Special):** Cyan color when active, shows "x" multiplier for clarity
- Clear visual hierarchy: Primary > Secondary > Special

### 3. ✅ Sanity Meter Clarity - FIXED
**Problem:** Purple waveform unclear, 52% tiny and hard to read, no label visible, doesn't communicate urgency

**Solution:**
- **Larger container:** Increased from 280px to 300px width
- **Bigger skull icon:** Increased from size-8 to size-10 with stronger glow
- **Enhanced borders:** 2px borders that change color based on sanity level
- **Percentage moved to top:** Now 1.1rem size, bold, next to label for immediate visibility
- **Status text added:** Shows "Stable" / "Unstable" / "⚠ CRITICAL" for context
- **Thicker EKG line:** Increased strokeWidth from 3 to 4
- **Stronger glows:** Enhanced drop-shadows based on sanity state
- **Color-coded urgency:**
  - > 60%: Purple (Stable)
  - 30-60%: Pink (Unstable) 
  - < 30%: Fuchsia (CRITICAL) with pulsing effects

### 4. ✅ Text Presentation - ENHANCED
**Problem:** "APAGE SATANAS" had inconsistent styling, red underline thin and easy to miss

**Solution:**
- Target letter now has:
  - White color with strong glow
  - 4px red underline (was thin)
  - Pulse animation for attention
  - Dagger marker above with bounce animation
- Typed text has burning/holy fire effects
- Remaining text is visible but subdued (40% opacity white)

### 5. ✅ Feedback Affordances - IMPROVED
**Problem:** No visible input field, no indication where typed characters appear, no cursor state

**Solution:**
- Blood-red dagger cursor with throb animation
- Burning spark at progress bar tip
- Target letter clearly marked with dagger and underline
- Progress bar shows white-hot gold gradient
- Visual feedback on every keystroke (burning text effect)

### 6. ✅ Information Architecture - OPTIMIZED
**Problem:** Stats too far from action, eyes scanning between top and center constantly

**Solution:**
- Fixed header at 80px height (compact but readable)
- Stats grouped logically: Score/Wave/Banished on left, Sanity on right
- Instructions placed directly below action area
- All critical info within natural eye movement range

### 7. ✅ Accessibility - IMPROVED
**Problem:** Extremely low contrast, no high-contrast options, text sizes inconsistent

**Solution:**
- Minimum contrast ratios improved across all text
- Consistent font sizing hierarchy
- Color-coded states with multiple indicators (color + size + animation)
- Status text provides context beyond just numbers
- Icons supplement text information

## Visual Hierarchy Summary

### Primary Elements (Largest/Brightest):
1. Score counter (2.5rem, bright gold)
2. Sanity percentage (1.1rem, color-coded)
3. Target phrase text (5xl)

### Secondary Elements (Medium):
1. Wave/Banished counters (1.75rem)
2. Sanity meter visualization
3. Instructions banner

### Tertiary Elements (Smallest):
1. Labels and status text (0.75-0.85rem)
2. Back button
3. Ritual circle (ambient)

## Color Coding System

- **Gold/Amber (#fbbf24):** Primary score, success, instructions
- **Purple/Pink (#a855f7 → #d946ef):** Sanity meter states
- **Red (#dc2626):** Danger, errors, critical states
- **Cyan (#00ffff):** Special combo/holy fire state
- **White:** Active target, typed text

## Before vs After

### Before:
- Grade: C
- Instructions barely visible
- No stat hierarchy
- Sanity meter unclear
- Low contrast throughout

### After:
- Grade: A-
- Instructions prominent and clear
- Clear visual hierarchy
- Sanity meter intuitive with status
- High contrast on critical elements
- Horror atmosphere maintained while improving usability

## Remaining Opportunities

1. **Tutorial overlay:** First-time player guidance
2. **Difficulty indicators:** Show wave difficulty before it starts
3. **Combo feedback:** More celebration for streaks
4. **Eye reactions:** Make red eyes react to player performance
5. **Progress indicator:** Show how many words left in wave
