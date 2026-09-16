/** Hosts that serve this site (Cloudflare custom domains). */
export const SITE_HOSTS = new Set(['theislecheats.cc', 'www.theislecheats.cc'])

export const SITEMAP_ORIGIN_BARE = 'https://theislecheats.cc'
export const SITEMAP_ORIGIN_WWW = 'https://www.theislecheats.cc'

export function siteOrigin(hostname) {
  if (hostname === 'www.theislecheats.cc') return SITEMAP_ORIGIN_WWW
  if (hostname === 'theislecheats.cc') return SITEMAP_ORIGIN_BARE
  return SITEMAP_ORIGIN_BARE
}

/** Generated XML uses bare <loc>; rewrite for www GSC property when requested on www host. */
export function adaptSitemapXmlForHost(xml, hostname) {
  if (hostname === 'www.theislecheats.cc') {
    return xml.replaceAll(SITEMAP_ORIGIN_BARE, SITEMAP_ORIGIN_WWW)
  }
  return xml
}

export function robotsTxtForHost(hostname) {
  const origin = siteOrigin(hostname)
  return `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
}
