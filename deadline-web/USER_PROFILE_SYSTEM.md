# User Profile System Implementation

## Overview
Added a user profile system that allows users to set a custom username that displays throughout the app instead of their email.

## Database Changes

### New Table: `user_profiles`
Run the migration file: `supabase-user-profiles-migration.sql`

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  username TEXT,
  display_name TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## New Hook: `useUserProfile`

Located at: `src/hooks/useUserProfile.ts`

### Features:
- Automatically creates profile on first use
- Fetches user profile from database
- Updates username/display_name
- Provides `getDisplayName()` helper that returns:
  1. Username (if set)
  2. Display name (if set)
  3. Email prefix (fallback)
  4. "SCRIBE" (default)

### Usage:
```tsx
import { useUserProfile } from '../hooks/useUserProfile';

const { profile, updateProfile, getDisplayName } = useUserProfile();

// Update username
await updateProfile({ username: 'DarkScribe' });

// Get display name
const name = getDisplayName(); // Returns "DARKSCRIBE"
```

## Updated Components

### ProfilePage (`src/pages/ProfilePage.tsx`)
- Added inline username editing
- Click edit icon to change username
- Save/cancel buttons
- Error handling

### Navigation (`src/components/Navigation.tsx`)
- Now displays custom username in HUD
- Shows "VESSEL: [USERNAME]" instead of email
- Works across all navigation variants

## User Flow

1. User signs up/logs in
2. Profile is automatically created with null username
3. Email prefix displays by default: "VESSEL: JOHNDOE"
4. User visits Profile page
5. Clicks edit icon next to username
6. Enters custom username (e.g., "DarkScribe")
7. Saves
8. Username now displays everywhere: "VESSEL: DARKSCRIBE"

## Migration Steps

1. Run the SQL migration in your Supabase dashboard
2. Existing users will have profiles auto-created on next login
3. No data loss - email fallback always works
