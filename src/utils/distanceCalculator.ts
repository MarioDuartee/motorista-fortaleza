export interface LocationPoint {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
}

export const FORTALEZA_LOCATIONS: LocationPoint[] = [
  { id: 'aeroporto', name: 'Aeroporto Pinto Martins (FOR)', region: 'Aeroporto / Serrinha', lat: -3.7763, lng: -38.5326 },
  { id: 'beiramar', name: 'Av. Beira-Mar (Meireles / Feirinha)', region: 'Orla de Fortaleza', lat: -3.7251, lng: -38.4984 },
  { id: 'iracema', name: 'Praia de Iracema (Ponte dos Ingleses)', region: 'Orla de Fortaleza', lat: -3.7196, lng: -38.5144 },
  { id: 'mucuripe', name: 'Mucuripe (Mercado dos Peixes)', region: 'Orla de Fortaleza', lat: -3.7198, lng: -38.4795 },
  { id: 'aldeota', name: 'Aldeota / Dionísio Torres', region: 'Zona Nobre Central', lat: -3.7431, lng: -38.5029 },
  { id: 'beachpark', name: 'Beach Park / Porto das Dunas', region: 'Aquiraz / Litoral Leste', lat: -3.8449, lng: -38.3917 },
  { id: 'centroeventos', name: 'Centro de Eventos do Ceará', region: 'Edson Queiroz / Guararapes', lat: -3.7788, lng: -38.4796 },
  { id: 'iguatemi', name: 'Shopping Iguatemi Bosque', region: 'Edson Queiroz', lat: -3.7663, lng: -38.4878 },
  { id: 'riomar', name: 'Shopping RioMar Fortaleza', region: 'Papicu', lat: -3.7428, lng: -38.4729 },
  { id: 'cumbuco', name: 'Praia do Cumbuco', region: 'Caucaia / Litoral Oeste', lat: -3.6268, lng: -38.7303 },
  { id: 'prainha', name: 'Prainha / Aquiraz Centro', region: 'Litoral Leste', lat: -3.8863, lng: -38.3582 },
  { id: 'morrobranco', name: 'Morro Branco / Beberibe', region: 'Litoral Leste', lat: -4.1611, lng: -38.1294 },
  { id: 'canoaquebrada', name: 'Canoa Quebrada (Aracati)', region: 'Litoral Leste', lat: -4.5262, lng: -37.7027 },
  { id: 'jericoacoara', name: 'Jericoacoara (Jijoca)', region: 'Litoral Oeste', lat: -2.7958, lng: -40.5139 },
  { id: 'lagoinha', name: 'Praia da Lagoinha', region: 'Paraipaba / Litoral Oeste', lat: -3.3768, lng: -39.1415 },
  { id: 'guaramiranga', name: 'Guaramiranga (Serra de Baturité)', region: 'Região Serrana', lat: -4.2641, lng: -38.9328 },
  { id: 'castelao', name: 'Arena Castelão', region: 'Passaré', lat: -3.8073, lng: -38.5222 },
  { id: 'rodoviaria', name: 'Terminal Rodoviário João Thomé', region: 'Fátima', lat: -3.7548, lng: -38.5323 },
  { id: 'eusebio', name: 'Eusébio Centro / Alphaville Eusébio', region: 'Região Metropolitana', lat: -3.8906, lng: -38.4526 }
];

// Specific known road distance matrix (km) between landmark pairs
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
  'aldeota-iguatemi': 5
};

// Haversine formula to calculate distance between coordinates with driving road factor
export function calculateCoordinatesDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;

  // Real city road driving factor: city trips aren't as the crow flies (avg 1.35x curvature)
  const drivingFactor = directDistance > 100 ? 1.2 : 1.35;
  return Math.max(1, Math.round(directDistance * drivingFactor * 10) / 10);
}

// Find matched location object from name or text
export function findMatchingLocation(query: string): LocationPoint | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return (
    FORTALEZA_LOCATIONS.find(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        q.includes(loc.name.toLowerCase()) ||
        q.includes(loc.id)
    ) || null
  );
}

// Calculate road distance between two location names or strings
export function calculateRouteDistance(originText: string, destinationText: string): {
  distanceKm: number;
  isExactMatrix: boolean;
  originPoint: LocationPoint | null;
  destinationPoint: LocationPoint | null;
} {
  const loc1 = findMatchingLocation(originText);
  const loc2 = findMatchingLocation(destinationText);

  if (loc1 && loc2) {
    if (loc1.id === loc2.id) {
      return { distanceKm: 3, isExactMatrix: false, originPoint: loc1, destinationPoint: loc2 };
    }

    const key1 = `${loc1.id}-${loc2.id}`;
    const key2 = `${loc2.id}-${loc1.id}`;

    if (ROAD_MATRIX[key1] !== undefined) {
      return { distanceKm: ROAD_MATRIX[key1], isExactMatrix: true, originPoint: loc1, destinationPoint: loc2 };
    }
    if (ROAD_MATRIX[key2] !== undefined) {
      return { distanceKm: ROAD_MATRIX[key2], isExactMatrix: true, originPoint: loc1, destinationPoint: loc2 };
    }

    // Coordinates fallback
    const dist = calculateCoordinatesDistance(loc1.lat, loc1.lng, loc2.lat, loc2.lng);
    return { distanceKm: Math.round(dist), isExactMatrix: false, originPoint: loc1, destinationPoint: loc2 };
  }

  // Fallback defaults if addresses are typed freely without matching predefined landmarks
  return { distanceKm: 15, isExactMatrix: false, originPoint: loc1, destinationPoint: loc2 };
}

/**
 * Mário Duarte's pricing rule:
 * Distance multiplied by R$ 3,00 per km.
 * Rounded UP (Math.ceil) to the next whole Real if cents exist.
 * Minimum trip: R$ 30,00 (to cover urban dispatch)
 */
export function calculatePrice(distanceKm: number): {
  price: number;
  rawPrice: number;
  ratePerKm: number;
  isRoundedUp: boolean;
  minTripApplied: boolean;
} {
  const ratePerKm = 3.0; // R$ 3,00 por km conforme solicitação do Mário Duarte
  const rawPrice = distanceKm * ratePerKm;
  const roundedUp = Math.ceil(rawPrice);
  const minBasePrice = 30; // Corrida mínima justa de R$ 30

  const finalPrice = Math.max(minBasePrice, roundedUp);

  return {
    price: finalPrice,
    rawPrice,
    ratePerKm,
    isRoundedUp: roundedUp > rawPrice,
    minTripApplied: finalPrice > roundedUp
  };
}
