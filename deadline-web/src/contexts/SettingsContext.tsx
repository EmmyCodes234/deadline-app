import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  // Atmosphere settings
  typewriterSounds: boolean;
  setTypewriterSounds: (value: boolean) => void;
  ghostMode: boolean;
  setGhostMode: (value: boolean) => void;
  ambientNoise: string;
  setAmbientNoise: (value: string) => void;
  
  // Inscription settings
  fontFace: string;
  setFontFace: (value: string) => void;
  fontSize: number;
  setFontSize: (value: number) => void;
  
  // Actions
  resetAllSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS = {
  typewriterSounds: true,
  ghostMode: false,
  ambientNoise: 'Silence',
  fontFace: 'Inter',
  fontSize: 16,
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Load settings from localStorage or use defaults
  const [typewriterSounds, setTypewriterSoundsState] = useState(() => {
    const saved = localStorage.getItem('epitaph-typewriter-sounds');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS.typewriterSounds;
  });

  const [ghostMode, setGhostModeState] = useState(() => {
    const saved = localStorage.getItem('epitaph-ghost-mode');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS.ghostMode;
  });

  const [ambientNoise, setAmbientNoiseState] = useState(() => {
    const saved = localStorage.getItem('epitaph-ambient-noise');
    return saved ? saved : DEFAULT_SETTINGS.ambientNoise;
  });

  const [fontFace, setFontFaceState] = useState(() => {
    const saved = localStorage.getItem('epitaph-font-face');
    return saved ? saved : DEFAULT_SETTINGS.fontFace;
  });

  const [fontSize, setFontSizeState] = useState(() => {
    const saved = localStorage.getItem('epitaph-font-size');
    return saved ? parseInt(saved) : DEFAULT_SETTINGS.fontSize;
  });

  // Wrapper functions that save to localStorage
  const setTypewriterSounds = (value: boolean) => {
    setTypewriterSoundsState(value);
    localStorage.setItem('epitaph-typewriter-sounds', JSON.stringify(value));
  };

  const setGhostMode = (value: boolean) => {
    setGhostModeState(value);
    localStorage.setItem('epitaph-ghost-mode', JSON.stringify(value));
    
    // Apply ghost mode styling to body
    if (value) {
      document.body.classList.add('ghost-mode');
    } else {
      document.body.classList.remove('ghost-mode');
    }
  };

  const setAmbientNoise = (value: string) => {
    setAmbientNoiseState(value);
    localStorage.setItem('epitaph-ambient-noise', value);
  };

  const setFontFace = (value: string) => {
    setFontFaceState(value);
    localStorage.setItem('epitaph-font-face', value);
    
    // Apply font face to document
    const fontFamily = value === 'Inter' ? 'Inter, sans-serif' : 
                      value === 'Serif' ? 'serif' : 
                      'monospace';
    document.documentElement.style.setProperty('--editor-font-family', fontFamily);
  };

  const setFontSize = (value: number) => {
    setFontSizeState(value);
    localStorage.setItem('epitaph-font-size', value.toString());
    
    // Apply font size to document
    document.documentElement.style.setProperty('--editor-font-size', `${value}px`);
  };

  const resetAllSettings = () => {
    setTypewriterSounds(DEFAULT_SETTINGS.typewriterSounds);
    setGhostMode(DEFAULT_SETTINGS.ghostMode);
    setAmbientNoise(DEFAULT_SETTINGS.ambientNoise);
    setFontFace(DEFAULT_SETTINGS.fontFace);
    setFontSize(DEFAULT_SETTINGS.fontSize);
    
    // Clear localStorage
    localStorage.removeItem('epitaph-typewriter-sounds');
    localStorage.removeItem('epitaph-ghost-mode');
    localStorage.removeItem('epitaph-ambient-noise');
    localStorage.removeItem('epitaph-font-face');
    localStorage.removeItem('epitaph-font-size');
    
    // Reset document styles
    document.body.classList.remove('ghost-mode');
    document.documentElement.style.removeProperty('--editor-font-family');
    document.documentElement.style.removeProperty('--editor-font-size');
  };

  // Apply settings on mount
  useEffect(() => {
    if (ghostMode) {
      document.body.classList.add('ghost-mode');
    }
    
    const fontFamily = fontFace === 'Inter' ? 'Inter, sans-serif' : 
                      fontFace === 'Serif' ? 'serif' : 
                      'monospace';
    document.documentElement.style.setProperty('--editor-font-family', fontFamily);
    document.documentElement.style.setProperty('--editor-font-size', `${fontSize}px`);
  }, []);

  const value = {
    typewriterSounds,
    setTypewriterSounds,
    ghostMode,
    setGhostMode,
    ambientNoise,
    setAmbientNoise,
    fontFace,
    setFontFace,
    fontSize,
    setFontSize,
    resetAllSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}