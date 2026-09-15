/**
 * Apex canonical host + guaranteed XML for all sitemap files (GSC).
 */
import { WORKER_SITEMAPS } from './worker-sitemap-content.mjs'

const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Sitemap-Source': 'worker',
}

const APEX_HOST = 'theislecheats.cc'

function sitemapKey(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return Object.keys(WORKER_SITEMAPS).find((key) => key.toLowerCase() === normalized.toLowerCase())
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.hostname === `www.${APEX_HOST}`) {
      url.hostname = APEX_HOST
      return Response.redirect(url.toString(), 301)
    }

    if (/\.xml\/+$/i.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/+$/, '')
      return Response.redirect(url.toString(), 301)
    }

    const key = sitemapKey(url.pathname)
    if (key) {
      return new Response(WORKER_SITEMAPS[key], { status: 200, headers: XML_HEADERS })
    }

    return env.ASSETS.fetch(request)
  },
}
