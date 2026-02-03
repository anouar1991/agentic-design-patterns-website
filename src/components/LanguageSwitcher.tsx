import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, toggleLanguage } = useLanguage();

  const isEnglish = language === 'en';

  if (compact) {
    return (
      <button
        onClick={toggleLanguage}
        className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors text-dark-300 hover:text-dark-50"
        title={isEnglish ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
      >
        <Languages className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-all text-dark-300 hover:text-dark-50 overflow-hidden"
      title={isEnglish ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <Languages className="w-4 h-4" />
      <div className="relative w-8 h-5 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ y: isEnglish ? 0 : -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          <span className="block h-5 text-sm font-medium leading-5">EN</span>
          <span className="block h-5 text-sm font-medium leading-5 font-arabic">ع</span>
        </motion.div>
      </div>
    </button>
  );
}
