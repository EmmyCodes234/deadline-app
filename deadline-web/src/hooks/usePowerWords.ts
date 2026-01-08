import { useState, useRef, useCallback } from 'react';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

interface PowerWordEffects {
  showBloodVignette: boolean;
  isVoidActive: boolean;
  flashLight: boolean;
}

const POWER_WORDS = ['BLOOD', 'DEATH', 'HELP', 'LIGHT', 'VOID'];
const BUFFER_SIZE = 10;

/**
 * Power Words Hook
 * Detects specific words typed by the user and triggers environmental effects
 */
export function usePowerWords() {
  const [effects, setEffects] = useState<PowerWordEffects>({
    showBloodVignette: false,
    isVoidActive: false,
    flashLight: false,
  });
  
  const bufferRef = useRef<string>('');
  const triggeredWordsRef = useRef<Set<string>>(new Set());

  const checkForPowerWords = useCallback((newChar: string) => {
    // Add character to buffer
    bufferRef.current += newChar.toUpperCase();
    
    // Keep only last BUFFER_SIZE characters
    if (bufferRef.current.length > BUFFER_SIZE) {
      bufferRef.current = bufferRef.current.slice(-BUFFER_SIZE);
    }

    // Check for power words
    for (const word of POWER_WORDS) {
      if (bufferRef.current.includes(word) && !triggeredWordsRef.current.has(word)) {
        triggeredWordsRef.current.add(word);
        triggerPowerWord(word);
        
        // Clear the triggered word from set after a cooldown
        setTimeout(() => {
          triggeredWordsRef.current.delete(word);
        }, 3000);
      }
    }
  }, []);

  const triggerPowerWord = (word: string) => {
    switch (word) {
      case 'BLOOD':
        // Play splash sound and show red vignette
        horrorAudio.playClick(); // Using click as splash substitute
        setEffects(prev => ({ ...prev, showBloodVignette: true }));
        setTimeout(() => {
          setEffects(prev => ({ ...prev, showBloodVignette: false }));
        }, 500);
        break;

      case 'VOID':
        // Turn page grayscale for 2 seconds
        setEffects(prev => ({ ...prev, isVoidActive: true }));
        setTimeout(() => {
          setEffects(prev => ({ ...prev, isVoidActive: false }));
        }, 2000);
        break;

      case 'LIGHT':
        // Flash the cursor/flashlight to max brightness
        setEffects(prev => ({ ...prev, flashLight: true }));
        setTimeout(() => {
          setEffects(prev => ({ ...prev, flashLight: false }));
        }, 300);
        break;

      case 'DEATH':
        // Play growl sound
        horrorAudio.playGrowl();
        break;

      case 'HELP':
        // Play growl sound (whisper not implemented)
        horrorAudio.playGrowl();
        break;
    }
  };

  return {
    effects,
    checkForPowerWords,
  };
}
