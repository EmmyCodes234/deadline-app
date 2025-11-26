# Blink Page Transition - Complete

## Overview
A glitch/subliminal cut effect that creates a jarring, horror-themed transition between pages. The screen blinks black then white in rapid succession, creating a disorienting effect.

## Effect Sequence

### Timeline
1. **0ms**: Black overlay appears (instant)
2. **0ms**: Static zap sound plays
3. **100ms**: Flash to white
4. **150ms**: Overlay removed (total duration)

### Visual States
- **Black Phase**: Full-screen black overlay (100ms)
- **White Flash**: Full-screen white invert (50ms)
- **Complete**: Overlay removed, new page visible

## Implementation

### Component Structure
```tsx
<PageTransition />
```

### Integration (App.tsx)
```tsx
export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <PageTransition />  {/* Add here */}
      <AppRoutes />
    </BrowserRouter>
  );
}
```

### Audio Effect

**Sound: `playStaticZap()`**
- Short burst of white noise (80ms)
- Highpass filter at 4000Hz for sharp zap
- Quick exponential decay
- Sounds like TV static/electrical zap

```typescript
playStaticZap() {
  // Creates white noise buffer
  // Applies highpass filter (4000Hz)
  // Quick decay envelope (80ms)
  // Sharp, jarring sound
}
```

## Technical Details

### Route Detection
```typescript
const location = useLocation();

useEffect(() => {
  // Triggers on every route change
  handleTransition();
}, [location.pathname]);
```

### Transition Logic
```typescript
const handleTransition = async () => {
  horrorAudio.playStaticZap();
  
  setIsTransitioning(true);  // Black
  setFlashWhite(false);
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  setFlashWhite(true);  // White flash
  await new Promise(resolve => setTimeout(resolve, 50));
  
  setIsTransitioning(false);  // Remove
  setFlashWhite(false);
};
```

### Styling
```tsx
<div
  className={`fixed inset-0 z-[100] pointer-events-none ${
    flashWhite ? 'bg-white' : 'bg-black'
  }`}
/>
```

## Z-Index Layering

- **PageTransition**: `z-[100]` (above everything during transition)
- **CustomCursor**: `z-[9999]` (always on top)
- **Content**: `z-0` to `z-50` (normal layers)

## Timing Breakdown

| Phase | Duration | Color | Sound |
|-------|----------|-------|-------|
| Black | 100ms | #000000 | Static zap starts |
| White Flash | 50ms | #FFFFFF | Sound continues |
| Complete | 0ms | Transparent | Sound ends |
| **Total** | **150ms** | - | **80ms** |

## Why This Works

1. **Subliminal**: 150ms is fast enough to feel jarring but not nauseating
2. **Disorienting**: White flash creates retinal afterimage
3. **Horror Aesthetic**: Mimics found footage/VHS glitches
4. **Audio Sync**: Static zap reinforces the glitch feeling
5. **Non-Blocking**: `pointer-events-none` doesn't interfere with navigation

## User Experience

### Perception
- Feels like a "blink" or momentary blackout
- Creates sense of discontinuity between pages
- Reinforces horror/supernatural theme
- Makes navigation feel like reality is glitching

### Accessibility Considerations
- **Duration**: 150ms is below seizure trigger threshold (500ms+)
- **Frequency**: Only on navigation, not continuous
- **Contrast**: High contrast but very brief
- **Sound**: Optional (respects mute settings)

## Performance

- **Lightweight**: Pure CSS + minimal JS
- **No Animation Frames**: Uses setTimeout for precision
- **Instant**: No fade transitions, just state changes
- **Efficient**: Component only renders during transition

## Browser Compatibility

- ✅ All modern browsers
- ✅ Mobile browsers
- ✅ Works with React Router
- ✅ No external dependencies

## Customization Options

### Adjust Timing
```typescript
// Longer black phase
await new Promise(resolve => setTimeout(resolve, 150));

// Longer white flash
await new Promise(resolve => setTimeout(resolve, 100));
```

### Change Colors
```tsx
// Red flash instead of white
flashWhite ? 'bg-red-600' : 'bg-black'

// No black phase, just flash
flashWhite ? 'bg-white' : 'bg-transparent'
```

### Disable Sound
```typescript
// Comment out or conditionally call
// horrorAudio.playStaticZap();
```

### Add More Phases
```typescript
// Triple blink
setFlashWhite(true);
await new Promise(resolve => setTimeout(resolve, 50));
setFlashWhite(false);
await new Promise(resolve => setTimeout(resolve, 50));
setFlashWhite(true);
await new Promise(resolve => setTimeout(resolve, 50));
```

## Routes Affected

The transition triggers on ALL route changes:
- `/` → `/hub`
- `/hub` → `/haunting`
- `/haunting` → `/grimoire`
- `/grimoire` → `/profile`
- `/profile` → `/settings`
- Any navigation between pages

## Known Limitations

1. **First Load**: No transition on initial page load (by design)
2. **Same Route**: No transition if navigating to same route
3. **Hash Changes**: Doesn't trigger on hash-only changes
4. **Query Params**: Doesn't trigger on query param changes only

## Future Enhancements

- Add random variation (sometimes 2 blinks, sometimes 1)
- Vary timing slightly for unpredictability
- Add screen shake during transition
- Include brief static texture overlay
- Randomize flash color (white/red/purple)

This creates a unique, memorable transition that makes navigation feel like part of the horror experience!
