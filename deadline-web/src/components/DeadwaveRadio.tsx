import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useRadioSignal } from '@/hooks/useRadioSignal';
import { radioAudio } from '@/lib/audio/RadioAudio';
import { DeadwaveDisplay } from '@/components/DeadwaveDisplay';
import { RADIO_FRAGMENTS } from '@/data/radioFragments';

export function DeadwaveRadio() {
  const {
    frequency,
    targetFreq,
    signalStrength,
    lockProgress,
    isLocked,
    currentFragment,
    setFrequency,
    nextFragment,
    minFreq,
    maxFreq,
  } = useRadioSignal();

  const [isStarted, setIsStarted] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  // Initialize audio on start
  const handleStart = () => {
    radioAudio.initialize();
    setAnalyser(radioAudio.getAnalyser());
    setIsStarted(true);
  };

  // Update audio based on frequency and signal
  useEffect(() => {
    if (!isStarted) return;
    radioAudio.updateFrequency(frequency);
  }, [frequency, isStarted]);

  useEffect(() => {
    if (!isStarted) return;
    radioAudio.updateSignalStrength(signalStrength);
  }, [signalStrength, isStarted]);

  // Handle lock completion
  useEffect(() => {
    if (isLocked) {
      radioAudio.flashLock();
      
      // Wait 5 seconds, then transition to next fragment
      setTimeout(() => {
        setShowTransition(true);
        setTimeout(() => {
          nextFragment();
          setShowTransition(false);
        }, 1000);
      }, 5000);
    }
  }, [isLocked, nextFragment]);

  // Cleanup
  useEffect(() => {
    return () => {
      radioAudio.stop();
    };
  }, []);

  const currentText = RADIO_FRAGMENTS[currentFragment % RADIO_FRAGMENTS.length];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* CRT Monitor Effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #000000 100%)',
        }}
      >
        {!isStarted ? (
          /* Start Screen */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 p-8">
            <Icon icon="solar:radio-bold" className="size-32 text-green-500 animate-pulse" />
            <h1 className="text-6xl font-['Playfair_Display'] text-green-500 uppercase tracking-wider">
              Deadwave Radio
            </h1>
            <p className="text-xl text-green-400 max-w-2xl font-mono">
              Tune the frequency. Find the signal. Intercept the messages from beyond.
            </p>
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-bold text-lg rounded transition-all duration-300 shadow-lg shadow-green-500/50"
            >
              POWER ON
            </button>
            <Link
              to="/hub"
              className="text-green-600 hover:text-green-400 transition-colors text-sm"
            >
              ← Back to Hub
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-sm flex items-center px-5 gap-4 z-50 border-b border-green-900/30">
              <Link
                to="/hub"
                className="flex items-center gap-2 text-green-600 hover:text-green-400 transition-colors px-3 py-2"
              >
                <Icon icon="solar:arrow-left-bold" className="size-5" />
                <span className="text-sm">Hub</span>
              </Link>

              <div className="flex items-center gap-3">
                <Icon icon="solar:radio-bold" className="size-6 text-green-500" />
                <h1 className="font-mono text-lg text-green-500 uppercase tracking-wider">
                  Deadwave Radio
                </h1>
              </div>

              <div className="flex-1" />

              {/* Signal Strength Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600 font-mono">SIGNAL</span>
                <div className="w-32 h-2 bg-black border border-green-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ 
                      width: `${signalStrength * 100}%`,
                      boxShadow: signalStrength > 0.5 ? '0 0 10px rgba(34, 197, 94, 0.8)' : 'none',
                    }}
                  />
                </div>
                <span className="text-xs text-green-500 font-mono w-12">
                  {Math.round(signalStrength * 100)}%
                </span>
              </div>
            </div>

            {/* Main Display */}
            <div className="absolute inset-0 pt-16 pb-32">
              <DeadwaveDisplay 
                text={currentText}
                signalStrength={signalStrength}
                isLocked={isLocked}
                analyser={analyser}
              />
            </div>

            {/* Tuner UI */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-zinc-950/90 backdrop-blur-sm border-t border-green-900/30 p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Frequency Display */}
                <div className="flex items-center justify-between">
                  <div 
                    className={`font-mono text-3xl tabular-nums transition-all duration-300 ${
                      signalStrength > 0.95 
                        ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' 
                        : 'text-green-500'
                    }`}
                  >
                    {frequency.toFixed(2)} MHz
                  </div>
                  
                  {/* Lock Progress */}
                  {signalStrength > 0.9 && !isLocked && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-mono animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        HOLD THIS!
                      </span>
                      <div className="w-24 h-2 bg-black border border-white rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-100"
                          style={{ 
                            width: `${lockProgress}%`,
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {isLocked && (
                    <div className="text-white font-mono text-sm animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                      ✓ LOCKED
                    </div>
                  )}
                </div>

                {/* Frequency Slider */}
                <div className="relative">
                  {/* Glow effect when near lock */}
                  {signalStrength > 0.95 && !isLocked && (
                    <div 
                      className="absolute inset-0 rounded-lg animate-pulse pointer-events-none"
                      style={{
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.6), 0 0 40px rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  )}
                  
                  <input
                    type="range"
                    min={minFreq}
                    max={maxFreq}
                    step={0.01}
                    value={frequency}
                    onChange={(e) => setFrequency(parseFloat(e.target.value))}
                    disabled={isLocked}
                    className={`w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed transition-all duration-300 ${
                      signalStrength > 0.95 ? 'ring-2 ring-white ring-opacity-50' : ''
                    }`}
                    style={{
                      background: signalStrength > 0.95 
                        ? `linear-gradient(to right, #ffffff 0%, #ffffff ${((frequency - minFreq) / (maxFreq - minFreq)) * 100}%, #18181b ${((frequency - minFreq) / (maxFreq - minFreq)) * 100}%, #18181b 100%)`
                        : `linear-gradient(to right, #166534 0%, #16a34a ${((frequency - minFreq) / (maxFreq - minFreq)) * 100}%, #18181b ${((frequency - minFreq) / (maxFreq - minFreq)) * 100}%, #18181b 100%)`,
                    }}
                  />
                  
                  {/* Frequency markers */}
                  <div className="flex justify-between mt-1 text-xs text-green-900 font-mono">
                    <span>{minFreq}</span>
                    <span>98.0</span>
                    <span>{maxFreq}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transition Effect */}
            {showTransition && (
              <div className="absolute inset-0 bg-black z-40 animate-in fade-in duration-1000" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
