import { Moon, Sun } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const label = theme === 'dark' ? t.header.themeToLight : t.header.themeToDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-9 h-9 text-neutral-300 hover:text-white bg-neutral-900 border border-white/10 hover:border-white/25 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-400" />}
    </button>
  );
}
