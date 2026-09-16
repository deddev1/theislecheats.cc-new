/**
 * Prepare dist/ for `wrangler deploy` (Workers static assets).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')

const SITEMAP_ORIGIN = (process.env.SITEMAP_ORIGIN || 'https://theislecheats.cc')
  .replace(/\/$/, '')
  .replace('https://www.', 'https://')
const SITEMAP_ORIGIN_WWW = SITEMAP_ORIGIN.replace('https://', 'https://www.')

function workersRedirectLine(raw) {
  const trimmed = raw.trim()
  if (!trimmed || trimmed.startsWith('#')) return null
  if (/\s404\s*$/i.test(trimmed) || /\/404\.html/i.test(trimmed)) return null
  if (/https?:\/\//i.test(trimmed)) return null

  const match = trimmed.match(/^(\S+)\s+(\S+)\s+(\d{3})$/)
  if (!match) {
    throw new Error(`Invalid _redirects line (Workers): ${trimmed}`)
  }
  const [, from, to, status] = match
  if (!from.startsWith('/')) {
    throw new Error(`_redirects source must be relative: ${from}`)
  }
  const dest = to.split('#')[0]
  if (!dest.startsWith('/') || /https?:\/\//i.test(dest)) {
    throw new Error(`_redirects destination must be relative: ${to}`)
  }
  return `${from} ${dest} ${status}`
}

const redirectsPath = join(dist, '_redirects')
if (existsSync(redirectsPath)) {
  const lines = readFileSync(redirectsPath, 'utf8').split(/\r?\n/)
  const kept = lines.map(workersRedirectLine).filter(Boolean)
  if (!kept.length) throw new Error('dist/_redirects has no Workers-compatible redirect rules')
  writeFileSync(redirectsPath, `${kept.join('\n')}\n`)
}

const requiredSitemaps = [
  'sitemap.xml',
  'sitemap-www.xml',
  'google-sitemap.xml',
  'sitemap-index.xml',
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-forums.xml',
  'sitemap-forum-topics.xml',
]

for (const name of requiredSitemaps) {
  const path = join(dist, name)
  if (!existsSync(path)) throw new Error(`dist/${name} missing — run generate-sitemaps`)
  const xml = readFileSync(path, 'utf8')
  if (/<html|<!DOCTYPE/i.test(xml)) throw new Error(`${name} is HTML, not XML`)
  if (!xml.trimStart().startsWith('<?xml')) throw new Error(`${name} must start with <?xml`)
}

const mainXml = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
if (mainXml.includes('<sitemapindex')) {
  throw new Error('sitemap.xml must be a urlset (submit this file in GSC)')
}
if (!mainXml.includes(`<loc>${SITEMAP_ORIGIN}/</loc>`)) {
  throw new Error(`sitemap.xml must use ${SITEMAP_ORIGIN} in <loc>`)
}

const wwwXml = readFileSync(join(dist, 'sitemap-www.xml'), 'utf8')
if (!wwwXml.includes(`<loc>${SITEMAP_ORIGIN_WWW}/</loc>`)) {
  throw new Error(`sitemap-www.xml must use ${SITEMAP_ORIGIN_WWW} in <loc>`)
}

writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITEMAP_ORIGIN}/sitemap.xml
Sitemap: ${SITEMAP_ORIGIN_WWW}/sitemap-www.xml
`,
)

console.log('Workers deploy prep OK (static sitemaps in dist/)')
