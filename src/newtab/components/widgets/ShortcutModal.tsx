import {useEffect, useRef, useState} from 'react'
import {X} from 'lucide-react'
import type {Shortcut} from '../../types'
import {isValidUrl, normalizeUrl, suggestTitleFromUrl} from '../../utils/urlUtils'

interface ShortcutModalProps {
  open: boolean
  shortcut: Shortcut | null
  onSave: (data: {title: string; url: string}) => void
  onClose: () => void
}

export default function ShortcutModal({
  open,
  shortcut,
  onSave,
  onClose
}: ShortcutModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [touchedTitle, setTouchedTitle] = useState(false)

  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (shortcut) {
        setTitle(shortcut.title)
        setUrl(shortcut.url)
        setTouchedTitle(true)
      } else {
        setTitle('')
        setUrl('')
        setTouchedTitle(false)
      }
      setError(null)
      const timer = window.setTimeout(() => {
        titleInputRef.current?.focus()
      }, 50)
      return () => window.clearTimeout(timer)
    }
  }, [open, shortcut])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [open, onClose])

  if (!open) return null

  const handleUrlChange = (value: string) => {
    setUrl(value)
    setError(null)
    if (!touchedTitle && !shortcut) {
      const suggestion = suggestTitleFromUrl(value)
      if (suggestion) setTitle(suggestion)
    }
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setTouchedTitle(true)
    setError(null)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      setError('Please enter a website URL.')
      return
    }

    const normalized = normalizeUrl(trimmedUrl)
    if (!isValidUrl(normalized)) {
      setError('Please enter a valid website URL (e.g. https://example.com).')
      return
    }

    const finalTitle = trimmedTitle || suggestTitleFromUrl(normalized) || 'Shortcut'

    onSave({
      title: finalTitle,
      url: normalized
    })
    onClose()
  }

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div
        className="dialog shortcut-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcut-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="shortcut-modal__header">
          <h3 id="shortcut-modal-title">
            {shortcut ? 'Edit Shortcut' : 'Add Shortcut'}
          </h3>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="shortcut-modal__form">
          <div className="field-group">
            <label htmlFor="shortcut-name" className="field-group__label">
              Name
            </label>
            <input
              ref={titleInputRef}
              id="shortcut-name"
              type="text"
              className="text-input"
              value={title}
              placeholder="e.g. GitHub"
              maxLength={40}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="shortcut-url" className="field-group__label">
              Web URL
            </label>
            <input
              id="shortcut-url"
              type="text"
              className="text-input"
              value={url}
              placeholder="e.g. https://github.com or github.com"
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </div>

          {error && <div className="shortcut-modal__error" role="alert">{error}</div>}

          <div className="dialog__actions shortcut-modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {shortcut ? 'Save Changes' : 'Add Shortcut'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
