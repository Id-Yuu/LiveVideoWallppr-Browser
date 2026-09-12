import {
  DEFAULT_SETTINGS,
  DEFAULT_SHORTCUTS,
  WIDGET_POSITIONS
} from '../constants'
import type {ClockFormat, Settings, Shortcut, VideoFit, WidgetPosition} from '../types'

const VALID_FITS: readonly VideoFit[] = ['cover', 'contain', 'fill']
const VALID_CLOCK_FORMATS: readonly ClockFormat[] = ['12h', '24h']

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function sanitizeShortcuts(raw: unknown): Shortcut[] {
  if (!Array.isArray(raw)) {
    return [...DEFAULT_SHORTCUTS]
  }

  return raw
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item && typeof item === 'object' && typeof item.title === 'string' && typeof item.url === 'string')
    )
    .map((item) => ({
      id:
        typeof item.id === 'string' && item.id.trim()
          ? item.id.trim().slice(0, 60)
          : `shortcut-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: (item.title as string).trim().slice(0, 60),
      url: (item.url as string).trim().slice(0, 500)
    }))
    .filter((item) => item.url.length > 0)
}

export function sanitizeSettings(raw: unknown): Settings {
  if (!raw || typeof raw !== 'object') {
    return {...DEFAULT_SETTINGS}
  }

  const data = raw as Partial<Record<keyof Settings, unknown>>
  const next: Settings = {...DEFAULT_SETTINGS}

  if (typeof data.activeVideoId === 'string') {
    next.activeVideoId = data.activeVideoId
  } else if (data.activeVideoId === null) {
    next.activeVideoId = null
  }

  if (typeof data.autoplay === 'boolean') next.autoplay = data.autoplay
  if (typeof data.loop === 'boolean') next.loop = data.loop
  if (typeof data.muted === 'boolean') next.muted = data.muted

  if (typeof data.volume === 'number' && Number.isFinite(data.volume)) {
    next.volume = clamp(data.volume, 0, 1)
  }

  if (typeof data.playbackSpeed === 'number' && Number.isFinite(data.playbackSpeed) && data.playbackSpeed > 0) {
    next.playbackSpeed = clamp(data.playbackSpeed, 0.25, 4)
  }

  if (typeof data.videoFit === 'string' && VALID_FITS.includes(data.videoFit as VideoFit)) {
    next.videoFit = data.videoFit as VideoFit
  }

  if (typeof data.overlayOpacity === 'number' && Number.isFinite(data.overlayOpacity)) {
    next.overlayOpacity = clamp(data.overlayOpacity, 0, 1)
  }

  if (typeof data.blurEnabled === 'boolean') next.blurEnabled = data.blurEnabled

  if (typeof data.blurAmount === 'number' && Number.isFinite(data.blurAmount)) {
    next.blurAmount = clamp(Math.round(data.blurAmount), 0, 20)
  }

  if (typeof data.showClock === 'boolean') next.showClock = data.showClock
  if (typeof data.showDate === 'boolean') next.showDate = data.showDate

  if (typeof data.clockFormat === 'string' && VALID_CLOCK_FORMATS.includes(data.clockFormat as ClockFormat)) {
    next.clockFormat = data.clockFormat as ClockFormat
  }

  if (typeof data.customText === 'string') {
    next.customText = data.customText.slice(0, 60)
  }

  if (typeof data.randomVideo === 'boolean') next.randomVideo = data.randomVideo

  if (typeof data.lastRandomVideoId === 'string') {
    next.lastRandomVideoId = data.lastRandomVideoId
  } else if (data.lastRandomVideoId === null) {
    next.lastRandomVideoId = null
  }

  if (typeof data.showShortcuts === 'boolean') next.showShortcuts = data.showShortcuts
  if (typeof data.openShortcutsInNewTab === 'boolean') next.openShortcutsInNewTab = data.openShortcutsInNewTab

  if ('shortcuts' in data) {
    next.shortcuts = sanitizeShortcuts(data.shortcuts)
  }

  const isValidPosition = (pos: unknown): pos is WidgetPosition =>
    typeof pos === 'string' && WIDGET_POSITIONS.includes(pos as WidgetPosition)

  if (isValidPosition(data.clockPosition)) next.clockPosition = data.clockPosition
  if (isValidPosition(data.datePosition)) next.datePosition = data.datePosition
  if (isValidPosition(data.customTextPosition)) next.customTextPosition = data.customTextPosition
  if (isValidPosition(data.shortcutsPosition)) next.shortcutsPosition = data.shortcutsPosition

  return next
}

export function sanitizeImportedSettings(raw: unknown): Partial<Settings> {
  if (!raw || typeof raw !== 'object') {
    throw new Error('This file does not contain valid settings data.')
  }

  const exportObj = raw as {version?: number; settings?: unknown}
  const source = exportObj.settings && typeof exportObj.settings === 'object' ? exportObj.settings : raw

  const fullSanitized = sanitizeSettings(source)

  const {activeVideoId, lastRandomVideoId, ...portableSettings} = fullSanitized
  return portableSettings
}
