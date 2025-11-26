# Onboarding System Guide

## Overview

The onboarding system provides a gothic-themed, multi-step introduction to the game mechanics. It only shows once per user and can be skipped for returning users.

## Components

### 1. useOnboardingState Hook

**Location**: `src/hooks/useOnboardingState.ts`

**Purpose**: Manages onboarding state and localStorage persistence

**State**:
- `currentStep`: Current step number (0-4)
- `hasCompletedOnboarding`: Whether user has completed onboarding

**Functions**:
- `nextStep()`: Move to next step
- `prevStep()`: Move to previous step (min 0)
- `completeOnboarding()`: Mark onboarding as complete
- `resetOnboarding()`: Reset for testing

**Storage**: Uses `localStorage.getItem('deadline_onboarding_completed')`

### 2. OnboardingStepper Component

**Location**: `src/components/OnboardingStepper.tsx`

**Purpose**: Full-screen onboarding experience with 5 steps

**Props**:
```typescript
interface OnboardingStepperProps {
  onOnboardingComplete: () => void;
}
```

## Onboarding Steps

### Step 0: The Invitation (Splash Screen)

**Content**:
- Pentagram icon with glow
- Title: "THE DEADLINE"
- Subtitle: "The veil is thin."
- Atmospheric narrative text
- "BEGIN RITUAL" button

**Purpose**: Set the gothic tone and welcome the user

### Step 1: The Oath & The Task

**Content**:
- Scroll icon
- Title: "THE OATH"
- Game rules explanation:
  - Type words as they appear
  - Patience drains with hesitation
  - Errors anger the muse
  - Complete rituals to earn skulls
  - Zero patience = death
- "I UNDERSTAND THE RISKS" button

**Purpose**: Explain core game mechanics

### Step 2: The First Glyph (Interactive Demo)

**Content**:
- Type icon
- Title: "THE FIRST GLYPH"
- Practice sentence: "The whispers begin."
- Live typing feedback:
  - Green text for correct characters
  - Red text for errors
  - Purple ghost text for untyped
- "COMPLETE GLYPH" button (appears when done)

**Purpose**: Let users practice typing mechanics

**Features**:
- Real-time character-by-character validation
- Visual feedback with glowing effects
- No pressure (no patience drain)
- Must complete to proceed

### Step 3: The Favor & The Challenge

**Content**:
- Skull icons (animated)
- Title: "THE FAVOR"
- Skull system explanation:
  - 1 Skull: Survived
  - 2 Skulls: Competent
  - 3 Skulls: Masterful
- Progression system overview
- "ACCEPT THE CHALLENGE" button

**Purpose**: Explain rewards and progression

### Step 4: The Covenant (Optional Auth)

**Content**:
- User icon
- Title: "THE COVENANT"
- Pentagram icon
- Auth prompt with two options:
  1. "FORGE A COVENANT" - Opens AuthModal
  2. "Delve as a Wanderer" - Continue as guest

**Purpose**: Encourage sign-up while allowing guest play

**Behavior**:
- If user signs up: Completes onboarding and closes
- If user continues as guest: Completes onboarding and closes
- Can always sign up later from game menu

## Integration

### Basic Usage

```tsx
import { useState } from 'react';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { OnboardingStepper } from '@/components/OnboardingStepper';

function App() {
  const { hasCompletedOnboarding } = useOnboardingState();
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding);

  if (showOnboarding) {
    return (
      <OnboardingStepper
        onOnboardingComplete={() => setShowOnboarding(false)}
      />
    );
  }

  return <YourMainApp />;
}
```

### With Landing Page

```tsx
function LandingPage() {
  const { hasCompletedOnboarding } = useOnboardingState();
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div>
      {showOnboarding ? (
        <OnboardingStepper
          onOnboardingComplete={() => setShowOnboarding(false)}
        />
      ) : (
        <div>
          <h1>Welcome to Deadline</h1>
          {!hasCompletedOnboarding && (
            <button onClick={() => setShowOnboarding(true)}>
              Start Tutorial
            </button>
          )}
          <button onClick={() => {/* Start game */}}>
            {hasCompletedOnboarding ? 'Continue' : 'Skip Tutorial'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### Testing/Development

```tsx
import { useOnboardingState } from '@/hooks/useOnboardingState';

