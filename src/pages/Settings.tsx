import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import { useAudioStore } from '@/stores/audioStore';
import { Button } from '@/components/ui/Button';
import { TapTarget } from '@/components/ui/TapTarget';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { PageShell } from '@/components/ui/PageShell';
import { PaperLayer } from '@/components/ui/PaperLayer';
import { playSfx } from '@/systems/audio/procedural';

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon: string;
}

function Slider({ label, value, onChange, icon }: SliderProps) {
  return (
    <label className="flex items-center gap-3">
      <span aria-hidden className="text-2xl" style={{ width: 32, textAlign: 'center' }}>
        {icon}
      </span>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between text-sm font-display">
          <span>{label}</span>
          <span className="text-ink-soft">{Math.round(value * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseUp={() => playSfx('tap')}
          onTouchEnd={() => playSfx('tap')}
          className="bw-slider w-full"
          style={{ accentColor: 'var(--color-accent)' }}
        />
      </div>
    </label>
  );
}

export function Settings() {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const setActive = useProfileStore((s) => s.setActive);
  const audio = useAudioStore();

  return (
    <PageShell region="home" width="narrow">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-bold text-moss text-fluid-2xl">{t('settings.title')}</h1>
        <LanguageToggle />
      </header>

      {/* Sound */}
      <PaperLayer depth="md" grain glue={false}>
        <div className="bw-stack">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-bold">{t('settings.sections.sound')}</h2>
            <TapTarget
              onClick={() => audio.setMuted(!audio.muted)}
              aria-pressed={audio.muted}
              minSize={44}
              className={`rounded-full px-3 py-2 text-sm font-display font-bold transition ${
                audio.muted ? 'bg-ink text-white' : 'bg-accent/15 text-ink'
              }`}
            >
              {audio.muted
                ? `🔇 ${t('settings.sections.soundMuted')}`
                : `🔊 ${t('settings.sections.soundOn')}`}
            </TapTarget>
          </div>
          <Slider
            label={t('settings.sections.music')}
            icon="🎶"
            value={audio.music}
            onChange={(v) => audio.setVolume('music', v)}
          />
          <Slider
            label={t('settings.sections.effects')}
            icon="✨"
            value={audio.sfx}
            onChange={(v) => audio.setVolume('sfx', v)}
          />
          <Slider
            label={t('settings.sections.narration')}
            icon="💬"
            value={audio.narration}
            onChange={(v) => audio.setVolume('narration', v)}
          />
        </div>
      </PaperLayer>

      {/* How I Play */}
      <PaperLayer depth="md" grain>
        <div className="bw-stack">
          <h2 className="font-display text-xl font-bold">{t('settings.sections.howIPlay')}</h2>
          <p className="text-sm text-ink-soft">{t('settings.sections.howIPlayBody')}</p>
          <Button onClick={() => navigate('/how-i-play')}>{t('settings.howIPlay')}</Button>
        </div>
      </PaperLayer>

      {/* Profile */}
      <PaperLayer depth="md" grain>
        <div className="bw-stack">
          <h2 className="font-display text-xl font-bold">{t('settings.sections.profile')}</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={async () => {
                await setActive(undefined);
                navigate('/profiles');
              }}
            >
              {t('settings.switchProfile')}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/home')}>
              ← {t('back', { ns: 'common' })}
            </Button>
          </div>
        </div>
      </PaperLayer>
    </PageShell>
  );
}

export default Settings;
