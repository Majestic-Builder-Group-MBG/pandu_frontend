export class RegisterCodesService {
  constructor(apiClient) {
    this.api = apiClient
  }

  list() {
    return this.api.request('/api/auth/register-codes', { method: 'GET' })
  }

  summary() {
    return this.api.request('/api/auth/register-codes/summary', { method: 'GET' })
  }

  create({ target_role, code_length, max_uses, expires_in_hours } = {}) {
    return this.api.request('/api/auth/register-codes', {
      method: 'POST',
      body: { target_role, code_length, max_uses, expires_in_hours },
    })
  }

  usages(codeId) {
    return this.api.request(`/api/auth/register-codes/${codeId}/usages`, { method: 'GET' })
  }

  revoke(codeId) {
    return this.api.request(`/api/auth/register-codes/${codeId}/revoke`, { method: 'PATCH' })
  }

  archiveExpired() {
    return this.api.request('/api/auth/register-codes/expired/archive', { method: 'PATCH' })
  }

  deleteExpired() {
    return this.api.request('/api/auth/register-codes/expired', { method: 'DELETE' })
  }
}
