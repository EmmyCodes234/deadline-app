import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { type ReaperStatus } from './useReaper';

const HEARTBEAT_URL = 'https://assets.mixkit.co/active_storage/sfx/2111/2111-preview.mp3';
const STATIC_URL = 'https://assets.mixkit.co/active_storage/sfx/2022/2022-preview.mp3';
const KEYSTROKE_URL = 'https://assets.mixkit.co/active_storage/sfx/2366/2366-preview.mp3';
const DING_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
const SHORT_GLITCH_URL = 'https://assets.mixkit.co/active_storage/sfx/2067/2067-preview.mp3';

// Whisper audio URLs - using eerie whisper/breath sounds
const WHISPER_URLS = [
  'https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3', // Eerie whisper 1
  'https://assets.mixkit.co/active_storage/sfx/2488/2488-preview.mp3', // Eerie whisper 2
  'https://assets.mixkit.co/active_storage/sfx/2489/2489-preview.mp3', // Eerie whisper 3
  'https://assets.mixkit.co/active_storage/sfx/2490/2490-preview.mp3', // Eerie whisper 4
];

// Atmosphere sounds for Exorcist game - Thinning Veil effect
const BREATHING_URL = 'https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3'; // Heavy breathing
const FRANTIC_WHISPERS_URL = 'https://assets.mixkit.co/active_storage/sfx/2488/2488-preview.mp3'; // Frantic whispers

