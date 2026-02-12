import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '../lib/firebase';
import { createUrlSchema, type UrlFormData } from '../schemas/url.schema';
import { NeoButton } from './ui/NeoButton';
import { NeoInput } from './ui/NeoInput';
import { NeoCard } from './ui/NeoCard';
import { showToast } from '../lib/toast';
import { trackEvent } from '../hooks/useAnalytics';

interface ShortenedLink {
  code: string;
  originalUrl: string;
  shortUrl: string;
}

const BASE_URL = `${window.location.origin}/url/#`;

/**
 * Sanitize a URL to prevent XSS via javascript: or data: URIs.
 */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
}

interface UrlFormProps {
  onLinkCreated: (link: ShortenedLink) => void;
}

export function UrlForm({ onLinkCreated }: UrlFormProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [aliasError, setAliasError] = useState('');

  const schema = createUrlSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UrlFormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: UrlFormData) {
    // Honeypot check — silent rejection for bots
    if (honeypot) return;

    setAliasError('');
    const sanitized = sanitizeUrl(data.url);
    if (!sanitized) {
      showToast(t('errors.invalid_url'), 'error');
      return;
    }

    setIsLoading(true);

    try {
      let code: string;

      if (customAlias.trim()) {
        // Custom alias — validate format and check availability
        const alias = customAlias.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (alias.length < 2 || alias.length > 20) {
          setAliasError('Alias must be 2-20 characters (letters, numbers, hyphens)');
          setIsLoading(false);
          return;
        }

        // Check collision
        const existing = await getDocs(
          query(collection(db, 'short_links'), where('id', '==', alias)),
        );
        if (!existing.empty) {
          setAliasError('This alias is already taken');
          setIsLoading(false);
          return;
        }
        code = alias;
      } else {
        code = nanoid(6);
      }

      await addDoc(collection(db, 'short_links'), {
        id: code,
        originalUrl: sanitized,
        createdAt: serverTimestamp(),
        clicks: 0,
      });

      const newLink: ShortenedLink = {
        code,
        originalUrl: sanitized,
        shortUrl: `${BASE_URL}/${code}`,
      };

      onLinkCreated(newLink);
      reset();
      setCustomAlias('');
      showToast(t('toast.link_created'), 'success');
      trackEvent('link_shortened', 'engagement', code);
    } catch {
      showToast(t('errors.shorten_failed'), 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <NeoCard className="mx-auto mb-12 max-w-2xl">
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="space-y-6"
        noValidate
      >
        {/* Honeypot — hidden from users, visible to bots */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <input
            type="text"
            name="website_url"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => { setHoneypot(e.target.value); }}
          />
        </div>

        <NeoInput
          label={t('form.label')}
          placeholder={t('form.placeholder')}
          error={errors.url?.message}
          type="url"
          aria-label={t('form.label')}
          className="text-lg"
          {...register('url')}
        />

        {/* Custom Alias (Optional) */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="custom-alias"
            className="font-heading text-sm font-black uppercase tracking-widest text-text"
          >
            Custom alias (optional)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text/40 whitespace-nowrap">
              /url/#/
            </span>
            <input
              id="custom-alias"
              type="text"
              placeholder="my-cool-link"
              value={customAlias}
              onChange={(e) => { setCustomAlias(e.target.value); }}
              maxLength={20}
              className="
                w-full px-3 py-2
                bg-bg-main text-text
                border-3 border-text
                shadow-neo-sm
                font-body text-sm
                placeholder:text-text/30
                focus:shadow-neo focus:outline-none
                transition-shadow duration-100
              "
            />
          </div>
          {aliasError ? (
            <p className="text-xs font-bold text-error">{aliasError}</p>
          ) : null}
        </div>

        <NeoButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          {isLoading ? t('form.submitting') : t('form.submit')}
        </NeoButton>
      </form>
    </NeoCard>
  );
}
