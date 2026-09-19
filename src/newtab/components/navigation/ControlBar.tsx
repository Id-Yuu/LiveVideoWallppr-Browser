import {Pause, Play, RotateCcw, Settings, Volume2, VolumeX} from 'lucide-react'

interface ControlBarProps {
  hasVideo: boolean
  isPlaying: boolean
  muted: boolean
  onTogglePlay: () => void
  onRestart: () => void
  onToggleMute: () => void
  onOpenSettings: () => void
}

export default function ControlBar({
  hasVideo,
  isPlaying,
  muted,
  onTogglePlay,
  onRestart,
  onToggleMute,
  onOpenSettings
}: ControlBarProps) {
  return (
    <div className="control-bar">
      {hasVideo && (
        <>
          <button
            type="button"
            className="icon-btn icon-btn--glass"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--glass"
            onClick={onRestart}
            aria-label="Restart video"
          >
            <RotateCcw size={15} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--glass"
            onClick={onToggleMute}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
          </button>
        </>
      )}
      <button
        type="button"
        className="icon-btn icon-btn--glass"
        onClick={onOpenSettings}
        aria-label="Open settings"
        aria-expanded={false}
      >
        <Settings size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
