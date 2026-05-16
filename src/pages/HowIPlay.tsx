import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useA11yStore } from '@/stores/a11yStore';
import { useProfileStore } from '@/stores/profileStore';
import { Button } from '@/components/ui/Button';
import { TapTarget } from '@/components/ui/TapTarget';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import type { A11ySettings } from '@/types';

type Motion = A11ySettings['motion'];
type Contrast = A11ySettings['contrast'];
type Font = A11ySettings['fontFamily'];

interface ToggleProps {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ label, hint, value, onChange }: ToggleProps) {
  return (
    <div className="bw-card flex items-center justify-between gap-4">
      <div>
        <p className="font-display text-xl font-bold">{label}</p>
        {hint && <p className="text-sm text-ink/60">{hint}</p>}
      </div>
      <TapTarget
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-12 w-24 items-center rounded-full transition ${
          value ? 'bg-leaf' : 'bg-ink/20'
        }`}
      >
        <span
          className={`inline-block h-10 w-10 transform rounded-full bg-white shadow transition ${
            value ? 'translate-x-12' : 'translate-x-1'
          }`}
        />
      </TapTarget>
    </div>
  );
}

interface ChoiceProps<T extends string> {
  label: string;
  hint?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

function Choice<T extends string>({ label, hint, options, value, onChange }: ChoiceProps<T>) {
  return (
    <div className="bw-card space-y-3">
      <div>
        <p className="font-display text-xl font-bold">{label}</p>
        {hint && <p className="text-sm text-ink/60">{hint}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <TapTarget
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`rounded-bloom px-4 py-3 font-bold ${
              value === o.value ? 'bg-leaf text-white' : 'bg-white text-ink'
            }`}
          >
            {o.label}
          </TapTarget>
        ))}
      </div>
    </div>
  );
}

export function HowIPlay() {
  const { t } = useTranslation('a11y');
  const { t: tc } = useTranslation('common');
  const navigate = useNavigate();
  const a = useA11yStore((s) => s.settings);
  const setKey = useA11yStore((s) => s.set);

  const active = useProfileStore((s) => s.active);
  const update = useProfileStore((s) => s.update);

  const save = async () => {
    if (active) await update(active.id, { a11y: a });
    navigate('/home');
  };

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <header className="mx-auto mb-6 flex max-w-3xl items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-moss">{t('title')}</h1>
        <LanguageToggle />
      </header>
      <p className="mx-auto mb-6 max-w-3xl text-lg text-ink/70">{t('intro')}</p>

      <div className="mx-auto max-w-3xl space-y-4">
        <Toggle
          label={t('bigText.label')}
          hint={t('bigText.hint')}
          value={a.bigText}
          onChange={(v) => setKey('bigText', v)}
        />

        <Choice<Font>
          label={t('fontFamily.label')}
          hint={t('fontFamily.hint')}
          value={a.fontFamily}
          onChange={(v) => setKey('fontFamily', v)}
          options={[
            { value: 'system', label: 'Aa' },
            { value: 'dyslexic', label: 'Aa' },
          ]}
        />

        <Choice<Motion>
          label={t('motion.label')}
          value={a.motion}
          onChange={(v) => setKey('motion', v)}
          options={[
            { value: 'full', label: t('motion.full') },
            { value: 'reduced', label: t('motion.reduced') },
            { value: 'off', label: t('motion.off') },
          ]}
        />

        <Choice<Contrast>
          label={t('contrast.label')}
          value={a.contrast}
          onChange={(v) => setKey('contrast', v)}
          options={[
            { value: 'normal', label: t('contrast.normal') },
            { value: 'high', label: t('contrast.high') },
          ]}
        />

        <Toggle
          label={t('calm.label')}
          hint={t('calm.hint')}
          value={a.calm}
          onChange={(v) => setKey('calm', v)}
        />
        <Toggle
          label={t('captions.label')}
          hint={t('captions.hint')}
          value={a.captions}
          onChange={(v) => setKey('captions', v)}
        />
        <Toggle
          label={t('readToMe.label')}
          hint={t('readToMe.hint')}
          value={a.readToMe}
          onChange={(v) => setKey('readToMe', v)}
        />
        <Toggle
          label={t('simpleLanguage.label')}
          hint={t('simpleLanguage.hint')}
          value={a.simpleLanguage}
          onChange={(v) => setKey('simpleLanguage', v)}
        />

        <Choice<string>
          label={t('dwellMs.label')}
          hint={t('dwellMs.hint')}
          value={String(a.dwellMs)}
          onChange={(v) => setKey('dwellMs', Number(v))}
          options={[
            { value: '0', label: t('dwellMs.off') },
            { value: '1500', label: t('dwellMs.slow') },
            { value: '900', label: t('dwellMs.medium') },
            { value: '500', label: t('dwellMs.fast') },
          ]}
        />

        <Toggle
          label={t('oneSwitch.label')}
          hint={t('oneSwitch.hint')}
          value={a.oneSwitch}
          onChange={(v) => setKey('oneSwitch', v)}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={save}>{tc('save')}</Button>
        </div>
      </div>
    </main>
  );
}

export default HowIPlay;
