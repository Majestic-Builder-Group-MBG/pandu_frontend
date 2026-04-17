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

  register({ name, email, password, registration_code }) {
    return this.api.request('/api/auth/register', {
      method: 'POST',
      body: { name, email, password, registration_code },
    })
  }

  logout() {
    return this.api.request('/api/auth/logout', {
      method: 'POST',
    })
  }
}
