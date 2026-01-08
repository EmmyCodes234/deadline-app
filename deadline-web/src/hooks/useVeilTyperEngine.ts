import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomWord, getRandomBossSentence } from '@/data/horrorWords';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export interface Ghost {
  id: string;
  word: string;
  position: [number, number, number];
  speed: number;
  isBoss: boolean;
  typedProgress: number;
}

type GameState = 'idle' | 'playing' | 'won' | 'lost';

export function useVeilTyperEngine() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [typedBuffer, setTypedBuffer] = useState('');
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [comboStreak, setComboStreak] = useState(0);
  const [mana, setMana] = useState(0);
  const [killCount, setKillCount] = useState(0);
  const [multiplier, setMultiplier] = useState(1);

  const gameLoopRef = useRef<number | undefined>(undefined);
  const spawnTimerRef = useRef<number | undefined>(undefined);
  const lastSpawnTimeRef = useRef(0);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setTypedBuffer('');
    setGhosts([]);
    setComboStreak(0);
    setMana(0);
    setKillCount(0);
    setMultiplier(1);
    lastSpawnTimeRef.current = Date.now();
    horrorAudio.playClick?.();
  }, []);

  // Spawn ghost
  const spawnGhost = useCallback((isBoss = false) => {
    const id = `ghost-${Date.now()}-${Math.random()}`;
    const word = isBoss ? getRandomBossSentence() : getRandomWord();
    const x = (Math.random() - 0.5) * 15;
    const y = (Math.random() - 0.5) * 8 + 2;
    const z = -25;
    const speed = isBoss ? 0.015 : 0.02 + Math.random() * 0.01;

    const newGhost: Ghost = {
      id,
      word,
      position: [x, y, z],
      speed,
      isBoss,
      typedProgress: 0,
    };

    setGhosts(prev => [...prev, newGhost]);
  }, []);

  // Game loop - move ghosts
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setGhosts(prev => {
        const updated = prev.map(ghost => {
          const [x, y, z] = ghost.position;
          
          // Move forward
          let newZ = z + ghost.speed;
          
          // Wobble effect
          const time = Date.now() / 1000;
          const wobbleX = x + Math.sin(time * 2 + parseFloat(ghost.id.slice(-5))) * 0.3;
          const wobbleY = y + Math.cos(time * 1.5 + parseFloat(ghost.id.slice(-5))) * 0.2;
          
          // Check if reached player
          if (newZ > -2) {
            // GAME OVER
            setGameState('lost');
            horrorAudio.playHover?.(); // Use available sound
            return null;
          }
          
          return {
            ...ghost,
            position: [wobbleX, wobbleY, newZ] as [number, number, number],
          };
        }).filter(Boolean) as Ghost[];
        
        return updated;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);

  // Spawn timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = () => {
      const now = Date.now();
      const elapsed = (now - lastSpawnTimeRef.current) / 1000;
      
      // Check for boss spawn
      if (killCount > 0 && killCount % 15 === 0 && ghosts.length === 0) {
        spawnGhost(true);
        lastSpawnTimeRef.current = now;
        return;
      }
      
      // Regular spawn rate increases over time
      const baseRate = 2000;
      const speedup = Math.max(500, baseRate - (elapsed * 50));
      
      if (now - lastSpawnTimeRef.current > speedup && ghosts.length < 8) {
        spawnGhost(false);
        lastSpawnTimeRef.current = now;
      }
      
      spawnTimerRef.current = window.setTimeout(spawnInterval, 100);
    };

    spawnTimerRef.current = window.setTimeout(spawnInterval, 1000);

    return () => {
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current);
      }
    };
  }, [gameState, killCount, ghosts.length, spawnGhost]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('won');
          horrorAudio.playClick?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Typing handler
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore special keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      
      const key = e.key.toLowerCase();
      
      // Handle backspace
      if (key === 'backspace') {
        setTypedBuffer(prev => prev.slice(0, -1));
        return;
      }
      
      // Only accept letters and spaces
      if (!/^[a-z ]$/.test(key)) return;
      
      const newBuffer = typedBuffer + key;
      setTypedBuffer(newBuffer);
      
      // Check for EXORCISE ultimate
      if (newBuffer.toLowerCase() === 'exorcise' && mana >= 100) {
        // ULTIMATE ABILITY
        setGhosts([]);
        setMana(0);
        setScore(prev => prev + ghosts.length * 500);
        setTypedBuffer('');
        horrorAudio.playClick?.();
        return;
      }
      
      // Find matching ghost
      const matchingGhost = ghosts
        .filter(g => g.word.toLowerCase().startsWith(newBuffer.toLowerCase()))
        .sort((a, b) => b.position[2] - a.position[2])[0]; // Closest first
      
      if (matchingGhost) {
        // Update progress
        setGhosts(prev => prev.map(g => 
          g.id === matchingGhost.id 
            ? { ...g, typedProgress: newBuffer.length }
            : g
        ));
        
        // Check if word complete
        if (newBuffer.toLowerCase() === matchingGhost.word.toLowerCase()) {
          // KILL GHOST
          setGhosts(prev => prev.filter(g => g.id !== matchingGhost.id));
          
          const points = matchingGhost.isBoss ? 1000 : 100;
          const newMultiplier = Math.min(10, Math.floor(comboStreak / 5) + 1);
          
          setScore(prev => prev + points * newMultiplier);
          setComboStreak(prev => prev + 1);
          setMana(prev => Math.min(100, prev + (matchingGhost.isBoss ? 50 : 10)));
          setKillCount(prev => prev + 1);
          setMultiplier(newMultiplier);
          setTypedBuffer('');
          
          horrorAudio.playClick?.();
        }
      } else {
        // TYPO - reset
        setTypedBuffer('');
        setComboStreak(0);
        setMultiplier(1);
        horrorAudio.playHover?.(); // Error sound
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, typedBuffer, ghosts, comboStreak, mana]);

  return {
    gameState,
    score,
    timeLeft,
    typedBuffer,
    ghosts,
    comboStreak,
    mana,
    multiplier,
    killCount,
    startGame,
  };
}
