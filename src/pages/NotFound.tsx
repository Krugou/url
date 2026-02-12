import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Ghost } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';

export function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>404 | Link Not Found</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      <main className="flex min-h-screen items-center justify-center bg-bg-main p-4">
        <NeoCard className="max-w-md text-center">
          <Ghost className="mx-auto mb-4 h-16 w-16 text-secondary" />
          <h1 className="mb-2 font-heading text-6xl text-primary">
            {t('not_found.title')}
          </h1>
          <h2 className="mb-2 font-heading text-2xl text-text">
            {t('not_found.subtitle')}
          </h2>
          <p className="mb-8 text-text/70">
            {t('not_found.description')}
          </p>
          <NeoButton
            variant="accent"
            onClick={() => {
              void navigate('/');
            }}
            className="mx-auto"
          >
            {t('not_found.go_home')}
          </NeoButton>
        </NeoCard>
      </main>
    </>
  );
}
