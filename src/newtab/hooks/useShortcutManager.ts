import {useCallback, useState} from 'react'
import type {Shortcut} from '../types'

interface UseShortcutManagerOptions {
  shortcuts: Shortcut[]
  onUpdateShortcuts: (shortcuts: Shortcut[]) => void
}

interface UseShortcutManagerResult {
  isModalOpen: boolean
  editingShortcut: Shortcut | null
  openAddModal: () => void
  openEditModal: (shortcut: Shortcut | null) => void
  closeModal: () => void
  saveShortcut: (data: {title: string; url: string}) => void
  deleteShortcut: (id: string) => void
}

export function useShortcutManager({
  shortcuts,
  onUpdateShortcuts
}: UseShortcutManagerOptions): UseShortcutManagerResult {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShortcut, setEditingShortcut] = useState<Shortcut | null>(null)

  const openAddModal = useCallback(() => {
    setEditingShortcut(null)
    setIsModalOpen(true)
  }, [])

  const openEditModal = useCallback((shortcut: Shortcut | null) => {
    setEditingShortcut(shortcut)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setEditingShortcut(null)
  }, [])

  const saveShortcut = useCallback(
    ({title, url}: {title: string; url: string}) => {
      if (editingShortcut) {
        const updated = shortcuts.map((s) =>
          s.id === editingShortcut.id ? {...s, title, url} : s
        )
        onUpdateShortcuts(updated)
      } else {
        const newShortcut: Shortcut = {
          id: `shortcut-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title,
          url
        }
        onUpdateShortcuts([...shortcuts, newShortcut])
      }
    },
    [editingShortcut, shortcuts, onUpdateShortcuts]
  )

  const deleteShortcut = useCallback(
    (id: string) => {
      onUpdateShortcuts(shortcuts.filter((s) => s.id !== id))
    },
    [shortcuts, onUpdateShortcuts]
  )

  return {
    isModalOpen,
    editingShortcut,
    openAddModal,
    openEditModal,
    closeModal,
    saveShortcut,
    deleteShortcut
  }
}
