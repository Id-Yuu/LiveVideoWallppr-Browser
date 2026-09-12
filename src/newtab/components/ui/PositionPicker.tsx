import {POSITION_OPTIONS} from '../../constants'
import type {WidgetPosition} from '../../types'

interface PositionPickerProps {
  label?: string
  value: WidgetPosition
  onChange: (value: WidgetPosition) => void
}

export default function PositionPicker({label, value, onChange}: PositionPickerProps) {
  return (
    <div className="field-group">
      {label && <span className="field-group__label">{label}</span>}
      <div className="position-picker">
        <div className="position-picker__grid" role="radiogroup" aria-label={label || 'Position'}>
          {POSITION_OPTIONS.map((pos) => {
            const isActive = value === pos.value
            return (
              <button
                key={pos.value}
                type="button"
                className={`position-picker__cell ${isActive ? 'position-picker__cell--active' : ''}`}
                onClick={() => onChange(pos.value)}
                title={pos.label}
                aria-label={pos.label}
                role="radio"
                aria-checked={isActive}
              >
                {pos.icon}
              </button>
            )
          })}
        </div>

        <div className="position-picker__select-wrap">
          <select
            className="select-input"
            value={value}
            onChange={(e) => onChange(e.target.value as WidgetPosition)}
            aria-label={label || 'Position'}
          >
            {POSITION_OPTIONS.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
