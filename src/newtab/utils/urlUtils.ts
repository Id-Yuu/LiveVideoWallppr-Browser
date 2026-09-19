/**
 * Normalizes a user-entered URL string by trimming and adding 'https://'
 * if no protocol is specified.
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed) || trimmed.startsWith('about:')) {
    return trimmed
  }
  return `https://${trimmed}`
}

/**
 * Validates whether the given string can be converted into a valid URL.
 */
export function isValidUrl(input: string): boolean {
  try {
    const normalized = normalizeUrl(input)
    const url = new URL(normalized)
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'chrome:' || url.protocol === 'edge:'
  } catch {
    return false
  }
}

/**
 * Extracts the primary hostname from a URL.
 */
export function getDomain(url: string): string {
  try {
    const normalized = normalizeUrl(url)
    const parsed = new URL(normalized)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/**
 * Generates the favicon URL for a given web address using Google's public favicon service.
 */
export function getFaviconUrl(url: string, size: number = 64): string {
  const domain = getDomain(url)
  if (!domain) return ''
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`
}

/**
 * Attempts to guess a clean, human-readable title from a URL or domain.
 * e.g. 'https://github.com/foo' -> 'Github'
 */
export function suggestTitleFromUrl(url: string): string {
  const domain = getDomain(url)
  if (!domain) return ''
  const parts = domain.split('.')
  // For 'youtube.com' -> 'Youtube', for 'sub.example.co.uk' -> 'Example'
  const name = parts.length > 2 && parts[parts.length - 2].length <= 3 && parts[parts.length - 1].length <= 3
    ? parts[parts.length - 3]
    : parts[0]
  if (!name) return domain
  return name.charAt(0).toUpperCase() + name.slice(1)
}

