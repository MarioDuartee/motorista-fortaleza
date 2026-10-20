import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dictionaries, type Dictionary } from './index';
import { DEFAULT_LANG, LANGS, detectBrowserLang, isLang, type Lang, type LangOption } from './lang';

const STORAGE_KEY = 'mario-site-lang';

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
  option: LangOption;
  /** Troca {chaves} de um texto pelos valores informados */
  fmt: (template: string, vars: Record<string, string | number>) => string;
  /** Valor em reais no formato do idioma, ex.: R$ 36,00 */
  money: (value: number) => string;
  /** Quilômetros no formato do idioma, ex.: 12,4 km */
  km: (value: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function readInitialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(saved)) return saved;
  } catch {
    // navegador sem acesso ao armazenamento: segue pelo idioma do navegador
  }
  return detectBrowserLang();
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (typeof window === 'undefined' ? DEFAULT_LANG : readInitialLang()));

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // sem armazenamento: a escolha vale só nesta visita
    }
  }, []);

  const option = useMemo(() => LANGS.find((l) => l.code === lang) ?? LANGS[0], [lang]);
  const t = dictionaries[lang];

  // Mantém o <html lang>, o título da aba e a descrição na língua escolhida
  useEffect(() => {
    document.documentElement.lang = option.htmlLang;
    document.title = t.meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t.meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', t.meta.title);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', t.meta.description);
  }, [option, t]);

  const value = useMemo<I18nValue>(() => {
    const fmt = (template: string, vars: Record<string, string | number>) =>
      template.replace(/\{(\w+)\}/g, (_, key: string) => (key in vars ? String(vars[key]) : `{${key}}`));
    const money = (n: number) =>
      `R$ ${n.toLocaleString(option.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const km = (n: number) => `${n.toLocaleString(option.locale, { maximumFractionDigits: 1 })} km`;
    return { lang, setLang, t, option, fmt, money, km };
  }, [lang, setLang, t, option]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n precisa estar dentro de <LanguageProvider>');
  return ctx;
}
