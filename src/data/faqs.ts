export type FaqItem = {
  q: string
  a: string
}

/** Master FAQ — visible on /faq and reused in sections. */
export const SITE_FAQS: FaqItem[] = [
  {
    q: 'What are The Isle Cheats?',
    a: 'The Isle Cheats are tools for The Isle Evrima on theislecheats.cc — mainly Entity ESP, World ESP, wallhack, radar, and HWID spoofer — with live Undetected or Updating status after patches.',
  },
  {
    q: 'Do you cover other games?',
    a: 'No. theislecheats.cc sells The Isle Cheats only. No filler catalog of unrelated titles.',
  },
  {
    q: 'Is aimbot the main feature?',
    a: 'No. Aim assist is optional. Most buyers come for The Isle ESP, wallhack, radar, and HWID spoofer.',
  },
  {
    q: 'Are The Isle Cheats undetected against EAC?',
    a: 'We mark live Undetected or Updating status after The Isle / Easy Anti-Cheat updates. Always check status on theislecheats.cc before you inject.',
  },
  {
    q: 'What features are included?',
    a: 'Entity ESP / wallhack, World ESP, radar, HWID spoofer, stream-proof, and optional aim assist — focused on The Isle only. See the Features List guide for the full checklist.',
  },
  {
    q: 'Do you support Evrima and Horde?',
    a: 'Yes — The Isle Cheats target Evrima first. Horde support is listed when the current build includes it.',
  },
  {
    q: 'How do I buy The Isle Cheats?',
    a: 'Start on the homepage, confirm Undetected status and review the price. Open Product details for compatibility and features, then continue to checkout for instant loader delivery.',
  },
  {
    q: 'How to load / inject The Isle Cheats?',
    a: 'After checkout, follow the Complete Setup forum thread for the current load order and inject troubleshooting. If status is Updating, wait rather than forcing an outdated build.',
  },
  {
    q: 'Do I need a HWID spoofer?',
    a: 'Only if you already have a hardware ban. Spoof first, then load The Isle Cheats when status is Undetected.',
  },
  {
    q: 'Where do I get The Isle Cheats support?',
    a: 'Use the Support page and your checkout order channel. Include Undetected/Updating status and whether you need load, inject, or spoofer help.',
  },
  {
    q: 'Where can I read The Isle Cheats reviews?',
    a: 'Player reviews with ratings are on the Reviews page. They cover ESP accuracy, Undetected honesty, and patch survival before you buy.',
  },
  {
    q: 'Is this the official The Isle game site?',
    a: 'No. We sell The Isle Cheats only. Play the game from the official Survive The Isle website or The Isle on Steam. We are not affiliated with Afterthought LLC.',
  },
]

/** Commercial questions on the homepage — paraphrased vs /faq; FAQPage schema only on /faq. */
export const HOME_FAQS: FaqItem[] = [
  {
    q: 'Are The Isle Cheats undetected against EAC?',
    a:
      'After each The Isle or Easy Anti-Cheat patch we label the build Undetected or Updating on theislecheats.cc. Check that badge before you load or inject.',
  },
  {
    q: 'What features are included?',
    a:
      'Core kit covers Entity ESP, World ESP, radar, HWID spoofer, and stream-proof mode, with optional aim assist. Open the Features List forum thread for the full checklist.',
  },
  {
    q: 'Do you support Evrima and Horde?',
    a:
      'Evrima is the primary target. Horde appears on the product page when the active build lists it — we do not claim modes the current loader does not ship.',
  },
  {
    q: 'How do I buy The Isle Cheats?',
    a:
      'From the homepage, confirm status is Undetected, skim price and compatibility on Product details, then continue to checkout for instant digital delivery.',
  },
]

export const PRODUCT_PAGE_FAQS: FaqItem[] = [
  SITE_FAQS[3],
  SITE_FAQS[4],
  SITE_FAQS[5],
  SITE_FAQS[6],
  SITE_FAQS[8],
]
