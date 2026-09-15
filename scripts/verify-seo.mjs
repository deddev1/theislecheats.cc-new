import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = join(import.meta.dirname, '..')
const dist = join(root, 'dist')
const failures = []

function fail(message) {
  failures.push(message)
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : []
  })
}

const files = htmlFiles(dist)
const titles = new Map()
const descriptions = new Map()

for (const file of files) {
  const html = readFileSync(file, 'utf8')
  const page = relative(dist, file).replaceAll('\\', '/')
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]

  if (h1Count !== 1) fail(`${page}: expected one H1, found ${h1Count}`)
  if (!title) fail(`${page}: missing title`)
  else if (titles.has(title)) fail(`${page}: duplicate title also used by ${titles.get(title)}`)
  else titles.set(title, page)
  if (!description) fail(`${page}: missing description`)
  else if (descriptions.has(description)) {
    fail(`${page}: duplicate description also used by ${descriptions.get(description)}`)
  } else descriptions.set(description, page)

  if (html.includes('assets-prd.ignimgs.com')) fail(`${page}: contains third-party IGN image`)
  if (html.includes('cdn.cosmocheats.com')) fail(`${page}: contains third-party media hotlink`)
  if (html.includes('SearchAction')) fail(`${page}: contains invalid SearchAction`)
  if (html.includes('"keywords"')) fail(`${page}: contains keyword-list structured data`)
  if (/forums\/(instructions|how-to-load)/.test(html)) {
    fail(`${page}: links to a retired forum route`)
  }
}

const home = readFileSync(join(dist, 'index.html'), 'utf8')
const product = readFileSync(join(dist, 'isle-cheats', 'index.html'), 'utf8')
const reviews = readFileSync(join(dist, 'reviews', 'index.html'), 'utf8')
const faq = readFileSync(join(dist, 'faq', 'index.html'), 'utf8')
const support = readFileSync(join(dist, 'support', 'index.html'), 'utf8')
const importantPages = [
  home,
  product,
  reviews,
  faq,
  support,
  readFileSync(join(dist, 'forums', 'index.html'), 'utf8'),
]

const homeTitle =
  '<title>The Isle Cheats | Buy for Evrima — Live Status &amp; Checkout</title>'
if (!home.includes(homeTitle)) {
  fail('Homepage does not own the exact transactional title')
}
if (product.includes('<title>Buy The Isle Cheats')) fail('Product details page competes with homepage')
if ((faq.match(/"@type":"FAQPage"/g) || []).length !== 1) fail('/faq must own one FAQPage')
for (const [name, html] of [
  ['home', home],
  ['product', product],
  ['reviews', reviews],
  ['support', support],
]) {
  if (html.includes('"@type":"FAQPage"')) fail(`${name}: duplicate FAQPage schema`)
}
for (const [name, html] of [
  ['home', home],
  ['product', product],
  ['reviews', reviews],
]) {
  if (!html.includes('"@id":"https://www.theislecheats.cc/#product"')) {
    fail(`${name}: missing shared Product ID`)
  }
}
if ((reviews.match(/"@type":"Review"/g) || []).length !== 26) {
  fail('Reviews schema must contain exactly 26 visible buyer reviews')
}
if (!reviews.includes('"reviewCount":"26"') || !reviews.includes('"ratingValue":"4.4"')) {
  fail('Reviews AggregateRating must report 26 reviews averaging 4.4')
}
if (support.includes('noindex')) fail('Support page must be indexable')
for (const file of files) {
  const page = relative(dist, file).replaceAll('\\', '/')
  if (page === '404.html') continue
  const html = readFileSync(file, 'utf8')
  if (html.includes('content="noindex')) fail(`${page}: content page must not be noindex`)
}
for (const html of importantPages) {
  if (!html.includes('/media/theisle-cheats-esp-')) {
    fail('An important indexed page is missing visible gameplay media')
  }
}
const forumVideoObjects = files
  .filter((file) => file.includes(`${join('forums', '')}`) && file.endsWith('index.html'))
  .reduce((count, file) => count + (readFileSync(file, 'utf8').match(/"@type":"VideoObject"/g) || []).length, 0)
