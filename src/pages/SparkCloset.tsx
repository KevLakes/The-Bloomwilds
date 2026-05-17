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
        {/* Stage with Spark on a paper pedestal */}
        <div className="relative flex w-full max-w-md flex-col items-center">
          <SparkAvatar look={active.spark} size={200} />
          <div
            aria-hidden
            className="-mt-4 h-6 w-48 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, color-mix(in srgb, var(--color-ink) 22%, transparent) 0%, transparent 70%)',
            }}
          />
        </div>

        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-lg font-bold sm:text-xl">{t('spark.form.blob').replace(/^./, (c) => c.toUpperCase())}</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {FORMS.map((f) => (
              <TapTarget
                key={f}
                onClick={() => setLook({ form: f })}
                aria-pressed={active.spark.form === f}
                className={`flex flex-col items-center gap-1 rounded-bloom-lg border-[3px] p-2 transition sm:p-3 ${
                  active.spark.form === f
                    ? 'border-accent bg-accent/15 shadow-sticker'
                    : 'border-ink/15 bg-white shadow-bloom'
                }`}
              >
                <SparkAvatar look={{ ...active.spark, form: f }} size={56} bounce={false} />
                <span className="text-xs font-display font-bold sm:text-sm">{t(`spark.form.${f}`)}</span>
              </TapTarget>
            ))}
          </div>
        </section>

        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-lg font-bold sm:text-xl">{t('spark.palette.sun').replace(/^./, (c) => c.toUpperCase())}</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {PALETTES.map((p) => (
              <TapTarget
                key={p}
                onClick={() => setLook({ palette: p })}
                aria-pressed={active.spark.palette === p}
                className={`rounded-full border-[3px] px-3 py-2 font-display font-bold transition sm:px-4 sm:py-3 ${
                  active.spark.palette === p
                    ? 'border-accent bg-accent text-white shadow-sticker'
                    : 'border-ink/15 bg-white text-ink shadow-bloom'
                }`}
              >
                {t(`spark.palette.${p}`)}
              </TapTarget>
            ))}
          </div>
        </section>

        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-lg font-bold sm:text-xl">{t('spark.outfit.none').replace(/^./, (c) => c.toUpperCase())}</h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {OUTFITS.map((o) => (
              <TapTarget
                key={o}
                onClick={() => setLook({ outfit: o })}
                aria-pressed={active.spark.outfit === o}
                className={`rounded-full border-[3px] px-3 py-2 font-display font-bold transition sm:px-4 sm:py-3 ${
                  active.spark.outfit === o
                    ? 'border-accent bg-accent text-white shadow-sticker'
                    : 'border-ink/15 bg-white text-ink shadow-bloom'
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
