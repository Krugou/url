import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { NeoCard } from '../components/ui/NeoCard';
import { NeoButton } from '../components/ui/NeoButton';

export function Privacy() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-main">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <NeoButton
          variant="secondary"
          onClick={() => {
            void navigate('/');
          }}
          className="mb-8 text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('redirect.go_home')}
        </NeoButton>

        <div className="mb-8 flex items-center gap-4">
          <Shield className="h-10 w-10 text-secondary" strokeWidth={3} />
          <h1 className="font-heading text-4xl text-text">
            {t('privacy.page_title')}
          </h1>
        </div>

        <div className="space-y-6">
          <NeoCard>
            <h2 className="mb-3 font-heading text-xl text-text">
              {t('privacy.data_collect_title')}
            </h2>
            <p className="text-sm leading-relaxed text-text/80">
              {t('privacy.data_collect_body')}
            </p>
          </NeoCard>

          <NeoCard>
            <h2 className="mb-3 font-heading text-xl text-text">
              {t('privacy.how_use_title')}
            </h2>
            <p className="text-sm leading-relaxed text-text/80">
              {t('privacy.how_use_body')}
            </p>
          </NeoCard>

          <NeoCard>
            <h2 className="mb-3 font-heading text-xl text-text">
              {t('privacy.third_parties_title')}
            </h2>
            <p className="mb-3 text-sm leading-relaxed text-text/80">
              {t('privacy.third_parties_body')}
            </p>
            <ul className="ml-4 list-disc space-y-2 text-sm text-text/80">
              <li>{t('privacy.third_parties_ga')}</li>
              <li>{t('privacy.third_parties_firebase')}</li>
            </ul>
          </NeoCard>

          <NeoCard>
            <h2 className="mb-3 font-heading text-xl text-text">
              {t('privacy.your_rights_title')}
            </h2>
            <p className="text-sm leading-relaxed text-text/80">
              {t('privacy.your_rights_body')}
            </p>
          </NeoCard>

          <NeoCard>
            <h2 className="mb-3 font-heading text-xl text-text">
              {t('privacy.contact_title')}
            </h2>
            <p className="mb-2 text-sm leading-relaxed text-text/80">
              {t('privacy.contact_body')}
            </p>
            <a
              href={`mailto:${t('privacy.contact_email')}`}
              className="font-heading text-primary underline"
            >
              {t('privacy.contact_email')}
            </a>
          </NeoCard>

          <p className="text-xs text-text/40">
            {t('privacy.last_updated')}: 2026-02-12
          </p>
        </div>
      </div>
    </div>
  );
}
