const CONSENT_KEY = 'neolink_consent';

type ConsentState = 'granted' | 'denied' | null;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: Gtag.Gtag;
  }
}

function getConsentState(): ConsentState {
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === 'granted' || stored === 'denied') {
    return stored;
  }
  return null;
}

export function setConsent(state: 'granted' | 'denied') {
  localStorage.setItem(CONSENT_KEY, state);

  if (state === 'granted') {
    initGA();
  }

  // Update Google Consent Mode v2
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: state,
      ad_storage: 'denied', // Always denied — we don't run ads
    });
  }
}

export function hasExistingConsent(): boolean {
  return getConsentState() !== null;
}

export function isConsentGranted(): boolean {
  return getConsentState() === 'granted';
}

let gaLoaded = false;

function loadGtagScript(measurementId: string) {
  if (gaLoaded) return;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
  });

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: false, // We handle page views manually
  });

  gaLoaded = true;
}

function initGA() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as
    | string
    | undefined;

  if (!measurementId) return;

  // Respect Do Not Track
  if (navigator.doNotTrack === '1') return;

  loadGtagScript(measurementId);

  // Grant analytics after loading
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
  }
}

export function trackPageView(path: string) {
  if (!isConsentGranted() || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
  });
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
) {
  if (!isConsentGranted() || typeof window.gtag !== 'function') return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
  });
}

// Auto-initialize if consent was previously granted
if (isConsentGranted()) {
  initGA();
}
