/**
 * HTTPS + sitemap XML for GSC (no www/apex host forcing).
 * Deploy entrypoint is worker.entry.mjs (generated in postbuild).
 */
import { WORKER_SITEMAPS } from './worker-sitemap-content.mjs'
import { shouldRedirectSitemapXmlToHtml } from './lib/sitemap-browser-request.mjs'

const XML_HEADERS = {
  'Content-Type': 'application/xml; charset=utf-8',
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Sitemap-Source': 'worker',
}

function sitemapKey(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return Object.keys(WORKER_SITEMAPS).find((key) => key.toLowerCase() === normalized.toLowerCase())
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.protocol === 'http:') {
      url.protocol = 'https:'
      return Response.redirect(url.toString(), 301)
    }

    if (/\.xml\/+$/i.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/+$/, '')
      return Response.redirect(url.toString(), 301)
    }

    const key = sitemapKey(url.pathname)
    if (key) {
      if (shouldRedirectSitemapXmlToHtml(request)) {
        return Response.redirect(new URL('/sitemap', url.origin).toString(), 302)
      }
      return new Response(WORKER_SITEMAPS[key], { status: 200, headers: XML_HEADERS })
    }

    return env.ASSETS.fetch(request)
  },
}
