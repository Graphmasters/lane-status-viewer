import { renderLaneStatusSvg, RenderLaneStatusOptions } from './renderSvg'

/**
 * Renders a lane-status string to a live `SVGSVGElement`, ready to append to the DOM. Returns null
 * when the value decodes to no glyphs. Requires a browser DOM — throws otherwise (use
 * {@link renderLaneStatusSvg} for a string in Node/SSR).
 */
export function renderLaneStatusElement(
  code: string,
  options?: RenderLaneStatusOptions,
): SVGSVGElement | null {
  if (typeof document === 'undefined' || typeof DOMParser === 'undefined') {
    throw new Error('renderLaneStatusElement requires a DOM environment; use renderLaneStatusSvg instead')
  }
  const markup = renderLaneStatusSvg(code, options)
  if (!markup) return null
  const parsed = new DOMParser().parseFromString(markup, 'image/svg+xml')
  return document.importNode(parsed.documentElement, true) as unknown as SVGSVGElement
}
