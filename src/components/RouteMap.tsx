import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExternalLink, Info } from 'lucide-react';
import type { LocationPoint } from '../utils/distanceCalculator';

interface RouteMapProps {
  origin: LocationPoint | null;
  destination: LocationPoint | null;
}

type RouteStatus = 'idle' | 'loading' | 'ok' | 'fallback';

const FORTALEZA_CENTER: L.LatLngTuple = [-3.75, -38.5];

// Marcador circular com letra (A = embarque, B = desembarque)
const pinIcon = (letter: string, bg: string) =>
  L.divIcon({
    className: '',
    html: `<div style="width:30px;height:30px;border-radius:9999px;background:${bg};color:#0a0a0a;display:flex;align-items:center;justify-content:center;font:700 13px system-ui,sans-serif;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.45)">${letter}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

export default function RouteMap({ origin, destination }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [status, setStatus] = useState<RouteStatus>('idle');

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

  // Atualiza marcadores e rota quando origem/destino mudam
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    let cancelled = false;
    const controller = new AbortController();

    if (origin) {
      L.marker([origin.lat, origin.lng], { icon: pinIcon('A', '#fbbf24'), title: 'Embarque' })
        .bindTooltip(`Embarque: ${origin.name}`)
        .addTo(layer);
    }
    if (destination) {
      L.marker([destination.lat, destination.lng], { icon: pinIcon('B', '#34d399'), title: 'Desembarque' })
        .bindTooltip(`Desembarque: ${destination.name}`)
        .addTo(layer);
    }

    if (origin && destination && origin.id !== destination.id) {
      map.fitBounds(
        L.latLngBounds([origin.lat, origin.lng], [destination.lat, destination.lng]),
        { padding: [40, 40] }
      );
      setStatus('loading');

      // Traçado real pelas ruas (OSRM, serviço público e gratuito)
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
        `?overview=full&geometries=geojson`;

      fetch(url, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          const coords: L.LatLngTuple[] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng] as L.LatLngTuple
          );
          const line = L.polyline(coords, { color: '#fbbf24', weight: 5, opacity: 0.95 }).addTo(layer);
          map.fitBounds(line.getBounds(), { padding: [40, 40] });
          setStatus('ok');
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return;
          // Sem rota online: mostra uma linha reta tracejada entre os pontos
          L.polyline(
            [
              [origin.lat, origin.lng],
              [destination.lat, destination.lng],
            ],
            { color: '#fbbf24', weight: 4, opacity: 0.9, dashArray: '8 8' }
          ).addTo(layer);
          setStatus('fallback');
        });
    } else {
      setStatus('idle');
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
  }, [origin?.id, destination?.id]);

  const googleMapsUrl =
    origin && destination
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`
      : null;

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-950 overflow-hidden">
      {/* "isolate" mantém os z-index internos do mapa abaixo do menu fixo do site */}
      <div className="relative isolate h-64 sm:h-80 w-full">
        <div ref={containerRef} className="absolute inset-0" role="img" aria-label="Mapa com o trajeto de embarque e desembarque" />

        {status === 'loading' && (
          <div className="absolute top-3 left-3 z-[500] px-2.5 py-1 rounded-md bg-neutral-950/90 text-[11px] text-neutral-300 border border-white/10">
            Traçando rota…
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-2.5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 shrink-0 rounded-full bg-amber-400 text-neutral-950 text-[11px] font-bold flex items-center justify-center">A</span>
            <span className="truncate text-neutral-300">{origin ? origin.name : 'Escolha o embarque na lista'}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-400 text-neutral-950 text-[11px] font-bold flex items-center justify-center">B</span>
            <span className="truncate text-neutral-300">{destination ? destination.name : 'Escolha o desembarque na lista'}</span>
          </div>
        </div>

        {status === 'fallback' && (
          <div className="flex items-start gap-1.5 text-[11px] text-neutral-400">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Não foi possível carregar o traçado das ruas agora. A linha tracejada mostra apenas a direção do trajeto.</span>
          </div>
        )}

        {(!origin || !destination) && (
          <div className="flex items-start gap-1.5 text-[11px] text-neutral-400">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>Selecione os locais pelas sugestões (ou toque nos atalhos) para ver o trajeto no mapa.</span>
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
            <span>Abrir esta rota no Google Maps</span>
          </a>
        )}
      </div>
    </div>
  );
}
