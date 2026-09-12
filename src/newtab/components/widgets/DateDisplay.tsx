import {useClock} from '../../hooks/useClock'

export default function DateDisplay() {
  const now = useClock()

  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(now)

  return <div className="date-display">{date}</div>
}
