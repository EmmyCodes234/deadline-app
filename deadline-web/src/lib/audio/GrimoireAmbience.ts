/**
 * Grimoire Ambience Audio System
 * Uses Web Audio API to generate accurate, high-quality ambient sounds
 * for focus and relaxation during writing sessions
 */

export class GrimoireAmbience {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sounds: Map<string, SoundGenerator> = new Map();

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.7; // Master volume
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  /**
   * Start a sound with the given volume (0-100)
   */
  public startSound(soundName: string, volume: number) {
    if (!this.audioContext || !this.masterGain) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Stop existing sound if playing
    this.stopSound(soundName);

    // Create new sound generator
    const generator = this.createSoundGenerator(soundName);
    if (generator) {
      generator.start(this.audioContext, this.masterGain, volume / 100);
      this.sounds.set(soundName, generator);
    }
  }

  /**
   * Stop a sound
   */
  public stopSound(soundName: string) {
    const generator = this.sounds.get(soundName);
    if (generator) {
      generator.stop();
      this.sounds.delete(soundName);
    }
  }

  /**
   * Update sound volume (0-100)
   */
  public updateVolume(soundName: string, volume: number) {
    const generator = this.sounds.get(soundName);
    if (generator) {
      generator.setVolume(volume / 100);
    }
  }

  /**
   * Stop all sounds
   */
  public stopAll() {
    this.sounds.forEach(generator => generator.stop());
    this.sounds.clear();
  }

  /**
   * Create a sound generator based on the sound name
   */
  private createSoundGenerator(soundName: string): SoundGenerator | null {
    switch (soundName) {
      case 'rain':
        return new RainGenerator();
      case 'fireplace':
        return new FireplaceGenerator();
      case 'whiteNoise':
        return new WhiteNoiseGenerator();
      case 'whispers':
        return new WhispersGenerator();
      case 'oceanWaves':
        return new OceanWavesGenerator();
      case 'forestAmbience':
        return new ForestAmbienceGenerator();
      case 'windChimes':
        return new WindChimesGenerator();
      case 'brownNoise':
        return new BrownNoiseGenerator();
      case 'pinkNoise':
        return new PinkNoiseGenerator();
      case 'heartbeat':
        return new HeartbeatGenerator();
      case 'breathingGuide':
        return new BreathingGuideGenerator();
      case 'tibetanBowl':
        return new TibetanBowlGenerator();
      default:
        return null;
    }
  }

  /**
   * Cleanup resources
   */
  public dispose() {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

/**
 * Base class for sound generators
 */
abstract class SoundGenerator {
  protected gainNode: GainNode | null = null;
  protected nodes: AudioNode[] = [];

  abstract start(context: AudioContext, destination: AudioNode, volume: number): void;

  stop() {
    this.nodes.forEach(node => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        node.disconnect();
      } catch (e) {
        // Ignore errors during cleanup
      }
    });
    this.nodes = [];
    this.gainNode = null;
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.linearRampToValueAtTime(
        volume,
        this.gainNode.context.currentTime + 0.1
      );
    }
  }
}

/**
 * Rain sound generator - realistic rain using filtered noise
 */
class RainGenerator extends SoundGenerator {
  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.6;
    this.gainNode.connect(destination);

    // Create noise buffer
    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Main rain body
    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Band-pass filter for rain character
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;

    // High-pass for brightness
    const highpass = context.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 400;

    noise.connect(filter);
    filter.connect(highpass);
    highpass.connect(this.gainNode);

    noise.start();
    this.nodes.push(noise, filter, highpass);
  }
}

/**
 * Fireplace sound generator - crackling fire
 */
class FireplaceGenerator extends SoundGenerator {
  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.5;
    this.gainNode.connect(destination);

    // Low rumble (fire base)
    const rumbleOsc = context.createOscillator();
    rumbleOsc.type = 'sawtooth';
    rumbleOsc.frequency.value = 60;
    
    const rumbleGain = context.createGain();
    rumbleGain.gain.value = 0.3;
    
    const rumbleFilter = context.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.value = 200;
    
    rumbleOsc.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.gainNode);
    rumbleOsc.start();

    // Crackling (filtered noise bursts)
    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.random(); // Sparse noise
    }

    const crackle = context.createBufferSource();
    crackle.buffer = noiseBuffer;
    crackle.loop = true;

    const crackleFilter = context.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.value = 2000;
    crackleFilter.Q.value = 2;

    const crackleGain = context.createGain();
    crackleGain.gain.value = 0.4;

    crackle.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(this.gainNode);
    crackle.start();

    this.nodes.push(rumbleOsc, rumbleFilter, rumbleGain, crackle, crackleFilter, crackleGain);
  }
}

/**
 * White noise generator - pure white noise for focus
 */
class WhiteNoiseGenerator extends SoundGenerator {
  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.4;
    this.gainNode.connect(destination);

    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.connect(this.gainNode);
    noise.start();

    this.nodes.push(noise);
  }
}

/**
 * Whispers generator - eerie whispers effect
 */
class WhispersGenerator extends SoundGenerator {
  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.3;
    this.gainNode.connect(destination);

