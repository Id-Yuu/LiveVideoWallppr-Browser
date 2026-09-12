import type {ClockFormat, Shortcut, Settings, VideoFit, WidgetPosition} from './types'

export const DB_NAME = 'id-yuu-livevideowallppr-db'
export const DB_VERSION = 1
export const DB_STORE_NAME = 'videos'
export const SETTINGS_STORAGE_KEY = 'settings'

export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024 // 500 MB
export const TRANSITION_DURATION_MS = 350
export const AUTO_DISMISS_TOAST_MS = 6000

export const SPEED_OPTIONS: readonly number[] = [0.5, 0.75, 1, 1.25, 1.5]

export const VIDEO_FIT_OPTIONS: readonly {value: VideoFit; label: string}[] = [
  {value: 'cover', label: 'Cover'},
  {value: 'contain', label: 'Contain'},
  {value: 'fill', label: 'Fill'}
]

export const CLOCK_FORMAT_OPTIONS: readonly {value: ClockFormat; label: string}[] = [
  {value: '12h', label: '12 Hour'},
  {value: '24h', label: '24 Hour'}
]

export const WIDGET_POSITIONS: readonly WidgetPosition[] = [
  'top-left',
  'top',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom',
  'bottom-right'
]

export const POSITION_OPTIONS: readonly {value: WidgetPosition; label: string; icon: string}[] = [
  {value: 'top-left', label: 'Top Left', icon: '↖'},
  {value: 'top', label: 'Top', icon: '↑'},
  {value: 'top-right', label: 'Top Right', icon: '↗'},
  {value: 'center-left', label: 'Center Left', icon: '←'},
  {value: 'center', label: 'Center', icon: '•'},
  {value: 'center-right', label: 'Center Right', icon: '→'},
  {value: 'bottom-left', label: 'Bottom Left', icon: '↙'},
  {value: 'bottom', label: 'Bottom', icon: '↓'},
  {value: 'bottom-right', label: 'Bottom Right', icon: '↘'}
]

export const DEFAULT_SHORTCUTS: readonly Shortcut[] = [
  {id: 'default-yt', title: 'YouTube', url: 'https://www.youtube.com'},
  {id: 'default-gh', title: 'GitHub', url: 'https://github.com/Id-Yuu'},
  {id: 'default-rd', title: 'Reddit', url: 'https://www.reddit.com'}
]

export const DEFAULT_SETTINGS: Settings = {
  activeVideoId: null,
  autoplay: true,
  loop: true,
  muted: true,
  volume: 0,
  playbackSpeed: 1,
  videoFit: 'cover',
  overlayOpacity: 0.35,
  blurEnabled: false,
  blurAmount: 0,
  showClock: true,
  showDate: true,
  clockFormat: '24h',
  customText: 'YUU',
  randomVideo: false,
  lastRandomVideoId: null,
  showShortcuts: true,
  openShortcutsInNewTab: false,
  shortcuts: [...DEFAULT_SHORTCUTS],
  clockPosition: 'center',
  datePosition: 'center',
  customTextPosition: 'center',
  shortcutsPosition: 'center'
}
