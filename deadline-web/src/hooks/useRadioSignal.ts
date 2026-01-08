import { useState, useEffect, useRef, useCallback } from 'react';

interface RadioSignalState {
  frequency: number;
  targetFreq: number;
  signalStrength: number;
  lockProgress: number;
  isLocked: boolean;
  currentFragment: number;
}

const MIN_FREQ = 88.0;
const MAX_FREQ = 108.0;
const DRIFT_INTERVAL = 50; // ms
const LOCK_THRESHOLD = 0.95;

export function useRadioSignal() {
  const [state, setState] = useState<RadioSignalState>({
    frequency: 98.0,
    targetFreq: 95.5,
    signalStrength: 0,
    lockProgress: 0,
    isLocked: false,
    currentFragment: 0,
  });

  const driftIntervalRef = useRef<number | undefined>(undefined);
  const lockIntervalRef = useRef<number | undefined>(undefined);

  // Calculate signal strength based on distance from target
  const calculateSignalStrength = useCallback((freq: number, target: number) => {
    const distance = Math.abs(freq - target);
    const maxDistance = 2.0; // Within 2 MHz is considered "in range"
    
    if (distance > maxDistance) return 0;
    
    // Exponential falloff for more dramatic tuning
    const strength = Math.pow(1 - (distance / maxDistance), 3);
    return Math.max(0, Math.min(1, strength));
  }, []);

  // The Drift: Frequency naturally drifts away from target
  useEffect(() => {
    driftIntervalRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.isLocked) return prev;

        const strength = calculateSignalStrength(prev.frequency, prev.targetFreq);
        
        // NEW LOGIC: Scale drift based on signal strength
        // When signal is strong (> 0.9), drift becomes minimal (reward the player)
        // When signal is weak (< 0.5), drift is normal/high
        let driftAmount: number;
        if (strength > 0.9) {
          // Near lock - minimal drift (signal "sticks")
          driftAmount = 0.005;
        } else if (strength > 0.7) {
          // Getting close - reduced drift
          driftAmount = 0.02;
        } else if (strength > 0.5) {
          // Medium signal - moderate drift
          driftAmount = 0.04;
        } else {
          // Weak signal - full drift
          driftAmount = 0.06;
        }
        
        // Drift away from target
        const direction = prev.frequency > prev.targetFreq ? 1 : -1;
        let newFreq = prev.frequency + (direction * driftAmount * (Math.random() * 0.5 + 0.5));
        
        // Clamp to valid range
        newFreq = Math.max(MIN_FREQ, Math.min(MAX_FREQ, newFreq));
        
        const newStrength = calculateSignalStrength(newFreq, prev.targetFreq);
        
        return {
          ...prev,
          frequency: newFreq,
          signalStrength: newStrength,
        };
      });
    }, DRIFT_INTERVAL);

    return () => {
      if (driftIntervalRef.current) {
        clearInterval(driftIntervalRef.current);
      }
    };
  }, [calculateSignalStrength]);

  // The Lock: Build up lock progress when signal is strong
  useEffect(() => {
    lockIntervalRef.current = window.setInterval(() => {
      setState(prev => {
        if (prev.isLocked) return prev;

        if (prev.signalStrength > LOCK_THRESHOLD) {
          const newProgress = Math.min(100, prev.lockProgress + 2);
          
          if (newProgress >= 100) {
            return {
              ...prev,
              lockProgress: 100,
              isLocked: true,
            };
          }
          
          return {
            ...prev,
            lockProgress: newProgress,
          };
        } else {
          // Decay lock progress if signal drops
          return {
            ...prev,
            lockProgress: Math.max(0, prev.lockProgress - 5),
          };
        }
      });
    }, 100);

    return () => {
      if (lockIntervalRef.current) {
        clearInterval(lockIntervalRef.current);
      }
    };
  }, []);

  // Manual frequency adjustment (user dragging slider)
  const setFrequency = useCallback((freq: number) => {
    setState(prev => {
      const clampedFreq = Math.max(MIN_FREQ, Math.min(MAX_FREQ, freq));
      const newStrength = calculateSignalStrength(clampedFreq, prev.targetFreq);
      
      return {
        ...prev,
        frequency: clampedFreq,
        signalStrength: newStrength,
      };
    });
  }, [calculateSignalStrength]);

  // Progress to next fragment
  const nextFragment = useCallback(() => {
    setState(prev => {
      // Generate new random target frequency
      const newTarget = MIN_FREQ + Math.random() * (MAX_FREQ - MIN_FREQ);
      
      return {
        ...prev,
        targetFreq: parseFloat(newTarget.toFixed(2)),
        lockProgress: 0,
        isLocked: false,
        currentFragment: prev.currentFragment + 1,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      frequency: 98.0,
      targetFreq: 95.5,
      signalStrength: 0,
      lockProgress: 0,
      isLocked: false,
      currentFragment: 0,
    });
  }, []);

  return {
    ...state,
    setFrequency,
    nextFragment,
    reset,
    minFreq: MIN_FREQ,
    maxFreq: MAX_FREQ,
  };
}
