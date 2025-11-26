import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getUserId } from '../lib/supabase';

export type ReaperStatus = 'SAFE' | 'WARNING' | 'CRITICAL' | 'DEAD' | 'MOCKERY' | 'ASCENDED';

const STORAGE_KEY = 'deadline_draft';

// Anti-Cheat: Detect gibberish/key-mashing
function isGibberish(text: string): boolean {
  if (!text || text.trim().length === 0) return false;

  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return false;

  const lastWord = words[words.length - 1].toLowerCase();

  // Check 1: Last word is too long (> 15 characters)
  if (lastWord.length > 15) {
    return true;
  }

  // Check 2: Last 3 words are identical
  if (words.length >= 3) {
    const last3 = words.slice(-3).map((w) => w.toLowerCase());
    if (last3[0] === last3[1] && last3[1] === last3[2]) {
      return true;
    }
  }

  // Check 3: Consonant-to-vowel ratio is impossible (> 80% consonants)
  const vowels = 'aeiou';
  const letters = lastWord.replace(/[^a-z]/g, '');
  if (letters.length >= 4) {
    const consonantCount = letters.split('').filter((c) => !vowels.includes(c)).length;
    const consonantRatio = consonantCount / letters.length;
    if (consonantRatio > 0.8) {
      return true;
    }
  }

  return false;
}

