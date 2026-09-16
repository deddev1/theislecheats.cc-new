/** Hosts that serve this site (Cloudflare custom domains). */
export const SITE_HOSTS = new Set(['theislecheats.cc', 'www.theislecheats.cc'])

const DEFAULT_ORIGIN = 'https://www.theislecheats.cc'

export function siteOrigin(hostname) {
  return SITE_HOSTS.has(hostname) ? `https://${hostname}` : DEFAULT_ORIGIN
}

/** Rewrite <loc> URLs so the sitemap matches the GSC URL-prefix property (www vs bare). */
export function adaptSitemapXmlForHost(xml, hostname) {
  const origin = siteOrigin(hostname)
  return xml
    .replaceAll('https://www.theislecheats.cc', origin)
    .replaceAll('https://theislecheats.cc', origin)
}

export function robotsTxtForHost(hostname) {
  const origin = siteOrigin(hostname)
  return `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
}
