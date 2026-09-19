import {useState} from 'react'
import {CheckCircle2, Trash2} from 'lucide-react'
import type {VideoRecord} from '../../types'
import {formatFileSize, formatDuration} from '../../utils'
import ConfirmDialog from '../ui/ConfirmDialog'
import VideoUploader from './VideoUploader'

interface VideoLibraryProps {
  videos: VideoRecord[]
  activeVideoId: string | null
  getVideoUrl: (id: string) => string | null
  onAddFiles: (files: File[]) => void
  onUse: (id: string) => void
  onDelete: (id: string) => void
}

export default function VideoLibrary({
  videos,
  activeVideoId,
  getVideoUrl,
  onAddFiles,
  onUse,
  onDelete
}: VideoLibraryProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const pendingVideo = videos.find((v) => v.id === pendingDeleteId) ?? null

  return (
    <div className="video-library">
      <VideoUploader onFiles={onAddFiles} variant="dropzone" />

      {videos.length === 0 ? (
        <p className="video-library__empty">No videos added yet.</p>
      ) : (
        <ul className="video-library__list">
          {videos.map((video) => {
            const isActive = video.id === activeVideoId
            const url = getVideoUrl(video.id)
            return (
              <li key={video.id} className={`video-card ${isActive ? 'video-card--active' : ''}`}>
                <div className="video-card__preview">
                  {url && <video src={url} muted preload="metadata" />}
                </div>
                <div className="video-card__info">
                  <span className="video-card__name" title={video.name}>
                    {video.name}
                  </span>
                  <span className="video-card__meta">
                    {formatFileSize(video.size)} · {formatDuration(video.duration)}
                  </span>
                </div>
                <div className="video-card__actions">
                  {isActive ? (
                    <span className="video-card__active-badge">
                      <CheckCircle2 size={14} aria-hidden="true" />
                      Active
                    </span>
                  ) : (
                    <button type="button" className="btn btn--ghost btn--small" onClick={() => onUse(video.id)}>
                      Use
                    </button>
                  )}
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => setPendingDeleteId(video.id)}
                    aria-label={`Delete ${video.name}`}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {pendingVideo && (
        <ConfirmDialog
          title="Delete this video?"
          description={`"${pendingVideo.name}" will be permanently removed from your library.`}
          confirmLabel="Delete"
          onConfirm={() => {
            onDelete(pendingVideo.id)
            setPendingDeleteId(null)
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </div>
  )
}
