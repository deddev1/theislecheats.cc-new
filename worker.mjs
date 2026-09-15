/**
 * HTTPS + sitemap XML for GSC (no www/apex host forcing).
 * Deploy entrypoint is worker.entry.mjs (generated in postbuild).
 */
import { WORKER_SITEMAPS } from './worker-sitemap-content.mjs'

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

/** Browsers / IDE previews only — crawlers omit Sec-Fetch-Dest so they still get XML. */
function isBrowserDocumentNavigation(request) {
  const dest = request.headers.get('Sec-Fetch-Dest')
  if (!dest) return false
  if (dest !== 'document' && dest !== 'iframe') return false
  const accept = request.headers.get('Accept') || ''
  return accept.includes('text/html')
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
      if (isBrowserDocumentNavigation(request)) {
        return Response.redirect(new URL('/sitemap', url.origin).toString(), 302)
      }
      return new Response(WORKER_SITEMAPS[key], { status: 200, headers: XML_HEADERS })
    }

    return env.ASSETS.fetch(request)
  },
}
