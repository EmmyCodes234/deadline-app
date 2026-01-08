# Export Ritual - Complete Implementation

## Overview
A voice-activated export mechanism that requires the user to speak continuously while their last 300 characters glow red. Silence for more than 1.2 seconds causes failure. Completion triggers a file download.

---

## Concept

**The Test:** Instead of a simple "Export" button, users must perform a ritual:
1. Click "SEAL FATE" button
2. See the last 300 characters of their document
3. Click "Recite" to begin
4. Speak continuously into their microphone
5. Watch progress bar fill as they speak
6. If silent too long (>1.2s), ritual fails
7. At 100%, file downloads automatically

**Psychological Impact:**
- Forces user to vocalize their writing
- Creates tension through failure condition
- Makes export feel consequential
- Adds ritual/ceremony to the act of saving

---

## Technical Implementation

### 1. Microphone Monitoring

**Setup:**
```typescript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

const source = audioContext.createMediaStreamSource(stream);
source.connect(analyser);
```

**Volume Detection:**
```typescript
const dataArray = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(dataArray);

const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
const normalized = average / 255; // 0-1 range
```

**Sampling Rate:** 50ms intervals (20 times per second)

### 2. Volume Thresholds

**Speaking Threshold:** `> 0.1` (10%)
- Clears silence timer
- Allows progress to continue
- Indicates active vocalization

**Silence Threshold:** `< 0.05` (5%)
- Starts 1.2 second countdown
- If countdown completes, ritual fails
- Hysteresis prevents flickering

**Why Two Thresholds?**
- Prevents rapid state changes
- 0.05-0.1 is "uncertain" zone
- More forgiving to natural speech patterns

### 3. Silence Detection Logic

```typescript
if (normalized > 0.1) {
  // Speaking - clear silence timer
  if (silenceTimerRef.current) {
    clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = undefined;
  }
} else if (normalized < 0.05) {
  // Silent - start timer if not already started
  if (!silenceTimerRef.current) {
    silenceTimerRef.current = setTimeout(() => {
      setRitualState('failed');
      setProgress(0);
      playErrorSound();
    }, 1200); // 1.2 seconds
  }
}
```

**Key Points:**
- Timer only starts once
- Timer cleared immediately when speaking resumes
- 1.2 second grace period
- Failure resets progress to 0

### 4. Progress System

**Increment Rate:** 1% per 100ms
**Total Duration:** 10 seconds (100 * 100ms)
**Completion:** Progress reaches 100%

```typescript
progressIntervalRef.current = setInterval(() => {
  setProgress(prev => {
    const newProgress = prev + 1;
    
    if (newProgress >= 100) {
      setRitualState('success');
      downloadFile();
      return 100;
    }
    
    return newProgress;
  });
}, 100);
```

**Why 10 Seconds?**
- Long enough to feel like a ritual
- Short enough to not be tedious
- Requires sustained effort
- Creates tension

### 5. Visual Feedback

**Text Glow Effect:**
```typescript
style={{
  color: `rgb(${239 - (progress * 1.5)}, ${68 + (progress * 1.8)}, 68)`,
  textShadow: progress > 50 ? `0 0 ${progress / 10}px rgba(239, 68, 68, 0.8)` : 'none',
}}
```

**Color Transition:**
- Start: `rgb(239, 68, 68)` - Red-500
- End: `rgb(89, 248, 68)` - Greenish (as red decreases, green increases)
- Glow appears at 50% progress
- Glow intensity increases with progress

**Progress Bar:**
- Gradient: Red-900 to Red-500
- Glow effect at 50%+
- Smooth 100ms transitions
- Visual percentage display

**Audio Level Indicator:**
- Green: Speaking (>10%)
- Yellow: Uncertain (5-10%)
- Red: Silent (<5%)
- Real-time width animation

### 6. Error Sound

**Procedural Audio:**
```typescript
const osc = ctx.createOscillator();
osc.type = 'sawtooth';
osc.frequency.value = 200;

gain.gain.setValueAtTime(0.3, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
```

**Characteristics:**
- Sawtooth wave (harsh)
- 200Hz (low, ominous)
- 0.5 second duration
- Exponential decay
- Plays on failure

### 7. File Download

**Blob Creation:**
```typescript
const blob = new Blob([content], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
```

**Download Trigger:**
```typescript
const a = document.createElement('a');
a.href = url;
a.download = `noctuary-${Date.now()}.txt`;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
```

**Filename Format:** `noctuary-{timestamp}.txt`
- Unique per export
- Timestamp prevents overwrites
- .txt extension for universal compatibility

---

## State Machine

### States

**1. Idle**
- Initial state
- Shows instructions
- "Recite" button available
- No audio monitoring

**2. Active**
- Ritual in progress
- Audio monitoring active
- Progress bar filling
- Silence timer watching
- Can fail or succeed

**3. Failed**
- Ritual failed (silence too long)
- Progress reset to 0
- Error sound played
- "Try Again" button shown
- Can return to Idle

**4. Success**
- Ritual completed (100%)
- File downloaded
- Success message shown
- Auto-closes after 2 seconds

