import i18n from '@/i18n';
import { audioBus } from '@/systems/audio/audioBus';
import type { Lang } from '@/types';

export interface CaptionEvent {
  text: string;
  lang: Lang;
  key: string;
}

type CaptionListener = (event: CaptionEvent) => void;

const listeners = new Set<CaptionListener>();

export function subscribeCaptions(listener: CaptionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emitCaption(event: CaptionEvent): void {
  for (const l of listeners) l(event);
}

function localeFor(lang: Lang): string {
  return lang === 'sv' ? 'sv-SE' : 'en-US';
}

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  if (typeof speechSynthesis === 'undefined') return undefined;
  const target = localeFor(lang);
  const voices = speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === target) ??
    voices.find((v) => v.lang.startsWith(lang)) ??
    undefined
  );
}

async function audioExists(src: string): Promise<boolean> {
  try {
    const res = await fetch(src, { method: 'HEAD' });
    return res.ok;
  } catch {
    return false;
  }
}

export interface PlayOptions {
  simple?: boolean;
  lang?: Lang;
  silent?: boolean;
}

/**
 * Play a narration key. Tries pre-recorded audio first (per language), falls back to Web Speech.
 * Always emits a caption event so <CaptionBar/> can render text.
 */
export async function play(key: string, opts: PlayOptions = {}): Promise<void> {
  const lang = (opts.lang ?? (i18n.language as Lang) ?? 'sv') as Lang;
  const entry = i18n.getResource(lang, 'narration', key) as
    | { text?: string; simple?: string }
    | undefined;
  const text = opts.simple ? (entry?.simple ?? entry?.text ?? key) : (entry?.text ?? key);

  emitCaption({ text, lang, key });

  if (opts.silent) return;

  const src = `/audio/narration/${lang}/willow/${key}.mp3`;
  if (await audioExists(src)) {
    await audioBus.play(src, { channel: 'narration' });
    return;
  }

  if (typeof speechSynthesis !== 'undefined') {
    try {
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = localeFor(lang);
      const voice = pickVoice(lang);
      if (voice) utter.voice = voice;
      utter.rate = 0.95;
      utter.pitch = 1.05;
      speechSynthesis.speak(utter);
    } catch {
      // ignore TTS errors silently
    }
  }
}

export function stop(): void {
  audioBus.stop('narration');
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}

export const narrator = { play, stop, subscribeCaptions };
