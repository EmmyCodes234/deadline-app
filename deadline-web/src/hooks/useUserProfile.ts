import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          await createProfile();
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          username: null,
          display_name: null,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    }
  };

  const updateProfile = async (updates: { username?: string; display_name?: string; bio?: string; avatar_url?: string }) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { success: false, error: 'No user logged in' };

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'File must be an image' };
      }

      if (file.size > 2 * 1024 * 1024) {
        return { success: false, error: 'Image must be less than 2MB' };
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const result = await updateProfile({ avatar_url: publicUrl });
      
      return result?.success 
        ? { success: true, url: publicUrl }
        : { success: false, error: 'Failed to update profile' };
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to upload avatar' 
      };
    }
  };

  const getDisplayName = () => {
    // Check localStorage first for the invocation name
    const scribeName = localStorage.getItem('scribe_name');
    if (scribeName) return scribeName.toUpperCase();
    
    // Fall back to profile/user data
    if (!user) return 'UNKNOWN VESSEL';
    if (profile?.username) return profile.username.toUpperCase();
    if (profile?.display_name) return profile.display_name.toUpperCase();
    return user.email?.split('@')[0]?.toUpperCase() || 'UNKNOWN VESSEL';
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    getDisplayName,
    refetch: fetchProfile,
  };
}
