/**
 * Serve sitemap XML from the Worker (not only static assets) so GSC always gets valid XML.
 */
import { SITEMAP_XML } from './worker-sitemap-content.mjs'

const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Sitemap-Source': 'worker',
}

const WORKER_SITEMAP_PATHS = new Set(['/sitemap.xml', '/google-sitemap.xml'])

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    if (WORKER_SITEMAP_PATHS.has(pathname)) {
      return new Response(SITEMAP_XML, { status: 200, headers: XML_HEADERS })
    }

    return env.ASSETS.fetch(request)
  },
}
