import {useRef, useState} from 'react'
import {Download, RotateCcw, ShieldAlert, Upload} from 'lucide-react'
import type {Settings, SettingsExport} from '../../../types'
import {sanitizeImportedSettings} from '../../../utils/settingsSchema'
import ConfirmDialog from '../../ui/ConfirmDialog'

interface DataSectionProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onResetSettings: () => void
  onDeleteAllVideos: () => void
  onImportError: (message: string) => void
}

export default function DataSection({
  settings,
  onChange,
  onResetSettings,
  onDeleteAllVideos,
  onImportError
}: DataSectionProps) {
  const importInputRef = useRef<HTMLInputElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)

  const handleExport = () => {
    const {activeVideoId, lastRandomVideoId, ...portableSettings} = settings
    const payload: SettingsExport = {
      version: 1,
      settings: portableSettings
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'yuu-newtab-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const safePatch = sanitizeImportedSettings(parsed)
      onChange(safePatch)
    } catch (err) {
      onImportError(err instanceof Error ? err.message : 'Unable to import this settings file.')
    }
  }

  return (
    <section className="settings-section">
      <h3 className="settings-section__title">Data</h3>
      <div className="settings-section__body">
        <div className="button-row">
          <button type="button" className="btn btn--ghost btn--small" onClick={handleExport}>
            <Download size={14} aria-hidden="true" />
            Export Settings
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => importInputRef.current?.click()}
          >
            <Upload size={14} aria-hidden="true" />
            Import Settings
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            className="visually-hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportFile(file)
              e.target.value = ''
            }}
          />
        </div>
        <div className="button-row">
          <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={14} aria-hidden="true" />
            Reset Settings
          </button>
          <button
            type="button"
            className="btn btn--danger btn--small"
            onClick={() => setConfirmDeleteAll(true)}
          >
            <ShieldAlert size={14} aria-hidden="true" />
            Delete All Videos
          </button>
        </div>
      </div>

      {confirmReset && (
        <ConfirmDialog
          title="Reset all settings?"
          description="This restores every setting to its default. Your saved videos are kept."
          confirmLabel="Reset"
          danger={false}
          onConfirm={() => {
            onResetSettings()
            setConfirmReset(false)
          }}
          onCancel={() => setConfirmReset(false)}
        />
      )}

      {confirmDeleteAll && (
        <ConfirmDialog
          title="Delete all saved videos?"
          description="This action cannot be undone."
          confirmLabel="Delete All"
          onConfirm={() => {
            onDeleteAllVideos()
            setConfirmDeleteAll(false)
          }}
          onCancel={() => setConfirmDeleteAll(false)}
        />
      )}
    </section>
  )
}
