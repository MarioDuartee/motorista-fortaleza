import { useEffect, useState } from 'react';
import {
  Calculator,
  Calendar,
  Clock,
  Users,
  Briefcase,
  Send,
  Copy,
  Check,
  Info,
  Navigation,
  Route,
  Snowflake,
  Wind,
  Moon,
} from 'lucide-react';
import { driverProfile } from '../data/driverData';
import { useI18n } from '../i18n/LanguageContext';
import { pt } from '../i18n/pt';
import RouteMap, { type RouteReport } from './RouteMap';
import PlaceField from './PlaceField';
import { usePlaceField } from '../hooks/usePlaceField';
import {
  BASE_RATE_PER_KM,
  NIGHT_RATE_PER_KM,
  calculatePrice,
  estimateMinutes,
  isNightTime,
  pairKey,
  resolveDistance,
  type DistanceSource,
} from '../utils/distanceCalculator';
import type { QuoteRequest, ServiceId } from '../types';

type Climate = 'ac' | 'ambient';

interface TripSimulatorProps {
  /** Serviço escolhido na seção "Serviços" (o nonce permite escolher o mesmo serviço duas vezes) */
  preSelected?: QuoteRequest | null;
}

const SERVICE_IDS: ServiceId[] = ['transfers', 'beachpark', 'litoral', 'diaria', 'urban', 'other'];

// Embarque e desembarque sugeridos para cada modalidade (ids da lista de locais)
const PRESETS: Partial<Record<ServiceId, [string, string]>> = {
  transfers: ['beiramar', 'aeroporto'],
  beachpark: ['beiramar', 'beachpark'],
  litoral: ['beiramar', 'cumbuco'],
  diaria: ['beiramar', 'centroeventos'],
};

const QUICK_ORIGINS = ['beiramar', 'aeroporto', 'iracema', 'aldeota', 'iguatemi'];
const QUICK_DESTINATIONS = ['aeroporto', 'beachpark', 'cumbuco', 'centroeventos', 'canoaquebrada', 'jericoacoara'];

