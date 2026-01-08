# The Silent Vigil - Complete Implementation

## Overview
A 60-second psychological horror endurance mode where players must remain perfectly still and silent while being watched through a security camera feed. Features microphone input, binaural audio, and a unique "blink" mechanic.

---

## Core Concept

**Premise:** You're being monitored through CCTV. Something is watching. Survive 60 seconds without moving or making noise.

**Win Condition:** Reach 60 seconds with sanity > 0  
**Lose Conditions:**
- Sanity reaches 0 (from movement/noise)
- Fail to blink (blur reaches 100%)

---

## 1. The Engine (`useVigilEngine.ts`)

### State Management
```typescript
- gameStatus: 'idle' | 'active' | 'won' | 'lost'
- time: 0-60 seconds
- sanity: 0-100
- mouseVelocity: pixels per frame
- audioLevel: 0-1 (microphone volume)
- blinkBlur: 0-1 (vision degradation)
- isBlinking: boolean
- micPermission: 'pending' | 'granted' | 'denied'
```

### Input Systems

**1. Microphone Monitoring**
- Requests getUserMedia() permission
- Creates AudioContext with AnalyserNode
- Samples frequency data at 100ms intervals
- Normalizes volume to 0-1 range
- Threshold: 0.1 (10% volume triggers sanity loss)

**2. Mouse Velocity Tracking**
- Calculates distance moved per frame
- Threshold: 5 pixels/frame
- Triggers sanity decay when exceeded

**3. Blink Mechanic**
- Hold mouse button to blink
- Screen goes black
- Audio amplifies during blink
- Resets blur accumulation

### Timeline System

**Scripted Horror Events:**
```typescript
const TIMELINE: TimelineEvent[] = [
  { at: 5, action: 'footsteps' },
  { at: 12, action: 'breathing' },
  { at: 18, action: 'knock' },
  { at: 25, action: 'whisper' },
  { at: 32, action: 'footsteps' },
  { at: 38, action: 'screech' },
  { at: 45, action: 'breathing' },
  { at: 50, action: 'knock' },
  { at: 55, action: 'whisper' },
];
```

**Event Execution:**
- Checks every frame if `time >= event.at`
- Marks event as executed to prevent repeats
- Triggers corresponding audio function

### Game Mechanics

**Sanity Decay:**
- Rate: 0.5 per second when moving OR loud
- Triggers screech at 30% threshold
- Game over at 0%

**Blink Blur:**
- Accumulates over 10 seconds
- Rate: 0.01 per 100ms (10% per second)
- Resets to 0 when blinking
- Game over at 100% (forced blindness)

**Code Location:** `src/hooks/useVigilEngine.ts`

---

## 2. The Audio System (`VigilAudio.ts`)

### Ambience
**Room Tone Hum:**
- 60Hz sine wave (low frequency)
- Lowpass filter at 200Hz
- Base gain: 0.1
- Amplified to 0.3 during blink

### Binaural Horror Events

**1. Footsteps**
- 6 steps over 3 seconds
- Square wave 80-120Hz
- Volume increases (0.1 → 0.3)
- Panned center (approaching)

**2. Breathing**
- 3 breaths over 4 seconds
- Bandpass filtered noise (500Hz)
- Panned left (-0.7)
- Envelope: fade in/out

**3. Knock**
- 3 knocks, 400ms apart
- Square wave 150Hz
- Panned right (0.7)
- Sharp attack/decay

**4. Screech**
- Sawtooth wave 800Hz → 2000Hz
- Volume scales with intensity
- Used for sanity warnings

**5. Whisper**
- Highpass filtered noise (2000Hz+)
- Subtle, eerie
- 2 second duration

**Code Location:** `src/lib/audio/VigilAudio.ts`

---

## 3. The Visuals (`TheSilentVigil.tsx`)

### CCTV Aesthetic

**Base Layer:**
- Placeholder gradient (zinc-800 to zinc-900)
- Ready for actual hallway/bedroom image
- CSS filters: `contrast(1.2) brightness(0.8) sepia(0.3)`

**Scanlines:**
- Repeating linear gradient
- 2px transparent, 2px black
- 50% opacity
- Creates CRT monitor effect

**Noise:**
- SVG feTurbulence filter
- Animated position shift
- 10% opacity
- Simulates analog video noise

**Blur Effect:**
- Increases from 0 to 20px over 10 seconds
- Applied via CSS filter
- Resets on blink
- Forces player interaction

### Glitch Layer

**Triggered by Sanity Loss:**
- Intensity: `(100 - sanity) / 100`
- Creates 0-5 glitch strips
- Random clip-path polygons
- Invert or hue-rotate filters
- 0.1s animation loop

**Visual Corruption:**
```typescript
{Array.from({ length: Math.floor(glitchIntensity * 5) }).map((_, i) => (
  <div
    style={{
      clipPath: `polygon(random positions)`,
      filter: random ? 'invert(1)' : 'hue-rotate(180deg)',
      opacity: glitchIntensity * 0.3,
    }}
  />
))}
```

### HUD Overlay

**REC Indicator:**
- Red pulsing dot (1s cycle)
- "REC" text in red
- Top-left corner
- Box shadow glow

**Timecode:**
- MM:SS format
- Monospace font
- Top-right corner
- Counts up to 60:00

