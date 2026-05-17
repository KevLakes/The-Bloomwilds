/**
 * Procedural sound effects via Web Audio API.
 *
 * No audio files needed — each sfx is a short envelope-shaped tone or filtered
 * noise burst designed to fit the paper-craft palette: soft, organic, never
 * harsh. Single shared AudioContext is lazily created on first use to satisfy
 * autoplay policy (user gesture required).
 */

export type SfxName =
  | 'tap'
  | 'sparkle'
  | 'success'
  | 'gentle-error'
  | 'bloom'
  | 'page-transition'
  | 'drag-start'
  | 'drag-drop'
  | 'hover';

let ctx: AudioContext | undefined;
let masterGain: GainNode | undefined;
let muted = false;
let masterVolume = 0.7;

function ensureCtx(): AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  if (!ctx) {
    const Ctor = (window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return undefined;
    try {
      ctx = new Ctor();
      masterGain = ctx.createGain();
      masterGain.gain.value = muted ? 0 : masterVolume;
      masterGain.connect(ctx.destination);
    } catch {
      return undefined;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function setSfxMuted(value: boolean): void {
  muted = value;
  if (masterGain) masterGain.gain.value = muted ? 0 : masterVolume;
}

export function setSfxVolume(value: number): void {
  masterVolume = Math.max(0, Math.min(1, value));
  if (masterGain && !muted) masterGain.gain.value = masterVolume;
}

/**
 * Generic ADSR envelope helper. Returns a GainNode wired through the master.
 */
function envelope(
  audio: AudioContext,
  attack: number,
  decay: number,
  sustain: number,
  release: number,
  peak = 1,
): { node: GainNode; release: (when?: number) => void } {
  const g = audio.createGain();
  const now = audio.currentTime;
  g.gain.cancelScheduledValues(now);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(peak, now + attack);
  g.gain.linearRampToValueAtTime(sustain, now + attack + decay);
  g.connect(masterGain!);
  return {
    node: g,
    release: (when = audio.currentTime) => {
      g.gain.cancelScheduledValues(when);
      g.gain.setValueAtTime(g.gain.value, when);
      g.gain.linearRampToValueAtTime(0, when + release);
    },
  };
}

function whiteNoise(audio: AudioContext, durationSec: number): AudioBufferSourceNode {
  const bufferSize = Math.max(1, Math.floor(audio.sampleRate * durationSec));
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = audio.createBufferSource();
  src.buffer = buffer;
  return src;
}

// ── Individual sfx ──────────────────────────────────────────────────────────

function sfxTap(audio: AudioContext) {
  const env = envelope(audio, 0.001, 0.04, 0, 0.06, 0.4);
  const osc = audio.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(620, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(420, audio.currentTime + 0.06);
  osc.connect(env.node);
  osc.start();
  env.release(audio.currentTime + 0.05);
  osc.stop(audio.currentTime + 0.15);
}

function sfxSparkle(audio: AudioContext) {
  // Two glittering blips a tritone apart, descending
  const tones = [1320, 1760, 2100];
  tones.forEach((f, i) => {
    const t = audio.currentTime + i * 0.04;
    const env = envelope(audio, 0.002, 0.05, 0, 0.12, 0.25);
    const osc = audio.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, t);
    osc.connect(env.node);
    osc.start(t);
    env.release(t + 0.08);
    osc.stop(t + 0.2);
  });
}

function sfxSuccess(audio: AudioContext) {
  // Major triad chord with quick stagger — bright, encouraging
  const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
  notes.forEach((f, i) => {
    const t = audio.currentTime + i * 0.06;
    const env = envelope(audio, 0.01, 0.12, 0.2, 0.4, 0.35);
    const osc = audio.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(f, t);
    osc.connect(env.node);
    osc.start(t);
    env.release(t + 0.4);
    osc.stop(t + 0.85);
  });
}

function sfxGentleError(audio: AudioContext) {
  // Soft minor third drop — never harsh
  const env = envelope(audio, 0.01, 0.15, 0.05, 0.2, 0.4);
  const osc = audio.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(370, audio.currentTime + 0.18);
  osc.connect(env.node);
  osc.start();
  env.release(audio.currentTime + 0.2);
  osc.stop(audio.currentTime + 0.45);
}

function sfxBloom(audio: AudioContext) {
  // Slow rising fifth + filtered noise shimmer
  const env = envelope(audio, 0.08, 0.4, 0.3, 0.6, 0.4);
  const osc1 = audio.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(330, audio.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(494, audio.currentTime + 0.5);
  const osc2 = audio.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(660, audio.currentTime + 0.05);
  osc2.frequency.exponentialRampToValueAtTime(988, audio.currentTime + 0.5);
  osc1.connect(env.node);
  osc2.connect(env.node);
  osc1.start();
  osc2.start(audio.currentTime + 0.05);
  env.release(audio.currentTime + 0.5);
  osc1.stop(audio.currentTime + 1.2);
  osc2.stop(audio.currentTime + 1.2);

  // shimmer
  const noiseEnv = envelope(audio, 0.05, 0.1, 0.0, 0.4, 0.08);
  const noise = whiteNoise(audio, 0.6);
  const bp = audio.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(3200, audio.currentTime);
  bp.Q.value = 12;
  noise.connect(bp).connect(noiseEnv.node);
  noise.start();
  noiseEnv.release(audio.currentTime + 0.3);
  noise.stop(audio.currentTime + 0.7);
}

function sfxPageTransition(audio: AudioContext) {
  // Soft swoosh — filtered noise sweep
  const env = envelope(audio, 0.02, 0.18, 0, 0.05, 0.18);
  const noise = whiteNoise(audio, 0.25);
  const bp = audio.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(800, audio.currentTime);
  bp.frequency.exponentialRampToValueAtTime(2400, audio.currentTime + 0.2);
  bp.Q.value = 4;
  noise.connect(bp).connect(env.node);
  noise.start();
  env.release(audio.currentTime + 0.15);
  noise.stop(audio.currentTime + 0.3);
}

function sfxDragStart(audio: AudioContext) {
  const env = envelope(audio, 0.005, 0.04, 0, 0.05, 0.3);
  const osc = audio.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(180, audio.currentTime);
  const lp = audio.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 900;
  osc.connect(lp).connect(env.node);
  osc.start();
  env.release(audio.currentTime + 0.05);
  osc.stop(audio.currentTime + 0.15);
}

function sfxDragDrop(audio: AudioContext) {
  // soft "thunk" — short low burst + click
  const env = envelope(audio, 0.001, 0.08, 0, 0.05, 0.5);
  const osc = audio.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, audio.currentTime + 0.1);
  osc.connect(env.node);
  osc.start();
  env.release(audio.currentTime + 0.08);
  osc.stop(audio.currentTime + 0.2);
}

function sfxHover(audio: AudioContext) {
  const env = envelope(audio, 0.005, 0.05, 0, 0.05, 0.15);
  const osc = audio.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, audio.currentTime);
  osc.connect(env.node);
  osc.start();
  env.release(audio.currentTime + 0.04);
  osc.stop(audio.currentTime + 0.12);
}

const DISPATCH: Record<SfxName, (audio: AudioContext) => void> = {
  tap: sfxTap,
  sparkle: sfxSparkle,
  success: sfxSuccess,
  'gentle-error': sfxGentleError,
  bloom: sfxBloom,
  'page-transition': sfxPageTransition,
  'drag-start': sfxDragStart,
  'drag-drop': sfxDragDrop,
  hover: sfxHover,
};

export function playSfx(name: SfxName): void {
  const audio = ensureCtx();
  if (!audio || muted) return;
  try {
    DISPATCH[name](audio);
  } catch {
    // Audio is best-effort — never throw into UI.
  }
}
