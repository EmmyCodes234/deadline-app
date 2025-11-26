/**
 * HorrorAudio - Singleton audio engine for tactile UI feedback
 * Uses Web Audio API oscillators for instant, zero-latency sound effects
 */

class HorrorAudio {
  private static instance: HorrorAudio;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private constructor() {
    // Private constructor for singleton
  }

  static getInstance(): HorrorAudio {
    if (!HorrorAudio.instance) {
      HorrorAudio.instance = new HorrorAudio();
    }
    return HorrorAudio.instance;
  }

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  private init() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize audio context:', error);
    }
  }

  /**
   * Start ambient atmosphere (call on first user interaction)
   */
  startAmbience() {
    this.init();
    // Could add ambient drone here if needed
  }

  /**
   * Play hover sound - low frequency thrum
   */
  playHover() {
    if (!this.audioContext || !this.masterGain || this.isMuted) {
      this.init();
      if (!this.audioContext || !this.masterGain) return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  /**
   * Play click sound - heavy metallic clunk
   */
  playClick() {
    if (!this.audioContext || !this.masterGain || this.isMuted) {
      this.init();
      if (!this.audioContext || !this.masterGain) return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1, now);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(now);
    oscillator.stop(now + 0.08);
  }

  /**
   * Play switch sound - sharp tick for toggles
   */
  playSwitch() {
    if (!this.audioContext || !this.masterGain || this.isMuted) {
      this.init();
      if (!this.audioContext || !this.masterGain) return;
    }

    const now = this.audioContext.currentTime;
    const bufferSize = this.audioContext.sampleRate * 0.03;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3000, now);
    filter.Q.setValueAtTime(2, now);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(now);
  }

  /**
   * Play keystroke sound - typewriter click
   */
  playKeystroke() {
    if (!this.audioContext || !this.masterGain || this.isMuted) {
      this.init();
      if (!this.audioContext || !this.masterGain) return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.02);

    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(now);
    oscillator.stop(now + 0.03);
  }

  /**
   * Play error sound - harsh glitch
   */
  playError() {
    if (!this.audioContext || !this.masterGain || this.isMuted) {
      this.init();
      if (!this.audioContext || !this.masterGain) return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.15);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  /**
   * Set tension level (0-100) - affects ambient drone intensity
   */
  setTension(level: number) {
    // Could modulate ambient drone based on tension
    // For now, just a placeholder for future enhancement
    if (!this.audioContext || !this.masterGain) return;
    
    // Normalize to 0-1
    const normalized = Math.max(0, Math.min(100, level)) / 100;
    
    // Could add tension-based ambient effects here
    console.debug('Tension level:', normalized);
  }

  /**
   * Toggle mute state
   */
  toggleMute(shouldMute: boolean) {
    this.isMuted = shouldMute;
    
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(shouldMute ? 0 : 1, this.audioContext!.currentTime);
    }

    if (this.audioContext) {
      if (shouldMute) {
        this.audioContext.suspend();
      } else {
        this.audioContext.resume();
      }
    }
  }

  /**
   * Get current mute state
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play static zap sound - quick glitch for page transitions
   */
  playStaticZap() {
    if (!this.audioContext || !this.masterGain || this.isMuted) {
      this.init();
      if (!this.audioContext || !this.masterGain) return;
    }

    const now = this.audioContext.currentTime;
    
    // Create a short burst of white noise
    const bufferSize = this.audioContext.sampleRate * 0.08;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise with quick decay
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;

    // Highpass filter for sharp zap sound
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4000, now);
    filter.Q.setValueAtTime(1, now);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(now);
  }

  /**
   * Play incinerate sound - paper crumple/match extinguish for delete effect
   */
  playIncinerate() {
    if (!this.audioContext || !this.masterGain || this.isMuted) {
      this.init();
      if (!this.audioContext || !this.masterGain) return;
    }

    const now = this.audioContext.currentTime;
    
    // Create a crumpling/crackling sound using noise
    const bufferSize = this.audioContext.sampleRate * 0.4;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate crackling noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;

    // Bandpass filter for paper-like crumple
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.4);
    filter.Q.setValueAtTime(3, now);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(now);
  }

  /**
   * Play growl sound - low menacing growl for "don't leave" effect
   */
  playGrowl() {
    if (!this.audioContext || !this.masterGain || this.isMuted) {
      this.init();
      if (!this.audioContext || !this.masterGain) return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.type = 'sawtooth';
    // Start low, drop lower
    oscillator.frequency.setValueAtTime(100, now);
    oscillator.frequency.exponentialRampToValueAtTime(20, now + 0.8);

    // Lowpass filter opening and closing to simulate a "breath"
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.2);
    filter.frequency.linearRampToValueAtTime(100, now + 0.8);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.8);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.start(now);
    oscillator.stop(now + 1);
  }
}

// Export singleton instance
export const horrorAudio = HorrorAudio.getInstance();