**Sanity Bar:**
- Bottom of screen
- Color-coded:
  - Green: 50-100%
  - Yellow: 25-50%
  - Red: 0-25%
- Glows red when low

**Activity Warnings:**
- "MOVEMENT DETECTED" (red)
- "AUDIO DETECTED" (red)
- Appear when thresholds exceeded
- Bottom-left corner

**Blink Warning:**
- Appears at 50% blur
- "HOLD TO BLINK" message
- Center screen
- Pulsing red text

### Blink Overlay

**When Blinking:**
- Full screen black
- "Blinking..." text (white/30%)
- Z-index 50 (above everything)
- Audio amplifies

**Code Location:** `src/components/TheSilentVigil.tsx`

---

## 4. Game Flow

### Start Screen
1. Title: "The Silent Vigil"
2. Subtitle: "A Psychological Horror Endurance Test"
3. Objective explanation
4. Requirements warning (mic, headphones, quiet room)
5. "Grant Microphone Access" button
6. "Begin Vigil" button (after permission)

### Active Game
1. CCTV feed with filters
2. Scanlines and noise
3. REC indicator pulsing
4. Timecode counting up
5. Sanity bar updating
6. Blur accumulating
7. Timeline events triggering
8. Glitches appearing (low sanity)
9. Activity warnings (movement/noise)
10. Blink warning (high blur)

### End Screens

**Victory (60 seconds):**
- "Survived" title (green)
- Final time: 60:00
- Final sanity percentage
- "Try Again" / "Exit" buttons

**Game Over (sanity 0 or blur 100%):**
- "Detected" title (red)
- Reason: "Your sanity shattered" or "You failed to blink"
- Time survived
- "Try Again" / "Exit" buttons

---

## 5. Technical Implementation

### Microphone Setup
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

const source = audioContext.createMediaStreamSource(stream);
source.connect(analyser);
```

### Audio Level Detection
```typescript
const dataArray = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(dataArray);

const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
const normalized = average / 255; // 0-1
```

### Mouse Velocity Calculation
```typescript
const dx = e.clientX - prevMousePosRef.current.x;
const dy = e.clientY - prevMousePosRef.current.y;
const velocity = Math.sqrt(dx * dx + dy * dy);
```

### Blur Accumulation
```typescript
setBlinkBlur(prev => {
  const newBlur = Math.min(1, prev + (1 / (BLINK_BLUR_TIME * 10)));
  if (newBlur >= 1) {
    setGameStatus('lost'); // Forced game over
  }
  return newBlur;
});
```

---

## 6. Performance Considerations

### Optimizations
- Microphone sampling: 100ms intervals (not per-frame)
- Timeline events: Check once per frame, mark as executed
- Glitch layers: Only render when sanity < 100
- Audio: Web Audio API (hardware accelerated)
- Lazy loading: Component loaded on-demand

### Resource Cleanup
```typescript
useEffect(() => {
  return () => {
    vigilAudio.stopAmbience();
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };
}, []);
```

---

## 7. Player Experience

### Psychological Elements

**1. Helplessness**
- Can't move
- Can't make noise
- Must endure

**2. Anticipation**
- Scripted events create dread
- Never know when next sound will come
- Binaural audio makes it feel real

**3. Forced Interaction**
- Blink mechanic prevents passive play
- Must actively manage blur
- Creates tension between stillness and action

**4. Sensory Deprivation**
- Blinking blacks out vision
- Amplifies audio during blink
- Disorienting

**5. Paranoia**
- CCTV aesthetic suggests being watched
- Glitches imply something wrong
- Activity warnings feel accusatory

### Difficulty Curve

**0-20 seconds:** Learning phase
- Few events
- Sanity stable
- Blur manageable

**20-40 seconds:** Tension builds
- More frequent events
- Sanity pressure increases
- Blur forces first blink

**40-60 seconds:** Maximum stress
- Rapid event succession
- Sanity critical
- Multiple blinks required
- Glitches intense

---

## 8. Future Enhancements

### Assets Needed
1. **Hallway Image:** Dark corridor, security camera POV
2. **Bedroom Image:** Dimly lit room, eerie atmosphere
3. **Audio Files:** Professional horror sound effects (optional upgrade from procedural)

### Potential Features
- Multiple camera angles (switch randomly)
- Shadow figures appearing in frame
- Text messages on screen ("STAY STILL")
- Difficulty modes (30s/60s/90s)
- Leaderboard (longest survival time)
- Unlockable camera locations

---

## Files Created

1. **src/hooks/useVigilEngine.ts** - Core game logic
2. **src/lib/audio/VigilAudio.ts** - Binaural audio system
3. **src/components/TheSilentVigil.tsx** - Main component
4. **src/App.tsx** - Route added

---

## Route

**Path:** `/silent-vigil`  
**Protection:** Requires onboarding completion  
**Lazy Loaded:** Yes

---

## Result

A unique psychological horror experience that:
- Uses real microphone input for immersion
- Creates tension through forced stillness
- Implements binaural audio for spatial horror
- Features innovative blink mechanic
- Provides CCTV aesthetic for voyeuristic dread
- Offers 60-second high-intensity gameplay

The Silent Vigil is a completely different experience from The Dark Room, focusing on endurance and sensory control rather than typing and searching.
