import { blogPath } from './blog-paths'

/** Official The Isle game destinations (authority / topical relevance). */
export const OFFICIAL_ISLE_LINKS = [
  {
    label: 'The Isle official website',
    href: 'https://www.survivetheisle.com/',
    description: 'Official Survive The Isle site from the developers',
  },
  {
    label: 'The Isle on Steam',
    href: 'https://store.steampowered.com/app/376210/The_Isle/',
    description: 'Buy The Isle and switch to the Evrima branch on Steam',
  },
] as const

/** Primary internal routes for crawl equity. */
export const SITE_PAGE_LINKS = [
  { label: 'Buy The Isle Cheats', to: '/', description: 'Live status, price and checkout' },
  {
    label: 'Product details',
    to: '/isle-cheats',
    description: 'ESP, radar, stream-proof and spoofer features',
  },
  {
    label: 'Forums',
    to: '/forums',
    description: 'Setup forums — antivirus, hotkeys, load',
  },
  {
    label: 'Reviews',
    to: '/reviews',
    description: 'Player reviews and ratings',
  },
  {
    label: 'FAQ',
    to: '/faq',
    description: 'Frequently asked questions',
  },
  {
    label: 'Support',
    to: '/support',
    description: 'Load, inject, spoofer and EAC help',
  },
] as const

export const LEGAL_PAGE_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
] as const

/** Deep links into forum threads — commercial / transactional. */
export const SITE_GUIDE_LINKS = [
  { label: 'Features list', to: blogPath('features-list') },
  { label: 'Hotkeys', to: blogPath('hotkeys') },
  { label: 'Complete setup', to: blogPath('complete-setup') },
  { label: 'Disable antivirus', to: blogPath('disable-antivirus') },
  { label: 'Undetected status', to: blogPath('undetected-status') },
] as const

/**
 * External checkout go-link → The Isle product.
 * Always pair with rel=nofollow so crawlers do not index the redirect.
 */
const CHECKOUT_HOST = ['za', 'deyo', '.com'].join('')
const CHECKOUT_REF = ['Q', 'R', 'H'].join('')
const CHECKOUT_PRODUCT = '/products/the-isle-novaxware-cheats'

export const CHECKOUT_URL = `https://${CHECKOUT_HOST}/go/${CHECKOUT_REF}?to=${encodeURIComponent(CHECKOUT_PRODUCT)}`

export function getCheckoutUrl(_productSlug?: string): string {
  return CHECKOUT_URL
}

/** Outbound checkout: nofollow so redirect targets are not indexed via our links. */
export const CHECKOUT_REL = 'nofollow noopener noreferrer'
