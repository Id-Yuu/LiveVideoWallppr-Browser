import {SEARCH_ENGINES} from '../constants'
import type {SearchEngineId} from '../types'

const URL_PATTERN = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/
const LOCALHOST_PATTERN = /^(https?:\/\/)?localhost(:\d+)?(\/.*)?$/
const IP_PATTERN = /^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}(:\d+)?(\/.*)?$/

export function isDirectUrl(input: string): boolean {
  const trimmed = input.trim()
  if (trimmed.includes(' ')) return false
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    URL_PATTERN.test(trimmed) ||
    LOCALHOST_PATTERN.test(trimmed) ||
    IP_PATTERN.test(trimmed)
  )
}

export function formatDirectUrl(input: string): string {
  const trimmed = input.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://${trimmed}`
}

export function buildSearchUrl(
  query: string,
  engineId: SearchEngineId,
  customUrlTemplate: string
): string {
  const trimmed = query.trim()
  if (!trimmed) return ''

  if (isDirectUrl(trimmed)) {
    return formatDirectUrl(trimmed)
  }

  const encoded = encodeURIComponent(trimmed)

  if (engineId === 'custom') {
    if (customUrlTemplate && customUrlTemplate.includes('%s')) {
      return customUrlTemplate.replace('%s', encoded)
    }
    if (customUrlTemplate) {
      return `${customUrlTemplate}${encoded}`
    }
    return `https://www.google.com/search?q=${encoded}`
  }

  const engine = SEARCH_ENGINES.find((e) => e.id === engineId)
  if (engine && engine.url) {
    return engine.url.replace('%s', encoded)
  }

  return `https://www.google.com/search?q=${encoded}`
}

