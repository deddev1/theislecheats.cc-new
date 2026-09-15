/**
 * Four child sitemaps + sitemap-index.xml, plus sitemap.xml (same 11 URLs).
 * Urlset with loc, lastmod, and priority (no image/hreflang extensions).
 */
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const dataDir = join(root, 'src', 'data')
const SITE = (process.env.SITE_URL || 'https://www.theislecheats.cc').replace(/\/$/, '')
/** W3C datetime (UTC) — Google uses lastmod to decide when to re-fetch. */
function lastmodNow() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
}

/** Each URL must appear in exactly one child file (required for sitemap-index in GSC). */
const CHILD_SITEMAPS = [
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-forums.xml',
  'sitemap-forum-topics.xml',
]

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function siteUrl(path) {
  return !path || path === '/' ? `${SITE}/` : `${SITE}${path.startsWith('/') ? path : `/${path}`}`
}

function loadGames() {
  const src = readFileSync(join(dataDir, 'games.ts'), 'utf8')
  return [...src.matchAll(/\{\s*slug:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^'"]+)['"]/g)].map(
    (match) => ({ slug: match[1], name: match[2] }),
  )
}

function loadForums() {
  const src = readFileSync(join(dataDir, 'blogs.ts'), 'utf8')
  const pattern =
    /slug:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"],[\s\S]*?date:\s*['"](\d{4}-\d{2}-\d{2})['"]/g
  return [...src.matchAll(pattern)].map((match) => ({
    slug: match[1],
    title: match[2],
    date: match[3],
  }))
}

/** Sitemap priority 0.0–1.0 (Google may ignore; still useful for other crawlers). */
function priorityFor(entry) {
  if (entry.path === '/') return '1.0'
  if (entry.group === 'products') return '0.9'
  if (entry.group === 'forum-hub') return '0.8'
  if (entry.group === 'forum-topics') return '0.7'
  if (entry.path === '/sitemap') return '0.4'
  if (entry.path === '/privacy' || entry.path === '/terms') return '0.3'
  return '0.6'
}

function buildEntries(games, forums) {
  const now = lastmodNow()
  return [
    { path: '/', lastmod: now, group: 'pages' },
    ...games.map((game) => ({
      path: `/${game.slug}-cheats`,
      lastmod: now,
      group: 'products',
    })),
    { path: '/forums', lastmod: now, group: 'forum-hub' },
    ...forums.map((forum) => ({
      path: `/forums/${forum.slug}`,
      lastmod: `${forum.date}T00:00:00Z`,
      group: 'forum-topics',
    })),
    { path: '/reviews', lastmod: now, group: 'pages' },
    { path: '/faq', lastmod: now, group: 'pages' },
    { path: '/support', lastmod: now, group: 'pages' },
    { path: '/privacy', lastmod: now, group: 'pages' },
    { path: '/terms', lastmod: now, group: 'pages' },
    { path: '/sitemap', lastmod: now, group: 'pages' },
  ]
}

function urlEntry(entry) {
  const url = siteUrl(entry.path)
  const lastmod = entry.lastmod || lastmodNow()
  const priority = priorityFor(entry)
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <priority>${priority}</priority>
  </url>`
}

function urlset(entries) {
  const body = entries.map((entry) => urlEntry(entry)).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

function sitemapIndex(files) {
  const entries = files
    .map(
      (name) => `  <sitemap>
    <loc>${escapeXml(siteUrl(`/${name}`))}</loc>
    <lastmod>${lastmodNow()}</lastmod>
  </sitemap>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>
`
}

function validate(games, forums, entries, mirror) {
  const errors = []
  if (games.length !== 1 || games[0]?.slug !== 'isle') errors.push('Expected one isle product')
  if (forums.length !== 5) errors.push(`Expected 5 forum threads, found ${forums.length}`)
  if (forums.some((forum) => ['instructions', 'how-to-load'].includes(forum.slug))) {
    errors.push('Retired forum slug remains indexed')
  }

  const required = entries.map((entry) => siteUrl(entry.path))
  for (const url of required) {
    if (!mirror.includes(`<loc>${escapeXml(url)}</loc>`) && !mirror.includes(`<loc>${url}</loc>`)) {
      errors.push(`Missing URL in sitemap.xml: ${url}`)
    }
  }
  if (mirror.includes('<sitemapindex')) errors.push('sitemap.xml must be a single urlset, not an index')
  if ((mirror.match(/<url>/g) || []).length !== required.length) {
    errors.push(`Expected ${required.length} URLs in sitemap.xml`)
  }
  if (/<xhtml:|image:image|changefreq/i.test(mirror)) {
    errors.push('sitemap.xml must not use image/hreflang/changefreq extensions')
  }
  const urlCount = (mirror.match(/<url>/g) || []).length
  const priorityCount = (mirror.match(/<priority>/g) || []).length
  if (priorityCount !== urlCount) {
    errors.push(`Each <url> must have <priority> (found ${priorityCount} priorities, ${urlCount} URLs)`)
  }

  const pages = entries.filter((entry) => entry.group === 'pages')
  const products = entries.filter((entry) => entry.group === 'products')
  const forumHub = entries.filter((entry) => entry.group === 'forum-hub')
  const forumTopics = entries.filter((entry) => entry.group === 'forum-topics')
  if (pages.length !== 7) errors.push(`Expected 7 page URLs, found ${pages.length}`)
  if (products.length !== 1) errors.push(`Expected 1 product URL, found ${products.length}`)
  if (forumHub.length !== 1) errors.push(`Expected 1 forum hub URL, found ${forumHub.length}`)
  if (forumTopics.length !== 5) errors.push(`Expected 5 forum topic URLs, found ${forumTopics.length}`)

  if (errors.length) throw new Error(`Sitemap validation failed:\n- ${errors.join('\n- ')}`)
}

function assertUniqueChildLocs(childFiles) {
  const seen = new Map()
  for (const [name, xml] of childFiles) {
    for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const loc = match[1]
      if (seen.has(loc)) {
        throw new Error(`Duplicate sitemap URL ${loc} in ${seen.get(loc)} and ${name}`)
      }
      seen.set(loc, name)
    }
  }
}

function main() {
  const games = loadGames()
  const forums = loadForums()
  const entries = buildEntries(games, forums)
  const mirror = urlset(entries)

  validate(games, forums, entries, mirror)

  const pages = entries.filter((entry) => entry.group === 'pages')
  const products = entries.filter((entry) => entry.group === 'products')
  const forumHub = entries.filter((entry) => entry.group === 'forum-hub')
  const forumTopics = entries.filter((entry) => entry.group === 'forum-topics')

  const childBodies = [
    ['sitemap-pages.xml', urlset(pages)],
    ['sitemap-products.xml', urlset(products)],
    ['sitemap-forums.xml', urlset(forumHub)],
    ['sitemap-forum-topics.xml', urlset(forumTopics)],
  ]
  assertUniqueChildLocs(childBodies)
  for (const [name, xml] of childBodies) {
    writeFileSync(join(publicDir, name), xml)
  }
  writeFileSync(join(publicDir, 'sitemap-index.xml'), sitemapIndex(CHILD_SITEMAPS))
  writeFileSync(join(publicDir, 'sitemap.xml'), mirror)
  writeFileSync(join(publicDir, 'google-sitemap.xml'), mirror)

  const bareSite = SITE.replace('https://www.', 'https://')
  const sitemapLines = [SITE, bareSite]
    .filter((value, index, all) => all.indexOf(value) === index)
    .map((origin) => `Sitemap: ${origin}/sitemap.xml`)
    .join('\n')
  writeFileSync(
    join(publicDir, 'robots.txt'),
    `User-agent: *
Allow: /

${sitemapLines}
`,
  )

  for (const name of [
    'sitemap-blogs.xml',
    'sitemap-regions.xml',
    'sitemap-images.xml',
    'sitemap-0.xml',
  ]) {
    const path = join(publicDir, name)
    if (existsSync(path)) unlinkSync(path)
  }

  console.log(
    `Sitemap OK: loc + lastmod + priority — 4 child maps + index + mirror (${entries.length} URLs at ${siteUrl('/sitemap.xml')})`,
  )
}

main()
