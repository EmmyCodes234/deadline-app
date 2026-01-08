import { Howl } from 'howler';

// Audio file URLs
const AUDIO_URLS = {
  // Music
  MUSIC_AMBIENT: 'https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3',
  
  // Ambience
  AMBIENCE_SAFE: 'https://assets.mixkit.co/active_storage/sfx/2022/2022-preview.mp3',
  AMBIENCE_PANIC: 'https://assets.mixkit.co/active_storage/sfx/2111/2111-preview.mp3', // Heartbeat
  
  // SFX - Typewriter sounds (5 variations)
  TYPEWRITER_1: 'https://assets.mixkit.co/active_storage/sfx/2366/2366-preview.mp3',
  TYPEWRITER_2: 'https://assets.mixkit.co/active_storage/sfx/2366/2366-preview.mp3',
  TYPEWRITER_3: 'https://assets.mixkit.co/active_storage/sfx/2366/2366-preview.mp3',
  TYPEWRITER_4: 'https://assets.mixkit.co/active_storage/sfx/2366/2366-preview.mp3',
  TYPEWRITER_5: 'https://assets.mixkit.co/active_storage/sfx/2366/2366-preview.mp3',
  
  // Other SFX
  DING: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  GLITCH: 'https://assets.mixkit.co/active_storage/sfx/2067/2067-preview.mp3',
  WHISPER_1: 'https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3',
  WHISPER_2: 'https://assets.mixkit.co/active_storage/sfx/2488/2488-preview.mp3',
  WHISPER_3: 'https://assets.mixkit.co/active_storage/sfx/2489/2489-preview.mp3',
  WHISPER_4: 'https://assets.mixkit.co/active_storage/sfx/2490/2490-preview.mp3',
};

// type AudioChannel = 'music' | 'ambience' | 'sfx';

interface AudioSettings {
  musicEnabled: boolean;
  ambienceEnabled: boolean;
  sfxEnabled: boolean;
  masterVolume: number;
}

class AudioManager {
  private static instance: AudioManager;
  
  // Audio channels
  private musicSounds: Map<string, Howl> = new Map();
  private ambienceSounds: Map<string, Howl> = new Map();
  private sfxSounds: Map<string, Howl> = new Map();
  
  // Typewriter samples
  private typewriterSamples: Howl[] = [];
  
  // Settings
  private settings: AudioSettings = {
    musicEnabled: true,
    ambienceEnabled: true,
    sfxEnabled: true,
    masterVolume: 0.7,
  };
  
  // Current tension level (0 = safe, 1 = panic)
  private currentTension: number = 0;
  
  private constructor() {
    this.initializeAudio();
  }
  
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
  
  private initializeAudio(): void {
    // Initialize ambience tracks
    this.ambienceSounds.set('safe', new Howl({
      src: [AUDIO_URLS.AMBIENCE_SAFE],
      loop: true,
      volume: 0,
    }));
    
    this.ambienceSounds.set('panic', new Howl({
      src: [AUDIO_URLS.AMBIENCE_PANIC],
      loop: true,
      volume: 0,
    }));
    
    // Initialize typewriter samples (5 variations)
    this.typewriterSamples = [
      new Howl({ src: [AUDIO_URLS.TYPEWRITER_1], volume: 0.3 }),
      new Howl({ src: [AUDIO_URLS.TYPEWRITER_2], volume: 0.3 }),
      new Howl({ src: [AUDIO_URLS.TYPEWRITER_3], volume: 0.3 }),
      new Howl({ src: [AUDIO_URLS.TYPEWRITER_4], volume: 0.3 }),
      new Howl({ src: [AUDIO_URLS.TYPEWRITER_5], volume: 0.3 }),
    ];
    
    // Initialize other SFX
    this.sfxSounds.set('ding', new Howl({
      src: [AUDIO_URLS.DING],
      volume: 0.5,
    }));
    
    this.sfxSounds.set('glitch', new Howl({
      src: [AUDIO_URLS.GLITCH],
      volume: 0.7,
    }));
    
    // Initialize whispers
    this.sfxSounds.set('whisper1', new Howl({
      src: [AUDIO_URLS.WHISPER_1],
      volume: 0.15,
      rate: 0.8,
    }));
    
    this.sfxSounds.set('whisper2', new Howl({
      src: [AUDIO_URLS.WHISPER_2],
      volume: 0.15,
      rate: 0.8,
    }));
    
    this.sfxSounds.set('whisper3', new Howl({
      src: [AUDIO_URLS.WHISPER_3],
      volume: 0.15,
      rate: 0.8,
    }));
    
    this.sfxSounds.set('whisper4', new Howl({
      src: [AUDIO_URLS.WHISPER_4],
      volume: 0.15,
      rate: 0.8,
    }));
    
    // Start ambience tracks (at 0 volume)
    this.ambienceSounds.get('safe')?.play();
    this.ambienceSounds.get('panic')?.play();
  }
  
