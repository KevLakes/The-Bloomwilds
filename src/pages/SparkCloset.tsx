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

/** Palette body colors mirror SparkAvatar — kept inline so swatches render
 * exactly as the chosen Spark would (no risk of drift). */
const PALETTE_SWATCH: Record<SparkLook['palette'], { body: string; glow: string }> = {
  sun: { body: '#F9D77E', glow: '#FFE9A6' },
  sky: { body: '#8DC9E5', glow: '#C4E4F3' },
  meadow: { body: '#7FB069', glow: '#B5D5A5' },
  berry: { body: '#F4A6C0', glow: '#FBD3E0' },
};

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
        <h1 className="font-display font-bold text-moss text-fluid-2xl">
          {t('profilePicker.pickSpark')}
        </h1>
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

        {/* Form picker — shows mini Sparks so the choice is visual */}
        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-lg font-bold sm:text-xl">
            {t('spark.sections.form')}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {FORMS.map((f) => {
              const isActive = active.spark.form === f;
              return (
                <TapTarget
                  key={f}
                  onClick={() => setLook({ form: f })}
                  aria-pressed={isActive}
                  className={`flex flex-col items-center gap-1 rounded-bloom-lg border-[3px] p-2 transition sm:p-3 ${
                    isActive
                      ? 'border-accent bg-accent/15 shadow-sticker'
                      : 'border-ink/15 bg-white shadow-bloom'
                  }`}
                >
                  <SparkAvatar look={{ ...active.spark, form: f }} size={56} bounce={false} />
                  <span className="text-xs font-display font-bold sm:text-sm">
                    {t(`spark.form.${f}`)}
                  </span>
                </TapTarget>
              );
            })}
          </div>
        </section>

        {/* Palette picker — color swatches first, label below */}
        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-lg font-bold sm:text-xl">
            {t('spark.sections.palette')}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {PALETTES.map((p) => {
              const isActive = active.spark.palette === p;
              const swatch = PALETTE_SWATCH[p];
              return (
                <TapTarget
                  key={p}
                  onClick={() => setLook({ palette: p })}
                  aria-pressed={isActive}
                  className={`flex flex-col items-center gap-1.5 rounded-bloom-lg border-[3px] p-2 transition sm:p-3 ${
                    isActive
                      ? 'border-accent bg-accent/10 shadow-sticker'
                      : 'border-ink/15 bg-white shadow-bloom'
                  }`}
                >
                  <span
                    aria-hidden
                    className="block h-12 w-12 rounded-full ring-2 sm:h-14 sm:w-14"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${swatch.glow} 0%, ${swatch.body} 60%)`,
                      boxShadow: 'inset 0 -3px 0 0 rgba(0,0,0,0.08)',
                      ['--tw-ring-color' as string]: '#2E3440',
                    }}
                  />
                  <span className="text-xs font-display font-bold sm:text-sm">
                    {t(`spark.palette.${p}`)}
                  </span>
                </TapTarget>
              );
            })}
          </div>
        </section>

        {/* Outfit picker — preview Spark wearing the outfit */}
        <section className="bw-card w-full space-y-3">
          <h2 className="font-display text-lg font-bold sm:text-xl">
            {t('spark.sections.outfit')}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {OUTFITS.map((o) => {
              const isActive = active.spark.outfit === o;
              return (
                <TapTarget
                  key={o}
                  onClick={() => setLook({ outfit: o })}
                  aria-pressed={isActive}
                  className={`flex flex-col items-center gap-1 rounded-bloom-lg border-[3px] p-2 transition sm:p-3 ${
                    isActive
                      ? 'border-accent bg-accent/15 shadow-sticker'
                      : 'border-ink/15 bg-white shadow-bloom'
                  }`}
                >
                  <SparkAvatar
                    look={{ ...active.spark, outfit: o }}
                    size={52}
                    bounce={false}
                  />
                  <span className="text-xs font-display font-bold sm:text-sm">
                    {t(`spark.outfit.${o}`)}
                  </span>
                </TapTarget>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

export default SparkCloset;
