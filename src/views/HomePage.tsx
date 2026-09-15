import { ArrowRight, Crosshair, Eye, Shield, Sparkles } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { VideoBg } from '../components/VideoBg'
import { LocalVideoStrip } from '../components/LocalVideoStrip'
import { SiteFooter } from '../components/SiteFooter'
import { HeroSearch } from '../components/HeroSearch'
import { FaqSection } from '../components/FaqSection'
import { SeoMedia } from '../components/SeoMedia'
import { guidePath } from '../data/games'
import { CheckoutLink } from '../components/CheckoutLink'
import { HOME_FAQS } from '../data/faqs'
import { HOME_HEADINGS, SITE_HOST, SITE_NAME, SITE_PURPOSE } from '../data/site'
import { BLOGS, blogPath } from '../data/blogs'
import { PAGE_MEDIA } from '../data/media'

const FEATURES = [
  {
    icon: Eye,
    label: 'The Isle ESP / Wallhack',
    desc: 'See players and dinos through fog and trees. Distance and health when the build supports it.',
  },
  {
    icon: Shield,
    label: 'The Isle HWID Spoofer',
    desc: 'Hardware reset path if you catch a ban. Pair it with the current Evrima build.',
  },
  {
    icon: Sparkles,
    label: 'Undetected patch status',
    desc: 'We mark Undetected or Updating after The Isle patches so you don’t buy a dead product.',
  },
  {
    icon: Crosshair,
    label: 'Optional aim assist',
    desc: 'Available if you want it — The Isle Cheats here lead with ESP, wallhack, and awareness.',
  },
] as const

