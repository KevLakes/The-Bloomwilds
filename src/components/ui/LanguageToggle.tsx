import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import type { Lang } from '@/types';
import { TapTarget } from './TapTarget';

const FLAGS: Record<Lang, string> = { sv: '🇸🇪', en: '🇬🇧' };
const LABELS: Record<Lang, string> = { sv: 'Svenska', en: 'English' };

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const active = useProfileStore((s) => s.active);
  const update = useProfileStore((s) => s.update);

  const choose = async (lang: Lang) => {
    await i18n.changeLanguage(lang);
    if (active) await update(active.id, { lang });
  };

  const current = (i18n.language as Lang) ?? 'sv';

  return (
    <div
      className="inline-flex gap-1 rounded-full bg-white/85 p-1 shadow-bloom backdrop-blur-sm"
      role="group"
      aria-label="Language"
    >
      {(['sv', 'en'] as Lang[]).map((lng) => (
        <TapTarget
          key={lng}
          onClick={() => choose(lng)}
          aria-pressed={current === lng}
          className={`rounded-full px-3 py-2 text-sm font-display font-bold transition sm:text-base ${
            current === lng ? 'bg-accent text-white shadow-bloom' : 'bg-transparent text-ink-soft'
          }`}
        >
          <span aria-hidden className="mr-1.5">
            {FLAGS[lng]}
          </span>
          <span className="hidden sm:inline">{LABELS[lng]}</span>
          <span className="sm:hidden">{lng.toUpperCase()}</span>
        </TapTarget>
      ))}
    </div>
  );
}
