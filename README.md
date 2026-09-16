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

## Cloudflare Workers Builds (Git: `deddev1/theislecheats.cc-new`)

- **Worker name:** `theislecheats-cc-new3` (must match `name` in `wrangler.toml`)
- **Production branch:** `main`
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Version command (optional):** `npx wrangler versions upload` (non-production branches)
- **Root directory:** `/`
- **Build watch paths:** include `*`, exclude `node_modules/**`, `.git/`
- **Pages Git only:** leave deploy empty; set **output directory** to `dist`
- **Node version:** 22 (or latest LTS)
- **Framework preset:** None / Astro (static)

Deploy artifacts include:

- `public/_headers` → cache + security headers (`/_astro/*` immutable)
- `public/_redirects` → unknown paths serve `404.html` with status 404

No Cloudflare adapter is required for static Pages hosting.
