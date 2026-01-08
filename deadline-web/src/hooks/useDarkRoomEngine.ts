import { useState, useEffect, useCallback, useRef } from 'react';
import { darkRoomAudio } from '@/lib/audio/DarkRoomAudio';

interface Word {
  id: string;
  text: string;
  type: 'target' | 'decoy';
  x: number; // 0-90 (percentage)
  y: number; // 0-90 (percentage)
  isFound: boolean;
  isHovered: boolean;
  isVisible: boolean;
  isUnstable: boolean; // Jittering when first found
  isLocked: boolean; // Ready to type after stabilization
  hoverDuration: number; // Time hovered in ms
  jitterX: number; // Random jitter offset
  jitterY: number; // Random jitter offset
  phosphorDecay: number; // Lingering visibility after flashlight passes (0-1)
  sonarRevealed: boolean; // Revealed by sonar ping
}

interface SonarRipple {
  id: number;
  x: number;
  y: number;
  startTime: number;
}

interface MousePos {
  x: number;
  y: number;
}

type GameState = 'idle' | 'playing' | 'won' | 'lost';

const THEMES = {
  DEATH: ['grave', 'coffin', 'corpse', 'funeral', 'tomb', 'skeleton', 'decay', 'rot'],
  COSMIC: ['void', 'stars', 'abyss', 'infinite', 'cosmos', 'nebula', 'galaxy', 'universe'],
  MADNESS: ['insane', 'chaos', 'twisted', 'broken', 'shattered', 'fractured', 'deranged', 'lunacy'],
  OCCULT: ['ritual', 'curse', 'hex', 'spell', 'rune', 'sigil', 'altar', 'sacrifice'],
};

const FLASHLIGHT_RADIUS = 250; // pixels - increased for better visibility
const FLASHLIGHT_RADIUS_MOVING = 125; // pixels when moving fast
const HOVER_RADIUS = 120; // pixels - magnetic locking radius
const BATTERY_DECAY_RATE = 0.1; // per second
const BATTERY_GAIN = 15; // per correct word
const STABILIZATION_TIME = 300; // ms to lock a word
const VELOCITY_THRESHOLD = 15; // pixels per frame to trigger movement penalty
const SONAR_COST = 5; // battery cost for sonar ping
const SONAR_DURATION = 200; // ms sonar reveals words

