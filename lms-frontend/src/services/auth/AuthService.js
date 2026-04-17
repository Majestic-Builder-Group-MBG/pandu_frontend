export class AuthService {
  constructor(apiClient) {
    this.api = apiClient
  }

  login({ email, password }) {
    return this.api.request('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  }
}
