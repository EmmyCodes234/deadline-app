# Avatar Upload RLS Error Fix

## Problem
Getting error: `StorageApiError: new row violates row-level security policy`

This means the Supabase Storage policies haven't been set up yet.

## Solution

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Run the Quick Fix SQL
Copy and paste the contents of `supabase-avatar-quick-fix.sql` into the SQL editor and click "Run".

Or copy this directly:

```sql
-- Quick fix for avatar upload RLS policies

-- First, drop any existing policies (if they exist)
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;

-- Create the profiles bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow authenticated users to upload to profiles bucket
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

-- Allow authenticated users to update in profiles bucket
CREATE POLICY "Users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profiles');

-- Allow authenticated users to delete from profiles bucket
CREATE POLICY "Users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profiles');

-- Allow public read access to all files in profiles bucket
CREATE POLICY "Public can view profiles"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- Add avatar_url column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

### Step 3: Verify Storage Bucket
1. Go to "Storage" in the left sidebar
2. You should see a "profiles" bucket
3. It should be marked as "Public"

### Step 4: Test Upload
1. Go back to your app
2. Navigate to Profile page
3. Click "Reform Vessel" to edit
4. Click the avatar hexagon
5. Select an image
6. Crop and apply
7. Upload should now work!

## What This Does

### Storage Bucket
- Creates a public bucket called "profiles"
- Stores all avatar images

### RLS Policies
- **Upload**: Any authenticated user can upload to the profiles bucket
- **Update**: Any authenticated user can update files in the profiles bucket
- **Delete**: Any authenticated user can delete files in the profiles bucket
- **Read**: Anyone (public) can view files in the profiles bucket

### Database
- Adds `avatar_url` column to `user_profiles` table

## Security Notes

These policies are simplified for ease of use. In production, you might want to:
- Limit file sizes at the database level
- Add file type restrictions
- Implement user-specific folder restrictions
- Add rate limiting

For now, the app handles validation client-side:
- File type checking (images only)
- File size limits (2MB after optimization)
- Automatic optimization and compression

## Troubleshooting

### Still Getting RLS Error?
1. Make sure you're logged in
2. Check that the SQL ran successfully (no errors in SQL editor)
3. Refresh your app page
4. Try uploading again

### Bucket Not Created?
1. Go to Storage in Supabase Dashboard
2. Click "New Bucket"
3. Name it "profiles"
4. Check "Public bucket"
5. Click "Create bucket"
6. Then run the SQL policies again

### Avatar Not Showing?
1. Check browser console for errors
2. Verify the avatar_url is saved in user_profiles table
3. Check that the URL is accessible (try opening it in a new tab)
4. Make sure the profiles bucket is public

## Alternative: Manual Setup

If SQL doesn't work, you can set up manually:

### 1. Create Bucket
- Storage → New Bucket
- Name: "profiles"
- Public: Yes

### 2. Add Policies
Go to Storage → profiles → Policies

**Policy 1: Upload**
- Name: "Users can upload avatars"
- Target roles: authenticated
- Policy command: INSERT
- Policy definition: `bucket_id = 'profiles'`

**Policy 2: Update**
- Name: "Users can update avatars"
- Target roles: authenticated
- Policy command: UPDATE
- Policy definition: `bucket_id = 'profiles'`

**Policy 3: Delete**
- Name: "Users can delete avatars"
- Target roles: authenticated
- Policy command: DELETE
- Policy definition: `bucket_id = 'profiles'`

**Policy 4: Read**
- Name: "Public can view profiles"
- Target roles: public
- Policy command: SELECT
- Policy definition: `bucket_id = 'profiles'`

### 3. Add Column
Go to Table Editor → user_profiles → Add Column
- Name: avatar_url
- Type: text
- Nullable: Yes

## Success!
Once set up, you should be able to:
- ✅ Upload avatar images
- ✅ Crop and optimize them
- ✅ See them in your profile
- ✅ Update them anytime
