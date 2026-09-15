/**
 * Four child sitemaps + sitemap-index.xml, with sitemap.xml as a full mirror urlset.
 * Support is indexed. Images live in sitemap-images.xml and on mirror entries.
 */
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const dataDir = join(root, 'src', 'data')
const SITE = (process.env.SITE_URL || 'https://theislecheats.cc').replace(/\/$/, '')
const TODAY = new Date().toLocaleDateString('en-CA')
const HREFLANG = ['en', 'x-default']

const FOREST = '/media/theisle-cheats-esp-forest.jpg'
const RIVER = '/media/theisle-cheats-esp-river.jpg'

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

function alternateLinks(url) {
  return HREFLANG.map(
    (language) =>
      `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(url)}" />`,
  ).join('\n')
}

function imageBlock(image, title, caption) {
  return `    <image:image>
      <image:loc>${escapeXml(siteUrl(image))}</image:loc>
      <image:title>${escapeXml(title)}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
    </image:image>`
}

function buildEntries(games, forums) {
  return [
    {
      path: '/',
      priority: '1.0',
      changefreq: 'daily',
      lastmod: TODAY,
      image: FOREST,
      imageTitle: 'TheIsle Cheats ESP Gameplay',
      imageCaption: 'Entity ESP gameplay shown before checkout.',
      group: 'pages',
    },
    ...games.map((game) => ({
      path: `/${game.slug}-cheats`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: TODAY,
      image: RIVER,
      imageTitle: 'Evrima ESP Product Gameplay',
      imageCaption: 'Product features, compatibility, status and price before checkout.',
      group: 'products',
    })),
    {
      path: '/forums',
      priority: '0.85',
      changefreq: 'weekly',
      lastmod: TODAY,
      image: RIVER,
      imageTitle: 'The Isle Cheats Forum Gameplay',
      imageCaption: 'Gameplay reference for setup and feature threads.',
      group: 'forum-hub',
    },
    ...forums.map((forum, index) => ({
      path: `/forums/${forum.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: forum.date,
      image: index % 2 === 0 ? RIVER : FOREST,
      imageTitle: `${forum.title} Gameplay`,
      imageCaption: `Visible Evrima gameplay reference for ${forum.title}.`,
      group: 'forum-topics',
    })),
    {
      path: '/reviews',
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: TODAY,
      image: FOREST,
      imageTitle: 'The Isle Cheats Review Gameplay',
      imageCaption: 'Gameplay accompanying verified buyer reviews.',
      group: 'pages',
    },
    {
      path: '/faq',
      priority: '0.75',
      changefreq: 'monthly',
      lastmod: TODAY,
      image: RIVER,
      imageTitle: 'Evrima ESP FAQ Gameplay',
      imageCaption: 'Product screenshot accompanying pre-purchase answers.',
      group: 'pages',
    },
    {
      path: '/support',
      priority: '0.75',
      changefreq: 'weekly',
      lastmod: TODAY,
      image: FOREST,
      imageTitle: 'The Isle Cheats Support Gameplay',
      imageCaption: 'Evrima ESP reference accompanying load, inject and delivery support.',
      group: 'pages',
    },
  ]
}

function urlEntry(entry, { includeImage = true } = {}) {
  const url = siteUrl(entry.path)
  const imageXml =
    includeImage && entry.image && entry.imageTitle && entry.imageCaption
      ? `\n${imageBlock(entry.image, entry.imageTitle, entry.imageCaption)}`
      : ''
  return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
${alternateLinks(url)}${imageXml}
  </url>`
}

function urlset(entries, { includeImage = true } = {}) {
  const body = entries.map((entry) => urlEntry(entry, { includeImage })).join('\n')
  const imageNs = includeImage
    ? '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : ''
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"${imageNs}>
${body}
</urlset>
`
}

function sitemapIndex(files) {
  const entries = files
    .map(
      (name) => `  <sitemap>
    <loc>${escapeXml(siteUrl(`/${name}`))}</loc>
    <lastmod>${TODAY}</lastmod>
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
      errors.push(`Missing URL in mirror sitemap: ${url}`)
    }
  }
  if (mirror.includes('<sitemapindex')) errors.push('sitemap.xml must be a single urlset, not an index')
  if ((mirror.match(/<url>/g) || []).length !== required.length) {
    errors.push(`Expected ${required.length} URLs in sitemap.xml mirror`)
  }

  const pages = entries.filter((entry) => entry.group === 'pages')
  const products = entries.filter((entry) => entry.group === 'products')
  const forumHub = entries.filter((entry) => entry.group === 'forum-hub')
  const forumTopics = entries.filter((entry) => entry.group === 'forum-topics')
  if (pages.length !== 4) errors.push(`Expected 4 page URLs, found ${pages.length}`)
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
  const mirror = urlset(entries, { includeImage: true })

  validate(games, forums, entries, mirror)

  const pages = entries.filter((entry) => entry.group === 'pages')
  const products = entries.filter((entry) => entry.group === 'products')
  const forumHub = entries.filter((entry) => entry.group === 'forum-hub')
  const forumTopics = entries.filter((entry) => entry.group === 'forum-topics')

  const childBodies = [
    ['sitemap-pages.xml', urlset(pages, { includeImage: true })],
    ['sitemap-products.xml', urlset(products, { includeImage: true })],
    ['sitemap-forums.xml', urlset(forumHub, { includeImage: true })],
    ['sitemap-forum-topics.xml', urlset(forumTopics, { includeImage: true })],
  ]
  assertUniqueChildLocs(childBodies)
  for (const [name, xml] of childBodies) {
    writeFileSync(join(publicDir, name), xml)
  }
  writeFileSync(join(publicDir, 'sitemap-index.xml'), sitemapIndex(CHILD_SITEMAPS))
  writeFileSync(join(publicDir, 'sitemap.xml'), mirror)

  writeFileSync(
    join(publicDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl('/sitemap.xml')}\nSitemap: ${siteUrl('/sitemap-index.xml')}\n`,
  )

  for (const name of [
    'sitemap-blogs.xml',
    'sitemap-regions.xml',
    'sitemap-images.xml',
    'sitemap-0.xml',
    'google-sitemap.xml',
  ]) {
    const path = join(publicDir, name)
    if (existsSync(path)) unlinkSync(path)
  }

  console.log(
    `Sitemap OK: 4 child maps + index (${entries.length} URLs); mirror at ${siteUrl('/sitemap.xml')}`,
  )
}

main()
