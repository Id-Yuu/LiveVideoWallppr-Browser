import {DB_NAME, DB_STORE_NAME, DB_VERSION} from '../constants'
import type {VideoRecord} from '../types'

export class StorageError extends Error {
  code: 'QUOTA_EXCEEDED' | 'DB_ERROR' | 'NOT_FOUND' | 'BLOCKED' | 'UNKNOWN'

  constructor(message: string, code: StorageError['code'] = 'UNKNOWN') {
    super(message)
    this.name = 'StorageError'
    this.code = code
  }
}

let dbPromise: Promise<IDBDatabase> | null = null

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new StorageError('IndexedDB is not available in this browser.', 'DB_ERROR'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
        const store = db.createObjectStore(DB_STORE_NAME, {keyPath: 'id'})
        store.createIndex('createdAt', 'createdAt', {unique: false})
      }
    }

    request.onblocked = () => {
      reject(new StorageError('Database upgrade is blocked by another tab.', 'BLOCKED'))
    }

    request.onsuccess = () => {
      const db = request.result
      db.onversionchange = () => {
        db.close()
        dbPromise = null
      }
      resolve(db)
    }

    request.onerror = () => {
      dbPromise = null
      reject(new StorageError(request.error?.message ?? 'Failed to open database.', 'DB_ERROR'))
    }
  })

  return dbPromise
}

function wrapRequest<T>(request: IDBRequest<T>, onQuotaMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => {
      const err = request.error
      if (err?.name === 'QuotaExceededError') {
        reject(new StorageError(onQuotaMessage, 'QUOTA_EXCEEDED'))
      } else {
        reject(new StorageError(err?.message ?? 'A storage error occurred.', 'DB_ERROR'))
      }
    }
  })
}

export async function putVideo(record: VideoRecord): Promise<void> {
  const db = await openDatabase()
  const tx = db.transaction(DB_STORE_NAME, 'readwrite')
  const store = tx.objectStore(DB_STORE_NAME)
  await wrapRequest(
    store.put(record),
    'Not enough storage space to save this video. Try deleting an existing one first.'
  )
}

export async function getAllVideos(): Promise<VideoRecord[]> {
  const db = await openDatabase()
  const tx = db.transaction(DB_STORE_NAME, 'readonly')
  const store = tx.objectStore(DB_STORE_NAME)
  const results = await wrapRequest(store.getAll(), '')
  return results.sort((a, b) => a.createdAt - b.createdAt)
}

export async function getVideo(id: string): Promise<VideoRecord | undefined> {
  const db = await openDatabase()
  const tx = db.transaction(DB_STORE_NAME, 'readonly')
  const store = tx.objectStore(DB_STORE_NAME)
  return wrapRequest(store.get(id), '')
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await openDatabase()
  const tx = db.transaction(DB_STORE_NAME, 'readwrite')
  const store = tx.objectStore(DB_STORE_NAME)
  await wrapRequest(store.delete(id), '')
}

export async function clearAllVideos(): Promise<void> {
  const db = await openDatabase()
  const tx = db.transaction(DB_STORE_NAME, 'readwrite')
  const store = tx.objectStore(DB_STORE_NAME)
  await wrapRequest(store.clear(), '')
}
