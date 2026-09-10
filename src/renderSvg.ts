import { decodeLaneStatus, LaneStatusGlyph } from './laneStatusCoded'
import { LANE_STATUS_SIGNS } from './laneStatusSigns'
import { getLaneStatusLegend } from './legend'
import {
  LANE_STATUS_ARIA,
  LANE_STATUS_LEGEND_TITLE,
  LaneStatusLabelOverrides,
  LaneStatusLocale,
} from './labels'
import { el } from './svg'

// Standalone, theme-independent SVG rendering of a decoded lane-status value. The colours are the
// fixed semantic colours of the MDM Baustellen legend (green = open, blue = narrowed, yellow = hard
// shoulder, red = closed) so the diagram keeps the meaning defined by the standard regardless of theme.
const COLOR = {
  line: '#333333', // box borders, separators, slashes and bars
  open: '#2e9e44', // green: open lane
  narrow: '#2f6fd0', // blue: narrowed lane
  shoulder: '#f5ef8a', // pale yellow: hard shoulder present
  closed: '#dd2007', // red: lane closed
  boxFill: '#ffffff', // lane box background
}

const LANE = 30 // width and height of a lane box
const SEP = 14 // width of a separator cell
const GAP = 2 // gap between adjacent cells
const MARGIN = 2 // stroke margin around the strip
const TOP = MARGIN

function widthOf(glyph: LaneStatusGlyph): number {
  return glyph.kind === 'lane' ? LANE : SEP
}

/** A 30×30 lane box with a rounded border, at horizontal offset `x`. */
function box(x: number, fill: string): string {
  return el('rect', {
    x,
    y: TOP,
    width: LANE,
    height: LANE,
    rx: 3,
    fill,
    stroke: COLOR.line,
    'stroke-width': 2,
  })
}

/** A vertical arrow (up, down, or double-headed) centred at `cx` inside a lane box. */
function arrow(cx: number, direction: 'up' | 'down' | 'both', color: string): string {
  const bottom = TOP + LANE
  const headUp = `${cx - 6},${TOP + 11} ${cx + 6},${TOP + 11} ${cx},${TOP + 4}`
  const headDown = `${cx - 6},${bottom - 11} ${cx + 6},${bottom - 11} ${cx},${bottom - 4}`
  const shaftTop = direction === 'down' ? TOP + 5 : TOP + 10
  const shaftBottom = direction === 'up' ? bottom - 5 : bottom - 10

  let inner = el('line', {
    x1: cx,
    y1: shaftTop,
    x2: cx,
    y2: shaftBottom,
    stroke: color,
    'stroke-width': 3,
    'stroke-linecap': 'round',
  })
  if (direction !== 'down') inner += el('polygon', { points: headUp, fill: color })
  if (direction !== 'up') inner += el('polygon', { points: headDown, fill: color })
  return el('g', {}, inner)
}

/** Renders one glyph as an SVG fragment at horizontal offset `x`. */
function renderGlyph(glyph: LaneStatusGlyph, x: number): string {
  const cx = x + LANE / 2
  const cy = TOP + LANE / 2

  // Extended sign codes (bike/foot path, parking, no-stopping) render the official StVO sign inside
  // the same bordered box as the other glyphs, inset a little so the box frame stays visible.
  const sign = LANE_STATUS_SIGNS[glyph.symbol]
  if (sign) {
    return el(
      'g',
      {},
      box(x, COLOR.boxFill) +
        el('image', {
          href: sign,
          x: x + 3,
          y: TOP + 3,
          width: LANE - 6,
          height: LANE - 6,
          preserveAspectRatio: 'xMidYMid meet',
        }),
    )
  }

  switch (glyph.symbol) {
    case 'shoulder':
      return el('g', {}, box(x, COLOR.shoulder))
    case 'openDirection':
      return el('g', {}, box(x, COLOR.boxFill) + arrow(cx, 'up', COLOR.open))
    case 'openOncoming':
      return el('g', {}, box(x, COLOR.boxFill) + arrow(cx, 'down', COLOR.open))
    case 'narrowDirection':
      return el('g', {}, box(x, COLOR.boxFill) + arrow(cx, 'up', COLOR.narrow))
    case 'narrowOncoming':
      return el('g', {}, box(x, COLOR.boxFill) + arrow(cx, 'down', COLOR.narrow))
    case 'reversible':
      return el('g', {}, box(x, COLOR.boxFill) + arrow(cx, 'both', COLOR.open))
    case 'closed': {
      const cross =
        el('line', {
          x1: x + 7,
          y1: TOP + 7,
          x2: x + LANE - 7,
          y2: TOP + LANE - 7,
          stroke: COLOR.closed,
          'stroke-width': 3,
          'stroke-linecap': 'round',
        }) +
        el('line', {
          x1: x + LANE - 7,
          y1: TOP + 7,
          x2: x + 7,
          y2: TOP + LANE - 7,
          stroke: COLOR.closed,
          'stroke-width': 3,
          'stroke-linecap': 'round',
        })
      return el('g', {}, box(x, COLOR.boxFill) + cross)
    }
    case 'shoulderSeparationOncoming': // "/"
      return el('line', {
        x1: x + 3,
        y1: TOP + LANE - 2,
        x2: x + SEP - 3,
        y2: TOP + 2,
        stroke: COLOR.line,
        'stroke-width': 3,
        'stroke-linecap': 'round',
      })
    case 'shoulderSeparationDirection': // "\"
      return el('line', {
        x1: x + 3,
        y1: TOP + 2,
        x2: x + SEP - 3,
        y2: TOP + LANE - 2,
        stroke: COLOR.line,
        'stroke-width': 3,
        'stroke-linecap': 'round',
      })
    case 'boundarySingle':
      return el('line', {
        x1: x + SEP / 2,
        y1: TOP,
        x2: x + SEP / 2,
        y2: TOP + LANE,
        stroke: COLOR.line,
        'stroke-width': 3,
      })
    case 'boundaryDouble':
      return el(
        'g',
        {},
        el('line', {
          x1: x + SEP / 2 - 3,
          y1: TOP,
          x2: x + SEP / 2 - 3,
          y2: TOP + LANE,
          stroke: COLOR.line,
          'stroke-width': 3,
        }) +
          el('line', {
            x1: x + SEP / 2 + 3,
            y1: TOP,
            x2: x + SEP / 2 + 3,
            y2: TOP + LANE,
            stroke: COLOR.line,
            'stroke-width': 3,
          }),
      )
    case 'specialLaneSeparationOncoming': // heavier "/" — carriageway/special-lane boundary (left)
      return el('line', {
        x1: x + 3,
        y1: TOP + LANE - 2,
        x2: x + SEP - 3,
        y2: TOP + 2,
        stroke: COLOR.line,
        'stroke-width': 5,
        'stroke-linecap': 'round',
      })
    case 'specialLaneSeparationDirection': // heavier "\" — carriageway/special-lane boundary (right)
      return el('line', {
        x1: x + 3,
        y1: TOP + 2,
        x2: x + SEP - 3,
        y2: TOP + LANE - 2,
        stroke: COLOR.line,
        'stroke-width': 5,
        'stroke-linecap': 'round',
      })
    default: // unknown symbol: empty box with a "?" so it is visibly unaccounted for
      return el(
        'g',
        {},
        box(x, COLOR.boxFill) +
          el(
            'text',
            { x: cx, y: cy + 5, 'text-anchor': 'middle', 'font-size': 16, fill: COLOR.line },
            '?',
          ),
      )
  }
}

