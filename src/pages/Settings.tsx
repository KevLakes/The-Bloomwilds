import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { PageShell } from '@/components/ui/PageShell';

export function Settings() {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const setActive = useProfileStore((s) => s.setActive);

  return (
    <PageShell region="home" width="narrow">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-bold text-moss text-fluid-2xl">{t('settings.title')}</h1>
        <LanguageToggle />
      </header>

      <div className="flex flex-col gap-3">
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
    </PageShell>
  );
}

export default Settings;
