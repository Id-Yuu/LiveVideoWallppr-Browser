import {Pencil, Plus, Trash2} from 'lucide-react'
import type {Settings, Shortcut} from '../../../types'
import PositionPicker from '../../ui/PositionPicker'
import Toggle from '../../ui/Toggle'

interface ShortcutsSectionProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onOpenShortcutModal: (shortcut: Shortcut | null) => void
}

export default function ShortcutsSection({
  settings,
  onChange,
  onOpenShortcutModal
}: ShortcutsSectionProps) {
  return (
    <section className="settings-section">
      <h3 className="settings-section__title">Shortcuts</h3>
      <div className="settings-section__body">
        <Toggle
          label="Show Shortcuts"
          checked={settings.showShortcuts}
          onChange={(v) => onChange({showShortcuts: v})}
        />
        {settings.showShortcuts && (
          <>
            <Toggle
              label="Open in New Tab"
              checked={settings.openShortcutsInNewTab}
              onChange={(v) => onChange({openShortcutsInNewTab: v})}
            />
            <PositionPicker
              label="Shortcuts Position"
              value={settings.shortcutsPosition}
              onChange={(v) => onChange({shortcutsPosition: v})}
            />
            <div className="settings-shortcuts-header">
              <span className="field-group__label">Custom Shortcuts ({settings.shortcuts.length})</span>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => onOpenShortcutModal(null)}
              >
                <Plus size={14} aria-hidden="true" />
                Add Shortcut
              </button>
            </div>
            {settings.shortcuts.length === 0 ? (
              <div className="video-library__empty">No shortcuts added yet.</div>
            ) : (
              <ul className="settings-shortcuts-list">
                {settings.shortcuts.map((s) => (
                  <li key={s.id} className="settings-shortcut-item">
                    <div className="settings-shortcut-item__info">
                      <span className="settings-shortcut-item__title">{s.title}</span>
                      <span className="settings-shortcut-item__url">{s.url}</span>
                    </div>
                    <div className="settings-shortcut-item__actions">
                      <button
                        type="button"
                        className="icon-btn"
                        title="Edit shortcut"
                        aria-label={`Edit ${s.title}`}
                        onClick={() => onOpenShortcutModal(s)}
                      >
                        <Pencil size={13} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--danger"
                        title="Delete shortcut"
                        aria-label={`Delete ${s.title}`}
                        onClick={() => {
                          onChange({
                            shortcuts: settings.shortcuts.filter((item) => item.id !== s.id)
                          })
                        }}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  )
}
