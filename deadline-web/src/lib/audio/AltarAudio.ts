/**
 * Altar of Whispers Audio System
 * Enhanced audio utilities for the Dark Arts sidebar
 * Provides spatial audio, whispers, and atmospheric effects
 */

export class AltarAudio {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private whisperNodes: Map<string, AudioNode[]> = new Map();
  private spatialPanner: StereoPannerNode | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.8;
    } catch (error) {
      console.error('Failed to initialize Altar audio context:', error);
    }
  }

  /**
   * Play a spatial whisper effect
   * @param direction - Pan direction: -1 (left) to 1 (right)
   * @param intensity - Volume intensity 0-1
   */
  public playSpatialWhisper(direction: number = 0, intensity: number = 0.3) {
    if (!this.audioContext || !this.masterGain) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Create whisper-like sound using filtered noise
    const bufferSize = this.audioContext.sampleRate * 0.5;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = noiseBuffer;

    // Band-pass filter for voice-like quality
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200 + Math.random() * 800;
    filter.Q.value = 8;

    // Spatial panning
    const panner = this.audioContext.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, direction));

    // Envelope
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(intensity, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);

    // Connect nodes
    noise.connect(filter);
    filter.connect(panner);
    panner.connect(gainNode);
    gainNode.connect(this.masterGain);

    noise.start(this.audioContext.currentTime);
    noise.stop(this.audioContext.currentTime + 0.8);
  }

  /**
   * Play a word copy confirmation sound
   */
  public playWordCopySound() {
    if (!this.audioContext || !this.masterGain) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Create a pleasant "ding" sound
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 800;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Play tab switch sound
   */
  public playTabSwitchSound() {
    if (!this.audioContext || !this.masterGain) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Create a subtle page turn sound
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.15);

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  /**
   * Play AI summoning sound (when searching for synonyms)
   */
  public playAISummoningSound() {
    if (!this.audioContext || !this.masterGain) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Create an ethereal "summoning" sound
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 220;

    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 330;

    const osc3 = this.audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 440;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(this.audioContext.currentTime);
    osc2.start(this.audioContext.currentTime + 0.1);
    osc3.start(this.audioContext.currentTime + 0.2);
    
    osc1.stop(this.audioContext.currentTime + 1.5);
    osc2.stop(this.audioContext.currentTime + 1.5);
    osc3.stop(this.audioContext.currentTime + 1.5);
  }

  /**
   * Play slider adjustment sound
   */
  public playSliderSound(value: number) {
    if (!this.audioContext || !this.masterGain) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Create a subtle click sound with pitch based on value
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 200 + (value * 5); // Higher pitch for higher values

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  /**
   * Play ambient whisper loop (for horror atmosphere)
   */
  public startAmbientWhispers(intensity: number = 0.2) {
    if (!this.audioContext || !this.masterGain) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Stop existing whispers
    this.stopAmbientWhispers();

    const nodes: AudioNode[] = [];

    // Create continuous whisper-like sound
    const bufferSize = this.audioContext.sampleRate * 4;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Multiple band-pass filters for voice-like quality
    const filter1 = this.audioContext.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.value = 1000;
    filter1.Q.value = 5;

    const filter2 = this.audioContext.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.value = 2000;
    filter2.Q.value = 5;

    // LFO for movement
    const lfo = this.audioContext.createOscillator();
    lfo.frequency.value = 0.2;
    const lfoGain = this.audioContext.createGain();
    lfoGain.gain.value = 400;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter1.frequency);

    // Gain control
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = intensity;

    // Connect nodes
    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(gainNode);
    gainNode.connect(this.masterGain);

    noise.start();
    lfo.start();

    nodes.push(noise, filter1, filter2, lfo, lfoGain, gainNode);
    this.whisperNodes.set('ambient', nodes);
  }

  /**
   * Stop ambient whisper loop
   */
  public stopAmbientWhispers() {
    const nodes = this.whisperNodes.get('ambient');
    if (nodes) {
      nodes.forEach(node => {
        try {
          if ('stop' in node && typeof node.stop === 'function') {
            node.stop();
          }
          node.disconnect();
        } catch (e) {
          // Ignore cleanup errors
        }
      });
      this.whisperNodes.delete('ambient');
    }
  }

  /**
   * Set master volume
   */
  public setMasterVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.masterGain.context.currentTime + 0.1
      );
    }
  }

  /**
   * Cleanup resources
   */
  public dispose() {
    this.stopAmbientWhispers();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
