import { useState, useEffect, useRef, useCallback } from 'react';
import { generateSpiritResponse } from '../lib/gemini';

const PLOT_TWISTS = [
  "Suddenly, a cold draft extinguished the candles.",
  "The door creaked open, though no one had touched it.",
  "He realized he wasn't alone in the room.",
  "A whisper echoed from the walls: 'Get out.'",
  "The mirror showed a reflection that wasn't his own.",
  "Footsteps approached from the empty hallway.",
  "The photograph on the wall began to change.",
  "Something cold touched the back of his neck.",
  "The lights flickered, and when they returned, she was gone.",
  "A child's laughter rang out from the basement.",
  "The music box started playing by itself.",
  "Blood began seeping through the floorboards.",
  "He heard his own voice calling from upstairs.",
  "The temperature dropped twenty degrees in an instant.",
  "Scratching sounds came from inside the walls.",
];

interface SeanceState {
  presence: number;
  ghostText: string;
  ghostSuggestion: string;
  isGhostTyping: boolean;
  spiritText: string; // Track text written by the spirit
}

export function useSeance(content: string, onContentChange: (newContent: string) => void) {
  const [state, setState] = useState<SeanceState>({
    presence: 0,
    ghostText: '',
    ghostSuggestion: '',
    isGhostTyping: false,
    spiritText: '',
  });

  const inactivityTimerRef = useRef<number | undefined>(undefined);
  const typingIntervalRef = useRef<number | undefined>(undefined);
  const autocompleteTimerRef = useRef<number | undefined>(undefined);
  const lastContentLengthRef = useRef(0);
  const isManifestingRef = useRef(false);

  // Reset inactivity timer on every keystroke
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Don't start timer if ghost is already typing
    if (state.isGhostTyping) return;

    // Start new 5-second timer
    inactivityTimerRef.current = window.setTimeout(() => {
      manifestGhost();
    }, 5000);
  }, [state.isGhostTyping]);

  // Manifest Ghost - The Intervention (AI-Powered)
  const manifestGhost = useCallback(async () => {
    // Don't interrupt if already typing or manifesting
    if (state.isGhostTyping || isManifestingRef.current) return;

    isManifestingRef.current = true;

    try {
      // Get AI-generated intervention
      const spiritResponse = await generateSpiritResponse(content, 'INTERVENTION');
      
      setState(prev => ({
        ...prev,
        isGhostTyping: true,
        ghostText: spiritResponse,
      }));

      // Type character by character
      let charIndex = 0;
      const textToType = ' ' + spiritResponse; // Add space before
      const startContent = content; // Capture current content

      typingIntervalRef.current = window.setInterval(() => {
        if (charIndex < textToType.length) {
          const newText = startContent + textToType.substring(0, charIndex + 1);
          onContentChange(newText);
          charIndex++;
          
          // Increase presence as ghost types
          setState(prev => ({
            ...prev,
            presence: Math.min(100, prev.presence + 2),
            spiritText: textToType.substring(0, charIndex),
          }));
        } else {
          // Finished typing
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
          }
          
          setState(prev => ({
            ...prev,
            isGhostTyping: false,
            ghostText: '',
          }));
          
          isManifestingRef.current = false;
        }
      }, 50); // Type at 50ms per character
    } catch (error) {
      console.error('Spirit manifestation failed:', error);
      
      // Fallback to hardcoded plot twist
      const plotTwist = PLOT_TWISTS[Math.floor(Math.random() * PLOT_TWISTS.length)];
      
      setState(prev => ({
        ...prev,
        isGhostTyping: true,
        ghostText: plotTwist,
      }));

      let charIndex = 0;
      const textToType = ' ' + plotTwist;
      const startContent = content;

      typingIntervalRef.current = window.setInterval(() => {
        if (charIndex < textToType.length) {
          onContentChange(startContent + textToType.substring(0, charIndex + 1));
          charIndex++;
          
          setState(prev => ({
            ...prev,
            presence: Math.min(100, prev.presence + 2),
          }));
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
          }
          
          setState(prev => ({
            ...prev,
            isGhostTyping: false,
            ghostText: '',
          }));
          
          isManifestingRef.current = false;
        }
      }, 50);
    }
  }, [state.isGhostTyping, content, onContentChange]);

  // The Whisper - Debounced autocomplete suggestions
  const fetchAutocomplete = useCallback(async () => {
    if (!content || content.length < 10) return;

    try {
      const suggestion = await generateSpiritResponse(content, 'AUTOCOMPLETE');
      setState(prev => ({
        ...prev,
        ghostSuggestion: suggestion,
      }));
    } catch (error) {
      console.error('Spirit whisper failed:', error);
    }
  }, [content]);

  // Monitor content changes (user typing)
  useEffect(() => {
    // Check if user is typing (content length increased)
    if (content.length > lastContentLengthRef.current && !state.isGhostTyping) {
      // User typed something - reset timer
      resetInactivityTimer();
      
      // Increase presence slightly
      setState(prev => ({
        ...prev,
        presence: Math.min(100, prev.presence + 1),
      }));

      // Debounced autocomplete - fetch suggestion after 1 second of typing
      if (autocompleteTimerRef.current) {
        clearTimeout(autocompleteTimerRef.current);
      }
      
      autocompleteTimerRef.current = window.setTimeout(() => {
        fetchAutocomplete();
      }, 1000);
    }
    
    lastContentLengthRef.current = content.length;
  }, [content, state.isGhostTyping, resetInactivityTimer, fetchAutocomplete]);

  // Decay presence over time
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setState(prev => ({
        ...prev,
        presence: Math.max(0, prev.presence - 0.5),
      }));
    }, 1000);

    return () => clearInterval(decayInterval);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (autocompleteTimerRef.current) {
        clearTimeout(autocompleteTimerRef.current);
      }
    };
  }, []);

  // Manual trigger for accepting ghost suggestions
  const acceptGhostSuggestion = useCallback((suggestion: string) => {
    onContentChange(content + (content ? ' ' : '') + suggestion);
    setState(prev => ({
      ...prev,
      presence: Math.min(100, prev.presence + 15),
      ghostText: '',
    }));
  }, [content, onContentChange]);

  return {
    ...state,
    acceptGhostSuggestion,
  };
}
