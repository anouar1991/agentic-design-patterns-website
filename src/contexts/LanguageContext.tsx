import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL } from '../i18n';

interface LanguageContextType {
  language: string;
  isRTL: boolean;
  changeLanguage: (lang: string) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLang);
  };

  // Update document direction when language changes
  useEffect(() => {
    const currentLang = i18n.language || 'en';
    setLanguage(currentLang);

    // Set document direction and lang attribute
    document.documentElement.dir = isRTL(currentLang) ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // Add/remove RTL class for Tailwind
    if (isRTL(currentLang)) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [i18n.language]);

  // Listen for language changes from i18next
  useEffect(() => {
    const handleLanguageChange = (lang: string) => {
      setLanguage(lang);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL: isRTL(language),
        changeLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
