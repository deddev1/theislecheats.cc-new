/**
 * Smoke-test live sitemap URLs (run after deploy). Usage: node scripts/verify-live-sitemaps.mjs
 */
const APEX = (process.env.SITEMAP_ORIGIN || 'https://theislecheats.cc').replace(/\/$/, '').replace('https://www.', 'https://')
const WWW = 'https://www.theislecheats.cc'
const failures = []

const GOOGLE_UAS = [
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)',
]

function fail(message) {
  failures.push(message)
}

async function fetchXml(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': options.userAgent || 'theislecheats-sitemap-verify/1.0',
      Accept: options.accept || '*/*',
    },
    redirect: options.redirect ?? 'follow',
  })
  if (options.redirect === 'manual' && res.status >= 300 && res.status < 400) {
    fail(`${url}: redirect ${res.status} (Google must get 200 XML)`)
    return ''
  }
  if (!res.ok) fail(`${url}: HTTP ${res.status}`)
  const type = res.headers.get('content-type') || ''
  if (!type.includes('xml')) fail(`${url}: expected application/xml, got ${type || '(none)'}`)
  const body = await res.text()
  if (/<html[\s>]/i.test(body)) fail(`${url}: body is HTML`)
  if (!body.trimStart().startsWith('<?xml')) fail(`${url}: not XML`)
  return body
}

function assertLocs(xml, origin, label) {
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (!locs.length) fail(`${label}: no URLs`)
  if (!locs.every((loc) => loc === origin || loc.startsWith(`${origin}/`))) {
    fail(`${label}: every <loc> must start with ${origin}`)
  }
  return locs
}

async function main() {
  for (const ua of GOOGLE_UAS) {
    await fetchXml(`${APEX}/sitemap.xml`, { userAgent: ua, redirect: 'manual', accept: 'text/html,application/xml,*/*' })
  }

  const apexXml = await fetchXml(`${APEX}/sitemap.xml`)
  const apexLocs = assertLocs(apexXml, APEX, 'apex sitemap')

  const wwwXml = await fetchXml(`${WWW}/sitemap-www.xml`)
  assertLocs(wwwXml, WWW, 'www sitemap')

  for (const path of [
    '/sitemap-index.xml',
    '/sitemap-pages.xml',
    '/sitemap-products.xml',
    '/sitemap-forums.xml',
    '/sitemap-forum-topics.xml',
    '/google-sitemap.xml',
  ]) {
    await fetchXml(`${APEX}${path}`)
  }

  const robots = await (await fetch(`${APEX}/robots.txt`)).text()
  if (!robots.includes(`${APEX}/sitemap.xml`)) fail('robots.txt missing apex sitemap line')
  if (!robots.includes(`${WWW}/sitemap-www.xml`)) fail('robots.txt missing www sitemap line')

  for (const loc of apexLocs) {
    const page = await fetch(loc, { redirect: 'follow' })
    if (!page.ok) fail(`${loc}: page HTTP ${page.status}`)
  }

  if (failures.length) {
    console.error(`Live sitemap verification failed:\n- ${failures.join('\n- ')}`)
    process.exit(1)
  }
  console.log(`Live sitemap OK. GSC: ${APEX}/sitemap.xml OR ${WWW}/sitemap-www.xml`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
