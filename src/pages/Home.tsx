import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Copy, Check, ExternalLink } from 'lucide-react';
import QRCode from 'react-qr-code';
import { NeoButton } from '../components/ui/NeoButton';
import { NeoCard } from '../components/ui/NeoCard';
import { UrlForm } from '../components/UrlForm';
import { PrivacySettingsButton } from '../components/privacy/CookieBanner';
import { showToast } from '../lib/toast';
import { trackEvent } from '../hooks/useAnalytics';

interface ShortenedLink {
  code: string;
  originalUrl: string;
  shortUrl: string;
}

export function Home() {
  const { t } = useTranslation();
  const [recentLinks, setRecentLinks] = useState<ShortenedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleLinkCreated(link: ShortenedLink) {
    setRecentLinks((prev) => [link, ...prev]);
  }

  async function handleCopy(shortUrl: string, code: string) {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(code);
      showToast(t('toast.link_copied'), 'success');
      trackEvent('copy_clipboard', 'engagement', code);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch {
      // Clipboard API not available
    }
  }

  function handleDownloadQR(code: string) {
    const svg = document.getElementById(`qr-${code}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `neolink-${code}.png`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }

  return (
    <>
      <Helmet>
        <title>NeoLink | Brutalist URL Shortener</title>
        <meta
          name="description"
          content="Shorten links with style. A neo-brutalist URL shortener powered by Firebase."
        />
        <meta property="og:title" content="NeoLink | Brutalist URL Shortener" />
        <meta
          property="og:description"
          content="Shorten links with style. A neo-brutalist URL shortener."
        />
        <meta property="og:image" content="/url/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="NeoLink | Brutalist URL Shortener"
        />
        <meta name="twitter:description" content="Shorten links with style." />
        <meta name="twitter:image" content="/url/og-image.png" />
      </Helmet>

      <main className="w-full max-w-4xl space-y-20 py-12 md:py-24">
        {/* Hero Section */}
        <section className="text-center" aria-labelledby="hero-heading">
          <h2
            id="hero-heading"
            className="mb-6 font-heading text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl leading-[1.1]"
          >
            {t('header.tagline')}
            <br />
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              {t('header.tagline_highlight')}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-500 md:text-xl">
            {t('hero.description')}
          </p>
        </section>

        {/* URL Shortener Form */}
        <UrlForm onLinkCreated={handleLinkCreated} />

        {/* Recent Links */}
        {recentLinks.length > 0 ? (
          <section aria-labelledby="links-heading">
            <h3
              id="links-heading"
              className="mb-6 font-heading text-2xl font-bold text-slate-800 text-center"
            >
              {t('links.title')}
            </h3>
            <div className="space-y-6">
              {recentLinks.map((link) => (
                <NeoCard key={link.code} className="space-y-4 animate-slide-in">
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 truncate font-heading text-lg font-bold text-primary">
                        {link.shortUrl}
                      </p>
                      <p className="truncate text-sm text-slate-400 font-medium">
                        {link.originalUrl}
                      </p>
                    </div>
                    <div className="flex w-full shrink-0 gap-3 sm:w-auto">
                      <NeoButton
                        variant="accent"
                        onClick={() =>
                          void handleCopy(link.shortUrl, link.code)
                        }
                        className="flex-1 px-4 py-2 sm:flex-none text-xs font-semibold"
                        aria-label={t('links.copy')}
                      >
                        {copiedId === link.code ? (
                          <div className="flex items-center justify-center gap-2">
                            <Check className="h-5 w-5" />
                            <span className="sm:hidden">
                              {t('links.copied')}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Copy className="h-5 w-5" />
                            <span className="sm:hidden">{t('links.copy')}</span>
                          </div>
                        )}
                      </NeoButton>
                      <a
                        href={link.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex flex-1 items-center justify-center
                          bg-emerald-50 text-emerald-600 border border-emerald-100/80
                          px-4 py-2 rounded-xl
                          shadow-sm
                          transition-all duration-200
                          hover:-translate-y-0.5 hover:bg-emerald-100/80 hover:shadow-md
                          active:translate-y-0 active:scale-[0.98]
                          sm:flex-none
                          cursor-pointer
                        "
                        aria-label={t('links.open')}
                      >
                        <ExternalLink className="h-5 w-5 text-emerald-600" />
                      </a>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="border border-slate-200 bg-white p-3 rounded-2xl shadow-sm">
                      <QRCode
                        id={`qr-${link.code}`}
                        value={link.shortUrl}
                        size={96}
                        level="M"
                      />
                    </div>
                    <NeoButton
                      variant="secondary"
                      onClick={() => {
                        handleDownloadQR(link.code);
                      }}
                      className="w-full px-4 py-2.5 text-xs font-semibold sm:w-auto"
                    >
                      Download QR
                    </NeoButton>
                  </div>
                </NeoCard>
              ))}
            </div>
          </section>
        ) : null}

        {/* Footer Redesign */}
        <footer className="mt-32 w-full border-t border-slate-100 pt-12 pb-24 text-center">
          <div className="mx-auto max-w-2xl">
            <p className="mb-6 text-sm font-medium text-slate-400">
              {t('footer.built_with')}{' '}
              <span className="text-primary font-semibold">
                {t('footer.design')}
              </span>{' '}
              · React · Firebase · Tailwind
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
              <a
                href="#/privacy"
                className="group flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-500 hover:text-slate-800 transition-colors"
              >
                <span>Privacy Policy</span>
              </a>
              <div className="hidden h-4 w-px bg-slate-200 sm:block" />
              <PrivacySettingsButton />
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
