class VigilAudioEngine {
  private audioContext: AudioContext | null = null;
  private ambienceNode: OscillatorNode | null = null;
  private ambienceGain: GainNode | null = null;
  private ambienceFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private isAmplified: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.4;
      this.masterGain.connect(this.audioContext.destination);
    }
  }

  private ensureContext() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Start ambient room tone (low hum)
   */
  startAmbience() {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    if (this.ambienceNode) return; // Already playing

    // Create low frequency hum
    const osc = this.audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 60; // Low hum

    // Add filter for muffled effect
    this.ambienceFilter = this.audioContext.createBiquadFilter();
    this.ambienceFilter.type = 'lowpass';
    this.ambienceFilter.frequency.value = 200;
    this.ambienceFilter.Q.value = 1;

    this.ambienceGain = this.audioContext.createGain();
    this.ambienceGain.gain.value = 0.1;

    osc.connect(this.ambienceFilter);
    this.ambienceFilter.connect(this.ambienceGain);
    this.ambienceGain.connect(this.masterGain);

    osc.start();
    this.ambienceNode = osc;
  }

  /**
   * Amplify ambience when blinking
   */
  amplifyAmbience(amplify: boolean) {
    if (!this.ambienceGain || !this.audioContext) return;

    this.isAmplified = amplify;
    const targetGain = amplify ? 0.3 : 0.1;
    
    this.ambienceGain.gain.setTargetAtTime(
      targetGain,
      this.audioContext.currentTime,
      0.1
    );
  }

  /**
   * Stop ambient sound
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
   * Play footsteps (panned from far to near)
   */
  playFootsteps() {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    const duration = 3;
    const stepCount = 6;
    const stepInterval = duration / stepCount;

    for (let i = 0; i < stepCount; i++) {
      setTimeout(() => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        const panner = this.audioContext!.createStereoPanner();

        osc.type = 'square';
        osc.frequency.value = 80 + Math.random() * 40;

        // Pan from center to slightly closer
        panner.pan.value = 0;

        // Volume increases as steps get closer
        const volume = 0.1 + (i / stepCount) * 0.2;
        gain.gain.setValueAtTime(volume, this.audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain!);

        osc.start();
        osc.stop(this.audioContext!.currentTime + 0.1);
      }, i * stepInterval * 1000);
    }
  }

  /**
   * Play breathing (panned left)
   */
  playBreathing() {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    const duration = 4;
    const breathCount = 3;

    for (let i = 0; i < breathCount; i++) {
      setTimeout(() => {
        // Create noise for breath
        const bufferSize = this.audioContext!.sampleRate * 2;
        const buffer = this.audioContext!.createBuffer(1, bufferSize, this.audioContext!.sampleRate);
        const data = buffer.getChannelData(0);

        for (let j = 0; j < bufferSize; j++) {
          data[j] = (Math.random() * 2 - 1) * 0.3;
        }

        const noise = this.audioContext!.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext!.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 500;
        filter.Q.value = 2;

        const gain = this.audioContext!.createGain();
        const panner = this.audioContext!.createStereoPanner();
        panner.pan.value = -0.7; // Left ear

        // Breathing envelope
        gain.gain.setValueAtTime(0.001, this.audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.15, this.audioContext!.currentTime + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain!);

        noise.start();
        noise.stop(this.audioContext!.currentTime + 2);
      }, i * (duration / breathCount) * 1000);
    }
  }

  /**
   * Play knock (panned right)
   */
  playKnock() {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    const knockCount = 3;

    for (let i = 0; i < knockCount; i++) {
      setTimeout(() => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        const panner = this.audioContext!.createStereoPanner();

        osc.type = 'square';
        osc.frequency.value = 150;

        panner.pan.value = 0.7; // Right side

        gain.gain.setValueAtTime(0.4, this.audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(panner);
        panner.connect(this.masterGain!);

        osc.start();
        osc.stop(this.audioContext!.currentTime + 0.05);
      }, i * 400);
    }
  }

  /**
   * Play screech (volume linked to intensity)
   */
  playScreech(intensity: number) {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.5);

    gain.gain.setValueAtTime(intensity * 0.5, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.5);
  }

  /**
   * Play whisper (subtle noise)
   */
  playWhisper() {
    if (!this.audioContext || !this.masterGain) return;
    this.ensureContext();

    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    noise.stop(this.audioContext.currentTime + 2);
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

export const vigilAudio = new VigilAudioEngine();
