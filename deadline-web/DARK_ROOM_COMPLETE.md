# 🔦 The Dark Room - Complete Implementation

## Overview

**The Dark Room** is a high-fidelity horror search & type puzzle game where players use a flashlight cursor to find specific words hidden in darkness while avoiding decoy traps.

## Features Implemented

### 1. Audio Engine (`src/lib/audio/DarkRoomAudio.ts`) ✅

**Web Audio API Implementation**:
- `playGeigerClick(distance)`: High-pitched clicks that increase in frequency/volume as distance to trap decreases (800Hz-2000Hz)
- `playSearing()`: Fire/burning sound using bandpass-filtered noise for successful word finds
- `playShatter()`: Loud glass breaking sound using highpass-filtered noise burst for failures
- `startAmbience()`: Low ominous drone using pink noise with lowpass filter (200Hz)
- `stopAmbience()`: Clean ambient shutdown

### 2. Game Logic Hook (`src/hooks/useDarkRoomEngine.ts`) ✅

**State Management**:
- `words`: Array of target and decoy words with positions and states
- `mousePos`: Real-time cursor tracking
- `typedBuffer`: Current user input
- `battery`: 0-100 (decays 0.1 per 100ms)
- `sanity`: 0-3 (mistakes allowed)

**Game Mechanics**:
- **Word Generation**: Random positioning with overlap prevention (15% minimum spacing)
- **Themes**: DEATH, COSMIC, MADNESS, OCCULT (8 words each)
- **Collision Detection**: 
  - Flashlight radius: 150px (words become visible)
  - Hover radius: 50px (words can be typed)
- **Typing System**: Real-time matching with hovered words
- **Battery System**: Decays over time, +15% per correct word
- **Sanity System**: 3 lives, lose 1 per decoy typed
- **Geiger Counter**: Proximity warnings for nearby decoys

### 3. Visual Component (`src/components/TheDarkRoom.tsx`) ✅

**The Flashlight Effect**:
- CSS radial gradient mask following mouse position
- 150px radius circle of visibility
- Breathing animation (scale 0.95-1.05, 3s cycle)
- Pure CSS, no images

**Word Rendering**:
- Absolute positioning (0-90% viewport)
- **Hidden**: opacity 0
- **Visible**: opacity 1, zinc-500 color, blur(2px) "echo" effect
- **Hovered**: blur(0), red color, red glow
- **Found**: gold color, gold text-shadow glow

**Shattered Glass Overlay**:
- CSS clip-path polygons (no images)
- Appears when sanity < 3
- Each sanity loss adds a new shard
- backdrop-filter: blur(4px) for distortion
- Animated pulse effect

**The Sidebar (Manifest)**:
- Theme display
- Target word slots (revealed when found)
- Battery bar with gradient
- Sanity hearts (3 boxes)
- Typed buffer display
- Instructions

### 4. Game Screens ✅

**Start Screen**:
- Title and description
- "Enter the Darkness" button
- Back to hub link

**Victory Screen**:
- Gold "Escaped" title
- Words found count
- Battery remaining
- Play again / Exit buttons

**Game Over Screen**:
- Red "Lost" title
- Failure reason (battery died / sanity shattered)
- Words found count
- Try again / Exit buttons

## Technical Details

### Audio Implementation
```typescript
// Geiger click - proximity warning
playGeigerClick(distance: number) {
  const intensity = 1 - distance;
  osc.frequency.value = 800 + (intensity * 1200); // Closer = higher pitch
  gain.gain.value = intensity * 0.3; // Closer = louder
}
```

### Flashlight CSS
```css
background: radial-gradient(
  circle 150px at ${mousePos.x}px ${mousePos.y}px, 
  transparent 0%, 
  black 100%
);
```

### Shattered Glass CSS
```css
clip-path: polygon(
  20% 0%, 40% 30%, 60% 20%, 80% 50%, 
  70% 80%, 40% 100%, 10% 70%, 0% 30%
);
backdrop-filter: blur(4px);
```

## Gameplay Flow

1. **Start**: Player enters dark room with flashlight
2. **Search**: Move mouse to reveal words in darkness
3. **Identify**: Geiger counter warns of nearby decoys
4. **Type**: Type target words when hovered to mark as found
5. **Avoid**: Don't type decoy words (lose sanity)
6. **Survive**: Find all targets before battery dies
7. **Win/Lose**: Victory if all found, loss if battery/sanity depleted

## Game Balance

### Difficulty 5 (Default)
- **Targets**: 4-5 words
- **Decoys**: 10 words
- **Battery**: 100% (60 seconds at decay rate)
- **Sanity**: 3 mistakes allowed
- **Battery Gain**: +15% per correct word

### Scaling
- **Targets**: 3 + floor(difficulty/3), max 6
- **Decoys**: difficulty × 2, max 20
- **Spacing**: 15% minimum between words

## Performance

- **Pure CSS**: No images, all effects use gradients/clip-paths
- **Efficient**: Only visible words are rendered with effects
- **Web Audio**: Low-latency procedural sound generation
- **No External Assets**: Everything generated in-browser

## Files Created

```
src/
├── lib/
│   └── audio/
│       └── DarkRoomAudio.ts        # Web Audio engine
├── hooks/
│   └── useDarkRoomEngine.ts        # Game logic
└── components/
    └── TheDarkRoom.tsx             # Visual component
```

## Route Added

- `/dark-room` - Protected route with lazy loading

## Future Enhancements

Potential additions:
- Multiple difficulty levels
- More themes (OCEAN, FOREST, URBAN)
- Power-ups (battery boost, sanity restore)
- Time attack mode
- Leaderboard integration
- Custom word lists
- Multiplayer co-op

---

**Result**: The Dark Room is a complete, atmospheric horror puzzle game with flashlight mechanics, proximity warnings, and pure CSS visual effects. No external assets required!
