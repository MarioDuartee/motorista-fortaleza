import { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Briefcase, 
  Send, 
  Copy, 
  Check, 
  Info,
  Navigation,
  Compass,
  ArrowRight,
  Route,
  Snowflake,
  Wind
} from 'lucide-react';
import { driverProfile } from '../data/driverData';
import RouteMap from './RouteMap';
import { 
  FORTALEZA_LOCATIONS, 
  calculateRouteDistance, 
  calculatePrice 
} from '../utils/distanceCalculator';

const CLIMATE_AC = 'Ar-condicionado ligado';
const CLIMATE_AMBIENT = 'Temperatura ambiente (janelas abertas)';

interface TripSimulatorProps {
  preSelectedService?: string;
}

export default function TripSimulator({ preSelectedService }: TripSimulatorProps) {
  const [serviceType, setServiceType] = useState('Translado Aeroporto Pinto Martins (FOR)');
  const [origin, setOrigin] = useState('Av. Beira-Mar (Meireles / Feirinha)');
  const [destination, setDestination] = useState('Aeroporto Pinto Martins (FOR)');
  const [customDistanceKm, setCustomDistanceKm] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [passengers, setPassengers] = useState(2);
  const [luggage, setLuggage] = useState(2);
  const [climate, setClimate] = useState(CLIMATE_AC);
  const [conversation, setConversation] = useState('Conversa agradável & dicas de Fortaleza');
  const [copied, setCopied] = useState(false);

  // Initialize with tomorrow's date
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Update when user clicked "Cotar Este Serviço" in Services section
  useEffect(() => {
    if (preSelectedService) {
      setServiceType(preSelectedService);
      setCustomDistanceKm(null);
      if (preSelectedService.includes('Aeroporto')) {
        setOrigin('Av. Beira-Mar (Meireles / Feirinha)');
        setDestination('Aeroporto Pinto Martins (FOR)');
      } else if (preSelectedService.includes('Beach Park')) {
        setOrigin('Av. Beira-Mar (Meireles / Feirinha)');
        setDestination('Beach Park / Porto das Dunas');
      } else if (preSelectedService.includes('Praias')) {
        setOrigin('Av. Beira-Mar (Meireles / Feirinha)');
        setDestination('Praia do Cumbuco');
      } else if (preSelectedService.includes('Diárias')) {
        setOrigin('Av. Beira-Mar (Meireles / Feirinha)');
        setDestination('Centro de Eventos do Ceará');
      }
    }
  }, [preSelectedService]);

  // Compute calculated road distance
  const routeAnalysis = useMemo(() => {
    return calculateRouteDistance(origin, destination);
  }, [origin, destination]);

  // Active distance is either custom adjusted or automatically calculated
  const activeDistanceKm = customDistanceKm !== null ? customDistanceKm : routeAnalysis.distanceKm;

  // Compute pricing using Mário's rule: R$ 3 / km
  const priceDetails = useMemo(() => {
    return calculatePrice(activeDistanceKm);
  }, [activeDistanceKm]);

  // Estimated driving time: ~2.2 minutes per km in city, ~1.2 min per km on highway
  const estimatedTimeMinutes = useMemo(() => {
    if (activeDistanceKm <= 20) {
      return Math.max(10, Math.round(activeDistanceKm * 2.2));
    } else if (activeDistanceKm <= 60) {
      return Math.round(activeDistanceKm * 1.6);
    } else {
      return Math.round(activeDistanceKm * 1.25);
    }
  }, [activeDistanceKm]);

  const formattedDate = date ? date.split('-').reverse().join('/') : 'A combinar';

  // Link da rota no Google Maps (só quando os dois pontos são conhecidos)
  const mapsRouteUrl =
    routeAnalysis.originPoint && routeAnalysis.destinationPoint
      ? `https://www.google.com/maps/dir/?api=1&origin=${routeAnalysis.originPoint.lat},${routeAnalysis.originPoint.lng}&destination=${routeAnalysis.destinationPoint.lat},${routeAnalysis.destinationPoint.lng}&travelmode=driving`
      : '';

  // Build ready-to-send WhatsApp message text
  const buildWhatsAppMessage = () => {
    return `Olá ${driverProfile.name}! Gostaria de agendar uma viagem com seu Citroën C4 Cactus em Fortaleza:

🚗 *Serviço:* ${serviceType}
📍 *Embarque (Origem):* ${origin}
🏁 *Desembarque (Destino):* ${destination}
📏 *Distância calculada:* ${activeDistanceKm} km
⏱️ *Tempo estimado:* ~${estimatedTimeMinutes} min
💰 *Valor estimado (R$ 3,00/km):* R$ ${priceDetails.price},00

📅 *Data:* ${formattedDate} às ${time}
👥 *Passageiros:* ${passengers} pessoa(s)
🧳 *Malas:* ${luggage} volume(s)
${climate === CLIMATE_AC ? '❄️' : '🌬️'} *Climatização:* ${climate}${mapsRouteUrl ? `\n🗺️ *Rota no mapa:* ${mapsRouteUrl}` : ''}

Poderia me confirmar a disponibilidade e a corrida?`;
  };

  const handleSendToWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${driverProfile.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(buildWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectOrigin = (locName: string) => {
    setOrigin(locName);
    setCustomDistanceKm(null);
  };

  const handleSelectDestination = (locName: string) => {
    setDestination(locName);
    setCustomDistanceKm(null);
  };

  const quickPopularOrigins = [
    'Av. Beira-Mar (Meireles / Feirinha)',
    'Aeroporto Pinto Martins (FOR)',
    'Praia de Iracema (Ponte dos Ingleses)',
    'Aldeota / Dionísio Torres',
    'Shopping Iguatemi Bosque'
  ];

  const quickPopularDestinations = [
    'Aeroporto Pinto Martins (FOR)',
    'Beach Park / Porto das Dunas',
    'Praia do Cumbuco',
    'Centro de Eventos do Ceará',
    'Canoa Quebrada (Aracati)',
    'Jericoacoara (Jijoca)'
  ];

  return (
    <section id="simulador" className="py-16 lg:py-24 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            Simulador de Trajetos & Orçamento Transparente
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            Cálculo por distância no mapa: R$ 3,00 por km rodado
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            Informe os pontos de embarque e desembarque. O sistema calcula a distância de rota e multiplica por <strong className="text-white">R$ 3,00 o km</strong>.
          </p>
        </div>

        {/* 2-Column Calculator and Summary Card */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Configurator Controls (Col 7) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-white/10 shadow-xl space-y-6">
            
            {/* Service selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Modalidade do Atendimento
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-neutral-950 border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="Translado Aeroporto Pinto Martins (FOR)">Translado Aeroporto Pinto Martins (FOR)</option>
                <option value="Beach Park & Porto das Dunas / Aquiraz">Beach Park & Porto das Dunas / Aquiraz</option>
                <option value="Viagens para as Praias & Interior do Ceará">Viagens para as Praias & Interior do Ceará</option>
                <option value="Diárias Executivas, Eventos & City Tour">Diárias Executivas, Eventos & City Tour</option>
                <option value="Corrida Urbana Particular em Fortaleza">Corrida Urbana Particular em Fortaleza</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Origin & Destination with Fortaleza Location Pickers */}
            <div className="space-y-5">
              
              {/* Origin */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Local de Embarque (Origem)</span>
                  </label>
                  <span className="text-[11px] text-neutral-500">Selecione ou digite</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setCustomDistanceKm(null);
                    }}
                    list="locais-fortaleza"
                    placeholder="Ex: Av. Beira-Mar, Meireles..."
                    className="w-full bg-neutral-950 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Quick origin buttons */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {quickPopularOrigins.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOrigin(opt)}
                      className={`text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        origin === opt
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-medium'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Local de Desembarque (Destino)</span>
                  </label>
                  <span className="text-[11px] text-neutral-500">Selecione ou digite</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setCustomDistanceKm(null);
                    }}
                    list="locais-fortaleza"
                    placeholder="Ex: Aeroporto Pinto Martins (FOR), Beach Park..."
                    className="w-full bg-neutral-950 border border-white/15 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                {/* Quick destination buttons */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {quickPopularDestinations.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectDestination(opt)}
                      className={`text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        destination === opt
                          ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-medium'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Lista de sugestões de locais para os campos de embarque e desembarque */}
            <datalist id="locais-fortaleza">
              {FORTALEZA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name} />
              ))}
            </datalist>

            {/* Mapa: de onde para onde estamos indo */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>Mapa do Trajeto</span>
              </div>
              <RouteMap
                origin={routeAnalysis.originPoint}
                destination={routeAnalysis.destinationPoint}
              />
            </div>

            {/* Interactive Route Distance & Fine-Tuner Slider */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Distância de Trajeto Analisada
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">
                    {activeDistanceKm} km
                  </span>
                  <span className="text-xs text-neutral-400">
                    (~{estimatedTimeMinutes} min)
                  </span>
                </div>
              </div>

              {/* Visual Route Schematic */}
              <div className="relative p-3 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate max-w-[40%]">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate text-neutral-300 font-medium">{origin}</span>
                </div>

                <div className="flex-1 mx-3 flex flex-col items-center">
                  <div className="w-full border-t border-dashed border-neutral-600 relative">
                    <Navigation className="w-3.5 h-3.5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 mt-1">
                    {activeDistanceKm} km
                  </span>
                </div>

                <div className="flex items-center gap-2 truncate max-w-[40%] justify-end">
                  <span className="truncate text-neutral-300 font-medium">{destination}</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                </div>
              </div>

              {/* Distance Slider for fine-tuning */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Ajustar km manualmente se desejar:</span>
                  <span className="font-mono text-white">{activeDistanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="350"
                  step="1"
                  value={activeDistanceKm}
                  onChange={(e) => setCustomDistanceKm(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                  <span>3 km (Urbano)</span>
                  <span>25 km (Beach Park)</span>
                  <span>165 km (Canoa)</span>
                  <span>300 km (Jeri)</span>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Data da Corrida</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Horário de Embarque</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Passengers & Luggage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Passageiros</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPassengers(n)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        passengers === n
                          ? 'bg-amber-400 text-neutral-950 border-amber-400'
                          : 'bg-neutral-950 text-neutral-400 border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Malas / Sacolas</span>
                </label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setLuggage(n)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        luggage === n
                          ? 'bg-amber-400 text-neutral-950 border-amber-400'
                          : 'bg-neutral-950 text-neutral-400 border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {n === 4 ? '4+' : n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Climatização: ar-condicionado ou janelas abertas */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                <Snowflake className="w-3.5 h-3.5 text-amber-400" />
                <span>Climatização durante a viagem</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setClimate(CLIMATE_AC)}
                  aria-pressed={climate === CLIMATE_AC}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    climate === CLIMATE_AC
                      ? 'bg-amber-400/10 border-amber-400/50'
                      : 'bg-neutral-950 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Snowflake className={`w-5 h-5 shrink-0 mt-0.5 ${climate === CLIMATE_AC ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>
                    <span className={`block text-sm font-semibold ${climate === CLIMATE_AC ? 'text-white' : 'text-neutral-300'}`}>Ar-condicionado</span>
                    <span className="block text-[11px] text-neutral-400 mt-0.5">Carro fechado e gelado, na temperatura que você preferir</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setClimate(CLIMATE_AMBIENT)}
                  aria-pressed={climate === CLIMATE_AMBIENT}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    climate === CLIMATE_AMBIENT
                      ? 'bg-amber-400/10 border-amber-400/50'
                      : 'bg-neutral-950 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Wind className={`w-5 h-5 shrink-0 mt-0.5 ${climate === CLIMATE_AMBIENT ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>
                    <span className={`block text-sm font-semibold ${climate === CLIMATE_AMBIENT ? 'text-white' : 'text-neutral-300'}`}>Temperatura ambiente</span>
                    <span className="block text-[11px] text-neutral-400 mt-0.5">Janelas abertas, com a brisa de Fortaleza</span>
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Column 2: Exact Price Breakdown by R$ 3/km (Col 5) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-amber-400/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">
                    Orçamento Oficial
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 font-semibold">
                  R$ 3,00 / km
                </span>
              </div>

              {/* Exact Formula Card */}
              <div className="mt-6 p-5 rounded-xl bg-neutral-900 border border-white/10">
                <div className="text-xs text-neutral-400">Valor Calculado da Corrida</div>
                
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                    R$ {priceDetails.price},00
                  </span>
                </div>

                {/* Calculation breakdown explanation */}
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-neutral-300 space-y-1">
                  <div className="flex justify-between font-mono">
                    <span className="text-neutral-400">Distância:</span>
                    <span>{activeDistanceKm} km</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-neutral-400">Tarifa fixa:</span>
                    <span>× R$ 3,00 por km</span>
                  </div>
                  <div className="flex justify-between font-mono text-amber-300 font-semibold pt-1">
                    <span>Total:</span>
                    <span>R$ {priceDetails.price},00</span>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-neutral-400 flex items-start gap-1.5 leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Valor transparente, sem surpresas. Sem taxa dinâmica de aplicativo!
                  </span>
                </div>
              </div>

              {/* Dynamic Review List */}
              <div className="mt-6 space-y-2.5 text-xs text-neutral-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Motorista</span>
                  <span className="font-semibold text-white">Mário Duarte · C4 Cactus</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Serviço</span>
                  <span className="font-medium text-white text-right truncate max-w-[60%]">{serviceType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Data & Horário</span>
                  <span className="font-mono text-white">{formattedDate} às {time}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Embarque</span>
                  <span className="text-white text-right truncate max-w-[60%]">{origin || 'A combinar'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Desembarque</span>
                  <span className="text-white text-right truncate max-w-[60%]">{destination || 'A combinar'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-500">Passageiros & Malas</span>
                  <span className="text-white">{passengers} pessoa(s) · {luggage} mala(s)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Climatização</span>
                  <span className="text-white text-right truncate max-w-[60%]">{climate}</span>
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all duration-200 shadow-lg shadow-amber-400/25 active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-neutral-950" />
                  <span>Enviar para o WhatsApp de Mário Duarte</span>
                </button>

                <button
                  onClick={handleCopyDetails}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Resumo Copiado para a Área de Transferência!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Copiar Resumo da Viagem</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[11px] text-neutral-500 font-mono">
                  WhatsApp: (85) 99902-2591 · Resposta Rápida
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
