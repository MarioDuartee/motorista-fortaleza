import type { Lang } from '../i18n/lang';

export interface LocationPoint {
  id: string;
  /** Nome em português (também é o nome enviado ao Mário no WhatsApp) */
  name: string;
  /** Nome nos outros idiomas, quando existir */
  names?: Partial<Record<Lang, string>>;
  /** Outras formas de escrever o mesmo local (ex.: o endereço), para a busca reconhecer */
  aliases?: string[];
  region: string;
  lat: number;
  lng: number;
  /** true quando o ponto veio da busca de endereço digitado */
  custom?: boolean;
}

export const FORTALEZA_LOCATIONS: LocationPoint[] = [
  {
    id: 'aeroporto',
    name: 'Aeroporto Pinto Martins (FOR)',
    names: { en: 'Pinto Martins Airport (FOR)', es: 'Aeropuerto Pinto Martins (FOR)', zh: '平托·马丁斯机场 (FOR)' },
    aliases: [
      'Avenida Senador Carlos Jereissati, 3000',
      'Av. Senador Carlos Jereissati, 3000',
      'Av. Sen. Carlos Jereissati, 3000',
      'Aeroporto de Fortaleza',
      'Aeroporto Internacional de Fortaleza',
      'Fortaleza Airport',
    ],
    region: 'Aeroporto / Serrinha',
    // Terminal de passageiros, na Av. Senador Carlos Jereissati, 3000 (o ponto anterior ficava no centro da pista)
    lat: -3.77901,
    lng: -38.54086,
  },
  {
    id: 'beiramar',
    name: 'Av. Beira-Mar (Meireles / Feirinha)',
    names: {
      en: 'Beira-Mar Avenue (Meireles / Craft Fair)',
      es: 'Av. Beira-Mar (Meireles / Feria de Artesanía)',
      zh: '海滨大道 Av. Beira-Mar（梅雷莱斯 / 手工艺市集）',
    },
    region: 'Orla de Fortaleza',
    lat: -3.7251,
    lng: -38.4984,
  },
  {
    id: 'iracema',
    name: 'Praia de Iracema (Ponte dos Ingleses)',
    names: {
      en: 'Iracema Beach (Ponte dos Ingleses)',
      es: 'Playa de Iracema (Ponte dos Ingleses)',
      zh: '伊拉塞马海滩（英国人桥 Ponte dos Ingleses）',
    },
    region: 'Orla de Fortaleza',
    lat: -3.7196,
    lng: -38.5144,
  },
  {
    id: 'mucuripe',
    name: 'Mucuripe (Mercado dos Peixes)',
    names: { en: 'Mucuripe (Fish Market)', es: 'Mucuripe (Mercado de Pescado)', zh: '穆库里佩（鱼市 Mercado dos Peixes）' },
    region: 'Orla de Fortaleza',
    lat: -3.7198,
    lng: -38.4795,
  },
  {
    id: 'aldeota',
    name: 'Aldeota / Dionísio Torres',
    names: { zh: '阿尔德奥塔 Aldeota / Dionísio Torres' },
    region: 'Zona Nobre Central',
    lat: -3.7431,
    lng: -38.5029,
  },
  {
    id: 'beachpark',
    name: 'Beach Park / Porto das Dunas',
    names: { zh: '海滩公园 Beach Park / 杜纳斯港 Porto das Dunas' },
    region: 'Aquiraz / Litoral Leste',
    lat: -3.8449,
    lng: -38.3917,
  },
  {
    id: 'centroeventos',
    name: 'Centro de Eventos do Ceará',
    names: { en: 'Ceará Events Center', es: 'Centro de Eventos de Ceará', zh: '塞阿拉会展中心 (Centro de Eventos do Ceará)' },
    region: 'Edson Queiroz / Guararapes',
    lat: -3.7788,
    lng: -38.4796,
  },
  {
    id: 'iguatemi',
    name: 'Shopping Iguatemi Bosque',
    names: { en: 'Iguatemi Bosque Mall', zh: '伊瓜特米森林购物中心 (Iguatemi Bosque)' },
    region: 'Edson Queiroz',
    lat: -3.7663,
    lng: -38.4878,
  },
  {
    id: 'riomar',
    name: 'Shopping RioMar Fortaleza',
    names: { en: 'RioMar Fortaleza Mall', zh: '福塔莱萨 RioMar 购物中心' },
    region: 'Papicu',
    lat: -3.7428,
    lng: -38.4729,
  },
  {
    id: 'cumbuco',
    name: 'Praia do Cumbuco',
    names: { en: 'Cumbuco Beach', es: 'Playa de Cumbuco', zh: '昆布科海滩 (Cumbuco)' },
    region: 'Caucaia / Litoral Oeste',
    lat: -3.6268,
    lng: -38.7303,
  },
  {
    id: 'prainha',
    name: 'Prainha / Aquiraz Centro',
    names: { en: 'Prainha / Aquiraz Center', es: 'Prainha / Centro de Aquiraz', zh: '普拉伊尼亚 / 阿基拉兹市中心 (Prainha / Aquiraz)' },
    region: 'Litoral Leste',
    lat: -3.8863,
    lng: -38.3582,
  },
  {
    id: 'morrobranco',
    name: 'Morro Branco / Beberibe',
    names: { zh: '白山海滩 Morro Branco / 贝贝里比 Beberibe' },
    region: 'Litoral Leste',
    lat: -4.1611,
    lng: -38.1294,
  },
  {
    id: 'canoaquebrada',
    name: 'Canoa Quebrada (Aracati)',
    names: { zh: '卡诺阿·克布拉达 (Canoa Quebrada, 阿拉卡蒂)' },
    region: 'Litoral Leste',
    lat: -4.5262,
    lng: -37.7027,
  },
  {
    id: 'jericoacoara',
    name: 'Jericoacoara (Jijoca)',
    names: { zh: '杰里科科拉 (Jericoacoara)' },
    region: 'Litoral Oeste',
    lat: -2.7958,
    lng: -40.5139,
  },
  {
    id: 'lagoinha',
    name: 'Praia da Lagoinha',
    names: { en: 'Lagoinha Beach', es: 'Playa de Lagoinha', zh: '拉戈伊尼亚海滩 (Lagoinha)' },
    region: 'Paraipaba / Litoral Oeste',
    lat: -3.3768,
    lng: -39.1415,
  },
  {
    id: 'guaramiranga',
    name: 'Guaramiranga (Serra de Baturité)',
    names: { en: 'Guaramiranga (Baturité Highlands)', es: 'Guaramiranga (Sierra de Baturité)', zh: '瓜拉米朗加 (巴图里特山区)' },
    region: 'Região Serrana',
    lat: -4.2641,
    lng: -38.9328,
  },
  {
    id: 'castelao',
    name: 'Arena Castelão',
    names: { zh: '卡斯泰朗体育场 (Arena Castelão)' },
    region: 'Passaré',
    lat: -3.8073,
    lng: -38.5222,
  },
  {
    id: 'rodoviaria',
    name: 'Terminal Rodoviário João Thomé',
    names: { en: 'João Thomé Bus Terminal', es: 'Terminal de Autobuses João Thomé', zh: '若昂·托梅长途汽车站 (Rodoviária João Thomé)' },
    region: 'Fátima',
    lat: -3.7548,
    lng: -38.5323,
  },
  {
    id: 'eusebio',
    name: 'Eusébio Centro / Alphaville Eusébio',
    names: { zh: '欧塞比奥市中心 / Alphaville Eusébio' },
    region: 'Região Metropolitana',
    lat: -3.8906,
    lng: -38.4526,
  },
];

