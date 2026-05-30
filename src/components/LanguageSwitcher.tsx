import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language.startsWith('fi') ? 'fi' : 'en';
  const nextLang = currentLang === 'en' ? 'fi' : 'en';

  function handleSwitch() {
    void i18n.changeLanguage(nextLang);
  }

  return (
    <button
      onClick={handleSwitch}
      className="
        inline-flex items-center gap-2
        bg-slate-50 border border-slate-200/80
        px-3.5 py-1.5
        rounded-lg
        font-body text-xs font-semibold tracking-wide text-slate-700
        shadow-sm
        transition-all duration-200
        hover:bg-slate-100 active:scale-95
        cursor-pointer
      "
      aria-label={`Switch to ${nextLang === 'fi' ? 'Finnish' : 'English'}`}
    >
      <Languages className="h-4 w-4 text-slate-500" strokeWidth={2} />
      {t(`language.${nextLang}`)}
    </button>
  );
}
