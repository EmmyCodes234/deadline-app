# Noctuary Polish - Diegetic Horror CSS Complete

## Overview
Visual and atmospheric polish that removes the "VS Code" look and enhances the horror aesthetic through handwritten fonts, Monaco overrides, and a dynamic panic vignette.

---

## 1. Handwritten Bleed Margin

### Font Import
Added **Caveat** cursive font from Google Fonts for handwritten appearance.

```css
@import url('...&family=Caveat:wght@400;700&display=swap');
```

### Bleed Margin Styling
```css
#bleed-margin {
  background-color: #1a1a1a;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Caveat', cursive;
  color: #a8a29e; /* Stone-400 */
  padding: 20px;
  overflow-y: auto;
  position: relative;
}
```

**Effect:**
- Darker background (#1a1a1a) creates "old paper" feel
- Subtle border separates from editor
- Caveat font makes text look handwritten/scrawled
- Stone-400 color is aged, not pure white

### Haunt Notes Animation
```css
.bleed-note {
  font-size: 1.5rem;
  line-height: 1.2;
  margin-bottom: 2rem;
  opacity: 0;
  transform: translateX(20px);
  animation: bleed-in 4s forwards ease-out;
  color: #b91c1c; /* Red-700 */
}

@keyframes bleed-in {
  to { 
    opacity: 0.8; 
    transform: translateX(0); 
  }
}
```

**Effect:**
- Notes fade in from right (20px offset)
- 4 second animation creates "bleeding" effect
- Final opacity 0.8 (not fully solid)
- Blood-red color (#b91c1c)
- Larger font size (1.5rem) for emphasis

**Usage:**
Apply `.bleed-note` class to haunt messages for animated appearance.

---

## 2. Monaco Editor Overrides

### Kill VS Code UI Elements

**Hide Line Number Gutter:**
```css
.monaco-editor .margin {
  display: none !important;
}
```

**Remove Scroll Decoration:**
```css
.monaco-editor .scroll-decoration {
  box-shadow: none !important;
}
```

**Hide Overview Ruler:**
```css
.monaco-editor .decorationsOverviewRuler {
  display: none !important;
}
```

**Hide Scrollbars:**
```css
.monaco-editor .scrollbar {
  opacity: 0 !important;
}
```

**Force Pure Void Background:**
```css
.monaco-editor,
.monaco-editor .monaco-editor-background {
  background-color: #0b0b0b !important;
}
```

### Why These Overrides?

**Problem:** Monaco Editor has built-in UI elements that:
- Look like VS Code
- Break immersion
- Add visual clutter
- Reveal it's a code editor

**Solution:** Aggressive CSS overrides with `!important` to:
- Remove all technical indicators
- Create pure writing surface
- Maintain horror aesthetic
- Hide editor nature

### Comment Styling (// COWARD)

**Default Text:**
```css
.monaco-editor .mtk1 {
  color: #a3a3a3;
}
```

**Comments (Trope Executioner Output):**
```css
.monaco-editor .mtk3,
.monaco-editor .comment {
  color: #dc2626 !important;
  font-weight: bold !important;
  text-shadow: 0 0 4px rgba(220, 38, 38, 0.5);
}
```

**Effect:**
- `// COWARD` appears in blood red
- Bold weight makes it stand out
- Subtle glow effect (text-shadow)
- Impossible to miss
- Feels like a brand/scar

---

## 3. The Panic Vignette

### Concept
Screen darkens and turns red when user stops typing, creating pressure to keep writing.

### Implementation

**State Management:**
```typescript
const [isIdle, setIsIdle] = useState(false);
const [lastKeystrokeTime, setLastKeystrokeTime] = useState(Date.now());
const idleCheckTimerRef = useRef<number | undefined>(undefined);
```

**Keystroke Tracking:**
```typescript
const handleEditorChange = (value: string | undefined) => {
  setLastKeystrokeTime(Date.now());
  setIsIdle(false);
  // ... rest of handler
};
```

**Idle Detection:**
```typescript
useEffect(() => {
  idleCheckTimerRef.current = setInterval(() => {
    const timeSinceLastKeystroke = Date.now() - lastKeystrokeTime;
    setIsIdle(timeSinceLastKeystroke > 10000); // 10 seconds
  }, 1000);

  return () => {
    if (idleCheckTimerRef.current) {
      clearInterval(idleCheckTimerRef.current);
    }
  };
}, [lastKeystrokeTime]);
```

**Visual Effect:**
```tsx
<div 
  className="pointer-events-none fixed inset-0 z-40 transition-all duration-[2000ms]"
  style={{
    boxShadow: `inset 0 0 ${isIdle ? '200px' : '50px'} ${isIdle ? '#7f1d1d' : '#000'}`,
    opacity: isIdle ? 0.8 : 0.3,
  }}
/>
```

### Behavior

**Active State (Typing):**
- Box shadow: `inset 0 0 50px #000`
- Opacity: 0.3
- Subtle dark vignette
- Barely noticeable

**Idle State (10+ seconds no typing):**
- Box shadow: `inset 0 0 200px #7f1d1d` (red-900)
- Opacity: 0.8
- Heavy red vignette
- Very noticeable
- Creates urgency

**Transition:**
- Duration: 2000ms (2 seconds)
- Smooth fade between states
- Not jarring
- Builds gradually

### Psychological Effect

**Pressure:**
- Idle state feels oppressive
- Red color creates anxiety
- Darkness closes in
- Forces user to type

**Reward:**
- Typing clears vignette
- Immediate feedback
- Positive reinforcement
- Encourages flow state

**Timing:**
- 10 seconds is forgiving
- Allows thinking/pausing
- Not too aggressive
- But noticeable when idle

---

## Technical Details

### Z-Index Hierarchy

```
50: Export Ritual Modal
40: Panic Vignette
30: Haunt Messages
20: Editor Content
10: Controls (Exit/Seal Fate)
```

**Why This Order?**
- Modal must be above everything
- Vignette affects entire screen
- Haunt messages in margin
- Editor is base layer
- Controls always accessible

### Performance

**CSS Animations:**
- GPU accelerated (transform, opacity)
- No layout thrashing
- Smooth 60fps
- Minimal CPU usage

**Idle Detection:**
- Checks every 1 second (not per-frame)
- Simple timestamp comparison
- No expensive calculations
- Negligible performance impact

**Monaco Overrides:**
- Applied once on mount
- No runtime cost
- Pure CSS
- No JavaScript overhead

### Browser Compatibility

**Caveat Font:**
- Fallback to `cursive` generic
- Widely supported
- Loads with `font-display: swap`
- No FOIT (Flash of Invisible Text)

**Box Shadow Inset:**
- Supported in all modern browsers
- Graceful degradation
- No polyfill needed

**CSS Animations:**
- Standard keyframes
- Vendor prefixes not needed
- Works everywhere

---

## Visual Comparison

### Before Polish

**Editor:**
- Line numbers visible
- Minimap on right
- Scrollbars visible
- Overview ruler
- Looks like VS Code

**Bleed Margin:**
- Sans-serif font
- Clean, modern
- No animation
- Static appearance

**Overall:**
- Technical
- Professional
- Not immersive
- Breaks horror theme

### After Polish

**Editor:**
- Pure void background
- No UI elements
- Invisible scrollbars
- Clean writing surface
- Mysterious

**Bleed Margin:**
- Handwritten font
- Animated notes
- Blood-red text
- Aged appearance
- Haunting

**Overall:**
- Atmospheric
- Immersive
- Horror-themed
- Unique identity

---

## Usage Guidelines

### Applying .bleed-note Class

**In Component:**
```tsx
<div className="bleed-note">
  Why did you kill {victimName}?
</div>
```

**Effect:**
- Automatically animates in
- Handwritten appearance
- Blood-red color
- Proper spacing

### Customizing Idle Threshold

**Current:** 10 seconds
**To Change:** Modify in idle detection effect

```typescript
setIsIdle(timeSinceLastKeystroke > 10000); // Change 10000 to desired ms
```

**Recommendations:**
- 5000ms (5s): Aggressive, constant pressure
- 10000ms (10s): Current, balanced
- 15000ms (15s): Forgiving, subtle
- 30000ms (30s): Very forgiving, barely noticeable

### Adjusting Vignette Intensity

**Current Values:**
- Active: 50px spread, 0.3 opacity
- Idle: 200px spread, 0.8 opacity

**To Increase Intensity:**
```tsx
boxShadow: `inset 0 0 ${isIdle ? '300px' : '50px'} ...`
opacity: isIdle ? 1.0 : 0.3
```

**To Decrease Intensity:**
```tsx
boxShadow: `inset 0 0 ${isIdle ? '150px' : '50px'} ...`
opacity: isIdle ? 0.6 : 0.3
```

---

## Future Enhancements

### Additional Fonts

**Nanum Pen Script:**
- Alternative handwritten font
- More erratic appearance
- Korean-inspired
- Could randomize between fonts

**Permanent Marker:**
- Bolder, more aggressive
- Marker-like appearance
- Higher contrast

### Dynamic Vignette

**Intensity Based on Idle Time:**
```typescript
const idleIntensity = Math.min(timeSinceLastKeystroke / 30000, 1);
const spread = 50 + (idleIntensity * 150);
const opacity = 0.3 + (idleIntensity * 0.5);
```

**Effect:**
- Gradually intensifies
- Not binary on/off
- More organic
- Builds tension slowly

### Pulsing Effect

**Heartbeat Animation:**
```css
@keyframes heartbeat {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.9; }
}
```

**Apply When Idle:**
```tsx
animation: isIdle ? 'heartbeat 2s infinite' : 'none'
```

### Text Corruption

**Glitch Effect on Idle:**
- Random characters flicker
- Text distorts
- Increases with idle time
- Clears on typing

---

## Files Modified

1. **src/index.css** - Added Caveat font, bleed margin styles, Monaco overrides
2. **src/components/NoctuaryEditor.tsx** - Added idle detection and panic vignette

---

## Result

The Noctuary now has a **fully diegetic horror aesthetic** that:
- **Removes all technical indicators** (line numbers, scrollbars, etc.)
- **Uses handwritten fonts** for haunting messages
- **Animates notes** with bleeding effect
- **Highlights punishment** (// COWARD) in blood red
- **Creates pressure** through panic vignette
- **Responds to behavior** (idle = darkness)
- **Maintains immersion** throughout

The editor no longer looks like a code editor—it looks like a **cursed writing tool** that watches, judges, and pressures the user.
