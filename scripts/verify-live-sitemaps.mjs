/**
 * Smoke-test live sitemap URLs (run after deploy). Usage: node scripts/verify-live-sitemaps.mjs
 */
const SITE = (process.env.SITE_URL || 'https://theislecheats.cc').replace(/\/$/, '')
const failures = []

function fail(message) {
  failures.push(message)
}

async function check(path) {
  const url = `${SITE}${path}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'theislecheats-sitemap-verify/1.0' },
    redirect: 'follow',
  })
  const type = res.headers.get('content-type') || ''
  const body = await res.text()

  if (!res.ok) fail(`${url}: HTTP ${res.status}`)
  if (!type.includes('xml')) fail(`${url}: expected application/xml, got ${type || '(none)'}`)
  if (/<!DOCTYPE\s+html|<html[\s>]/i.test(body)) fail(`${url}: body is HTML, not XML`)
  if (!body.trimStart().startsWith('<?xml')) fail(`${url}: missing XML declaration`)
  return body
}

async function main() {
  const mainXml = await check('/sitemap.xml')
  await check('/sitemap-index.xml')

  const robotsRes = await fetch(`${SITE}/robots.txt`)
  const robots = await robotsRes.text()
  if (!robotsRes.ok) fail(`/robots.txt: HTTP ${robotsRes.status}`)
  if (!robots.includes('Sitemap: https://theislecheats.cc/sitemap.xml')) {
    fail('robots.txt must list apex Sitemap URL')
  }

  const locs = [...mainXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (!locs.length) fail('sitemap.xml has no <loc> entries')
  if (!locs.every((loc) => loc === SITE || loc.startsWith(`${SITE}/`))) {
    fail('sitemap.xml contains URLs outside the apex property')
  }

  const wwwRes = await fetch(`https://www.theislecheats.cc/sitemap.xml`, { redirect: 'manual' })
  if (wwwRes.status !== 301 && wwwRes.status !== 308) {
    fail(`www sitemap should 301 to apex (got ${wwwRes.status})`)
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
  console.log(`Live sitemap OK: ${locs.length} URLs at ${SITE}/sitemap.xml`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
