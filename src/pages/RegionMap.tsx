import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { NarratedText } from '@/components/ui/NarratedText';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function RegionMap() {
  const { t } = useTranslation('ui');
  const { t: tr } = useTranslation('regions');
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <header className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-moss">{t('regionMap.title')}</h1>
        <LanguageToggle />
      </header>

      <NarratedText narrationKey="regionPick" className="mx-auto mb-6 max-w-3xl text-lg text-ink/70" />

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
        {(['letterglade', 'numberbrook', 'critter-cove', 'hue-hills', 'feelings-meadow'] as const).map(
          (id) => (
            <div key={id} className="bw-card flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold">{tr(`${id}.name`)}</h2>
                <p className="text-sm text-ink/60">{tr(`${id}.tagline`)}</p>
              </div>
              <Button variant="secondary" disabled>
                {t('regionMap.asleep')}
              </Button>
            </div>
          ),
        )}
      </section>

      <div className="mx-auto mt-8 flex max-w-5xl justify-start">
        <Button variant="secondary" onClick={() => navigate('/home')}>
          ← {t('back', { ns: 'common' })}
        </Button>
      </div>
    </main>
  );
}

export default RegionMap;
