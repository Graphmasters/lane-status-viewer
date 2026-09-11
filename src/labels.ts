import type { LaneStatusSymbol } from './laneStatusCoded'

/** Locales with bundled labels. */
export type LaneStatusLocale = 'en' | 'de'

/** Optional per-symbol label overrides passed by callers. */
export type LaneStatusLabelOverrides = Partial<Record<LaneStatusSymbol, string>>

/**
 * Human-readable label for every symbol, in English and German. Sourced from the Graphmasters
 * traffic-management-website i18n strings (`incidentDetail.laneStatus.symbol.*`).
 */
export const LANE_STATUS_LABELS: Record<LaneStatusLocale, Record<LaneStatusSymbol, string>> = {
  en: {
    shoulder: 'Hard shoulder',
    openDirection: 'Lane open (direction of travel)',
    openOncoming: 'Lane open (oncoming direction)',
    narrowDirection: 'Narrowed lane (direction of travel)',
    narrowOncoming: 'Narrowed lane (oncoming direction)',
    reversible: 'Reversible lane',
    closed: 'Lane closed',
    shoulderSeparationOncoming: 'Hard-shoulder marking (oncoming direction)',
    shoulderSeparationDirection: 'Hard-shoulder marking (direction of travel)',
    boundarySingle: 'Single-carriageway divider',
    boundaryDouble: 'Central reservation',
    cyclePath: 'Cycle path',
    cyclePathClosed: 'Cycle path closed',
    footPath: 'Foot path',
    footPathClosed: 'Foot path closed',
    parking: 'Parking lane',
    noStoppingRestricted: 'No parking',
    noStoppingAbsolute: 'No stopping',
    specialLaneSeparationOncoming: 'Special-lane separation (oncoming)',
    specialLaneSeparationDirection: 'Special-lane separation (direction of travel)',
    unknown: 'Unknown symbol',
  },
  de: {
    shoulder: 'Standstreifen',
    openDirection: 'Fahrstreifen offen (Fahrtrichtung)',
    openOncoming: 'Fahrstreifen offen (Gegenrichtung)',
    narrowDirection: 'Verengter Fahrstreifen (Fahrtrichtung)',
    narrowOncoming: 'Verengter Fahrstreifen (Gegenrichtung)',
    reversible: 'Wechselseitig genutzter Fahrstreifen',
    closed: 'Fahrstreifen gesperrt',
    shoulderSeparationOncoming: 'Standstreifentrennung (Gegenrichtung)',
    shoulderSeparationDirection: 'Standstreifentrennung (Fahrtrichtung)',
    boundarySingle: 'Begrenzung einbahnig',
    boundaryDouble: 'Begrenzung zweibahnig (Mittelstreifen)',
    cyclePath: 'Radweg',
    cyclePathClosed: 'Radweg gesperrt',
    footPath: 'Gehweg',
    footPathClosed: 'Gehweg gesperrt',
    parking: 'Parkstreifen',
    noStoppingRestricted: 'Halteverbot eingeschränkt',
    noStoppingAbsolute: 'Halteverbot absolut',
    specialLaneSeparationOncoming: 'Trennung zum Sonderweg (Gegenrichtung)',
    specialLaneSeparationDirection: 'Trennung zum Sonderweg (Fahrtrichtung)',
    unknown: 'Unbekanntes Zeichen',
  },
}

/** Legend heading, per locale. */
export const LANE_STATUS_LEGEND_TITLE: Record<LaneStatusLocale, string> = {
  en: 'Legend',
  de: 'Legende',
}

/** Default aria-label builder, per locale. */
export const LANE_STATUS_ARIA: Record<LaneStatusLocale, (code: string) => string> = {
  en: (code) => `Lane status diagram for ${code}`,
  de: (code) => `Fahrstreifen-Diagramm für ${code}`,
}

/** Resolves a symbol's label: caller override wins, else the bundled label for the locale. */
export function resolveLabel(
  symbol: LaneStatusSymbol,
  locale: LaneStatusLocale = 'en',
  overrides?: LaneStatusLabelOverrides,
): string {
  return overrides?.[symbol] ?? LANE_STATUS_LABELS[locale][symbol]
}
