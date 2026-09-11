/* global LaneStatusViewer */
;(function () {
  const { renderLaneStatusSvg, decodeLaneStatus, LANE_STATUS_LABELS } = LaneStatusViewer

  const STANDARD = ['s', 'l', 'r', 'o', 'e', 'u', 'i', 'w', '1', '2', 'x']
  const EXTENSION = ['f', 'F', 'g', 'G', 'p', 'P', 'H', 'L', 'R']

  const NOTES = {
    f: 'StVO Zeichen 237 (Radweg)',
    F: 'StVO Zeichen 254 (Verbot für Radverkehr)',
    g: 'StVO Zeichen 239 (Gehweg)',
    G: 'StVO Zeichen 259 (Verbot für Fußgänger)',
    p: 'StVO Zeichen 314 (Parken)',
    P: 'StVO Zeichen 286 (eingeschränktes Haltverbot)',
    H: 'StVO Zeichen 283 (absolutes Haltverbot)',
    L: 'Observed only — uppercase counterpart of l',
    R: 'Observed only — uppercase counterpart of r',
  }

  function symbolOf(char) {
    const glyphs = decodeLaneStatus(char)
    return glyphs.length ? glyphs[0].symbol : 'unknown'
  }

  function rowHtml(char, displayChar, note) {
    const symbol = symbolOf(char)
    return (
      '<tr><td class="char">' +
      displayChar +
      '</td><td class="glyph">' +
      renderLaneStatusSvg(char) +
      '</td><td>' +
      LANE_STATUS_LABELS.en[symbol] +
      '</td><td class="de">' +
      LANE_STATUS_LABELS.de[symbol] +
      '</td><td class="notes">' +
      (note || '') +
      '</td></tr>'
    )
  }

  function fill(tableId, chars) {
    const tbody = document.querySelector('#' + tableId + ' tbody')
    tbody.innerHTML = chars.map((c) => rowHtml(c, c, NOTES[c])).join('')
  }

  fill('standard', STANDARD)
  fill('extension', EXTENSION)

  // Unknown fallback: any character outside the alphabet (illustrated with "?").
  document.querySelector('#unknown tbody').innerHTML = rowHtml(
    '?',
    'other',
    'Any character not listed above',
  )

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

  document.querySelector('#attrib tbody').innerHTML = ATTRIB.map(
    (a) =>
      '<tr><td class="char">' +
      a.code +
      '</td><td>' +
      a.zeichen +
      '</td><td><a href="' +
      commonsUrl(a.file) +
      '" target="_blank" rel="noopener">' +
      a.file +
      '</a></td><td>' +
      a.license +
      '</td></tr>',
  ).join('')
})()
