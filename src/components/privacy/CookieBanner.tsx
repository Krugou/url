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
    <div className="fixed bottom-0 left-0 z-50 w-full border-t-4 border-text bg-white p-6 shadow-[0_-8px_0_0_rgba(0,0,0,1)]">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="bg-primary p-1.5 border-3 border-text shadow-neo-sm">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-heading text-xl font-black uppercase tracking-tighter">
              {t('consent.headline')}
            </h2>
          </div>
          <p className="max-w-2xl text-sm font-medium leading-relaxed text-text/80">
            {t('consent.body')}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <NeoButton
            variant="secondary"
            onClick={handleReject}
            className="px-4 py-2 text-xs"
          >
            {t('consent.reject_all')}
          </NeoButton>
          <NeoButton
            variant="accent"
            onClick={handleAcceptEssential}
            className="px-4 py-2 text-xs font-black"
          >
            {t('consent.accept_essential')}
          </NeoButton>
          <NeoButton
            variant="primary"
            onClick={handleAcceptAll}
            className="px-6 py-2.5 text-sm font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          >
            {t('consent.accept_all')}
          </NeoButton>
        </div>
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
      {showBanner ? <ReopenedBanner onClose={() => { setShowBanner(false); }} /> : null}
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
    <div className="fixed bottom-0 left-0 z-50 w-full border-t-4 border-text bg-white p-6 shadow-[0_-8px_0_0_rgba(0,0,0,1)]">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <div className="bg-primary p-1.5 border-3 border-text shadow-neo-sm">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <h2 className="font-heading text-xl font-black uppercase tracking-tighter">
              {t('consent.headline')}
            </h2>
          </div>
          <p className="max-w-2xl text-sm font-medium leading-relaxed text-text/80">
            {t('consent.body')}
          </p>
          <p className="text-xs font-black uppercase text-secondary">
             Current status: Analytics {currentState}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <NeoButton variant="secondary" onClick={handleReject} className="px-4 py-2 text-xs">
            {t('consent.reject_all')}
          </NeoButton>
          <NeoButton variant="primary" onClick={handleAccept} className="px-6 py-2.5 text-sm font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            {t('consent.accept_all')}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
