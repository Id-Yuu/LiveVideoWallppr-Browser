import type {Settings, VideoRecord} from '../../../types'
import Toggle from '../../ui/Toggle'
import VideoLibrary from '../../video/VideoLibrary'

interface ThemesSectionProps {
  videos: VideoRecord[]
  activeVideoId: string | null
  randomVideo: boolean
  getVideoUrl: (id: string) => string | null
  onAddFiles: (files: File[]) => void
  onUseVideo: (id: string) => void
  onDeleteVideo: (id: string) => void
  onChange: (patch: Partial<Settings>) => void
}

export default function ThemesSection({
  videos,
  activeVideoId,
  randomVideo,
  getVideoUrl,
  onAddFiles,
  onUseVideo,
  onDeleteVideo,
  onChange
}: ThemesSectionProps) {
  return (
    <section className="settings-section">
      <h3 className="settings-section__title">My Themes</h3>
      <VideoLibrary
        videos={videos}
        activeVideoId={activeVideoId}
        getVideoUrl={getVideoUrl}
        onAddFiles={onAddFiles}
        onUse={onUseVideo}
        onDelete={onDeleteVideo}
      />
      <Toggle
        label="Random Video"
        checked={randomVideo}
        onChange={(v) => onChange({randomVideo: v})}
      />
    </section>
  )
}
