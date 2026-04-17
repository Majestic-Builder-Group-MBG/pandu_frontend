import { API_BASE_URL } from '@/config/env'

export class ApiClient {
  constructor({ baseURL = API_BASE_URL, getToken } = {}) {
    this.baseURL = String(baseURL || '').replace(/\/+$/, '')
    this.getToken = typeof getToken === 'function' ? getToken : () => null
  }

  resolveUrl(pathOrUrl) {
    const input = String(pathOrUrl || '')
    if (/^https?:\/\//i.test(input)) return input
    if (!input.startsWith('/')) return `${this.baseURL}/${input}`
    return `${this.baseURL}${input}`
  }

  async request(path, { method = 'GET', headers, body, responseType = 'json' } = {}) {
    const url = this.resolveUrl(path)
    const token = this.getToken()

    const mergedHeaders = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    }

    // Only set Content-Type when we're actually sending JSON.
    // Avoids unnecessary CORS preflight on simple GET/POST without body.
    if (!(body instanceof FormData) && body != null) {
      mergedHeaders['Content-Type'] = mergedHeaders['Content-Type'] || 'application/json'
    }

    const res = await fetch(url, {
      method,
      headers: mergedHeaders,
      body: body instanceof FormData ? body : body != null ? JSON.stringify(body) : undefined,
    })

    // Error handling with best-effort message parsing
    if (!res.ok) {
      const ct = res.headers.get('content-type') || ''
      const isJson = ct.includes('application/json')
      const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '')
      const msg =
        (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
        (typeof payload === 'string' && payload) ||
        `${res.status} ${res.statusText}`
      const err = new Error(String(msg))
      err.status = res.status
      err.payload = payload
      throw err
    }

    if (responseType === 'blob') return res.blob()
    if (responseType === 'text') return res.text()

    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) return res.json()
    return res.text()
  }
}
