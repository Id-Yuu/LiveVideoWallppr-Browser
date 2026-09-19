import {forwardRef, useEffect, useRef, useState} from 'react'
import {Play} from 'lucide-react'
import {TRANSITION_DURATION_MS} from '../../constants'
import type {VideoFit} from '../../types'

interface VideoBackgroundProps {
  src: string | null
  fit: VideoFit
  autoplay: boolean
  loop: boolean
  muted: boolean
  volume: number
  playbackSpeed: number
  blurEnabled: boolean
  blurAmount: number
  onError: (message: string) => void
}

const VideoBackground = forwardRef<HTMLVideoElement, VideoBackgroundProps>(
  function VideoBackground(
    {src, fit, autoplay, loop, muted, volume, playbackSpeed, blurEnabled, blurAmount, onError},
    forwardedRef
  ) {
    const innerRef = useRef<HTMLVideoElement | null>(null)
    const [displayedSrc, setDisplayedSrc] = useState(src)
    const [visible, setVisible] = useState(true)
    const [autoplayBlocked, setAutoplayBlocked] = useState(false)

    const setRefs = (node: HTMLVideoElement | null) => {
      innerRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    }

    useEffect(() => {
      if (src === displayedSrc) return
      setVisible(false)
      const timer = window.setTimeout(() => {
        setDisplayedSrc(src)
        setVisible(true)
      }, TRANSITION_DURATION_MS)
      return () => window.clearTimeout(timer)
    }, [src, displayedSrc])

    useEffect(() => {
      const video = innerRef.current
      if (!video) return
      video.volume = volume
      video.playbackRate = playbackSpeed
    }, [volume, playbackSpeed, displayedSrc])

    useEffect(() => {
      const video = innerRef.current
      if (!video || !displayedSrc || !autoplay) return

      const attemptPlay = () => {
        video.play().then(
          () => setAutoplayBlocked(false),
          () => setAutoplayBlocked(true)
        )
      }
      attemptPlay()
    }, [displayedSrc, autoplay, muted])

    const handleManualPlay = () => {
      const video = innerRef.current
      if (!video) return
      video.play().then(
        () => setAutoplayBlocked(false),
        () => onError('Playback was blocked by the browser.')
      )
    }

    if (!displayedSrc) return null

    return (
      <div className="video-background">
        <video
          ref={setRefs}
          key={displayedSrc}
          src={displayedSrc}
          className={`video-background__video video-background__video--${fit}`}
          style={{
            opacity: visible ? 1 : 0,
            filter: blurEnabled && blurAmount > 0 ? `blur(${blurAmount}px)` : undefined
          }}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          playsInline
          onError={() => onError('Unable to load this video. The file may be corrupted or unsupported.')}
        />
        {autoplayBlocked && (
          <button
            type="button"
            className="video-background__play-hint"
            onClick={handleManualPlay}
            aria-label="Play video"
          >
            <Play size={22} aria-hidden="true" />
            <span>Click to play</span>
          </button>
        )}
      </div>
    )
  }
)

export default VideoBackground