export function HomePage() {
  return (
    <div className="relative z-10 min-h-screen overflow-x-hidden text-white">
      <section id="home" className="relative flex min-h-screen flex-col overflow-x-clip">
        <VideoBg />

        <div className="relative z-20 flex min-h-screen flex-col">
          <Navbar onVideo />

          <main className="page-x mt-auto pb-8 sm:pb-12 lg:pb-16">
            <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="relative z-30 max-w-xl">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-z-soft/80">
                  Evrima · Undetected · {SITE_HOST}
                </p>
                <h1 className="text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                  {HOME_HEADINGS.h1}
                </h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                  Buy The Isle Cheats for Evrima with ESP, wallhack, radar, and an HWID
                  spoofer. Check live patch status and price before checkout on {SITE_HOST}.
                </p>

                <div className="relative z-50 mt-7">
                  <HeroSearch placeholder="Search The Isle Cheats…" />
                </div>
              </div>

              <div className="relative z-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:w-[34rem] lg:shrink-0">
                <div className="glass flex h-full min-h-[168px] flex-col justify-between rounded-2xl p-5 sm:min-h-[200px] sm:p-6">
                    <p
                    className="status-pill text-3xl font-normal tracking-tight sm:text-4xl"
                    style={{ fontFamily: "'Silkscreen', cursive" }}
                  >
                    UD
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/70 sm:mt-4">
                    Live undetected status for The Isle Evrima. Updated after patches — not
                    random Discord screenshots.
                  </p>
                </div>

                <div className="glass flex h-full min-h-[168px] flex-col rounded-2xl p-5 sm:min-h-[200px] sm:p-6">
                  <div className="mb-3 flex items-center gap-2 sm:mb-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-z-accent/30 text-xs font-bold text-z-soft">
                      TI
                    </div>
                    <span className="text-sm font-semibold text-white">The Isle</span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-white/80">
                    “Status was right. Grabbed The Isle ESP after the last patch and it held
                    up on Evrima.”
                  </p>
                  <div className="mt-4 flex items-center gap-3 sm:mt-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-z-accent/25 text-sm font-semibold text-z-ink">
                      JK
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">jayk</p>
                      <p className="text-xs text-white/60">Evrima player</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>

      <div className="hero-to-body" aria-hidden />

      <div className="page-body relative z-10">
        <section className="page-x py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              The Isle Cheats ESP gameplay
            </h2>
            <SeoMedia media={PAGE_MEDIA.home} priority />
          </div>
        </section>

        <section className="page-band page-x border-t border-z-soft/15 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {HOME_HEADINGS.h2Features}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="page-card flex h-full min-h-[168px] flex-col rounded-2xl p-5"
                >
                  <div className="icon-well mb-4">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{label}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-hidden
          className="relative border-y border-z-soft/20 bg-z-band"
        >
          <LocalVideoStrip src="/videos/home-wave.webm" startAt={0} eager />
        </section>

        <section id="picks" className="page-x py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                  Forums
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  The Isle Cheats forums
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                  Setup, antivirus, hotkeys, features, and load steps before you buy.
                </p>
              </div>
              <a
                href="/forums"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"
              >
                All forums
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BLOGS.slice(0, 3).map((post) => (
                <a
                  key={post.slug}
                  href={blogPath(post.slug)}
                  className="page-card group flex h-full flex-col rounded-2xl p-5 sm:p-6"
                >
                  <p className="text-xs uppercase tracking-wider text-white/45">{post.tag}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors group-hover:text-white/80">
                    Read guide
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                  </span>
                </a>
              ))}
            </div>

            <div className="page-card mt-8 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h3 className="text-lg font-semibold text-white">The Isle Cheats product</h3>
                <p className="mt-1 text-sm text-white/55">
                  Detailed features · compatibility · price · checkout
                </p>
              </div>
              <a
                href={guidePath('isle')}
                className="cta-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white"
              >
                View product details
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="page-band page-x border-t border-white/10 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
            <div className="page-card flex h-full min-h-[240px] flex-col justify-between rounded-2xl p-6 sm:rounded-3xl sm:p-8 lg:p-10">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                  About {SITE_NAME}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {HOME_HEADINGS.h2About}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
                  {SITE_PURPOSE} Clear features, honest Undetected status, buyer guides for
                  setup and load. Own the game via the{' '}
                  <a
                    href="https://www.survivetheisle.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 underline-offset-2 hover:underline"
                  >
                    official The Isle website
                  </a>{' '}
                  and{' '}
                  <a
                    href="https://store.steampowered.com/app/376210/The_Isle/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 underline-offset-2 hover:underline"
                  >
                    Steam
                  </a>
                  — then use{' '}
                  <a
                    href="/isle-cheats"
                    className="text-white/80 underline-offset-2 hover:underline"
                  >
                    product details
                  </a>
                  ,{' '}
                  <a
                    href="/reviews"
                    className="text-white/80 underline-offset-2 hover:underline"
                  >
                    reviews
                  </a>
                  , or{' '}
                  <a
                    href="/support"
                    className="text-white/80 underline-offset-2 hover:underline"
                  >
                    support
                  </a>
                  .
                </p>
              </div>
              <a
                href={guidePath('isle')}
                className="mt-8 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80"
              >
                View features and price
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </a>
            </div>

            <div
              id="access"
              className="page-card flex h-full min-h-[240px] flex-col justify-between rounded-2xl p-6 sm:rounded-3xl sm:p-8 lg:p-10"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                  Checkout
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {HOME_HEADINGS.h2Access}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
                  Confirm The Isle Cheats status is Undetected, then checkout for instant
                  delivery on supported Evrima builds.
                </p>
              </div>
              <CheckoutLink className="cta-gradient mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:w-fit">
                Buy The Isle Cheats
              </CheckoutLink>
            </div>
          </div>
        </section>

        <FaqSection
          id="faq"
          heading={HOME_HEADINGS.h2Faq}
          intro="Pre-purchase answers about status, compatibility, features, delivery, and checkout."
          items={HOME_FAQS}
        />

        <div className="page-x pb-10">
          <div className="mx-auto max-w-6xl">
            <a
              href="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-white/80"
            >
              View all The Isle Cheats FAQ
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>

        <SiteFooter currentPath="/" />
      </div>
    </div>
  )
}
