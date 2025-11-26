# AuthModal Usage Guide

## Overview

The `AuthModal` component provides a gothic-themed authentication interface for users to sign in or sign up.

## Features

- ✅ Email/password login
- ✅ Email/password signup with confirmation
- ✅ Google OAuth integration
- ✅ Gothic aesthetic matching the app theme
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Toggle between login/signup views

## Basic Usage

```tsx
import { useState } from 'react';
import { AuthModal } from '@/components/AuthModal';

function MyComponent() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthSuccess = () => {
    console.log('User authenticated successfully!');
    // Optionally reload data or show a success message
  };

  return (
    <div>
      <button onClick={() => setShowAuthModal(true)}>
        Sign In
      </button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
```

## Integration with Game Progress

Show the auth modal when guests try to save progress:

```tsx
import { useState } from 'react';
import { useGameProgress } from '@/hooks/useGameProgress';
import { AuthModal } from '@/components/AuthModal';

function GameHeader() {
  const { user, totalSkulls } = useGameProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <p>Total Skulls: {totalSkulls}</p>
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-green-400">✓ Progress Saved</span>
            <span className="text-stone-400">{user.email}</span>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Sign Up to Save Progress
          </button>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          console.log('User signed in!');
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}
```

## Show Modal After Achievements

Prompt users to sign up after they achieve something:

```tsx
function VictoryModal({ skulls, onContinue }) {
  const { user } = useGameProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div>
      <h2>Level Complete!</h2>
      <p>You earned {skulls} skulls!</p>

      {!user && (
        <div className="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded mt-4">
          <p className="text-yellow-300 mb-2">
            ⚠️ You're playing as a guest
          </p>
          <p className="text-stone-400 text-sm mb-3">
            Your progress will be lost when you close the browser
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
          >
            Sign Up to Save Progress
          </button>
        </div>
      )}

      <button onClick={onContinue}>Continue</button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          onContinue();
        }}
      />
    </div>
  );
}
```

## Add to Landing Page

```tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';

function LandingPage() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-['Creepster'] mb-8">
          DEADLINE
        </h1>

        {user ? (
          <div>
            <p className="mb-4">Welcome back, {user.email}</p>
            <button className="px-8 py-4 bg-purple-600 text-white rounded">
              Continue Writing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Sign In / Sign Up
            </button>
            <p className="text-stone-400 text-sm">
              or continue as guest (progress not saved)
            </p>
          </div>
        )}

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls modal visibility |
| `onClose` | `() => void` | Called when user closes the modal |
| `onSuccess` | `() => void` | Called after successful authentication |

## Features

### Form Validation

- Email format validation (HTML5)
- Password length check (minimum 6 characters)
- Password confirmation match check
- Clear error messages

### Loading States

- Buttons disabled during authentication
- Loading spinner shown
- Prevents multiple submissions

### Error Handling

- Displays Supabase error messages
- User-friendly error formatting
- Errors clear when switching views

### Visual Design

- Gothic theme with purple accents
- Glowing borders and effects
- Animated entrance
- Responsive layout
- Matches app aesthetic

## Customization

### Change Colors

```tsx
// In AuthModal.tsx, update the color classes:
// Purple theme (current)
className="border-purple-900/50"
className="text-purple-400"

// Red theme
className="border-red-900/50"
className="text-red-400"

// Green theme
className="border-green-900/50"
className="text-green-400"
```

### Add Additional Fields

For signup, you can add more fields:

```tsx
// Add state
const [displayName, setDisplayName] = useState('');

// Add input
<div>
  <label>Display Name</label>
  <input
    type="text"
    value={displayName}
    onChange={(e) => setDisplayName(e.target.value)}
    // ... other props
  />
</div>

// Update signup call
const { error: authError } = await signUpWithEmail(email, password);
if (!authError && user) {
  // Update user profile with display name
  await supabase.auth.updateUser({
    data: { display_name: displayName }
  });
}
```

## Testing

### Test Login Flow
1. Click "Sign In" button
2. Enter valid credentials
3. Click "SIGN IN"
4. Modal should close
5. User should be authenticated

### Test Signup Flow
1. Click "Don't have an account? Sign up"
2. Enter email and password
3. Enter matching confirm password
4. Click "SIGN UP"
5. Modal should close
6. User should be authenticated

### Test Google OAuth
1. Click "Sign in with Google"
2. Should redirect to Google OAuth
3. After authorization, should return to app
4. User should be authenticated

### Test Validation
1. Try mismatched passwords - should show error
2. Try short password - should show error
3. Try invalid email - HTML5 validation should catch it

### Test Error Handling
1. Try invalid credentials - should show error message
2. Try existing email on signup - should show error
3. Errors should clear when switching views

## Notes

- Modal uses fixed positioning and covers entire screen
- Background is semi-transparent with blur effect
- Close button (X) is always visible in top-right
- ESC key does not close modal (can be added if desired)
- Google OAuth requires proper Supabase configuration
- Guest mode notice is shown at bottom of modal
