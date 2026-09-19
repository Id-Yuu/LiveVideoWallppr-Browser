import type {ClockFormat, SearchEngineId, Settings, Shortcut, VideoFit, WeatherUnit, WidgetPosition} from './types'

export const DB_NAME = 'id-yuu-livevideowallppr-db'
export const DB_VERSION = 1
export const DB_STORE_NAME = 'videos'
export const SETTINGS_STORAGE_KEY = 'settings'

export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg']
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024 // 500 MB
export const TRANSITION_DURATION_MS = 350
export const AUTO_DISMISS_TOAST_MS = 6000

export const STICKY_NOTES_MAX_WORDS = 2000

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

export const SEARCH_ENGINES: readonly {
  id: SearchEngineId
  name: string
  url: string
  placeholder: string
}[] = [
  {id: 'google', name: 'Google', url: 'https://www.google.com/search?q=%s', placeholder: 'Search with Google or type a URL'},
  {id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=%s', placeholder: 'Search with Bing or type a URL'},
  {id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s', placeholder: 'Search DuckDuckGo or type a URL'},
  {id: 'brave', name: 'Brave', url: 'https://search.brave.com/search?q=%s', placeholder: 'Search Brave or type a URL'},
  {id: 'ecosia', name: 'Ecosia', url: 'https://www.ecosia.org/search?q=%s', placeholder: 'Search Ecosia or type a URL'},
  {id: 'yahoo', name: 'Yahoo', url: 'https://search.yahoo.com/search?q=%s', placeholder: 'Search Yahoo or type a URL'},
  {id: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/results?search_query=%s', placeholder: 'Search YouTube or type a URL'},
  {id: 'custom', name: 'Custom', url: '', placeholder: 'Search or enter address'}
]

export const WEATHER_UNIT_OPTIONS: readonly {value: WeatherUnit; label: string}[] = [
  {value: 'celsius', label: 'Celsius (°C)'},
  {value: 'fahrenheit', label: 'Fahrenheit (°F)'}
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
  shortcutsPosition: 'center',
  // Sticky Notes
  showStickyNotes: false,
  stickyNotesPosition: 'bottom-left',
  stickyNotesContent: '',
  // Greeting
  showGreeting: true,
  greetingPosition: 'center',
  greetingName: '',
  // Weather
  showWeather: true,
  weatherPosition: 'top-right',
  weatherUnit: 'celsius',
  weatherCity: '',
  weatherLatitude: null,
  weatherLongitude: null,
  // Address / Search Bar
  showSearchBar: true,
  searchBarPosition: 'center',
  searchEngine: 'google',
  customSearchEngineUrl: 'https://www.google.com/search?q=%s',
  searchOpenInNewTab: false
}

