import { describe, expect, it } from 'vitest'
import { decodeLaneStatus, distinctLaneStatusGlyphs } from '../src/laneStatusCoded'

describe('decodeLaneStatus', () => {
  it('decodes the reference value "sluu2oerx" into the documented symbol sequence', () => {
    const glyphs = decodeLaneStatus('sluu2oerx')

    expect(glyphs.map((g) => g.symbol)).toEqual([
      'shoulder', // s
      'shoulderSeparationOncoming', // l
      'openOncoming', // u
      'openOncoming', // u
      'boundaryDouble', // 2
      'openDirection', // o
      'narrowDirection', // e
      'shoulderSeparationDirection', // r
      'closed', // x
    ])
    expect(glyphs.map((g) => g.kind)).toEqual([
      'lane',
      'separator',
      'lane',
      'lane',
      'separator',
      'lane',
      'lane',
      'separator',
      'lane',
    ])
  })

  it('preserves the raw character on each glyph', () => {
    expect(decodeLaneStatus('wx').map((g) => g.char)).toEqual(['w', 'x'])
  })

  it('returns an empty list for empty, null or undefined input', () => {
    expect(decodeLaneStatus('')).toEqual([])
    expect(decodeLaneStatus(undefined)).toEqual([])
    expect(decodeLaneStatus(null)).toEqual([])
  })

  it('ignores surrounding and embedded whitespace', () => {
    expect(decodeLaneStatus('  o x ').map((g) => g.symbol)).toEqual(['openDirection', 'closed'])
  })

  it('keeps unrecognised characters as unknown glyphs rather than dropping them', () => {
    const glyphs = decodeLaneStatus('oZx')
    expect(glyphs.map((g) => g.symbol)).toEqual(['openDirection', 'unknown', 'closed'])
    expect(glyphs[1].char).toBe('Z')
  })

  it('decodes the richer extended example "uww2x"', () => {
    expect(decodeLaneStatus('uww2x').map((g) => g.symbol)).toEqual([
      'openOncoming', // u
      'reversible', // w
      'reversible', // w
      'boundaryDouble', // 2
      'closed', // x
    ])
  })

  it('decodes the extended sign alphabet (bike/foot paths, parking, no-stopping), case-sensitively', () => {
    const glyphs = decodeLaneStatus('fFgGpPH')
    expect(glyphs.map((g) => g.symbol)).toEqual([
      'cyclePath', // f
      'cyclePathClosed', // F
      'footPath', // g
      'footPathClosed', // G
      'parking', // p
      'noStoppingRestricted', // P
      'noStoppingAbsolute', // H
    ])
    expect(glyphs.every((g) => g.kind === 'lane')).toBe(true)
  })

  it('decodes L/R as special-lane separators (uppercase counterpart of l/r)', () => {
    const glyphs = decodeLaneStatus('GLx2xRG')
    expect(glyphs.map((g) => g.symbol)).toEqual([
      'footPathClosed', // G
      'specialLaneSeparationOncoming', // L
      'closed', // x
      'boundaryDouble', // 2
      'closed', // x
      'specialLaneSeparationDirection', // R
      'footPathClosed', // G
    ])
    expect(
      glyphs.filter((g) => g.char === 'L' || g.char === 'R').every((g) => g.kind === 'separator'),
    ).toBe(true)
  })
})

describe('distinctLaneStatusGlyphs', () => {
  it('keeps one glyph per symbol in first-seen order', () => {
    const distinct = distinctLaneStatusGlyphs(decodeLaneStatus('sluu2oerx'))
    expect(distinct.map((g) => g.symbol)).toEqual([
      'shoulder',
      'shoulderSeparationOncoming',
      'openOncoming',
      'boundaryDouble',
      'openDirection',
      'narrowDirection',
      'shoulderSeparationDirection',
      'closed',
    ])
  })
})
