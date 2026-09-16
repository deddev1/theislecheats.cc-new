/**
 * HTTPS + sitemap XML for GSC (no www/apex host forcing).
 * Deploy entrypoint is worker.entry.mjs (generated in postbuild).
 */
import { WORKER_SITEMAPS } from './worker-sitemap-content.mjs'
import { adaptSitemapXmlForHost, robotsTxtForHost } from './lib/sitemap-host.mjs'

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

    const path = url.pathname.replace(/\/+$/, '') || '/'
    if (path === '/robots.txt') {
      return new Response(robotsTxtForHost(url.hostname), {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    const key = sitemapKey(url.pathname)
    if (key) {
      const xml = adaptSitemapXmlForHost(WORKER_SITEMAPS[key], url.hostname)
      return new Response(xml, { status: 200, headers: XML_HEADERS })
    }

    return env.ASSETS.fetch(request)
  },
}
