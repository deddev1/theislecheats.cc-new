/**
 * GSC-oriented sitemap audit (local dist + optional live). Usage:
 *   node scripts/audit-google-sitemap.mjs
 *   SITE_URL=https://www.theislecheats.cc node scripts/audit-google-sitemap.mjs --live
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isSearchCrawlerUserAgent } from '../lib/sitemap-browser-request.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = join(root, 'dist')
const live = process.argv.includes('--live')
const SITE = (process.env.SITEMAP_ORIGIN || 'https://theislecheats.cc').replace(/\/$/, '').replace('https://www.', 'https://')
const ALT_HOST = 'https://www.theislecheats.cc'
const failures = []
const warnings = []

function fail(message) {
  failures.push(message)
}

function warn(message) {
  warnings.push(message)
}

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
  'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)',
  'Googlebot',
]

function auditLocal() {
  for (const path of SITEMAP_PATHS) {
    const file = join(dist, path.replace(/^\//, ''))
    if (!existsSync(file)) fail(`Missing dist${path}`)
    else {
      const xml = readFileSync(file, 'utf8')
      if (!xml.trimStart().startsWith('<?xml')) fail(`${path} must start with <?xml`)
      if (/<html|<!DOCTYPE/i.test(xml)) fail(`${path} contains HTML`)
    }
  }

  const main = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
  const locs = [...main.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (!locs.length) fail('sitemap.xml has no URLs')
  for (const loc of locs) {
    if (loc !== SITE && !loc.startsWith(`${SITE}/`) && loc !== ALT_HOST && !loc.startsWith(`${ALT_HOST}/`)) {
      fail(`sitemap URL not on www or bare host: ${loc}`)
    }
  }

  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8')
  if (!robots.includes(`${SITE}/sitemap.xml`)) {
    fail(`robots.txt must list Sitemap: ${SITE}/sitemap.xml`)
  }
}

async function auditLiveHost(host, expectedOrigin) {
  const res = await fetch(`${host}/sitemap.xml`, {
    headers: { 'User-Agent': GOOGLE_UAS[0], Accept: '*/*' },
  })
  if (!res.ok) fail(`${host}/sitemap.xml: HTTP ${res.status}`)
  const body = await res.text()
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  if (!locs.length) fail(`${host}/sitemap.xml: no URLs`)
  if (!locs.every((loc) => loc === expectedOrigin || loc.startsWith(`${expectedOrigin}/`))) {
    fail(`${host}/sitemap.xml: <loc> must use ${expectedOrigin} (got ${locs[0]})`)
  }
  const robots = await fetch(`${host}/robots.txt`)
  const robotsText = await robots.text()
  if (!robotsText.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`)) {
    fail(`${host}/robots.txt must list Sitemap: ${expectedOrigin}/sitemap.xml`)
  }
}

async function auditLive() {
  await auditLiveHost(SITE, SITE)
  await auditLiveHost(ALT_HOST, ALT_HOST)

  for (const ua of GOOGLE_UAS) {
    const res = await fetch(`${SITE}/sitemap.xml`, {
      headers: {
        'User-Agent': ua,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'manual',
    })
    if (res.status >= 300 && res.status < 400) {
      fail(`Google UA redirect on sitemap.xml (${res.status}): ${ua.slice(0, 48)}…`)
    }
    if (!res.ok) fail(`sitemap.xml HTTP ${res.status} for ${ua.slice(0, 40)}…`)
    const body = await res.text()
    if (!body.trimStart().startsWith('<?xml')) {
      fail(`sitemap.xml not XML for Google UA (${ua.slice(0, 40)}…)`)
    }
    if (/<html/i.test(body)) fail(`sitemap.xml returned HTML for Google UA`)
  }

  for (const path of SITEMAP_PATHS) {
    const res = await fetch(`${SITE}${path}`, {
      headers: { 'User-Agent': GOOGLE_UAS[0], Accept: '*/*' },
    })
    if (!res.ok) fail(`${path}: HTTP ${res.status}`)
    const type = res.headers.get('content-type') || ''
    if (!type.includes('xml')) warn(`${path}: content-type is ${type || '(none)'}`)
    const body = await res.text()
    if (body.includes('<html')) fail(`${path}: body is HTML on live site`)
  }

  for (const host of [SITE, ALT_HOST]) {
    const res = await fetch(`${host}/robots.txt`)
    if (!res.ok) warn(`${host}/robots.txt: HTTP ${res.status}`)
    else {
      const text = await res.text()
      if (!text.includes('/sitemap.xml')) warn(`${host}/robots.txt missing sitemap line`)
    }
  }
}

function auditCrawlerHelpers() {
  for (const ua of GOOGLE_UAS) {
    if (!isSearchCrawlerUserAgent(ua)) fail(`Crawler UA not recognized: ${ua}`)
  }
}

async function main() {
  if (!existsSync(join(dist, 'sitemap.xml'))) {
    fail('Run npm run build first (dist/sitemap.xml missing)')
  } else {
    auditLocal()
  }
  auditCrawlerHelpers()
  if (live) await auditLive()

  if (warnings.length) {
    console.warn(`GSC sitemap warnings:\n- ${warnings.join('\n- ')}`)
  }
  if (failures.length) {
    console.error(`GSC sitemap audit failed:\n- ${failures.join('\n- ')}`)
    process.exit(1)
  }
  console.log(
    `GSC sitemap audit OK (${live ? 'local + live' : 'local'}). Submit exactly: ${SITE}/sitemap.xml in the matching Search Console property.`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
