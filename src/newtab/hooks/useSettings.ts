import {useCallback, useEffect, useRef, useState} from 'react'
import {DEFAULT_SETTINGS, type Settings} from '../types'
import * as settingsStorage from '../services/settingsStorage'

export interface UseSettingsResult {
  settings: Settings
  isLoaded: boolean
  updateSettings: (patch: Partial<Settings>) => void
  reset: () => Promise<void>
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)
  // Tracks our own writes so the cross-tab change listener doesn't
  // re-render with a value we already have (avoids an update loop/flicker).
  const lastWrittenJson = useRef<string>('')

  useEffect(() => {
    let cancelled = false

    settingsStorage
      .loadSettings()
      .then((loaded) => {
        if (cancelled) return
        lastWrittenJson.current = JSON.stringify(loaded)
        setSettings(loaded)
        setIsLoaded(true)
      })
      .catch(() => {
        if (cancelled) return
        setSettings(DEFAULT_SETTINGS)
        setIsLoaded(true)
      })

    const unsubscribe = settingsStorage.onSettingsChanged((next) => {
      const nextJson = JSON.stringify(next)
      if (nextJson === lastWrittenJson.current) return
      lastWrittenJson.current = nextJson
      setSettings(next)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = {...prev, ...patch}
      lastWrittenJson.current = JSON.stringify(next)
      settingsStorage.saveSettings(next).catch(() => {
        // Best-effort persistence — the in-memory value still updates so the
        // UI stays responsive even if storage is briefly unavailable.
      })
      return next
    })
  }, [])

  const reset = useCallback(async () => {
    const next = await settingsStorage.resetSettings()
    lastWrittenJson.current = JSON.stringify(next)
    setSettings(next)
  }, [])

  return {settings, isLoaded, updateSettings, reset}
}
