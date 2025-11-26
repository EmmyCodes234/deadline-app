# Incinerate Delete Animation - Complete

## Overview
A horror-themed "disintegrate" animation for deleting items in the Crypt Sidebar, complete with fire/ash visual effects and crackling audio.

## Animation Stages

### Stage 1: Normal (0%)
- Item appears in its default state
- Full color and opacity

### Stage 2: Charcoal (50%)
- `filter: grayscale(100%) contrast(200%) brightness(0%)`
- Turns the item to charcoal/ash appearance
- Slight upward movement (`translateY(-5px)`)
- Minor scale reduction (`scale(0.98)`)

### Stage 3: Disintegration (100%)
- Continues charcoal effect
- Fades to transparent (`opacity: 0`)
- Floats upward (`translateY(-20px)`)
- Shrinks slightly (`scale(0.95)`)
- Mask wipes from bottom to top
- `mask-image: linear-gradient(to top, transparent 100%, black 100%)`

## Audio Effect

**Sound: `playIncinerate()`**
- Paper crumple/match extinguish effect
- Generated using noise buffer with bandpass filter
- Frequency sweeps from 2000Hz to 800Hz
- Duration: 0.4 seconds
- Creates crackling/burning sound

### Implementation
```typescript
playIncinerate() {
  // Creates crackling noise buffer
  // Applies bandpass filter (2000Hz → 800Hz)
  // Exponential decay envelope
  // Sounds like paper burning/crumpling
}
```

## Integration

### Sidebar Component
```typescript
// State to track deleting items
const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

// Delete handler with animation
const handleDelete = (itemId: string) => {
  horrorAudio.playIncinerate();
  setDeletingIds(prev => new Set(prev).add(itemId));
  
  setTimeout(() => {
    onDeleteDoc(itemId);
    setDeletingIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  }, 800); // Match animation duration
};
```

### CSS Animation
```css
@keyframes incinerate {
  0% {
    filter: grayscale(0%) contrast(100%) brightness(100%);
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  
  50% {
    filter: grayscale(100%) contrast(200%) brightness(0%);
    opacity: 0.8;
    transform: translateY(-5px) scale(0.98);
  }
  
  100% {
    filter: grayscale(100%) contrast(200%) brightness(0%);
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
    mask-image: linear-gradient(to top, transparent 100%, black 100%);
  }
}

.animate-incinerate {
  animation: incinerate 0.8s ease-out forwards;
}
```

## Visual Effect Breakdown

1. **Grayscale**: Removes all color, making it look like ash
2. **High Contrast**: Makes the charcoal effect more dramatic
3. **Zero Brightness**: Darkens to black (charcoal)
4. **Upward Float**: Simulates ash rising
5. **Mask Wipe**: Creates the "disintegrating" effect
6. **Scale Reduction**: Adds to the "burning away" feel

## Timing

- **Animation Duration**: 800ms
- **Audio Duration**: 400ms
- **Delay Before Delete**: 800ms (matches animation)
- **Easing**: `ease-out` for natural deceleration

## Applied To

- **Mausoleum Items** (folders)
- **Tombstone Items** (documents)
- Both use the same animation and sound

## Why This Works

- **Thematic Fit**: Fire/ash matches gothic horror aesthetic
- **Satisfying Feedback**: Clear visual and audio confirmation
- **Prevents Accidents**: 800ms delay gives user time to see what's happening
- **Memorable**: Unique delete animation stands out from standard fades
- **Polished**: Shows attention to detail and game feel

This is the kind of micro-interaction that makes the app feel alive and crafted with care.
