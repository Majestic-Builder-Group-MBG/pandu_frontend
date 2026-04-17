import { API_BASE_URL } from '@/config/env'

export function toAbsoluteUrl(pathOrUrl) {
  const input = String(pathOrUrl || '').trim()
  if (!input) return ''

  if (/^https?:\/\//i.test(input)) return input

  const base = API_BASE_URL.replace(/\/+$/, '')
  const path = input.replace(/^\/+/, '')
  return `${base}/${path}`
}
