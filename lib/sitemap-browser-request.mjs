/**
 * When to redirect sitemap *.xml → /sitemap (HTML) instead of serving XML.
 * Crawlers and verify scripts must still receive XML (GSC).
 */
const CRAWLER_UA =
  /googlebot|google-inspectiontool|bingbot|yandex|baiduspider|duckduckbot|slurp|facebookexternalhit|twitterbot|linkedinbot|semrush|ahrefsbot|petalbot|applebot|bytespider|gptbot|chatgpt-user|claudebot|anthropic-ai|theislecheats-sitemap-verify|curl\/|wget\//i

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
  if (dest === 'document' || dest === 'iframe') return true

  // Cursor Simple Browser / Electron previews often omit Sec-Fetch-Dest (XML → cursor-injector crash).
  if (!dest) return true

  return false
}

export function isSitemapXmlPath(pathname) {
  return /\/(?:google-)?sitemap[^/]*\.xml$/i.test(pathname || '')
}
