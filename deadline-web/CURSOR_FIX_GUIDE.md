# 🔍 Cursor Visibility Fix Guide

## The Problem
Your cursor is invisible because a full-screen element is sitting on top of your content with `cursor: none` or blocking pointer events.

## Quick Diagnosis

### Method 1: Use the Diagnostic Tool
1. Open `deadline-web/cursor-diagnostic.html` in your browser
2. Click "Run Diagnostic" to find blocking elements
3. Click "Highlight Overlays" to see them visually
4. Click "Auto-Fix Common Issues" to apply automatic fixes

### Method 2: Use the React Debugger Component
1. Add to your `App.tsx`:
```tsx
import { CursorDebugger } from '@/components/CursorDebugger';

// Inside your App component's return:
{process.env.NODE_ENV === 'development' && <CursorDebugger />}
```

2. Press `Ctrl+Shift+C` to toggle the debugger
3. It will highlight blocking elements in RED
4. Click "Fix Now" to apply fixes instantly

## Common Culprits

### 1. Full-Screen Video Background
**BAD:**
```tsx
<div className="fixed inset-0 z-50">
  <video autoPlay loop muted />
</div>
```

**GOOD:**
```tsx
<div className="fixed inset-0 -z-10 pointer-events-none">
  <video autoPlay loop muted />
</div>
```

### 2. Splash Screens / Overlays
**BAD:**
```tsx
<div className="fixed inset-0 z-[9999] bg-black" />
```

**GOOD:**
```tsx
<div className="fixed inset-0 z-[9999] bg-black pointer-events-none" />
// OR if it needs interaction:
<div className="fixed inset-0 z-[9999] bg-black" style={{ pointerEvents: 'auto' }} />
```

### 3. Custom Cursor Components
**BAD:**
```tsx
<div className="fixed inset-0 z-[9999]">
  <div style={{ left: x, top: y }}>Cursor</div>
</div>
```

**GOOD:**
```tsx
<div className="fixed pointer-events-none z-[9999]" style={{ left: x, top: y }}>
  Cursor
</div>
```

### 4. Atmospheric Effects (Fog, Particles, etc.)
**BAD:**
```tsx
<div className="fixed inset-0 z-10">
  <canvas ref={fogCanvas} />
</div>
```

**GOOD:**
```tsx
<div className="fixed inset-0 -z-10 pointer-events-none">
  <canvas ref={fogCanvas} />
</div>
```

## The Fix Checklist

### ✅ For Background Elements
- [ ] Use negative z-index: `-z-10` or `-z-20`
- [ ] Add `pointer-events-none`
- [ ] Verify cursor is visible

### ✅ For Interactive Overlays
- [ ] Use `pointer-events-auto` explicitly
- [ ] Set `cursor: pointer` or `cursor: default`
- [ ] Ensure z-index is appropriate

### ✅ For Custom Cursors
- [ ] Container must have `pointer-events-none`
- [ ] Position: `fixed` with high z-index
- [ ] Track mouse position accurately

## Manual Browser Inspection

1. Open DevTools (F12)
2. Run this in Console:
```javascript
// Find all fixed elements
document.querySelectorAll('*').forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.position === 'fixed') {
    const rect = el.getBoundingClientRect();
    if (rect.width > window.innerWidth * 0.8) {
      console.log('LARGE FIXED ELEMENT:', el, {
        zIndex: style.zIndex,
        pointerEvents: style.pointerEvents,
        cursor: style.cursor
      });
    }
  }
});
```

3. Look for elements with:
   - `pointerEvents: "auto"` or not set
   - `cursor: "none"`
   - High z-index (>100)

## Applied Fixes in Your Project

### ✅ ColdOpenSplash.tsx
- Added explicit `pointerEvents: 'auto'` to interactive state
- Added `pointer-events-none` to triggered state

### ✅ index.css
- Already has comprehensive cursor fixes with `!important`
- Forces `cursor: default` on all elements
- Forces `cursor: pointer` on interactive elements

## Testing Your Fix

1. **Visual Test**: Move your mouse around - you should see it
2. **Interaction Test**: Click buttons, links, inputs - they should work
3. **Layer Test**: Use the diagnostic tool to verify no blocking elements
4. **Browser Test**: Test in Chrome, Firefox, Safari

## Prevention Tips

### When creating new components:

1. **Background elements**: Always use `-z-10` and `pointer-events-none`
2. **Overlays**: Explicitly set `pointer-events-auto` if interactive
3. **Full-screen elements**: Ask yourself: "Should this block clicks?"
4. **Custom cursors**: Container must be `pointer-events-none`

### Code Review Checklist:
```tsx
// ❌ AVOID
<div className="fixed inset-0 z-50" />

// ✅ PREFER
<div className="fixed inset-0 -z-10 pointer-events-none" />
// OR
<div className="fixed inset-0 z-50 pointer-events-auto cursor-pointer" />
```

## Still Having Issues?

1. Run the diagnostic tool
2. Check browser console for errors
3. Verify no browser extensions are interfering
4. Test in incognito mode
5. Check if it's a specific page or global issue

## Resources

- [MDN: pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)
- [MDN: cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
- [MDN: z-index](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)
