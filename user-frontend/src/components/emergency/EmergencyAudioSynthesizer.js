// Web Audio API Synthesizer for Emergency Center
// Provides zero-network synthesized emergency sounds: sirens, whistles, CPR metronomes, Morse code, and countdown beeps.

class EmergencyAudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.masterVolume = 0.5;
    this.activeNodes = [];
    this.cprInterval = null;
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  setVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  stopAll() {
    if (this.cprInterval) {
      clearInterval(this.cprInterval);
      this.cprInterval = null;
    }
    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
  }

  // Countdown short warning beep (e.g. 800Hz 80ms)
  playCountdownBeep(freq = 880) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Emergency Siren (Dual Tone Alternating / Warble)
  playSiren(durationSeconds = 4) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.stopAll();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // Frequency modulation warble between 600Hz and 1200Hz
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(2.5, now); // 2.5 cycles per sec
    lfoGain.gain.setValueAtTime(300, now); // sweep +-300Hz

    osc.frequency.setValueAtTime(850, now);
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(this.masterVolume * 0.45, now);
    gain.gain.setValueAtTime(this.masterVolume * 0.45, now + durationSeconds - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + durationSeconds);
    osc.stop(now + durationSeconds);

    this.activeNodes.push(osc, lfo);
  }

  // 3.2 kHz High-Penetration Acoustic Whistle (Continuous or Pulse)
  playAcousticWhistle(durationSeconds = 3, pulsed = false) {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.stopAll();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 3200 Hz pierces through ambient rain and vehicle noise
    osc.type = 'square';
    osc.frequency.setValueAtTime(3200, now);

    if (pulsed) {
      const pMod = ctx.createOscillator();
      const pGain = ctx.createGain();
      pMod.type = 'square';
      pMod.frequency.setValueAtTime(4, now); // 4 pulses per sec
      pGain.gain.setValueAtTime(1, now);
      pMod.connect(gain.gain);
      pMod.start(now);
      pMod.stop(now + durationSeconds);
      this.activeNodes.push(pMod);
    }

    gain.gain.setValueAtTime(this.masterVolume * 0.35, now);
    gain.gain.setValueAtTime(this.masterVolume * 0.35, now + durationSeconds - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSeconds);
    this.activeNodes.push(osc);
  }

  // International SOS Morse Code Audio: ... --- ... (short=100ms, long=300ms, gap=100ms)
  playMorseCodeSOS() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.stopAll();

    const now = ctx.currentTime;
    const toneFreq = 950;
    const dot = 0.09;
    const dash = 0.27;
    const elemGap = 0.07;
    const letterGap = 0.22;

    let cursor = now + 0.05;

    // Pattern: 3 dots, 3 dashes, 3 dots
    const pattern = [
      dot, elemGap, dot, elemGap, dot, letterGap,
      dash, elemGap, dash, elemGap, dash, letterGap,
      dot, elemGap, dot, elemGap, dot
    ];

    let isSound = true;
    for (let i = 0; i < pattern.length; i++) {
      const duration = pattern[i];
      if (isSound) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(toneFreq, cursor);

        gain.gain.setValueAtTime(this.masterVolume * 0.4, cursor);
        gain.gain.exponentialRampToValueAtTime(0.001, cursor + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(cursor);
        osc.stop(cursor + duration);
        this.activeNodes.push(osc);
      }
      cursor += duration;
      isSound = !isSound;
    }
  }

  // CPR Metronome at 110 BPM (AHA guideline is 100-120 compressions per min)
  startCPRMetronome(onTick) {
    this.stopAll();
    const beatIntervalMs = (60 / 110) * 1000; // ~545ms

    const triggerClick = () => {
      const ctx = this.getAudioContext();
      if (ctx) {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1050, now);
        gain.gain.setValueAtTime(this.masterVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
      if (onTick) onTick();
    };

    triggerClick();
    this.cprInterval = setInterval(triggerClick, beatIntervalMs);
  }

  stopCPRMetronome() {
    if (this.cprInterval) {
      clearInterval(this.cprInterval);
      this.cprInterval = null;
    }
  }

  // Radio Static Noise Burst
  playRadioBurst() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 3;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(this.masterVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }
}

export const emergencyAudio = new EmergencyAudioSynthesizer();

