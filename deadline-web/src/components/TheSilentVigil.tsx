import { useVigilEngine } from '@/hooks/useVigilEngine';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export function TheSilentVigil() {
  const {
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
  } = useVigilEngine();

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate glitch intensity based on sanity
  const glitchIntensity = Math.max(0, (100 - sanity) / 100);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Start Screen */}
      {gameStatus === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-zinc-400 uppercase tracking-wider"
                style={{
                  textShadow: '0 0 30px rgba(161, 161, 170, 0.3)',
                }}
              >
                The Silent Vigil
              </h1>
              <p className="text-xl text-zinc-500 italic">
                A Psychological Horror Endurance Test
              </p>
            </div>

            <div className="bg-zinc-900 border-2 border-zinc-800 rounded-lg p-8 space-y-4">
              <h2 className="text-2xl text-zinc-400 font-bold uppercase">Objective</h2>
              <p className="text-zinc-500 leading-relaxed">
                Survive 60 seconds of surveillance. Remain perfectly still and silent. 
                The camera is watching. Something else is watching too.
              </p>
              
              <div className="mt-6 p-4 bg-red-950/30 border border-red-900/50 rounded">
                <p className="text-sm text-red-400 uppercase mb-2">⚠️ Requirements:</p>
                <ul className="text-sm text-red-300 space-y-1">
                  <li>• Microphone access required</li>
                  <li>• Headphones recommended</li>
                  <li>• Play in a quiet room</li>
                </ul>
              </div>
            </div>

            {micPermission === 'pending' && (
              <button
                onClick={requestMicrophone}
                className="px-12 py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-2xl font-bold uppercase rounded-lg transition-all transform hover:scale-105 border-2 border-zinc-700"
              >
                Grant Microphone Access
              </button>
            )}

            {micPermission === 'granted' && (
              <button
                onClick={startGame}
                className="px-12 py-4 bg-red-800 hover:bg-red-700 text-white text-2xl font-bold uppercase rounded-lg transition-all transform hover:scale-105 border-2 border-red-700"
              >
                Begin Vigil
              </button>
            )}

            {micPermission === 'denied' && (
              <div className="text-red-400 text-sm">
                Microphone access denied. Please enable it in your browser settings.
              </div>
            )}

            <Link
              to="/hub"
              className="block text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <Icon icon="solar:arrow-left-bold" className="inline size-5 mr-2" />
              Back to Hub
            </Link>
          </div>
        </div>
      )}

      {/* Game Screen - CCTV Feed */}
      {gameStatus === 'active' && (
        <div className="relative h-full w-full">
          {/* Video Feed Container */}
          <div 
            className="absolute inset-0 transition-all duration-300"
            style={{
              filter: isBlinking 
                ? 'brightness(0)' 
                : `contrast(1.2) brightness(0.8) sepia(0.3) blur(${blinkBlur * 20}px)`,
            }}
          >
            {/* Base Image - Placeholder for now */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-900"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23222\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23444\' font-size=\'14\' font-family=\'monospace\'%3EHALLWAY%3C/text%3E%3C/svg%3E")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Scanlines */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)',
                opacity: 0.5,
              }}
            />

            {/* Noise */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                animation: 'noise 0.2s infinite',
              }}
            />
          </div>

          {/* Glitch Layer (when sanity drops) */}
          {glitchIntensity > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: Math.floor(glitchIntensity * 5) }).map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    clipPath: `polygon(
                      0% ${Math.random() * 100}%, 
                      100% ${Math.random() * 100}%, 
                      100% ${Math.random() * 100}%, 
                      0% ${Math.random() * 100}%
                    )`,
                    filter: Math.random() > 0.5 ? 'invert(1)' : 'hue-rotate(180deg)',
                    opacity: glitchIntensity * 0.3,
                    animation: 'glitch 0.1s infinite',
                  }}
                />
              ))}
            </div>
          )}

          {/* CCTV Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* REC Indicator */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <div 
                className="w-4 h-4 bg-red-500 rounded-full"
                style={{
                  animation: 'pulse 1s ease-in-out infinite',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
                }}
              />
              <span className="text-red-500 font-mono text-xl font-bold tracking-wider">
                REC
              </span>
            </div>

            {/* Timecode */}
            <div className="absolute top-8 right-8 font-mono text-2xl text-white">
              {formatTime(time)}
            </div>

            {/* Mental Fracture Bar */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-4">
                <span className="text-white font-mono text-sm uppercase tracking-wider">Mental Fracture:</span>
                <div className="flex-1 relative" style={{ height: '24px' }}>
                  {/* Background */}
                  <div className="absolute inset-0 bg-black/60" />
                  
                  {/* Jagged fill line */}
                  <svg 
                    className="absolute left-0 top-0 w-full h-full transition-all duration-300"
                    style={{
                      clipPath: `inset(0 ${100 - sanity}% 0 0)`,
                    }}
                    viewBox="0 0 1000 24"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="vigilFractureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#fff', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d={sanity > 50 
                        ? "M0,12 L50,12 L52,10 L54,14 L56,12 L106,12 L108,11 L110,13 L112,12 L162,12 L164,10 L166,14 L168,12 L218,12 L220,11 L222,13 L224,12 L274,12 L276,10 L278,14 L280,12 L330,12 L332,11 L334,13 L336,12 L386,12 L388,10 L390,14 L392,12 L442,12 L444,11 L446,13 L448,12 L498,12 L500,10 L502,14 L504,12 L554,12 L556,11 L558,13 L560,12 L610,12 L612,10 L614,14 L616,12 L666,12 L668,11 L670,13 L672,12 L722,12 L724,10 L726,14 L728,12 L778,12 L780,11 L782,13 L784,12 L834,12 L836,10 L838,14 L840,12 L890,12 L892,11 L894,13 L896,12 L946,12 L948,10 L950,14 L952,12 L1000,12"
                        : sanity > 25
                        ? "M0,12 L45,12 L47,8 L49,16 L51,12 L96,12 L98,7 L100,17 L102,12 L147,12 L149,9 L151,15 L153,12 L198,12 L200,8 L202,16 L204,12 L249,12 L251,7 L253,17 L255,12 L300,12 L302,9 L304,15 L306,12 L351,12 L353,8 L355,16 L357,12 L402,12 L404,7 L406,17 L408,12 L453,12 L455,9 L457,15 L459,12 L504,12 L506,8 L508,16 L510,12 L555,12 L557,7 L559,17 L561,12 L606,12 L608,9 L610,15 L612,12 L657,12 L659,8 L661,16 L663,12 L708,12 L710,7 L712,17 L714,12 L759,12 L761,9 L763,15 L765,12 L810,12 L812,8 L814,16 L816,12 L861,12 L863,7 L865,17 L867,12 L912,12 L914,9 L916,15 L918,12 L963,12 L965,8 L967,16 L969,12 L1000,12"
                        : "M0,12 L40,12 L42,6 L44,18 L46,12 L86,12 L88,4 L90,20 L92,12 L132,12 L134,7 L136,17 L138,12 L178,12 L180,5 L182,19 L184,12 L224,12 L226,6 L228,18 L230,12 L270,12 L272,4 L274,20 L276,12 L316,12 L318,7 L320,17 L322,12 L362,12 L364,5 L366,19 L368,12 L408,12 L410,6 L412,18 L414,12 L454,12 L456,4 L458,20 L460,12 L500,12 L502,7 L504,17 L506,12 L546,12 L548,5 L550,19 L552,12 L592,12 L594,6 L596,18 L598,12 L638,12 L640,4 L642,20 L644,12 L684,12 L686,7 L688,17 L690,12 L730,12 L732,5 L734,19 L736,12 L776,12 L778,6 L780,18 L782,12 L822,12 L824,4 L826,20 L828,12 L868,12 L870,7 L872,17 L874,12 L914,12 L916,5 L918,19 L920,12 L960,12 L962,6 L964,18 L966,12 L1000,12"
                      }
                      fill="none"
                      stroke="url(#vigilFractureGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        filter: sanity > 50 
                          ? 'drop-shadow(0 0 4px #fff)' 
                          : sanity > 25 
                          ? 'drop-shadow(0 0 6px #f59e0b)'
                          : 'drop-shadow(0 0 8px #ef4444)',
                        animation: sanity > 50 
                          ? 'none' 
                          : sanity > 25 
                          ? 'vigilTremble 0.2s ease-in-out infinite'
                          : 'vigilTremble 0.08s ease-in-out infinite',
                      }}
                    />
                  </svg>

                  {/* Cracked Glass Overlay */}
                  {sanity < 50 && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        opacity: (50 - sanity) / 50 * 0.6,
                        background: `
                          linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.15) 47%, transparent 47%, transparent 53%, rgba(255,255,255,0.15) 53%, rgba(255,255,255,0.15) 55%, transparent 55%),
                          linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.1) 47%, transparent 47%, transparent 53%, rgba(255,255,255,0.1) 53%, rgba(255,255,255,0.1) 55%, transparent 55%)
                        `,
                        backgroundSize: '6px 6px',
                        mixBlendMode: 'overlay',
                      }}
                    />
                  )}
                </div>
                <span 
                  className="text-white font-mono text-sm w-12 text-right font-bold"
                  style={{
                    color: sanity > 50 ? '#fff' : sanity > 25 ? '#f59e0b' : '#ef4444',
                    textShadow: sanity < 50 ? `0 0 8px ${sanity > 25 ? '#f59e0b' : '#ef4444'}` : 'none',
                  }}
                >
                  {Math.round(sanity)}%
                </span>
              </div>
            </div>

            {/* Blink Warning */}
            {blinkBlur > 0.5 && !isBlinking && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div 
                  className="text-red-500 font-mono text-4xl font-bold uppercase animate-pulse"
                  style={{
                    textShadow: '0 0 20px rgba(239, 68, 68, 1)',
                  }}
                >
                  HOLD TO BLINK
                </div>
              </div>
            )}

            {/* Activity Indicators */}
            <div className="absolute bottom-24 left-8 space-y-2">
              {mouseVelocity > 5 && (
                <div className="flex items-center gap-2 text-red-400 font-mono text-sm">
                  <Icon icon="solar:motion-bold" className="size-5" />
                  <span>MOVEMENT DETECTED</span>
                </div>
              )}
              {audioLevel > 0.1 && (
                <div className="flex items-center gap-2 text-red-400 font-mono text-sm">
                  <Icon icon="solar:microphone-bold" className="size-5" />
                  <span>AUDIO DETECTED</span>
                </div>
              )}
            </div>
          </div>

          {/* Blink Overlay */}
          {isBlinking && (
            <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
              <div className="text-white/30 font-mono text-2xl uppercase">
                Blinking...
              </div>
            </div>
          )}

          {/* CSS Animations */}
          <style>{`
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.3;
              }
            }
            @keyframes noise {
              0%, 100% {
                transform: translate(0, 0);
              }
              10% {
                transform: translate(-5%, -5%);
              }
              20% {
                transform: translate(-10%, 5%);
              }
              30% {
                transform: translate(5%, -10%);
              }
              40% {
                transform: translate(-5%, 15%);
              }
              50% {
                transform: translate(-10%, 5%);
              }
              60% {
                transform: translate(15%, 0);
              }
              70% {
                transform: translate(0, 10%);
              }
              80% {
                transform: translate(-15%, 0);
              }
              90% {
                transform: translate(10%, 5%);
              }
            }
            @keyframes glitch {
              0%, 100% {
                transform: translate(0, 0);
              }
              33% {
                transform: translate(-2px, 2px);
              }
              66% {
                transform: translate(2px, -2px);
              }
            }
            @keyframes vigilTremble {
              0%, 100% {
                transform: translateY(0) translateX(0);
              }
              25% {
                transform: translateY(-0.5px) translateX(0.5px);
              }
              50% {
                transform: translateY(0.5px) translateX(-0.5px);
              }
              75% {
                transform: translateY(-0.5px) translateX(-0.5px);
              }
            }
          `}</style>
        </div>
      )}

      {/* Victory Screen */}
      {gameStatus === 'won' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-green-500 uppercase tracking-wider animate-pulse"
                style={{
                  textShadow: '0 0 30px rgba(34, 197, 94, 0.8)',
                }}
              >
                Survived
              </h1>
              <p className="text-xl text-green-400 italic">
                You endured the vigil
              </p>
            </div>

            <div className="bg-zinc-900 border-2 border-green-900 rounded-lg p-8 space-y-4">
              <div className="text-5xl font-bold text-white font-mono">
                60:00
              </div>
              <div className="text-green-500 uppercase tracking-wider">
                Time Survived
              </div>
              <div className="text-zinc-500">
                Final Sanity: {Math.round(sanity)}%
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Try Again
              </button>
              <Link
                to="/hub"
                className="px-8 py-3 bg-zinc-700 hover:bg-zinc-600 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Exit
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameStatus === 'lost' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-red-500 uppercase tracking-wider animate-pulse"
                style={{
                  textShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
                }}
              >
                Detected
              </h1>
              <p className="text-xl text-red-400 italic">
                {sanity === 0 ? 'Your sanity shattered' : 'You failed to blink'}
              </p>
            </div>

            <div className="bg-zinc-900 border-2 border-red-900 rounded-lg p-8 space-y-4">
              <div className="text-5xl font-bold text-white font-mono">
                {formatTime(time)}
              </div>
              <div className="text-red-500 uppercase tracking-wider">
                Time Survived
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Try Again
              </button>
              <Link
                to="/hub"
                className="px-8 py-3 bg-zinc-700 hover:bg-zinc-600 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Exit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
