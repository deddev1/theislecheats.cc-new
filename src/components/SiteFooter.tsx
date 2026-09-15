import { LogoMark } from './LogoMark'
import { SiteLinkHub } from './SiteLinkHub'
import { OFFICIAL_ISLE_LINKS, SITE_GUIDE_LINKS, SITE_PAGE_LINKS } from '../data/links'
import { SITE_NAME, SITE_URL } from '../data/site'

type SiteFooterProps = {
  currentPath?: string
}

export function SiteFooter({ currentPath }: SiteFooterProps) {
  const hubPath = currentPath || '/'

  return (
    <>
      <SiteLinkHub currentPath={hubPath} />

      <footer className="page-x border-t border-z-soft/15 bg-z-band py-12">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark className="text-z-soft" />
              <span className="font-semibold text-z-ink">{SITE_NAME}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Undetected The Isle cheats for Evrima. Status checked. Features listed. Built for{' '}
              <a
                href={OFFICIAL_ISLE_LINKS[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/75 underline-offset-2 hover:text-white hover:underline"
              >
                The Isle
              </a>{' '}
              players only.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Site pages
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/65">
              {SITE_PAGE_LINKS.map((l) => (
                <li key={l.to}>
                  <a href={l.to} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Forums
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/65">
              {SITE_GUIDE_LINKS.map((l) => (
                <li key={l.to}>
                  <a href={l.to} className="hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/forums" className="hover:text-white">
                  All forums →
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Official The Isle
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/65">
              {OFFICIAL_ISLE_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={SITE_URL} className="hover:text-white">
                  theislecheats.cc
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" className="hover:text-white">
                  XML sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs text-white/35">
          © {new Date().getFullYear()} {SITE_NAME}. Not affiliated with Afterthought LLC or
          the official The Isle game.
        </p>
      </footer>
    </>
  )
}
