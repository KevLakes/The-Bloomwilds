/**
 * Bridges the audioStore (zustand) → audioBus + procedural sfx + ambient pads.
 * Mount once in App.tsx. Any change to volume/mute propagates to all three.
 */
import { useEffect } from 'react';
import { useAudioStore } from '@/stores/audioStore';
import { audioBus } from './audioBus';
import { setSfxMuted, setSfxVolume } from './procedural';
import { setAmbientMuted, setAmbientVolume } from './ambient';

export function useAudioBridge(): void {
  const muted = useAudioStore((s) => s.muted);
  const music = useAudioStore((s) => s.music);
  const sfx = useAudioStore((s) => s.sfx);
  const narration = useAudioStore((s) => s.narration);

  useEffect(() => {
    audioBus.setMuted(muted);
    setSfxMuted(muted);
    setAmbientMuted(muted);
  }, [muted]);

  useEffect(() => {
    audioBus.setVolume('music', music);
    setAmbientVolume(music * 0.4);
  }, [music]);

  useEffect(() => {
    audioBus.setVolume('sfx', sfx);
    setSfxVolume(sfx);
  }, [sfx]);

  useEffect(() => {
    audioBus.setVolume('narration', narration);
  }, [narration]);
}
