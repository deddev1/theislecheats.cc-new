import { useEffect, useRef, useState } from 'react'

const HERO_VIDEO = '/videos/black-angel.webm'
const START_AT = 5

type VideoBgProps = {
  /** Static full-bleed hero image — skips video when set (homepage only). */
  image?: string
  imageAlt?: string
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function VideoBg({ image, imageAlt = '' }: VideoBgProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(Boolean(image))
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (image || prefersReducedMotion()) return

    const video = ref.current
    if (!video) return

    let cancelled = false
    let showTimer: ReturnType<typeof setTimeout> | undefined

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = true
    video.controls = false

    const show = () => {
      if (!cancelled) setVisible(true)
    }

    const jumpStart = () => {
      if (!video.duration || video.duration <= START_AT) return
      try {
        if (video.currentTime < START_AT - 0.2) {
          video.currentTime = START_AT
        }
      } catch {
        /* seek may fail until buffered — ignore */
      }
    }

    const play = () => {
      jumpStart()
      void video.play().then(show).catch(() => {
        /* autoplay blocked — still reveal once a frame exists */
        if (video.readyState >= 2) show()
      })
    }

    const onLoadedData = () => {
      jumpStart()
      play()
    }

    const onCanPlay = () => play()
    const onPlaying = () => show()
    const onSeeked = () => {
      void video.play().then(show).catch(() => show())
    }

    const onEnded = () => {
      try {
        video.currentTime = video.duration > START_AT ? START_AT : 0
      } catch {
        /* ignore */
      }
      void video.play().catch(() => {})
    }

    const onError = () => {
      setFailed(true)
    }

    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)

    // Failsafe: never leave the hero blank if play/seek stalls
    showTimer = setTimeout(show, 1800)

    if (video.readyState >= 2) onLoadedData()
    else video.load()

    return () => {
      cancelled = true
      if (showTimer) clearTimeout(showTimer)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
    }
  }, [image])

  return (
    <div className="hero-video-wrap absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 z-0 bg-z-bg" aria-hidden />
      {image ? (
        <img
          src={image}
          alt={imageAlt}
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
          className={`hero-video-bg absolute inset-0 z-[1] h-full w-full object-cover object-[78%_42%] sm:object-[72%_40%] transition-opacity duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : !failed ? (
        <video
          ref={ref}
          className={`hero-video-bg absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-700 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          src={HERO_VIDEO}
          muted
          playsInline
          loop
          preload="metadata"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
        />
      ) : null}
      <div className="hero-video-tint pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div className="hero-video-tint-glow pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-z-bg via-z-bg/80 to-transparent" />
      <div className="absolute inset-x-0 top-0 z-[3] h-24 bg-gradient-to-b from-z-bg/70 to-transparent" />
    </div>
  )
}
