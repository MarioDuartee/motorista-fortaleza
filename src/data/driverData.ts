import { DriverProfile } from '../types';

export const driverProfile: DriverProfile = {
  name: 'Mário Duarte',
  headline: 'Motorista Particular & Translados Fortaleza',
  bio: 'Mais de 30.000 viagens realizadas com segurança, pontualidade e tranquilidade. Atendimento exclusivo em Fortaleza e litoral cearense com Citroën C4 Cactus: ar-condicionado potente, suspensão confortável e compromisso com o seu bem-estar.',
  phone: '+55 85 99902-2591',
  whatsappNumber: '5585999022591',
  whatsappDisplay: '(85) 99902-2591',
  email: 'J.Mario.D.C@gmail.com',
  location: 'Fortaleza - CE & Região Metropolitana',
  operatingCities: [
    'Fortaleza (Beira-Mar, Meireles, Aldeota)',
    'Aeroporto Pinto Martins (FOR)',
    'Beach Park / Aquiraz',
    'Cumbuco / Caucaia',
    'Canoa Quebrada',
    'Jericoacoara',
    'Guaramiranga (Serra)'
  ],
  uberRating: 4.99,
  totalTrips: 30000,
  yearsExperience: 9,
  onTimeRate: 100,
  vehicle: {
    model: 'Citroën C4 Cactus',
    category: 'SUV Compacto Premium · Branco Banquise',
    year: '2022',
    color: 'Branco com detalhes estilizados',
    plateFinal: 'Emplacamento CE',
    features: [
      'Suspensão com amortecimento progressivo (máximo conforto no asfalto e paralelepípedo)',
      'Ar-condicionado digital automático potente com saída otimizada',
      'Bancos confortáveis e amplo espaço para pernas na fileira traseira',
      'Porta-malas generoso para bagagens de viagens e praia',
      'Central multimídia com navegação GPS em tempo real e conexões Apple CarPlay / Android Auto',
      'Película térmica de proteção solar de alta rejeição de calor (essencial para o clima de Fortaleza)'
    ]
  },
  amenities: [
    {
      id: 'climate',
      title: 'Ar-Condicionado Potente',
      description: 'Climatização gelada e constante para você escapar do calor cearense com conforto absoluto.',
      icon: 'Thermometer'
    },
    {
      id: 'water',
      title: 'Água Mineral Gelada',
      description: 'Garrafas lacradas de água mineral geladinha à disposição durante o seu deslocamento.',
      icon: 'Coffee'
    },
    {
      id: 'charger',
      title: 'Carregadores de Celular',
      description: 'Cabos disponíveis para iPhone (Lightning), USB-C e Android para recarregar durante a viagem.',
      icon: 'Wifi'
    },
    {
      id: 'sound',
      title: 'Ambiente com Som ou Silêncio',
      description: 'Sua escolha: MPB, forró tradicional, pop suave no Spotify ou silêncio total para relaxar.',
      icon: 'Volume2'
    },
    {
      id: 'luggage',
      title: 'Cuidado com Suas Bagagens',
      description: 'Auxílio completo no embarque e desembarque de malas, sacolas de praia e pertences.',
      icon: 'Briefcase'
    },
    {
      id: 'hygiene',
      title: 'Higienização Diária',
      description: 'Interior rigorosamente limpo, aspirado e cheiroso a cada início de jornada.',
      icon: 'Sparkles'
    }
  ],
  services: [
    {
      id: 'transfers',
      title: 'Translado Aeroporto Pinto Martins (FOR)',
      description: 'Embarque ou desembarque no aeroporto com monitoramento de voo em tempo real. Chego com 10 min de antecedência.',
      priceStartingAt: 'R$ 3,00 / km (Ex: ~R$ 36)',
      tags: ['Aeroporto FOR', 'Beira-Mar', 'Meireles', 'Praia de Iracema'],
      highlights: [
        'Acompanhamento do horário real do pouso (sem taxa por atraso de voo)',
        'Ponto de encontro rápido na área de desembarque de passageiros',
        'Suporte completo com carrinhos e bagagens pesadas'
      ]
    },
    {
      id: 'beachpark',
      title: 'Beach Park & Porto das Dunas / Aquiraz',
      description: 'Translado de ida e volta para o maior parque aquático da América Latina com tranquilidade e horário combinado.',
      priceStartingAt: 'R$ 3,00 / km (Ex: ~R$ 75)',
      tags: ['Beach Park', 'Porto das Dunas', 'Aquiraz'],
      highlights: [
        'Horário fixado de retorno sem fila e sem estresse para achar motorista',
        'Carro espaçoso para bolsas, toalhas e boias infantis',
        'Trajeto seguro pela CE-025 duplicada'
      ]
    },
    {
      id: 'litoral',
      title: 'Viagens para as Praias & Interior do Ceará',
      description: 'Transporte direto de Fortaleza para Cumbuco, Lagoinha, Canoa Quebrada, Jericoacoara ou serra de Guaramiranga.',
      priceStartingAt: 'R$ 3,00 / km sem centavos',
      tags: ['Cumbuco', 'Canoa Quebrada', 'Jericoacoara', 'Guaramiranga'],
      highlights: [
        'Viagem confortável no SUV C4 Cactus com suspensão macia',
        'Paradas programadas para fotos e lanche nos melhores pontos da estrada',
        'Motorista experiente com mais de 30 mil viagens nas rodovias cearenses'
      ]
    },
    {
      id: 'diaria',
      title: 'Diárias Executivas, Eventos & City Tour',
      description: 'Carro e motorista à sua inteira disposição para reuniões, Centro de Eventos do Ceará, compras ou passeios pela cidade.',
      priceStartingAt: 'R$ 3,00 / km ou Diária Fechada',
      tags: ['Centro de Eventos', 'Aldeota', 'Shoppings', 'City Tour'],
      highlights: [
        'Espera dedicada na porta do seu evento ou compromisso',
        'Dicas autênticas sobre a gastronomia e pontos turísticos de Fortaleza',
        'Discrição e profissionalismo para viagens a trabalho ou turismo'
      ]
    }
  ],
  testimonials: [], // Not needed per user request
  safetyPoints: [
    {
      title: 'Mais de 30.000 Viagens no Currículo',
      description: 'Vasta experiência em trânsito urbano, vias expressas e estradas de todo o Ceará com direção suave.'
    },
    {
      title: 'CNH Profissional com EAR & Antecedentes Limpos',
      description: 'Documentação rigorosamente em dia, com atividade remunerada regularizada e conduta ilibada.'
    },
    {
      title: 'Revisões Periódicas em Dia',
      description: 'Citroën C4 Cactus 2022 mantido com manutenção preventiva rigorosa (freios, pneus novos, suspensão e ar-condicionado).'
    },
    {
      title: 'Seguro de Passageiro & Condução Defensiva',
      description: 'Prioridade absoluta para a integridade, conforto e tranquilidade de quem está a bordo.'
    }
  ],
  badges: [
    { name: '+30.000 Corridas', count: 30000 },
    { name: 'Ar Gelando', count: 14200 },
    { name: 'Carro Impecável', count: 18500 },
    { name: 'Pontualidade Garantida', count: 21300 },
    { name: 'Excelente Conversa & Cortesia', count: 16400 }
  ]
};
