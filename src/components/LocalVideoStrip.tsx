import { useEffect, useRef, useState } from 'react'

const REVIEWS_VIDEO = '/videos/reviews-neon.webm'
const START_AT = 5

type LocalVideoStripProps = {
  className?: string
  src?: string
  startAt?: number
  /** Start loading immediately (home strip) */
  eager?: boolean
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function LocalVideoStrip({
  className = '',
  src = REVIEWS_VIDEO,
  startAt = START_AT,
  eager = false,
}: LocalVideoStripProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(eager)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (eager) return

    const root = wrapRef.current
    if (!root) return

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px', threshold: 0 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [eager])

  useEffect(() => {
    if (!active) return
    const video = ref.current
    if (!video) return

    let cancelled = false
    let showTimer: ReturnType<typeof setTimeout> | undefined

    video.muted = true
    video.playsInline = true
    video.loop = true
    video.controls = false

    const show = () => {
      if (!cancelled) setVisible(true)
    }

    const jumpStart = () => {
      if (!video.duration || video.duration <= startAt) return
      try {
        if (video.currentTime < startAt - 0.2) {
          video.currentTime = startAt
        }
      } catch {
        /* ignore */
      }
    }

    const play = () => {
      void video
        .play()
        .then(show)
        .catch(() => {
          show()
          video.muted = true
          void video.play().catch(() => show())
        })
    }

    const onLoadedData = () => show()

    const onCanPlay = () => {
      jumpStart()
      play()
    }
    const onPlaying = () => show()
    const onEnded = () => {
      try {
        video.currentTime = video.duration > startAt ? startAt : 0
      } catch {
        /* ignore */
      }
      void video.play().catch(() => {})
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('ended', onEnded)

    showTimer = setTimeout(show, 1800)

    if (video.readyState >= 2) onCanPlay()
    else video.load()

    return () => {
      cancelled = true
      if (showTimer) clearTimeout(showTimer)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', onEnded)
    }
  }, [active, src, startAt])

  return (
    <div
      ref={wrapRef}
      className={`video-strip relative w-full overflow-hidden pointer-events-none select-none ${className}`.trim()}
    >
      <div className="absolute inset-0 z-0 bg-z-band" aria-hidden />
      {active ? (
        <video
          ref={ref}
          className={`video-strip-local absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          src={src}
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
          controls={false}
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
        />
      ) : null}
      <div className="video-strip-tint pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div className="video-strip-tint-glow pointer-events-none absolute inset-0 z-[2]" aria-hidden />
    </div>
  )
}
