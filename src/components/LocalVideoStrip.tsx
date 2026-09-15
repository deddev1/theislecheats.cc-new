import { useEffect, useRef, useState } from 'react'

const REVIEWS_VIDEO = '/videos/reviews-neon'

type LocalVideoStripProps = {
  className?: string
  /** Path without extension, e.g. `/videos/home-wave` — serves .webm + .mp4 */
  src?: string
  /** Optional soft seek after playback starts (seconds). Prefer 0 for reliability. */
  startAt?: number
  /** Start loading immediately (home / reviews strips) */
  eager?: boolean
  poster?: string
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function stripBase(src: string) {
  return src.replace(/\.(webm|mp4)$/i, '')
}

export function LocalVideoStrip({
  className = '',
  src = REVIEWS_VIDEO,
  startAt = 0,
  eager = false,
  poster = '/media/theisle-cheats-esp-forest.jpg',
}: LocalVideoStripProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(eager)
  const [failed, setFailed] = useState(false)
  const base = stripBase(src)

  useEffect(() => {
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
      { rootMargin: '600px 0px', threshold: 0 },
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
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    let seekTimer: ReturnType<typeof setTimeout> | undefined
    const reduced = prefersReducedMotion()

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = true
    video.controls = false
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    const show = () => {
      if (!cancelled) setVisible(true)
    }

    const softSeek = () => {
      if (!startAt || reduced) return
      if (!Number.isFinite(video.duration) || video.duration <= startAt + 0.5) return
      try {
        if (Math.abs(video.currentTime - startAt) > 0.35) {
          video.currentTime = startAt
        }
      } catch {
        /* ignore seek failures — keep playing from current frame */
      }
    }

    const play = () => {
      if (cancelled) return
      if (reduced) {
        show()
        return
      }
      void video
        .play()
        .then(() => {
          show()
          seekTimer = setTimeout(softSeek, 250)
        })
        .catch(() => {
          if (video.readyState >= 2) show()
          retryTimer = setTimeout(() => {
            if (cancelled) return
            void video.play().then(show).catch(() => show())
          }, 350)
        })
    }

    const onLoadedData = () => play()
    const onCanPlay = () => play()
    const onPlaying = () => show()
    const onEnded = () => {
      softSeek()
      void video.play().catch(() => {})
    }
    const onError = () => {
      setFailed(true)
      show()
    }
    const onVisibility = () => {
      if (document.hidden || reduced || cancelled) return
      if (video.paused) void video.play().catch(() => {})
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisibility)

    showTimer = setTimeout(show, 900)

    if (video.readyState >= 2) play()
    else video.load()

    return () => {
      cancelled = true
      if (showTimer) clearTimeout(showTimer)
      if (retryTimer) clearTimeout(retryTimer)
      if (seekTimer) clearTimeout(seekTimer)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [active, base, startAt])

  return (
    <div
      ref={wrapRef}
      className={`video-strip relative w-full overflow-hidden pointer-events-none select-none ${className}`.trim()}
    >
      <div className="absolute inset-0 z-0 bg-z-band" aria-hidden />
      {poster ? (
        <img
          src={poster}
          alt=""
          aria-hidden
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-70"
        />
      ) : null}
      {active && !failed ? (
        <video
          ref={ref}
          className={`video-strip-local absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          autoPlay
          playsInline
          loop
          preload="auto"
          poster={poster}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      ) : null}
      <div className="video-strip-tint pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div className="video-strip-tint-glow pointer-events-none absolute inset-0 z-[2]" aria-hidden />
    </div>
  )
}
