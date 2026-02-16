// Web Audio API sound effects
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration = 0.15, type = 'sine', volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* audio not supported */ }
}

export function playGoalSound() {
  playTone(523, 0.1, 'square', 0.2);
  setTimeout(() => playTone(659, 0.1, 'square', 0.2), 100);
  setTimeout(() => playTone(784, 0.2, 'square', 0.2), 200);
}

export function playClickSound() {
  playTone(800, 0.05, 'sine', 0.1);
}

export function playSuccessSound() {
  playTone(523, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 120);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.2), 240);
}

export function playErrorSound() {
  playTone(200, 0.15, 'sawtooth', 0.15);
  setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.15), 150);
}

export function playChampionSound() {
  const notes = [523, 659, 784, 1047, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.25), i * 150);
  });
}

export function playTabSound() {
  playTone(600, 0.05, 'sine', 0.08);
}

let soundEnabled = true;
try {
  soundEnabled = localStorage.getItem('wc2026_sound') !== 'false';
} catch { /* ignore */ }

export function isSoundEnabled() { return soundEnabled; }

export function toggleSound() {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem('wc2026_sound', String(soundEnabled)); } catch { /* ignore */ }
  return soundEnabled;
}

// Wrapper that checks if sound is enabled
export function playSoundIfEnabled(soundFn) {
  if (soundEnabled) soundFn();
}
