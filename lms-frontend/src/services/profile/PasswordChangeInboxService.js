export class PasswordChangeInboxService {
  constructor(apiClient) {
    this.api = apiClient
  }

  inbox({ page = 1, per_page = 20 } = {}) {
    const p = Number(page)
    const pp = Number(per_page)
    const qs = new URLSearchParams({
      page: String(Number.isFinite(p) && p > 0 ? p : 1),
      per_page: String(Number.isFinite(pp) && pp > 0 ? pp : 20),
    })
    return this.api.request(`/api/password-change-requests/inbox?${qs.toString()}`, { method: 'GET' })
  }

  issueOtp(requestId) {
    return this.api.request(`/api/password-change-requests/${requestId}/issue-otp`, { method: 'PATCH' })
  }

  reject(requestId, { reason } = {}) {
    return this.api.request(`/api/password-change-requests/${requestId}/reject`, {
      method: 'PATCH',
      body: { reason: String(reason || '') },
    })
  }
}
