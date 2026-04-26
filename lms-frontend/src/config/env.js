function normalizeBaseUrl(input) {
  let s = String(input ?? '').trim()
  if (!s) return ''

  // Strip surrounding quotes from .env values.
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim()
  }

  // People often copy docs URLs like "http://host:port/#profile".
  // Hash never belongs in a base URL.
  s = s.split('#')[0].trim()

  // If scheme is missing (eg "192.168.1.12:8001"), assume http.
  if (!/^https?:\/\//i.test(s) && /^[a-z0-9.-]+(?::\d+)?$/i.test(s)) {
    s = `http://${s}`
  }

  try {
    const u = new URL(s)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return ''
    return `${u.protocol}//${u.host}`
  } catch {
    return ''
  }
}

const DEFAULT_API_BASE_URL = 'http://192.168.1.2:8001'

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || DEFAULT_API_BASE_URL
export const VAPID_PUBLIC_KEY = String(import.meta.env.VITE_VAPID_PUBLIC_KEY || '').trim()
