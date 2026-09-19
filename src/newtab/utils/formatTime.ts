export function formatDuration(totalSeconds: number | null | undefined): string {
  if (!totalSeconds || !Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '--:--'
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/** Reads a video file's duration by loading its metadata into a detached <video> element. */
export function readVideoDuration(blob: Blob): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true

    const cleanup = () => {
      URL.revokeObjectURL(url)
      video.removeAttribute('src')
      video.load()
    }

    const timeout = window.setTimeout(() => {
      cleanup()
      resolve(null)
    }, 8000)

    video.onloadedmetadata = () => {
      window.clearTimeout(timeout)
      const duration = Number.isFinite(video.duration) ? video.duration : null
      cleanup()
      resolve(duration)
    }

    video.onerror = () => {
      window.clearTimeout(timeout)
      cleanup()
      resolve(null)
    }

    video.src = url
  })
}
