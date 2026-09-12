import {ACCEPTED_VIDEO_TYPES, MAX_VIDEO_BYTES} from '../constants'

export {MAX_VIDEO_BYTES}

export interface ValidationResult {
  valid: boolean
  reason?: string
}

function guessTypeFromName(name: string): string | null {
  const lower = name.toLowerCase()
  if (lower.endsWith('.mp4')) return 'video/mp4'
  if (lower.endsWith('.webm')) return 'video/webm'
  if (lower.endsWith('.ogg') || lower.endsWith('.ogv')) return 'video/ogg'
  return null
}

export function validateVideoFile(file: File): ValidationResult {
  const type = file.type || guessTypeFromName(file.name)

  if (!type || !ACCEPTED_VIDEO_TYPES.includes(type)) {
    return {
      valid: false,
      reason: 'Unsupported format. Please use MP4, WebM, or OGG.'
    }
  }

  if (file.size === 0) {
    return {valid: false, reason: 'This file appears to be empty.'}
  }

  if (file.size > MAX_VIDEO_BYTES) {
    return {
      valid: false,
      reason: `File is too large. Max size is ${MAX_VIDEO_BYTES / (1024 * 1024)} MB.`
    }
  }

  return {valid: true}
}
