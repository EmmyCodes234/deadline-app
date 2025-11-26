import { useState, useEffect, useCallback, useRef } from 'react';

type GameState = 'IDLE' | 'PLAYING' | 'GAME_OVER';

interface ActiveEntity {
  id: string;
  phrase: string;
  typedPhrase: string;
  position: number; // 0-100, where 100 is the player
  speed: number;
}

// Latin/spooky phrases for the exorcism
const EXORCISM_PHRASES = [
  'EXORCIZAMUS TE',
  'OMNIS IMMUNDUS SPIRITUS',
  'VADE RETRO SATANA',
  'IN NOMINE PATRIS',
  'APAGE SATANAS',
  'CRUX SACRA SIT MIHI LUX',
  'DRACO MALEDICTE',
  'LIBERA NOS A MALO',
  'SANCTUS MICHAEL',
  'REQUIESCAT IN PACE',
];

export function useExorcismGame() {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [playerSanity, setPlayerSanity] = useState(100);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [activeEntity, setActiveEntity] = useState<ActiveEntity | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Calculate speed based on wave
  const getSpeedForWave = (waveNum: number): number => {
    return 0.5 + (waveNum * 0.2); // Increases by 0.2 per wave
  };

  // Spawn a new entity
  const spawnEntity = useCallback(() => {
    const randomPhrase = EXORCISM_PHRASES[Math.floor(Math.random() * EXORCISM_PHRASES.length)];
    const newEntity: ActiveEntity = {
      id: crypto.randomUUID(),
      phrase: randomPhrase,
      typedPhrase: '',
      position: 0,
      speed: getSpeedForWave(wave),
    };
    setActiveEntity(newEntity);
  }, [wave]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const tick = () => {
      const now = Date.now();
      const deltaTime = now - lastTickRef.current;
      lastTickRef.current = now;

      setActiveEntity((current) => {
        // Spawn new entity if none exists
        if (!current) {
          spawnEntity();
          return null;
        }

        // Move entity closer
        const newPosition = current.position + (current.speed * deltaTime / 100);

        // Collision check - entity reached the player
        if (newPosition >= 100) {
          // Reduce sanity
          setPlayerSanity((prev) => {
            const newSanity = Math.max(0, prev - 20);
            if (newSanity <= 0) {
              setGameState('GAME_OVER');
            }
            return newSanity;
          });
          
          // Clear entity (will spawn new one next tick)
          return null;
        }

        return {
          ...current,
          position: newPosition,
        };
      });

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, spawnEntity]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('PLAYING');
    setPlayerSanity(100);
    setScore(0);
    setWave(1);
    setActiveEntity(null);
    lastTickRef.current = Date.now();
  }, []);

  // Handle typing
  const handleTyping = useCallback((char: string) => {
    if (gameState !== 'PLAYING' || !activeEntity) return;

    const nextChar = activeEntity.phrase[activeEntity.typedPhrase.length];
    
    // Check if character matches (case-insensitive)
    if (char.toUpperCase() === nextChar) {
      const newTypedPhrase = activeEntity.typedPhrase + nextChar;
      
      // Check if phrase is complete
      if (newTypedPhrase === activeEntity.phrase) {
        // Success! Banish the entity
        setScore((prev) => prev + activeEntity.phrase.length * 10);
        
        // Check if wave should increase (every 5 entities)
        if ((score + activeEntity.phrase.length * 10) % 500 === 0) {
          setWave((prev) => prev + 1);
        }
        
        // Clear entity (will spawn new one)
        setActiveEntity(null);
      } else {
        // Update typed phrase
        setActiveEntity({
          ...activeEntity,
          typedPhrase: newTypedPhrase,
        });
      }
    } else {
      // Wrong character - small sanity penalty
      setPlayerSanity((prev) => Math.max(0, prev - 2));
    }
  }, [gameState, activeEntity, score]);

  return {
    gameState,
    playerSanity,
    score,
    wave,
    activeEntity,
    startGame,
    handleTyping,
  };
}
