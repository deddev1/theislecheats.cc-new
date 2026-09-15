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

console.log('Workers deploy prep OK')
