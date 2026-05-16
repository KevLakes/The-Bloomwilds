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
    <div className="inline-flex gap-2 rounded-bloom bg-white/80 p-2 shadow-bloom" role="group" aria-label="Language">
      {(['sv', 'en'] as Lang[]).map((lng) => (
        <TapTarget
          key={lng}
          onClick={() => choose(lng)}
          aria-pressed={current === lng}
          className={`rounded-bloom px-4 py-3 text-lg font-display ${
            current === lng ? 'bg-leaf text-white' : 'bg-transparent text-ink'
          }`}
        >
          <span aria-hidden className="mr-2">
            {FLAGS[lng]}
          </span>
          {LABELS[lng]}
        </TapTarget>
      ))}
    </div>
  );
}
