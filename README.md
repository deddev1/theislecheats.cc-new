# The Isle Cheats (theislecheats.cc)

Static Astro site for The Isle (Evrima) cheats — Cloudflare Pages ready.

## Stack

- Astro 5 (static output)
- React islands (`@astrojs/react`)
- Tailwind CSS
- Custom split sitemaps (`npm run generate:sitemaps`)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev on port 5174 |
| `npm run build` | Generate sitemaps + `astro build` → `dist/` |
| `npm run preview` | Preview production build |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run lint` | Oxlint |

## Cloudflare (Pages or Workers Builds)

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy` (uses `wrangler.toml` `[assets]` → `dist/`)
- **Pages Git only:** leave deploy empty; set **output directory** to `dist`
- **Node version:** 22 (or latest LTS)
- **Framework preset:** None / Astro (static)

Deploy artifacts include:

- `public/_headers` → cache + security headers (`/_astro/*` immutable)
- `public/_redirects` → unknown paths serve `404.html` with status 404

No Cloudflare adapter is required for static Pages hosting.
