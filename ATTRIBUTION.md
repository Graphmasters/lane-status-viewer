# Attribution & references

## Traffic-sign icons

The extended sign codes render **official German StVO traffic signs** taken from Wikimedia Commons.
Every file is in the **public domain** (German traffic-sign catalogue / official-work templates), so
no attribution is legally required — the sources are listed here for transparency. The SVGs are
embedded as data-URIs in [`src/laneStatusSigns.ts`](src/laneStatusSigns.ts).

| Code | Symbol | StVO Zeichen | Wikimedia Commons file | License |
|------|--------|--------------|------------------------|---------|
| `f` | cyclePath | 237 Radweg | [Zeichen 237 - Sonderweg Radfahrer, StVO 1992.svg](https://commons.wikimedia.org/wiki/File:Zeichen_237_-_Sonderweg_Radfahrer,_StVO_1992.svg) | PD-VzKat, PD-GermanGov |
| `F` | cyclePathClosed | 254 Verbot für Radverkehr | [Zeichen 254 - Verbot für Radfahrer, StVO 1992.svg](https://commons.wikimedia.org/wiki/File:Zeichen_254_-_Verbot_f%C3%BCr_Radfahrer,_StVO_1992.svg) | PD-VzKat, PD-GermanGov |
| `g` | footPath | 239 Gehweg | [Zeichen 239 - Sonderweg Fußgänger, StVO 1992.svg](https://commons.wikimedia.org/wiki/File:Zeichen_239_-_Sonderweg_Fu%C3%9Fg%C3%A4nger,_StVO_1992.svg) | PD-VzKat, PD-GermanGov |
| `G` | footPathClosed | 259 Verbot für Fußgänger | [Zeichen 259 - Verbot für Fußgänger, StVO 1992.svg](https://commons.wikimedia.org/wiki/File:Zeichen_259_-_Verbot_f%C3%BCr_Fu%C3%9Fg%C3%A4nger,_StVO_1992.svg) | PD-GermanGov |
| `p` | parking | 314 Parken | [Zeichen 314 - Parken, StVO 2017.svg](https://commons.wikimedia.org/wiki/File:Zeichen_314_-_Parken,_StVO_2017.svg) | PD-VzKat, PD-GermanGov |
| `P` | noStoppingRestricted | 286 Eingeschränktes Haltverbot | [Zeichen 286-50 - Eingeschränktes Halteverbot (ohne Richtungspfeil), StVO 1992.svg](https://commons.wikimedia.org/wiki/File:Zeichen_286-50_-_Eingeschr%C3%A4nktes_Halteverbot_(ohne_Richtungspfeil),_StVO_1992.svg) | PD-Vz historisch, PD-GermanGov |
| `H` | noStoppingAbsolute | 283 Absolutes Haltverbot | [Zeichen 283 - Absolutes Haltverbot, StVO 2017.svg](https://commons.wikimedia.org/wiki/File:Zeichen_283_-_Absolutes_Haltverbot,_StVO_2017.svg) | PD-VzKat, PD-GermanGov |

Overview of German traffic signs: <https://wiki.openstreetmap.org/wiki/DE:Verkehrszeichen_in_Deutschland>.

## Data-model references

- **`laneStatusCoded`** — Mobilithek, *“Datenmodell für Baustellen Version 04-00-00 – 05|2017”*.
  Available from <https://mobilithek.info/help/download>.
- **`extendedLaneStatusCoded`** — there is **no public documentation** for this field. It is in use in
  Mobilithek publications by several German federal states; the alphabet supported here (the sign
  codes and the `L`/`R` separators) reflects what is observed in those feeds.

## Renderer

The rendering code is © 2026 Graphmasters, released under the MIT license (see [LICENSE](LICENSE)).
