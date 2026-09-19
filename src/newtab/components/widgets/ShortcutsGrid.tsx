import {useState} from 'react'
import {Pencil, Plus, Trash2} from 'lucide-react'
import type {Shortcut} from '../../types'
import {getDomain, getFaviconUrl} from '../../utils/urlUtils'

interface ShortcutsGridProps {
  shortcuts: Shortcut[]
  openInNewTab: boolean
  onAddShortcut: () => void
  onEditShortcut: (shortcut: Shortcut) => void
  onDeleteShortcut: (id: string) => void
}

function ShortcutTile({
  shortcut,
  openInNewTab,
  onEdit,
  onDelete
}: {
  shortcut: Shortcut
  openInNewTab: boolean
  onEdit: (shortcut: Shortcut) => void
  onDelete: (id: string) => void
}) {
  const [imgError, setImgError] = useState(false)
  const faviconUrl = getFaviconUrl(shortcut.url)
  const letter = (shortcut.title || getDomain(shortcut.url) || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="shortcut-tile-wrap">
      <a
        href={shortcut.url}
        target={openInNewTab ? '_blank' : '_self'}
        rel="noopener noreferrer"
        className="shortcut-tile"
        title={`${shortcut.title} (${shortcut.url})`}
      >
        <div className="shortcut-tile__icon-box">
          {!imgError && faviconUrl ? (
            <img
              src={faviconUrl}
              alt=""
              className="shortcut-tile__favicon"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <span className="shortcut-tile__monogram">{letter}</span>
          )}
        </div>
        <span className="shortcut-tile__title">{shortcut.title}</span>
      </a>

      <div className="shortcut-tile__actions">
        <button
          type="button"
          className="shortcut-tile__action-btn"
          aria-label={`Edit ${shortcut.title}`}
          title="Edit"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onEdit(shortcut)
          }}
        >
          <Pencil size={12} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="shortcut-tile__action-btn shortcut-tile__action-btn--delete"
          aria-label={`Delete ${shortcut.title}`}
          title="Delete"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(shortcut.id)
          }}
        >
          <Trash2 size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default function ShortcutsGrid({
  shortcuts,
  openInNewTab,
  onAddShortcut,
  onEditShortcut,
  onDeleteShortcut
}: ShortcutsGridProps) {
  return (
    <nav className="shortcuts-container" aria-label="Web shortcuts">
      <div className="shortcuts-grid">
        {shortcuts.map((shortcut) => (
          <ShortcutTile
            key={shortcut.id}
            shortcut={shortcut}
            openInNewTab={openInNewTab}
            onEdit={onEditShortcut}
            onDelete={onDeleteShortcut}
          />
        ))}

        <div className="shortcut-tile-wrap">
          <button
            type="button"
            className="shortcut-tile shortcut-tile--add"
            onClick={onAddShortcut}
            aria-label="Add shortcut"
            title="Add shortcut"
          >
            <div className="shortcut-tile__icon-box shortcut-tile__icon-box--add">
              <Plus size={20} aria-hidden="true" />
            </div>
            <span className="shortcut-tile__title">Add shortcut</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
