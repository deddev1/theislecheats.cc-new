/**
 * Prepare dist/ for `wrangler deploy` (Workers static assets).
 * Keeps 301 rules from _redirects but drops Pages-only /* → 404.html (Workers uses wrangler not_found_handling).
 */
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')

const redirectsPath = join(dist, '_redirects')
if (existsSync(redirectsPath)) {
  const lines = readFileSync(redirectsPath, 'utf8').split(/\r?\n/)
  const kept = lines.filter((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return true
    return !/\s404\s*$/i.test(trimmed) && !/\/404\.html/i.test(trimmed)
  })
  writeFileSync(redirectsPath, `${kept.join('\n').replace(/\n+$/, '')}\n`)
}

const sitemapPath = join(dist, 'sitemap.xml')
if (!existsSync(sitemapPath)) {
  throw new Error('dist/sitemap.xml missing — run generate-sitemaps.mjs')
}
const xml = readFileSync(sitemapPath, 'utf8')
if (/<html|<!DOCTYPE/i.test(xml)) {
  throw new Error('sitemap.xml is HTML, not XML')
}

const robotsPath = join(dist, 'robots.txt')
if (!existsSync(robotsPath)) {
  throw new Error('dist/robots.txt missing')
}
const robots = readFileSync(robotsPath, 'utf8')
if (!robots.includes('sitemap-index.xml')) {
  throw new Error('robots.txt must reference sitemap-index.xml')
}

const childMaps = [
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-forums.xml',
  'sitemap-forum-topics.xml',
]
for (const name of childMaps) {
  const path = join(dist, name)
  if (!existsSync(path)) throw new Error(`dist/${name} missing`)
}

const indexPath = join(dist, 'sitemap-index.xml')
if (!existsSync(indexPath)) throw new Error('dist/sitemap-index.xml missing')
const indexXml = readFileSync(indexPath, 'utf8')
const childCount = (indexXml.match(/<sitemap>/g) || []).length
if (childCount !== 4) {
  throw new Error(`sitemap-index.xml must list 4 sitemaps, found ${childCount}`)
}
if (indexXml.includes('sitemap-images.xml')) {
  throw new Error('sitemap-index.xml must not reference removed sitemap-images.xml')
}

console.log('Workers deploy prep OK')
