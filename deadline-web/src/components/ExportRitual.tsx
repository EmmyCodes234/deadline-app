import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface ExportRitualProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export function ExportRitual({ isOpen, onClose, content }: ExportRitualProps) {
  const [ritualState, setRitualState] = useState<'idle' | 'active' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<number | undefined>(undefined);
  const progressIntervalRef = useRef<number | undefined>(undefined);
  const audioCheckIntervalRef = useRef<number | undefined>(undefined);

  // Get last 300 characters
  const excerpt = content.slice(-300);

  // Request microphone permission
  const requestMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

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
  };

  // Monitor audio level
  useEffect(() => {
    if (ritualState !== 'active' || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      const normalized = average / 255;
      
      setAudioLevel(normalized);

      // Check if speaking (volume > 0.1)
      if (normalized > 0.1) {
        // Clear silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = undefined;
        }
      } 
      // Check if silent (volume < 0.05)
      else if (normalized < 0.05) {
        // Start silence timer if not already started
        if (!silenceTimerRef.current) {
          silenceTimerRef.current = window.setTimeout(() => {
            // Failed - silent for > 1.2 seconds
            setRitualState('failed');
            setProgress(0);
            playErrorSound();
            
            // Stop progress
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
          }, 1200);
        }
      }
    };

    audioCheckIntervalRef.current = window.setInterval(checkAudioLevel, 50);

    return () => {
      if (audioCheckIntervalRef.current) {
        clearInterval(audioCheckIntervalRef.current);
      }
    };
  }, [ritualState]);

  // Progress bar logic
  useEffect(() => {
    if (ritualState !== 'active') return;

    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        
        // Success at 100%
        if (newProgress >= 100) {
          setRitualState('success');
          downloadFile();
          
          // Auto-close after 2 seconds
          setTimeout(() => {
            onClose();
            resetRitual();
          }, 2000);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 100); // 10 seconds to complete (100 * 100ms)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [ritualState, onClose]);

  // Play error sound
  const playErrorSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.value = 200;
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  // Download file
  const downloadFile = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `noctuary-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Start ritual
  const startRitual = async () => {
    if (micPermission !== 'granted') {
      await requestMicrophone();
      return;
    }
    
    setRitualState('active');
    setProgress(0);
  };

  // Reset ritual
  const resetRitual = () => {
    setRitualState('idle');
    setProgress(0);
    setAudioLevel(0);
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = undefined;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (audioCheckIntervalRef.current) {
      clearInterval(audioCheckIntervalRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (audioCheckIntervalRef.current) {
        clearInterval(audioCheckIntervalRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="bg-zinc-950 border-2 border-red-900/50 rounded-lg max-w-2xl w-full p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-3xl font-['Playfair_Display'] text-red-500 uppercase tracking-wider">
            The Export Ritual
          </h2>
          <p className="text-sm text-zinc-500 mt-2">
            Speak your words aloud to seal their fate
          </p>
        </div>

        {/* The Test - Last 300 characters */}
        <div className="space-y-3">
          <h3 className="text-sm text-zinc-500 uppercase tracking-wide">Recite These Words:</h3>
          <div 
            className="p-4 bg-zinc-900/50 border border-zinc-800 rounded font-mono text-sm leading-relaxed transition-all duration-300"
            style={{
              color: ritualState === 'active' ? `rgb(${239 - (progress * 1.5)}, ${68 + (progress * 1.8)}, 68)` : '#a3a3a3',
              textShadow: ritualState === 'active' && progress > 50 ? `0 0 ${progress / 10}px rgba(239, 68, 68, 0.8)` : 'none',
            }}
          >
            {excerpt || 'No content to export...'}
          </div>
        </div>

        {/* Progress Bar */}
        {ritualState !== 'idle' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 uppercase">Ritual Progress</span>
              <span className="text-sm text-red-400 font-mono">{progress}%</span>
            </div>
            <div className="w-full h-4 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  boxShadow: progress > 50 ? '0 0 20px rgba(239, 68, 68, 0.8)' : 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Audio Level Indicator */}
        {ritualState === 'active' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500 uppercase">Voice Level</span>
              <span className="text-sm text-zinc-400 font-mono">{Math.round(audioLevel * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-100"
                style={{
                  width: `${audioLevel * 100}%`,
                  backgroundColor: audioLevel > 0.1 ? '#22c55e' : audioLevel > 0.05 ? '#eab308' : '#ef4444',
                }}
              />
            </div>
            {audioLevel < 0.05 && (
              <p className="text-xs text-red-400 animate-pulse">
                ⚠️ Speak louder or the ritual will fail!
              </p>
            )}
          </div>
        )}

        {/* Status Messages */}
        {ritualState === 'failed' && (
          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded">
            <p className="text-red-400 font-bold uppercase">Ritual Failed</p>
            <p className="text-sm text-red-300 mt-1">You fell silent. The words remain trapped.</p>
          </div>
        )}

        {ritualState === 'success' && (
          <div className="p-4 bg-green-950/30 border border-green-900/50 rounded">
            <p className="text-green-400 font-bold uppercase">Ritual Complete</p>
            <p className="text-sm text-green-300 mt-1">Your words have been sealed and released.</p>
          </div>
        )}

        {/* Instructions */}
        {ritualState === 'idle' && (
          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded">
            <p className="text-xs text-zinc-600 uppercase mb-2">Instructions:</p>
            <ul className="text-xs text-zinc-500 space-y-1">
              <li>• Click "Recite" to begin the ritual</li>
              <li>• Speak continuously (volume must stay above 10%)</li>
              <li>• If you're silent for more than 1.2 seconds, the ritual fails</li>
              <li>• Reach 100% to complete the export</li>
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-4 border-t border-zinc-800">
          {ritualState === 'idle' && micPermission === 'pending' && (
            <button
              onClick={requestMicrophone}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase rounded transition-all"
            >
              <Icon icon="solar:microphone-bold" className="inline size-5 mr-2" />
              Grant Microphone Access
            </button>
          )}

          {ritualState === 'idle' && micPermission === 'granted' && (
            <button
              onClick={startRitual}
              className="px-8 py-3 bg-red-800 hover:bg-red-700 text-white text-xl font-bold uppercase rounded transition-all transform hover:scale-105"
            >
              Recite
            </button>
          )}

          {ritualState === 'failed' && (
            <button
              onClick={resetRitual}
              className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white font-bold uppercase rounded transition-all"
            >
              Try Again
            </button>
          )}

          {ritualState !== 'success' && (
            <button
              onClick={() => {
                resetRitual();
                onClose();
              }}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-bold uppercase rounded transition-all"
            >
              Cancel
            </button>
          )}
        </div>

        {micPermission === 'denied' && (
          <div className="p-4 bg-red-950/30 border border-red-900/50 rounded">
            <p className="text-red-400 text-sm">
              Microphone access denied. Please enable it in your browser settings to perform the ritual.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
