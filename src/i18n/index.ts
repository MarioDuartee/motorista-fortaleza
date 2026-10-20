import { pt, type Dictionary } from './pt';
import { en } from './en';
import { es } from './es';
import { zh } from './zh';
import type { Lang } from './lang';

export const dictionaries: Record<Lang, Dictionary> = { pt, en, es, zh };
export type { Dictionary };
export * from './lang';
