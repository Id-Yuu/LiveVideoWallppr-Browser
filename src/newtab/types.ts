export interface VideoRecord {
  id: string
  name: string
  size: number
  type: string
  duration: number | null
  createdAt: number
  blob: Blob
}

export type VideoMeta = Omit<VideoRecord, 'blob'>

export type VideoFit = 'cover' | 'contain' | 'fill'
export type ClockFormat = '12h' | '24h'

export type WidgetPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

export interface Shortcut {
  id: string
  title: string
  url: string
}

export interface Settings {
  activeVideoId: string | null
  autoplay: boolean
  loop: boolean
  muted: boolean
  volume: number
  playbackSpeed: number
  videoFit: VideoFit
  overlayOpacity: number
  blurEnabled: boolean
  blurAmount: number
  showClock: boolean
  showDate: boolean
  clockFormat: ClockFormat
  customText: string
  randomVideo: boolean
  lastRandomVideoId: string | null
  showShortcuts: boolean
  openShortcutsInNewTab: boolean
  shortcuts: Shortcut[]
  clockPosition: WidgetPosition
  datePosition: WidgetPosition
  customTextPosition: WidgetPosition
  shortcutsPosition: WidgetPosition
}

export interface SettingsExport {
  version: 1
  settings: Omit<Settings, 'activeVideoId' | 'lastRandomVideoId'>
}

export {DEFAULT_SHORTCUTS, DEFAULT_SETTINGS, ACCEPTED_VIDEO_TYPES} from './constants'
