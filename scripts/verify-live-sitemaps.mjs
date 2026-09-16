/**
 * Smoke-test live sitemap URLs (run after deploy). Usage: node scripts/verify-live-sitemaps.mjs
 */
const SITE = (process.env.SITEMAP_ORIGIN || 'https://theislecheats.cc').replace(/\/$/, '').replace('https://www.', 'https://')
const WWW = 'https://www.theislecheats.cc'
const failures = []

const SITEMAP_PATHS = [
  '/sitemap.xml',
  '/sitemap-index.xml',
  '/sitemap-pages.xml',
  '/sitemap-products.xml',
  '/sitemap-forums.xml',
  '/sitemap-forum-topics.xml',
  '/google-sitemap.xml',
]

const GOOGLE_UAS = [
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)',
]

function fail(message) {
  failures.push(message)
}

async function check(path, options = {}) {
  const url = `${SITE}${path}`
  const res = await fetch(url, {
    headers: {
      'User-Agent': options.userAgent || 'theislecheats-sitemap-verify/1.0',
      Accept: options.accept || '*/*',
    },
    redirect: options.redirect ?? 'follow',
  })
  const type = res.headers.get('content-type') || ''
  const body = options.redirect === 'manual' ? '' : await res.text()

  if (options.redirect === 'manual' && res.status >= 300 && res.status < 400) {
    fail(`${url}: unexpected redirect ${res.status} (${options.userAgent || 'default UA'})`)
    return ''
  }
  if (!res.ok) fail(`${url}: HTTP ${res.status}`)
  if (!type.includes('xml')) fail(`${url}: expected application/xml, got ${type || '(none)'}`)
  if (body && /<html[\s>]/i.test(body)) fail(`${url}: body is HTML, not XML`)
  if (body && !body.trimStart().startsWith('<?xml')) fail(`${url}: missing XML declaration`)
  return body
}

async function main() {
  for (const ua of GOOGLE_UAS) {
    await check('/sitemap.xml', {
      userAgent: ua,
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      redirect: 'manual',
    })
  }

  const mainXml = await check('/sitemap.xml')
  const locs = [...mainXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (!locs.length) fail('sitemap.xml has no <loc> entries')
  if (!locs.every((loc) => loc === SITE || loc.startsWith(`${SITE}/`))) {
    fail(`sitemap.xml <loc> must use ${SITE} (submit this URL in GSC)`)
  }

  const wwwRes = await fetch(`${WWW}/sitemap.xml`, {
    headers: { 'User-Agent': GOOGLE_UAS[0], Accept: '*/*' },
  })
  if (!wwwRes.ok) fail(`${WWW}/sitemap.xml: HTTP ${wwwRes.status}`)
  const wwwXml = await wwwRes.text()
  const wwwLocs = [...wwwXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  const workerHeader = wwwRes.headers.get('x-sitemap-source')
  if (workerHeader) {
    if (wwwLocs.length && !wwwLocs.every((loc) => loc === WWW || loc.startsWith(`${WWW}/`))) {
      fail(`www host sitemap must rewrite <loc> to ${WWW} when Worker is live`)
    }
  } else {
    console.warn('No X-Sitemap-Source — run npm run deploy so Worker serves host-matched sitemaps.')
  }

  for (const path of SITEMAP_PATHS) {
    if (path === '/sitemap.xml') continue
    await check(path)
  }

  const robotsRes = await fetch(`${SITE}/robots.txt`)
  const robots = await robotsRes.text()
  if (!robotsRes.ok) fail(`/robots.txt: HTTP ${robotsRes.status}`)
  if (!robots.includes(`${SITE}/sitemap.xml`)) {
    fail(`robots.txt must list Sitemap: ${SITE}/sitemap.xml`)
  }

  const httpRes = await fetch(`http://theislecheats.cc/sitemap.xml`, { redirect: 'manual' })
  if (httpRes.status !== 301 && httpRes.status !== 308) {
    fail(`http sitemap should 301 to https (got ${httpRes.status})`)
  }

  for (const loc of locs) {
    const page = await fetch(loc, { redirect: 'follow' })
    if (!page.ok) fail(`${loc}: page HTTP ${page.status}`)
    const html = await page.text()
    if (html.includes('content="noindex')) fail(`${loc}: page is noindex`)
  }

  if (failures.length) {
    console.error(`Live sitemap verification failed:\n- ${failures.join('\n- ')}`)
    process.exit(1)
  }
  console.log(`Live sitemap OK: ${locs.length} URLs — GSC submit: ${SITE}/sitemap.xml`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
