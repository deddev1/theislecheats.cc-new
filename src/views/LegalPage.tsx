import { Navbar } from '../components/Navbar'
import { SiteFooter } from '../components/SiteFooter'
import type { LegalSection } from '../data/legal'
import { LEGAL_EFFECTIVE_DATE } from '../data/legal'
import { SITE_HOST, SITE_NAME } from '../data/site'

type LegalPageProps = {
  docTitle: string
  intro: string
  sections: LegalSection[]
}

export function LegalPage({ docTitle, intro, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-z-bg text-white">
      <div className="border-b border-z-soft/15 bg-z-bg/90 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="page-body">
        <article className="page-x pt-12 sm:pt-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
              {SITE_NAME} · {SITE_HOST}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {docTitle}
            </h1>
            <p className="mt-2 text-sm text-white/45">Effective {LEGAL_EFFECTIVE_DATE}</p>
            <p className="mt-6 text-base leading-relaxed text-white/60">{intro}</p>

            <div className="mt-10 space-y-10">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-lg font-semibold text-white">{section.heading}</h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/55">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>

        <SiteFooter />
      </main>
    </div>
  )
}
