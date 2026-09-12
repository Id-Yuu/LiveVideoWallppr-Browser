import {useCallback, useRef, useState} from 'react'

interface UseFileDropOptions {
  disabled?: boolean
  onFiles: (files: File[]) => void
}

interface UseFileDropResult {
  isDragActive: boolean
  dragProps: {
    onDragEnter: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
  }
}

export function useFileDrop({disabled = false, onFiles}: UseFileDropOptions): UseFileDropResult {
  const [isDragActive, setIsDragActive] = useState(false)
  const dragCounter = useRef(0)

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return
      if (!Array.from(e.dataTransfer.types).includes('Files')) return
      e.preventDefault()
      dragCounter.current += 1
      setIsDragActive(true)
    },
    [disabled]
  )

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!disabled && isDragActive) {
        e.preventDefault()
      }
    },
    [disabled, isDragActive]
  )

  const onDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (disabled || !isDragActive) return
      e.preventDefault()
      dragCounter.current -= 1
      if (dragCounter.current <= 0) {
        dragCounter.current = 0
        setIsDragActive(false)
      }
    },
    [disabled, isDragActive]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled || !isDragActive) return
      e.preventDefault()
      dragCounter.current = 0
      setIsDragActive(false)

      const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : []
      if (files.length > 0) {
        onFiles(files)
      }
    },
    [disabled, isDragActive, onFiles]
  )

  return {
    isDragActive,
    dragProps: {
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop
    }
  }
}
