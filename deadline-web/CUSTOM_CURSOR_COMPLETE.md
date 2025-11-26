# Custom Cursor System - Complete

## Overview
A ghostly custom cursor that replaces the default system cursor with a glowing dot that follows the mouse with spring physics and changes appearance on hover.

## Features

### Default State
- **Small red glowing dot** (8px × 8px)
- Red color: `bg-red-500`
- Subtle blur: `blur-[1px]`
- Red glow shadow: `0 0 10px rgba(239, 68, 68, 0.8)`

### Hover State (Interactive Elements)
- **Larger white glowing dot** (32px × 32px)
- White color: `bg-white/80`
- More blur: `blur-[2px]`
- Scales up: `scale-150`
- White glow shadow: `0 0 20px rgba(255, 255, 255, 0.6)`

### Spring Physics
- Cursor "drags" behind actual mouse position
- Spring constant: `0.15` (lower = more drag)
- Creates ghostly, floaty feel
- Uses `requestAnimationFrame` for smooth 60fps animation

## Implementation

### Component Structure
```tsx
<CustomCursor />
```

### CSS (index.css)
```css
/* Hide default cursor on non-touch devices */
@media (hover: hover) and (pointer: fine) {
  * {
    cursor: none !important;
  }
}
```

### Integration (App.tsx)
```tsx
export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <AppRoutes />
    </BrowserRouter>
  );
}
```

## Interactive Elements Detection

The cursor detects hover on:
- `<a>` tags (links)
- `<button>` tags
- `<input>` tags
- `<textarea>` tags
- `<select>` tags
- Any element with `cursor: pointer`
- Any element inside the above (using `closest()`)

## Touch Device Handling

**Automatic Detection:**
- Checks for `'ontouchstart' in window`
- Checks for `navigator.maxTouchPoints > 0`
- Re-enables default cursor on touch devices
- Uses CSS media query `@media (hover: hover) and (pointer: fine)`

**Result:** Custom cursor only appears on devices with precise pointing (mouse/trackpad), not on touch screens.

## Animation Details

### Position Tracking
```typescript
const handleMouseMove = (e: MouseEvent) => {
  setMousePos({ x: e.clientX, y: e.clientY });
};
```

### Spring Animation
```typescript
const animate = () => {
  setCursorPos((prev) => {
    const dx = mousePos.x - prev.x;
    const dy = mousePos.y - prev.y;
    const spring = 0.15; // Drag factor
    
    return {
      x: prev.x + dx * spring,
      y: prev.y + dy * spring,
    };
  });
  
  requestAnimationFrame(animate);
};
```

### Hover Detection
```typescript
const handleMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (
    target.tagName === 'A' ||
    target.tagName === 'BUTTON' ||
    // ... other checks
  ) {
    setIsHovering(true);
  }
};
```

## Styling

### Default Cursor
```css
width: 8px (w-2)
height: 8px (h-2)
background: #ef4444 (bg-red-500)
blur: 1px
box-shadow: 0 0 10px rgba(239, 68, 68, 0.8)
```

### Hover Cursor
```css
width: 32px (w-8)
height: 32px (h-8)
background: rgba(255, 255, 255, 0.8) (bg-white/80)
blur: 2px
transform: scale(1.5)
box-shadow: 0 0 20px rgba(255, 255, 255, 0.6)
transition: all 200ms
```

## Performance

- **GPU Accelerated**: Uses `transform` for positioning
- **Smooth Animation**: `requestAnimationFrame` for 60fps
- **Efficient**: Only one event listener per event type
- **Cleanup**: Properly cancels animation frames on unmount
- **Conditional**: Only runs on non-touch devices

## Z-Index

- **Layer**: `z-[9999]` (highest layer)
- **Pointer Events**: `pointer-events-none` (doesn't block clicks)
- **Position**: `fixed` (stays on screen during scroll)

## Visibility States

1. **Hidden** - Before first mouse move
2. **Visible** - After mouse enters viewport
3. **Hidden** - When mouse leaves viewport
4. **Transition** - 300ms fade in/out

## Why This Works

1. **Immersive**: Removes OS cursor, fully custom experience
2. **Responsive**: Reacts to interactive elements
3. **Smooth**: Spring physics feel natural and ghostly
4. **Accessible**: Automatically disabled on touch devices
5. **Thematic**: Red glow fits horror aesthetic
6. **Feedback**: White glow on hover provides clear interaction cues

## Customization Options

### Adjust Spring Drag
```typescript
const spring = 0.15; // Lower = more drag (0.05-0.3)
```

### Change Colors
```typescript
// Default
className="bg-red-500"

// Hover
className="bg-white/80"
```

### Adjust Sizes
```typescript
// Default
className="w-2 h-2"

// Hover
className="w-8 h-8"
```

### Modify Blur
```typescript
// Default
className="blur-[1px]"

// Hover
className="blur-[2px]"
```

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Automatically disabled on mobile browsers

## Known Limitations

1. **Text Selection**: Cursor hidden during text selection (by design)
2. **System Dialogs**: Default cursor appears in browser dialogs
3. **Iframe Content**: Custom cursor doesn't work inside iframes
4. **Touch Devices**: Automatically disabled (fallback to default)

This creates a unique, immersive cursor experience that makes the app feel like a complete custom environment!
