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
        border-3 border-text bg-accent
        px-3 py-1.5
        font-heading text-sm font-bold uppercase tracking-wider text-text
        shadow-neo-sm
        transition-all duration-100
        hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-neo-none
        active:translate-x-[2px] active:translate-y-[2px] active:shadow-neo-none
        cursor-pointer
      "
      aria-label={`Switch to ${nextLang === 'fi' ? 'Finnish' : 'English'}`}
    >
      <Languages className="h-4 w-4" strokeWidth={3} />
      {t(`language.${nextLang}`)}
    </button>
  );
}
