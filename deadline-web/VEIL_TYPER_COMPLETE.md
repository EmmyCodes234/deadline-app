# 🎮 The Veil Typer - 3D Typing Horror Game

## Overview

**The Veil Typer** is a high-octane 3D typing survival horror game built with React Three Fiber. Players must type words to banish approaching ghosts before they reach the camera. It's a PS5-quality experience with post-processing effects, dynamic lighting, and intense gameplay.

## Features Implemented

### 1. Game Engine (`useVeilTyperEngine.ts`)
- **60-second survival timer** with countdown
- **Dynamic ghost spawning** that increases in difficulty over time
- **Boss system**: Every 15 kills triggers a boss with full sentences
- **Combo system**: Build streaks for up to 10x multiplier
- **Mana system**: Fill to 100% to unleash "EXORCISE" ultimate
- **Typing mechanics**: Real-time word matching with closest-ghost targeting
- **Wobble physics**: Ghosts drift organically using sine waves
- **Game states**: idle, playing, won, lost

### 2. 3D Scene (`VeilTyperScene.tsx`)
- **Three.js Canvas** with React Three Fiber
- **Atmospheric fog** (#050505) that hides boundaries
- **Reflective black floor** (metalness 0.8, roughness 0.1)
- **Ambient sparkles** floating in the air
- **Wizard wand** fixed to camera with dynamic glow
- **Wand color changes** based on combo streak:
  - Gold (0-10 combo)
  - Blue (10-20 combo)
  - White (20+ combo)

### 3. Ghost Models (`VeilGhost.tsx`)
- **3D sphere geometry** with purple emissive glow
- **Float animation** for organic bobbing
- **Eyes** rendered as black spheres
- **Target word** displayed above ghost using Drei `<Text>`
- **Letter highlighting**: Typed letters turn gold
- **Boss indicator**: Red "☠ BOSS ☠" text for boss ghosts
- **Point lights** for atmospheric glow (purple for normal, red for boss)
- **Scale**: 3x larger for bosses

### 4. Post-Processing Effects
- **Bloom**: Luminance threshold 0.2, intensity 1.5
- **Noise**: Film grain at 15% opacity
- **Vignette**: Darkened edges for tunnel vision effect
- Creates that "PS5 look" with glowing ghosts and atmospheric depth

### 5. HUD Overlay (`VeilTyperHUD.tsx`)
- **Top Left**: Score display with combo multiplier
- **Top Right**: Bleeding hourglass timer (red gradient bar)
- **Bottom Center**:
  - Typed buffer display with blinking cursor
  - Mana bar (purple gradient)
  - "ULTIMATE READY" prompt when mana reaches 100%
- **Radial vignette** overlay for immersion

### 6. Game Screens (`VeilTyper.tsx`)
- **Start Screen**: Instructions and "Start Game" button
- **Victory Screen**: Displayed when surviving 60 seconds
- **Game Over Screen**: Triggered when ghost reaches player
- **Score display** on end screens
- **Play Again** and **Exit** buttons

### 7. Horror Word Dictionary (`horrorWords.ts`)
- **50+ horror-themed words** categorized by length:
  - Short: death, fear, doom, dark, evil
  - Medium: shadow, horror, scream, vampire
  - Long: possession, exorcism, abomination
- **8 boss sentences** for boss encounters
- Random selection functions

## Gameplay Mechanics

### Core Loop
1. Ghosts spawn at z: -25 with random x/y positions
2. They move toward the camera (z: 0) with wobble effect
3. Player types words to target and banish ghosts
4. Successful kills increase score, combo, and mana
5. Typos reset combo streak
6. Game ends if ghost reaches z > -2 (Game Over)
7. Survive 60 seconds to win

### Scoring System
- **Normal ghost**: 100 points × multiplier
- **Boss ghost**: 1000 points × multiplier
- **Multiplier**: Increases every 5 combo (max 10x)
- **Ultimate**: 500 points per ghost cleared

### Mana & Ultimate
- **Gain mana**: +10 per normal ghost, +50 per boss
- **Ultimate ability**: Type "EXORCISE" when mana = 100%
- **Effect**: Clears all ghosts on screen instantly

### Boss Encounters
- Trigger every 15 kills
- Spawning pauses until boss is defeated
- 3x larger size
- Full sentence instead of single word
- Red glow instead of purple
- Worth 1000 points

## Technical Stack

- **React** + **TypeScript**
- **Three.js** via `@react-three/fiber`
- **@react-three/drei** for helpers (Text, Float, Sparkles, Camera)
- **@react-three/postprocessing** for effects (Bloom, Noise, Vignette)
- **Framer Motion** for UI animations
- **React Router** for navigation

## Files Created

```
src/
├── data/
│   └── horrorWords.ts              # Word dictionary
├── hooks/
│   └── useVeilTyperEngine.ts       # Game engine logic
├── components/
│   ├── VeilGhost.tsx               # 3D ghost model
│   ├── VeilTyperScene.tsx          # Three.js scene
│   ├── VeilTyperHUD.tsx            # 2D overlay UI
│   └── VeilTyper.tsx               # Main game component
```

## Integration

### Routes Added
- `/veil-typer` - Main game route (protected)

### Hub Card Updated
- Replaced "The Séance" with "The Veil Typer"
- Purple theme (was amber)
- Ghost icon maintained
- Description: "Survive the 3D typing horror game"

### Removed
- `/seance` route
- `SeanceEditor.tsx` (kept but unused)
- `useSeance.ts` (kept but unused)
- Gemini AI integration for Séance (kept but unused)

## Performance Optimizations

- **Lazy loading**: Game loads only when accessed
- **RequestAnimationFrame**: Smooth 60fps game loop
- **Efficient ghost culling**: Removes ghosts that reach player
- **Debounced spawning**: Prevents spawn spam
- **Max ghost limit**: 8 concurrent ghosts

## Audio Integration

- Click sounds on successful kills
- Hover sounds on typos
- Audio hooks ready for expansion (ambient, death, victory)

## Future Enhancements

Potential additions:
- Power-ups (slow time, shield, rapid fire)
- Multiple difficulty levels
- Leaderboard integration with Supabase
- More ghost types (fast, armored, invisible)
- Environmental hazards
- Multiplayer co-op mode
- Custom word lists
- Achievement system

## How to Play

1. Navigate to Hub
2. Click "The Veil Typer" card
3. Read instructions on start screen
4. Click "Start Game"
5. Type words on ghosts to banish them
6. Build combos for higher scores
7. Type "EXORCISE" when mana is full
8. Survive 60 seconds to win!

---

**The Veil Typer** transforms typing practice into an adrenaline-pumping 3D horror experience. Every keystroke matters. Every second counts. Can you survive the veil?
