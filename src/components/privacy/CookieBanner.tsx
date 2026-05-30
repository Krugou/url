import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import { NeoButton } from '../ui/NeoButton';
import {
  hasExistingConsent,
  setConsent,
  isConsentGranted,
} from '../../hooks/useAnalytics';

function getInitialVisibility(): boolean {
  return !hasExistingConsent();
}

export function CookieBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(getInitialVisibility);

  function handleAcceptAll() {
    setConsent('granted');
    setIsVisible(false);
  }

  function handleAcceptEssential() {
    setConsent('denied');
    setIsVisible(false);
  }

  function handleReject() {
    setConsent('denied');
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50 bg-white/95 backdrop-blur-md border border-slate-100 shadow-2xl p-6 rounded-2xl flex flex-col gap-4 animate-slide-in">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-lg font-bold text-slate-900 leading-tight">
            {t('consent.headline')}
          </h2>
        </div>
        <p className="text-sm font-medium leading-relaxed text-slate-500">
          {t('consent.body')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 mt-2 justify-end">
        <NeoButton
          variant="secondary"
          onClick={handleReject}
          className="px-4 py-2.5 text-xs font-semibold flex-1 sm:flex-none"
        >
          {t('consent.reject_all')}
        </NeoButton>
        <NeoButton
          variant="accent"
          onClick={handleAcceptEssential}
          className="px-4 py-2.5 text-xs font-semibold flex-1 sm:flex-none"
        >
          {t('consent.accept_essential')}
        </NeoButton>
        <NeoButton
          variant="primary"
          onClick={handleAcceptAll}
          className="px-5 py-2.5 text-xs font-semibold flex-1 sm:flex-none"
        >
          {t('consent.accept_all')}
        </NeoButton>
      </div>
    </div>
  );
}

export function PrivacySettingsButton() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);

  function handleClick() {
    localStorage.removeItem('neolink_consent');
    setShowBanner(true);
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="text-sm underline text-text/50 hover:text-text transition-colors cursor-pointer"
      >
        {t('footer.privacy_settings')}
      </button>
      {showBanner ? (
        <ReopenedBanner
          onClose={() => {
            setShowBanner(false);
          }}
        />
      ) : null}
    </>
  );
}

function ReopenedBanner({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  function handleAccept() {
    setConsent('granted');
    onClose();
  }

  function handleReject() {
    setConsent('denied');
    onClose();
  }

  const currentState = isConsentGranted() ? 'granted' : 'denied';

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50 bg-white/95 backdrop-blur-md border border-slate-100 shadow-2xl p-6 rounded-2xl flex flex-col gap-4 animate-slide-in">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="font-heading text-lg font-bold text-slate-900 leading-tight">
            {t('consent.headline')}
          </h2>
        </div>
        <p className="text-sm font-medium leading-relaxed text-slate-500">
          {t('consent.body')}
        </p>
        <p className="text-xs font-semibold uppercase text-secondary tracking-wider">
          Current status: Analytics {currentState}
        </p>
      </div>

      <div className="flex gap-2.5 mt-2 justify-end">
        <NeoButton
          variant="secondary"
          onClick={handleReject}
          className="px-4 py-2.5 text-xs font-semibold flex-1"
        >
          {t('consent.reject_all')}
        </NeoButton>
        <NeoButton
          variant="primary"
          onClick={handleAccept}
          className="px-5 py-2.5 text-xs font-semibold flex-1"
        >
          {t('consent.accept_all')}
        </NeoButton>
      </div>
    </div>
  );
}
