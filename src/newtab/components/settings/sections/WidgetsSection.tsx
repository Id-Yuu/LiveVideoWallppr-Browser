import {CLOCK_FORMAT_OPTIONS} from '../../../constants'
import type {Settings} from '../../../types'
import PositionPicker from '../../ui/PositionPicker'
import Toggle from '../../ui/Toggle'

interface WidgetsSectionProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
}

export default function WidgetsSection({settings, onChange}: WidgetsSectionProps) {
  return (
    <section className="settings-section">
      <h3 className="settings-section__title">New Tab</h3>
      <div className="settings-section__body">
        <Toggle
          label="Show Clock"
          checked={settings.showClock}
          onChange={(v) => onChange({showClock: v})}
        />
        {settings.showClock && (
          <>
            <div className="field-group">
              <span className="field-group__label">Clock Format</span>
              <div className="radio-group">
                {CLOCK_FORMAT_OPTIONS.map((opt) => (
                  <label key={opt.value} className="radio-option">
                    <input
                      type="radio"
                      name="clock-format"
                      checked={settings.clockFormat === opt.value}
                      onChange={() => onChange({clockFormat: opt.value})}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <PositionPicker
              label="Clock Position"
              value={settings.clockPosition}
              onChange={(v) => onChange({clockPosition: v})}
            />
          </>
        )}

        <Toggle
          label="Show Date"
          checked={settings.showDate}
          onChange={(v) => onChange({showDate: v})}
        />
        {settings.showDate && (
          <PositionPicker
            label="Date Position"
            value={settings.datePosition}
            onChange={(v) => onChange({datePosition: v})}
          />
        )}

        <div className="field-group">
          <label htmlFor="custom-text" className="field-group__label">
            Custom Text
          </label>
          <input
            id="custom-text"
            type="text"
            className="text-input"
            maxLength={60}
            value={settings.customText}
            placeholder="YUU"
            onChange={(e) => onChange({customText: e.target.value})}
          />
        </div>
        {settings.customText.trim().length > 0 && (
          <PositionPicker
            label="Custom Text Position"
            value={settings.customTextPosition}
            onChange={(v) => onChange({customTextPosition: v})}
          />
        )}
      </div>
    </section>
  )
}
