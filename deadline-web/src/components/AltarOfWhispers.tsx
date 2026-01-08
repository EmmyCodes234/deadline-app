import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Textarea } from '@/components/ui/textarea';
import { type CryptItem } from '@/hooks/useCrypt';
import { generateCursedSynonyms } from '@/lib/cerebras';
import { GrimoireAmbience } from '@/lib/audio/GrimoireAmbience';
import { AltarAudio } from '@/lib/audio/AltarAudio';
import clsx from 'clsx';

interface AltarOfWhispersProps {
  activeDocument: CryptItem | null;
  onUpdateSynopsis: (synopsis: string) => void;
  onAddCharacter: (name: string, description: string) => void;
  onUpdateCharacter: (charId: string, name: string, description: string) => void;
  onDeleteCharacter: (charId: string) => void;
  onAddResearch: (title: string, url: string) => void;
  onUpdateResearch: (researchId: string, title: string, url: string) => void;
  onDeleteResearch: (researchId: string) => void;
  onUpdateWordGoal: (goal: number) => void;
}

// Cursed synonyms data for the Lexicon
const CURSED_SYNONYMS: Record<string, string[]> = {
  red: ['Crimson', 'Scarlet', 'Visceral', 'Gore', 'Bloodied', 'Carmine', 'Vermillion'],
  dark: ['Shadowy', 'Obsidian', 'Void', 'Abyssal', 'Tenebrous', 'Stygian'],
  death: ['Demise', 'Oblivion', 'Cessation', 'Expiration', 'Quietus', 'Repose'],
  fear: ['Dread', 'Terror', 'Horror', 'Panic', 'Trepidation', 'Anguish'],
  cold: ['Frigid', 'Icy', 'Glacial', 'Frozen', 'Chilled', 'Gelid'],
  pain: ['Agony', 'Torment', 'Anguish', 'Suffering', 'Affliction', 'Torture'],
  blood: ['Ichor', 'Vitae', 'Sanguine', 'Hemoglobin', 'Plasma', 'Lifeblood'],
  shadow: ['Umbra', 'Penumbra', 'Silhouette', 'Shade', 'Phantom', 'Specter'],
  whisper: ['Murmur', 'Susurrus', 'Hiss', 'Sibilance', 'Breath', 'Utterance'],
  scream: ['Shriek', 'Wail', 'Howl', 'Cry', 'Screech', 'Bellow'],
  night: ['Nocturnal', 'Midnight', 'Dusk', 'Twilight', 'Eventide', 'Gloaming'],
  ghost: ['Specter', 'Phantom', 'Wraith', 'Apparition', 'Spirit', 'Shade'],
  bone: ['Skeletal', 'Osseous', 'Marrow', 'Calcium', 'Framework', 'Remains'],
  curse: ['Hex', 'Malediction', 'Jinx', 'Bane', 'Affliction', 'Damnation'],
  sad: ['Melancholic', 'Morose', 'Despondent', 'Forlorn', 'Desolate', 'Woeful'],
  happy: ['Euphoric', 'Elated', 'Jubilant', 'Ecstatic', 'Blissful', 'Rapturous'],
  angry: ['Wrathful', 'Furious', 'Enraged', 'Incensed', 'Livid', 'Irate'],
  beautiful: ['Exquisite', 'Ethereal', 'Sublime', 'Resplendent', 'Radiant', 'Luminous'],
  ugly: ['Grotesque', 'Hideous', 'Repulsive', 'Abhorrent', 'Monstrous', 'Ghastly'],
};

