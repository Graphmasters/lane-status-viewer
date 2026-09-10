// Decoder for the `laneStatusCoded` / `extendedLaneStatusCoded` values carried by incidents from
// the German MDM Baustellen profile. The value is a short string describing a carriageway
// cross-section as a left-to-right sequence of single-character symbols, e.g. "sluu2oerx" or the
// richer "uww2x". Each character is one of (extended alphabet oeuiw12xslrpPHfFgG):
//
//   s  hard shoulder present            (drawn as a filled box)
//   o  lane open, direction of travel   ("oben"  -> up arrow, green)
//   u  lane open, oncoming direction    ("unten" -> down arrow, green)
//   e  narrowed lane, direction         (up arrow, blue)
//   i  narrowed lane, oncoming          (down arrow, blue)
//   w  reversible / alternating lane    (double-headed vertical arrow, green)
//   x  lane closed                      (red cross)
//   l  hard-shoulder marking, oncoming  (separator "/")
//   r  hard-shoulder marking, direction (separator "\")
//   1  single-carriageway divider       (separator, one bar)
//   2  central reservation / median     (separator, two bars)
//   f  cycle path                       (bicycle sign)
//   F  cycle path closed                (bicycle prohibition sign)
//   g  foot path                        (pedestrian sign)
//   G  foot path closed                 (pedestrian prohibition sign)
//   p  parking lane                     (blue "P" sign)
//   P  restricted no-stopping           (limited no-stopping sign)
//   H  absolute no-stopping             (no-stopping sign)
//   L  carriageway / special-lane separation, oncoming  (heavier "/" separator)
//   R  carriageway / special-lane separation, direction (heavier "\" separator)
//
// Reference: MDM Datenmodell für Baustellen 04-00-00, section 5.4 (Abbildung 25) and Anhang E;
// extended alphabet from the DATEX II laneStatusCoded model v0.10.0 (LaneSituationCodes metadata).
// L/R are not in the v0.10.0 alphabet but are emitted by the Schleswig-Holstein feed as the
// uppercase counterpart of l/r: they always sit between the carriageway and an adjacent special-use
// strip (cycle/foot path, parking) — L on the oncoming side (left of 2), R on the direction side.

/** Semantic identity of a single decoded symbol. */
export type LaneStatusSymbol =
  | 'shoulder'
  | 'openDirection'
  | 'openOncoming'
  | 'narrowDirection'
  | 'narrowOncoming'
  | 'reversible'
  | 'closed'
  | 'shoulderSeparationOncoming'
  | 'shoulderSeparationDirection'
  | 'boundarySingle'
  | 'boundaryDouble'
  | 'cyclePath'
  | 'cyclePathClosed'
  | 'footPath'
  | 'footPathClosed'
  | 'parking'
  | 'noStoppingRestricted'
  | 'noStoppingAbsolute'
  | 'specialLaneSeparationOncoming'
  | 'specialLaneSeparationDirection'
  | 'unknown'

/**
 * How a symbol is drawn: `lane` symbols render as an equally sized box, `separator`
 * symbols render as a thin marking placed between the boxes.
 */
export type LaneStatusKind = 'lane' | 'separator'

export interface LaneStatusGlyph {
  /** The raw character this glyph was decoded from. */
  char: string
  symbol: LaneStatusSymbol
  kind: LaneStatusKind
  /** react-intl message id describing the symbol, used for the legend and tooltips. */
  labelId: string
}

export interface SymbolSpec {
  symbol: LaneStatusSymbol
  kind: LaneStatusKind
  labelId: string
}

const LABEL_PREFIX = 'incidentDetail.laneStatus.symbol.'

function lane(symbol: LaneStatusSymbol): SymbolSpec {
  return { symbol, kind: 'lane', labelId: `${LABEL_PREFIX}${symbol}` }
}

function separator(symbol: LaneStatusSymbol): SymbolSpec {
  return { symbol, kind: 'separator', labelId: `${LABEL_PREFIX}${symbol}` }
}

/**
 * The recognised alphabet: raw character → symbol spec. Case-sensitive. Exposed so consumers can
 * enumerate the full key set (e.g. a documentation page). Characters not present here decode to the
 * `unknown` symbol.
 */
export const SYMBOLS: Record<string, SymbolSpec> = {
  s: lane('shoulder'),
  o: lane('openDirection'),
  u: lane('openOncoming'),
  e: lane('narrowDirection'),
  i: lane('narrowOncoming'),
  w: lane('reversible'),
  x: lane('closed'),
  f: lane('cyclePath'),
  F: lane('cyclePathClosed'),
  g: lane('footPath'),
  G: lane('footPathClosed'),
  p: lane('parking'),
  P: lane('noStoppingRestricted'),
  H: lane('noStoppingAbsolute'),
  l: separator('shoulderSeparationOncoming'),
  r: separator('shoulderSeparationDirection'),
  L: separator('specialLaneSeparationOncoming'),
  R: separator('specialLaneSeparationDirection'),
  '1': separator('boundarySingle'),
  '2': separator('boundaryDouble'),
}

const UNKNOWN_SPEC: SymbolSpec = {
  symbol: 'unknown',
  kind: 'lane',
  labelId: `${LABEL_PREFIX}unknown`,
}

/**
 * Decodes a lane-status string into an ordered list of glyphs. Unrecognised characters are kept
 * as `unknown` glyphs (drawn as an empty box) rather than dropped, so a future profile extension
 * still shows the operator that something is there. Whitespace is ignored.
 */
export function decodeLaneStatus(value: string | undefined | null): LaneStatusGlyph[] {
  if (!value) {
    return []
  }

  const glyphs: LaneStatusGlyph[] = []
  for (const char of value.trim()) {
    if (/\s/.test(char)) {
      continue
    }
    const spec = SYMBOLS[char] ?? UNKNOWN_SPEC
    glyphs.push({ char, symbol: spec.symbol, kind: spec.kind, labelId: spec.labelId })
  }
  return glyphs
}

/**
 * The distinct symbols in the value, in first-seen order — used to render a legend that
 * only explains the symbols actually present.
 */
export function distinctLaneStatusGlyphs(glyphs: LaneStatusGlyph[]): LaneStatusGlyph[] {
  const seen = new Set<LaneStatusSymbol>()
  const result: LaneStatusGlyph[] = []
  for (const glyph of glyphs) {
    if (seen.has(glyph.symbol)) {
      continue
    }
    seen.add(glyph.symbol)
    result.push(glyph)
  }
  return result
}
