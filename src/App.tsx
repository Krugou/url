import { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ToastContainer } from './components/NeoToast';
import { CookieBanner } from './components/privacy/CookieBanner';
import { trackPageView } from './hooks/useAnalytics';

// Lazy load pages for better bundle distribution
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Redirect = lazy(() => import('./pages/Redirect').then(module => ({ default: module.Redirect })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));

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
    <div className="flex min-h-screen flex-col bg-bg-main">
      {/* Header */}
      <header className="border-b-3 border-text bg-accent py-4" role="banner">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
          <a href="#/" className="flex items-center gap-3 no-underline">
            <Link2 className="h-8 w-8 text-text" strokeWidth={3} />
            <h1 className="font-heading text-3xl text-text">
              {t('header.title')}
            </h1>
          </a>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content - Wider and top-heavy */}
      <div className="flex flex-grow flex-col items-center p-4 pt-12 md:pt-24">
        <div className="w-full max-w-4xl">
          <Suspense fallback={
            <div className="flex items-center justify-center p-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-text border-t-primary shadow-neo-sm"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/:code" element={<Redirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>

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
