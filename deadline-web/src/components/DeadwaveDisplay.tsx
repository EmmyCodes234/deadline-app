import { useMemo } from 'react';
import { SpectrogramVisualizer } from './SpectrogramVisualizer';

interface DeadwaveDisplayProps {
  text: string;
  signalStrength: number;
  isLocked: boolean;
  analyser: AnalyserNode | null;
}

const GLYPHS = '†‡§¶ΓΔΘΛΞΠΣΦΨΩαβγδεζηθικλμνξπρστυφχψω';
const ZALGO_CHARS = '̴̵̶̷̸̡̢̧̨̛̖̗̘̙̜̝̞̟̠̣̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎̀́̂̃̄̅̆̇̈̉̊̋̌̍̎̏̐̑̒̓̔̽̾̿̀́͂̓̈́͆͊͋͌̕̚';

function decryptText(originalText: string, signalStrength: number, isLocked: boolean): string {
  if (isLocked) return originalText;

  return originalText.split('').map((char, index) => {
    if (char === ' ') return ' ';
    if (char === '.' || char === ',' || char === '!' || char === '?') return char;

    // Very weak signal: Zalgo/Runes
    if (signalStrength < 0.3) {
      if (Math.random() < 0.7) {
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      // Add zalgo
      const zalgo = ZALGO_CHARS[Math.floor(Math.random() * ZALGO_CHARS.length)];
      return char + zalgo + zalgo;
    }

    // Medium signal: Scrambled (50% legible)
    if (signalStrength < 0.8) {
      if (Math.random() < signalStrength) {
        return char;
      }
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }

    // Strong signal: Mostly clear with slight jitter
    if (Math.random() < signalStrength) {
      return char;
    }
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }).join('');
}

export function DeadwaveDisplay({ text, signalStrength, isLocked, analyser }: DeadwaveDisplayProps) {
  // Decrypt text based on signal strength
  const displayText = useMemo(() => {
    return decryptText(text, signalStrength, isLocked);
  }, [text, signalStrength, isLocked]);

  // Jitter effect when not locked
  const jitterStyle = !isLocked && signalStrength > 0.7 ? {
    animation: 'jitter 0.1s infinite',
  } : {};

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      {/* Spectrogram Visualizer */}
      <SpectrogramVisualizer analyser={analyser} signalStrength={signalStrength} />

      {/* CRT Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* The Text */}
      <div 
        className={`relative z-20 text-center font-mono text-2xl md:text-3xl leading-relaxed px-4 transition-all duration-300 ${
          isLocked ? 'text-green-400' : 'text-green-500'
        }`}
        style={{
          textShadow: isLocked 
            ? '0 0 10px rgba(34, 197, 94, 0.8), 2px 0 0 rgba(255,0,0,0.3), -2px 0 0 rgba(0,255,255,0.3)'
            : `0 0 ${10 + signalStrength * 20}px rgba(34, 197, 94, ${0.3 + signalStrength * 0.5}), 2px 0 0 rgba(255,0,0,0.2), -2px 0 0 rgba(0,255,255,0.2)`,
          filter: `blur(${(1 - signalStrength) * 2}px)`,
          ...jitterStyle,
        }}
      >
        {displayText}
      </div>

      {/* Flash effect on lock */}
      {isLocked && (
        <div 
          className="absolute inset-0 bg-white pointer-events-none z-30 animate-in fade-out duration-300"
          style={{ animationDuration: '0.3s' }}
        />
      )}

      <style>{`
        @keyframes jitter {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
        }
      `}</style>
    </div>
  );
}
