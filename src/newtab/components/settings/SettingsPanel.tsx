import {useEffect, useRef} from 'react'
import {X} from 'lucide-react'
import type {Settings, Shortcut, VideoRecord} from '../../types'
import DataSection from './sections/DataSection'
import SearchSection from './sections/SearchSection'
import ShortcutsSection from './sections/ShortcutsSection'
import StickyNotesSection from './sections/StickyNotesSection'
import ThemesSection from './sections/ThemesSection'
import VideoSection from './sections/VideoSection'
import WeatherSection from './sections/WeatherSection'
import WidgetsSection from './sections/WidgetsSection'

export interface SettingsPanelProps {
  open: boolean
  settings: Settings
  videos: VideoRecord[]
  onChange: (patch: Partial<Settings>) => void
  onResetSettings: () => void
  onAddFiles: (files: File[]) => void
  onUseVideo: (id: string) => void
  onDeleteVideo: (id: string) => void
  onDeleteAllVideos: () => void
  getVideoUrl: (id: string) => string | null
  onClose: () => void
  onImportError: (message: string) => void
  onOpenShortcutModal: (shortcut: Shortcut | null) => void
}

export default function SettingsPanel({
  open,
  settings,
  videos,
  onChange,
  onResetSettings,
  onAddFiles,
  onUseVideo,
  onDeleteVideo,
  onDeleteAllVideos,
  getVideoUrl,
  onClose,
  onImportError,
  onOpenShortcutModal
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      panelRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  const activeVideo = videos.find((v) => v.id === settings.activeVideoId) ?? null

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <div
        ref={panelRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="drawer__header">
          <h2>Settings</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close settings">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="drawer__body">
          <VideoSection
            settings={settings}
            activeVideo={activeVideo}
            onChange={onChange}
          />

          <ThemesSection
            videos={videos}
            activeVideoId={settings.activeVideoId}
            randomVideo={settings.randomVideo}
            getVideoUrl={getVideoUrl}
            onAddFiles={onAddFiles}
            onUseVideo={onUseVideo}
            onDeleteVideo={onDeleteVideo}
            onChange={onChange}
          />

          <SearchSection
            settings={settings}
            onChange={onChange}
          />

          <WidgetsSection
            settings={settings}
            onChange={onChange}
          />

          <WeatherSection
            settings={settings}
            onChange={onChange}
          />

          <StickyNotesSection
            settings={settings}
            onChange={onChange}
          />

          <ShortcutsSection
            settings={settings}
            onChange={onChange}
            onOpenShortcutModal={onOpenShortcutModal}
          />

          <DataSection
            settings={settings}
            onChange={onChange}
            onResetSettings={onResetSettings}
            onDeleteAllVideos={onDeleteAllVideos}
            onImportError={onImportError}
          />
        </div>
      </div>
    </div>
  )
}