function DevTools() {
  const { hasCompletedOnboarding, resetOnboarding } = useOnboardingState();

  return (
    <div>
      <p>Onboarding: {hasCompletedOnboarding ? 'Complete' : 'Not Complete'}</p>
      <button onClick={resetOnboarding}>
        Reset Onboarding (for testing)
      </button>
    </div>
  );
}
```

## Visual Design

### Theme
- **Background**: Dark graveyard with vignette
- **Colors**: Purple (primary), Orange (rewards), Green (success)
- **Fonts**: 
  - Creepster (titles)
  - Playfair Display (body text)
  - Merriweather (typing demo)

### Animations
- Fade in / zoom in for step transitions
- Pulsing icons
- Glowing effects on interactive elements
- Smooth button transitions

### Layout
- Full-screen overlay
- Centered content cards
- Responsive padding
- Gothic border effects

## User Flow

```
First-Time User:
┌─────────────────────────────────────────────────────┐
│ Step 0: Invitation                                  │
│   ↓ BEGIN RITUAL                                    │
│ Step 1: The Oath (Rules)                           │
│   ↓ I UNDERSTAND THE RISKS                         │
│ Step 2: First Glyph (Practice)                     │
│   ↓ COMPLETE GLYPH                                 │
│ Step 3: The Favor (Skulls)                        │
│   ↓ ACCEPT THE CHALLENGE                           │
│ Step 4: The Covenant (Auth)                       │
│   ↓ FORGE COVENANT or DELVE AS WANDERER           │
│ → Main Game                                         │
└─────────────────────────────────────────────────────┘

Returning User:
┌─────────────────────────────────────────────────────┐
│ hasCompletedOnboarding = true                       │
│ → Skip directly to Main Game                        │
└─────────────────────────────────────────────────────┘
```

## localStorage Keys

- `deadline_onboarding_completed`: `'true'` or not set
- Cleared by `resetOnboarding()` function

## Features

### ✅ Implemented
- 5-step onboarding flow
- Interactive typing practice
- Auth integration
- localStorage persistence
- Gothic theme matching game
- Smooth animations
- Responsive design
- Skip for returning users

### 🎯 Optional Enhancements
- Add "Skip Tutorial" button
- Add progress indicator (1/5, 2/5, etc.)
- Add "Back" button for previous steps
- Add keyboard shortcuts (Enter to continue)
- Add sound effects for each step
- Add more practice sentences
- Add difficulty selection
- Add language selection

## Testing Checklist

### First-Time Experience
- [ ] Step 0 displays correctly
- [ ] Can proceed through all steps
- [ ] Typing practice works correctly
- [ ] Auth modal opens from Step 4
- [ ] Can sign up during onboarding
- [ ] Can continue as guest
- [ ] Onboarding completes and closes
- [ ] localStorage is set

### Returning User
- [ ] Onboarding doesn't show again
- [ ] Can access main game directly
- [ ] localStorage persists across sessions

### Reset Functionality
- [ ] resetOnboarding() clears localStorage
- [ ] Can go through onboarding again
- [ ] State resets correctly

### Visual/UX
- [ ] All animations work smoothly
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Icons display correctly
- [ ] Responsive on different screen sizes
- [ ] Gothic theme is consistent

## Customization

### Change Step Content

Edit the step content in `OnboardingStepper.tsx`:

```tsx
{currentStep === 0 && (
  <div>
    {/* Your custom content */}
  </div>
)}
```

### Add More Steps

1. Add new step in the component
2. Update step numbers
3. Add navigation logic

### Change Practice Text

```tsx
const practiceText = 'Your custom practice sentence.';
```

### Modify Colors

Update Tailwind classes:
- Purple theme: `purple-600`, `purple-400`, etc.
- Orange theme: `orange-600`, `orange-400`, etc.
- Custom colors: Add to `tailwind.config.js`

## Accessibility

- Keyboard navigation supported
- Focus management on inputs
- High contrast text
- Clear visual feedback
- Readable font sizes

## Performance

- Lazy loading: Only renders current step
- Minimal re-renders
- Efficient localStorage usage
- Optimized animations

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage required
- CSS animations supported
- Flexbox layout
