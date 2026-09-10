// lane-status-viewer — framework-agnostic renderer for DATEX II MDM Baustellen lane-status strings
// (`laneStatusCoded` and the extended `extendedLaneStatusCoded`). Zero runtime dependencies.

export { decodeLaneStatus, distinctLaneStatusGlyphs, SYMBOLS } from './laneStatusCoded'
export type {
  LaneStatusGlyph,
  LaneStatusSymbol,
  LaneStatusKind,
  SymbolSpec,
} from './laneStatusCoded'

export { LANE_STATUS_SIGNS } from './laneStatusSigns'

export {
  LANE_STATUS_LABELS,
  LANE_STATUS_LEGEND_TITLE,
  LANE_STATUS_ARIA,
  resolveLabel,
} from './labels'
export type { LaneStatusLocale, LaneStatusLabelOverrides } from './labels'

export { getLaneStatusLegend } from './legend'
export type { LegendEntry, LegendOptions } from './legend'

export { renderLaneStatusSvg } from './renderSvg'
export type { RenderLaneStatusOptions } from './renderSvg'

export { renderLaneStatusElement } from './dom'
