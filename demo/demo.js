/* global LaneStatusViewer */
;(function () {
  const { renderLaneStatusSvg, getLaneStatusLegend, LANE_STATUS_LEGEND_TITLE } = LaneStatusViewer

  const PRESETS = [
    'wx',
    'sluu2oerx',
    'slu1o2xxrx',
    'ui1o2oxrx',
    'uww2x',
    'uuu2o',
    'sfF2gG',
    'p2PH',
    'sfFgGpPH',
    'GLx2xRG',
  ]

  // Official German StVO signs, from Wikimedia Commons, all public domain.
  const ATTRIB = [
    { code: 'f', zeichen: '237 Radweg', file: 'Zeichen 237 - Sonderweg Radfahrer, StVO 1992.svg', license: 'PD-VzKat, PD-GermanGov' },
    { code: 'F', zeichen: '254 Verbot für Radverkehr', file: 'Zeichen 254 - Verbot für Radfahrer, StVO 1992.svg', license: 'PD-VzKat, PD-GermanGov' },
    { code: 'g', zeichen: '239 Gehweg', file: 'Zeichen 239 - Sonderweg Fußgänger, StVO 1992.svg', license: 'PD-VzKat, PD-GermanGov' },
    { code: 'G', zeichen: '259 Verbot für Fußgänger', file: 'Zeichen 259 - Verbot für Fußgänger, StVO 1992.svg', license: 'PD-GermanGov' },
    { code: 'p', zeichen: '314 Parken', file: 'Zeichen 314 - Parken, StVO 2017.svg', license: 'PD-VzKat, PD-GermanGov' },
    { code: 'P', zeichen: '286 Eingeschränktes Haltverbot', file: 'Zeichen 286-50 - Eingeschränktes Halteverbot (ohne Richtungspfeil), StVO 1992.svg', license: 'PD-Vz historisch, PD-GermanGov' },
    { code: 'H', zeichen: '283 Absolutes Haltverbot', file: 'Zeichen 283 - Absolutes Haltverbot, StVO 2017.svg', license: 'PD-VzKat, PD-GermanGov' },
  ]

  const commonsUrl = (file) =>
    encodeURI('https://commons.wikimedia.org/wiki/File:' + file.replace(/ /g, '_'))

  const $ = (id) => document.getElementById(id)
  const input = $('code')
  const locale = $('locale')
  const plate = $('plate')
  const raw = $('raw')
  const legend = $('legend')
  const legendTitle = $('legendTitle')

  function syncUrl(code, loc) {
    const params = new URLSearchParams()
    if (code) params.set('code', code)
    if (loc !== 'en') params.set('locale', loc)
    const qs = params.toString()
    history.replaceState(null, '', qs ? '?' + qs : location.pathname)
  }

  function render() {
    const code = input.value.trim()
    const loc = locale.value
    legendTitle.textContent = LANE_STATUS_LEGEND_TITLE[loc] || 'Legend'

    if (!code) {
      plate.innerHTML = '<span class="empty">Enter a lane-status code above…</span>'
      raw.textContent = ''
      legend.innerHTML = ''
      syncUrl('', loc)
      return
    }

    plate.innerHTML = renderLaneStatusSvg(code, { locale: loc })
    raw.textContent = code
    legend.innerHTML = getLaneStatusLegend(code, { locale: loc })
      .map(
        (e) =>
          '<li>' +
          renderLaneStatusSvg(e.char, { locale: loc }) +
          '<span>' +
          e.label +
          '</span></li>',
      )
      .join('')
    syncUrl(code, loc)
  }

  // Preset chips
  $('chips').innerHTML = PRESETS.map(
    (p) => '<button class="chip" type="button" data-code="' + p + '">' + p + '</button>',
  ).join('')
  $('chips').addEventListener('click', (ev) => {
    const code = ev.target && ev.target.getAttribute && ev.target.getAttribute('data-code')
    if (code) {
      input.value = code
      render()
    }
  })

  // Attribution table
  $('attrib').innerHTML = ATTRIB.map(
    (a) =>
      '<tr><td><code>' +
      a.code +
      '</code></td><td>' +
      a.zeichen +
      '</td><td><a href="' +
      commonsUrl(a.file) +
      '" target="_blank" rel="noopener">' +
      a.file +
      '</a></td><td>' +
      a.license +
      '</td></tr>',
  ).join('')

  // Seed from URL parameters (?code=…&locale=…)
  const params = new URLSearchParams(location.search)
  input.value = params.get('code') || ''
  const loc = params.get('locale')
  if (loc === 'de' || loc === 'en') locale.value = loc
  if (!input.value) input.value = 'sluu2oerx'

  input.addEventListener('input', render)
  locale.addEventListener('change', render)
  render()
})()
