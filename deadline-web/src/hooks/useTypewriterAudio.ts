import { useEffect, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function useTypewriterAudio() {
  const { typewriterSounds } = useSettings();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!typewriterSounds) return;

    // Initialize audio context
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Create typewriter sound
    const playTypewriterSound = () => {
      if (!typewriterSounds || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      // Create a brief click sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Sharp click sound
      oscillator.frequency.setValueAtTime(800 + Math.random() * 400, now);
      oscillator.type = 'square';

      // Quick envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      oscillator.start(now);
      oscillator.stop(now + 0.05);
    };

    // Listen for keydown events on input elements
    const handleKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      
      // Only play sound for actual typing in text inputs
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true' ||
        target.classList.contains('ProseMirror')
      ) {
        // Don't play sound for modifier keys
        if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
          initAudioContext();
          playTypewriterSound();
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [typewriterSounds]);

  return { typewriterSounds };
}