import { useState, useRef } from 'react';
import { useOnboardingState } from '@/hooks/useOnboardingState';
import { AuthModal } from '@/components/AuthModal';
import { Skull, ChevronRight } from 'lucide-react';
import { Icon } from '@iconify/react';
import { horrorAudio } from '@/lib/audio/HorrorAudio';

interface OnboardingStepperProps {
  onOnboardingComplete: () => void;
}

export function OnboardingStepper({ onOnboardingComplete }: OnboardingStepperProps) {
  const { currentStep, nextStep, completeOnboarding } = useOnboardingState();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [typedInput, setTypedInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const practiceText = 'The whispers begin.';
  const isTypingComplete = typedInput === practiceText;

  const handleCompleteOnboarding = () => {
    completeOnboarding();
    onOnboardingComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 bg-[url('/bg-graveyard.jpg')] bg-cover bg-center bg-fixed overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/90" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_30%,rgba(0,0,0,0.7)_80%,rgba(0,0,0,0.9)_100%)]" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        
        {/* Step 0: The Veil */}
        {currentStep === 0 && (
          <div className="max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-1000 relative">
            {/* Massive Faint Icon in Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 opacity-20 scale-150 pointer-events-none">
              <Icon 
                icon="game-icons:pentagram-rose" 
                className="w-64 h-64 text-purple-500"
              />
            </div>
            
            <div className="space-y-4 relative z-10">
              <h1 className="text-7xl font-['Creepster'] text-red-600 tracking-widest drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                THE DEADLINE
              </h1>
              <p className="text-2xl font-['Playfair_Display'] text-zinc-400 italic">
                The veil is thin.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-4 text-zinc-300 font-['Playfair_Display'] text-lg leading-relaxed relative z-10">
              <p>
                You stand at the precipice between the living and the dead, where words hold power and hesitation invites doom.
              </p>
              <p>
                The spirits await your offering. Will you write, or will you perish?
              </p>
            </div>

            {/* Ghost-style text link with glowing arrow */}
            <button
              onClick={() => {
                horrorAudio.startAmbience();
                horrorAudio.playClick();
                nextStep();
              }}
              onMouseEnter={() => horrorAudio.playHover()}
              className="group relative text-white hover:text-red-500 text-xl font-['Creepster'] tracking-wider transition-all flex items-center gap-3 mx-auto mt-12"
            >
              <span className="relative z-10">BEGIN RITUAL</span>
              <ChevronRight className="w-6 h-6 relative z-10 transition-all group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            </button>
          </div>
        )}

        {/* Step 1: The Oath */}
        {currentStep === 1 && (
          <div className="max-w-2xl text-center space-y-12 animate-in fade-in zoom-in duration-500">
            <h2 className="text-5xl font-['Creepster'] text-red-600 tracking-wider drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              THE OATH
            </h2>

            {/* Poem-like layout with Crimson Text */}
            <div className="space-y-6 text-zinc-300 font-['Crimson_Text'] text-2xl leading-relaxed max-w-lg mx-auto">
              <p>You must type the words as they appear.</p>
              <p>The spirit's patience <span className="text-red-500">drains</span> with hesitation.</p>
              <p><span className="text-red-500">Errors</span> anger the muse.</p>
              <p>If patience reaches zero, you <span className="text-red-500">die</span>.</p>
              <p className="text-zinc-500 italic text-xl mt-8">
                Speed and accuracy are your only salvation.
              </p>
            </div>

            <button
              onClick={() => {
                horrorAudio.playClick();
                nextStep();
              }}
              onMouseEnter={() => horrorAudio.playHover()}
              className="group relative text-white hover:text-red-500 text-xl font-['Creepster'] tracking-wider transition-all flex items-center gap-3 mx-auto mt-12"
            >
              <span className="relative z-10">I UNDERSTAND</span>
              <ChevronRight className="w-6 h-6 relative z-10 transition-all group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            </button>
          </div>
        )}

        {/* Step 2: The First Glyph */}
        {currentStep === 2 && (
          <div className="max-w-3xl text-center space-y-12 animate-in fade-in zoom-in duration-500">
            <h2 className="text-5xl font-['Creepster'] text-red-600 tracking-wider drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              THE FIRST GLYPH
            </h2>

            <p className="text-zinc-400 font-['Playfair_Display'] text-lg">
              Prove your worth. Type the words as they appear:
            </p>

            {/* Color Shift Typing Engine */}
            <div 
              className="relative p-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl max-w-2xl mx-auto cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              {/* The Visual Text */}
              <div className="text-4xl font-['Crimson_Text'] tracking-wide leading-relaxed text-center">
                {practiceText.split('').map((char, index) => {
                  const isTyped = index < typedInput.length;
                  const isCorrect = isTyped && typedInput[index] === char;
                  const isCurrent = index === typedInput.length;
                  
                  return (
                    <span
                      key={index}
                      className={`transition-all duration-100 ${
                        isTyped && isCorrect ? 'text-zinc-100 drop-shadow-md' : ''
                      } ${
                        isTyped && !isCorrect ? 'text-red-600 animate-pulse' : ''
                      } ${
                        !isTyped ? 'text-zinc-700' : ''
                      } ${
                        isCurrent ? 'border-b-2 border-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]' : ''
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>

              {/* The Invisible Engine */}
              <input
                ref={inputRef}
                type="text"
                value={typedInput}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const lastChar = newValue[newValue.length - 1];
                  const expectedChar = practiceText[newValue.length - 1];
                  
                  if (lastChar === expectedChar) {
                    horrorAudio.playKeystroke();
                  } else {
                    horrorAudio.playError();
                  }
                  
                  setTypedInput(newValue);
                }}
                className="absolute inset-0 opacity-0 cursor-text"
                autoFocus
                maxLength={practiceText.length}
              />
            </div>

            {/* Success Message */}
            {isTypingComplete && (
              <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
                <p className="text-red-400 text-xl font-['Playfair_Display'] italic">
                  The glyph is complete. The spirits acknowledge your skill.
                </p>
                <button
                  onClick={() => {
                    horrorAudio.playClick();
                    setTypedInput('');
                    nextStep();
                  }}
                  onMouseEnter={() => horrorAudio.playHover()}
                  className="group relative text-white hover:text-red-500 text-xl font-['Creepster'] tracking-wider transition-all flex items-center gap-3 mx-auto"
                >
                  <span className="relative z-10">CONTINUE</span>
                  <ChevronRight className="w-6 h-6 relative z-10 transition-all group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: The Favor */}
        {currentStep === 3 && (
          <div className="max-w-4xl text-center space-y-12 animate-in fade-in zoom-in duration-500">
            <h2 className="text-5xl font-['Creepster'] text-red-600 tracking-wider drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              THE FAVOR
            </h2>

            {/* Three Columns with Huge Skulls */}
            <div className="grid grid-cols-3 gap-12 my-16">
              <div className="flex flex-col items-center gap-6 group cursor-default">
                <Skull className="w-16 h-16 text-zinc-800 group-hover:text-red-500 transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
                <p className="text-zinc-400 font-['Crimson_Text'] text-base">You survived</p>
              </div>
              <div className="flex flex-col items-center gap-6 group cursor-default">
                <Skull className="w-16 h-16 text-zinc-800 group-hover:text-amber-500 transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                <p className="text-zinc-400 font-['Crimson_Text'] text-base">Competent</p>
              </div>
              <div className="flex flex-col items-center gap-6 group cursor-default">
                <Skull className="w-16 h-16 text-zinc-800 group-hover:text-amber-400 transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                <p className="text-zinc-400 font-['Crimson_Text'] text-base">Masterful</p>
              </div>
            </div>

            <p className="text-zinc-300 font-['Playfair_Display'] text-lg leading-relaxed max-w-xl mx-auto">
              For each ritual you complete, the spirits grant you skulls based on your speed and precision.
            </p>

            <button
              onClick={() => {
                horrorAudio.playClick();
                nextStep();
              }}
              onMouseEnter={() => horrorAudio.playHover()}
              className="group relative text-white hover:text-red-500 text-xl font-['Creepster'] tracking-wider transition-all flex items-center gap-3 mx-auto mt-12"
            >
              <span className="relative z-10">ACCEPT THE CHALLENGE</span>
              <ChevronRight className="w-6 h-6 relative z-10 transition-all group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            </button>
          </div>
        )}



        {/* Step 4: The Covenant */}
        {currentStep === 4 && (
          <div className="max-w-2xl bg-black/40 backdrop-blur-sm border border-white/5 rounded-lg p-12 animate-in fade-in zoom-in duration-500">
            <div className="space-y-8 text-center">
              <h2 className="text-5xl font-['Creepster'] text-red-600 tracking-wider drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                THE COVENANT
              </h2>

              <Icon 
                icon="game-icons:pentagram-rose" 
                className="w-24 h-24 mx-auto text-red-500 animate-pulse"
                style={{ filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.6))' }}
              />

              <div className="space-y-4 text-zinc-300 font-['Playfair_Display'] text-lg leading-relaxed max-w-xl mx-auto">
                <p>
                  To preserve your progress across the veil and beyond the mortal realm...
                </p>
                <p className="text-red-400 font-bold">
                  Forge a covenant with us.
                </p>
                <p className="text-zinc-500 italic text-base">
                  Sign up to save your skulls and access your progress from any device.
                </p>
              </div>

              <div className="space-y-4 mt-8">
                <button
                  onClick={() => {
                    horrorAudio.playClick();
                    setShowAuthModal(true);
                  }}
                  onMouseEnter={() => horrorAudio.playHover()}
                  className="group relative w-full py-4 border border-white/20 hover:border-red-500 text-white hover:text-red-500 text-xl font-['Creepster'] tracking-wider transition-all overflow-hidden"
                >
                  <span className="relative z-10">FORGE COVENANT</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>

                <button
                  onClick={() => {
                    horrorAudio.playClick();
                    handleCompleteOnboarding();
                  }}
                  onMouseEnter={() => horrorAudio.playHover()}
                  className="text-zinc-500 hover:text-zinc-300 text-sm font-['Crimson_Text'] italic transition-colors py-2 w-full"
                >
                  Delve as a Wanderer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          handleCompleteOnboarding();
        }}
      />
    </div>
  );
}
