import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import {
  hasHouseNumberInQuery,
  normalizeAddressQuery,
  reversePlace,
  searchPlaces,
  stripHouseNumber,
  type GeoResult,
} from '../utils/geocoding';
import { pt } from '../i18n/pt';
import {
  findExactLocation,
  getLocationById,
  getLocationName,
  suggestLocations,
  type LocationPoint,
} from '../utils/distanceCalculator';

export type PlaceStatus = 'idle' | 'loading' | 'locating' | 'found' | 'notfound' | 'error' | 'geodenied' | 'geoerror';

export interface PlaceField {
  /** Texto que aparece no campo */
  text: string;
  /** Ponto já localizado no mapa (null enquanto o endereço digitado não foi localizado) */
  point: LocationPoint | null;
  status: PlaceStatus;
  /** Foi digitado um número, mas o mapa só tem a rua: o ponto é aproximado */
  approx: boolean;
  /** Alternativas devolvidas pela última busca */
  results: GeoResult[];
  /** Locais da lista que combinam com o texto digitado */
  suggestions: LocationPoint[];
  onTextChange: (value: string) => void;
  /** Localiza o texto digitado (Enter, lupa ou ao sair do campo) */
  commit: () => void;
  chooseLandmark: (id: string) => void;
  chooseResult: (result: GeoResult) => void;
  /** Preenche com a localização atual do aparelho (GPS) */
  locate: () => void;
  clearResults: () => void;
}

function toPoint(result: GeoResult): LocationPoint {
  return {
    id: `custom-${result.id}`,
    name: result.label,
    region: '',
    lat: result.lat,
    lng: result.lng,
    custom: true,
  };
}

export function usePlaceField(initialLandmarkId: string | null): PlaceField {
  const { lang, option, t } = useI18n();

  const initial = initialLandmarkId ? getLocationById(initialLandmarkId) : null;
  const [text, setText] = useState(initial ? getLocationName(initial, lang) : '');
  const [point, setPoint] = useState<LocationPoint | null>(initial);
  const [status, setStatus] = useState<PlaceStatus>(initial ? 'found' : 'idle');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [approx, setApprox] = useState(false);
  // O último endereço digitado tinha número? (para avisar se o mapa só achou a rua)
  const queryHadNumber = useRef(false);

  // Cada busca recebe um número: respostas antigas são ignoradas
  const requestId = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const cancelSearch = useCallback(() => {
    requestId.current += 1;
    controller.current?.abort();
    controller.current = null;
  }, []);

  useEffect(() => cancelSearch, [cancelSearch]);

  // Quando o idioma muda, os locais da lista trocam de nome; endereços digitados ficam como estão
  const pointRef = useRef(point);
  pointRef.current = point;
  useEffect(() => {
    const current = pointRef.current;
    if (current && !current.custom) setText(getLocationName(current, lang));
  }, [lang]);

  const onTextChange = useCallback(
    (value: string) => {
      cancelSearch();
      setText(value);
      setResults([]);
      setApprox(false);
      setStatus('idle');
      // O campo deixou de corresponder ao ponto do mapa: o trajeto e o valor esperam a nova busca
      setPoint(null);
    },
    [cancelSearch]
  );

  const chooseLandmark = useCallback(
    (id: string) => {
      const loc = getLocationById(id);
      if (!loc) return;
      cancelSearch();
      setPoint(loc);
      setText(getLocationName(loc, lang));
      setResults([]);
      setApprox(false);
      setStatus('found');
    },
    [cancelSearch, lang]
  );

  const chooseResult = useCallback(
    (result: GeoResult) => {
      cancelSearch();
      setPoint(toPoint(result));
      setText(result.label);
      setApprox(queryHadNumber.current && !result.hasHouseNumber);
      setStatus('found');
      // mantém as alternativas à vista para a pessoa trocar, se este não era o local certo
    },
    [cancelSearch]
  );

  const clearResults = useCallback(() => setResults([]), []);

  const commit = useCallback(() => {
    const query = text.trim();
    if (!query) {
      cancelSearch();
      setPoint(null);
      setStatus('idle');
      setResults([]);
      return;
    }

    // Nome idêntico a um local da lista: usa direto, sem internet
    const exact = findExactLocation(query);
    if (exact) {
      chooseLandmark(exact.id);
      return;
    }

    cancelSearch();
    const id = requestId.current;
    const ctrl = new AbortController();
    controller.current = ctrl;
    setStatus('loading');
    setResults([]);
    setApprox(false);

    // "rua abc, numero 20" e "rua abc, 20" viram "rua abc 20"
    const normalized = normalizeAddressQuery(query);
    const hadNumber = hasHouseNumberInQuery(normalized);
    queryHadNumber.current = hadNumber;

    const run = async () => {
      let found = await searchPlaces(normalized, option.geoLang, ctrl.signal);
      let streetOnly = false;
      // O mapa pode não ter aquele número: procura só a rua e avisa que o ponto é aproximado
      if (found.length === 0 && hadNumber) {
        found = await searchPlaces(stripHouseNumber(normalized), option.geoLang, ctrl.signal);
        streetOnly = found.length > 0;
      }
      return { found, streetOnly };
    };

    run()
      .then(({ found, streetOnly }) => {
        if (id !== requestId.current) return;
        if (found.length === 0) {
          setPoint(null);
          setStatus('notfound');
          return;
        }
        setResults(found);
        setPoint(toPoint(found[0]));
        setText(found[0].label);
        setApprox(hadNumber && (streetOnly || !found[0].hasHouseNumber));
        setStatus('found');
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return;
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setPoint(null);
        setStatus('error');
      });
  }, [text, option.geoLang, cancelSearch, chooseLandmark]);

  const locate = useCallback(() => {
    cancelSearch();
    setResults([]);
    setApprox(false);
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setStatus('geoerror');
      return;
    }
    const id = requestId.current;
    setStatus('locating');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (id !== requestId.current) return;
        const { latitude, longitude } = pos.coords;
        // O ponto já vale agora; o endereço escrito chega logo depois
        const base: LocationPoint = {
          id: 'custom-gps',
          name: pt.sim.myLocation,
          region: '',
          lat: latitude,
          lng: longitude,
          custom: true,
        };
        setPoint(base);
        setText(t.sim.myLocation);
        setStatus('found');

        const ctrl = new AbortController();
        controller.current = ctrl;
        reversePlace(latitude, longitude, option.geoLang, ctrl.signal)
          .then((place) => {
            if (id !== requestId.current || !place) return;
            setPoint({ ...base, name: place.label });
            setText(place.label);
          })
          .catch(() => {
            // sem o endereço escrito, continua com "Minha localização"
          });
      },
      (err) => {
        if (id !== requestId.current) return;
        setStatus(err.code === 1 ? 'geodenied' : 'geoerror');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }, [cancelSearch, option.geoLang, t.sim.myLocation]);

  const suggestions = status === 'idle' ? suggestLocations(text) : [];

  return {
    text,
    point,
    status,
    approx,
    results,
    suggestions,
    onTextChange,
    commit,
    chooseLandmark,
    chooseResult,
    locate,
    clearResults,
  };
}
