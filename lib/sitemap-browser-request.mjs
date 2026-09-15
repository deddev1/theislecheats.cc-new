/**
 * Dev-server only: when to redirect sitemap *.xml → /sitemap (HTML).
 * Never use in the production Worker — Google Search Console must receive XML.
 */
const CRAWLER_UA =
  /googlebot|google-inspectiontool|googleother|google-site-verification|google-read-aloud|storebot-google|adsbot-google|mediapartners-google|feedfetcher-google|apis-google|duplexweb-google|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|semrush|ahrefsbot|petalbot|applebot|bytespider|gptbot|chatgpt-user|claudebot|anthropic-ai|theislecheats-sitemap-verify|curl\/|wget\//i

export function isSearchCrawlerUserAgent(userAgent) {
  return CRAWLER_UA.test(userAgent || '')
}

/**
 * @param {Request | { headers: { get(name: string): string | null | undefined } }} request
 */
export function shouldRedirectSitemapXmlToHtml(request) {
  const ua = request.headers.get('User-Agent') || ''
  if (isSearchCrawlerUserAgent(ua)) return false

  const accept = request.headers.get('Accept') || ''
  if (!accept.includes('text/html')) return false

  const dest = request.headers.get('Sec-Fetch-Dest') || ''
  return dest === 'document' || dest === 'iframe'
}

export function isSitemapXmlPath(pathname) {
  return /\/(?:google-)?sitemap[^/]*\.xml$/i.test(pathname || '')
}
