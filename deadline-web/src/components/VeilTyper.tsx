import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useVeilTyperEngine } from '@/hooks/useVeilTyperEngine';
import { VeilTyperScene } from './VeilTyperScene';
import { VeilTyperHUD } from './VeilTyperHUD';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

export function VeilTyper() {
  const {
    gameState,
    score,
    timeLeft,
    typedBuffer,
    ghosts,
    comboStreak,
    mana,
    multiplier,
    startGame,
  } = useVeilTyperEngine();

  // Debug log
  useEffect(() => {
    console.log('VeilTyper mounted, gameState:', gameState);
  }, []);

  // Play background music
  useEffect(() => {
    if (gameState === 'playing') {
      // Background audio would go here if available
    }
    return () => {
      // Cleanup
    };
  }, [gameState]);

  console.log('Rendering VeilTyper, gameState:', gameState);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* 3D Scene */}
      {gameState === 'playing' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950 to-black">
            {/* Fallback background if 3D fails */}
          </div>
          <VeilTyperScene ghosts={ghosts} comboStreak={comboStreak} />
          <VeilTyperHUD
            score={score}
            timeLeft={timeLeft}
            typedBuffer={typedBuffer}
            comboStreak={comboStreak}
            mana={mana}
            multiplier={multiplier}
          />
        </>
      )}

      {/* Start Screen */}
      {gameState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-purple-950/20 to-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-purple-400 uppercase tracking-wider"
                style={{
                  textShadow: '0 0 30px rgba(168, 85, 247, 0.8)',
                }}
              >
                The Veil Typer
              </h1>
              <p className="text-xl text-purple-300 italic">
                A 3D Typing Horror Survival Game
              </p>
            </div>

            <div className="bg-black/60 border-2 border-purple-500 rounded-lg p-8 space-y-4">
              <h2 className="text-2xl text-purple-400 font-bold uppercase">How to Play</h2>
              <ul className="text-left text-purple-200 space-y-2">
                <li>• Type the words on ghosts to banish them</li>
                <li>• Don't let any ghost reach you</li>
                <li>• Build combos for higher multipliers</li>
                <li>• Every 15 kills, face a BOSS</li>
                <li>• Fill mana bar and type "EXORCISE" for ultimate</li>
                <li>• Survive for 60 seconds to win</li>
              </ul>
            </div>

            <button
              onClick={startGame}
              className="px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white text-2xl font-bold uppercase rounded-lg transition-all transform hover:scale-105"
              style={{
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)',
              }}
            >
              Start Game
            </button>

            <Link
              to="/hub"
              className="block text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Icon icon="solar:arrow-left-bold" className="inline size-5 mr-2" />
              Back to Hub
            </Link>
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {gameState === 'won' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-green-950/20 to-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-green-400 uppercase tracking-wider animate-pulse"
                style={{
                  textShadow: '0 0 30px rgba(74, 222, 128, 0.8)',
                }}
              >
                Victory!
              </h1>
              <p className="text-xl text-green-300 italic">
                You survived the veil
              </p>
            </div>

            <div className="bg-black/60 border-2 border-green-500 rounded-lg p-8 space-y-4">
              <div className="text-5xl font-bold text-white font-mono">
                {score.toLocaleString()}
              </div>
              <div className="text-green-400 uppercase tracking-wider">
                Final Score
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={startGame}
                className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Play Again
              </button>
              <Link
                to="/hub"
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold uppercase rounded-lg transition-all"
              >
                Exit
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'lost' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black via-red-950/20 to-black">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <div className="space-y-4">
              <h1 
                className="font-['Playfair_Display'] text-7xl text-red-500 uppercase tracking-wider animate-pulse"
                style={{
                  textShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
                }}
              >
                Game Over
              </h1>
              <p className="text-xl text-red-300 italic">
                The ghosts have claimed you
              </p>
            </div>

            <div className="bg-black/60 border-2 border-red-500 rounded-lg p-8 space-y-4">
              <div className="text-5xl font-bold text-white font-mono">
                {score.toLocaleString()}
              </div>
              <div className="text-red-400 uppercase tracking-wider">
                Final Score
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
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white text-xl font-bold uppercase rounded-lg transition-all"
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