export function getLocationById(id: string): LocationPoint | null {
  return FORTALEZA_LOCATIONS.find((loc) => loc.id === id) ?? null;
}

/** Nome do local no idioma da tela (cai para o português quando não há tradução) */
export function getLocationName(loc: LocationPoint, lang: Lang): string {
  if (loc.custom || lang === 'pt') return loc.name;
  return loc.names?.[lang] ?? loc.name;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function allNames(loc: LocationPoint): string[] {
  return [loc.name, ...Object.values(loc.names ?? {}), ...(loc.aliases ?? [])].filter((n): n is string => !!n);
}

/** Local da lista cujo nome (em qualquer idioma) é exatamente o texto digitado */
export function findExactLocation(query: string): LocationPoint | null {
  const q = normalize(query);
  if (!q) return null;
  return FORTALEZA_LOCATIONS.find((loc) => allNames(loc).some((n) => normalize(n) === q)) ?? null;
}

/** Locais da lista que combinam com o que a pessoa está digitando (só no aparelho, sem internet) */
export function suggestLocations(query: string, limit = 5): LocationPoint[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  return FORTALEZA_LOCATIONS.filter(
    (loc) => allNames(loc).some((n) => normalize(n).includes(q)) || normalize(loc.region).includes(q)
  ).slice(0, limit);
}

// Distâncias de estrada (km) já conhecidas entre pontos da lista
const ROAD_MATRIX: Record<string, number> = {
  // From Aeroporto Pinto Martins (FOR)
  'aeroporto-beiramar': 12,
  'aeroporto-iracema': 11,
  'aeroporto-mucuripe': 14,
  'aeroporto-aldeota': 9,
  'aeroporto-beachpark': 25,
  'aeroporto-centroeventos': 10,
  'aeroporto-iguatemi': 9,
  'aeroporto-cumbuco': 40,
  'aeroporto-canoaquebrada': 160,
  'aeroporto-jericoacoara': 295,
  'aeroporto-guaramiranga': 105,

  // From Beira-Mar (Meireles)
  'beiramar-beachpark': 24,
  'beiramar-cumbuco': 33,
  'beiramar-centroeventos': 11,
  'beiramar-iguatemi': 8,
  'beiramar-iracema': 3,
  'beiramar-mucuripe': 3,
  'beiramar-aldeota': 3,
  'beiramar-canoaquebrada': 165,
  'beiramar-jericoacoara': 300,
  'beiramar-guaramiranga': 112,
  'beiramar-castelao': 15,
  'beiramar-rodoviaria': 8,

  // From Praia de Iracema
  'iracema-beachpark': 26,
  'iracema-cumbuco': 31,
  'iracema-centroeventos': 12,
  'iracema-canoaquebrada': 166,
  'iracema-jericoacoara': 298,

  // From Aldeota
  'aldeota-beachpark': 22,
  'aldeota-cumbuco': 35,
  'aldeota-centroeventos': 8,
  'aldeota-iguatemi': 5,
};

/** Distância da tabela do Mário, se os dois pontos são locais da lista e o par existe na tabela */
export function getMatrixDistance(a: LocationPoint, b: LocationPoint): number | null {
  if (a.custom || b.custom || a.id === b.id) return null;
  return ROAD_MATRIX[`${a.id}-${b.id}`] ?? ROAD_MATRIX[`${b.id}-${a.id}`] ?? null;
}

export function isSamePlace(a: LocationPoint, b: LocationPoint): boolean {
  return Math.abs(a.lat - b.lat) < 0.00005 && Math.abs(a.lng - b.lng) < 0.00005;
}

/** Chave única do par origem/destino (usada para saber a qual trajeto um resultado pertence) */
export function pairKey(a: LocationPoint, b: LocationPoint): string {
  return `${a.lat.toFixed(5)},${a.lng.toFixed(5)}|${b.lat.toFixed(5)},${b.lng.toFixed(5)}`;
}

// Haversine formula to calculate distance between coordinates with driving road factor
export function calculateCoordinatesDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;

  // Real city road driving factor: city trips aren't as the crow flies (avg 1.35x curvature)
  const drivingFactor = directDistance > 100 ? 1.2 : 1.35;
  return Math.max(1, Math.round(directDistance * drivingFactor * 10) / 10);
}

