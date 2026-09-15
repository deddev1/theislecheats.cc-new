import { Star } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { SiteFooter } from '../components/SiteFooter'
import { LocalVideoStrip } from '../components/LocalVideoStrip'
import { getReviewsAggregate, REVIEWS } from '../data/reviews'
import { CheckoutLink } from '../components/CheckoutLink'
import { SeoMedia } from '../components/SeoMedia'
import { SITE_NAME } from '../data/site'
import { PAGE_MEDIA } from '../data/media'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-z-soft text-z-soft' : 'text-z-soft/25'}`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

export function ReviewsPage() {
  const aggregate = getReviewsAggregate()

  return (
    <div className="min-h-screen overflow-x-hidden bg-z-bg text-white">
      <div className="border-b border-z-soft/15 bg-z-bg/90 backdrop-blur-xl">
        <Navbar />
      </div>

      <main className="page-body">
        <section className="page-x pt-12 sm:pt-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
              {SITE_NAME} · Community reviews
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              The Isle Cheats Reviews
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/55">
              Reviews from Evrima players who bought The Isle Cheats — ESP accuracy,
              Undetected honesty, and whether the build held after the last patch. Read the{' '}
              <a href="/isle-cheats" className="text-white/80 underline-offset-2 hover:underline">
                product page
              </a>
              ,{' '}
              <a href="/support" className="text-white/80 underline-offset-2 hover:underline">
                support
              </a>
              , or{' '}
              <a href="/forums" className="text-white/80 underline-offset-2 hover:underline">
                forums
              </a>
              . Play The Isle via{' '}
              <a
                href="https://store.steampowered.com/app/376210/The_Isle/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 underline-offset-2 hover:underline"
              >
                Steam
              </a>
              .
            </p>
            <p className="mt-3 text-sm text-white/45" aria-label="Aggregate rating">
              Average {aggregate.ratingValue} / 5 from {aggregate.reviewCount} The Isle Cheats
              reviews
            </p>
          </div>
        </section>

        <section className="page-x pt-10 sm:pt-12">
          <div className="mx-auto max-w-6xl">
            <SeoMedia media={PAGE_MEDIA.reviews} />
          </div>
        </section>

        <section
          aria-hidden
          className="relative mt-10 border-y border-z-soft/20 bg-z-band sm:mt-12"
        >
          <LocalVideoStrip
            src="/videos/reviews-neon"
            startAt={5}
            eager
            className="video-strip--reviews"
          />
        </section>

        <section className="page-x py-14 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-white">
              Latest The Isle Cheats feedback
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((review) => (
                <article
                  key={review.id}
                  className="page-card flex h-full min-h-[220px] flex-col rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-white/45">
                      {review.game}
                    </span>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
                    “{review.body}”
                  </p>
                  <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-z-accent/25 text-xs font-semibold text-z-ink">
                      {review.author
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.author}</p>
                      <p className="text-xs text-white/45">{review.role}</p>
                      <time
                        className="mt-0.5 block text-[11px] text-white/35"
                        dateTime={review.datePublished}
                      >
                        {review.datePublished}
                      </time>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-band page-x border-t border-white/10 py-16">
          <div className="page-card mx-auto grid max-w-6xl gap-6 overflow-hidden rounded-2xl p-6 sm:gap-8 sm:rounded-3xl sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-12">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                Next step
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Ready to buy The Isle Cheats?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Open the guide, confirm Undetected status, then checkout — or visit{' '}
                <a href="/support" className="text-white underline-offset-2 hover:underline">
                  The Isle Cheats support
                </a>{' '}
                for load and inject help.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <a
                href="/isle-cheats"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                Product details
              </a>
              <CheckoutLink className="cta-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white">
                Buy now
              </CheckoutLink>
            </div>
          </div>
        </section>

        <SiteFooter currentPath="/reviews" />
      </main>
    </div>
  )
}
