import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, Loader2, LocateFixed, MapPin, Search, TriangleAlert } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';
import type { PlaceField as PlaceFieldState } from '../hooks/usePlaceField';
import { getLocationById, getLocationName } from '../utils/distanceCalculator';

interface PlaceFieldProps {
  label: string;
  placeholder: string;
  accent: 'amber' | 'emerald';
  field: PlaceFieldState;
  /** ids dos locais da lista mostrados como atalhos */
  quickIds: string[];
}

const ACCENT = {
  amber: {
    icon: 'text-amber-400',
    chipOn: 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-medium',
    ring: 'focus-within:border-amber-400',
  },
  emerald: {
    icon: 'text-emerald-400',
    chipOn: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-medium',
    ring: 'focus-within:border-emerald-400',
  },
} as const;

export default function PlaceField({ label, placeholder, accent, field, quickIds }: PlaceFieldProps) {
  const { t, lang } = useI18n();
  const colors = ACCENT[accent];
  const inputId = useId();
  const statusId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const { text, point, status, approx, results, suggestions } = field;

  const showSuggestions = focused && suggestions.length > 0;
  const showAlternatives = results.length > 1 && !!point?.custom;

  // Sempre o estado mais recente, para a verificação feita um instante depois de sair do campo
  const latest = useRef(field);
  latest.current = field;

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      field.commit();
    }
  };

  // Ao sair do campo (e do bloco de sugestões) sem ter escolhido nada, localiza o que foi digitado
  // A pequena espera deixa um clique em atalho/sugestão acontecer antes, evitando uma busca desnecessária
  const onBlurCapture = () => {
    window.setTimeout(() => {
      if (wrapperRef.current?.contains(document.activeElement)) return;
      setFocused(false);
      const current = latest.current;
      if (current.text.trim() && !current.point && current.status === 'idle') current.commit();
    }, 150);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-3">
        <label htmlFor={inputId} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          <MapPin className={`w-3.5 h-3.5 ${colors.icon}`} />
          <span>{label}</span>
        </label>
        <span className="text-[11px] text-neutral-500 text-right">{t.sim.fieldHint}</span>
      </div>

      <div ref={wrapperRef} className="relative" onFocusCapture={() => setFocused(true)} onBlurCapture={onBlurCapture}>
        <div
          className={`flex items-stretch bg-neutral-950 border border-white/15 rounded-lg transition-colors ${colors.ring}`}
        >
          <input
            id={inputId}
            type="text"
            value={text}
            onChange={(e) => field.onTextChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-describedby={statusId}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => field.commit()}
            disabled={!text.trim() || status === 'loading'}
            aria-label={t.sim.searchButton}
            title={t.sim.searchButton}
            className="px-3.5 text-neutral-400 hover:text-white disabled:opacity-40 disabled:hover:text-neutral-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {/* Sugestões instantâneas da lista de locais frequentes (sem internet) */}
        {showSuggestions && (
          <div
            // mouseDown não tira o foco do campo, então o clique na sugestão não dispara a busca ao "sair"
            onMouseDown={(e) => e.preventDefault()}
            className="absolute z-20 left-0 right-0 mt-1 rounded-lg border border-white/15 bg-neutral-900 shadow-2xl overflow-hidden"
          >
            <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              {t.sim.frequentPlaces}
            </div>
            <ul>
              {suggestions.map((loc) => (
                <li key={loc.id}>
                  <button
                    type="button"
                    onClick={() => {
                      field.chooseLandmark(loc.id);
                      setFocused(false);
                    }}
                    className="w-full flex items-start gap-2 px-3 py-2 text-left text-xs text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${colors.icon}`} />
                    <span>{getLocationName(loc, lang)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Estado da busca */}
      <div id={statusId} className="mt-1.5 min-h-[1.1rem] text-[11px]" aria-live="polite">
        {status === 'loading' && (
          <span className="flex items-center gap-1.5 text-neutral-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t.sim.searching}
          </span>
        )}
        {status === 'locating' && (
          <span className="flex items-center gap-1.5 text-neutral-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t.sim.locating}
          </span>
        )}
        {status === 'found' && point && !approx && (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Check className="w-3 h-3 shrink-0" />
            {t.sim.found}
          </span>
        )}
        {status === 'found' && point && approx && (
          <span className="flex items-start gap-1.5 text-amber-300">
            <TriangleAlert className="w-3 h-3 shrink-0 mt-0.5" />
            {t.sim.streetOnly}
          </span>
        )}
        {status === 'geodenied' && (
          <span className="flex items-start gap-1.5 text-amber-300">
            <TriangleAlert className="w-3 h-3 shrink-0 mt-0.5" />
            {t.sim.geoDenied}
          </span>
        )}
        {status === 'geoerror' && (
          <span className="flex items-start gap-1.5 text-amber-300">
            <TriangleAlert className="w-3 h-3 shrink-0 mt-0.5" />
            {t.sim.geoUnavailable}
          </span>
        )}
        {status === 'notfound' && (
          <span className="flex items-start gap-1.5 text-amber-300">
            <TriangleAlert className="w-3 h-3 shrink-0 mt-0.5" />
            {t.sim.notFound}
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-start gap-1.5 text-red-300">
            <TriangleAlert className="w-3 h-3 shrink-0 mt-0.5" />
            {t.sim.searchError}
          </span>
        )}
        {status === 'idle' && text.trim() && !point && <span className="text-neutral-500">{t.sim.pressEnter}</span>}
      </div>

      {/* Outras possibilidades quando a busca devolveu mais de um endereço */}
      {showAlternatives && (
        <div className="mt-1.5 rounded-lg border border-white/10 bg-neutral-950/60 p-2">
          <div className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            {t.sim.otherResults}
          </div>
          <ul className="space-y-0.5">
            {results
              .filter((r) => `custom-${r.id}` !== point?.id)
              .map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => field.chooseResult(r)}
                    className="w-full flex items-start gap-2 px-2 py-1.5 rounded text-left text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-500" />
                    <span>{r.label}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Atalhos */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => field.locate()}
          disabled={status === 'locating'}
          className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border border-white/15 text-neutral-200 hover:text-white hover:border-amber-400/50 hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-wait"
        >
          {status === 'locating' ? (
            <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
          ) : (
            <LocateFixed className="w-3 h-3 text-amber-400" />
          )}
          {t.sim.useMyLocation}
        </button>
        {quickIds.map((id) => {
          const loc = getLocationById(id);
          if (!loc) return null;
          const selected = point?.id === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => field.chooseLandmark(id)}
              aria-pressed={selected}
              className={`text-[11px] px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selected ? colors.chipOn : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {getLocationName(loc, lang)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