export type DistanceSource = 'matrix' | 'route' | 'estimate';

export interface ResolvedDistance {
  km: number;
  source: DistanceSource;
}

/**
 * Decide qual distância usar:
 * 1) tabela do Mário (quando os dois pontos são locais da lista e o par existe);
 * 2) rota real pelas ruas (OSRM), quando já foi calculada;
 * 3) estimativa em linha reta, quando a rota online não está disponível.
 * Retorna null enquanto a rota ainda está sendo calculada.
 */
export function resolveDistance(
  origin: LocationPoint,
  destination: LocationPoint,
  route: { status: 'loading' | 'ok' | 'fallback'; km?: number } | null
): ResolvedDistance | null {
  if (isSamePlace(origin, destination)) return { km: 3, source: 'estimate' };

  const matrix = getMatrixDistance(origin, destination);
  if (matrix !== null) return { km: matrix, source: 'matrix' };

  if (route?.status === 'ok' && typeof route.km === 'number') return { km: route.km, source: 'route' };
  if (route?.status === 'fallback') {
    return {
      km: calculateCoordinatesDistance(origin.lat, origin.lng, destination.lat, destination.lng),
      source: 'estimate',
    };
  }
  return null;
}

/** Tempo estimado de carro (em minutos) a partir da distância */
export function estimateMinutes(distanceKm: number): number {
  if (distanceKm <= 20) return Math.max(10, Math.round(distanceKm * 2.2));
  if (distanceKm <= 60) return Math.round(distanceKm * 1.6);
  return Math.round(distanceKm * 1.25);
}

/** Tarifa normal e tarifa com adicional noturno (R$ por km) */
export const BASE_RATE_PER_KM = 3.0;
export const NIGHT_RATE_PER_KM = 3.5;

/** Início da corrida entre 22:00 e 05:00 (o horário 05:00 em ponto já é tarifa normal) */
export function isNightTime(time: string): boolean {
  const match = /^(\d{1,2}):(\d{2})/.exec(time);
  if (!match) return false;
  const hour = Number(match[1]);
  return hour >= 22 || hour < 5;
}

/**
 * Mário Duarte's pricing rule:
 * Distance multiplied by the rate per km (R$ 3,00; R$ 3,50 com adicional noturno).
 * Rounded UP (Math.ceil) to the next whole Real if cents exist.
 * Minimum trip: R$ 30,00 (to cover urban dispatch)
 */
export function calculatePrice(
  distanceKm: number,
  ratePerKm: number = BASE_RATE_PER_KM
): {
  price: number;
  rawPrice: number;
  ratePerKm: number;
  isRoundedUp: boolean;
  minTripApplied: boolean;
} {
  // Evita erros de ponto flutuante (ex.: 12,4 × 3 = 37,2000000004) antes de arredondar para cima
  const rawPrice = Math.round(distanceKm * ratePerKm * 100) / 100;
  const roundedUp = Math.ceil(rawPrice);
  const minBasePrice = 30; // Corrida mínima justa de R$ 30

  const finalPrice = Math.max(minBasePrice, roundedUp);

  return {
    price: finalPrice,
    rawPrice,
    ratePerKm,
    isRoundedUp: roundedUp > rawPrice,
    minTripApplied: finalPrice > roundedUp,
  };
}
