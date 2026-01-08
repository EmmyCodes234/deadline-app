# Dark Room - Advanced Horror Mechanics Complete

## Overview
Implemented advanced game mechanics to prevent exploits, add tension, and enhance the horror atmosphere.

---

## 1. Movement Penalty (Anti-Sweep)

### Problem
Players could "sweep" the mouse rapidly across the screen to find all words without strategy.

### Solution
**Mouse Velocity Tracking**
- Calculates distance moved per frame
- Threshold: 15 pixels/frame

**Penalties When Moving Fast:**
- Flashlight radius reduced from 150px → 75px (50% reduction)
- Flashlight opacity flickers (0.3-0.7) simulating loose battery connection
- Makes rapid sweeping ineffective

**Code Location:** `useDarkRoomEngine.ts` - velocity calculation effect

---

## 2. Stabilization System (Aiming Mechanic)

### Problem
Players could instantly type words as soon as they appeared.

### Solution
**Three-State Word System:**

1. **Hidden** (Default)
   - Not in flashlight range
   - Invisible

2. **Unstable** (First Contact)
   - Word appears when flashlight touches it
   - Text jitters/vibrates (±4px random offset)
   - Dim red color (#dc2626)
   - Cannot be typed yet
   - Duration: 0-300ms

3. **Locked** (Ready to Type)
   - After 300ms of continuous hover
   - Text stops jittering
   - Bright white/red glow (#fef2f2)
   - Scale increases to 1.1x
   - Now typeable

**Visual Feedback:**
- Progress bar in sidebar shows stabilization progress
- "⚠️ Stabilizing..." → "🔒 LOCKED - Type Now!"

**Code Location:** `useDarkRoomEngine.ts` - stabilization logic in word visibility effect

---

## 3. Enhanced Hitbox

### Change
Increased hover radius from 50px → 80px

### Reason
- More forgiving collision detection
- Flashlight edge touching word is enough to reveal it
- Reduces frustration while maintaining challenge

---

## 4. Burn Effect (Completion Visual)

### Old Behavior
Found words turned gold and faded out.

### New Behavior
**Charcoal Brand Effect:**
- Color: `#18181b` (zinc-900) - looks like burned/branded wood
- Shadow: Subtle amber glow `rgba(245, 158, 11, 0.5)`
- Font weight: 900 (extra bold)
- Opacity: 0.3 (ghostly remnant)
- Narrative: Words are "burned" into the darkness

**Code Location:** `TheDarkRoom.tsx` - word rendering logic

---

## 5. HUD Corruption (Battery Failure)

### Mechanic
As battery drops below 30%, the UI itself begins to fail.

**Visual Effects:**
- Blur increases: `blur(0px)` → `blur(1px)` as battery → 0%
- Opacity decreases: `1.0` → `0.5`
- Sidebar text becomes harder to read
- Creates panic as player loses ability to track progress

**Formula:**
```typescript
const hudBlur = battery < 30 ? `blur(${(30 - battery) / 30}px)` : 'none';
const hudOpacity = battery < 30 ? 0.5 + (battery / 60) : 1;
```

**Code Location:** `TheDarkRoom.tsx` - sidebar styling

---

## 6. Audio Degradation (Battery-Linked)

### Mechanic
Background ambience filter frequency changes with battery level.

**Audio Progression:**
- **100% Battery:** 200Hz lowpass (muffled, safe)
- **50% Battery:** 1100Hz (tense, rising)
- **20% Battery:** 1640Hz (harsh, screeching)
- **0% Battery:** 2000Hz (panic)

**Formula:**
```typescript
frequency = 200 + (100 - batteryLevel) * 18
```

**Effect:**
- Creates subconscious tension as battery drains
- Audio becomes increasingly uncomfortable
- Player feels urgency without explicit warning

**Code Location:** 
- `DarkRoomAudio.ts` - `updateAmbienceForBattery()` method
- `useDarkRoomEngine.ts` - battery effect hook

---

## Technical Implementation

### New Word Interface
```typescript
interface Word {
  // ... existing fields
  isUnstable: boolean;      // Jittering state
  isLocked: boolean;        // Ready to type
  hoverDuration: number;    // Time hovered (ms)
  jitterX: number;          // Random X offset
  jitterY: number;          // Random Y offset
}
```

### New Hook State
```typescript
const [mouseVelocity, setMouseVelocity] = useState(0);
const [flashlightRadius, setFlashlightRadius] = useState(150);
const [flashlightOpacity, setFlashlightOpacity] = useState(1);
```

### Performance
- Stabilization updates at ~60fps (16ms intervals)
- Jitter calculated per frame for smooth animation
- Audio filter updates only when battery changes

---

## Game Balance

### Difficulty Curve
1. **Early Game (100-70% battery)**
   - Full flashlight radius
   - Clear UI
   - Calm audio
   - Player learns mechanics

2. **Mid Game (70-30% battery)**
   - Stabilization becomes critical
   - Movement penalty matters
   - Audio tension rises

3. **Late Game (<30% battery)**
   - UI corruption adds chaos
   - Audio is harsh
   - Every movement counts
   - Maximum tension

### Skill Expression
- **Slow, Deliberate Movement:** Rewarded with full flashlight
- **Quick Reactions:** Penalized with reduced visibility
- **Patience:** Required for word stabilization
- **Precision:** Enhanced hitbox helps but still requires aim

---

## Files Modified

1. **src/hooks/useDarkRoomEngine.ts**
   - Added velocity tracking
   - Implemented stabilization system
   - Added battery-audio link

2. **src/components/TheDarkRoom.tsx**
   - Updated word rendering with jitter/burn effects
   - Added HUD corruption styling
   - Added stabilization progress indicator
   - Updated flashlight with dynamic radius/opacity

3. **src/lib/audio/DarkRoomAudio.ts**
   - Added filter reference storage
   - Implemented `updateAmbienceForBattery()` method
   - Linked ambience to battery level

---

## Player Experience

### Before
- Sweep mouse rapidly to find all words
- Type immediately when found
- No tension buildup
- UI always clear

### After
- Must move slowly and deliberately
- Must hold aim to lock words
- Increasing panic as battery drains
- UI degrades adding to chaos
- Audio creates subconscious dread

### Result
A tense, skill-based horror experience that rewards patience and precision while punishing reckless play.
