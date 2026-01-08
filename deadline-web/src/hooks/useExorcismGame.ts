import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomBossSentence } from '@/data/horrorWords';

type GameState = 'IDLE' | 'PLAYING' | 'GAME_OVER';

interface ActiveEntity {
  id: string;
  phrase: string;
  typedPhrase: string;
  position: number; // 0-100, where 100 is the player
  speed: number;
  isBoss: boolean;
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

const BOSS_SPAWN_INTERVAL = 15; // Boss spawns every 15 kills
const BOSS_SPEED_MULTIPLIER = 0.6; // Bosses move 40% slower
const BOSS_SANITY_DAMAGE = 30; // Bosses deal more damage
const REGULAR_SANITY_DAMAGE = 20;
const BOSS_POINTS_MULTIPLIER = 3; // Bosses give 3x points
const BOSS_MANA_BONUS = 25; // Bonus mana for defeating a boss

export function useExorcismGame() {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [playerSanity, setPlayerSanity] = useState(100);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [killCount, setKillCount] = useState(0);
  const [mana, setMana] = useState(0);
  const [activeEntity, setActiveEntity] = useState<ActiveEntity | null>(null);
  const [isBossActive, setIsBossActive] = useState(false);
  const [streak, setStreak] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Calculate speed based on wave
  const getSpeedForWave = (waveNum: number): number => {
    return 0.5 + (waveNum * 0.2); // Increases by 0.2 per wave
  };

  // Check if next spawn should be a boss
  const shouldSpawnBoss = useCallback(() => {
    return killCount > 0 && killCount % BOSS_SPAWN_INTERVAL === 0;
  }, [killCount]);

  // Spawn a new entity
  const spawnEntity = useCallback(() => {
    const isBoss = shouldSpawnBoss();
    const phrase = isBoss 
      ? getRandomBossSentence().toUpperCase()
      : EXORCISM_PHRASES[Math.floor(Math.random() * EXORCISM_PHRASES.length)];
    
    const baseSpeed = getSpeedForWave(wave);
    const speed = isBoss ? baseSpeed * BOSS_SPEED_MULTIPLIER : baseSpeed;
    
    const newEntity: ActiveEntity = {
      id: crypto.randomUUID(),
      phrase,
      typedPhrase: '',
      position: 0,
      speed,
      isBoss,
    };
    
    setActiveEntity(newEntity);
    setIsBossActive(isBoss);
  }, [wave, shouldSpawnBoss]);

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
          // Reduce sanity based on entity type
          const damage = current.isBoss ? BOSS_SANITY_DAMAGE : REGULAR_SANITY_DAMAGE;
          setPlayerSanity((prev) => {
            const newSanity = Math.max(0, prev - damage);
            if (newSanity <= 0) {
              setGameState('GAME_OVER');
            }
            return newSanity;
          });
          
          // Clear entity and boss flag
          setIsBossActive(false);
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
    setKillCount(0);
    setMana(0);
    setStreak(0);
    setActiveEntity(null);
    setIsBossActive(false);
    lastTickRef.current = Date.now();
  }, []);

  // Handle typing
  const handleTyping = useCallback((char: string) => {
    if (gameState !== 'PLAYING' || !activeEntity) return;

    let nextChar = activeEntity.phrase[activeEntity.typedPhrase.length];
    
    // Auto-skip spaces - if next character is a space, advance automatically
    let newTypedPhrase = activeEntity.typedPhrase;
    while (nextChar === ' ') {
      newTypedPhrase = newTypedPhrase + ' ';
      nextChar = activeEntity.phrase[newTypedPhrase.length];
    }
    
    // Check if character matches (case-insensitive)
    if (char.toUpperCase() === nextChar) {
      newTypedPhrase = newTypedPhrase + nextChar;
      
      // Play typing sound
      // Audio removed with Verbum Dei
      
      // Increment streak on correct character
      setStreak((prev) => prev + 1);
      
      // Check if phrase is complete
      if (newTypedPhrase === activeEntity.phrase) {
        // Success! Banish the entity
        // Audio removed with Verbum Dei
        
        const basePoints = activeEntity.phrase.length * 10;
        const points = activeEntity.isBoss ? basePoints * BOSS_POINTS_MULTIPLIER : basePoints;
        setScore((prev) => prev + points);
        
        // Increment kill count
        setKillCount((prev) => prev + 1);
        
        // Award mana
        const manaGain = activeEntity.isBoss 
          ? BOSS_MANA_BONUS 
          : Math.floor(activeEntity.phrase.length / 3);
        setMana((prev) => Math.min(100, prev + manaGain));
        
        // Check if wave should increase (every 5 entities)
        if ((score + points) % 500 === 0) {
          setWave((prev) => prev + 1);
        }
        
        // Clear entity and boss flag
        setActiveEntity(null);
        setIsBossActive(false);
      } else {
        // Update typed phrase
        setActiveEntity({
          ...activeEntity,
          typedPhrase: newTypedPhrase,
        });
      }
    } else {
      // Wrong character - play damage sound
      // Audio removed with Verbum Dei
      
      // Reset streak, reset progress on boss, small sanity penalty
      setStreak(0);
      if (activeEntity.isBoss) {
        setActiveEntity({
          ...activeEntity,
          typedPhrase: '',
        });
      }
      setPlayerSanity((prev) => Math.max(0, prev - 2));
    }
  }, [gameState, activeEntity, score]);

  return {
    gameState,
    playerSanity,
    score,
    wave,
    killCount,
    mana,
    streak,
    activeEntity,
    isBossActive,
    startGame,
    handleTyping,
  };
}
