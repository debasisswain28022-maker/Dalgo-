// Web Audio API pitch synthesis for sorting animations
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
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

/**
 * Play a short pitch tone corresponding to an array element value
 * @param {number} val - Element value
 * @param {number} minVal - Minimum array value
 * @param {number} maxVal - Maximum array value
 * @param {number} durationMs - Duration of tone in ms
 */
export function playTone(val, minVal = 5, maxVal = 100, durationMs = 40) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Map val to frequency range between 200 Hz and 800 Hz
    const normalized = Math.max(0, Math.min(1, (val - minVal) / (maxVal - minVal || 1)));
    const freq = 200 + normalized * 650;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Smooth envelope attack and decay to prevent popping noise
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch (e) {
    // Ignore audio context errors if user browser restricts autoplay
  }
}
