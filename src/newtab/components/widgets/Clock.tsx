import {useClock} from '../../hooks/useClock'
import type {ClockFormat} from '../../types'

interface ClockProps {
  format: ClockFormat
}

export default function Clock({format}: ClockProps) {
  const now = useClock()

  const time = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: format === '12h'
  }).format(now)

  return (
    <div className="clock" aria-live="off">
      {time}
    </div>
  )
}
