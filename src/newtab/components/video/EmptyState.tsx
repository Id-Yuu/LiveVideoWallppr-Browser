import VideoUploader from './VideoUploader'

interface EmptyStateProps {
  onFiles: (files: File[]) => void
}

export default function EmptyState({onFiles}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p className="empty-state__title">Your New Tab is ready.</p>
      <p className="empty-state__subtitle">Add a local video to create your animated wallpaper.</p>
      <VideoUploader variant="button" onFiles={onFiles} label="Add Video" />
    </div>
  )
}
