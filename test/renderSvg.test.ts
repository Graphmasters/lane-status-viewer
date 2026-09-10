import { describe, expect, it } from 'vitest'
import { renderLaneStatusSvg } from '../src/renderSvg'
import { getLaneStatusLegend } from '../src/legend'

describe('renderLaneStatusSvg', () => {
  it('returns an empty string when the value decodes to no glyphs', () => {
    expect(renderLaneStatusSvg('')).toBe('')
    expect(renderLaneStatusSvg('   ')).toBe('')
  })

  it('emits a valid standalone <svg> root by default', () => {
    const svg = renderLaneStatusSvg('o')
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"')
    expect(svg).toContain('role="img"')
    expect(svg).toContain('aria-label="Lane status diagram for o"')
  })

  it('omits xmlns when standalone is false', () => {
    expect(renderLaneStatusSvg('o', { standalone: false })).not.toContain('xmlns')
  })

  it('draws the hard shoulder as a yellow box', () => {
    expect(renderLaneStatusSvg('s')).toContain('fill="#f5ef8a"')
  })

  it('draws a closed lane as a red cross (two lines)', () => {
    const svg = renderLaneStatusSvg('x')
    expect(svg).toContain('stroke="#dd2007"')
    expect(svg.match(/<line/g)?.length).toBe(2)
  })

  it('draws open lanes green with an arrow head, narrowed lanes blue', () => {
    expect(renderLaneStatusSvg('o')).toContain('#2e9e44')
    expect(renderLaneStatusSvg('o')).toContain('<polygon')
    expect(renderLaneStatusSvg('e')).toContain('#2f6fd0')
  })

  it('draws the reversible lane with two arrow heads', () => {
    expect(renderLaneStatusSvg('w').match(/<polygon/g)?.length).toBe(2)
  })

  it('renders sign codes as an embedded official StVO sign image', () => {
    const svg = renderLaneStatusSvg('f')
    expect(svg).toContain('<image')
    expect(svg).toContain('data:image/svg+xml;base64')
  })

  it('renders unknown characters as a boxed question mark', () => {
    expect(renderLaneStatusSvg('Z')).toContain('>?<')
  })

  it('uses a heavier stroke for L/R than l/r separators', () => {
    expect(renderLaneStatusSvg('L')).toContain('stroke-width="5"')
    expect(renderLaneStatusSvg('l')).toContain('stroke-width="3"')
    expect(renderLaneStatusSvg('l')).not.toContain('stroke-width="5"')
  })

  it('sizes the viewBox to the glyph geometry (30px lanes, 14px separators, 2px gaps/margins)', () => {
    // "sluu2oerx" = 6 lanes (30) + 3 separators (14) = 222, +2*8 gaps (16), +2*2 margin (4) = 242
    expect(renderLaneStatusSvg('sluu2oerx')).toContain('viewBox="0 0 242 34"')
  })

  it('appends a legend when requested, honouring locale and overrides', () => {
    const en = renderLaneStatusSvg('x', { legend: true })
    expect(en).toContain('Legend')
    expect(en).toContain('Lane closed')
    expect(en).toContain('<text')

    const de = renderLaneStatusSvg('x', { legend: true, locale: 'de' })
    expect(de).toContain('Legende')
    expect(de).toContain('Fahrstreifen gesperrt')

    const custom = renderLaneStatusSvg('x', { legend: true, labels: { closed: 'BLOCKED' } })
    expect(custom).toContain('BLOCKED')
  })

  it('escapes option-derived text', () => {
    expect(renderLaneStatusSvg('o', { ariaLabel: 'a & b <x>' })).toContain(
      'aria-label="a &amp; b &lt;x&gt;"',
    )
  })
})

describe('getLaneStatusLegend', () => {
  it('returns distinct symbols with resolved labels in first-seen order', () => {
    expect(getLaneStatusLegend('xx2f')).toEqual([
      { symbol: 'closed', char: 'x', label: 'Lane closed' },
      { symbol: 'boundaryDouble', char: '2', label: 'Central reservation' },
      { symbol: 'cyclePath', char: 'f', label: 'Cycle path' },
    ])
  })
})
