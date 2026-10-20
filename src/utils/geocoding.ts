/**
 * Busca de endereços com o Nominatim (OpenStreetMap): gratuito e sem chave de API.
 *
 * Regras de uso do serviço público (https://operations.osmfoundation.org/policies/nominatim/):
 * - no máximo 1 busca por segundo;
 * - sem "autocompletar" a cada letra digitada.
 * Por isso a busca só acontece quando a pessoa confirma (Enter, lupa ou ao sair do campo),
 * os pedidos são espaçados e os resultados repetidos ficam em cache.
 *
 * Se o site passar a ter muito acesso, troque este arquivo por um serviço pago
 * (Google Places, Mapbox, LocationIQ...). O restante do site não precisa mudar.
 */

export interface GeoResult {
  id: string;
  label: string;
  fullName: string;
  lat: number;
  lng: number;
  /** O mapa tem o número exato da casa/prédio (e não só a rua) */
  hasHouseNumber: boolean;
}

/**
 * Deixa o endereço no formato que o serviço de busca entende melhor:
 * "rua abc, numero 20", "rua abc, nº 20" e "rua abc, 20" viram "rua abc 20".
 */
export function normalizeAddressQuery(raw: string): string {
  let q = raw.trim().replace(/\s+/g, ' ');
  // " – " e " - " usados como separador viram vírgula: "Rua X, 100 – Meireles" -> "Rua X, 100, Meireles"
  q = q.replace(/\s[–—-]\s/g, ', ');
  // palavras que só indicam "número": número, numero, num., nº, n°, n.º, n., n, number (não mexe em "no", que é "em o")
  q = q.replace(/(^|[\s,;])(?:n[uú]mero|num\.?|number|n\.?\s?[º°]\.?|n\.|n(?=\s+\d))\s*[:.]?\s*(?=\d)/gi, '$1');
  // "rua abc, 20" -> "rua abc 20" (só quando o que vem antes da vírgula não tem número)
  q = q.replace(/^([^,\d]+?)\s*[,;]\s*(\d{1,5}[a-zA-Z]?)(?=$|[\s,;])/, '$1 $2');
  return q.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim();
}

/** O primeiro trecho do endereço (antes da primeira vírgula) tem número de casa? */
export function hasHouseNumberInQuery(normalized: string): boolean {
  const first = normalized.split(',')[0];
  return /\b\d{1,5}[a-zA-Z]?\b/.test(first);
}

/** Tira o número da casa do primeiro trecho: "rua abc 20, meireles" -> "rua abc, meireles" */
export function stripHouseNumber(normalized: string): string {
  const [first, ...rest] = normalized.split(',');
  const cleaned = first.replace(/\s*\b\d{1,5}[a-zA-Z]?\b\s*$/, '').trim();
  return [cleaned, ...rest.map((r) => r.trim())].filter(Boolean).join(', ');
}

interface NominatimItem {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  address?: Record<string, string | undefined>;
}

const ENDPOINT = 'https://nominatim.openstreetmap.org/search';
const MIN_GAP_MS = 1100;

// Região de preferência (Ceará), para que "Rua Silva" venha de Fortaleza antes de qualquer outra cidade
const CEARA_VIEWBOX = '-41.5,-2.7,-37.2,-7.9';

const cache = new Map<string, GeoResult[]>();
let queue: Promise<unknown> = Promise.resolve();
let lastStart = 0;

function buildLabel(item: NominatimItem): string {
  const a = item.address ?? {};
  const street = a.road ? (a.house_number ? `${a.road}, ${a.house_number}` : a.road) : undefined;
  const head = item.name && item.name !== a.road ? item.name : (street ?? item.name);
  const area = a.suburb ?? a.neighbourhood ?? a.city_district;
  const city = a.city ?? a.town ?? a.village ?? a.municipality;

  const parts: string[] = [];
  for (const part of [head, area, city]) {
    if (part && !parts.includes(part)) parts.push(part);
  }
  if (parts.length > 0) return parts.join(', ');
  return item.display_name.split(',').slice(0, 3).join(',').trim();
}

/** Espera a vez na fila para respeitar o intervalo mínimo entre buscas */
function throttled<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const wait = lastStart + MIN_GAP_MS - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastStart = Date.now();
    return task();
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function searchPlaces(query: string, geoLang: string, signal?: AbortSignal): Promise<GeoResult[]> {
  const q = query.trim();
  if (!q) return [];

  const cacheKey = `${geoLang}|${q.toLowerCase()}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    q,
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
    countrycodes: 'br',
    viewbox: CEARA_VIEWBOX,
    bounded: '0',
    'accept-language': geoLang,
  });

  const results = await throttled(async () => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);
    const data = (await res.json()) as NominatimItem[];
    return data
      .map<GeoResult>((item) => ({
        id: String(item.place_id),
        label: buildLabel(item),
        fullName: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
        hasHouseNumber: !!item.address?.house_number,
      }))
      .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lng));
  });

  cache.set(cacheKey, results);
  return results;
}

interface NominatimReverse extends NominatimItem {
  error?: string;
}

/** Descobre o endereço de uma coordenada (usado no botão "usar minha localização") */
export async function reversePlace(
  lat: number,
  lng: number,
  geoLang: string,
  signal?: AbortSignal
): Promise<GeoResult | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'jsonv2',
    addressdetails: '1',
    zoom: '18',
    'accept-language': geoLang,
  });

  return throttled(async () => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);
    const item = (await res.json()) as NominatimReverse;
    if (item.error || !item.display_name) return null;
    return {
      id: `gps-${item.place_id}`,
      label: buildLabel(item),
      fullName: item.display_name,
      lat,
      lng,
      hasHouseNumber: !!item.address?.house_number,
    };
  });
}
