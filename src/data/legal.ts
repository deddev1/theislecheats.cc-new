export type LegalSection = {
  heading: string
  paragraphs: string[]
}

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Overview',
    paragraphs: [
      'The Isle Cheats (theislecheats.cc) explains here what we collect when you browse this site or complete checkout through our linked payment provider.',
      'We do not operate The Isle game servers or Easy Anti-Cheat. This policy covers this website and buyer support tied to purchases made through our checkout flow.',
    ],
  },
  {
    heading: 'Information we collect',
    paragraphs: [
      'When you visit, our host and analytics may log standard technical data such as IP address, browser type, pages viewed, and referral URL.',
      'When you buy, payment and delivery are handled by our checkout partner. We receive what is needed to fulfill your order (for example email, transaction reference, and license delivery status) — not your full card number.',
    ],
  },
  {
    heading: 'How we use information',
    paragraphs: [
      'We use data to run the site, show live product status, deliver loader access, answer support tickets, and prevent abuse or fraud.',
      'We do not sell personal information to third-party marketers.',
    ],
  },
  {
    heading: 'Cookies and local storage',
    paragraphs: [
      'The site may use essential cookies or local storage for security, preferences, or checkout handoff. You can limit cookies in your browser settings; some features may not work if you block them entirely.',
    ],
  },
  {
    heading: 'Retention and security',
    paragraphs: [
      'We keep order and support records only as long as needed for delivery, refunds, chargebacks, and legal obligations, then delete or anonymize where practical.',
      'No online service is perfectly secure; use a unique email and protect your checkout account credentials.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      'You may request access, correction, or deletion of personal data we control by contacting us through the Support page with your order reference.',
      'If you are in a region with additional privacy rights, describe your request and we will respond within a reasonable time.',
    ],
  },
  {
    heading: 'Updates',
    paragraphs: [
      'We may update this policy when our practices or checkout flow changes. The effective date at the top of this page will change when we do.',
    ],
  },
]

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'Agreement',
    paragraphs: [
      'By using theislecheats.cc you agree to these terms. If you do not agree, do not use the site or purchase through our checkout links.',
      'The Isle Cheats is a third-party product for The Isle (Evrima). We are not affiliated with Afterthought LLC or the official game.',
    ],
  },
  {
    heading: 'Eligibility and acceptable use',
    paragraphs: [
      'You must be old enough to form a binding contract in your jurisdiction and legally allowed to use game modification software where you live.',
      'You are responsible for complying with the game’s terms of service, anti-cheat rules, and applicable laws. Use at your own risk.',
    ],
  },
  {
    heading: 'Product and status',
    paragraphs: [
      'Features, compatibility, and Undetected or Updating status are described on this site and may change after game or anti-cheat updates.',
      'We do not guarantee uninterrupted access, specific detection outcomes, or fitness for a particular purpose beyond what is stated at checkout.',
    ],
  },
  {
    heading: 'Purchases and delivery',
    paragraphs: [
      'Prices and offers are shown before you leave for checkout. Delivery is digital — loader and license details are provided after successful payment per the checkout provider’s instructions.',
      'Chargebacks or payment fraud may result in revoked access and a ban from future support.',
    ],
  },
  {
    heading: 'Refunds',
    paragraphs: [
      'Refund eligibility depends on the checkout provider’s policy and whether the product was delivered and used. Contact Support with your order ID before disputing with your bank.',
      'We may refuse refunds when status was clearly marked Updating, when the build was used after a public detection, or when abuse is suspected.',
    ],
  },
  {
    heading: 'Intellectual property',
    paragraphs: [
      'Site content, branding, and first-party media are owned by The Isle Cheats or used with permission. The Isle and related marks belong to their respective owners.',
      'You may not scrape, mirror, or resell our site content or loader links without written permission.',
    ],
  },
  {
    heading: 'Disclaimer and liability',
    paragraphs: [
      'The site and software are provided “as is” to the fullest extent permitted by law. We are not liable for game bans, data loss, hardware issues, or indirect damages arising from use of cheats or loaders.',
    ],
  },
  {
    heading: 'Changes and contact',
    paragraphs: [
      'We may update these terms. Continued use after changes means you accept the revised terms.',
      'Questions: use the Support page on theislecheats.cc with a clear subject and order reference when applicable.',
    ],
  },
]

export const LEGAL_EFFECTIVE_DATE = '2026-03-15'
