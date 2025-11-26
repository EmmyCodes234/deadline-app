import { useState, useEffect, useCallback, useRef } from 'react';
import { type GamePart } from '@/data/gameLevels';

type GameState = 'IDLE' | 'FOCUSING' | 'PLAYING' | 'GAME_OVER' | 'VICTORY';

export type KeystrokeFeedback =
    | { type: 'correctKey'; char: string }
    | { type: 'incorrectKey'; char: string }
    | { type: 'sentenceComplete' }
    | null;

export function useMuseRitual() {
    // Note: Progress tracking is handled in HauntingEditor, not here

    // Game State
    const [gameState, setGameState] = useState<GameState>('IDLE');
    const [patience, setPatience] = useState(100);
    const [patienceCritical, setPatienceCritical] = useState(false);
    const [currentPart, setCurrentPart] = useState<GamePart | null>(null);
    const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [visibleTextLength, setVisibleTextLength] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [startTime, setStartTime] = useState<number | null>(null);
    const [finalWpm, setFinalWpm] = useState(0);
    const [skullsEarned, setSkullsEarned] = useState(0);
    const [lastCorrectKeyTimestamp, setLastCorrectKeyTimestamp] = useState<number>(Date.now());

    // Refs for interval management
    const gameLoopRef = useRef<number | null>(null);
    const lastTickRef = useRef<number>(Date.now());

    // Get current sentence
    const currentSentence = currentPart && sentenceIndex < currentPart.sentences.length
        ? currentPart.sentences[sentenceIndex]
        : '';

    // Patience & Text Reveal Loop with Dynamic Flow-Based Drain
    useEffect(() => {
        if (gameState !== 'PLAYING' || !currentPart) {
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

            // Dynamic patience drain based on flow state
            setPatience((prev) => {
                // Only drain if sentence is not complete
                if (typedText === currentSentence) {
                    return prev;
                }

                // Calculate time since last correct keystroke
                const timeSinceLastType = now - lastCorrectKeyTimestamp;

                // Determine base drain rate
                let baseDrainRate = 0;

                if (timeSinceLastType < 500) {
                    // Player is in "flow" - no drain
                    baseDrainRate = 0;
                } else {
                    // Player is hesitating - apply drain
                    baseDrainRate = 0.3; // Increased from 0.2 to compensate for grace period
                }

                // Apply non-linear multiplier (rubber banding)
                let drainMultiplier = 1.0;
                if (baseDrainRate > 0) {
                    if (prev > 75) {
                        // High patience - drain slower (easier at start)
                        drainMultiplier = 0.7;
                    } else if (prev < 25) {
                        // Low patience - drain faster (more pressure)
                        drainMultiplier = 1.5;
                    }
                }

                // Calculate final drain
                const finalDrain = baseDrainRate * drainMultiplier * (deltaTime / 100);
                const newPatience = prev - finalDrain;

                if (newPatience <= 0) {
                    setGameState('GAME_OVER');
                    return 0;
                }

                // Update patience critical state based on threshold
                if (newPatience < 25) {
                    setPatienceCritical(true);
                } else if (newPatience > 30) {
                    setPatienceCritical(false);
                }

                return newPatience;
            });

            // Reveal text progressively
            if (currentSentence && visibleTextLength < currentSentence.length) {
                // Calculate characters to reveal based on baseSpeed
                // baseSpeed is chars/second, so for deltaTime ms: (baseSpeed * deltaTime / 1000)
                const charsToReveal = (currentPart.baseSpeed * deltaTime) / 1000;

                setVisibleTextLength((prev) => {
                    const newLength = Math.min(prev + charsToReveal, currentSentence.length);
                    return newLength;
                });
            }

            gameLoopRef.current = requestAnimationFrame(tick);
        };

        gameLoopRef.current = requestAnimationFrame(tick);

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [gameState, currentPart, currentSentence, visibleTextLength, typedText, lastCorrectKeyTimestamp]);

    // Start a new part with focusing sequence
    const startPart = useCallback((part: GamePart, levelId: number) => {
        const now = Date.now();
        setGameState('FOCUSING');
        setPatience(100);
        setCurrentPart(part);
        setCurrentLevelId(levelId);
        setSentenceIndex(0);
        setVisibleTextLength(0);
        setTypedText('');
        setStartTime(now);
        setFinalWpm(0);
        setSkullsEarned(0);
        setLastCorrectKeyTimestamp(now);
        lastTickRef.current = now;

        // Transition to PLAYING after 2 seconds
        setTimeout(() => {
            setGameState('PLAYING');
            setStartTime(Date.now()); // Reset start time after focusing
            setLastCorrectKeyTimestamp(Date.now());
            lastTickRef.current = Date.now();
        }, 2000);
    }, []);

    // Handle typing input with flow tracking and error penalties
    const handleTyping = useCallback((char: string): KeystrokeFeedback => {
        if (gameState !== 'PLAYING' || !currentPart || !currentSentence) return null;

        // Check if character matches the next required character
        const nextChar = currentSentence[typedText.length];

        if (char === nextChar) {
            // Correct keystroke - update flow timestamp
            setLastCorrectKeyTimestamp(Date.now());

            const newTypedText = typedText + char;
            setTypedText(newTypedText);

            // Check if sentence is complete
            if (newTypedText === currentSentence) {
                // Boost patience for completing a sentence
                setPatience((prev) => Math.min(prev + 20, 100));

                // Move to next sentence
                const nextIndex = sentenceIndex + 1;

                if (nextIndex >= currentPart.sentences.length) {
                    // Part complete! Calculate results
                    const endTime = Date.now();
                    const timeInMinutes = (endTime - (startTime || endTime)) / 60000;

                    // Calculate total words typed
                    const totalWords = currentPart.sentences.reduce((sum, sentence) => {
                        return sum + sentence.split(/\s+/).filter(w => w.length > 0).length;
                    }, 0);

                    const wpm = Math.round(totalWords / timeInMinutes);
                    setFinalWpm(wpm);

                    // Determine skulls earned based on WPM
                    let skulls = 0;
                    if (wpm >= currentPart.skullCriteria.threeSkullWpm) {
                        skulls = 3;
                    } else if (wpm >= currentPart.skullCriteria.twoSkullWpm) {
                        skulls = 2;
                    } else if (wpm >= currentPart.skullCriteria.oneSkullWpm) {
                        skulls = 1;
                    }
                    setSkullsEarned(skulls);

                    // Note: Progress is saved in HauntingEditor's useEffect when VICTORY state is detected

                    setGameState('VICTORY');
                } else {
                    // Move to next sentence
                    setSentenceIndex(nextIndex);
                    setTypedText('');
                    setVisibleTextLength(0);
                }

                // Return sentence complete feedback
                return { type: 'sentenceComplete' };
            }

            // Return correct key feedback
            return { type: 'correctKey', char };
        } else {
            // Incorrect keystroke - apply immediate penalty (the "stumble tax")
            setPatience((prev) => Math.max(0, prev - 3));

            // Return incorrect key feedback
            return { type: 'incorrectKey', char };
        }
    }, [gameState, currentPart, currentSentence, typedText, sentenceIndex, startTime, currentLevelId]);

    // Reset game to idle
    const resetGame = useCallback(() => {
        setGameState('IDLE');
        setPatience(100);
        setPatienceCritical(false);
        setCurrentPart(null);
        setCurrentLevelId(null);
        setSentenceIndex(0);
        setVisibleTextLength(0);
        setTypedText('');
        setStartTime(null);
        setFinalWpm(0);
        setSkullsEarned(0);
        setLastCorrectKeyTimestamp(Date.now());
    }, []);

    return {
        // State
        gameState,
        patience,
        patienceCritical,
        currentPart,
        currentLevelId,
        sentenceIndex,
        currentSentence,
        visibleTextLength,
        typedText,
        finalWpm,
        skullsEarned,

        // Functions
        startPart,
        handleTyping,
        resetGame,
    };
}
