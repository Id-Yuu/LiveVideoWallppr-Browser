import {useEffect, useState} from 'react'

type ClockListener = (date: Date) => void

const listeners = new Set<ClockListener>()
let timeoutId: number | null = null
let intervalId: number | null = null
let currentDate: Date = new Date()

function broadcastTick() {
  currentDate = new Date()
  listeners.forEach((listener) => listener(currentDate))
}

function startClockTimer() {
  const msUntilNextSecond = 1000 - (Date.now() % 1000)
  timeoutId = window.setTimeout(() => {
    broadcastTick()
    intervalId = window.setInterval(broadcastTick, 1000)
  }, msUntilNextSecond)
}

function stopClockTimer() {
  if (timeoutId !== null) {
    window.clearTimeout(timeoutId)
    timeoutId = null
  }
  if (intervalId !== null) {
    window.clearInterval(intervalId)
    intervalId = null
  }
}

export function useClock(): Date {
  const [now, setNow] = useState<Date>(() => currentDate)

  useEffect(() => {
    const handleTick: ClockListener = (date) => setNow(date)
    listeners.add(handleTick)

    if (listeners.size === 1) {
      startClockTimer()
    }

    return () => {
      listeners.delete(handleTick)
      if (listeners.size === 0) {
        stopClockTimer()
      }
    }
  }, [])

  return now
}
