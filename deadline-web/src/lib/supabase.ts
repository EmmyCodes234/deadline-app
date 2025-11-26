import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// For development, we'll use environment variables
// You'll need to set these in your .env file or hosting platform
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface GameProgress {
  id?: string;
  user_id: string;
  level_progress: Record<number, Record<string, number>>; // levelId -> partId -> skulls
  unlocked_level_ids: number[];
  earned_rewards: string[];
  created_at?: string;
  updated_at?: string;
}

export interface WritingDraft {
  id?: string;
  user_id: string;
  draft_text: string;
  word_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CryptDocument {
  id?: string;
  user_id: string;
  doc_id: string;
  title: string;
  content: string;
  word_count: number;
  created_at?: string;
  updated_at?: string;
}

// Helper to get user ID (shared across hooks)
export const getUserId = (): string => {
  const USER_ID_KEY = 'deadline_user_id';
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};
