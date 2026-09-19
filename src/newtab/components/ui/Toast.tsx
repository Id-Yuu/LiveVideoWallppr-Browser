import {useEffect} from 'react'
import {AlertTriangle, X} from 'lucide-react'
import {AUTO_DISMISS_TOAST_MS} from '../../constants'

interface ToastProps {
  message: string
  onDismiss: () => void
  autoDismissMs?: number
}

export default function Toast({
  message,
  onDismiss,
  autoDismissMs = AUTO_DISMISS_TOAST_MS
}: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, autoDismissMs)
    return () => window.clearTimeout(timer)
  }, [message, onDismiss, autoDismissMs])

  return (
    <div className="toast" role="alert">
      <AlertTriangle size={16} className="toast__icon" aria-hidden="true" />
      <span className="toast__message">{message}</span>
      <button
        type="button"
        className="toast__close"
        onClick={onDismiss}
        aria-label="Dismiss message"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}
