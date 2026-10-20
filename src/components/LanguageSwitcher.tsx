import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';
import { LANGS } from '../i18n/lang';

interface LanguageSwitcherProps {
  /** Abre o menu para cima/baixo e alinha à direita (padrão) ou à esquerda */
  align?: 'right' | 'left';
}

export default function LanguageSwitcher({ align = 'right' }: LanguageSwitcherProps) {
  const { lang, setLang, option, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t.lang.choose}: ${option.label}`}
        className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-white/10 hover:border-white/25 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
      >
        <Globe className="w-4 h-4 text-amber-400" />
        <span>{option.short}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          id={menuId}
          role="listbox"
          aria-label={t.lang.menuLabel}
          className={`absolute z-50 mt-2 w-52 rounded-xl border border-white/15 bg-neutral-900 shadow-2xl overflow-hidden py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === lang}>
              <button
                type="button"
                lang={l.htmlLang}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm text-left transition-colors cursor-pointer hover:bg-neutral-800 ${
                  l.code === lang ? 'text-amber-300 font-semibold' : 'text-neutral-200'
                }`}
              >
                <span>{l.label}</span>
                {l.code === lang && <Check className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
