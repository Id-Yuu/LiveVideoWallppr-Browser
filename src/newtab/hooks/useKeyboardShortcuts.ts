import {useEffect} from 'react'

interface KeyboardShortcutsOptions {
  enabled?: boolean
  onTogglePlay?: () => void
  onRestart?: () => void
  onToggleMute?: () => void
  onToggleSettings?: () => void
  onCloseSettings?: () => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export function useKeyboardShortcuts({
  enabled = true,
  onTogglePlay,
  onRestart,
  onToggleMute,
  onToggleSettings,
  onCloseSettings
}: KeyboardShortcutsOptions): void {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return

      if (e.key === 'Escape') {
        onCloseSettings?.()
        return
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        onTogglePlay?.()
        return
      }

      if (e.key === 's' || e.key === 'S') {
        onToggleSettings?.()
        return
      }

      if (e.key === 'm' || e.key === 'M') {
        onToggleMute?.()
        return
      }

      if (e.key === 'r' || e.key === 'R') {
        onRestart?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, onTogglePlay, onRestart, onToggleMute, onToggleSettings, onCloseSettings])
}
