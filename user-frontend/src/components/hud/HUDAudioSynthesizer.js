// Web Audio API Synthesizer for In-Cab Disaster Navigation HUD
// Provides synthesized hazard alarms, acoustic sonar pings, maneuver chimes, and SOS morse code beeps
// without any external sound assets or network dependency.

class HUDAudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = true;
    this.masterVolume = 0.5;
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
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

  // Dual-frequency rapid hazard alert siren (880Hz / 440Hz alternating)
  playHazardAlarm(repeat = 2) {
    if (!this.isEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    for (let i = 0; i < repeat; i++) {
      const startTime = now + i * 0.35;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, startTime);
      osc.frequency.setValueAtTime(554, startTime + 0.15);

      gain.gain.setValueAtTime(this.masterVolume * 0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    }
  }

  // Smooth pleasant melodic maneuver chime (C5 -> E5 -> G5)
  playTurnChime() {
    if (!this.isEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const startTime = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.masterVolume * 0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  // Acoustic sonar echo ping for radar scans or distance markers
  playSonarPing() {
    if (!this.isEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.4);

    gain.gain.setValueAtTime(this.masterVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Emergency SOS Morse Code beeps: ... --- ... (short short short, long long long, short short short)
  playSOSMorse() {
    if (!this.isEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const dotDuration = 0.08;
    const dashDuration = 0.24;
    const gap = 0.08;
    const charGap = 0.2;

    const sequence = [
      // S: . . .
      { type: 'dot', dur: dotDuration },
      { type: 'dot', dur: dotDuration },
      { type: 'dot', dur: dotDuration },
      { type: 'pause', dur: charGap },
      // O: - - -
      { type: 'dash', dur: dashDuration },
      { type: 'dash', dur: dashDuration },
      { type: 'dash', dur: dashDuration },
      { type: 'pause', dur: charGap },
      // S: . . .
      { type: 'dot', dur: dotDuration },
      { type: 'dot', dur: dotDuration },
      { type: 'dot', dur: dotDuration }
    ];

    let t = ctx.currentTime + 0.05;
    sequence.forEach(item => {
      if (item.type !== 'pause') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, t);

        gain.gain.setValueAtTime(this.masterVolume * 0.5, t);
        gain.gain.setValueAtTime(this.masterVolume * 0.5, t + item.dur - 0.01);
        gain.gain.linearRampToValueAtTime(0.001, t + item.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + item.dur);
      }
      t += item.dur + gap;
    });
  }

  // Single button tap / confirm click sound
  playClick() {
    if (!this.isEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

    gain.gain.setValueAtTime(this.masterVolume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const hudAudio = new HUDAudioSynthesizer();
export default hudAudio;