### Transitions

```
Idle → Active: Click "Recite"
Active → Failed: Silent > 1.2s
Active → Success: Progress = 100%
Failed → Idle: Click "Try Again"
Success → Closed: Auto after 2s
Any → Closed: Click "Cancel"
```

---

## User Experience

### Flow

1. **User clicks "SEAL FATE"**
   - Modal opens
   - Last 300 characters displayed
   - Instructions shown

2. **User grants microphone permission**
   - Browser permission prompt
   - If denied, shows error message
   - If granted, "Recite" button appears

3. **User clicks "Recite"**
   - Ritual begins
   - Audio monitoring starts
   - Progress bar appears
   - Text begins to glow

4. **User speaks continuously**
   - Progress bar fills
   - Text glows brighter
   - Audio level indicator shows voice
   - Must maintain volume > 10%

5. **Two possible outcomes:**
   - **Success:** Progress reaches 100%, file downloads, modal closes
   - **Failure:** Silence > 1.2s, progress resets, error sound plays

### Psychological Elements

**1. Pressure:**
- Must speak continuously
- No pauses allowed
- Failure is immediate
- Progress can be lost

**2. Ritual:**
- Not just "click to save"
- Requires active participation
- Feels ceremonial
- Makes export meaningful

**3. Vocalization:**
- Forces user to "speak" their words
- Creates connection to content
- Unusual interaction
- Memorable experience

**4. Tension:**
- Silence timer creates urgency
- Progress bar creates anticipation
- Failure condition creates stakes
- Success feels earned

---

## Integration with Noctuary

### SEAL FATE Button

**Location:** Top-right of editor
**Styling:**
- Red-900 background with 50% opacity
- Red-400 text
- Red-800 border
- Hover: Scales to 105%
- Disabled when no content

**Disabled State:**
- Gray background
- Gray text
- No hover effect
- Cursor: not-allowed

**Icon:** Document-add (solar)

### Modal Trigger

```typescript
const [isExportRitualOpen, setIsExportRitualOpen] = useState(false);

<button onClick={() => setIsExportRitualOpen(true)}>
  SEAL FATE
</button>

<ExportRitual
  isOpen={isExportRitualOpen}
  onClose={() => setIsExportRitualOpen(false)}
  content={content}
/>
```

---

## Edge Cases

### No Content
- Button disabled
- Cannot open modal
- Prevents empty exports

### Microphone Denied
- Shows error message
- Cannot start ritual
- Provides instructions to enable

### Browser Compatibility
- Checks for getUserMedia support
- Falls back gracefully
- Shows appropriate errors

### Audio Context Suspended
- Resumes context automatically
- Handles browser autoplay policies
- Ensures audio works

### Rapid State Changes
- Debounced silence detection
- Prevents flickering
- Smooth transitions

### Network Issues
- Download is local (blob)
- No network required
- Always works offline

---

## Performance Considerations

### Audio Monitoring
- 50ms intervals (not per-frame)
- Minimal CPU usage
- Efficient FFT analysis
- Cleanup on unmount

### Progress Updates
- 100ms intervals
- Smooth visual updates
- No jank
- Predictable timing

### Memory Management
- Blob URLs revoked after use
- Audio streams stopped on close
- Timers cleared on unmount
- No memory leaks

---

## Future Enhancements

### Difficulty Modes

**Easy:**
- 2 second silence grace period
- 5 second total duration
- Lower volume threshold (5%)

**Normal:** (Current)
- 1.2 second silence grace period
- 10 second total duration
- 10% volume threshold

**Hard:**
- 0.5 second silence grace period
- 20 second total duration
- 15% volume threshold

### Additional Features

1. **Pitch Detection:**
   - Require specific tone/pitch
   - Musical ritual element
   - More complex challenge

2. **Word Recognition:**
   - Must speak specific words
   - Matches excerpt content
   - True "recitation"

3. **Multiple Attempts:**
   - Track failure count
   - Increase difficulty on retries
   - Punish repeated failures

4. **Visual Corruption:**
   - Text distorts during ritual
   - Glitch effects
   - Horror atmosphere

5. **Alternative Exports:**
   - PDF format
   - Markdown format
   - Encrypted format

---

## Files Created

1. **src/components/ExportRitual.tsx** - Modal component
2. **src/components/NoctuaryEditor.tsx** - Updated with button and integration

---

## Props Interface

```typescript
interface ExportRitualProps {
  isOpen: boolean;        // Modal visibility
  onClose: () => void;    // Close callback
  content: string;        // Full document content
}
```

---

## Result

The Export Ritual transforms a mundane "save file" action into a **tense, interactive ceremony** that:
- **Requires active participation** through continuous speech
- **Creates stakes** through failure conditions
- **Adds meaning** to the export process
- **Forces vocalization** of written words
- **Generates tension** through time pressure
- **Feels consequential** rather than routine

This mechanic makes exporting feel like **sealing a pact** or **completing a ritual**, perfectly fitting the horror theme of the Noctuary.
