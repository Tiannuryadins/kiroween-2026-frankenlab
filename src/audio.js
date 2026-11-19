// WebAudio synthesis — no audio files, no top-level window/document access.
// Every function silently no-ops when AudioContext is unavailable.

function getContext() {
  try {
    const Ctor =
      (typeof AudioContext !== "undefined" && AudioContext) ||
      (typeof webkitAudioContext !== "undefined" && webkitAudioContext);
    if (!Ctor) return null;
    return new Ctor();
  } catch {
    return null;
  }
}

// Brown-noise burst through a lowpass filter, ~1.2 s.
export function playThunder() {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const duration = 1.2;
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.ceil(sampleRate * duration);
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    // Brown noise: integrate white noise.
    let last = 0;
    for (let i = 0; i < frameCount; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5; // amplify; will be filtered further
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.start(ctx.currentTime);
    src.stop(ctx.currentTime + duration);
    src.onended = () => ctx.close();
  } catch {
    // silently no-op
  }
}

// Sawtooth 1200→80 Hz sweep + noise crackle, ~0.4 s.
export function playZap() {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const duration = 0.4;
    const now = ctx.currentTime;

    // Sawtooth sweep.
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + duration);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    // Noise crackle.
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.ceil(sampleRate * duration);
    const buffer = ctx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 2000;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
    noiseSrc.start(now);
    noiseSrc.stop(now + duration);

    noiseSrc.onended = () => ctx.close();
  } catch {
    // silently no-op
  }
}

// Slow detuned sines, ~0.8 s.
export function playCreak() {
  try {
    const ctx = getContext();
    if (!ctx) return;

    const duration = 0.8;
    const now = ctx.currentTime;

    const freqs = [220, 221.5, 219.2];
    const gains = [];

    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * 1.08, now + duration * 0.5);
      osc.frequency.linearRampToValueAtTime(freq * 0.95, now + duration);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.15, now + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
      gains.push(g);
    }

    // Close context after last oscillator finishes.
    setTimeout(() => ctx.close().catch(() => {}), (duration + 0.1) * 1000);
  } catch {
    // silently no-op
  }
}
