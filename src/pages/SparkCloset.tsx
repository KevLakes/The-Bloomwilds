import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import { Button } from '@/components/ui/Button';
import { TapTarget } from '@/components/ui/TapTarget';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
import { PageShell } from '@/components/ui/PageShell';
import type { SparkForm, SparkLook } from '@/types';

const FORMS: SparkForm[] = ['blob', 'fox', 'bird'];
const PALETTES: SparkLook['palette'][] = ['sun', 'sky', 'meadow', 'berry'];
const OUTFITS: SparkLook['outfit'][] = ['none', 'hat', 'scarf'];

export function SparkCloset() {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const active = useProfileStore((s) => s.active);
  const update = useProfileStore((s) => s.update);

  if (!active) {
    navigate('/profiles', { replace: true });
    return null;
  }

  const setLook = (patch: Partial<SparkLook>) => {
    void update(active.id, { spark: { ...active.spark, ...patch } });
  };

  return (
    <PageShell region="home" width="narrow">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-bold text-moss text-fluid-2xl">{t('profilePicker.pickSpark')}</h1>
        <Button variant="secondary" onClick={() => navigate('/home')}>
          ← {t('back', { ns: 'common' })}
        </Button>
      </header>

      <div className="flex flex-col items-center gap-6">
        <SparkAvatar look={active.spark} size={200} />

        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-xl font-bold">{t('spark.form.blob').replace(/^./, (c) => c.toUpperCase())}</h2>
          <div className="flex flex-wrap gap-3">
            {FORMS.map((f) => (
              <TapTarget
                key={f}
                onClick={() => setLook({ form: f })}
                aria-pressed={active.spark.form === f}
                className={`flex flex-col items-center gap-1 rounded-bloom p-3 ${
                  active.spark.form === f ? 'bg-leaf/20 ring-2 ring-leaf' : 'bg-white'
                }`}
              >
                <SparkAvatar look={{ ...active.spark, form: f }} size={64} bounce={false} />
                <span className="text-sm">{t(`spark.form.${f}`)}</span>
              </TapTarget>
            ))}
          </div>
        </section>

        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-xl font-bold">{t('spark.palette.sun').replace(/^./, (c) => c.toUpperCase())}</h2>
          <div className="flex flex-wrap gap-3">
            {PALETTES.map((p) => (
              <TapTarget
                key={p}
                onClick={() => setLook({ palette: p })}
                aria-pressed={active.spark.palette === p}
                className={`rounded-bloom px-4 py-3 ${
                  active.spark.palette === p ? 'bg-leaf text-white' : 'bg-white text-ink'
                }`}
              >
                {t(`spark.palette.${p}`)}
              </TapTarget>
            ))}
          </div>
        </section>

        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-xl font-bold">{t('spark.outfit.none').replace(/^./, (c) => c.toUpperCase())}</h2>
          <div className="flex flex-wrap gap-3">
            {OUTFITS.map((o) => (
              <TapTarget
                key={o}
                onClick={() => setLook({ outfit: o })}
                aria-pressed={active.spark.outfit === o}
                className={`rounded-bloom px-4 py-3 ${
                  active.spark.outfit === o ? 'bg-leaf text-white' : 'bg-white text-ink'
                }`}
              >
                {t(`spark.outfit.${o}`)}
              </TapTarget>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default SparkCloset;
