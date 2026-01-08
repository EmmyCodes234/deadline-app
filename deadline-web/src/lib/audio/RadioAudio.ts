class RadioAudioEngine {
  private audioContext: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  
  private carrierOsc: OscillatorNode | null = null;
  private carrierGain: GainNode | null = null;
  
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isInitialized = false;

  // Generate pink noise buffer
  private createNoiseBuffer(): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    // Pink noise generation (1/f noise)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // Reduce volume
      b6 = white * 0.115926;
    }
    
    return buffer;
  }

  initialize() {
    if (this.isInitialized) return;

    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.3;
    
    // Create analyser for visualization
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;
    
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    // Create pink noise (static)
    const noiseBuffer = this.createNoiseBuffer();
    this.noiseNode = this.audioContext.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Noise filter (bandpass - simulates radio band)
    this.noiseFilter = this.audioContext.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.value = 1000;
    this.noiseFilter.Q.value = 0.5;

    // Noise gain
    this.noiseGain = this.audioContext.createGain();
    this.noiseGain.gain.value = 1.0;

    // Connect noise chain
    this.noiseNode.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    // Create carrier signal (the whine)
    this.carrierOsc = this.audioContext.createOscillator();
    this.carrierOsc.type = 'sine';
    this.carrierOsc.frequency.value = 2000;

    this.carrierGain = this.audioContext.createGain();
    this.carrierGain.gain.value = 0;

    this.carrierOsc.connect(this.carrierGain);
    this.carrierGain.connect(this.masterGain);

    // Start everything
    this.noiseNode.start();
    this.carrierOsc.start();

    this.isInitialized = true;
  }

  // Update based on frequency (simulates tuning the dial)
  updateFrequency(frequency: number) {
    if (!this.noiseFilter) return;

    // Map frequency (88-108 MHz) to filter frequency (500-5000 Hz)
    const filterFreq = 500 + ((frequency - 88) / 20) * 4500;
    this.noiseFilter.frequency.setValueAtTime(filterFreq, this.audioContext!.currentTime);
  }

  // Update based on signal strength
  updateSignalStrength(strength: number) {
    if (!this.noiseGain || !this.carrierGain) return;

    const now = this.audioContext!.currentTime;

    // Static volume decreases as signal improves
    const staticVolume = 1.0 - (strength * 0.8);
    this.noiseGain.gain.setTargetAtTime(staticVolume, now, 0.1);

    // Carrier whine increases near target with pitch matching
    // When very close (> 0.9), increase volume significantly for "HOLD THIS" feedback
    const carrierVolume = strength > 0.9 ? strength * 0.25 : strength * 0.15;
    this.carrierGain.gain.setTargetAtTime(carrierVolume, now, 0.1);

    // Adjust carrier pitch based on strength (creates tension and feedback)
    // Pitch rises as you get closer, creating urgency
    if (this.carrierOsc) {
      const carrierFreq = 1500 + (strength * 1500); // 1500Hz to 3000Hz
      this.carrierOsc.frequency.setTargetAtTime(carrierFreq, now, 0.1);
    }
  }

  // Flash effect on lock
  flashLock() {
    if (!this.masterGain) return;

    const now = this.audioContext!.currentTime;
    this.masterGain.gain.setValueAtTime(0.6, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.3);
  }

  // Get analyser for visualization
  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  stop() {
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode.disconnect();
    }
    if (this.carrierOsc) {
      this.carrierOsc.stop();
      this.carrierOsc.disconnect();
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.isInitialized = false;
  }
}

export const radioAudio = new RadioAudioEngine();
