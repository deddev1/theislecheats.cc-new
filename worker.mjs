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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.hostname === `www.${APEX_HOST}`) {
      url.hostname = APEX_HOST
      return Response.redirect(url.toString(), 301)
    }

    const xml = WORKER_SITEMAPS[url.pathname]
    if (xml) {
      return new Response(xml, { status: 200, headers: XML_HEADERS })
    }

    return env.ASSETS.fetch(request)
  },
}
