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
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-2xl border-3 border-text bg-bg-main p-6 shadow-neo">
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-secondary" strokeWidth={3} />
          <h3 className="font-heading text-xl text-text">
            {t('consent.headline')}
          </h3>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-text/80">
          {t('consent.body')}
        </p>
        <div className="flex flex-wrap gap-3">
          <NeoButton variant="secondary" onClick={handleReject} className="text-xs px-4 py-2">
            {t('consent.reject_all')}
          </NeoButton>
          <NeoButton variant="accent" onClick={handleAcceptEssential} className="text-xs px-4 py-2">
            {t('consent.accept_essential')}
          </NeoButton>
          <NeoButton variant="primary" onClick={handleAcceptAll} className="text-xs px-4 py-2">
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
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-2xl border-3 border-text bg-bg-main p-6 shadow-neo">
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-secondary" strokeWidth={3} />
          <h3 className="font-heading text-xl text-text">
            {t('consent.headline')}
          </h3>
        </div>
        <p className="mb-2 text-sm text-text/80">
          {t('consent.body')}
        </p>
        <p className="mb-6 text-xs text-text/50">
          Current status: Analytics {currentState}
        </p>
        <div className="flex flex-wrap gap-3">
          <NeoButton variant="secondary" onClick={handleReject} className="text-xs px-4 py-2">
            {t('consent.reject_all')}
          </NeoButton>
          <NeoButton variant="primary" onClick={handleAccept} className="text-xs px-4 py-2">
            {t('consent.accept_all')}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
