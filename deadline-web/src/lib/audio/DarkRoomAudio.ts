class DarkRoomAudioEngine {
  private audioContext: AudioContext | null = null;
  private ambienceNode: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;
  private ambienceFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioContext.destination);
    }
  }

  private ensureContext() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Geiger counter click - increases in frequency/volume as distance to trap decreases
   * @param distance - Distance to nearest trap (0-1, where 0 is very close)
   */
  playGeigerClick(distance: number) {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    // Higher pitch and volume when closer (distance closer to 0)
    const intensity = 1 - distance;
    osc.frequency.value = 800 + (intensity * 1200); // 800Hz to 2000Hz
    
    gain.gain.setValueAtTime(intensity * 0.3, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  /**
   * Searing sound - fire/burning when word is successfully typed
   */
  playSearing() {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    // Create noise buffer for fire sound
    const bufferSize = this.audioContext.sampleRate * 0.5;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 1;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start();
    noise.stop(this.audioContext.currentTime + 0.5);
  }

  /**
   * Shatter sound - loud glass breaking for failure
   */
  playShatter() {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    // Create noise burst for glass shatter
    const bufferSize = this.audioContext.sampleRate * 0.8;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start();
    noise.stop(this.audioContext.currentTime + 0.8);
  }

  /**
   * Start ambient drone - low ominous background
   */
  startAmbience() {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    if (this.ambienceNode) return; // Already playing

    // Create pink noise
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    
    this.ambienceFilter = this.audioContext.createBiquadFilter();
    this.ambienceFilter.type = 'lowpass';
    this.ambienceFilter.frequency.value = 200;
    this.ambienceFilter.Q.value = 1;
    
    this.ambienceGain = this.audioContext.createGain();
    this.ambienceGain.gain.value = 0.15;
    
    noise.connect(this.ambienceFilter);
    this.ambienceFilter.connect(this.ambienceGain);
    this.ambienceGain.connect(this.masterGain);
    
    noise.start();
    this.ambienceNode = noise as any;
  }

  /**
   * Update ambience based on battery level
   * @param batteryLevel - 0-100
   */
  updateAmbienceForBattery(batteryLevel: number) {
    if (!this.ambienceFilter || !this.audioContext) return;
    
    // Map battery to filter frequency
    // 100% = 200Hz (muffled), 0% = 2000Hz (harsh/screeching)
    const frequency = 200 + (100 - batteryLevel) * 18;
    this.ambienceFilter.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );
  }

  /**
   * Stop ambient drone
   */
  stopAmbience() {
    if (this.ambienceNode && this.audioContext) {
      this.ambienceNode.stop();
      this.ambienceNode = null;
      this.ambienceGain = null;
      this.ambienceFilter = null;
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopAmbience();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export const darkRoomAudio = new DarkRoomAudioEngine();
