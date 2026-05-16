import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';

export function StickerBook() {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const stickers = useProgressStore((s) => s.progress?.inventory.stickers ?? []);

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <h1 className="mb-6 font-display text-4xl font-bold text-moss">{t('stickers')}</h1>
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-3 md:grid-cols-6">
        {stickers.length === 0 && <p className="col-span-full text-ink/60">— —</p>}
        {stickers.map((s) => (
          <div key={s} className="bw-card flex aspect-square items-center justify-center text-4xl">
            ⭐
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-5xl">
        <Button variant="secondary" onClick={() => navigate('/home')}>
          ← {t('back', { ns: 'common' })}
        </Button>
      </div>
    </main>
  );
}

export default StickerBook;
