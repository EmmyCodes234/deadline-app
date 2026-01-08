import { useEffect, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function useAmbientAudio() {
  const { ambientNoise } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (ambientNoise === 'Silence') return;

    // Create procedural ambient sounds
    const createAmbientSound = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      if (ambientNoise === 'Rain') {
        createRainSound(ctx);
      } else if (ambientNoise === 'Crypt') {
        createCryptSound(ctx);
      }
    };

    const createRainSound = (ctx: AudioContext) => {
      // Create white noise for rain
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const playRain = () => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1;
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        source.start();
        source.onended = () => {
          if (ambientNoise === 'Rain') {
            setTimeout(playRain, 100);
          }
        };
      };

      playRain();
    };

    const createCryptSound = (ctx: AudioContext) => {
      // Create low frequency drone for crypt atmosphere
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 60 + Math.random() * 40;
      
      gainNode.gain.value = 0.05;
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start();
      
      // Add subtle frequency modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      
      lfo.type = 'sine';
      lfo.frequency.value = 0.1;
      lfoGain.gain.value = 5;
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      lfo.start();
      
      // Clean up when ambient noise changes
      const cleanup = () => {
        oscillator.stop();
        lfo.stop();
      };
      
      return cleanup;
    };

    // Start ambient sound after a short delay
    const timeout = setTimeout(createAmbientSound, 500);

    return () => {
      clearTimeout(timeout);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [ambientNoise]);

  return { ambientNoise };
}