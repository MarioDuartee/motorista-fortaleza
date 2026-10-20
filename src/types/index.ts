export interface DriverProfile {
  name: string;
  headline: string;
  bio: string;
  phone: string;
  whatsappNumber: string; // international format without + for wa.me
  whatsappDisplay: string;
  email: string;
  location: string;
  operatingCities: string[];
  uberRating: number;
  totalTrips: number;
  yearsExperience: number;
  onTimeRate: number;
  vehicle: {
    model: string;
    category: string;
    year: string;
    color: string;
    plateFinal: string;
    features: string[];
  };
  amenities: {
    id: string;
    title: string;
    description: string;
    icon: string;
  }[];
  services: {
    id: string;
    title: string;
    description: string;
    priceStartingAt: string;
    tags: string[];
    highlights: string[];
  }[];
  testimonials: {
    id: string;
    author: string;
    role: string;
    company?: string;
    category: 'executivo' | 'aeroporto' | 'viagem' | 'familia';
    date: string;
    rating: number;
    text: string;
    route: string;
  }[];
  safetyPoints: {
    title: string;
    description: string;
  }[];
  badges: {
    name: string;
    count: number;
  }[];
}

export interface TripQuote {
  serviceType: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  climatePreference: string;
  conversationPreference: string;
  notes: string;
}
