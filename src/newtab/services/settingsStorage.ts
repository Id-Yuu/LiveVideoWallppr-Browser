import {DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY} from '../constants'
import type {Settings} from '../types'
import {sanitizeSettings} from '../utils/settingsSchema'

const browserAPI: typeof chrome | typeof browser =
  typeof browser !== 'undefined' ? (browser as any) : chrome

export async function loadSettings(): Promise<Settings> {
  const stored = await new Promise<Record<string, unknown>>((resolve, reject) => {
    try {
      const maybePromise = (browserAPI.storage.local.get as any)(SETTINGS_STORAGE_KEY)
      if (maybePromise?.then) {
        maybePromise.then(resolve, reject)
      } else {
        ;(browserAPI.storage.local.get as any)(SETTINGS_STORAGE_KEY, (result: Record<string, unknown>) => {
          const err = (chrome as any).runtime?.lastError
          if (err) reject(new Error(err.message))
          else resolve(result)
        })
      }
    } catch (err) {
      reject(err)
    }
  })

  const saved = stored?.[SETTINGS_STORAGE_KEY]
  return sanitizeSettings(saved)
}

export async function saveSettings(settings: Settings): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    try {
      const maybePromise = (browserAPI.storage.local.set as any)({[SETTINGS_STORAGE_KEY]: settings})
      if (maybePromise?.then) {
        maybePromise.then(() => resolve(), reject)
      } else {
        ;(browserAPI.storage.local.set as any)({[SETTINGS_STORAGE_KEY]: settings}, () => {
          const err = (chrome as any).runtime?.lastError
          if (err) reject(new Error(err.message))
          else resolve()
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}

export async function resetSettings(): Promise<Settings> {
  const current = await loadSettings()
  const next: Settings = {
    ...DEFAULT_SETTINGS,
    activeVideoId: current.activeVideoId,
    shortcuts: current.shortcuts
  }
  await saveSettings(next)
  return next
}

export function onSettingsChanged(callback: (settings: Settings) => void): () => void {
  const listener = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string
  ) => {
    if (areaName !== 'local') return
    const change = changes[SETTINGS_STORAGE_KEY]
    if (!change) return
    callback(sanitizeSettings(change.newValue))
  }

  browserAPI.storage.onChanged.addListener(listener as any)
  return () => browserAPI.storage.onChanged.removeListener(listener as any)
}
