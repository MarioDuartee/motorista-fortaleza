/** Contato e números do motorista (os textos do site ficam em src/i18n) */
export interface DriverProfile {
  name: string;
  phone: string;
  whatsappNumber: string; // international format without + for wa.me
  whatsappDisplay: string;
  email: string;
  uberRating: number;
  totalTrips: number;
  yearsExperience: number;
  onTimeRate: number;
}

export type ServiceId = 'transfers' | 'beachpark' | 'litoral' | 'diaria' | 'urban' | 'other';

/** Pedido de cotação vindo da seção de serviços (o nonce permite clicar no mesmo serviço de novo) */
export interface QuoteRequest {
  id: ServiceId;
  nonce: number;
}
