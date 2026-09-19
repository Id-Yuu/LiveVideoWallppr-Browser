import {Trash2} from 'lucide-react'
import type {Settings} from '../../../types'
import PositionPicker from '../../ui/PositionPicker'
import Toggle from '../../ui/Toggle'

interface StickyNotesSectionProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
}

export default function StickyNotesSection({settings, onChange}: StickyNotesSectionProps) {
  const wordCount = settings.stickyNotesContent.trim()
    ? settings.stickyNotesContent.trim().split(/\s+/).length
    : 0

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all sticky note text?')) {
      onChange({stickyNotesContent: ''})
    }
  }

  return (
    <section className="settings-section">
      <h3 className="settings-section__title">Sticky Notes</h3>
      <div className="settings-section__body">
        <Toggle
          label="Show Sticky Note"
          checked={settings.showStickyNotes}
          onChange={(v) => onChange({showStickyNotes: v})}
        />

        {settings.showStickyNotes && (
          <>
            <PositionPicker
              label="Sticky Note Position"
              value={settings.stickyNotesPosition}
              onChange={(v) => onChange({stickyNotesPosition: v})}
            />

            <div className="field-group">
              <span className="field-group__label">Current Content</span>
              <div className="sticky-notes-settings-info">
                <span>{wordCount} / 2000 words used</span>
                <button
                  type="button"
                  className="btn btn--danger btn--sm"
                  onClick={handleClear}
                  disabled={!settings.stickyNotesContent}
                >
                  <Trash2 size={13} />
                  <span>Clear Note</span>
                </button>
              </div>
              <span className="field-hint">
                You can write, edit, copy, and collapse your sticky note directly on your New Tab page.
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

