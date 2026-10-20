import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, Info } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';
import { isSamePlace, pairKey, type LocationPoint } from '../utils/distanceCalculator';
import FinishFlag, { finishFlagSvg } from './FinishFlag';

export interface RouteReport {
  /** Trajeto ao qual este resultado pertence (veja pairKey) */
  key: string;
  status: 'loading' | 'ok' | 'fallback';
  /** Distância real de carro, em km (só quando status = 'ok') */
  km?: number;
}

interface RouteMapProps {
  origin: LocationPoint | null;
  destination: LocationPoint | null;
  originLabel: string;
  destinationLabel: string;
  onRoute?: (report: RouteReport | null) => void;
}

const FORTALEZA_CENTER: L.LatLngTuple = [-3.75, -38.5];

// Cor da rota: violeta vivo, que se destaca do mapa e dos pinos amarelo (A) e verde (chegada)
const ROUTE_COLOR = '#7c3aed';

// Marcador circular com letra (A = embarque)
const pinIcon = (letter: string, bg: string) =>
  L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:9999px;background:${bg};color:#0a0a0a;display:flex;align-items:center;justify-content:center;font:700 13px system-ui,sans-serif;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.45)">${letter}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

// Marcador de chegada: bolinha com a bandeira quadriculada
const finishIcon = () =>
  L.divIcon({
    className: '',
    html: `<div style="width:34px;height:34px;border-radius:9999px;background:#ffffff;display:flex;align-items:center;justify-content:center;border:3px solid #10b981;box-shadow:0 2px 10px rgba(0,0,0,.5)">${finishFlagSvg(20)}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });

export default function RouteMap({ origin, destination, originLabel, destinationLabel, onRoute }: RouteMapProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const originMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'fallback'>('idle');

  // Textos mais recentes dos balões do mapa, sem refazer a rota quando só o idioma muda
  const labelsRef = useRef({ originLabel, destinationLabel, boarding: t.map.boarding, dropoff: t.map.dropoff });
  labelsRef.current = { originLabel, destinationLabel, boarding: t.map.boarding, dropoff: t.map.dropoff };

  const onRouteRef = useRef(onRoute);
  onRouteRef.current = onRoute;

  // Cria o mapa uma única vez
  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: FORTALEZA_CENTER,
      zoom: 11,
      scrollWheelZoom: false, // evita "prender" a rolagem da página
      attributionControl: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    // Mantém o tamanho correto quando o layout muda (celular, animações)
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Atualiza marcadores e rota quando origem/destino mudam (inclusive endereços digitados)
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    let cancelled = false;
    const controller = new AbortController();
    const labels = labelsRef.current;

    originMarkerRef.current = null;
    destMarkerRef.current = null;
    if (origin) {
      originMarkerRef.current = L.marker([origin.lat, origin.lng], { icon: pinIcon('A', '#fbbf24') })
        .bindTooltip(`${labels.boarding}: ${labels.originLabel}`)
        .addTo(layer);
    }
    if (destination) {
      destMarkerRef.current = L.marker([destination.lat, destination.lng], { icon: finishIcon(), zIndexOffset: 500 })
        .bindTooltip(`${labels.dropoff}: ${labels.destinationLabel}`)
        .addTo(layer);
    }

    if (origin && destination && !isSamePlace(origin, destination)) {
      const key = pairKey(origin, destination);
      map.fitBounds(L.latLngBounds([origin.lat, origin.lng], [destination.lat, destination.lng]), {
        padding: [40, 40],
      });
      setStatus('loading');
      onRouteRef.current?.({ key, status: 'loading' });

      // Traçado real pelas ruas (OSRM, serviço público e gratuito)
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
        `?overview=full&geometries=geojson`;

      fetch(url, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`OSRM ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;
          const route = data?.routes?.[0];
          if (!route) throw new Error('Sem rota');
          const coords: L.LatLngTuple[] = route.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng] as L.LatLngTuple
          );
          // brilho suave + contorno branco + linha violeta, para a rota saltar do mapa
          L.polyline(coords, { color: ROUTE_COLOR, weight: 14, opacity: 0.22, lineCap: 'round', lineJoin: 'round' }).addTo(layer);
          L.polyline(coords, { color: '#ffffff', weight: 9, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }).addTo(layer);
          const line = L.polyline(coords, { color: ROUTE_COLOR, weight: 5.5, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(layer);
          map.fitBounds(line.getBounds(), { padding: [40, 40] });
          setStatus('ok');
          // distância real de carro, com 1 casa decimal
          onRouteRef.current?.({ key, status: 'ok', km: Math.round(Number(route.distance) / 100) / 10 });
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return;
          // Sem rota online: mostra uma linha reta tracejada entre os pontos
          L.polyline(
            [
              [origin.lat, origin.lng],
              [destination.lat, destination.lng],
            ],
            { color: ROUTE_COLOR, weight: 4, opacity: 0.9, dashArray: '8 8' }
          ).addTo(layer);
          setStatus('fallback');
          onRouteRef.current?.({ key, status: 'fallback' });
        });
    } else {
      setStatus('idle');
      onRouteRef.current?.(null);
      const single = origin || destination;
      if (single) {
        map.setView([single.lat, single.lng], 14);
      } else {
        map.setView(FORTALEZA_CENTER, 11);
      }
    }

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  // Só os textos dos balões mudam quando o idioma ou o nome do local muda
  useEffect(() => {
    originMarkerRef.current?.setTooltipContent(`${t.map.boarding}: ${originLabel}`);
    destMarkerRef.current?.setTooltipContent(`${t.map.dropoff}: ${destinationLabel}`);
  }, [originLabel, destinationLabel, t.map.boarding, t.map.dropoff]);

  const googleMapsUrl =
    origin && destination
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`
      : null;

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-950 overflow-hidden">
      {/* "isolate" mantém os z-index internos do mapa abaixo do menu fixo do site */}
      <div className="relative isolate h-64 sm:h-80 w-full">
        <div ref={containerRef} className="absolute inset-0" role="img" aria-label={t.map.ariaLabel} />

        {status === 'loading' && (
          <div className="absolute top-3 left-3 z-[500] px-2.5 py-1 rounded-md bg-neutral-950/90 text-[11px] text-neutral-300 border border-white/10">
            {t.map.tracing}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-2.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 shrink-0 rounded-full bg-amber-400 text-neutral-950 text-[11px] font-bold flex items-center justify-center">
              A
            </span>
            <span className="truncate text-neutral-300">{origin ? originLabel : t.map.pickOrigin}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-5 h-5 shrink-0 rounded-full border-2 border-emerald-500 flex items-center justify-center"
              style={{ background: '#ffffff' }}
            >
              <FinishFlag size={12} />
            </span>
            <span className="truncate text-neutral-300">{destination ? destinationLabel : t.map.pickDest}</span>
          </div>
        </div>

        {status === 'fallback' && (
          <div className="flex items-start gap-1.5 text-[11px] text-neutral-400">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{t.map.fallbackNote}</span>
          </div>
        )}

        {(!origin || !destination) && (
          <div className="flex items-start gap-1.5 text-[11px] text-neutral-400">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{t.map.hint}</span>
          </div>
        )}

        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 underline underline-offset-4"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t.map.openGoogle}</span>
          </a>
        )}
      </div>
    </div>
  );
}
