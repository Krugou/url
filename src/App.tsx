import { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Home } from './pages/Home';
import { Redirect } from './pages/Redirect';
import { NotFound } from './pages/NotFound';
import { Privacy } from './pages/Privacy';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ToastContainer } from './components/NeoToast';
import { CookieBanner } from './components/privacy/CookieBanner';
import { trackPageView } from './hooks/useAnalytics';

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

function Layout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Header */}
      <header className="border-b-3 border-text bg-accent py-4" role="banner">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4">
          <a href="#/" className="flex items-center gap-3 no-underline">
            <Link2 className="h-8 w-8 text-text" strokeWidth={3} />
            <h1 className="font-heading text-3xl text-text">
              {t('header.title')}
            </h1>
          </a>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/:code" element={<Redirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global components */}
      <ToastContainer />
      <CookieBanner />
      <PageViewTracker />
    </div>
  );
}

export function App() {
  return (
    <HelmetProvider>
      <HashRouter>
        <Layout />
      </HashRouter>
    </HelmetProvider>
  );
}