    // Create whisper-like sound using filtered noise with LFO
    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Band-pass filter for voice-like quality
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 5;

    // LFO for movement
    const lfo = context.createOscillator();
    lfo.frequency.value = 0.3;
    const lfoGain = context.createGain();
    lfoGain.gain.value = 300;
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(this.gainNode);
    
    noise.start();
    lfo.start();

    this.nodes.push(noise, filter, lfo, lfoGain);
  }
}

/**
 * Ocean waves generator - realistic ocean sounds
 */
class OceanWavesGenerator extends SoundGenerator {
  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.6;
    this.gainNode.connect(destination);

    // Create noise for wave texture
    const bufferSize = context.sampleRate * 4;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Low-pass filter for wave character
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;

    // Wave envelope (slow LFO)
    const waveLFO = context.createOscillator();
    waveLFO.frequency.value = 0.15; // Slow wave rhythm
    const waveLFOGain = context.createGain();
    waveLFOGain.gain.value = 0.4;

    waveLFO.connect(waveLFOGain);
    waveLFOGain.connect(this.gainNode.gain);

    noise.connect(filter);
    filter.connect(this.gainNode);
    
    noise.start();
    waveLFO.start();

    this.nodes.push(noise, filter, waveLFO, waveLFOGain);
  }
}

/**
 * Forest ambience generator - birds and rustling leaves
 */
class ForestAmbienceGenerator extends SoundGenerator {
  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.5;
    this.gainNode.connect(destination);

    // Rustling leaves (filtered noise)
    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const rustleNoise = context.createBufferSource();
    rustleNoise.buffer = noiseBuffer;
    rustleNoise.loop = true;

    const rustleFilter = context.createBiquadFilter();
    rustleFilter.type = 'highpass';
    rustleFilter.frequency.value = 2000;

    const rustleGain = context.createGain();
    rustleGain.gain.value = 0.3;

    rustleNoise.connect(rustleFilter);
    rustleFilter.connect(rustleGain);
    rustleGain.connect(this.gainNode);
    rustleNoise.start();

    // Bird chirps (periodic sine waves)
    const chirpInterval = setInterval(() => {
      if (!this.gainNode) {
        clearInterval(chirpInterval);
        return;
      }

      const chirp = context.createOscillator();
      chirp.type = 'sine';
      chirp.frequency.value = 2000 + Math.random() * 2000;

      const chirpGain = context.createGain();
      chirpGain.gain.value = 0;
      chirpGain.gain.setValueAtTime(0, context.currentTime);
      chirpGain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
      chirpGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.15);

      chirp.connect(chirpGain);
      chirpGain.connect(this.gainNode);
      chirp.start(context.currentTime);
      chirp.stop(context.currentTime + 0.15);
    }, 3000 + Math.random() * 4000);

    this.nodes.push(rustleNoise, rustleFilter, rustleGain);
  }
}

/**
 * Wind chimes generator - peaceful metallic tones
 */
class WindChimesGenerator extends SoundGenerator {
  private interval: number | null = null;

  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.4;
    this.gainNode.connect(destination);

    // Chime frequencies (pentatonic scale)
    const frequencies = [523.25, 587.33, 659.25, 783.99, 880.00];

    this.interval = window.setInterval(() => {
      if (!this.gainNode) {
        if (this.interval) clearInterval(this.interval);
        return;
      }

      // Random chime
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      const osc = context.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const chimeGain = context.createGain();
      chimeGain.gain.value = 0;
      chimeGain.gain.setValueAtTime(0, context.currentTime);
      chimeGain.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 3);

      osc.connect(chimeGain);
      chimeGain.connect(this.gainNode);
      osc.start(context.currentTime);
      osc.stop(context.currentTime + 3);
    }, 2000 + Math.random() * 3000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    super.stop();
  }
}

/**
 * Brown noise generator - deeper, warmer noise for focus
 */
class BrownNoiseGenerator extends SoundGenerator {
  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.5;
    this.gainNode.connect(destination);

    // Generate brown noise (integrated white noise)
    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Compensate for volume loss
    }

    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.connect(this.gainNode);
    noise.start();

    this.nodes.push(noise);
  }
}

/**
 * Pink noise generator - balanced noise for concentration
 */
class PinkNoiseGenerator extends SoundGenerator {
  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.5;
    this.gainNode.connect(destination);

    // Generate pink noise using Paul Kellet's algorithm
    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
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
      output[i] *= 0.11; // Compensate for volume
      b6 = white * 0.115926;
    }

    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    noise.connect(this.gainNode);
    noise.start();

    this.nodes.push(noise);
  }
}

/**
 * Heartbeat generator - calming rhythmic pulse
 */
class HeartbeatGenerator extends SoundGenerator {
  private interval: number | null = null;

  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.6;
    this.gainNode.connect(destination);

