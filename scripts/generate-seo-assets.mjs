import { readFileSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const ogDir = join(root, 'public', 'og')
const mediaDir = join(root, 'public', 'media')

await Promise.all([
  mkdir(ogDir, { recursive: true }),
  mkdir(mediaDir, { recursive: true }),
])

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function artwork(width, height, eyebrow, title, subtitle) {
  const titleSize = Math.round(width * 0.066)
  const subtitleSize = Math.round(width * 0.026)
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#08060f"/>
          <stop offset="0.55" stop-color="#160824"/>
          <stop offset="1" stop-color="#2b0b45"/>
        </linearGradient>
        <radialGradient id="glow">
          <stop stop-color="#b040fb" stop-opacity=".7"/>
          <stop offset="1" stop-color="#b040fb" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="${width * 0.83}" cy="${height * 0.18}" r="${width * 0.34}" fill="url(#glow)"/>
      <circle cx="${width * 0.12}" cy="${height * 0.88}" r="${width * 0.28}" fill="url(#glow)" opacity=".35"/>
      <g transform="translate(${width * 0.075} ${height * 0.12})" fill="#d9a7ff">
        <path d="M60 60C60 93.1 33.1 120 0 120C0 86.9 26.9 60 60 60ZM60 60C93.1 60 120 86.9 120 120C86.9 120 60 93.1 60 60ZM0 0C33.1 0 60 26.9 60 60C26.9 60 0 33.1 0 0ZM120 0C120 33.1 93.1 60 60 60C60 26.9 86.9 0 120 0Z"/>
      </g>
      <text x="${width * 0.075}" y="${height * 0.47}" fill="#d9a7ff" font-size="${width * 0.022}" font-family="Arial, sans-serif" font-weight="700" letter-spacing="6">${escapeXml(eyebrow)}</text>
      <text x="${width * 0.075}" y="${height * 0.64}" fill="#ffffff" font-size="${titleSize}" font-family="Arial, sans-serif" font-weight="700">${escapeXml(title)}</text>
      <text x="${width * 0.075}" y="${height * 0.75}" fill="#c9bdd2" font-size="${subtitleSize}" font-family="Arial, sans-serif">${escapeXml(subtitle)}</text>
      <text x="${width * 0.075}" y="${height * 0.9}" fill="#8e8099" font-size="${width * 0.018}" font-family="Arial, sans-serif">theislecheats.cc</text>
    </svg>
  `)
}

await Promise.all([
  sharp(
    artwork(
      1200,
      630,
      'EVRIMA · LIVE STATUS · INSTANT DELIVERY',
      'The Isle Cheats',
      'ESP · Radar · Stream-proof · HWID Spoofer',
    ),
  )
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(join(ogDir, 'default.jpg')),
  sharp(
    artwork(
      1440,
      810,
      'PRODUCT DETAILS',
      'Evrima ESP',
      'Features · Compatibility · Price · Checkout',
    ),
  )
    .webp({ quality: 88 })
    .toFile(join(mediaDir, 'product-hero.webp')),
  sharp(
    artwork(
      1000,
      1000,
      'EVRIMA PRODUCT',
      'ESP & Radar',
      'Check status before checkout',
    ),
  )
    .webp({ quality: 88 })
    .toFile(join(mediaDir, 'product-cover.webp')),
  sharp(readFileSync(join(root, 'public', 'favicon.svg')))
    .resize(32, 32)
    .png()
    .toFile(join(root, 'public', 'favicon.ico')),
])

console.log('Generated first-party SEO and product artwork')
