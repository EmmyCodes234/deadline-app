# 🚀 Cursor Quick Fix - TL;DR

## The Problem
Invisible cursor = Full-screen element blocking it

## The Solution
Add `pointer-events-none` to non-interactive overlays

## Quick Diagnostic

### Option 1: HTML Tool (Fastest)
```bash
# Open in browser
deadline-web/cursor-diagnostic.html
```
Click "Run Diagnostic" → See blocking elements

### Option 2: React Component
```tsx
// Add to App.tsx temporarily
import { CursorDebugger } from '@/components/CursorDebugger';

// In your component:
{process.env.NODE_ENV === 'development' && <CursorDebugger />}
```
Press `Ctrl+Shift+C` → See blocking elements

## Common Fixes

### Background Video/Canvas
```tsx
// ❌ BAD
<div className="fixed inset-0 z-50">
  <video />
</div>

// ✅ GOOD
<div className="fixed inset-0 -z-10 pointer-events-none">
  <video />
</div>
```

### Modal/Overlay
```tsx
// ❌ BAD
<div className="fixed inset-0 z-50 bg-black/80">

// ✅ GOOD
<div className="fixed inset-0 z-50 bg-black/80 pointer-events-auto">
```

### Custom Cursor
```tsx
// ❌ BAD
<div className="fixed z-[9999]" style={{ left: x, top: y }}>

// ✅ GOOD
<div className="fixed pointer-events-none z-[9999]" style={{ left: x, top: y }}>
```

## Manual Browser Check

Open DevTools Console and paste:
```javascript
document.querySelectorAll('*').forEach(el => {
  const style = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  if (style.position === 'fixed' && rect.width > window.innerWidth * 0.8) {
    console.log('⚠️ LARGE FIXED ELEMENT:', el, {
      pointerEvents: style.pointerEvents,
      cursor: style.cursor,
      zIndex: style.zIndex
    });
  }
});
```

Look for elements with `pointerEvents: "auto"` or not set.

## The Rule

**If it's not meant to be clicked, add `pointer-events-none`**

## Files Already Fixed
✅ ColdOpenSplash.tsx
✅ AuthModal.tsx  
✅ InvocationSplash.tsx
✅ index.css (global cursor styles)

## Test Your Fix
1. Move mouse → Should see cursor
2. Hover button → Should change to pointer
3. Click input → Should change to text cursor
4. Everything works → ✅ Fixed!

## Still Broken?
Run the diagnostic tool: `cursor-diagnostic.html`
