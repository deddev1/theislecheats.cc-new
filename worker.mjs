/**
 * HTTPS redirect + static assets (sitemaps live in dist/ from public/).
 */
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

    // www URL-prefix GSC: /sitemap.xml must list https://www… URLs (serve sitemap-www.xml).
    const path = url.pathname.replace(/\/+$/, '') || '/'
    if (url.hostname.toLowerCase() === 'www.theislecheats.cc' && path === '/sitemap.xml') {
      url.pathname = '/sitemap-www.xml'
      return env.ASSETS.fetch(new Request(url.toString(), request))
    }

    return env.ASSETS.fetch(request)
  },
}
