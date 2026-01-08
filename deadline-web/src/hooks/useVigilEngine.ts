import { useState, useEffect, useCallback, useRef } from 'react';
import { vigilAudio } from '@/lib/audio/VigilAudio';

interface TimelineEvent {
  at: number; // seconds
  action: 'footsteps' | 'breathing' | 'knock' | 'screech' | 'whisper';
  executed?: boolean;
}

type GameStatus = 'idle' | 'active' | 'won' | 'lost';

const GAME_DURATION = 60; // seconds
const BLINK_BLUR_TIME = 10; // seconds until forced blink
const SANITY_DECAY_RATE = 0.5; // per second when moving/loud
const MOUSE_VELOCITY_THRESHOLD = 5; // pixels per frame
const AUDIO_THRESHOLD = 0.1; // microphone volume threshold (0-1)

// Scripted timeline of horror events
const TIMELINE: TimelineEvent[] = [
  { at: 5, action: 'footsteps' },
  { at: 12, action: 'breathing' },
  { at: 18, action: 'knock' },
  { at: 25, action: 'whisper' },
  { at: 32, action: 'footsteps' },
  { at: 38, action: 'screech' },
  { at: 45, action: 'breathing' },
  { at: 50, action: 'knock' },
  { at: 55, action: 'whisper' },
];

export function useVigilEngine() {
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [time, setTime] = useState(0);
  const [sanity, setSanity] = useState(100);
  const [mouseVelocity, setMouseVelocity] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [blinkBlur, setBlinkBlur] = useState(0); // 0-1, increases over time
  const [isBlinking, setIsBlinking] = useState(false);
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  const gameTimerRef = useRef<number | undefined>(undefined);
  const blinkTimerRef = useRef<number | undefined>(undefined);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const timelineRef = useRef<TimelineEvent[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Request microphone permission
  const requestMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      // Setup audio analysis
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setMicPermission('granted');
    } catch (err) {
      console.error('Microphone access denied:', err);
      setMicPermission('denied');
    }
  }, []);

  // Start game
  const startGame = useCallback(async () => {
    if (micPermission !== 'granted') {
      await requestMicrophone();
      if (micPermission === 'denied') return;
    }

    setGameStatus('active');
    setTime(0);
    setSanity(100);
    setBlinkBlur(0);
    setIsBlinking(false);
    
    // Reset timeline
    timelineRef.current = TIMELINE.map(event => ({ ...event, executed: false }));
    
    vigilAudio.startAmbience();
  }, [micPermission, requestMicrophone]);

  // Monitor microphone level
  useEffect(() => {
    if (gameStatus !== 'active' || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalized = average / 255; // 0-1
      
      setAudioLevel(normalized);
    };

    const interval = setInterval(checkAudioLevel, 100);
    return () => clearInterval(interval);
  }, [gameStatus]);

  // Track mouse velocity
  useEffect(() => {
    if (gameStatus !== 'active') return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - prevMousePosRef.current.x;
      const dy = e.clientY - prevMousePosRef.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      setMouseVelocity(velocity);
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameStatus]);

  // Handle blink mechanic
  useEffect(() => {
    if (gameStatus !== 'active') return;

    const handleMouseDown = () => {
      setIsBlinking(true);
      setBlinkBlur(0); // Reset blur when blinking
      vigilAudio.amplifyAmbience(true);
    };

    const handleMouseUp = () => {
      setIsBlinking(false);
      vigilAudio.amplifyAmbience(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameStatus]);

  // Game timer and blink blur
  useEffect(() => {
    if (gameStatus !== 'active') return;

    gameTimerRef.current = window.setInterval(() => {
      setTime(prev => {
        const newTime = prev + 0.1;
        
        // Check win condition
        if (newTime >= GAME_DURATION) {
          setGameStatus('won');
          vigilAudio.stopAmbience();
          return GAME_DURATION;
        }
        
        return newTime;
      });
    }, 100);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [gameStatus]);

  // Blink blur accumulation
  useEffect(() => {
    if (gameStatus !== 'active' || isBlinking) return;

    blinkTimerRef.current = window.setInterval(() => {
      setBlinkBlur(prev => {
        const newBlur = Math.min(1, prev + (1 / (BLINK_BLUR_TIME * 10)));
        
        // Force game over if blur reaches 100%
        if (newBlur >= 1) {
          setGameStatus('lost');
          vigilAudio.stopAmbience();
          vigilAudio.playScreech(1);
        }
        
        return newBlur;
      });
    }, 100);

    return () => {
      if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
    };
  }, [gameStatus, isBlinking]);

  // Sanity decay based on movement and noise
  useEffect(() => {
    if (gameStatus !== 'active') return;

    const interval = setInterval(() => {
      const isMoving = mouseVelocity > MOUSE_VELOCITY_THRESHOLD;
      const isLoud = audioLevel > AUDIO_THRESHOLD;

      if (isMoving || isLoud) {
        setSanity(prev => {
          const newSanity = Math.max(0, prev - SANITY_DECAY_RATE);
          
          // Trigger screech when sanity drops significantly
          if (newSanity < 30 && prev >= 30) {
            vigilAudio.playScreech(0.7);
          }
          
          // Game over at 0 sanity
          if (newSanity === 0) {
            setGameStatus('lost');
            vigilAudio.stopAmbience();
          }
          
          return newSanity;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameStatus, mouseVelocity, audioLevel]);

  // Execute timeline events
  useEffect(() => {
    if (gameStatus !== 'active') return;

    timelineRef.current.forEach(event => {
      if (!event.executed && time >= event.at) {
        event.executed = true;
        
        switch (event.action) {
          case 'footsteps':
            vigilAudio.playFootsteps();
            break;
          case 'breathing':
            vigilAudio.playBreathing();
            break;
          case 'knock':
            vigilAudio.playKnock();
            break;
          case 'screech':
            vigilAudio.playScreech(0.5);
            break;
          case 'whisper':
            vigilAudio.playWhisper();
            break;
        }
      }
    });
  }, [gameStatus, time]);

  // Cleanup
  useEffect(() => {
    return () => {
      vigilAudio.stopAmbience();
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (blinkTimerRef.current) clearInterval(blinkTimerRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    gameStatus,
    time,
    sanity,
    mouseVelocity,
    audioLevel,
    blinkBlur,
    isBlinking,
    micPermission,
    startGame,
    requestMicrophone,
  };
}
