import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {VideoRecord} from '../types'
import * as videoStorage from '../services/videoStorage'

export interface UseVideosResult {
  videos: VideoRecord[]
  isLoading: boolean
  error: string | null
  clearError: () => void
  addVideo: (file: File) => Promise<VideoRecord | null>
  deleteVideo: (id: string) => Promise<void>
  deleteAll: () => Promise<void>
  getVideoUrl: (id: string) => string | null
}

export function useVideos(): UseVideosResult {
  const [videos, setVideos] = useState<VideoRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videosRef = useRef<VideoRecord[]>([])
  videosRef.current = videos

  useEffect(() => {
    let cancelled = false

    videoStorage
      .listVideos()
      .then((list) => {
        if (!cancelled) setVideos(list)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load your video library.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
      videoStorage.revokeAllVideoUrls()
    }
  }, [])

  const addVideo = useCallback(async (file: File): Promise<VideoRecord | null> => {
    setError(null)
    try {
      const {video} = await videoStorage.addVideoFile(file)
      setVideos((prev) => [...prev, video])
      return video
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add this video.')
      return null
    }
  }, [])

  const deleteVideo = useCallback(async (id: string) => {
    setError(null)
    try {
      await videoStorage.removeVideo(id)
      videoStorage.revokeVideoUrl(id)
      setVideos((prev) => prev.filter((v) => v.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete this video.')
    }
  }, [])

  const deleteAll = useCallback(async () => {
    setError(null)
    try {
      await videoStorage.removeAllVideos()
      videoStorage.revokeAllVideoUrls()
      setVideos([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete your videos.')
    }
  }, [])

  const getVideoUrl = useCallback((id: string): string | null => {
    const record = videosRef.current.find((v) => v.id === id)
    if (!record) return null
    return videoStorage.createVideoUrl(record)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return useMemo(
    () => ({videos, isLoading, error, clearError, addVideo, deleteVideo, deleteAll, getVideoUrl}),
    [videos, isLoading, error, clearError, addVideo, deleteVideo, deleteAll, getVideoUrl]
  )
}
