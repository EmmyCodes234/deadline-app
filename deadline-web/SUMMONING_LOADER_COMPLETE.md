# SummoningLoader Component - Complete

## Overview
A gothic-themed animated loading indicator featuring a pentagram rune/sigil with path drawing animation, rotation, and purple glow effects.

## Features

### Visual Elements
1. **Pentagram Star** - Five-pointed star drawn with stroke animation
2. **Outer Circle** - Boundary circle that draws itself
3. **Inner Circle** - Smaller circle for mystical effect
4. **Mystical Dots** - Five pulsing dots at star points
5. **Purple Glow** - Drop shadow with purple gradient

### Animations
1. **Path Drawing** (`stroke-dashoffset`)
   - Outer circle draws in 2 seconds
   - Pentagram draws in 3 seconds
   - Inner circle draws in 2 seconds (delayed 0.5s)

2. **Rotation** (`summoning-rotate`)
   - Entire sigil rotates 360° continuously
   - Duration: 8 seconds
   - Smooth linear animation

3. **Pulsing Glow** (`pulse-glow`)
   - Five dots pulse at star points
   - Staggered delays (0s, 0.2s, 0.4s, 0.6s, 0.8s)
   - Scale and opacity changes

4. **Outer Glow Ring**
   - Radial gradient background
   - Pulse animation
   - Blur effect for ethereal look

## Props

```typescript
interface SummoningLoaderProps {
  size?: number;      // Size in pixels (default: 80)
  message?: string;   // Optional loading message
}
```

## Usage

### Basic Usage
```tsx
import { SummoningLoader } from '@/components/SummoningLoader';

<SummoningLoader />
```

### With Custom Size
```tsx
<SummoningLoader size={120} />
```

### With Loading Message
```tsx
<SummoningLoader 
  size={100} 
  message="Summoning the spirits..." 
/>
```

### Centered Full Screen
```tsx
<div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
  <SummoningLoader message="Loading your grimoire..." />
</div>
```

### In a Container
```tsx
<div className="min-h-[400px] flex items-center justify-center">
  <SummoningLoader size={60} />
</div>
```

## Color Scheme

**Purple Gradient:**
- `#a855f7` (Light purple)
- `#8b5cf6` (Medium purple)
- `#6a0dad` (Dark purple)

**Glow Effect:**
- Drop shadow: `rgba(168, 85, 247, 0.8)`
- Radial gradient: `rgba(168, 85, 247, 0.2)`

## Animation Timing

| Element | Duration | Delay | Type |
|---------|----------|-------|------|
| Outer Circle | 2s | 0s | ease-out |
| Pentagram | 3s | 0s | ease-out |
| Inner Circle | 2s | 0.5s | ease-out |
| Rotation | 8s | 0s | linear infinite |
| Dot Pulse | 2s | 0-0.8s | ease-in-out infinite |

## SVG Path Details

### Pentagram Star
```
M 50 10    (Top point)
L 61 43    (Upper right)
L 95 43    (Far right)
L 68 61    (Lower right)
L 79 95    (Bottom right)
L 50 73    (Center bottom)
L 21 95    (Bottom left)
L 32 61    (Lower left)
L 5 43     (Far left)
L 39 43    (Upper left)
Z          (Close path)
```

### Circles
- **Outer**: radius 45, center (50, 50)
- **Inner**: radius 20, center (50, 50)

## Styling

The component uses:
- Inline styles for dynamic sizing
- CSS-in-JS for animations (scoped to component)
- Tailwind classes for layout
- SVG gradients for color effects

## Performance

- **Lightweight**: Pure SVG, no images
- **Smooth**: CSS animations (GPU accelerated)
- **Scalable**: Vector graphics scale perfectly
- **No Dependencies**: Uses native SVG and CSS

## Thematic Fit

Perfect for:
- Page loading states
- Data fetching indicators
- Modal/overlay loading
- Async operation feedback
- Gothic/horror themed apps

## Why This Works

1. **Thematic**: Pentagram fits gothic horror aesthetic
2. **Engaging**: Path drawing is mesmerizing
3. **Professional**: Smooth animations show polish
4. **Unique**: Stands out from generic spinners
5. **Memorable**: Users will remember this loader

Replace boring spinners with mystical summoning circles!
