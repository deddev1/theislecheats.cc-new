/**
 * Dry-run sitemap validation (no network). Mimics what GSC needs before submit.
 * Usage: node scripts/dry-sitemap.mjs
 * Reads dist/ after build, else public/.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')
const publicDir = join(root, 'public')
const baseDir = existsSync(join(dist, 'sitemap.xml')) ? dist : publicDir

const SITE = (process.env.SITE_URL || 'https://theislecheats.cc').replace(/\/$/, '')
const failures = []

function fail(message) {
  failures.push(message)
}

const SITEMAP_FILES = [
  'sitemap.xml',
  'google-sitemap.xml',
  'sitemap-index.xml',
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-forums.xml',
  'sitemap-forum-topics.xml',
]

const LASTMOD_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}Z)?$/

function readXml(name) {
  const path = join(baseDir, name)
  if (!existsSync(path)) {
    fail(`Missing ${name} in ${baseDir}`)
    return ''
  }
  return readFileSync(path, 'utf8')
}

function assertXmlFile(name, xml, { allowIndex = false } = {}) {
  if (!xml) return
  if (!xml.trimStart().startsWith('<?xml')) fail(`${name}: must start with <?xml`)
  if (/<!DOCTYPE\s+html|<html[\s>]/i.test(xml)) {
    fail(`${name}: HTML detected (browser/GSC "charAt" errors usually mean HTML was served as XML)`)
  }
  if (/\bundefined\b/.test(xml)) fail(`${name}: contains literal "undefined"`)
  if (allowIndex) {
    if (!xml.includes('<sitemapindex')) fail(`${name}: must be a sitemap index`)
    if (xml.includes('<urlset')) fail(`${name}: must not be a urlset`)
  } else if (name !== 'robots.txt') {
    if (!xml.includes('<urlset')) fail(`${name}: must be a urlset`)
    if (xml.includes('<sitemapindex')) fail(`${name}: must not be a sitemap index`)
    if (/<xhtml:|image:image|changefreq|priority/i.test(xml)) {
      fail(`${name}: must be minimal (loc + lastmod only) for GSC`)
    }
  }
}

function locsFrom(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

function lastmodsFrom(xml) {
  return [...xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((m) => m[1])
}

function main() {
  const robotsPath = join(baseDir, 'robots.txt')
  if (!existsSync(robotsPath)) fail('robots.txt missing')
  else {
    const robots = readFileSync(robotsPath, 'utf8')
    if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) {
      fail(`robots.txt must include: Sitemap: ${SITE}/sitemap.xml`)
    }
  }

  const bodies = {}
  for (const name of SITEMAP_FILES) {
    const xml = readXml(name)
    bodies[name] = xml
    assertXmlFile(name, xml, { allowIndex: name === 'sitemap-index.xml' })
    for (const loc of locsFrom(xml)) {
      if (loc !== SITE && !loc.startsWith(`${SITE}/`)) {
        fail(`${name}: loc outside apex property: ${loc}`)
      }
    }
    for (const lastmod of lastmodsFrom(xml)) {
      if (!lastmod || !LASTMOD_RE.test(lastmod)) {
        fail(`${name}: invalid or empty lastmod: ${lastmod || '(empty)'}`)
      }
    }
  }

  const mainLocs = locsFrom(bodies['sitemap.xml'] || '')
  const googleLocs = locsFrom(bodies['google-sitemap.xml'] || '')
  if (mainLocs.length && googleLocs.join('|') !== mainLocs.join('|')) {
    fail('google-sitemap.xml must mirror sitemap.xml URLs')
  }

  const childNames = [
    'sitemap-pages.xml',
    'sitemap-products.xml',
    'sitemap-forums.xml',
    'sitemap-forum-topics.xml',
  ]
  const indexLocs = locsFrom(bodies['sitemap-index.xml'] || '')
  for (const child of childNames) {
    const expected = `${SITE}/${child}`
    if (!indexLocs.includes(expected)) {
      fail(`sitemap-index.xml missing child: ${expected}`)
    }
  }
  if (indexLocs.length !== 4) fail(`sitemap-index.xml must list exactly 4 sitemaps, found ${indexLocs.length}`)

  const union = new Set()
  for (const child of childNames) {
    for (const loc of locsFrom(bodies[child] || '')) {
      if (union.has(loc)) fail(`Duplicate URL across children: ${loc}`)
      union.add(loc)
    }
  }
  if (mainLocs.length && union.size !== mainLocs.length) {
    fail(`sitemap.xml URL count (${mainLocs.length}) must match union of children (${union.size})`)
  }
  for (const loc of mainLocs) {
    if (!union.has(loc)) fail(`sitemap.xml lists URL not in any child: ${loc}`)
  }

  if (failures.length) {
    console.error(`Dry sitemap failed (${baseDir}):\n- ${failures.join('\n- ')}`)
    process.exit(1)
  }
  console.log(
    `Dry sitemap OK: ${mainLocs.length} URLs, index + 4 children (${baseDir}) — submit ${SITE}/sitemap.xml in GSC`,
  )
}

main()
