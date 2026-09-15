import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import {
  isSitemapXmlPath,
  shouldRedirectSitemapXmlToHtml,
} from './lib/sitemap-browser-request.mjs'

function sitemapXmlBrowserRedirectMiddleware(req, res, next) {
  const path = (req.url || '').split('?')[0]
  if (!isSitemapXmlPath(path)) return next()
  const request = {
    headers: {
      get(name) {
        const key = name.toLowerCase()
        const raw = req.headers[key]
        return Array.isArray(raw) ? raw[0] : raw
      },
    },
  }
  if (shouldRedirectSitemapXmlToHtml(request)) {
    res.writeHead(302, { Location: '/sitemap' })
    res.end()
    return
  }
  next()
}

export default defineConfig({
  site: 'https://www.theislecheats.cc',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    plugins: [
      {
        name: 'sitemap-xml-browser-redirect',
        configureServer(server) {
          server.middlewares.use(sitemapXmlBrowserRedirectMiddleware)
        },
        configurePreviewServer(server) {
          server.middlewares.use(sitemapXmlBrowserRedirectMiddleware)
        },
      },
    ],
    server: {
      port: 5175,
      strictPort: true,
    },
    build: {
      cssMinify: true,
      minify: 'esbuild',
      target: 'es2022',
      cssCodeSplit: true,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'icons'
            }
          },
        },
      },
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
})
