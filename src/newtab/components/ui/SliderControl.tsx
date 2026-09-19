interface SliderControlProps {
  id?: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  displayValue?: string
  onChange: (value: number) => void
  disabled?: boolean
}

export default function SliderControl({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  displayValue,
  onChange,
  disabled
}: SliderControlProps) {
  return (
    <div className={`slider-control ${disabled ? 'slider-control--disabled' : ''}`}>
      <div className="slider-control__header">
        <label htmlFor={id}>{label}</label>
        <span className="slider-control__value">{displayValue ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
