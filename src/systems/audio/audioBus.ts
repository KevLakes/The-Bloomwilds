type Channel = 'music' | 'sfx' | 'narration';

interface PlayOptions {
  channel?: Channel;
  loop?: boolean;
  volume?: number;
}

class AudioBus {
  private volumes: Record<Channel, number> = { music: 0.4, sfx: 0.7, narration: 1 };
  private active: Partial<Record<Channel, HTMLAudioElement>> = {};
  private muted = false;

  setMuted(muted: boolean): void {
    this.muted = muted;
    for (const a of Object.values(this.active)) {
      if (a) a.muted = muted;
    }
  }

  setVolume(channel: Channel, vol: number): void {
    this.volumes[channel] = vol;
    const el = this.active[channel];
    if (el) el.volume = vol;
  }

  async play(src: string, { channel = 'sfx', loop = false, volume }: PlayOptions = {}): Promise<void> {
    this.stop(channel);
    const el = new Audio(src);
    el.loop = loop;
    el.volume = volume ?? this.volumes[channel];
    el.muted = this.muted;
    this.active[channel] = el;
    if (channel === 'narration') this.duckMusic(true);
    try {
      await el.play();
    } catch {
      // autoplay blocked or asset missing — silent fail; narration falls back to TTS
    }
    if (channel === 'narration') {
      el.addEventListener('ended', () => this.duckMusic(false), { once: true });
    }
  }

  stop(channel: Channel): void {
    const el = this.active[channel];
    if (el) {
      el.pause();
      el.currentTime = 0;
      this.active[channel] = undefined;
    }
  }

  private duckMusic(duck: boolean): void {
    const music = this.active.music;
    if (!music) return;
    music.volume = duck ? this.volumes.music * 0.3 : this.volumes.music;
  }
}

export const audioBus = new AudioBus();
