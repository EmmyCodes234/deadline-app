-- ============================================
-- ADD BIO COLUMN TO USER PROFILES
-- ============================================
-- This migration adds the bio field to existing user_profiles table

-- Add bio column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'bio'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN bio TEXT;
  END IF;
END $$;
