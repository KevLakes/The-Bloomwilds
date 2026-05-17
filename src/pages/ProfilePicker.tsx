import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProfileStore } from '@/stores/profileStore';
import { Button } from '@/components/ui/Button';
import { TapTarget } from '@/components/ui/TapTarget';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
import { PageShell } from '@/components/ui/PageShell';
import type { AgeGroupId, Lang, SparkForm, SparkLook } from '@/types';

const AGE_GROUPS: { id: AgeGroupId; available: boolean }[] = [
  { id: '3-4', available: false },
  { id: '5-7', available: true },
  { id: '8-9', available: false },
  { id: '10-12', available: false },
];

const FORMS: SparkForm[] = ['blob', 'fox', 'bird'];
const PALETTES: SparkLook['palette'][] = ['sun', 'sky', 'meadow', 'berry'];

export function ProfilePicker() {
  const { t, i18n } = useTranslation('ui');
  const navigate = useNavigate();
  const profiles = useProfileStore((s) => s.profiles);
  const setActive = useProfileStore((s) => s.setActive);
  const create = useProfileStore((s) => s.create);
  const remove = useProfileStore((s) => s.remove);

  const [showCreate, setShowCreate] = useState(profiles.length === 0);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroupId>('5-7');
  const [lang, setLang] = useState<Lang>((i18n.language as Lang) ?? 'sv');
  const [form, setForm] = useState<SparkForm>('blob');
  const [palette, setPalette] = useState<SparkLook['palette']>('meadow');

  const pick = async (id: string) => {
    await setActive(id);
    navigate('/home');
  };

  const submit = async () => {
    const safeName = name.trim() || (lang === 'sv' ? 'Vän' : 'Friend');
    await create({
      name: safeName,
      ageGroup,
      lang,
      spark: { form, palette, outfit: 'none' },
    });
    if (i18n.language !== lang) await i18n.changeLanguage(lang);
    navigate('/how-i-play');
  };

  return (
    <PageShell region="home">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-bold text-moss text-fluid-2xl">{t('profilePicker.title')}</h1>
        <LanguageToggle />
      </header>

      {!showCreate && (
        <section className="bw-grid-cards">
          {profiles.map((p, i) => {
            const tilt = ((i * 7) % 5) - 2; // deterministic small tilt
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24, rotate: tilt - 4 }}
                animate={{ opacity: 1, y: 0, rotate: tilt }}
                whileHover={{ y: -3, rotate: 0, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="relative"
              >
                <div className="bw-card flex flex-col items-center gap-3">
                  <SparkAvatar look={p.spark} size={96} />
                  <p className="font-display text-xl font-bold sm:text-2xl">{p.name}</p>
                  <p className="text-sm text-ink-soft">{t(`ageGroups.${p.ageGroup}` as const)}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => pick(p.id)}>{t('start', { ns: 'common' })}</Button>
                    <TapTarget
                      className="rounded-full px-3 py-2 text-sm font-display text-ink-soft hover:bg-ink/5"
                      onClick={() => {
                        if (window.confirm(t('profilePicker.deleteConfirm'))) void remove(p.id);
                      }}
                      aria-label={t('profilePicker.delete')}
                    >
                      ✕
                    </TapTarget>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <TapTarget
            onClick={() => setShowCreate(true)}
            className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-bloom-lg border-[3px] border-dashed bg-white/40 transition hover:bg-white/70"
            style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 60%, transparent)' }}
          >
            <span className="text-5xl animate-soft-pulse" style={{ color: 'var(--color-accent)' }}>
              ＋
            </span>
            <span className="font-display text-xl font-bold text-moss">
              {t('profilePicker.newProfile')}
            </span>
          </TapTarget>
        </section>
      )}

      {showCreate && (
        <section className="bw-content-narrow bw-stack">
          <div className="bw-card space-y-4">
            <h2 className="font-display text-xl font-bold sm:text-2xl">{t('profilePicker.createTitle')}</h2>
            <label className="block">
              <span className="mb-1 block text-sm font-display font-bold text-ink-soft">
                {t('profilePicker.namePlaceholder')}
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('profilePicker.namePlaceholder')}
                className="w-full rounded-bloom-lg border-[3px] bg-white px-4 py-3 text-xl font-display transition focus:outline-none sm:text-2xl"
                style={{
                  borderColor: 'color-mix(in srgb, var(--color-accent) 35%, transparent)',
                  boxShadow: '4px 5px 0 0 color-mix(in srgb, var(--color-ink) 14%, transparent)',
                }}
                aria-label={t('profilePicker.namePlaceholder')}
                maxLength={20}
              />
            </label>
          </div>

          <div className="bw-card space-y-3">
            <h2 className="font-display text-xl font-bold">{t('profilePicker.pickAge')}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {AGE_GROUPS.map(({ id, available }) => (
                <TapTarget
                  key={id}
                  onClick={() => available && setAgeGroup(id)}
                  aria-pressed={ageGroup === id}
                  disabled={!available}
                  className={`rounded-bloom px-4 py-4 text-lg font-bold transition ${
                    ageGroup === id
                      ? 'bg-leaf text-white'
                      : available
                        ? 'bg-white text-ink'
                        : 'bg-white/40 text-ink/40'
                  }`}
                >
                  <span className="block">{t(`ageGroups.${id}` as const)}</span>
                  {!available && (
                    <span className="mt-1 block text-xs">{t('ageGroups.comingSoon')}</span>
                  )}
                </TapTarget>
              ))}
            </div>
          </div>

          <div className="bw-card space-y-3">
            <h2 className="font-display text-xl font-bold">{t('profilePicker.pickLang')}</h2>
            <div className="flex gap-3">
              {(['sv', 'en'] as Lang[]).map((lng) => (
                <TapTarget
                  key={lng}
                  onClick={() => setLang(lng)}
                  aria-pressed={lang === lng}
                  className={`flex-1 rounded-bloom px-4 py-4 text-xl font-bold ${
                    lang === lng ? 'bg-leaf text-white' : 'bg-white text-ink'
                  }`}
                >
                  {t(`languages.${lng}`)}
                </TapTarget>
              ))}
            </div>
          </div>

          <div className="bw-card space-y-3">
            <h2 className="font-display text-xl font-bold">{t('profilePicker.pickSpark')}</h2>
            <div className="flex flex-wrap gap-4">
              {FORMS.map((f) => (
                <TapTarget
                  key={f}
                  onClick={() => setForm(f)}
                  aria-pressed={form === f}
                  className={`flex flex-col items-center gap-1 rounded-bloom p-3 ${
                    form === f ? 'bg-leaf/20 ring-2 ring-leaf' : 'bg-white'
                  }`}
                >
                  <SparkAvatar look={{ form: f, palette, outfit: 'none' }} size={72} bounce={false} />
                  <span className="text-sm">{t(`spark.form.${f}`)}</span>
                </TapTarget>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              {PALETTES.map((p) => (
                <TapTarget
                  key={p}
                  onClick={() => setPalette(p)}
                  aria-pressed={palette === p}
                  className={`rounded-bloom px-4 py-2 text-sm ${
                    palette === p ? 'bg-leaf text-white' : 'bg-white text-ink'
                  }`}
                >
                  {t(`spark.palette.${p}`)}
                </TapTarget>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCreate(false)} disabled={profiles.length === 0}>
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={submit}>{t('profilePicker.create')}</Button>
          </div>
        </section>
      )}
    </PageShell>
  );
}

export default ProfilePicker;