  // Settings management
  public updateSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.applySettings();
  }
  
  public getSettings(): AudioSettings {
    return { ...this.settings };
  }
  
  private applySettings(): void {
    // Apply mute/unmute based on settings
    const musicVolume = this.settings.musicEnabled ? this.settings.masterVolume : 0;
    const sfxVolume = this.settings.sfxEnabled ? this.settings.masterVolume : 0;
    
    // Update music volumes
    this.musicSounds.forEach(sound => {
      const currentVolume = sound.volume();
      if (currentVolume > 0) {
        sound.volume(musicVolume);
      }
    });
    
    // Update ambience volumes (respecting tension levels)
    this.updateTension(this.currentTension);
    
    // Update SFX base volumes
    this.typewriterSamples.forEach(sample => {
      sample.volume(0.3 * sfxVolume);
    });
    
    this.sfxSounds.forEach(sound => {
      const baseVolume = sound.volume();
      sound.volume(baseVolume * sfxVolume);
    });
  }
  
  // Keystroke function with randomization
  public playKeystroke(): void {
    if (!this.settings.sfxEnabled) return;
    
    // Randomly select one of the 5 typewriter samples
    const randomIndex = Math.floor(Math.random() * this.typewriterSamples.length);
    const sample = this.typewriterSamples[randomIndex];
    
    // Randomize playback rate (0.9 to 1.1)
    const randomRate = 0.9 + Math.random() * 0.2;
    sample.rate(randomRate);
    
    // Play the sample
    sample.play();
  }
  
  // Tension function with cross-fade
  public updateTension(patienceLevel: number): void {
    if (!this.settings.ambienceEnabled) return;
    
    // Normalize patience level to 0-1 (0 = panic, 1 = safe)
    const normalizedPatience = Math.max(0, Math.min(1, patienceLevel));
    
    // Invert for tension (0 = safe, 1 = panic)
    const tension = 1 - normalizedPatience;
    this.currentTension = tension;
    
    const safeSound = this.ambienceSounds.get('safe');
    const panicSound = this.ambienceSounds.get('panic');
    
    if (!safeSound || !panicSound) return;
    
    // Calculate volumes with cross-fade
    const safeVolume = (1 - tension) * this.settings.masterVolume * 0.3;
    const panicVolume = tension * this.settings.masterVolume * 0.8;
    
    // Apply cross-fade
    safeSound.volume(safeVolume);
    panicSound.volume(panicVolume);
  }
  
  // Play specific SFX
  public playSFX(soundName: string): void {
    if (!this.settings.sfxEnabled) return;
    
    const sound = this.sfxSounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }
  
  // Play spatial whisper with 3D positioning
  public playSpatialWhisper(): void {
    if (!this.settings.sfxEnabled) return;
    
    const whisperKeys = ['whisper1', 'whisper2', 'whisper3', 'whisper4'];
    const randomKey = whisperKeys[Math.floor(Math.random() * whisperKeys.length)];
    const whisper = this.sfxSounds.get(randomKey);
    
    if (!whisper) return;
    
    // Random stereo panning (-1 = left, 1 = right)
    const panValue = Math.random() > 0.5 
      ? Math.random() * 0.8 + 0.2 
      : -(Math.random() * 0.8 + 0.2);
    
    whisper.stereo(panValue);
    
    // Randomize volume slightly for variation
    const volumeVariation = (0.1 + Math.random() * 0.15) * this.settings.masterVolume;
    whisper.volume(volumeVariation);
    
    whisper.play();
  }
  
  // Music controls
  public playMusic(trackName: string, volume: number = 0.5): void {
    if (!this.settings.musicEnabled) return;
    
    const music = this.musicSounds.get(trackName);
    if (music && !music.playing()) {
      music.volume(volume * this.settings.masterVolume);
      music.play();
    }
  }
  
  public stopMusic(trackName: string, fadeOut: number = 1000): void {
    const music = this.musicSounds.get(trackName);
    if (music && music.playing()) {
      music.fade(music.volume(), 0, fadeOut);
      setTimeout(() => music.stop(), fadeOut);
    }
  }
  
  // Cleanup
  public destroy(): void {
    this.musicSounds.forEach(sound => {
      sound.stop();
      sound.unload();
    });
    
    this.ambienceSounds.forEach(sound => {
      sound.stop();
      sound.unload();
    });
    
    this.sfxSounds.forEach(sound => {
      sound.unload();
    });
    
    this.typewriterSamples.forEach(sample => {
      sample.unload();
    });
    
    this.musicSounds.clear();
    this.ambienceSounds.clear();
    this.sfxSounds.clear();
    this.typewriterSamples = [];
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();
