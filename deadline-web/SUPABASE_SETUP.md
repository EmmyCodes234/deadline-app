# Supabase Setup Guide

This app uses Supabase for persistent game progress storage with localStorage as a fallback.

## Setup Steps

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `deadline-game` (or any name you prefer)
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
4. Wait for the project to be created (~2 minutes)

### 2. Run the Database Migration

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase-migration.sql` and paste it into the editor
4. Click "Run" to execute the migration
5. You should see a success message

### 3. Get Your API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 4. Configure Environment Variables

1. Create a `.env` file in the `deadline-web` directory (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Restart your development server

### 5. Verify Setup

1. Start the app: `npm run dev`
2. Test different features:
   - Play through Level 1, Part 1 (tests `game_progress` table)
   - Write some text in Reaper mode (tests `writing_drafts` table)
   - Save a document to the Crypt (tests `crypt_documents` table)
3. Check the browser console for logs like:
   - `[useGameProgress] Saved to Supabase successfully`
   - `[useReaper] Draft saved to Supabase`
   - `[useCrypt] Document saved to Supabase`
4. In Supabase dashboard, go to **Table Editor** and check:
   - `game_progress` - Your game progress
   - `writing_drafts` - Your current draft
   - `crypt_documents` - Your saved documents

## How It Works

- **Anonymous Users**: Each user gets a unique ID stored in localStorage
- **Dual Storage**: Data is saved to both Supabase (cloud) and localStorage (local backup)
- **Fallback**: If Supabase is unavailable, localStorage is used
- **Auto-sync**: All data is automatically saved on every change
- **Three Tables**:
  - `game_progress`: Game levels, skulls, and unlocked content
  - `writing_drafts`: Current draft in Reaper mode (auto-saves as you type)
  - `crypt_documents`: Saved documents/snapshots from the Crypt

## Troubleshooting

### "Failed to save to Supabase"
- Check your `.env` file has correct credentials
- Verify the migration ran successfully
- Check browser console for detailed error messages

### Progress not persisting
- Clear browser cache and localStorage
- Check Supabase dashboard to see if data is being saved
- Verify RLS policies are set correctly

### Development without Supabase
The app will work with localStorage only if Supabase is not configured. Just don't set the environment variables.