export function useAudio(status: ReaperStatus, wordCount: number) {
  const heartbeatRef = useRef<Howl | null>(null);
  const staticRef = useRef<Howl | null>(null);
  const keystrokeRef = useRef<Howl | null>(null);
  const dingRef = useRef<Howl | null>(null);
  const glitchRef = useRef<Howl | null>(null);
  const whisperSoundsRef = useRef<Howl[]>([]);
  const atmosphereSoundsRef = useRef<Map<string, Howl>>(new Map());
  const lastDingWordCountRef = useRef<number>(0);

  // Initialize audio on mount
  useEffect(() => {
    heartbeatRef.current = new Howl({
      src: [HEARTBEAT_URL],
      loop: true,
      volume: 0,
    });

    staticRef.current = new Howl({
      src: [STATIC_URL],
      loop: true,
      volume: 0,
    });

    keystrokeRef.current = new Howl({
      src: [KEYSTROKE_URL],
      volume: 0.3,
      rate: 1.0,
    });

    dingRef.current = new Howl({
      src: [DING_URL],
      volume: 0.5,
    });

    glitchRef.current = new Howl({
      src: [SHORT_GLITCH_URL],
      volume: 0.7,
    });

    // Initialize whisper sounds
    whisperSoundsRef.current = WHISPER_URLS.map(url => new Howl({
      src: [url],
      volume: 0.15, // Low volume for subtlety
      rate: 0.8, // Slightly slower for creepiness
    }));

    // Initialize atmosphere sounds for Exorcist game
    atmosphereSoundsRef.current.set('BREATHING', new Howl({
      src: [BREATHING_URL],
      loop: true,
      volume: 0,
    }));

    atmosphereSoundsRef.current.set('WHISPERS', new Howl({
      src: [FRANTIC_WHISPERS_URL],
      loop: true,
      volume: 0,
    }));

    // Start playing looping sounds (at 0 volume initially)
    heartbeatRef.current.play();
    staticRef.current.play();

    // Cleanup on unmount
    return () => {
      heartbeatRef.current?.stop();
      heartbeatRef.current?.unload();
      staticRef.current?.stop();
      staticRef.current?.unload();
      keystrokeRef.current?.unload();
      dingRef.current?.unload();
      glitchRef.current?.unload();
      whisperSoundsRef.current.forEach(whisper => whisper.unload());
      atmosphereSoundsRef.current.forEach(sound => {
        sound.stop();
        sound.unload();
      });
    };
  }, []);

  // React to status changes
  useEffect(() => {
    const heartbeat = heartbeatRef.current;
    const static_ = staticRef.current;

    if (!heartbeat || !static_) return;

    switch (status) {
      case 'SAFE':
        // Fade all sounds to 0
        heartbeat.fade(heartbeat.volume(), 0, 1000);
        heartbeat.rate(1.0);
        static_.fade(static_.volume(), 0, 1000);
        break;

      case 'WARNING':
        // Fade heartbeat to 0.3 volume, rate 1.0
        heartbeat.fade(heartbeat.volume(), 0.3, 1000);
        heartbeat.rate(1.0);
        static_.fade(static_.volume(), 0, 1000);
        break;

      case 'CRITICAL':
        // Fade heartbeat to 0.8 volume, rate 1.5 (fast)
        heartbeat.fade(heartbeat.volume(), 0.8, 500);
        heartbeat.rate(1.5);
        // Fade static noise to 0.2
        static_.fade(static_.volume(), 0.2, 500);
        break;

      case 'DEAD':
        // Stop heartbeat immediately
        heartbeat.stop();
        // Play static noise at 0.5 volume
        static_.fade(static_.volume(), 0.5, 300);
        break;

      case 'MOCKERY':
        // Brief jarring sound effect - spike static
        static_.fade(static_.volume(), 0.6, 100);
        heartbeat.rate(0.5); // Slow down heartbeat
        break;
    }
  }, [status]);

  // Play keystroke sound with dynamic pitch based on status
  const playKeystroke = useCallback(() => {
    const keystroke = keystrokeRef.current;
    if (!keystroke) return;

    // Set rate based on status
    if (status === 'SAFE' || status === 'WARNING') {
      keystroke.rate(1.0);
    } else if (status === 'CRITICAL' || status === 'DEAD') {
      keystroke.rate(0.8); // Slow/demonic
    } else if (status === 'MOCKERY') {
      keystroke.rate(1.5); // Fast/frantic
    }

    keystroke.play();
  }, [status]);

  // Play ding every 100 words
  useEffect(() => {
    const ding = dingRef.current;
    if (!ding) return;

    const currentMilestone = Math.floor(wordCount / 100);
    const lastMilestone = Math.floor(lastDingWordCountRef.current / 100);

    if (currentMilestone > lastMilestone && wordCount > 0) {
      ding.play();
    }

    lastDingWordCountRef.current = wordCount;
  }, [wordCount]);

  // Play glitch sound for poltergeist sabotage
  const playGlitchSound = useCallback(() => {
    const glitch = glitchRef.current;
    if (!glitch) return;
    glitch.play();
  }, []);

  // Play spatial whisper - 3D audio effect
  const playSpatialWhisper = useCallback(() => {
    const whispers = whisperSoundsRef.current;
    if (!whispers || whispers.length === 0) return;

    // Pick a random whisper
    const randomWhisper = whispers[Math.floor(Math.random() * whispers.length)];
    
    // Random stereo panning (-1 = left, 1 = right)
    const panValue = Math.random() > 0.5 ? Math.random() * 0.8 + 0.2 : -(Math.random() * 0.8 + 0.2);
    
    // Apply stereo positioning
    randomWhisper.stereo(panValue);
    
    // Randomize volume slightly for variation
    const volumeVariation = 0.1 + Math.random() * 0.15; // 0.1 to 0.25
    randomWhisper.volume(volumeVariation);
    
    // Play the whisper
    randomWhisper.play();
  }, []);

  // Atmosphere sound controls for Exorcist game - Thinning Veil effect
  const playAtmosphere = useCallback((soundId: string) => {
    const sound = atmosphereSoundsRef.current.get(soundId);
    if (sound && !sound.playing()) {
      sound.play();
    }
  }, []);

  const setAtmosphereVolume = useCallback((soundId: string, volume: number) => {
    const sound = atmosphereSoundsRef.current.get(soundId);
    if (sound) {
      sound.volume(Math.max(0, Math.min(1, volume))); // Clamp between 0 and 1
    }
  }, []);

  const stopAtmosphere = useCallback((soundId: string) => {
    const sound = atmosphereSoundsRef.current.get(soundId);
    if (sound) {
      sound.stop();
    }
  }, []);

  return { 
    playKeystroke, 
    playGlitchSound, 
    playSpatialWhisper,
    playAtmosphere,
    setAtmosphereVolume,
    stopAtmosphere,
  };
}
