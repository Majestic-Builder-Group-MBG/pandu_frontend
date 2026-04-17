import { API_BASE_URL } from '@/config/env'

export class ApiClient {
  constructor({ baseURL = API_BASE_URL, getToken } = {}) {
    this.baseURL = String(baseURL || '').replace(/\/+$/, '')
    this.getToken = typeof getToken === 'function' ? getToken : () => null
  }

  async request(path, { method = 'GET', headers, body } = {}) {
    const url = this.baseURL + path
    const token = this.getToken()

    const mergedHeaders = {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    }

    const res = await fetch(url, {
      method,
      headers: mergedHeaders,
      body: body instanceof FormData ? body : body != null ? JSON.stringify(body) : undefined,
    })

    const ct = res.headers.get('content-type') || ''
    const isJson = ct.includes('application/json')
    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => '')

    if (!res.ok) {
      const msg =
        (payload && typeof payload === 'object' && (payload.message || payload.error)) ||
        (typeof payload === 'string' && payload) ||
        `${res.status} ${res.statusText}`
      const err = new Error(String(msg))
      err.status = res.status
      err.payload = payload
      throw err
    }

    return payload
  }
}
