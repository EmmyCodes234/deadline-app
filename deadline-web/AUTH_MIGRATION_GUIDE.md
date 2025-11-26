# Authentication Migration Guide

## Overview

The app now supports both **authenticated users** and **guest mode**:

- **Authenticated Users**: Progress is saved to Supabase and synced across devices
- **Guest Mode**: Progress is kept in-memory for the session only (resets on browser close)

## Key Changes

### 1. useGameProgress Hook

**Before:**
- Used anonymous user IDs stored in localStorage
- All progress saved to Supabase with anonymous IDs

**After:**
- Integrates with `useAuth` hook
- **Authenticated**: Progress saved to Supabase with user.id
- **Guest**: Progress kept in-memory only (session-based)

### 2. User Experience

#### Guest Users
- Can play immediately without signing up
- Progress is temporary (resets when browser closes)
- See a prompt to sign up to save progress
- Fresh start when they create an account

#### Authenticated Users
- Progress automatically saved to Supabase
- Can access progress from any device
- Progress persists across sessions
- Can sign out and sign back in without losing data

## Implementation Details

### Guest ID Management

```typescript
// Guest IDs are stored in sessionStorage (not localStorage)
const getGuestId = (): string => {
  let guestId = sessionStorage.getItem('deadline_guest_id');
  if (!guestId) {
    guestId = `guest_${uuidv4()}`;
    sessionStorage.setItem('deadline_guest_id', guestId);
  }
  return guestId;
};
```

**Why sessionStorage?**
- Clears when browser/tab closes
- Prevents confusion about "saved" progress
- Encourages sign-up for persistent progress

### Loading Progress

```typescript
useEffect(() => {
  if (authLoading) return; // Wait for auth state
  
  if (user) {
    // Load from Supabase
    const { data } = await supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      // Existing user
      setProgress(data);
    } else {
      // New user - create default
      await supabase.from('game_progress').insert({
        user_id: user.id,
        unlocked_level_ids: [1],
        level_progress: {},
        earned_rewards: [],
      });
    }
  } else {
    // Guest mode - use defaults
    setUnlockedLevelIds([1]);
    setLevelProgress({});
    setEarnedRewards([]);
  }
}, [user, authLoading]);
```

### Saving Progress

```typescript
useEffect(() => {
  if (isLoading || authLoading) return;
  
  if (user) {
    // Save to Supabase
    await supabase.from('game_progress').upsert({
      user_id: user.id,
      level_progress: levelProgress,
      unlocked_level_ids: unlockedLevelIds,
      earned_rewards: earnedRewards,
    });
  } else {
    // Guest mode - no persistence
    console.log('Guest mode - progress not saved');
  }
}, [user, levelProgress, unlockedLevelIds, earnedRewards]);
```

## UI Recommendations

### Show Auth Status

```tsx
import { useGameProgress } from '@/hooks/useGameProgress';

function GameHeader() {
  const { user, isLoading } = useGameProgress();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <span>Signed in as: {user.email}</span>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <span>⚠️ Guest Mode - Progress not saved</span>
          <button onClick={() => setShowAuth(true)}>Sign Up to Save</button>
        </div>
      )}
    </div>
  );
}
```

### Prompt to Sign Up

Show a prompt when guest users achieve something significant:

```tsx
function VictoryModal({ skulls }) {
  const { user } = useGameProgress();
  
  return (
    <div>
      <h2>Level Complete!</h2>
      <p>You earned {skulls} skulls!</p>
      
      {!user && (
        <div className="bg-yellow-100 p-4 rounded">
          <p>⚠️ You're playing as a guest</p>
          <p>Sign up now to save your progress!</p>
          <button>Create Account</button>
        </div>
      )}
    </div>
  );
}
```

## Migration from Anonymous to Authenticated

### Option 1: Fresh Start (Current Implementation)

When a guest signs up, they start with a clean slate:
- Simple implementation
- No data migration needed
- Clear separation between guest and user data

### Option 2: Migrate Guest Progress (Future Enhancement)

If you want to preserve guest progress when they sign up:

```typescript
const migrateGuestProgress = async (userId: string) => {
  // Get current guest progress from state
  const guestProgress = {
    level_progress: levelProgress,
    unlocked_level_ids: unlockedLevelIds,
    earned_rewards: earnedRewards,
  };
  
  // Save to Supabase with authenticated user ID
  await supabase.from('game_progress').upsert({
    user_id: userId,
    ...guestProgress,
  });
  
  console.log('Guest progress migrated to authenticated account');
};

// Call this after successful sign up
useEffect(() => {
  if (user && wasGuest) {
    migrateGuestProgress(user.id);
  }
}, [user]);
```

## Database Schema

The `game_progress` table now uses `user_id` from Supabase Auth:

```sql
CREATE TABLE game_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,  -- Now uses Supabase Auth user.id
  level_progress JSONB DEFAULT '{}'::jsonb,
  unlocked_level_ids INTEGER[] DEFAULT ARRAY[1],
  earned_rewards TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Note**: The `user_id` column is TEXT to support both:
- Supabase Auth UUIDs (authenticated users)
- Custom guest IDs (if you implement guest persistence)

## Testing

### Test Guest Mode
1. Open app in incognito/private window
2. Play through a level
3. Check console: "Guest mode - progress not saved"
4. Close browser
5. Reopen - progress should be reset

### Test Authenticated Mode
1. Sign up with email/password
2. Play through a level
3. Check Supabase dashboard - data should be saved
4. Sign out and sign back in
5. Progress should be restored

### Test Sign Up Flow
1. Play as guest
2. Earn some progress
3. Sign up
4. Verify: Fresh start (or migrated progress if implemented)

## Benefits

✅ **No forced sign-up**: Users can try the game immediately  
✅ **Clear value prop**: "Sign up to save your progress"  
✅ **Data safety**: Authenticated users never lose progress  
✅ **Privacy**: Guest sessions are truly temporary  
✅ **Scalability**: Ready for multi-device sync  

## Future Enhancements

1. **Social Features**: Leaderboards, shared documents
2. **Profile Management**: Avatar, display name, preferences
3. **Progress Migration**: Transfer guest progress on sign-up
4. **Offline Sync**: Queue changes when offline, sync when online
5. **Account Linking**: Link multiple auth providers to one account
