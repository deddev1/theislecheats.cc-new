import { ISLE_OG, PAGE_IMAGES } from './images'

export const SITE_URL = 'https://theislecheats.cc'
export const SITE_NAME = 'The Isle Cheats'
export const SITE_HOST = 'theislecheats.cc'

/** Add verified profile URLs only (Discord, X, etc.). Leave empty if none. */
export const SITE_SAME_AS: string[] = []

/**
 * Sole purpose — used in schema + about copy.
 * Single-product site: The Isle Cheats only (Evrima).
 */
export const SITE_PURPOSE =
  'The Isle Cheats sells undetected ESP, wallhack, radar, and HWID spoofer for The Isle (Evrima) with live patch status. Isle-only — no other games.'

export const SITE_ABOUT = [
  'The Isle Cheats',
  'isle cheats',
  'theisle cheats',
  'The Isle Evrima cheats',
  'The Isle ESP',
  'The Isle wallhack',
] as const

/**
 * Offer price shown on product schema + purchase UI.
 * Keep in sync with checkout listing.
 */
export const PRODUCT_PRICE_USD = '24.99'

export const SEO_REGIONS = [
  { hreflang: 'en', label: 'English' },
  { hreflang: 'x-default', label: 'Default' },
] as const

/** Default social / OG image — IGN The Isle library art */
export const OG_IMAGE = ISLE_OG

export type PageSeo = {
  title: string
  description: string
  path: string
  ogType?: 'website' | 'article' | 'product'
  image?: string
  robots?: string
}

/** Unique SEO per route — commercial / transactional intent. */
export const SEO = {
  home: {
    title: 'The Isle Cheats | Buy for Evrima — Live Status & Checkout',
    description:
      'Buy The Isle Cheats for Evrima with Entity ESP, World ESP, radar and an HWID spoofer. Check live status, features and price before checkout.',
    path: '/',
    ogType: 'website',
    image: PAGE_IMAGES.home.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  },
  forums: {
    title: 'The Isle Cheats Forums | Setup, Antivirus, Hotkeys & Load',
    description:
      'Product forums covering Evrima features, hotkeys, complete setup, antivirus exclusions and current loader status.',
    path: '/forums',
    ogType: 'website',
    image: PAGE_IMAGES.forums.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  reviews: {
    title: 'The Isle Cheats Reviews | Before You Buy',
    description:
      'The Isle Cheats reviews from Evrima players — ESP accuracy, Undetected honesty, and patch notes before you checkout.',
    path: '/reviews',
    ogType: 'website',
    image: PAGE_IMAGES.reviews.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  faq: {
    title: 'The Isle Cheats FAQ | Buy, Load & Undetected Answers',
    description:
      'Pre-purchase answers about Evrima compatibility, current status, included ESP features, delivery, pricing and checkout.',
    path: '/faq',
    ogType: 'website',
    image: PAGE_IMAGES.faq.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  support: {
    title: 'The Isle Cheats Support | Load, Inject & Spoofer Help',
    description:
      'Post-purchase support for loader delivery, setup, inject errors and HWID spoofer recovery.',
    path: '/support',
    ogType: 'website',
    image: PAGE_IMAGES.support.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  privacy: {
    title: 'Privacy Policy | The Isle Cheats',
    description:
      'How The Isle Cheats (theislecheats.cc) handles visitor data, checkout handoff, cookies, and support requests.',
    path: '/privacy',
    ogType: 'website',
    image: PAGE_IMAGES.faq.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  terms: {
    title: 'Terms of Use | The Isle Cheats',
    description:
      'Terms for using theislecheats.cc and purchasing The Isle Cheats — eligibility, delivery, refunds, and liability.',
    path: '/terms',
    ogType: 'website',
    image: PAGE_IMAGES.faq.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  sitemap: {
    title: 'Sitemap | The Isle Cheats',
    description:
      'HTML sitemap of all pages on theislecheats.cc — product, forums, FAQ, support, reviews, and legal.',
    path: '/sitemap',
    ogType: 'website',
    image: PAGE_IMAGES.faq.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
  product: {
    title: 'Evrima ESP Features, Price & Checkout | The Isle',
    description:
      'Review Evrima ESP, radar, stream-proof mode, HWID spoofer support, current status and pricing before opening checkout.',
    path: '/isle-cheats',
    ogType: 'product',
    image: PAGE_IMAGES.product.src,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  },
} as const satisfies Record<string, PageSeo>

export const HOME_HEADINGS = {
  h1: 'TheIsle Cheats',
  h2Features: 'What you get with The Isle Cheats',
  h2Featured: 'The Isle Cheats for Evrima',
  h2About: 'Why buy The Isle Cheats here',
  h2Access: 'Buy The Isle Cheats',
  h2Faq: 'The Isle Cheats FAQ',
} as const

export function absoluteUrl(path: string) {
  if (!path || path === '/') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
