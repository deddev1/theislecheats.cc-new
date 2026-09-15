import { Navbar } from '../components/Navbar'
import { SiteFooter } from '../components/SiteFooter'
import { SITE_HOST, SITE_NAME } from '../data/site'

export function SitemapPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-z-bg text-white">
      <div className="border-b border-z-soft/15 bg-z-bg/90 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="page-body">
        <section className="page-x pt-12 sm:pt-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
              {SITE_NAME} · {SITE_HOST}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              HTML sitemap
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/55">
              Browse every indexed page on this site. Search engines use the XML sitemap at{' '}
              <a
                href="/sitemap.xml"
                className="font-medium text-white underline-offset-2 hover:underline"
              >
                /sitemap.xml
              </a>
              — open that file in Chrome or Edge if an IDE preview shows a script error (raw XML
              is not an HTML page).
            </p>
          </div>
        </section>

        <SiteFooter currentPath="/sitemap" />
      </main>
    </div>
  )
}
