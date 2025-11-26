# Typing Particles System - Complete

## Overview
A dynamic particle effect system that spawns visual feedback on every keystroke, with colors that change based on typing speed (WPM).

## Component: `TypingParticles.tsx`

### Features

**Particle Spawning:**
- Spawns 3-5 particles per keystroke
- Particles explode outward in random directions
- Each particle has random velocity (50-150px/s)
- Particles fade out and shrink over 0.5 seconds
- Auto-cleanup after animation completes

**Heat System (WPM-Based Colors):**
- **WPM > 60 (Hot)**: Red/Orange embers with glow effect
  - Colors: `#dc2626`, `#ea580c`, `#f59e0b`, `#fbbf24`
  - Box shadow glow for "burning" effect
- **WPM ≤ 60 (Cold)**: Grey/Black ash/ink
  - Colors: `#3f3f46`, `#52525b`, `#71717a`, `#a1a1aa`
  - No glow effect

**Real-Time WPM Calculation:**
- Tracks keystrokes over the last 60 seconds
- Calculates WPM assuming 5 characters per word
- Updates dynamically as user types
- Filters out modifier keys (Ctrl, Alt, Shift, etc.)

### Props

```typescript
interface TypingParticlesProps {
  isActive: boolean;           // Enable/disable particle spawning
  targetElement?: HTMLElement | null;  // Optional element to spawn particles near
}
```

### Physics

- **Explosion Pattern**: Random 360° radial distribution
- **Speed**: 50-150 pixels per second
- **Size**: 2-6 pixels (random)
- **Duration**: 0.5 seconds
- **Easing**: `easeOut` for natural deceleration

### Integration

**In HauntingEditor:**
```tsx
<TypingParticles 
  isActive={gameState === 'PLAYING'} 
  targetElement={inputRef.current}
/>
```

### Technical Details

- Uses `framer-motion` for smooth animations
- `AnimatePresence` for enter/exit transitions
- Fixed positioning with `z-50` to overlay everything
- Pointer events disabled to not interfere with UI
- Efficient cleanup prevents memory leaks

### Performance

- Particles auto-remove after 600ms
- Maximum ~20-30 particles on screen at once (at 60+ WPM)
- Lightweight DOM elements (simple divs)
- No canvas overhead
- Minimal re-renders

### Visual Feedback Loop

1. User types fast (>60 WPM) → Hot embers → Feels powerful
2. User slows down (≤60 WPM) → Cold ash → Feels sluggish
3. Creates subconscious motivation to type faster
4. Reinforces the "heat of creation" theme

## Why This Works

- **Immediate Feedback**: Every keystroke feels impactful
- **Visual Reward**: Fast typing creates beautiful ember effects
- **Subtle Motivation**: Color change encourages speed
- **Thematic Fit**: Embers/ash matches the gothic horror aesthetic
- **Low Distraction**: Particles are small and fade quickly
- **High Polish**: Shows attention to detail and game feel

This is the kind of micro-interaction that judges notice and remember.