    const createBeat = () => {
      if (!this.gainNode) {
        if (this.interval) clearInterval(this.interval);
        return;
      }

      // Lub (first beat)
      const lub = context.createOscillator();
      lub.type = 'sine';
      lub.frequency.value = 60;

      const lubGain = context.createGain();
      lubGain.gain.value = 0;
      lubGain.gain.setValueAtTime(0, context.currentTime);
      lubGain.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.05);
      lubGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);

      lub.connect(lubGain);
      lubGain.connect(this.gainNode);
      lub.start(context.currentTime);
      lub.stop(context.currentTime + 0.2);

      // Dub (second beat)
      setTimeout(() => {
        if (!this.gainNode) return;

        const dub = context.createOscillator();
        dub.type = 'sine';
        dub.frequency.value = 50;

        const dubGain = context.createGain();
        dubGain.gain.value = 0;
        dubGain.gain.setValueAtTime(0, context.currentTime);
        dubGain.gain.linearRampToValueAtTime(0.25, context.currentTime + 0.04);
        dubGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.15);

        dub.connect(dubGain);
        dubGain.connect(this.gainNode);
        dub.start(context.currentTime);
        dub.stop(context.currentTime + 0.15);
      }, 150);
    };

    // 60 BPM heartbeat
    createBeat();
    this.interval = window.setInterval(createBeat, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    super.stop();
  }
}

/**
 * Breathing guide generator - 4-7-8 breathing pattern
 */
class BreathingGuideGenerator extends SoundGenerator {
  private interval: number | null = null;

  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.5;
    this.gainNode.connect(destination);

    const createBreathCycle = () => {
      if (!this.gainNode) {
        if (this.interval) clearInterval(this.interval);
        return;
      }

      // Inhale (4 seconds) - rising tone
      const inhale = context.createOscillator();
      inhale.type = 'sine';
      inhale.frequency.setValueAtTime(200, context.currentTime);
      inhale.frequency.linearRampToValueAtTime(400, context.currentTime + 4);

      const inhaleGain = context.createGain();
      inhaleGain.gain.setValueAtTime(0, context.currentTime);
      inhaleGain.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.5);
      inhaleGain.gain.setValueAtTime(0.15, context.currentTime + 3.5);
      inhaleGain.gain.linearRampToValueAtTime(0, context.currentTime + 4);

      inhale.connect(inhaleGain);
      inhaleGain.connect(this.gainNode);
      inhale.start(context.currentTime);
      inhale.stop(context.currentTime + 4);

      // Hold (7 seconds) - silence

      // Exhale (8 seconds) - falling tone
      setTimeout(() => {
        if (!this.gainNode) return;

        const exhale = context.createOscillator();
        exhale.type = 'sine';
        exhale.frequency.setValueAtTime(400, context.currentTime);
        exhale.frequency.linearRampToValueAtTime(200, context.currentTime + 8);

        const exhaleGain = context.createGain();
        exhaleGain.gain.setValueAtTime(0, context.currentTime);
        exhaleGain.gain.linearRampToValueAtTime(0.15, context.currentTime + 0.5);
        exhaleGain.gain.setValueAtTime(0.15, context.currentTime + 7.5);
        exhaleGain.gain.linearRampToValueAtTime(0, context.currentTime + 8);

        exhale.connect(exhaleGain);
        exhaleGain.connect(this.gainNode);
        exhale.start(context.currentTime);
        exhale.stop(context.currentTime + 8);
      }, 11000); // After 4s inhale + 7s hold
    };

    createBreathCycle();
    // Full cycle: 4s inhale + 7s hold + 8s exhale = 19s
    this.interval = window.setInterval(createBreathCycle, 19000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    super.stop();
  }
}

/**
 * Tibetan singing bowl generator - meditative resonance
 */
class TibetanBowlGenerator extends SoundGenerator {
  private interval: number | null = null;

  start(context: AudioContext, destination: AudioNode, volume: number) {
    this.gainNode = context.createGain();
    this.gainNode.gain.value = volume * 0.4;
    this.gainNode.connect(destination);

    const createBowlStrike = () => {
      if (!this.gainNode) {
        if (this.interval) clearInterval(this.interval);
        return;
      }

      // Fundamental frequency
      const fundamental = context.createOscillator();
      fundamental.type = 'sine';
      fundamental.frequency.value = 220; // A3

      // Harmonics
      const harmonic1 = context.createOscillator();
      harmonic1.type = 'sine';
      harmonic1.frequency.value = 440; // A4

      const harmonic2 = context.createOscillator();
      harmonic2.type = 'sine';
      harmonic2.frequency.value = 660; // E5

      // Envelope
      const bowlGain = context.createGain();
      bowlGain.gain.value = 0;
      bowlGain.gain.setValueAtTime(0, context.currentTime);
      bowlGain.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
      bowlGain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 8);

      fundamental.connect(bowlGain);
      harmonic1.connect(bowlGain);
      harmonic2.connect(bowlGain);
      bowlGain.connect(this.gainNode);

      fundamental.start(context.currentTime);
      harmonic1.start(context.currentTime);
      harmonic2.start(context.currentTime);
      
      fundamental.stop(context.currentTime + 8);
      harmonic1.stop(context.currentTime + 8);
      harmonic2.stop(context.currentTime + 8);
    };

    createBowlStrike();
    this.interval = window.setInterval(createBowlStrike, 12000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    super.stop();
  }
}
