import { useState, useEffect, useCallback } from 'react';
import { GAME_LEVELS } from '../data/gameLevels';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { v4 as uuidv4 } from 'uuid';

const GUEST_ID_KEY = 'deadline_guest_id';

interface LevelProgress {
  [levelId: number]: {
    [partId: string]: number; // Skulls earned for each part
  };
}

// Get or create guest ID (session-based)
const getGuestId = (): string => {
  let guestId = sessionStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    guestId = `guest_${uuidv4()}`;
    sessionStorage.setItem(GUEST_ID_KEY, guestId);
  }
  return guestId;
};

export function useGameProgress() {
  const { user, loading: authLoading } = useAuth();
  const [unlockedLevelIds, setUnlockedLevelIds] = useState<number[]>([1]);
  const [levelProgress, setLevelProgress] = useState<LevelProgress>({});
  const [totalSkulls, setTotalSkulls] = useState<number>(0);
  const [earnedRewards, setEarnedRewards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to calculate total skulls from progress
  const calculateTotalSkulls = useCallback((progress: LevelProgress): number => {
    let total = 0;
    Object.values(progress).forEach((parts) => {
      Object.values(parts).forEach((skulls) => {
        total += skulls as number;
      });
    });
    return total;
  }, []);

  // Load progress based on auth state
  useEffect(() => {
    const loadProgress = async () => {
      // Wait for auth to be ready
      if (authLoading) {
        return;
      }

      setIsLoading(true);

      try {
        if (user) {
          // Authenticated user - load from Supabase
          const { data, error } = await supabase
            .from('game_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
            // Existing user data found
            setUnlockedLevelIds(data.unlocked_level_ids || [1]);
            setLevelProgress(data.level_progress || {});
            setEarnedRewards(data.earned_rewards || []);
            const total = calculateTotalSkulls(data.level_progress || {});
            setTotalSkulls(total);
          } else {
            // New user - insert default progress
            const defaultProgress = {
              user_id: user.id,
              unlocked_level_ids: [1],
              level_progress: {},
              earned_rewards: [],
            };

            const { error: insertError } = await supabase
              .from('game_progress')
              .insert(defaultProgress);

            if (insertError) {
              // Error creating default progress
            }

            setUnlockedLevelIds([1]);
            setLevelProgress({});
            setEarnedRewards([]);
            setTotalSkulls(0);
          }
        } else {
          // Guest mode - use in-memory state only
          getGuestId(); // Ensure guest ID exists
          
          // Reset to defaults for guest
          setUnlockedLevelIds([1]);
          setLevelProgress({});
          setEarnedRewards([]);
          setTotalSkulls(0);
        }
      } catch (error) {
        // Fallback to defaults
        setUnlockedLevelIds([1]);
        setLevelProgress({});
        setEarnedRewards([]);
        setTotalSkulls(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user, authLoading, calculateTotalSkulls]);

  // Auto-save progress whenever state changes
  useEffect(() => {
    const saveProgress = async () => {
      // Don't save if still loading or auth is loading
      if (isLoading || authLoading) {
        return;
      }

      // Only save to Supabase if user is authenticated
      if (user) {
        
        try {
          const { error } = await supabase
            .from('game_progress')
            .upsert({
              user_id: user.id,
              level_progress: levelProgress,
              unlocked_level_ids: unlockedLevelIds,
              earned_rewards: earnedRewards,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id'
            });

          if (error) {
            // Supabase save error
          }
        } catch (error) {
          // Error saving to Supabase
        }
      } else {
        // Guest mode - progress is in-memory only
      }

      // Recalculate total skulls
      const total = calculateTotalSkulls(levelProgress);
      setTotalSkulls(total);
    };

    saveProgress();
  }, [user, unlockedLevelIds, levelProgress, earnedRewards, isLoading, authLoading, calculateTotalSkulls]);

  // Save part results and check for level unlock
  const savePartResults = (levelId: number, partId: string, skulls: number) => {
    setLevelProgress((prev) => {
      const levelData = prev[levelId] || {};
      const currentSkulls = levelData[partId] || 0;
      
      // Only update if new score is higher
      if (skulls <= currentSkulls) {
        return prev;
      }

      const updatedLevelData = {
        ...levelData,
        [partId]: skulls,
      };

      const updatedProgress = {
        ...prev,
        [levelId]: updatedLevelData,
      };

      // Check if level should unlock next level
      const levelTotalSkulls = Object.values(updatedLevelData).reduce((sum, s) => sum + s, 0);
      const level = GAME_LEVELS.find((l) => l.id === levelId);
      
      if (level && levelTotalSkulls >= level.requiredSkullsToUnlockNext) {
        const nextLevelId = levelId + 1;
        if (nextLevelId <= GAME_LEVELS.length && !unlockedLevelIds.includes(nextLevelId)) {
          unlockLevel(nextLevelId);
        }
      }

      return updatedProgress;
    });
  };

  // Unlock a level and add its reward
  const unlockLevel = (levelId: number) => {
    setUnlockedLevelIds((prev) => {
      if (prev.includes(levelId)) {
        return prev;
      }
      return [...prev, levelId].sort((a, b) => a - b);
    });

    const level = GAME_LEVELS.find((l) => l.id === levelId);
    if (level && level.reward) {
      setEarnedRewards((prev) => {
        if (prev.includes(level.reward.name)) {
          return prev;
        }
        return [...prev, level.reward.name];
      });
    }
  };

  // Reset all progress
  const resetProgress = async () => {
    
    // Reset state
    setUnlockedLevelIds([1]);
    setLevelProgress({});
    setTotalSkulls(0);
    setEarnedRewards([]);
    
    // Delete from Supabase if user is authenticated
    if (user) {
      try {
        await supabase
          .from('game_progress')
          .delete()
          .eq('user_id', user.id);
      } catch (error) {
        // Error deleting from Supabase
      }
    } else {
      // Guest mode - just clear session
      sessionStorage.removeItem(GUEST_ID_KEY);
    }
  };

  // Reload progress (useful after sign in/out)
  const loadProgress = useCallback(async () => {
    if (authLoading) return;
    
    setIsLoading(true);
    
    try {
      if (user) {
        const { data, error } = await supabase
          .from('game_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setUnlockedLevelIds(data.unlocked_level_ids || [1]);
          setLevelProgress(data.level_progress || {});
          setEarnedRewards(data.earned_rewards || []);
          const total = calculateTotalSkulls(data.level_progress || {});
          setTotalSkulls(total);
        }
      } else {
        // Guest - reset to defaults
        setUnlockedLevelIds([1]);
        setLevelProgress({});
        setEarnedRewards([]);
        setTotalSkulls(0);
      }
    } catch (error) {
      // Error reloading progress
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading, calculateTotalSkulls]);

  // Helper: Check if a level is unlocked
  const isLevelUnlocked = (levelId: number): boolean => {
    return unlockedLevelIds.includes(levelId);
  };

  // Helper: Check if a part is completed (has any skulls)
  const isPartCompleted = (levelId: number, partId: string): boolean => {
    return (levelProgress[levelId]?.[partId] || 0) > 0;
  };

  // Helper: Get total skulls for a specific level
  const getSkullsForLevel = (levelId: number): number => {
    const levelData = levelProgress[levelId];
    if (!levelData) return 0;
    return Object.values(levelData).reduce((sum, skulls) => sum + skulls, 0);
  };

  // Helper: Get skulls for a specific part
  const getSkullsForPart = (levelId: number, partId: string): number => {
    return levelProgress[levelId]?.[partId] || 0;
  };

  return {
    // State
    unlockedLevelIds,
    levelProgress,
    totalSkulls,
    earnedRewards,
    isLoading: isLoading || authLoading, // Combined loading state
    user, // Expose user for UI
    
    // Functions
    savePartResults,
    unlockLevel,
    resetProgress,
    loadProgress,
    
    // Helpers
    isLevelUnlocked,
    isPartCompleted,
    getSkullsForLevel,
    getSkullsForPart,
  };
}
