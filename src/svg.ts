// Minimal string builders for SVG markup — the framework-agnostic replacement for JSX.

/** XML-escapes a string for safe use in element text or a double-quoted attribute value. */
export function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export type Attrs = Record<string, string | number | undefined>

/**
 * Builds an SVG element string. Numeric attribute values are emitted verbatim; string values are
 * XML-escaped. `undefined`/empty-string attributes are dropped. Omit `children` for a self-closing
 * element (e.g. <rect/>); pass a string (possibly empty) for a container (e.g. <g>…</g>).
 */
export function el(tag: string, attrs: Attrs, children?: string): string {
  const rendered = Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}="${typeof v === 'number' ? v : esc(String(v))}"`)
    .join(' ')
  const head = rendered ? `${tag} ${rendered}` : tag
  return children === undefined ? `<${head}/>` : `<${head}>${children}</${tag}>`
}
