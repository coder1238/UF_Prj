// Procedural Web Audio API Synthesizer for Historical Replay

class ReplayAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.rainGain = null;
    this.pumpGain = null;
    this.rainSource = null;
    this.pumpOsc = null;
    this.pumpSubOsc = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Rain Sound: Filtered White Noise Generator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter noise to sound like heavy rainfall
      const rainFilter = this.ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);
      whiteNoise.start(0);
      this.rainSource = whiteNoise;

      // Pump Hum Generator: Dual Low-Frequency Drone
      this.pumpOsc = this.ctx.createOscillator();
      this.pumpOsc.type = 'sawtooth';
      this.pumpOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // 55Hz low diesel rumble

      this.pumpSubOsc = this.ctx.createOscillator();
      this.pumpSubOsc.type = 'sine';
      this.pumpSubOsc.frequency.setValueAtTime(110, this.ctx.currentTime);

      const pumpFilter = this.ctx.createBiquadFilter();
      pumpFilter.type = 'lowpass';
      pumpFilter.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.pumpGain = this.ctx.createGain();
      this.pumpGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.pumpOsc.connect(pumpFilter);
      this.pumpSubOsc.connect(pumpFilter);
      pumpFilter.connect(this.pumpGain);
      this.pumpGain.connect(this.masterGain);

      this.pumpOsc.start(0);
      this.pumpSubOsc.start(0);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio init skipped:', e);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!this.isInitialized) {
      if (!muted) this.init();
      return;
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
  }

  updateIntensity(rainRateMm, pumpPrc, isPlaying) {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const targetRainVol = isPlaying ? Math.min(0.6, Math.max(0.05, (rainRateMm / 150) * 0.5)) : 0;
    const targetPumpVol = isPlaying ? Math.min(0.25, Math.max(0.02, (pumpPrc / 100) * 0.2)) : 0;

    this.rainGain.gain.setTargetAtTime(targetRainVol, this.ctx.currentTime, 0.2);
    this.pumpGain.gain.setTargetAtTime(targetPumpVol, this.ctx.currentTime, 0.3);
  }

  triggerThunder() {
    if (!this.isInitialized || this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Low boom oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.6);
    } catch (e) {
      console.warn('Thunder trigger failed:', e);
    }
  }

  triggerSiren() {
    if (!this.isInitialized || !this.ctx) {
      this.init();
      this.setMuted(false);
    }
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      // Pitch sweep up and down
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(750, now + 0.8);
      osc.frequency.linearRampToValueAtTime(450, now + 1.6);
      osc.frequency.linearRampToValueAtTime(750, now + 2.4);
      osc.frequency.linearRampToValueAtTime(450, now + 3.2);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 3.5);
    } catch (e) {
      console.warn('Siren trigger failed:', e);
    }
  }

  destroy() {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {
        // ignore
      }
    }
  }
}

export const replayAudio = new ReplayAudioEngine();

