/**
 * Prepare dist/ for `wrangler deploy` (Workers static assets).
 * Pages-style _redirects (especially /* → 404.html) are not used on Workers.
 */
import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')

const redirectsPath = join(dist, '_redirects')
if (existsSync(redirectsPath)) {
  unlinkSync(redirectsPath)
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

console.log('Workers deploy prep OK')