if (forumVideoObjects !== 5) fail(`Expected 5 forum VideoObject nodes, found ${forumVideoObjects}`)

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
if (sitemap.includes('<sitemapindex')) fail('sitemap.xml must be a single urlset, not an index')
if (/forums\/(instructions|how-to-load)/.test(sitemap)) fail('Retired forum remains in sitemap.xml')
const requiredUrls = [
  'https://www.theislecheats.cc/',
  'https://www.theislecheats.cc/isle-cheats',
  'https://www.theislecheats.cc/forums',
  'https://www.theislecheats.cc/forums/features-list',
  'https://www.theislecheats.cc/forums/hotkeys',
  'https://www.theislecheats.cc/forums/complete-setup',
  'https://www.theislecheats.cc/forums/disable-antivirus',
  'https://www.theislecheats.cc/forums/undetected-status',
  'https://www.theislecheats.cc/reviews',
  'https://www.theislecheats.cc/faq',
  'https://www.theislecheats.cc/support',
  'https://www.theislecheats.cc/privacy',
  'https://www.theislecheats.cc/terms',
  'https://www.theislecheats.cc/sitemap',
]
for (const url of requiredUrls) {
  if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap.xml missing ${url}`)
}
if ((sitemap.match(/<url>/g) || []).length !== requiredUrls.length) {
  fail(`sitemap.xml must contain exactly ${requiredUrls.length} URLs`)
}
if (/<xhtml:|image:image|changefreq/i.test(sitemap)) {
  fail('sitemap.xml must not use image/hreflang/changefreq extensions')
}
const sitemapUrlCount = (sitemap.match(/<url>/g) || []).length
if ((sitemap.match(/<priority>/g) || []).length !== sitemapUrlCount) {
  fail('sitemap.xml must include <priority> on every <url>')
}
const childMaps = [
  'sitemap-pages.xml',
  'sitemap-products.xml',
  'sitemap-forums.xml',
  'sitemap-forum-topics.xml',
]
const childLocs = new Set()
for (const name of childMaps) {
  const path = join(dist, name)
  if (!existsSync(path)) fail(`Missing child sitemap: ${name}`)
  const xml = readFileSync(path, 'utf8')
  if (/<xhtml:|image:image|changefreq/i.test(xml)) {
    fail(`${name} must not use image/hreflang/changefreq extensions`)
  }
  const urls = (xml.match(/<url>/g) || []).length
  if ((xml.match(/<priority>/g) || []).length !== urls) {
    fail(`${name} must include <priority> on every <url>`)
  }
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = match[1]
    if (childLocs.has(loc)) fail(`Duplicate URL across child sitemaps: ${loc}`)
    childLocs.add(loc)
  }
}
const indexPath = join(dist, 'sitemap-index.xml')
if (!existsSync(indexPath)) fail('Missing sitemap-index.xml')
const indexXml = readFileSync(indexPath, 'utf8')
if ((indexXml.match(/<sitemap>/g) || []).length !== 4) {
  fail('sitemap-index.xml must list exactly 4 child sitemaps')
}
if (childLocs.size !== requiredUrls.length) {
  fail(`Child sitemaps must list exactly ${requiredUrls.length} unique URLs`)
}
if (existsSync(join(dist, 'sitemap-images.xml'))) {
  fail('Remove legacy sitemap-images.xml (URLs must not be duplicated in the index)')
}

if (!existsSync(join(dist, 'favicon.ico'))) fail('Missing dist/favicon.ico (run generate-seo-assets)')

for (const asset of [
  'public/og/default.jpg',
  'public/media/product-hero.webp',
  'public/media/home-hero-dino.jpg',
  'public/media/product-cover.webp',
  'public/media/theisle-cheats-esp-forest.jpg',
  'public/media/theisle-cheats-esp-river.jpg',
  'public/media/theisle-cheats-esp-gameplay.mp4',
  'public/media/theisle-cheats-misc-features.mp4',
]) {
  if (!existsSync(join(root, asset))) fail(`Missing first-party asset: ${asset}`)
}

if (failures.length) {
  throw new Error(`SEO verification failed:\n- ${failures.join('\n- ')}`)
}

console.log(`SEO verification passed: ${files.length} HTML files, 5 forums, 26 reviews, legal pages`)
