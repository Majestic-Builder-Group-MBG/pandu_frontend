export class ProfileService {
  constructor(apiClient) {
    this.api = apiClient
  }

  async _requestWithFallback(paths, options) {
    const list = Array.isArray(paths) ? paths : [paths]
    let lastErr = null
    for (const p of list) {
      try {
        return await this.api.request(p, options)
      } catch (e) {
        lastErr = e
        // Continue only on "not found" kind errors.
        if (e?.status === 404) continue
        const msg = String(e?.message || '')
        if (msg.includes('Cannot GET') || msg.includes('404')) continue
        throw e
      }
    }
    throw lastErr || new Error('Endpoint not available')
  }

  me() {
    return this._requestWithFallback(['/api/profile/me', '/api/profile'], { method: 'GET' })
  }

  updateMe({ name } = {}) {
    const fd = new FormData()
    if (name != null) fd.append('name', String(name))

    return this._requestWithFallback(['/api/profile/me', '/api/profile'], {
      method: 'PATCH',
      body: fd,
    })
  }

  getMyPhoto() {
    // Contracted endpoint. 404 means user has no photo yet.
    return this.api.request('/api/profile/me/photo', { method: 'GET', responseType: 'blob' })
  }

  updateMyPhoto(photoFile) {
    const fd = new FormData()
    if (photoFile) fd.append('photo', photoFile)

    return this.api.request('/api/profile/me/photo', {
      method: 'PATCH',
      body: fd,
    })
  }

  requestPasswordChange({ new_password } = {}) {
    return this.api.request('/api/profile/password-change/request', {
      method: 'POST',
      body: {
        new_password: String(new_password || ''),
      },
    })
  }

  confirmPasswordChange({ request_id, otp } = {}) {
    return this.api.request('/api/profile/password-change/confirm', {
      method: 'POST',
      body: {
        request_id,
        otp: String(otp || ''),
      },
    })
  }
}
