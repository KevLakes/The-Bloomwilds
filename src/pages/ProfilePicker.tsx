import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProfileStore } from '@/stores/profileStore';
import { Button } from '@/components/ui/Button';
import { TapTarget } from '@/components/ui/TapTarget';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
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
    <main className="min-h-screen bg-canvas px-6 py-10">
      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-moss">{t('profilePicker.title')}</h1>
        <LanguageToggle />
      </header>

      {!showCreate && (
        <section className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3">
          {profiles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bw-card flex flex-col items-center gap-3"
            >
              <SparkAvatar look={p.spark} size={96} />
              <p className="font-display text-2xl font-bold">{p.name}</p>
              <p className="text-sm text-ink/60">{t(`ageGroups.${p.ageGroup}` as const)}</p>
              <div className="flex gap-2">
                <Button onClick={() => pick(p.id)}>{t('start', { ns: 'common' })}</Button>
                <TapTarget
                  className="rounded-bloom px-3 py-2 text-sm text-ink/60"
                  onClick={() => {
                    if (window.confirm(t('profilePicker.deleteConfirm'))) void remove(p.id);
                  }}
                  aria-label={t('profilePicker.delete')}
                >
                  ✕
                </TapTarget>
              </div>
            </motion.div>
          ))}
          <TapTarget
            onClick={() => setShowCreate(true)}
            className="bw-card flex min-h-[200px] flex-col items-center justify-center gap-2 border-2 border-dashed border-leaf/60 bg-white/40"
          >
            <span className="text-5xl">＋</span>
            <span className="font-display text-xl font-bold text-moss">
              {t('profilePicker.newProfile')}
            </span>
          </TapTarget>
        </section>
      )}

      {showCreate && (
        <section className="mx-auto max-w-2xl space-y-6">
          <div className="bw-card space-y-4">
            <h2 className="font-display text-2xl font-bold">{t('profilePicker.createTitle')}</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('profilePicker.namePlaceholder')}
              className="w-full rounded-bloom border-2 border-leaf/40 px-4 py-3 text-2xl"
              aria-label={t('profilePicker.namePlaceholder')}
              maxLength={20}
            />
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

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowCreate(false)} disabled={profiles.length === 0}>
              {t('cancel', { ns: 'common' })}
            </Button>
            <Button onClick={submit}>{t('profilePicker.create')}</Button>
          </div>
        </section>
      )}
    </main>
  );
}

export default ProfilePicker;
