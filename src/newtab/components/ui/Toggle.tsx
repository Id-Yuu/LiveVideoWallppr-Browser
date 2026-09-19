interface ToggleProps {
  id?: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hideLabel?: boolean
}

export default function Toggle({id, label, checked, onChange, hideLabel}: ToggleProps) {
  return (
    <label className="toggle-row" htmlFor={id}>
      {!hideLabel && <span className="toggle-row__label">{label}</span>}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={hideLabel ? label : undefined}
        className={`toggle ${checked ? 'toggle--on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle__thumb" />
      </button>
    </label>
  )
}
