export type SeoMediaItem = {
  image: string
  video?: string
  alt: string
  title: string
  caption: string
  videoTitle?: string
  videoDescription?: string
}

/** Full-bleed homepage hero — always shown; video layers on top when ready. */
export const HERO_POSTER_IMAGE = '/media/product-hero.webp'

export const ISLE_ESP_FOREST = '/media/theisle-cheats-esp-forest.jpg'
export const ISLE_ESP_RIVER = '/media/theisle-cheats-esp-river.jpg'
export const ISLE_ESP_VIDEO = '/media/theisle-cheats-esp-gameplay.mp4'
export const ISLE_MISC_VIDEO = '/media/theisle-cheats-misc-features.mp4'

export const PAGE_MEDIA = {
  home: {
    image: ISLE_ESP_FOREST,
    video: ISLE_ESP_VIDEO,
    alt: 'The Isle Cheats Entity ESP highlighting targets in an Evrima forest',
    title: 'The Isle Cheats ESP Gameplay',
    caption: 'Entity ESP shown in The Isle Evrima before checkout.',
    videoTitle: 'The Isle Cheats Entity ESP preview',
    videoDescription: 'Short Evrima gameplay preview showing Entity ESP target overlays.',
  },
  product: {
    image: ISLE_ESP_RIVER,
    video: ISLE_MISC_VIDEO,
    alt: 'Evrima ESP tracking targets beside a river',
    title: 'Evrima ESP and Miscellaneous Features',
    caption: 'Product preview of ESP overlays and supporting features on Evrima.',
    videoTitle: 'Evrima ESP feature preview',
    videoDescription: 'Short product preview showing ESP and miscellaneous menu features.',
  },
  forums: {
    image: ISLE_ESP_RIVER,
    video: ISLE_ESP_VIDEO,
    alt: 'The Isle Cheats forum preview showing Entity ESP gameplay',
    title: 'The Isle Cheats Forum Media',
    caption: 'Gameplay reference used by the setup, hotkey, antivirus and status threads.',
    videoTitle: 'Entity ESP forum reference',
    videoDescription: 'Evrima gameplay reference for product setup and feature threads.',
  },
  reviews: {
    image: ISLE_ESP_FOREST,
    video: ISLE_MISC_VIDEO,
    alt: 'The Isle Cheats gameplay preview accompanying verified buyer reviews',
    title: 'The Isle Cheats Review Gameplay',
    caption: 'Gameplay preview shown alongside verified Evrima buyer feedback.',
    videoTitle: 'Product review feature preview',
    videoDescription: 'Short Evrima feature preview accompanying verified buyer reviews.',
  },
  faq: {
    image: ISLE_ESP_RIVER,
    alt: 'Evrima ESP gameplay accompanying pre-purchase questions',
    title: 'Evrima ESP FAQ Preview',
    caption: 'Product screenshot accompanying compatibility, feature and checkout answers.',
  },
  support: {
    image: ISLE_ESP_FOREST,
    alt: 'Evrima ESP gameplay accompanying load and inject support',
    title: 'The Isle Cheats Support Preview',
    caption: 'Gameplay reference for post-purchase load, inject and delivery help.',
  },
} as const satisfies Record<string, SeoMediaItem>

const FORUM_MEDIA: Record<string, SeoMediaItem> = {
  'features-list': {
    ...PAGE_MEDIA.product,
    alt: 'Entity ESP and World ESP features shown during Evrima gameplay',
    title: 'Evrima ESP Feature List Preview',
    caption: 'Visible reference for Entity ESP, radar and miscellaneous product features.',
  },
  hotkeys: {
    ...PAGE_MEDIA.home,
    alt: 'The Isle ESP overlay used while configuring menu hotkeys',
    title: 'ESP Menu Hotkey Preview',
    caption: 'Evrima gameplay reference for ESP, radar and stream-proof hotkeys.',
  },
  'complete-setup': {
    ...PAGE_MEDIA.product,
    alt: 'Evrima ESP running after the complete loader setup',
    title: 'Complete Evrima Setup Preview',
    caption: 'Expected in-game ESP view after delivery, exclusions and clean load order.',
  },
  'disable-antivirus': {
    ...PAGE_MEDIA.home,
    alt: 'The Isle ESP gameplay after the delivered loader is allowlisted',
    title: 'Loader Exclusion Setup Preview',
    caption: 'Gameplay reference for the antivirus exclusion and loader setup thread.',
  },
  'undetected-status': {
    ...PAGE_MEDIA.product,
    alt: 'Evrima ESP gameplay used to illustrate current product status',
    title: 'Evrima Loader Status Preview',
    caption: 'Gameplay reference for checking Undetected or Updating before loading.',
  },
}

export function getForumMedia(slug: string): SeoMediaItem {
  return FORUM_MEDIA[slug] || PAGE_MEDIA.forums
}
