/**
 * BreathingUIShowcase Component
 * Demonstrates the Arcane Pulse borders and Fog of Creation effects
 */

import { useState } from 'react';
import { ArcanePulseBorder } from './ArcanePulseBorder';
import { FogOfCreation } from './FogOfCreation';

export function BreathingUIShowcase() {
  const [borderColor, setBorderColor] = useState<'purple' | 'red' | 'blue' | 'gold'>('purple');
  const [borderIntensity, setBorderIntensity] = useState<'subtle' | 'medium' | 'strong'>('medium');
  const [fogDensity, setFogDensity] = useState<'light' | 'medium' | 'heavy'>('medium');
  const [fogColor, setFogColor] = useState<'purple' | 'red' | 'blue' | 'neutral'>('neutral');
  const [fogSpeed, setFogSpeed] = useState<'slow' | 'medium' | 'fast'>('slow');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-['Playfair_Display'] font-bold text-red-400">
            Breathing UI Effects
          </h1>
          <p className="text-zinc-400">
            Arcane Pulse Borders & Fog of Creation
          </p>
        </div>

        {/* Controls */}
        <div className="grid md:grid-cols-2 gap-6 bg-zinc-900/50 backdrop-blur-md p-6 rounded-lg border border-white/10">
          {/* Border Controls */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-red-300">Arcane Pulse Borders</h2>
            
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Color</label>
              <div className="flex gap-2">
                {(['purple', 'red', 'blue', 'gold'] as const).map(color => (
                  <button
                    key={color}
                    onClick={() => setBorderColor(color)}
                    className={`px-4 py-2 rounded capitalize ${
                      borderColor === color 
                        ? 'bg-red-600 text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Intensity</label>
              <div className="flex gap-2">
                {(['subtle', 'medium', 'strong'] as const).map(intensity => (
                  <button
                    key={intensity}
                    onClick={() => setBorderIntensity(intensity)}
                    className={`px-4 py-2 rounded capitalize ${
                      borderIntensity === intensity 
                        ? 'bg-red-600 text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fog Controls */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-red-300">Fog of Creation</h2>
            
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Density</label>
              <div className="flex gap-2">
                {(['light', 'medium', 'heavy'] as const).map(density => (
                  <button
                    key={density}
                    onClick={() => setFogDensity(density)}
                    className={`px-4 py-2 rounded capitalize ${
                      fogDensity === density 
                        ? 'bg-red-600 text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Color</label>
              <div className="flex gap-2">
                {(['neutral', 'purple', 'red', 'blue'] as const).map(color => (
                  <button
                    key={color}
                    onClick={() => setFogColor(color)}
                    className={`px-4 py-2 rounded capitalize ${
                      fogColor === color 
                        ? 'bg-red-600 text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Speed</label>
              <div className="flex gap-2">
                {(['slow', 'medium', 'fast'] as const).map(speed => (
                  <button
                    key={speed}
                    onClick={() => setFogSpeed(speed)}
                    className={`px-4 py-2 rounded capitalize ${
                      fogSpeed === speed 
                        ? 'bg-red-600 text-white' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Demo Panels */}
        <div className="grid md:grid-cols-3 gap-4 relative">
          {/* Fog effect behind panels */}
          <FogOfCreation 
            density={fogDensity} 
            color={fogColor} 
            speed={fogSpeed} 
          />

          {/* Left Panel */}
          <div className="relative bg-zinc-900/80 backdrop-blur-md p-6 rounded-lg border border-white/10 min-h-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-zinc-200">Left Panel</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              This panel demonstrates the breathing UI effect. Notice the pulsing border
              on the right edge that creates a sense of magical energy flowing between panels.
            </p>
            <ArcanePulseBorder 
              position="right" 
              color={borderColor} 
              intensity={borderIntensity} 
            />
          </div>

          {/* Center Panel */}
          <div className="relative bg-zinc-900/80 backdrop-blur-md p-6 rounded-lg border border-white/10 min-h-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-zinc-200">Center Panel</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The center panel has borders on both sides, creating a contained magical space.
              The fog drifts slowly in the background, adding depth and atmosphere.
            </p>
            <ArcanePulseBorder 
              position="left" 
              color={borderColor} 
              intensity={borderIntensity} 
            />
            <ArcanePulseBorder 
              position="right" 
              color={borderColor} 
              intensity={borderIntensity} 
            />
          </div>

          {/* Right Panel */}
          <div className="relative bg-zinc-900/80 backdrop-blur-md p-6 rounded-lg border border-white/10 min-h-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-zinc-200">Right Panel</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              The pulsing border on the left edge completes the effect. Together, these elements
              make the interface feel alive, like it's holding back mystical forces.
            </p>
            <ArcanePulseBorder 
              position="left" 
              color={borderColor} 
              intensity={borderIntensity} 
            />
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-zinc-900/50 backdrop-blur-md p-6 rounded-lg border border-white/10 space-y-4">
          <h2 className="text-2xl font-semibold text-red-300">Usage Examples</h2>
          
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="text-zinc-200 font-semibold mb-1">Arcane Pulse Border</h3>
              <pre className="bg-zinc-950 p-3 rounded overflow-x-auto text-zinc-400">
{`<ArcanePulseBorder 
  position="right" 
  color="purple" 
  intensity="medium" 
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-zinc-200 font-semibold mb-1">Fog of Creation</h3>
              <pre className="bg-zinc-950 p-3 rounded overflow-x-auto text-zinc-400">
{`<FogOfCreation 
  density="medium" 
  color="neutral" 
  speed="slow" 
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
