import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import type { Lang } from '@/types';
import { TapTarget } from './TapTarget';
import { SvFlag, EnFlag } from '@/assets/illustrations/flags';
import { playSfx } from '@/systems/audio/procedural';

const LABELS: Record<Lang, string> = { sv: 'SV', en: 'EN' };

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const active = useProfileStore((s) => s.active);
  const update = useProfileStore((s) => s.update);

  const choose = async (lang: Lang) => {
    playSfx('tap');
    await i18n.changeLanguage(lang);
    if (active) await update(active.id, { lang });
  };

  const current = (i18n.language as Lang) ?? 'sv';

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-white/85 p-1 shadow-bloom backdrop-blur-sm"
      role="group"
      aria-label="Language"
    >
      {(['sv', 'en'] as Lang[]).map((lng) => {
        const isActive = current === lng;
        const Flag = lng === 'sv' ? SvFlag : EnFlag;
        return (
          <TapTarget
            key={lng}
            onClick={() => choose(lng)}
            aria-pressed={isActive}
            minSize={44}
            className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 font-display font-bold transition ${
              isActive ? 'bg-accent text-white shadow-bloom' : 'text-ink-soft hover:bg-ink/5'
            }`}
          >
            <Flag size={24} active={isActive} />
            <span className="text-sm">{LABELS[lng]}</span>
          </TapTarget>
        );
      })}
    </div>
  );
}
