import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function Settings() {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const setActive = useProfileStore((s) => s.setActive);

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <header className="mx-auto mb-6 flex max-w-3xl items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-moss">{t('settings.title')}</h1>
        <LanguageToggle />
      </header>

      <div className="mx-auto max-w-3xl space-y-4">
        <Button onClick={() => navigate('/how-i-play')}>{t('settings.howIPlay')}</Button>
        <Button
          variant="secondary"
          onClick={async () => {
            await setActive(undefined);
            navigate('/profiles');
          }}
        >
          {t('settings.switchProfile')}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/home')}>
          ← {t('back', { ns: 'common' })}
        </Button>
      </div>
    </main>
  );
}

export default Settings;