export function useDarkRoomEngine(difficulty: number = 5, theme: keyof typeof THEMES = 'DEATH') {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [words, setWords] = useState<Word[]>([]);
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
  const [typedBuffer, setTypedBuffer] = useState('');
  const [battery, setBattery] = useState(100);
  const [sanity, setSanity] = useState(3);
  const [foundCount, setFoundCount] = useState(0);
  const [mouseVelocity, setMouseVelocity] = useState(0);
  const [flashlightRadius, setFlashlightRadius] = useState(FLASHLIGHT_RADIUS);
  const [flashlightOpacity, setFlashlightOpacity] = useState(1);
  const [sonarRipples, setSonarRipples] = useState<SonarRipple[]>([]);
  const [magneticTarget, setMagneticTarget] = useState<string | null>(null);

  const batteryDecayRef = useRef<number | undefined>(undefined);
  const geigerTimerRef = useRef<number | undefined>(undefined);
  const prevMousePosRef = useRef<MousePos>({ x: 0, y: 0 });
  const hoverTimersRef = useRef<Map<string, number>>(new Map());
  const sonarIdRef = useRef(0);

  // Generate words based on difficulty and theme
  const generateWords = useCallback(() => {
    const themeWords = THEMES[theme];
    const targetCount = Math.min(3 + Math.floor(difficulty / 3), 6);
    const decoyCount = Math.min(difficulty * 2, 20);

    const newWords: Word[] = [];
    const usedPositions: Array<{ x: number; y: number }> = [];

    // Helper to check if position overlaps
    const isOverlapping = (x: number, y: number) => {
      return usedPositions.some(pos => {
        const dx = Math.abs(pos.x - x);
        const dy = Math.abs(pos.y - y);
        return dx < 15 && dy < 15; // 15% minimum spacing
      });
    };

    // Generate random position
    const getRandomPosition = (): { x: number; y: number } => {
      let attempts = 0;
      while (attempts < 100) {
        const x = Math.random() * 80 + 5; // 5-85%
        const y = Math.random() * 80 + 5;
        if (!isOverlapping(x, y)) {
          usedPositions.push({ x, y });
          return { x, y };
        }
        attempts++;
      }
      // Fallback if no non-overlapping position found
      const x = Math.random() * 80 + 5;
      const y = Math.random() * 80 + 5;
      usedPositions.push({ x, y });
      return { x, y };
    };

    // Add target words
    for (let i = 0; i < targetCount; i++) {
      const pos = getRandomPosition();
      newWords.push({
        id: `target-${i}`,
        text: themeWords[i % themeWords.length],
        type: 'target',
        x: pos.x,
        y: pos.y,
        isFound: false,
        isHovered: false,
        isVisible: false,
        isUnstable: false,
        isLocked: false,
        hoverDuration: 0,
        jitterX: 0,
        jitterY: 0,
        phosphorDecay: 0,
        sonarRevealed: false,
      });
    }

    // Add decoy words
    const decoyWords = ['shadow', 'whisper', 'echo', 'phantom', 'specter', 'wraith', 'gloom', 'dread', 'terror', 'fear', 'doom', 'dark', 'night', 'black', 'void', 'empty', 'lost', 'forgotten', 'cursed', 'damned'];
    for (let i = 0; i < decoyCount; i++) {
      const pos = getRandomPosition();
      newWords.push({
        id: `decoy-${i}`,
        text: decoyWords[i % decoyWords.length],
        type: 'decoy',
        x: pos.x,
        y: pos.y,
        isFound: false,
        isHovered: false,
        isVisible: false,
        isUnstable: false,
        isLocked: false,
        hoverDuration: 0,
        jitterX: 0,
        jitterY: 0,
        phosphorDecay: 0,
        sonarRevealed: false,
      });
    }

    setWords(newWords);
  }, [difficulty, theme]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setBattery(100);
    setSanity(3);
    setFoundCount(0);
    setTypedBuffer('');
    generateWords();
    darkRoomAudio.startAmbience();
  }, [generateWords]);

  // Calculate mouse velocity and update flashlight
  useEffect(() => {
    if (gameState !== 'playing') return;

    const dx = mousePos.x - prevMousePosRef.current.x;
    const dy = mousePos.y - prevMousePosRef.current.y;
    const velocity = Math.sqrt(dx * dx + dy * dy);
    
    setMouseVelocity(velocity);
    prevMousePosRef.current = mousePos;

    // Movement penalty - reduce flashlight when moving fast
    if (velocity > VELOCITY_THRESHOLD) {
      setFlashlightRadius(FLASHLIGHT_RADIUS_MOVING);
      setFlashlightOpacity(0.3 + Math.random() * 0.4); // Flicker
    } else {
      setFlashlightRadius(FLASHLIGHT_RADIUS);
      setFlashlightOpacity(1);
    }
  }, [mousePos, gameState]);

  // Update word visibility and stabilization based on mouse position
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Account for sidebar width (320px = w-80)
    const SIDEBAR_WIDTH = 320;
    const gameAreaWidth = window.innerWidth - SIDEBAR_WIDTH;
    const now = Date.now();

    let closestWordId: string | null = null;
    let closestDistance = Infinity;

    setWords(prev => {
      return prev.map(word => {
        // Calculate distance from mouse to word (in pixels)
        // Words are positioned relative to the game area (not including sidebar)
        const wordX = (word.x / 100) * gameAreaWidth + SIDEBAR_WIDTH;
        const wordY = (word.y / 100) * window.innerHeight;
        const dx = mousePos.x - wordX;
        const dy = mousePos.y - wordY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Track closest word for magnetic locking
        if (!word.isFound && distance < HOVER_RADIUS && distance < closestDistance) {
          closestWordId = word.id;
          closestDistance = distance;
        }

        // Check if word is in active sonar ripple
        let inSonarRange = false;
        for (const ripple of sonarRipples) {
          const rippleAge = now - ripple.startTime;
          const rippleRadius = (rippleAge / SONAR_DURATION) * 500; // Expands to 500px
          const rippleDx = ripple.x - wordX;
          const rippleDy = ripple.y - wordY;
          const rippleDistance = Math.sqrt(rippleDx * rippleDx + rippleDy * rippleDy);
          
          if (Math.abs(rippleDistance - rippleRadius) < 50) { // 50px thick ring
            inSonarRange = true;
            break;
          }
        }

        const isInFlashlight = distance < flashlightRadius && !word.isFound;
        const isVisible = isInFlashlight || inSonarRange;
        const isHovered = distance < HOVER_RADIUS && !word.isFound;

        // Phosphor decay - words linger after flashlight passes
        let newPhosphorDecay = word.phosphorDecay;
        if (isInFlashlight) {
          newPhosphorDecay = 1; // Full brightness
        } else if (word.phosphorDecay > 0) {
          newPhosphorDecay = Math.max(0, word.phosphorDecay - 0.015); // Decay over ~700ms
        }

        // Stabilization logic
        let newHoverDuration = word.hoverDuration;
        let isUnstable = word.isUnstable;
        let isLocked = word.isLocked;
        let jitterX = word.jitterX;
        let jitterY = word.jitterY;

        if (isHovered && isVisible) {
          if (!word.isUnstable) {
            // First time hovering - mark as unstable
            isUnstable = true;
            isLocked = false;
            newHoverDuration = 0;
          }
          
          // Increment hover duration
          newHoverDuration += 16; // ~60fps frame time
          
          if (newHoverDuration >= STABILIZATION_TIME) {
            isLocked = true;
            isUnstable = false;
            jitterX = 0;
            jitterY = 0;
          } else {
            // Jitter while unstable
            jitterX = (Math.random() - 0.5) * 4;
            jitterY = (Math.random() - 0.5) * 4;
          }
        } else {
          // Reset if not hovered
          if (word.isUnstable || word.isLocked) {
            isUnstable = false;
            isLocked = false;
            newHoverDuration = 0;
            jitterX = 0;
            jitterY = 0;
          }
        }

        return {
          ...word,
          isVisible,
          isHovered,
          isUnstable,
          isLocked,
          hoverDuration: newHoverDuration,
          jitterX,
          jitterY,
          phosphorDecay: newPhosphorDecay,
          sonarRevealed: inSonarRange,
        };
      });
    });

    // Update magnetic target
    setMagneticTarget(closestWordId);

    // Geiger counter effect for nearby decoys
    const nearestDecoy = words
      .filter(w => w.type === 'decoy' && !w.isFound)
      .map(word => {
        const wordX = (word.x / 100) * gameAreaWidth + SIDEBAR_WIDTH;
        const wordY = (word.y / 100) * window.innerHeight;
        const dx = mousePos.x - wordX;
        const dy = mousePos.y - wordY;
        return Math.sqrt(dx * dx + dy * dy);
      })
      .sort((a, b) => a - b)[0];

    if (nearestDecoy && nearestDecoy < flashlightRadius * 2) {
      const normalizedDistance = nearestDecoy / (flashlightRadius * 2);
      if (geigerTimerRef.current) clearTimeout(geigerTimerRef.current);
      geigerTimerRef.current = window.setTimeout(() => {
        darkRoomAudio.playGeigerClick(normalizedDistance);
      }, 100 + normalizedDistance * 400); // Faster clicks when closer
    }
  }, [mousePos, gameState, words, flashlightRadius, sonarRipples]);

  // Clean up expired sonar ripples
  useEffect(() => {
    if (sonarRipples.length === 0) return;

    const timer = setInterval(() => {
      const now = Date.now();
      setSonarRipples(prev => prev.filter(ripple => now - ripple.startTime < SONAR_DURATION));
    }, 50);

    return () => clearInterval(timer);
  }, [sonarRipples]);

  // Battery decay
  useEffect(() => {
    if (gameState !== 'playing') return;

    batteryDecayRef.current = window.setInterval(() => {
      setBattery(prev => {
        const newBattery = Math.max(0, prev - BATTERY_DECAY_RATE);
        if (newBattery === 0) {
          setGameState('lost');
          darkRoomAudio.stopAmbience();
          darkRoomAudio.playShatter();
        }
        return newBattery;
      });
    }, 100);

    return () => {
      if (batteryDecayRef.current) clearInterval(batteryDecayRef.current);
    };
  }, [gameState]);

  // Update audio based on battery level
  useEffect(() => {
    if (gameState === 'playing') {
      darkRoomAudio.updateAmbienceForBattery(battery);
    }
  }, [battery, gameState]);

  // Typing handler
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key.toLowerCase();

      if (key === 'backspace') {
        setTypedBuffer(prev => prev.slice(0, -1));
        return;
      }

      if (!/^[a-z]$/.test(key)) return;

      const newBuffer = typedBuffer + key;
      setTypedBuffer(newBuffer);

      // Check for matches with locked words only
      const hoveredWord = words.find(w => w.isHovered && w.isLocked && !w.isFound);
      
      if (hoveredWord && hoveredWord.text.toLowerCase() === newBuffer.toLowerCase()) {
        if (hoveredWord.type === 'target') {
          // SUCCESS
          setWords(prev => prev.map(w => 
            w.id === hoveredWord.id ? { ...w, isFound: true } : w
          ));
          setBattery(prev => Math.min(100, prev + BATTERY_GAIN));
          setFoundCount(prev => prev + 1);
          setTypedBuffer('');
          darkRoomAudio.playSearing();

          // Check win condition
          const remainingTargets = words.filter(w => w.type === 'target' && !w.isFound).length;
          if (remainingTargets === 1) { // This one will be marked found
            setGameState('won');
            darkRoomAudio.stopAmbience();
          }
        } else {
          // FAILURE - hit a decoy
          setSanity(prev => {
            const newSanity = prev - 1;
            if (newSanity === 0) {
              setGameState('lost');
              darkRoomAudio.stopAmbience();
            }
            darkRoomAudio.playShatter();
            return newSanity;
          });
          setTypedBuffer('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, typedBuffer, words]);

  // Mouse tracking and sonar ping
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      if (gameState !== 'playing') return;
      
      // Sonar ping - costs battery
      if (battery >= SONAR_COST) {
        setBattery(prev => Math.max(0, prev - SONAR_COST));
        
        // Create ripple at click position
        const ripple: SonarRipple = {
          id: sonarIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          startTime: Date.now(),
        };
        
        setSonarRipples(prev => [...prev, ripple]);
        darkRoomAudio.playGeigerClick(0.5); // Medium pitch click for sonar
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [gameState, battery]);

  // Cleanup
  useEffect(() => {
    return () => {
      darkRoomAudio.stopAmbience();
      if (batteryDecayRef.current) clearInterval(batteryDecayRef.current);
      if (geigerTimerRef.current) clearTimeout(geigerTimerRef.current);
    };
  }, []);

  return {
    gameState,
    words,
    mousePos,
    typedBuffer,
    battery,
    sanity,
    foundCount,
    targetCount: words.filter(w => w.type === 'target').length,
    theme,
    startGame,
    mouseVelocity,
    flashlightRadius,
    flashlightOpacity,
    sonarRipples,
    magneticTarget,
  };
}