export function useReaper(initialTime = 10000, currentWordCount = 0, isZenMode = false) {
  // 10 seconds default
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [status, setStatus] = useState<ReaperStatus>('SAFE');
  const [isActive, setIsActive] = useState(false);
  const [draft, setDraft] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [lastStrokeWasPunished, setLastStrokeWasPunished] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [sessionGoal, setSessionGoal] = useState(500);
  const [pactFulfilled, setPactFulfilled] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [flowStreakActive, setFlowStreakActive] = useState(false);
  const [_flowStreakDuration, setFlowStreakDuration] = useState(0);
  const [isGhostTyping, setIsGhostTyping] = useState(false);
  const mockeryTimeoutRef = useRef<number | null>(null);
  const warningTimeoutRef = useRef<number | null>(null);
  const lastStrokeTimeRef = useRef<number>(Date.now());
  const flowStreakTimeoutRef = useRef<number | null>(null);
  const ghostTypingTimeoutRef = useRef<number | null>(null);

  const HESITATION_THRESHOLD_MS = 2000; // 2 seconds
  const FLOW_STREAK_THRESHOLD = 5; // 5 seconds of continuous typing
  const GHOST_TYPING_THRESHOLD_MS = 5000; // 5 seconds total hesitation before ghost types

  // Initialize draft from Supabase/localStorage on mount
  useEffect(() => {
    const loadDraft = async () => {
      const userId = getUserId();
      
      try {
        // Try Supabase first
        const { data, error } = await supabase
          .from('writing_drafts')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (data && !error) {
          setDraft(data.draft_text);
          setWordCount(data.word_count);
          // Backup to localStorage
          localStorage.setItem(STORAGE_KEY, data.draft_text);
          return;
        }
      } catch (error) {
        // Error loading from Supabase
      }

      // Fallback to localStorage
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        setDraft(savedDraft);
        const words = savedDraft.trim().split(/\s+/).filter((w) => w.length > 0).length;
        setWordCount(words);
      }
    };

    loadDraft();
  }, []);

  // The Decay Loop
  useEffect(() => {
    if (!isActive || status === 'DEAD' || !hasStartedTyping) return; // Grace period until first keystroke
    if (isZenMode) return; // Zen Mode: No decay

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 100; // Decrement 100ms
        if (next <= 0) return 0;
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, status, hasStartedTyping, isZenMode]);

  // Ghost Typing Detection
  useEffect(() => {
    if (!isActive || status === 'DEAD' || !hasStartedTyping || isZenMode) {
      // Clear ghost typing if conditions not met
      if (isGhostTyping) setIsGhostTyping(false);
      if (ghostTypingTimeoutRef.current) {
        clearTimeout(ghostTypingTimeoutRef.current);
        ghostTypingTimeoutRef.current = null;
      }
      return;
    }

    // Clear any existing timeout
    if (ghostTypingTimeoutRef.current) {
      clearTimeout(ghostTypingTimeoutRef.current);
    }

    // Set timeout to trigger ghost typing after hesitation
    ghostTypingTimeoutRef.current = window.setTimeout(() => {
      setIsGhostTyping(true);
    }, GHOST_TYPING_THRESHOLD_MS);

    return () => {
      if (ghostTypingTimeoutRef.current) {
        clearTimeout(ghostTypingTimeoutRef.current);
      }
    };
  }, [isActive, status, hasStartedTyping, isZenMode, lastStrokeTimeRef.current]);

  // Status Check
  useEffect(() => {
    // Don't override MOCKERY or ASCENDED status
    if (status === 'MOCKERY' || status === 'ASCENDED') return;

    if (timeLeft <= 0) setStatus('DEAD');
    else if (timeLeft < 3000) setStatus('CRITICAL');
    else if (timeLeft < 6000) setStatus('WARNING');
    else setStatus('SAFE');
  }, [timeLeft, status]);

  // Death Handler - Delete draft when dead
  useEffect(() => {
    if (status === 'DEAD') {
      const userId = getUserId();
      localStorage.removeItem(STORAGE_KEY);
      
      // Also clear from Supabase
      void supabase
        .from('writing_drafts')
        .delete()
        .eq('user_id', userId);
    }
  }, [status]);

  // Typing Action
  const stroke = useCallback(
    (text?: string) => {
      // Disable ghost typing immediately on user input
      if (isGhostTyping) setIsGhostTyping(false);
      
      // Start the timer on first keystroke
      if (!hasStartedTyping) setHasStartedTyping(true);
      if (!isActive) setIsActive(true);
      if (status === 'DEAD') return;

      // Update draft and word count if text is provided
      if (text !== undefined) {
        setDraft(text);
        const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
        setWordCount(words);
        
        // Save to localStorage immediately
        localStorage.setItem(STORAGE_KEY, text);
        
        // Save to Supabase asynchronously
        const userId = getUserId();
        void supabase
          .from('writing_drafts')
          .upsert({
            user_id: userId,
            draft_text: text,
            word_count: words,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          });

        // Anti-Cheat: Check for gibberish
        if (isGibberish(text)) {
          // Clear any existing warning timeout
          if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
          }

          // Set warning state (yellow-green text)
          setIsWarning(true);

          // Give user 2 seconds to fix it before punishment
          warningTimeoutRef.current = window.setTimeout(() => {
            // Check if still gibberish after 2 seconds
            if (isGibberish(text)) {
              // Now trigger the punishment
              setLastStrokeWasPunished(true);
              setTimeout(() => setLastStrokeWasPunished(false), 300);

              // Clear any existing mockery timeout
              if (mockeryTimeoutRef.current) {
                clearTimeout(mockeryTimeoutRef.current);
              }

              // Set MOCKERY status
              setStatus('MOCKERY');

              // Revert to normal status after 1 second
              mockeryTimeoutRef.current = window.setTimeout(() => {
                setStatus((currentStatus) => {
                  if (currentStatus === 'MOCKERY') {
                    // Recalculate status based on current timeLeft
                    const currentTime = timeLeft;
                    if (currentTime <= 0) return 'DEAD';
                    if (currentTime < 3000) return 'CRITICAL';
                    if (currentTime < 6000) return 'WARNING';
                    return 'SAFE';
                  }
                  return currentStatus;
                });
              }, 1000);
            }
            
            // Clear warning state
            setIsWarning(false);
          }, 2000);

          // DO NOT add time for gibberish
          return;
        } else {
          // Clear warning if text is now valid
          setIsWarning(false);
          setLastStrokeWasPunished(false);
          if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
            warningTimeoutRef.current = null;
          }
        }
      }

      // Check for Pact fulfillment
      if (currentWordCount >= sessionGoal && !pactFulfilled) {
        setPactFulfilled(true);
        setStatus('ASCENDED');
      }

      // Flow State Tracking
      const now = Date.now();
      const timeSinceLastStroke = now - lastStrokeTimeRef.current;
      
      if (timeSinceLastStroke < HESITATION_THRESHOLD_MS) {
        // User is typing continuously - increment flow streak
        setFlowStreakDuration((prev) => {
          const newDuration = prev + timeSinceLastStroke / 1000; // Convert to seconds
          
          // Check if flow streak threshold reached
          if (newDuration >= FLOW_STREAK_THRESHOLD && !flowStreakActive) {
            // Trigger flow state!
            setFlowStreakActive(true);
            
            // Clear any existing flow timeout
            if (flowStreakTimeoutRef.current) {
              clearTimeout(flowStreakTimeoutRef.current);
            }
            
            // Deactivate after 2 seconds
            flowStreakTimeoutRef.current = window.setTimeout(() => {
              setFlowStreakActive(false);
              setFlowStreakDuration(0); // Reset for next flow state
            }, 2000);
          }
          
          return newDuration;
        });
      } else {
        // User hesitated - reset flow streak
        setFlowStreakDuration(0);
      }
      
      lastStrokeTimeRef.current = now;

      setTimeLeft((prev) => Math.min(prev + 2000, 15000)); // Add 2s, cap at 15s
    },
    [isActive, status, timeLeft, flowStreakActive, currentWordCount, sessionGoal, pactFulfilled]
  );

  const revive = useCallback(() => {
    // Clear any pending mockery timeout
    if (mockeryTimeoutRef.current) {
      clearTimeout(mockeryTimeoutRef.current);
      mockeryTimeoutRef.current = null;
    }
    
    // Clear any pending flow timeout
    if (flowStreakTimeoutRef.current) {
      clearTimeout(flowStreakTimeoutRef.current);
      flowStreakTimeoutRef.current = null;
    }

    // Clear any pending ghost typing timeout
    if (ghostTypingTimeoutRef.current) {
      clearTimeout(ghostTypingTimeoutRef.current);
      ghostTypingTimeoutRef.current = null;
    }

    setTimeLeft(initialTime);
    setStatus('SAFE');
    setIsActive(false);
    setDraft('');
    setWordCount(0);
    setPactFulfilled(false);
    setHasStartedTyping(false); // Reset grace period
    setFlowStreakActive(false);
    setFlowStreakDuration(0);
    setIsGhostTyping(false);
    localStorage.removeItem(STORAGE_KEY);
    
    // Also clear from Supabase
    const userId = getUserId();
    void supabase
      .from('writing_drafts')
      .delete()
      .eq('user_id', userId);
  }, [initialTime]);

  const progress = (timeLeft / 15000) * 100; // 15s is max buffer

  return {
    timeLeft,
    status,
    stroke,
    progress,
    revive,
    draft,
    wordCount,
    lastStrokeWasPunished,
    isWarning,
    sessionGoal,
    setSessionGoal,
    pactFulfilled,
    flowStreakActive,
    isGhostTyping,
  };
}