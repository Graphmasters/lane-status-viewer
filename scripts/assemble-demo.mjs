// Assembles the static GitHub Pages site into _site/: the demo/docs pages plus the built IIFE
// bundle (renamed to lane-status-viewer.global.js, which the pages load via <script>).
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const site = join(root, '_site')
const bundle = join(root, 'dist', 'index.global.js')

if (!existsSync(bundle)) {
  console.error('dist/index.global.js is missing — run `npm run build` first.')
  process.exit(1)
}

mkdirSync(site, { recursive: true })
for (const file of readdirSync(join(root, 'demo'))) {
  copyFileSync(join(root, 'demo', file), join(site, file))
}
copyFileSync(bundle, join(site, 'lane-status-viewer.global.js'))

console.log('Assembled _site/ (demo pages + lane-status-viewer.global.js)')
