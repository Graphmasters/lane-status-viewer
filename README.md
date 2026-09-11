# lane-status-viewer

Framework-agnostic, zero-dependency renderer for **DATEX II MDM _Baustellen_ lane-status strings** —
`laneStatusCoded` and the extended `extendedLaneStatusCoded` — turning a compact code like
`sluu2oerx` into an SVG carriageway cross-section diagram.

> [!NOTE]
> **▶ Try the live demo: <https://graphmasters.github.io/lane-status-viewer/>**
>
> Paste a lane-status code like `sluu2oerx` and watch it render as a carriageway cross-section
> diagram.

The demo accepts a `?code=` URL parameter (and optional `?locale=de`), e.g.
[`?code=sluu2oerx`](https://graphmasters.github.io/lane-status-viewer/?code=sluu2oerx).

The [encoding & keys reference](https://graphmasters.github.io/lane-status-viewer/docs.html) lists every key.

## Install

```sh
npm install lane-status-viewer
```

## Usage

### ES module / bundler

```js
import { renderLaneStatusSvg } from 'lane-status-viewer'

document.querySelector('#lane').innerHTML = renderLaneStatusSvg('sluu2oerx', { legend: true })
```

### Browser via CDN (no build step)

```html
<script src="https://cdn.jsdelivr.net/npm/lane-status-viewer/dist/index.global.js"></script>
<script>
  document.body.innerHTML = LaneStatusViewer.renderLaneStatusSvg('uww2x')
</script>
```

### DOM element

```js
import { renderLaneStatusElement } from 'lane-status-viewer'

const svg = renderLaneStatusElement('GLx2xRG') // SVGSVGElement | null
if (svg) container.append(svg)
```

## API

| Export | Description |
|---|---|
| `renderLaneStatusSvg(code, options?) → string` | Primary renderer. Returns an SVG string, or `''` when the code decodes to no glyphs. |
| `renderLaneStatusElement(code, options?) → SVGSVGElement \| null` | Browser DOM helper (parses the string). |
| `decodeLaneStatus(code) → LaneStatusGlyph[]` | Decode a code into ordered glyphs. |
| `distinctLaneStatusGlyphs(glyphs) → LaneStatusGlyph[]` | Distinct symbols, first-seen order. |
| `getLaneStatusLegend(code, {locale?, labels?}) → LegendEntry[]` | Legend data (`{ symbol, char, label }`) for building your own legend. |
| `LANE_STATUS_LABELS` | Bundled EN/DE labels per symbol. |
| `LANE_STATUS_SIGNS` | The 7 embedded StVO sign data-URIs. |
| `SYMBOLS` | The recognised alphabet (char → symbol spec). |

### `RenderLaneStatusOptions`

| Option | Type | Default | Description |
|---|---|---|---|
| `ariaLabel` | `string` | locale-aware default | `aria-label` on the root `<svg>`. |
| `className` | `string` | – | `class` attribute on the root `<svg>`. |
| `legend` | `boolean` | `false` | Append an SVG legend (distinct symbols) below the diagram. |
| `locale` | `'en' \| 'de'` | `'en'` | Locale for the legend + default aria-label. |
| `labels` | `Partial<Record<LaneStatusSymbol, string>>` | – | Per-symbol label overrides. |
| `standalone` | `boolean` | `true` | Emit `xmlns` so the string is a valid standalone `.svg`. |

One renderer handles both `laneStatusCoded` and `extendedLaneStatusCoded` — they share one alphabet.
Unrecognised characters render as a boxed `?` rather than being dropped. See the
[encoding & keys page](https://graphmasters.github.io/lane-status-viewer/docs.html) for every key.

## References & attribution

- **`laneStatusCoded`** — Mobilithek, “Datenmodell für Baustellen Version 04-00-00 – 05|2017”
  (<https://mobilithek.info/help/download>).
- **`extendedLaneStatusCoded`** — no public documentation; in use in Mobilithek publications by
  several German federal states.
- Sign icons — official German StVO signs from Wikimedia Commons, all public domain. Full per-sign
  table and licenses in [ATTRIBUTION.md](ATTRIBUTION.md).
- With thanks to Martin Phillip Ullmann of the [LBV.SH](https://www.lbv-sh.de/) for providing the
  documentation of the extended encoding.

## Development

```sh
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest
npm run build       # tsup → dist/ (esm, cjs, iife, .d.ts)
npm run demo        # build + assemble _site/ + serve locally
```

The GitHub Pages demo is the static `demo/` folder plus the built IIFE, assembled by
`scripts/assemble-demo.mjs` and deployed by `.github/workflows/pages.yml`.

MIT © Graphmasters.