export function AltarOfWhispers({
  activeDocument,
  onUpdateSynopsis,
  onUpdateWordGoal,
}: AltarOfWhispersProps) {
  const [activeTab, setActiveTab] = useState<'seance' | 'lexicon' | 'anatomy'>('anatomy');
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [synopsis, setSynopsis] = useState('');
  
  // Audio systems
  const audioSystemRef = useRef<GrimoireAmbience | null>(null);
  const altarAudioRef = useRef<AltarAudio | null>(null);
  
  // Séance (Ambience) state - expanded with more sounds
  const [soundVolumes, setSoundVolumes] = useState({
    rain: 0,
    fireplace: 0,
    whiteNoise: 0,
    whispers: 0,
    oceanWaves: 0,
    forestAmbience: 0,
    windChimes: 0,
    brownNoise: 0,
    pinkNoise: 0,
    heartbeat: 0,
    breathingGuide: 0,
    tibetanBowl: 0,
  });
  
  // Lexicon state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoadingSynonyms, setIsLoadingSynonyms] = useState(false);
  const [synonymError, setSynonymError] = useState<string | null>(null);
  
  // Spatial whisper effect
  const whisperIntervalRef = useRef<number | null>(null);

  // Initialize audio systems
  useEffect(() => {
    audioSystemRef.current = new GrimoireAmbience();
    altarAudioRef.current = new AltarAudio();
    
    return () => {
      if (audioSystemRef.current) {
        audioSystemRef.current.dispose();
      }
      if (altarAudioRef.current) {
        altarAudioRef.current.dispose();
      }
      if (whisperIntervalRef.current) {
        clearInterval(whisperIntervalRef.current);
      }
    };
  }, []);

  // Play spatial whispers when on Lexicon tab
  useEffect(() => {
    if (activeTab === 'lexicon' && altarAudioRef.current) {
      // Play whispers occasionally for atmosphere
      whisperIntervalRef.current = window.setInterval(() => {
        if (altarAudioRef.current) {
          const direction = Math.random() * 2 - 1; // Random pan -1 to 1
          const intensity = 0.15 + Math.random() * 0.15; // Random intensity 0.15-0.3
          altarAudioRef.current.playSpatialWhisper(direction, intensity);
        }
      }, 8000 + Math.random() * 7000); // Every 8-15 seconds
    } else {
      if (whisperIntervalRef.current) {
        clearInterval(whisperIntervalRef.current);
        whisperIntervalRef.current = null;
      }
    }

    return () => {
      if (whisperIntervalRef.current) {
        clearInterval(whisperIntervalRef.current);
        whisperIntervalRef.current = null;
      }
    };
  }, [activeTab]);

  // Handle sound volume changes
  const handleSoundVolumeChange = (soundName: keyof typeof soundVolumes, volume: number) => {
    setSoundVolumes(prev => ({ ...prev, [soundName]: volume }));
    
    if (audioSystemRef.current) {
      if (volume > 0) {
        audioSystemRef.current.startSound(soundName, volume);
      } else {
        audioSystemRef.current.stopSound(soundName);
      }
    }
  };

  // Update synopsis when active document changes
  useEffect(() => {
    if (activeDocument?.notes) {
      setSynopsis(activeDocument.notes.synopsis || '');
    } else {
      setSynopsis('');
    }
  }, [activeDocument]);

  // Handle lexicon search with AI
  useEffect(() => {
    const searchForSynonyms = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setSynonymError(null);
        return;
      }

      const query = searchQuery.toLowerCase().trim();
      
      // First check if we have hardcoded synonyms (instant fallback)
      const hardcodedResults = CURSED_SYNONYMS[query];
      if (hardcodedResults) {
        setSearchResults(hardcodedResults);
        setSynonymError(null);
        return;
      }

      // Otherwise, use AI
      setIsLoadingSynonyms(true);
      setSynonymError(null);
      
      // Play AI summoning sound
      if (altarAudioRef.current) {
        altarAudioRef.current.playAISummoningSound();
      }
      
      try {
        const aiSynonyms = await generateCursedSynonyms(query);
        
        if (aiSynonyms.length > 0) {
          setSearchResults(aiSynonyms);
        } else {
          setSearchResults([]);
          setSynonymError('No synonyms found');
        }
      } catch (error) {
        console.error('Failed to fetch synonyms:', error);
        setSearchResults([]);
        setSynonymError('The spirits are silent...');
      } finally {
        setIsLoadingSynonyms(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(searchForSynonyms, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle word copy
  const handleCopyWord = async (word: string) => {
    try {
      await navigator.clipboard.writeText(word);
      setCopiedWord(word);
      
      // Play copy sound
      if (altarAudioRef.current) {
        altarAudioRef.current.playWordCopySound();
      }
      
      setTimeout(() => setCopiedWord(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-80 flex flex-col h-full overflow-x-hidden bg-white/5 backdrop-blur-md border-l border-white/10">
      {/* Header with Tabs */}
      <div className="flex-none bg-transparent border-b border-white/10">
        <div className="px-4 py-3">
          <h2 className="text-sm uppercase tracking-widest select-none text-stone-200 font-['Playfair_Display'] font-semibold">
            Dark Arts
          </h2>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex items-center border-t border-white/5">
          <button
            onClick={() => {
              setActiveTab('seance');
              if (altarAudioRef.current) {
                altarAudioRef.current.playTabSwitchSound();
              }
            }}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 transition-all border-b-2',
              activeTab === 'seance'
                ? 'border-red-500 bg-red-950/20 text-red-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            )}
            title="Séance - Ambience"
            aria-label="Séance - Ambience controls"
          >
            <Icon icon="solar:headphones-bold" className="size-5" />
          </button>
          <button
            onClick={() => {
              setActiveTab('lexicon');
              if (altarAudioRef.current) {
                altarAudioRef.current.playTabSwitchSound();
              }
            }}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 transition-all border-b-2',
              activeTab === 'lexicon'
                ? 'border-amber-500 bg-amber-950/20 text-amber-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            )}
            title="Lexicon - Vocabulary"
            aria-label="Lexicon - Vocabulary search"
          >
            <Icon icon="solar:book-bold" className="size-5" />
          </button>
          <button
            onClick={() => {
              setActiveTab('anatomy');
              if (altarAudioRef.current) {
                altarAudioRef.current.playTabSwitchSound();
              }
            }}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 transition-all border-b-2',
              activeTab === 'anatomy'
                ? 'border-red-600 bg-red-950 text-red-200'
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            )}
            title="Anatomy - Notes"
            aria-label="Anatomy - Document notes"
          >
            <Icon icon="solar:pen-bold" className="size-5" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {!activeDocument ? (
        <div className="flex-1 flex items-center justify-center text-stone-600 p-6">
          <div className="text-center space-y-4">
            <Icon icon="solar:document-text-bold" className="size-16 mx-auto opacity-30" />
            <p className="font-['Playfair_Display'] text-lg italic">
              Select a document to unlock the Dark Arts
            </p>
          </div>
        </div>
      ) : activeTab === 'seance' ? (
        /* Tab 1: Séance - Ambience Sliders */
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {/* Nature Sounds Section */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-red-400 font-semibold flex items-center gap-2">
              <Icon icon="solar:cloud-rain-bold" className="size-4" />
              Nature
            </h3>
            
            <SoundSlider
              label="Rain"
              icon="solar:cloud-rain-bold"
              volume={soundVolumes.rain}
              onChange={(v) => handleSoundVolumeChange('rain', v)}
              color="blue"
            />
            
            <SoundSlider
              label="Ocean Waves"
              icon="solar:water-sun-bold"
              volume={soundVolumes.oceanWaves}
              onChange={(v) => handleSoundVolumeChange('oceanWaves', v)}
              color="cyan"
            />
            
            <SoundSlider
              label="Forest"
              icon="solar:leaf-bold"
              volume={soundVolumes.forestAmbience}
              onChange={(v) => handleSoundVolumeChange('forestAmbience', v)}
              color="green"
            />
            
            <SoundSlider
              label="Wind Chimes"
              icon="solar:wind-bold"
              volume={soundVolumes.windChimes}
              onChange={(v) => handleSoundVolumeChange('windChimes', v)}
              color="purple"
            />
          </div>

          {/* Cozy Sounds Section */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
              <Icon icon="solar:fire-bold" className="size-4" />
              Cozy
            </h3>
            
            <SoundSlider
              label="Fireplace"
              icon="solar:fire-bold"
              volume={soundVolumes.fireplace}
              onChange={(v) => handleSoundVolumeChange('fireplace', v)}
              color="orange"
            />
          </div>

          {/* Focus Sounds Section */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
              <Icon icon="solar:soundwave-bold" className="size-4" />
              Focus
            </h3>
            
            <SoundSlider
              label="White Noise"
              icon="solar:soundwave-bold"
              volume={soundVolumes.whiteNoise}
              onChange={(v) => handleSoundVolumeChange('whiteNoise', v)}
              color="gray"
            />
            
            <SoundSlider
              label="Pink Noise"
              icon="solar:soundwave-circle-bold"
              volume={soundVolumes.pinkNoise}
              onChange={(v) => handleSoundVolumeChange('pinkNoise', v)}
              color="pink"
            />
            
            <SoundSlider
              label="Brown Noise"
              icon="solar:soundwave-square-bold"
              volume={soundVolumes.brownNoise}
              onChange={(v) => handleSoundVolumeChange('brownNoise', v)}
              color="brown"
            />
          </div>

          {/* Meditation Sounds Section */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-2">
              <Icon icon="solar:meditation-round-bold" className="size-4" />
              Meditation
            </h3>
            
            <SoundSlider
              label="Heartbeat"
              icon="solar:heart-pulse-bold"
              volume={soundVolumes.heartbeat}
              onChange={(v) => handleSoundVolumeChange('heartbeat', v)}
              color="red"
            />
            
            <SoundSlider
              label="Breathing Guide"
              icon="solar:wind-bold"
              volume={soundVolumes.breathingGuide}
              onChange={(v) => handleSoundVolumeChange('breathingGuide', v)}
              color="teal"
              description="4-7-8 pattern"
            />
            
            <SoundSlider
              label="Tibetan Bowl"
              icon="solar:meditation-bold"
              volume={soundVolumes.tibetanBowl}
              onChange={(v) => handleSoundVolumeChange('tibetanBowl', v)}
              color="amber"
            />
          </div>

          {/* Horror Sounds Section */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs uppercase tracking-wider text-red-400 font-semibold flex items-center gap-2">
              <Icon icon="solar:ghost-bold" className="size-4" />
              Horror
            </h3>
            
            <SoundSlider
              label="Whispers"
              icon="solar:ghost-bold"
              volume={soundVolumes.whispers}
              onChange={(v) => handleSoundVolumeChange('whispers', v)}
              color="red"
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-xs text-zinc-500 italic font-['Crimson_Text'] text-center">
              Mix sounds to create your perfect writing atmosphere
            </p>
          </div>
        </div>
      ) : activeTab === 'lexicon' ? (
        /* Tab 2: Lexicon - Vocabulary Search */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-none px-5 py-4">
            <div className="relative">
              <Icon 
                icon="solar:magnifer-bold" 
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a word..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {isLoadingSynonyms ? (
              <div className="text-center py-12">
                <div className="relative size-12 mx-auto mb-3">
                  <Icon 
                    icon="solar:ghost-bold" 
                    className="size-12 text-amber-500 animate-pulse" 
                  />
                  <div className="absolute inset-0 animate-spin">
                    <Icon 
                      icon="solar:star-bold" 
                      className="size-3 text-amber-400 absolute top-0 left-1/2 -translate-x-1/2" 
                    />
                  </div>
                </div>
                <p className="text-sm text-amber-400 font-['Crimson_Text'] italic animate-pulse">
                  Summoning the spirits...
                </p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-3 flex items-center gap-2">
                  <Icon icon="solar:magic-stick-3-bold" className="size-4" />
                  Cursed Synonyms
                </h3>
                <div className="space-y-1.5">
                  {searchResults.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleCopyWord(word)}
                      className={clsx(
                        "w-full text-left px-3 py-2 rounded-lg transition-all",
                        "bg-zinc-900/30 hover:bg-amber-950/30",
                        copiedWord === word
                          ? "text-amber-400"
                          : "text-zinc-300 hover:text-amber-300"
                      )}
                      style={{
                        border: copiedWord === word 
                          ? '1px solid rgba(251, 191, 36, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <span className="font-['Crimson_Text'] text-base">{word}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : synonymError ? (
              <div className="text-center py-12">
                <Icon icon="solar:ghost-bold" className="size-12 mx-auto text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-500 font-['Crimson_Text'] italic">
                  {synonymError}
                </p>
                <p className="text-xs text-zinc-600 mt-2">
                  Try another word
                </p>
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-12">
                <Icon icon="solar:ghost-bold" className="size-12 mx-auto text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-500 font-['Crimson_Text'] italic">
                  No synonyms found for "{searchQuery}"
                </p>
                <p className="text-xs text-zinc-600 mt-2">
                  Try: red, dark, death, fear, cold, pain
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon icon="solar:book-bold" className="size-12 mx-auto text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-500 font-['Crimson_Text'] italic">
                  Search for cursed synonyms
                </p>
                <p className="text-xs text-zinc-600 mt-2">
                  Powered by AI • Try any word
                </p>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'anatomy' ? (
        /* Tab 3: Anatomy - Notes (existing Synopsis) */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Ritual Progress - Gothic Horror Progress Bar */}
          <div className="flex-none px-4 py-3 relative z-[51]">
            <div className="flex items-center justify-between mb-2">
              <span className="antique-caps text-[10px] text-red-300">Blood to Spill</span>
              <div className="flex items-center gap-2">
                {activeDocument.wordGoal && activeDocument.wordGoal > 0 ? (
                  <input
                    type="number"
                    value={activeDocument.wordGoal}
                    onChange={(e) => onUpdateWordGoal(parseInt(e.target.value) || 0)}
                    className="w-16 px-1 py-0.5 text-[10px] font-mono text-slate-300 bg-transparent border-b border-slate-600 hover:border-slate-400 focus:border-amber-500 focus:outline-none transition-colors text-right"
                    min="0"
                    step="50"
                  />
                ) : (
                  <div className="flex gap-1">
                    {[250, 500, 1000].map(preset => (
                      <button
                        key={preset}
                        onClick={() => onUpdateWordGoal(preset)}
                        className="px-2 py-0.5 text-[9px] font-mono text-zinc-400 hover:text-red-300 hover:bg-red-950/30 rounded transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {activeDocument.wordGoal && activeDocument.wordGoal > 0 ? (
              <>
                {/* Ritual Progress Bar - Glass Tube with Liquid Effect */}
                <div 
                  className={clsx(
                    "relative h-6 rounded-full overflow-hidden mb-2",
                    "bg-gradient-to-b from-black/60 to-black/80",
                    "border-2 border-stone-800/80",
                    "shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),inset_0_-1px_2px_rgba(255,255,255,0.1)]",
                    Math.min((activeDocument.wordCount / activeDocument.wordGoal) * 100, 100) >= 100 && "animate-pulse-gold"
                  )}
                  style={{
                    // Carved groove texture
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='groove'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23groove)' opacity='0.15'/%3E%3C/svg%3E")`,
                    backgroundSize: '50px 50px',
                  }}
                >
                  {/* Liquid fill with gradient and pulse */}
                  <div
                    className={clsx(
                      "absolute left-0 top-0 h-full transition-all duration-700 ease-out",
                      Math.min((activeDocument.wordCount / activeDocument.wordGoal) * 100, 100) >= 100
                        ? "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-pulse"
                        : "bg-gradient-to-r from-red-900 via-red-600 to-red-900 shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-pulse-subtle"
                    )}
                    style={{
                      width: `${Math.min((activeDocument.wordCount / activeDocument.wordGoal) * 100, 100)}%`,
                      backgroundSize: '200% 100%',
                      animation: Math.min((activeDocument.wordCount / activeDocument.wordGoal) * 100, 100) >= 100
                        ? 'shimmer 2s ease-in-out infinite, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        : 'shimmer 3s ease-in-out infinite, pulse-subtle 3s ease-in-out infinite',
                    }}
                  />
                  
                  {/* Glass tube shine - top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-full" />
                  
                  {/* Glass tube shadow - bottom depth */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-full" />
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>{activeDocument.wordCount} words</span>
                  <span className={clsx(
                    "font-semibold",
                    Math.min((activeDocument.wordCount / activeDocument.wordGoal) * 100, 100) >= 100
                      ? "text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
                      : "text-red-400 drop-shadow-[0_0_4px_rgba(220,38,38,0.6)]"
                  )}>
                    {Math.min(Math.round((activeDocument.wordCount / activeDocument.wordGoal) * 100), 100)}%
                  </span>
                </div>
              </>
            ) : (
              <div 
                className="relative h-6 rounded-full overflow-hidden border-2 border-stone-800/80 bg-gradient-to-b from-black/60 to-black/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),inset_0_-1px_2px_rgba(255,255,255,0.1)]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='groove'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23groove)' opacity='0.15'/%3E%3C/svg%3E")`,
                  backgroundSize: '50px 50px',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none rounded-full" />
              </div>
            )}
          </div>

          {/* Document Statistics - Only show if there's content */}
          {activeDocument.wordCount > 0 && (
            <div className="flex-none px-4 py-3 border-b border-white/5">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col">
                  <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Words</div>
                  <div className="text-zinc-200 font-semibold font-mono">{activeDocument.wordCount.toLocaleString()}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Reading</div>
                  <div className="text-zinc-200 font-semibold font-mono">{Math.ceil(activeDocument.wordCount / 200)} min</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Modified</div>
                  <div className="text-zinc-200 font-semibold text-[11px]">{new Date(activeDocument.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Paragraphs</div>
                  <div className="text-zinc-200 font-semibold font-mono">{(activeDocument.content?.split('\n\n') || []).filter(p => p.trim()).length}</div>
                </div>
              </div>
            </div>
          )}

          {/* Synopsis - Physical Artifact Style with Lighter Background */}
          <div className="flex-1 flex flex-col overflow-hidden px-4 py-3">
            <div className="bg-[#2a2725] border border-stone-700 rounded-lg p-4 shadow-inner">
              <label className="block mb-2 text-xs text-stone-400 uppercase tracking-wider font-semibold">Notes</label>
              <Textarea
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                onBlur={() => onUpdateSynopsis(synopsis)}
                placeholder="Add notes about this document..."
                spellCheck={false}
                className="w-full bg-transparent border-none p-0 text-sm text-stone-200 leading-relaxed resize-none focus:ring-0 focus:outline-none placeholder:text-stone-500 caret-red-400"
                style={{ minHeight: '120px', fontFamily: "'Courier Prime', 'Courier New', monospace" }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Copied Toast - Show when word is copied */}
      {copiedWord && (
        <div className="fixed bottom-6 right-6 bg-amber-900/90 border border-amber-400 px-4 py-2 rounded-lg shadow-lg animate-in fade-in duration-200 z-50">
          <p className="text-xs text-amber-200 font-mono">
            Copied: <span className="font-['Crimson_Text'] font-semibold">{copiedWord}</span>
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Sound Slider Component
 */
interface SoundSliderProps {
  label: string;
  icon: string;
  volume: number;
  onChange: (volume: number) => void;
  color: 'red' | 'blue' | 'green' | 'amber' | 'purple' | 'orange' | 'gray' | 'pink' | 'brown' | 'cyan' | 'teal';
  description?: string;
}

function SoundSlider({ label, icon, volume, onChange, color, description }: SoundSliderProps) {
  const colorMap = {
    red: '#dc2626',
    blue: '#3b82f6',
    green: '#22c55e',
    amber: '#f59e0b',
    purple: '#a855f7',
    orange: '#f97316',
    gray: '#6b7280',
    pink: '#ec4899',
    brown: '#92400e',
    cyan: '#06b6d4',
    teal: '#14b8a6',
  };

  const colorValue = colorMap[color];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon={icon} className="size-3.5 text-zinc-400" />
          <label className="text-xs text-zinc-300 font-medium">
            {label}
          </label>
          {description && (
            <span className="text-[10px] text-zinc-500 italic">({description})</span>
          )}
        </div>
        <span className="text-xs font-mono text-zinc-500 min-w-[32px] text-right">
          {volume}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer transition-all hover:h-2"
        style={{
          background: `linear-gradient(to right, ${colorValue} 0%, ${colorValue} ${volume}%, #27272a ${volume}%, #27272a 100%)`,
        }}
      />
    </div>
  );
}
