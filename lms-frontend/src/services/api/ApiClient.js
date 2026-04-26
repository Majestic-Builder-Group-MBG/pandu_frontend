import { API_BASE_URL } from '@/config/env'

export class ApiClient {
  constructor({ baseURL = API_BASE_URL, getToken } = {}) {
    this.baseURL = String(baseURL || '').replace(/\/+$/, '')
    this.getToken = typeof getToken === 'function' ? getToken : () => null
    this.inflight = new Map()
    this.cache = new Map()
    this.abortControllers = new Map()
  }

  resolveUrl(pathOrUrl) {
    const input = String(pathOrUrl || '')
    if (/^https?:\/\//i.test(input)) return input
    if (!input.startsWith('/')) return `${this.baseURL}/${input}`
    return `${this.baseURL}${input}`
  }

  async request(
    path,
    {
      method = 'GET',
      headers,
      body,
      responseType = 'json',
      signal,
      dedupe = false,
      dedupeKey,
      cancelPrevious = false,
      cacheTTL = 0,
    } = {}
  ) {
    const url = this.resolveUrl(path)
    const token = this.getToken()
    const normalizedMethod = String(method || 'GET').toUpperCase()
    const requestKey = dedupeKey || `${normalizedMethod}:${url}`

    if (normalizedMethod === 'GET' && cacheTTL > 0) {
      const cached = this.cache.get(requestKey)
      if (cached && cached.expiresAt > Date.now()) return cached.data
    }

    if (dedupe && this.inflight.has(requestKey)) {
      return this.inflight.get(requestKey)
    }

    const mergedHeaders = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    }

    // Only set Content-Type when we're actually sending JSON.
    // Avoids unnecessary CORS preflight on simple GET/POST without body.
    if (!(body instanceof FormData) && body != null) {
      mergedHeaders['Content-Type'] = mergedHeaders['Content-Type'] || 'application/json'
    }

    if (cancelPrevious) {
      const prev = this.abortControllers.get(requestKey)
      if (prev) prev.abort()
    }

    const ownController = new AbortController()
    this.abortControllers.set(requestKey, ownController)

    if (signal) {
      if (signal.aborted) ownController.abort()
      else {
        signal.addEventListener(
          'abort',
          () => {
            ownController.abort()
          },
          { once: true }
        )
      }
    }

    const execute = async () => {
      const res = await fetch(url, {
        method: normalizedMethod,
        headers: mergedHeaders,
        body: body instanceof FormData ? body : body != null ? JSON.stringify(body) : undefined,
        signal: ownController.signal,
      })

      // Error handling with best-effort message parsing
      if (!res.ok) {
        if (res.status === 401 && typeof window !== 'undefined') {
          try {
            window.dispatchEvent(new CustomEvent('pandu:unauthorized', { detail: { url, method: normalizedMethod } }))
          } catch {
            // ignore
          }
        }

        const ct = res.headers.get('content-type') || ''
        const isJson = ct.includes('application/json')
        const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '')

        const isProbablyHtml = (val) => {
          if (typeof val !== 'string') return false
          const s = val.trim().slice(0, 300).toLowerCase()
          return s.startsWith('<!doctype html') || s.startsWith('<html') || s.includes('<html')
        }

        const msg =
          (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
          (typeof payload === 'string' && payload && !isProbablyHtml(payload) ? payload : '') ||
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

    const requestPromise = execute()
      .then((data) => {
        if (normalizedMethod === 'GET' && cacheTTL > 0) {
          this.cache.set(requestKey, {
            data,
            expiresAt: Date.now() + cacheTTL,
          })
        }
        return data
      })
      .finally(() => {
        this.inflight.delete(requestKey)
        if (this.abortControllers.get(requestKey) === ownController) {
          this.abortControllers.delete(requestKey)
        }
      })

    if (dedupe) this.inflight.set(requestKey, requestPromise)

    return requestPromise
  }
}
