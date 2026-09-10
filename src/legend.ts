import { decodeLaneStatus, distinctLaneStatusGlyphs, LaneStatusSymbol } from './laneStatusCoded'
import { LaneStatusLabelOverrides, LaneStatusLocale, resolveLabel } from './labels'

/** One legend row: the symbol, the raw character that produced it, and its resolved label. */
export interface LegendEntry {
  symbol: LaneStatusSymbol
  char: string
  label: string
}

export interface LegendOptions {
  locale?: LaneStatusLocale
  labels?: LaneStatusLabelOverrides
}

/**
 * The distinct symbols present in `code` (first-seen order) with resolved labels — enough for a
 * host to build its own legend (HTML, table, …). The diagram renderer uses the same data for its
 * optional embedded SVG legend.
 */
export function getLaneStatusLegend(code: string, options: LegendOptions = {}): LegendEntry[] {
  const { locale = 'en', labels } = options
  return distinctLaneStatusGlyphs(decodeLaneStatus(code)).map((glyph) => ({
    symbol: glyph.symbol,
    char: glyph.char,
    label: resolveLabel(glyph.symbol, locale, labels),
  }))
}
