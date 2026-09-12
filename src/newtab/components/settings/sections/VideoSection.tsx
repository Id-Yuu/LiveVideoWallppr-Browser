import type {Settings, VideoRecord} from '../../../types'
import VideoControls from '../../video/VideoControls'

interface VideoSectionProps {
  settings: Settings
  activeVideo: VideoRecord | null
  onChange: (patch: Partial<Settings>) => void
}

export default function VideoSection({settings, activeVideo, onChange}: VideoSectionProps) {
  return (
    <section className="settings-section">
      <h3 className="settings-section__title">Video</h3>
      <div className="settings-section__body">
        <div className="active-video-row">
          <span className="field-group__label">Active Video</span>
          <span className="active-video-row__name">{activeVideo ? activeVideo.name : 'None selected'}</span>
        </div>
      </div>
      <VideoControls settings={settings} onChange={onChange} />
    </section>
  )
}
