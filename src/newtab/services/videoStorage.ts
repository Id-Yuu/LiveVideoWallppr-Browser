import type {VideoRecord} from '../types'
import {readVideoDuration} from '../utils/formatTime'
import {validateVideoFile} from '../utils/videoValidation'
import * as db from './indexedDB'

export {StorageError} from './indexedDB'

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `vid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export interface AddVideoResult {
  video: VideoRecord
}

export async function addVideoFile(file: File): Promise<AddVideoResult> {
  const validation = validateVideoFile(file)
  if (!validation.valid) {
    throw new Error(validation.reason)
  }

  const duration = await readVideoDuration(file)

  const record: VideoRecord = {
    id: generateId(),
    name: file.name || 'Untitled video',
    size: file.size,
    type: file.type,
    duration,
    createdAt: Date.now(),
    blob: file
  }

  await db.putVideo(record)
  return {video: record}
}

export async function listVideos(): Promise<VideoRecord[]> {
  return db.getAllVideos()
}

export async function removeVideo(id: string): Promise<void> {
  return db.deleteVideo(id)
}

export async function removeAllVideos(): Promise<void> {
  return db.clearAllVideos()
}

const activeUrls = new Map<string, string>()

export function createVideoUrl(record: VideoRecord): string {
  const existing = activeUrls.get(record.id)
  if (existing) return existing

  const url = URL.createObjectURL(record.blob)
  activeUrls.set(record.id, url)
  return url
}

export function revokeVideoUrl(id: string): void {
  const url = activeUrls.get(id)
  if (url) {
    URL.revokeObjectURL(url)
    activeUrls.delete(id)
  }
}

export function revokeAllVideoUrls(): void {
  activeUrls.forEach((url) => URL.revokeObjectURL(url))
  activeUrls.clear()
}
