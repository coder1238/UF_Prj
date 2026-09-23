// Web Audio API Emergency Siren and Warning Synthesizer
let audioCtx = null;
let currentOsc = null;
let currentGain = null;
let sirenInterval = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopEmergencySiren() {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (currentOsc) {
    try {
      currentOsc.stop();
      currentOsc.disconnect();
    } catch (e) {
      // ignore
    }
    currentOsc = null;
  }
  if (currentGain) {
    try {
      currentGain.disconnect();
    } catch (e) {
      // ignore
    }
    currentGain = null;
  }
}

/**
 * Play selected warning tone
 * @param {string} toneType - 'siren' | 'klaxon' | 'chime' | 'morse'
 * @param {number} volume - 0.0 to 1.0 (default 0.3)
 */
export function playEmergencyTone(toneType = 'siren', volume = 0.25) {
  stopEmergencySiren();
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, now);
  gain.connect(ctx.destination);
  currentGain = gain;

  if (toneType === 'siren') {
    // Continuous sweeping civil defense siren
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.connect(gain);
    osc.start();
    currentOsc = osc;

    let high = true;
    sirenInterval = setInterval(() => {
      if (!ctx || !currentOsc) return;
      const t = ctx.currentTime;
      if (high) {
        currentOsc.frequency.linearRampToValueAtTime(780, t + 1.2);
      } else {
        currentOsc.frequency.linearRampToValueAtTime(450, t + 1.2);
      }
      high = !high;
    }, 1200);

  } else if (toneType === 'klaxon') {
    // Dual frequency alternating alert
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(520, now);
    osc.connect(gain);
    osc.start();
    currentOsc = osc;

    let step = 0;
    sirenInterval = setInterval(() => {
      if (!ctx || !currentOsc) return;
      const t = ctx.currentTime;
      step++;
      const freq = step % 2 === 0 ? 520 : 680;
      currentOsc.frequency.setValueAtTime(freq, t);
    }, 350);

  } else if (toneType === 'chime') {
    // Gentle 3-note broadcast chime
    const notes = [587.33, 739.99, 880.00]; // D5, F#5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const startTime = now + idx * 0.25;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      noteGain.gain.setValueAtTime(volume, startTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
      
      osc.connect(noteGain);
      noteGain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.85);
    });

  } else if (toneType === 'morse') {
    // SOS in Morse: ... --- ... (short=0.15s, long=0.45s)
    const pattern = [
      { dur: 0.15, isTone: true }, { dur: 0.1, isTone: false },
      { dur: 0.15, isTone: true }, { dur: 0.1, isTone: false },
      { dur: 0.15, isTone: true }, { dur: 0.25, isTone: false },
      { dur: 0.45, isTone: true }, { dur: 0.15, isTone: false },
      { dur: 0.45, isTone: true }, { dur: 0.15, isTone: false },
      { dur: 0.45, isTone: true }, { dur: 0.25, isTone: false },
      { dur: 0.15, isTone: true }, { dur: 0.1, isTone: false },
      { dur: 0.15, isTone: true }, { dur: 0.1, isTone: false },
      { dur: 0.15, isTone: true }, { dur: 0.6, isTone: false }
    ];

    let offset = 0;
    pattern.forEach(p => {
      if (p.isTone) {
        const osc = ctx.createOscillator();
        const toneGain = ctx.createGain();
        const start = now + offset;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, start);
        toneGain.gain.setValueAtTime(volume, start);
        toneGain.gain.setValueAtTime(0.001, start + p.dur);
        osc.connect(toneGain);
        toneGain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + p.dur);
      }
      offset += p.dur;
    });
  }
}

