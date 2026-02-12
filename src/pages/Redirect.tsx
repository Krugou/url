import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db } from '../lib/firebase';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';
import { trackEvent } from '../hooks/useAnalytics';

/**
 * Sanitize redirect URL to prevent javascript: / data: XSS attacks.
 */
function sanitizeRedirectUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

export function Redirect() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState('');

  useEffect(() => {
    async function redirect() {
      if (!code) {
        void navigate('/', { replace: true });
        return;
      }

      try {
        const q = query(
          collection(db, 'short_links'),
          where('id', '==', code),
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError(t('redirect.not_found'));
          return;
        }

        const linkDoc = snapshot.docs[0];
        const data = linkDoc.data() as { originalUrl: string };

        // XSS protection: sanitize before redirect
        const safeUrl = sanitizeRedirectUrl(data.originalUrl);
        if (!safeUrl) {
          setError(t('redirect.not_found'));
          return;
        }

        // Increment click counter
        await updateDoc(doc(db, 'short_links', linkDoc.id), {
          clicks: increment(1),
        });

        trackEvent('link_redirect', 'engagement', code);

        // Redirect to original URL
        window.location.replace(safeUrl);
      } catch {
        setError(t('errors.generic'));
      }
    }

    void redirect();
  }, [code, navigate, t]);

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error | NeoLink</title>
        </Helmet>
        <main className="flex min-h-screen items-center justify-center bg-bg-main p-4">
          <NeoCard className="max-w-md text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h1 className="mb-2 font-heading text-2xl text-text">
              {t('redirect.error_title')}
            </h1>
            <p className="mb-6 text-text/70" role="alert" aria-live="polite">
              {error}
            </p>
            <NeoButton
              variant="secondary"
              onClick={() => {
                void navigate('/');
              }}
            >
              {t('redirect.go_home')}
            </NeoButton>
          </NeoCard>
        </main>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Redirecting... | NeoLink</title>
      </Helmet>
      <main className="flex min-h-screen items-center justify-center bg-bg-main">
        <div className="text-center" role="status" aria-live="polite">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="font-heading text-xl text-text">{t('redirect.loading')}</p>
        </div>
      </main>
    </>
  );
}