export default function TripSimulator({ preSelected }: TripSimulatorProps) {
  const { t, lang, option, fmt, money, km } = useI18n();

  const [serviceId, setServiceId] = useState<ServiceId>('transfers');
  const origin = usePlaceField('beiramar');
  const destination = usePlaceField('aeroporto');
  const [customKm, setCustomKm] = useState<number | null>(null);
  const [routeReport, setRouteReport] = useState<RouteReport | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [passengers, setPassengers] = useState(2);
  const [luggage, setLuggage] = useState(2);
  const [climate, setClimate] = useState<Climate>('ac');
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

  // Quando a pessoa clica em "Cotar e Agendar" na seção de serviços
  useEffect(() => {
    if (!preSelected) return;
    setServiceId(preSelected.id);
    setCustomKm(null);
    const preset = PRESETS[preSelected.id];
    if (preset) {
      origin.chooseLandmark(preset[0]);
      destination.chooseLandmark(preset[1]);
    }
    // só reage a um novo clique (nonce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelected]);

  // ---- Distância: vem dos dois pontos que estão no mapa ----
  const originPoint = origin.point;
  const destinationPoint = destination.point;
  const currentKey = originPoint && destinationPoint ? pairKey(originPoint, destinationPoint) : null;

  // O ajuste manual vale só para o trajeto atual
  useEffect(() => {
    setCustomKm(null);
  }, [currentKey]);

  const route = routeReport && currentKey && routeReport.key === currentKey ? routeReport : null;
  const resolved = originPoint && destinationPoint ? resolveDistance(originPoint, destinationPoint, route) : null;

  const activeKm: number | null = customKm !== null ? customKm : (resolved?.km ?? null);
  const source: DistanceSource | 'manual' | null = customKm !== null ? 'manual' : (resolved?.source ?? null);
  const isCalculating = !!originPoint && !!destinationPoint && activeKm === null;

  // Corridas iniciadas entre 22h e 5h têm tarifa maior; isso só aparece quando o horário escolhido cai nessa faixa
  const isNight = isNightTime(time);
  const ratePerKm = isNight ? NIGHT_RATE_PER_KM : BASE_RATE_PER_KM;

  const priceDetails = activeKm !== null ? calculatePrice(activeKm, ratePerKm) : null;
  const estimatedMinutes = activeKm !== null ? estimateMinutes(activeKm) : null;

  const sourceLabel =
    source === 'matrix'
      ? t.sim.sourceMatrix
      : source === 'route'
        ? t.sim.sourceRoute
        : source === 'estimate'
          ? t.sim.sourceEstimate
          : source === 'manual'
            ? t.sim.sourceManual
            : '—';

  // ---- Textos de exibição ----
  const serviceLabel = (id: ServiceId): string => {
    if (id === 'urban') return t.sim.serviceUrban;
    if (id === 'other') return t.sim.serviceOther;
    return t.services.items.find((item) => item.id === id)?.title ?? id;
  };

  const [yyyy, mm, dd] = date ? date.split('-').map(Number) : [0, 0, 0];
  const displayDate = date
    ? new Date(yyyy, mm - 1, dd).toLocaleDateString(option.locale, { dateStyle: 'medium' })
    : t.sim.toBeArranged;

  const mapsRouteUrl =
    originPoint && destinationPoint
      ? `https://www.google.com/maps/dir/?api=1&origin=${originPoint.lat},${originPoint.lng}&destination=${destinationPoint.lat},${destinationPoint.lng}&travelmode=driving`
      : '';

  // ---- Mensagem do WhatsApp: sempre em português, porque é o Mário quem lê ----
  const buildWhatsAppMessage = () => {
    const ptService =
      serviceId === 'urban'
        ? pt.sim.serviceUrban
        : serviceId === 'other'
          ? pt.sim.serviceOther
          : (pt.services.items.find((item) => item.id === serviceId)?.title ?? '');
    const ptDate = date ? date.split('-').reverse().join('/') : 'A combinar';
    const ptKm = activeKm !== null ? `${activeKm.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km` : 'a calcular';
    const ptTime = estimatedMinutes !== null ? `~${estimatedMinutes} min` : 'a calcular';
    const ptPrice = priceDetails ? `R$ ${priceDetails.price},00` : 'a combinar';
    const ptRate = `R$ ${ratePerKm.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    const nightLine = isNight ? `\n🌙 *Adicional noturno:* ${ptRate}/km (corrida entre 22h e 5h)` : '';
    const ptOrigin = originPoint ? originPoint.name : origin.text.trim() || 'A combinar';
    const ptDestination = destinationPoint ? destinationPoint.name : destination.text.trim() || 'A combinar';
    const ptClimate = climate === 'ac' ? pt.sim.climateAc : pt.sim.climateAmbient;
    const clientLanguage = lang === 'pt' ? '' : `\n🌐 *Idioma do cliente:* ${option.label}`;

    return `Olá ${driverProfile.name}! Gostaria de agendar uma viagem com seu Citroën C4 Cactus em Fortaleza:

🚗 *Serviço:* ${ptService}
📍 *Embarque (Origem):* ${ptOrigin}
🏁 *Desembarque (Destino):* ${ptDestination}
📏 *Distância calculada:* ${ptKm}
⏱️ *Tempo estimado:* ${ptTime}
💰 *Valor estimado (${ptRate}/km):* ${ptPrice}${nightLine}

📅 *Data:* ${ptDate} às ${time}
👥 *Passageiros:* ${passengers} pessoa(s)
🧳 *Malas:* ${luggage} volume(s)
${climate === 'ac' ? '❄️' : '🌬️'} *Climatização:* ${ptClimate}${mapsRouteUrl ? `\n🗺️ *Rota no mapa:* ${mapsRouteUrl}` : ''}${clientLanguage}

Poderia me confirmar a disponibilidade e a corrida?`;
  };

  const handleSendToWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${driverProfile.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleCopyDetails = () => {
    navigator.clipboard?.writeText(buildWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const climateLabel = climate === 'ac' ? t.sim.climateAc : t.sim.climateAmbient;
  const sliderMax = Math.max(350, Math.ceil(activeKm ?? 0));

  return (
    <section id="simulador" className="py-16 lg:py-24 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">{t.sim.kicker}</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            {t.sim.title}
          </h2>
          <p className="mt-3 text-base text-neutral-300">
            {t.sim.subtitleBefore}
            <strong className="text-white">{t.sim.subtitleStrong}</strong>
            {t.sim.subtitleAfter}
          </p>
        </div>

        {/* 2-Column Calculator and Summary Card */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Configurator Controls (Col 7) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-neutral-900/80 border border-white/10 shadow-xl space-y-6">
            {/* Service selector */}
            <div>
              <label
                htmlFor="service-type"
                className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2"
              >
                {t.sim.serviceLabel}
              </label>
              <select
                id="service-type"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value as ServiceId)}
                className="w-full bg-neutral-950 border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              >
                {SERVICE_IDS.map((id) => (
                  <option key={id} value={id}>
                    {serviceLabel(id)}
                  </option>
                ))}
              </select>
            </div>

            {/* Origin & Destination: qualquer endereço, ligado ao mapa */}
            <div className="space-y-5">
              <PlaceField
                label={t.sim.originLabel}
                placeholder={t.sim.originPlaceholder}
                accent="amber"
                field={origin}
                quickIds={QUICK_ORIGINS}
              />
              <PlaceField
                label={t.sim.destLabel}
                placeholder={t.sim.destPlaceholder}
                accent="emerald"
                field={destination}
                quickIds={QUICK_DESTINATIONS}
              />
            </div>

            {/* Mapa: de onde para onde estamos indo */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.sim.mapTitle}</span>
              </div>
              <RouteMap
                origin={originPoint}
                destination={destinationPoint}
                originLabel={origin.text}
                destinationLabel={destination.text}
                onRoute={setRouteReport}
              />
            </div>

            {/* Interactive Route Distance & Fine-Tuner Slider */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{t.sim.routeTitle}</span>
                </div>
                <div className="flex items-center gap-2 font-mono shrink-0">
                  <span className="text-lg font-bold text-amber-400 tabular-nums">
                    {activeKm !== null ? km(activeKm) : isCalculating ? t.sim.calculating : '—'}
                  </span>
                  {estimatedMinutes !== null && (
                    <span className="text-xs text-neutral-400">
                      (~{estimatedMinutes} {t.sim.minutes})
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Route Schematic */}
              <div className="relative p-3 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate max-w-[40%]">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span className="truncate text-neutral-300 font-medium">
                    {originPoint ? origin.text : t.map.pickOrigin}
                  </span>
                </div>

                <div className="flex-1 mx-3 flex flex-col items-center">
                  <div className="w-full border-t border-dashed border-neutral-600 relative">
                    <Navigation className="w-3.5 h-3.5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 mt-1">
                    {activeKm !== null ? km(activeKm) : '—'}
                  </span>
                </div>

                <div className="flex items-center gap-2 truncate max-w-[40%] justify-end">
                  <span className="truncate text-neutral-300 font-medium">
                    {destinationPoint ? destination.text : t.map.pickDest}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                </div>
              </div>

              {/* Distance Slider for fine-tuning */}
              <div className="pt-2">
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1 gap-3">
                  <span>{t.sim.adjustLabel}</span>
                  <span className="font-mono text-white shrink-0">{activeKm !== null ? km(activeKm) : '—'}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max={sliderMax}
                  step="1"
                  value={Math.min(Math.max(Math.round(activeKm ?? 3), 3), sliderMax)}
                  onChange={(e) => setCustomKm(Number(e.target.value))}
                  aria-label={t.sim.adjustLabel}
                  className="w-full accent-amber-400 bg-neutral-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1 gap-1">
                  <span>{t.sim.tickUrban}</span>
                  <span>{t.sim.tickBeachPark}</span>
                  <span>{t.sim.tickCanoa}</span>
                  <span>{t.sim.tickJeri}</span>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.sim.dateLabel}</span>
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
                  <span>{t.sim.timeLabel}</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/15 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {/* Aviso do adicional noturno: só aparece quando o horário escolhido está na faixa */}
            {isNight && (
              <div
                role="status"
                className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/40 text-xs text-neutral-200 leading-relaxed"
              >
                <Moon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <span className="block font-semibold text-white">{t.sim.nightTitle}</span>
                  {fmt(t.sim.nightNotice, { rate: money(NIGHT_RATE_PER_KM), base: money(BASE_RATE_PER_KM) })}
                </span>
              </div>
            )}

            {/* Passengers & Luggage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  <Users className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{t.sim.passengers}</span>
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
                  <span>{t.sim.luggage}</span>
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
                <span>{t.sim.climateTitle}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setClimate('ac')}
                  aria-pressed={climate === 'ac'}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    climate === 'ac' ? 'bg-amber-400/10 border-amber-400/50' : 'bg-neutral-950 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Snowflake className={`w-5 h-5 shrink-0 mt-0.5 ${climate === 'ac' ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>
                    <span className={`block text-sm font-semibold ${climate === 'ac' ? 'text-white' : 'text-neutral-300'}`}>
                      {t.sim.acTitle}
                    </span>
                    <span className="block text-[11px] text-neutral-400 mt-0.5">{t.sim.acDesc}</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setClimate('ambient')}
                  aria-pressed={climate === 'ambient'}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    climate === 'ambient' ? 'bg-amber-400/10 border-amber-400/50' : 'bg-neutral-950 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Wind className={`w-5 h-5 shrink-0 mt-0.5 ${climate === 'ambient' ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>
                    <span className={`block text-sm font-semibold ${climate === 'ambient' ? 'text-white' : 'text-neutral-300'}`}>
                      {t.sim.ambientTitle}
                    </span>
                    <span className="block text-[11px] text-neutral-400 mt-0.5">{t.sim.ambientDesc}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Exact Price Breakdown by R$ 3/km (Col 5) */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-amber-400/40 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{t.sim.official}</span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20 font-semibold whitespace-nowrap">
                  {money(ratePerKm)} / km
                </span>
              </div>

              {/* Exact Formula Card */}
              <div className="mt-6 p-5 rounded-xl bg-neutral-900 border border-white/10">
                <div className="text-xs text-neutral-400">{t.sim.calculatedValue}</div>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                    {priceDetails ? money(priceDetails.price) : isCalculating ? t.sim.calculating : '—'}
                  </span>
                </div>

                {/* Calculation breakdown explanation */}
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-neutral-300 space-y-1">
                  <div className="flex justify-between font-mono gap-3">
                    <span className="text-neutral-400">{t.sim.distance}</span>
                    <span>{activeKm !== null ? km(activeKm) : '—'}</span>
                  </div>
                  <div className="flex justify-between font-mono gap-3">
                    <span className="text-neutral-400">{t.sim.fixedRate}</span>
                    <span>{fmt(t.sim.perKm, { rate: money(ratePerKm) })}</span>
                  </div>
                  <div className="flex justify-between font-mono text-amber-300 font-semibold pt-1 gap-3">
                    <span>{t.sim.total}</span>
                    <span>{priceDetails ? money(priceDetails.price) : '—'}</span>
                  </div>
                </div>

                {isNight && (
                  <div className="mt-3 flex justify-between gap-3 font-mono text-xs text-amber-300">
                    <span>{t.sim.nightTitle}</span>
                    <span>{money(NIGHT_RATE_PER_KM)} / km</span>
                  </div>
                )}

                {priceDetails?.minTripApplied && (
                  <div className="mt-3 text-[11px] text-neutral-400">{t.sim.minFare}</div>
                )}

                {activeKm === null && !isCalculating && (
                  <div className="mt-3 text-[11px] text-amber-300 flex items-start gap-1.5 leading-relaxed">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{t.sim.needBoth}</span>
                  </div>
                )}

                <div className="mt-3 text-[11px] text-neutral-400 flex items-start gap-1.5 leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t.sim.transparent}</span>
                </div>
              </div>

              {/* Dynamic Review List */}
              <div className="mt-6 space-y-2.5 text-xs text-neutral-300">
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500">{t.sim.rowDriver}</span>
                  <span className="font-semibold text-white text-right">{t.sim.driverCar}</span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500 shrink-0">{t.sim.rowService}</span>
                  <span className="font-medium text-white text-right truncate max-w-[60%]">{serviceLabel(serviceId)}</span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500 shrink-0">{t.sim.rowDateTime}</span>
                  <span className="font-mono text-white text-right">
                    {date ? fmt(t.sim.dateAt, { date: displayDate, time }) : t.sim.toBeArranged}
                  </span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500 shrink-0">{t.sim.rowBoarding}</span>
                  <span className="text-white text-right truncate max-w-[60%]">
                    {originPoint ? origin.text : t.sim.toBeArranged}
                  </span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500 shrink-0">{t.sim.rowDropoff}</span>
                  <span className="text-white text-right truncate max-w-[60%]">
                    {destinationPoint ? destination.text : t.sim.toBeArranged}
                  </span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500 shrink-0">{t.sim.distance.replace(/[:：]$/, '')}</span>
                  <span className="font-mono text-white text-right">
                    {activeKm !== null ? km(activeKm) : '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500 shrink-0">{t.sim.rowTime}</span>
                  <span className="font-mono text-white text-right">
                    {estimatedMinutes !== null ? `~${estimatedMinutes} ${t.sim.minutes}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500 shrink-0">{t.sim.rowSource}</span>
                  <span className="text-white text-right">{sourceLabel}</span>
                </div>
                <div className="flex justify-between gap-3 py-1 border-b border-white/5">
                  <span className="text-neutral-500 shrink-0">{t.sim.rowPax}</span>
                  <span className="text-white text-right">
                    {fmt(t.sim.paxValue, { p: passengers, l: luggage })}
                  </span>
                </div>
                <div className="flex justify-between gap-3 py-1">
                  <span className="text-neutral-500 shrink-0">{t.sim.rowClimate}</span>
                  <span className="text-white text-right truncate max-w-[60%]">{climateLabel}</span>
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={handleSendToWhatsApp}
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all duration-200 shadow-lg shadow-amber-400/25 active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-neutral-950 shrink-0" />
                  <span>{t.sim.sendWhatsApp}</span>
                </button>

                <button
                  onClick={handleCopyDetails}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">{t.sim.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{t.sim.copy}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <span className="text-[11px] text-neutral-500 font-mono">{t.sim.footerLine}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
