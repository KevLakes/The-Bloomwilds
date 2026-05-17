/**
 * Per-region ambient pads composed via Web Audio API.
 *
 * Each region gets a 2–3 oscillator stack (sine + soft triangle) detuned slightly,
 * routed through a low-pass filter modulated by a slow LFO, plus a tiny noise
 * floor for "air". Volume stays very low — this is atmosphere, not a soundtrack.
 *
 * One pad is active at a time. Calling startAmbient(regionId) crossfades from
 * whatever was playing. stopAmbient() fades to silence. Mute + volume share
 * the same master gain as procedural sfx — wired via setAmbientMuted /
 * setAmbientVolume.
 */
import type { RegionId } from '@/types';

type RegionKey = RegionId | 'home';

interface PadSpec {
  /** Hz of the root note */
  root: number;
  /** Voiced intervals (in semitones above root) */
  intervals: number[];
  /** Filter cutoff (Hz) — keeps the pad warm */
  cutoff: number;
}

const PADS: Record<RegionKey, PadSpec> = {
  // C major — warm + neutral for home
  home: { root: 130.81, intervals: [0, 7, 12, 16], cutoff: 1600 },
  // G major bright — Letterglade
  letterglade: { root: 196.0, intervals: [0, 4, 7, 11, 14], cutoff: 2000 },
  // D dorian flowing — Numberbrook
  numberbrook: { root: 146.83, intervals: [0, 3, 7, 10, 14], cutoff: 1500 },
  // F lydian sparkle — Critter Cove
  'critter-cove': { root: 174.61, intervals: [0, 4, 6, 7, 11], cutoff: 2100 },
  // A minor mysterious — Hue Hills
  'hue-hills': { root: 110.0, intervals: [0, 3, 7, 10, 15], cutoff: 1400 },
  // C major airy — Feelings Meadow
  'feelings-meadow': { root: 130.81, intervals: [0, 4, 7, 14], cutoff: 1300 },
};

let ctx: AudioContext | undefined;
let masterGain: GainNode | undefined;
let currentNodes: (OscillatorNode | AudioBufferSourceNode)[] = [];
let currentGain: GainNode | undefined;
let currentRegion: RegionKey | undefined;
let muted = false;
let masterVolume = 0.18; // soft by default

function ensureCtx(): AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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

export function setAmbientMuted(value: boolean): void {
  muted = value;
  if (masterGain) masterGain.gain.value = muted ? 0 : masterVolume;
}

export function setAmbientVolume(value: number): void {
  masterVolume = Math.max(0, Math.min(0.4, value)); // cap because pads layer
  if (masterGain && !muted) masterGain.gain.value = masterVolume;
}

function teardown(fadeOut = 1.2): void {
  if (!ctx || !currentGain) return;
  const now = ctx.currentTime;
  const tail = currentGain;
  tail.gain.cancelScheduledValues(now);
  tail.gain.setValueAtTime(tail.gain.value, now);
  tail.gain.linearRampToValueAtTime(0, now + fadeOut);
  const nodes = currentNodes;
  setTimeout(() => {
    nodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    try {
      tail.disconnect();
    } catch {
      /* noop */
    }
  }, fadeOut * 1000 + 100);
  currentGain = undefined;
  currentNodes = [];
}

function midiHzFromRoot(root: number, semitones: number): number {
  return root * Math.pow(2, semitones / 12);
}

export function startAmbient(region: RegionKey): void {
  if (region === currentRegion) return;
  const audio = ensureCtx();
  if (!audio) return;

  // Fade old
  teardown(1.2);

  const spec = PADS[region] ?? PADS.home;
  const group = audio.createGain();
  group.gain.value = 0;
  group.connect(masterGain!);

  // Low-pass filter for warmth + slow LFO modulation
  const lp = audio.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = spec.cutoff;
  lp.Q.value = 0.7;
  lp.connect(group);

  const lfo = audio.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = audio.createGain();
  lfoGain.gain.value = spec.cutoff * 0.35;
  lfo.connect(lfoGain).connect(lp.frequency);
  lfo.start();
  currentNodes.push(lfo);

  // Voiced oscillator stack — sine + triangle, slight detune
  spec.intervals.forEach((semis, i) => {
    const f = midiHzFromRoot(spec.root, semis);
    const osc = audio.createOscillator();
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = f;
    osc.detune.value = (i - spec.intervals.length / 2) * 3;
    const voiceGain = audio.createGain();
    voiceGain.gain.value = 0.18 / Math.max(2, spec.intervals.length);
    osc.connect(voiceGain).connect(lp);
    osc.start();
    currentNodes.push(osc);
  });

  // Subtle pink-ish noise floor for air
  const bufferSize = Math.floor(audio.sampleRate * 4);
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 10;
  }
  const noiseSrc = audio.createBufferSource();
  noiseSrc.buffer = buffer;
  noiseSrc.loop = true;
  const noiseGain = audio.createGain();
  noiseGain.gain.value = 0.04;
  const noiseHp = audio.createBiquadFilter();
  noiseHp.type = 'highpass';
  noiseHp.frequency.value = 800;
  noiseSrc.connect(noiseHp).connect(noiseGain).connect(lp);
  noiseSrc.start();
  currentNodes.push(noiseSrc);

  // Fade in
  const now = audio.currentTime;
  group.gain.setValueAtTime(0, now);
  group.gain.linearRampToValueAtTime(1, now + 1.6);

  currentGain = group;
  currentRegion = region;
}

export function stopAmbient(): void {
  teardown(1.2);
  currentRegion = undefined;
}
