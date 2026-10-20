export type Lang = 'pt' | 'en' | 'es' | 'zh';

export interface LangOption {
  code: Lang;
  /** Nome do idioma escrito no próprio idioma (aparece no menu) */
  label: string;
  /** Sigla curta mostrada no botão */
  short: string;
  /** Valor do atributo lang do HTML */
  htmlLang: string;
  /** Locale usado na formatação de números */
  locale: string;
  /** Idioma enviado ao serviço de busca de endereços */
  geoLang: string;
}

export const LANGS: LangOption[] = [
  { code: 'pt', label: 'Português (Brasil)', short: 'PT', htmlLang: 'pt-BR', locale: 'pt-BR', geoLang: 'pt-BR' },
  { code: 'en', label: 'English', short: 'EN', htmlLang: 'en', locale: 'en-US', geoLang: 'en' },
  { code: 'es', label: 'Español', short: 'ES', htmlLang: 'es', locale: 'es-ES', geoLang: 'es' },
  { code: 'zh', label: '中文 (普通话)', short: '中文', htmlLang: 'zh-CN', locale: 'zh-CN', geoLang: 'zh-CN' },
];

export const DEFAULT_LANG: Lang = 'pt';

export function isLang(value: unknown): value is Lang {
  return value === 'pt' || value === 'en' || value === 'es' || value === 'zh';
}

/** Escolhe o idioma pelo navegador quando a pessoa ainda não escolheu um */
export function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return DEFAULT_LANG;
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const raw of prefs) {
    const code = (raw || '').toLowerCase();
    if (code.startsWith('pt')) return 'pt';
    if (code.startsWith('en')) return 'en';
    if (code.startsWith('es')) return 'es';
    if (code.startsWith('zh')) return 'zh';
  }
  return DEFAULT_LANG;
}
