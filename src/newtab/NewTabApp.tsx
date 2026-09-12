import {useCallback, useEffect, useRef, useState} from 'react'
import './styles/global.css'
import './styles/newtab.css'
import {
  ControlBar,
  EmptyState,
  Overlay,
  SettingsPanel,
  ShortcutModal,
  Toast,
  VideoBackground,
  WidgetLayout
} from './components'
import {
  useFileDrop,
  useKeyboardShortcuts,
  useSettings,
  useShortcutManager,
  useVideos
} from './hooks'
import type {VideoRecord} from './types'

export default function NewTabApp() {
  const {settings, isLoaded, updateSettings, reset} = useSettings()
  const {
    videos,
    isLoading: videosLoading,
    error: videoError,
    clearError,
    addVideo,
    deleteVideo,
    deleteAll,
    getVideoUrl
  } = useVideos()

  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [displayVideoId, setDisplayVideoId] = useState<string | null>(null)

  const hasRandomizedThisSession = useRef(false)
  const ready = isLoaded && !videosLoading

  const showError = useCallback((message: string) => setToastMessage(message), [])

  const {
    isModalOpen: shortcutModalOpen,
    editingShortcut,
    openAddModal: handleOpenAddShortcut,
    openEditModal: handleOpenEditShortcut,
    closeModal: handleCloseShortcutModal,
    saveShortcut: handleSaveShortcut,
    deleteShortcut: handleDeleteShortcut
  } = useShortcutManager({
    shortcuts: settings.shortcuts,
    onUpdateShortcuts: (updated) => updateSettings({shortcuts: updated})
  })

  const handleUseVideo = useCallback(
    (id: string) => {
      hasRandomizedThisSession.current = true
      setDisplayVideoId(id)
      updateSettings({activeVideoId: id, lastRandomVideoId: id})
    },
    [updateSettings]
  )

  const handleAddFiles = useCallback(
    async (files: File[]) => {
      let lastAdded: VideoRecord | null = null
      for (const file of files) {
        const added = await addVideo(file)
        if (added) lastAdded = added
      }
      if (lastAdded) handleUseVideo(lastAdded.id)
    },
    [addVideo, handleUseVideo]
  )

  const {isDragActive, dragProps} = useFileDrop({
    disabled: settingsOpen,
    onFiles: handleAddFiles
  })

  useEffect(() => {
    if (!videoEl) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    videoEl.addEventListener('play', onPlay)
    videoEl.addEventListener('pause', onPause)
    setIsPlaying(!videoEl.paused)
    return () => {
      videoEl.removeEventListener('play', onPlay)
      videoEl.removeEventListener('pause', onPause)
    }
  }, [videoEl])

  useEffect(() => {
    if (!ready || settings.randomVideo) return
    hasRandomizedThisSession.current = false
    setDisplayVideoId(settings.activeVideoId)
  }, [ready, settings.randomVideo, settings.activeVideoId])

  useEffect(() => {
    if (!ready || !settings.randomVideo || hasRandomizedThisSession.current) return
    if (videos.length === 0) {
      setDisplayVideoId(null)
      return
    }
    hasRandomizedThisSession.current = true
    let pool = videos
    if (videos.length > 1 && settings.lastRandomVideoId) {
      pool = videos.filter((v) => v.id !== settings.lastRandomVideoId)
    }
    const choice = pool[Math.floor(Math.random() * pool.length)] ?? videos[0]
    setDisplayVideoId(choice.id)
    updateSettings({lastRandomVideoId: choice.id, activeVideoId: choice.id})
  }, [ready, settings.randomVideo, settings.lastRandomVideoId, videos, updateSettings])

  useEffect(() => {
    if (!ready) return
    if (displayVideoId && !videos.some((v) => v.id === displayVideoId)) {
      setDisplayVideoId(null)
      if (settings.activeVideoId === displayVideoId) {
        updateSettings({activeVideoId: null})
      }
    }
  }, [ready, videos, displayVideoId, settings.activeVideoId, updateSettings])

  useEffect(() => {
    if (videoError) setToastMessage(videoError)
  }, [videoError])

  const togglePlay = useCallback(() => {
    if (!videoEl) return
    if (videoEl.paused) {
      videoEl.play().catch(() => showError('Playback was blocked by the browser.'))
    } else {
      videoEl.pause()
    }
  }, [videoEl, showError])

  const restartVideo = useCallback(() => {
    if (videoEl) videoEl.currentTime = 0
  }, [videoEl])

  const toggleMute = useCallback(() => {
    updateSettings({muted: !settings.muted})
  }, [settings.muted, updateSettings])

  useKeyboardShortcuts({
    enabled: !shortcutModalOpen,
    onTogglePlay: togglePlay,
    onRestart: restartVideo,
    onToggleMute: toggleMute,
    onToggleSettings: () => setSettingsOpen((open) => !open),
    onCloseSettings: () => setSettingsOpen(false)
  })

  const src = displayVideoId ? getVideoUrl(displayVideoId) : null
  const showEmptyState = ready && videos.length === 0

  return (
    <div className="app" {...dragProps}>
      <VideoBackground
        ref={setVideoEl}
        src={src}
        fit={settings.videoFit}
        autoplay={settings.autoplay}
        loop={settings.loop}
        muted={settings.muted}
        volume={settings.volume}
        playbackSpeed={settings.playbackSpeed}
        blurEnabled={settings.blurEnabled}
        blurAmount={settings.blurAmount}
        onError={showError}
      />
      {src && <Overlay opacity={settings.overlayOpacity} />}

      <main className="newtab-ui">
        <WidgetLayout
          settings={settings}
          onAddShortcut={handleOpenAddShortcut}
          onEditShortcut={handleOpenEditShortcut}
          onDeleteShortcut={handleDeleteShortcut}
        />

        {showEmptyState && (
          <div className="newtab-ui__empty-wrapper">
            <EmptyState onFiles={handleAddFiles} />
          </div>
        )}
      </main>

      <ControlBar
        hasVideo={Boolean(src)}
        isPlaying={isPlaying}
        muted={settings.muted}
        onTogglePlay={togglePlay}
        onRestart={restartVideo}
        onToggleMute={toggleMute}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {isDragActive && !settingsOpen && (
        <div className="drop-banner" role="status">
          Drop video to set as wallpaper
        </div>
      )}

      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        videos={videos}
        onChange={updateSettings}
        onResetSettings={reset}
        onAddFiles={handleAddFiles}
        onUseVideo={handleUseVideo}
        onDeleteVideo={deleteVideo}
        onDeleteAllVideos={deleteAll}
        getVideoUrl={getVideoUrl}
        onClose={() => setSettingsOpen(false)}
        onImportError={showError}
        onOpenShortcutModal={handleOpenEditShortcut}
      />

      <ShortcutModal
        open={shortcutModalOpen}
        shortcut={editingShortcut}
        onSave={handleSaveShortcut}
        onClose={handleCloseShortcutModal}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onDismiss={() => {
            setToastMessage(null)
            clearError()
          }}
        />
      )}
    </div>
  )
}