export interface RenderLaneStatusOptions {
  /** Accessible label on the root <svg>. Default: locale-aware "Lane status diagram for {code}". */
  ariaLabel?: string
  /** `class` attribute on the root <svg>. */
  className?: string
  /** Append an SVG legend (distinct symbols, first-seen order) below the diagram. Default false. */
  legend?: boolean
  /** Locale for the legend labels and the default aria-label. Default 'en'. */
  locale?: LaneStatusLocale
  /** Per-symbol label overrides for the legend. */
  labels?: LaneStatusLabelOverrides
  /** Emit `xmlns` so the string is a valid standalone SVG document. Default true. */
  standalone?: boolean
}

const LABEL_FONT = 13
const LEGEND_ROW = LANE + 6
const LEGEND_LABEL_X = MARGIN + LANE + 8

/** Approximate rendered text width — there is no DOM to measure, so use an average glyph advance. */
function approxTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6
}

/**
 * Renders a lane-status string (`laneStatusCoded` or `extendedLaneStatusCoded`) as an SVG string.
 * Returns '' when the value decodes to no glyphs.
 */
export function renderLaneStatusSvg(code: string, options: RenderLaneStatusOptions = {}): string {
  const glyphs = decodeLaneStatus(code)
  if (glyphs.length === 0) return ''

  const { locale = 'en', legend = false, standalone = true, labels } = options

  const stripWidth =
    glyphs.reduce((sum, glyph) => sum + widthOf(glyph), 0) + GAP * (glyphs.length - 1) + MARGIN * 2
  const stripHeight = LANE + MARGIN * 2

  let x = MARGIN
  let body = ''
  for (const glyph of glyphs) {
    body += renderGlyph(glyph, x)
    x += widthOf(glyph) + GAP
  }

  let width = stripWidth
  let height = stripHeight

  if (legend) {
    const entries = getLaneStatusLegend(code, { locale, labels })
    const titleText = LANE_STATUS_LEGEND_TITLE[locale]
    const titleY = stripHeight + 8 + 12
    const rowsTop = stripHeight + 8 + 18

    let legendMarkup = el(
      'text',
      { x: MARGIN, y: titleY, 'font-size': LABEL_FONT, 'font-weight': 'bold', fill: COLOR.line },
      titleText,
    )

    let maxLabelWidth = approxTextWidth(titleText, LABEL_FONT)
    entries.forEach((entry, index) => {
      const rowTop = rowsTop + index * LEGEND_ROW
      const glyph = decodeLaneStatus(entry.char)[0]
      const glyphMarkup = el(
        'g',
        { transform: `translate(0, ${rowTop - TOP})` },
        renderGlyph(glyph, MARGIN),
      )
      const labelMarkup = el(
        'text',
        { x: LEGEND_LABEL_X, y: rowTop + LANE / 2 + 4, 'font-size': LABEL_FONT, fill: COLOR.line },
        entry.label,
      )
      legendMarkup += glyphMarkup + labelMarkup
      maxLabelWidth = Math.max(maxLabelWidth, approxTextWidth(entry.label, LABEL_FONT))
    })

    body += legendMarkup
    width = Math.max(stripWidth, LEGEND_LABEL_X + maxLabelWidth + MARGIN)
    height = rowsTop + entries.length * LEGEND_ROW + MARGIN
  }

  const ariaLabel = options.ariaLabel ?? LANE_STATUS_ARIA[locale](code)

  return el(
    'svg',
    {
      xmlns: standalone ? 'http://www.w3.org/2000/svg' : undefined,
      class: options.className,
      viewBox: `0 0 ${width} ${height}`,
      width,
      height,
      role: 'img',
      'aria-label': ariaLabel,
    },
    body,
  )
}
