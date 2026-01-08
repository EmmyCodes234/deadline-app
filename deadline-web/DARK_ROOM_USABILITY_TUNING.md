# Dark Room - Usability Tuning Complete

## Overview
Implemented major usability improvements to address player frustration while maintaining horror atmosphere and challenge.

---

## 1. Phosphor Decay (Visual Trail Effect)

### Problem
Words vanished instantly when flashlight moved away, making them hard to track and causing players to lose their place.

### Solution
**Lingering Visibility System:**
- Words don't snap to `opacity: 0` when flashlight leaves
- Phosphor decay value (0-1) tracks lingering brightness
- Decays over ~700ms creating a "ghost trail" effect
- CSS transition: `opacity 700ms ease-out`

**Implementation:**
```typescript
phosphorDecay: number; // 0-1, decays at 0.015 per frame
```

**Visual Effect:**
- Words glow brightly in flashlight
- Fade gradually as light passes
- Leave visible trail showing where you've been
- Easier to track and relocate words

**Code Location:** `useDarkRoomEngine.ts` - phosphor decay logic in visibility effect

---

## 2. Increased Flashlight Radius & Softer Gradient

### Changes
- **Radius:** 150px → **250px** (67% increase)
- **Moving Radius:** 75px → **125px** (67% increase)
- **Gradient:** `transparent 0%` → `transparent 20%` (softer edge)

### Benefits
- Larger visible area reduces frustration
- Softer gradient feels more natural
- Movement penalty still effective but less punishing
- Easier to find words initially

**Code Location:** `useDarkRoomEngine.ts` - FLASHLIGHT_RADIUS constants

---

## 3. Magnetic Locking (Enhanced Hitbox)

### Problem
Players struggled to hover precisely over small text, especially with jittering.

### Solution
**Magnetic Attraction System:**

1. **Increased Hitbox**
   - Hover radius: 80px → **120px** (50% increase)
   - Invisible padding (`p-12`) around each word
   - Easier to "catch" words with cursor

2. **Closest Word Detection**
   - Tracks nearest word within hover radius
   - Automatically selects closest target
   - No need for pixel-perfect aim

3. **Visual Connection**
   - Dashed line connects cursor to locked word
   - Shows magnetic "pull" between cursor and target
   - Color: `rgba(239, 68, 68, 0.3)` with blur
   - Only visible when magnetically locked

**Implementation:**
```typescript
const [magneticTarget, setMagneticTarget] = useState<string | null>(null);

// Find closest word
if (!word.isFound && distance < HOVER_RADIUS && distance < closestDistance) {
  closestWordId = word.id;
  closestDistance = distance;
}
```

**Visual Feedback:**
```tsx
{isMagnetic && !word.isFound && (
  <svg>
    <line
      x1={mousePos.x}
      y1={mousePos.y}
      x2={wordX}
      y2={wordY}
      stroke="rgba(239, 68, 68, 0.3)"
      strokeDasharray="5,5"
    />
  </svg>
)}
```

**Code Location:** 
- `useDarkRoomEngine.ts` - magnetic target tracking
- `TheDarkRoom.tsx` - connection line rendering

---

## 4. Sonar Ping (Active Search Tool)

### Feature
Click anywhere in the dark to send out a sonar pulse that reveals nearby words.

### Mechanics
- **Activation:** Left click anywhere
- **Cost:** 5% battery per ping
- **Duration:** 200ms reveal time
- **Radius:** Expands from 0 → 500px
- **Ring Thickness:** 50px detection zone

### Visual Effect
- White expanding ring with glow
- Opacity fades as ring expands
- Words touched by ring briefly illuminate
- Creates "echolocation" feel

### Strategic Use
- Check suspicious areas without sweeping
- Confirm if area is empty
- Find last remaining words
- Risk/reward: battery cost vs. information

**Implementation:**
```typescript
interface SonarRipple {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

// On click
const ripple: SonarRipple = {
  id: sonarIdRef.current++,
  x: e.clientX,
  y: e.clientY,
  startTime: Date.now(),
};
```

**Detection Logic:**
```typescript
const rippleAge = now - ripple.startTime;
const rippleRadius = (rippleAge / SONAR_DURATION) * 500;
const rippleDistance = Math.sqrt(dx * dx + dy * dy);

if (Math.abs(rippleDistance - rippleRadius) < 50) {
  inSonarRange = true;
}
```

**Code Location:**
- `useDarkRoomEngine.ts` - sonar click handler, ripple management
- `TheDarkRoom.tsx` - ripple rendering

---

## 5. Enhanced CSS Transitions

### Word Transitions
```css
transition: opacity 700ms ease-out, 
            filter 500ms ease-out, 
            color 200ms, 
            transform 200ms
```

### Benefits
- Smooth state changes
- Phosphor decay feels natural
- Color shifts are gradual
- Scale changes are fluid
- Jitter doesn't trigger transitions (instant)

**Code Location:** `TheDarkRoom.tsx` - word rendering style

---

## Technical Implementation

### New Word Properties
```typescript
interface Word {
  // ... existing
  phosphorDecay: number;      // 0-1, lingering visibility
  sonarRevealed: boolean;     // Currently in sonar range
}
```

### New Hook State
```typescript
const [sonarRipples, setSonarRipples] = useState<SonarRipple[]>([]);
const [magneticTarget, setMagneticTarget] = useState<string | null>(null);
```

### Performance
- Sonar ripples auto-cleanup after 200ms
- Phosphor decay calculated per frame
- Magnetic target updates only when words change
- No performance impact from larger radius

---

## Game Balance Changes

### Before Tuning
- Flashlight: 150px radius
- Hover: 80px radius
- Words vanish instantly
- No active search tool
- Precise aim required

### After Tuning
- Flashlight: 250px radius (+67%)
- Hover: 120px radius (+50%)
- Words linger 700ms
- Sonar ping available (-5% battery)
- Magnetic locking assists aim

### Difficulty Curve
Still challenging but less frustrating:
- **Early Game:** Easier to find initial words
- **Mid Game:** Sonar helps locate remaining targets
- **Late Game:** Battery cost makes sonar risky
- **Movement Penalty:** Still punishes rapid sweeping
- **Stabilization:** Still requires patience

---

## Player Experience

### Before
❌ Words vanish too quickly  
❌ Hard to track where you've been  
❌ Hitboxes feel too small  
❌ Jittering makes aiming frustrating  
❌ No way to check areas efficiently  

### After
✅ Words leave visible trails  
✅ Can see where flashlight has been  
✅ Magnetic locking helps aim  
✅ Visual connection shows lock  
✅ Sonar provides strategic option  
✅ Larger flashlight reduces frustration  
✅ Softer gradient feels more natural  

---

## Files Modified

1. **src/hooks/useDarkRoomEngine.ts**
   - Increased flashlight radius (150 → 250)
   - Increased hover radius (80 → 120)
   - Added phosphor decay system
   - Added sonar ping mechanics
   - Added magnetic target tracking
   - Added sonar ripple management

2. **src/components/TheDarkRoom.tsx**
   - Updated flashlight gradient (0% → 20%)
   - Added sonar ripple rendering
   - Added magnetic connection lines
   - Added phosphor decay opacity
   - Enhanced CSS transitions
   - Updated instructions with sonar

---

## Result

A significantly more playable horror experience that maintains tension while reducing frustration. Players can now:
- Track words more easily with trails
- Aim more forgivingly with magnetic locking
- Search strategically with sonar pings
- See larger areas with increased radius

The game remains challenging through:
- Movement penalties
- Stabilization requirements
- Battery management
- Sonar cost/benefit decisions
- HUD corruption at low battery
